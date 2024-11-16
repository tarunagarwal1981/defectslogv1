import React, { useState, useEffect, useCallback } from 'react';
import { ToastProvider } from './components/ui/toast';
import { useToast } from './components/ui/use-toast';
import Auth from './components/Auth';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import SearchBar from './components/SearchBar';
import DefectsTable from './components/DefectsTable';
import DefectDialog from './components/DefectDialog';
import { supabase } from './supabaseClient';

// Utility function for fetching user's vessels
const getUserVessels = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_vessels')
      .select(`
        vessel_id,
        vessels!inner (
          vessel_id,
          vessel_name
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user vessels:', error);
    throw error;
  }
};

function App() {
  const { toast } = useToast();
  
  // User and auth states
  const [session, setSession] = useState(null);
  
  // Data states
  const [data, setData] = useState([]);
  const [assignedVessels, setAssignedVessels] = useState([]);
  const [vesselNames, setVesselNames] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [currentVessel, setCurrentVessel] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [criticalityFilter, setCriticalityFilter] = useState('');
  
  // Dialog states
  const [isDefectDialogOpen, setIsDefectDialogOpen] = useState(false);
  const [currentDefect, setCurrentDefect] = useState(null);

  // Initialize auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      
      // Get user's vessels with names
      const userVessels = await getUserVessels(session.user.id);
      
      // Extract vessel IDs and names
      const vesselIds = userVessels.map(v => v.vessel_id);
      const vesselsMap = userVessels.reduce((acc, v) => {
        if (v.vessels) {
          acc[v.vessel_id] = v.vessels.vessel_name;
        }
        return acc;
      }, {});

      // Fetch defects for assigned vessels
      const { data: defects, error: defectsError } = await supabase
        .from('defects register')
        .select('*')
        .in('vessel_id', vesselIds);

      if (defectsError) throw defectsError;

      setAssignedVessels(vesselIds);
      setVesselNames(vesselsMap);
      setData(defects || []);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, toast]);

  useEffect(() => {
    if (session?.user) {
      fetchUserData();
    } else {
      setData([]);
      setAssignedVessels([]);
      setVesselNames({});
    }
  }, [session?.user, fetchUserData]);

  // Filter data
  const filteredData = React.useMemo(() => {
    return data.filter(defect => {
      const matchesVessel = !currentVessel || defect.vessel_id === currentVessel;
      const matchesStatus = !statusFilter || defect['Status (Vessel)'] === statusFilter;
      const matchesCriticality = !criticalityFilter || defect.Criticality === criticalityFilter;
      const matchesSearch = !searchTerm || 
        Object.values(defect).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );

      return matchesVessel && matchesStatus && matchesCriticality && matchesSearch;
    });
  }, [data, currentVessel, statusFilter, criticalityFilter, searchTerm]);

  // Handlers
  const handleAddDefect = () => {
    if (assignedVessels.length === 0) {
      toast({
        title: "Error",
        description: "No vessels assigned to you. Contact administrator.",
        variant: "destructive",
      });
      return;
    }

    setCurrentDefect({
      id: `temp-${Date.now()}`,
      SNo: data.length + 1,
      vessel_id: '',
      Equipments: '',
      Description: '',
      'Action Planned': '',
      Criticality: '',
      'Status (Vessel)': 'OPEN',
      'Date Reported': new Date().toISOString().split('T')[0],
      'Date Completed': '',
    });
    setIsDefectDialogOpen(true);
  };

  const handleSaveDefect = async (updatedDefect) => {
    try {
      if (!assignedVessels.includes(updatedDefect.vessel_id)) {
        throw new Error("Not authorized for this vessel");
      }

      const isNewDefect = updatedDefect.id?.startsWith('temp-');
      const defectData = {
        vessel_id: updatedDefect.vessel_id,
        vessel_name: vesselNames[updatedDefect.vessel_id],
        Equipments: updatedDefect.Equipments,
        Description: updatedDefect.Description,
        'Action Planned': updatedDefect['Action Planned'],
        Criticality: updatedDefect.Criticality,
        'Status (Vessel)': updatedDefect['Status (Vessel)'],
        'Date Reported': updatedDefect['Date Reported'],
        'Date Completed': updatedDefect['Date Completed'],
      };

      if (!isNewDefect) {
        const { error } = await supabase
          .from('defects register')
          .update(defectData)
          .eq('id', updatedDefect.id);

        if (error) throw error;

        setData(prevData =>
          prevData.map(d => d.id === updatedDefect.id ? { ...d, ...defectData } : d)
        );

        toast({
          title: "Success",
          description: "Defect updated successfully",
        });
      } else {
        const { data: newDefect, error } = await supabase
          .from('defects register')
          .insert(defectData)
          .select()
          .single();

        if (error) throw error;

        setData(prevData => [...prevData, { ...newDefect }]);

        toast({
          title: "Success",
          description: "New defect added successfully",
        });
      }

      setIsDefectDialogOpen(false);
      setCurrentDefect(null);
    } catch (error) {
      console.error("Error saving defect:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background">
        {session ? (
          <>
            <Header 
              user={session.user}
              vessels={Object.entries(vesselNames)}
              currentVessel={currentVessel}
              onVesselChange={setCurrentVessel}
              onLogout={handleLogout}
            />
            
            <main className="container mx-auto pt-20">
              <StatsCards data={filteredData} />
              
              <SearchBar 
                onSearch={setSearchTerm}
                onFilterStatus={setStatusFilter}
                onFilterCriticality={setCriticalityFilter}
                status={statusFilter}
                criticality={criticalityFilter}
              />
              
              <DefectsTable
                data={filteredData}
                onAddDefect={handleAddDefect}
                onEditDefect={(defect) => {
                  setCurrentDefect(defect);
                  setIsDefectDialogOpen(true);
                }}
                loading={loading}
              />

              <DefectDialog
                isOpen={isDefectDialogOpen}
                onClose={() => {
                  setIsDefectDialogOpen(false);
                  setCurrentDefect(null);
                }}
                defect={currentDefect}
                onChange={(field, value) => 
                  setCurrentDefect(prev => ({ ...prev, [field]: value }))
                }
                onSave={handleSaveDefect}
                vessels={vesselNames}
                isNew={currentDefect?.id?.startsWith('temp-')}
              />
            </main>
          </>
        ) : (
          <Auth onLogin={setSession} />
        )}
      </div>
    </ToastProvider>
  );
}

export default App;
