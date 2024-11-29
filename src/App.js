import React, { useState, useEffect, useCallback } from 'react';
import { ToastProvider } from './components/ui/toast';
import { useToast } from './components/ui/use-toast';
import Auth from './components/Auth';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import SearchBar from './components/SearchBar';
import DefectsTable from './components/DefectsTable';
import DefectDialog from './components/DefectDialog';
import ChatBot from './components/ChatBot/ChatBot';
import { supabase } from './supabaseClient';

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
  
  const [isInitializing, setIsInitializing] = useState(true);
  const [session, setSession] = useState(null);
  const [data, setData] = useState([]);
  const [assignedVessels, setAssignedVessels] = useState([]);
  const [vesselNames, setVesselNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  
  const [currentVessel, setCurrentVessel] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [criticalityFilter, setCriticalityFilter] = useState('');
  
  const [isDefectDialogOpen, setIsDefectDialogOpen] = useState(false);
  const [currentDefect, setCurrentDefect] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);

  const fetchUserData = useCallback(async (userId) => {
    try {
      console.log('Fetching data for user:', userId);
      setLoading(true);
      setData([]); // Clear existing data while loading
      
      const userVessels = await getUserVessels(userId);
      console.log('Fetched vessels:', userVessels?.length);
      
      if (!userVessels || userVessels.length === 0) {
        console.warn('No vessels found for user');
        setDataFetched(true);
        return;
      }

      const vesselIds = userVessels.map(v => v.vessel_id);
      const vesselsMap = userVessels.reduce((acc, v) => {
        if (v.vessels) {
          acc[v.vessel_id] = v.vessels.vessel_name;
        }
        return acc;
      }, {});

      setAssignedVessels(vesselIds);
      setVesselNames(vesselsMap);

      const { data: defects, error: defectsError } = await supabase
        .from('defects register')
        .select('*')
        .eq('is_deleted', false)
        .in('vessel_id', vesselIds)
        .order('Date Reported', { ascending: false });

      if (defectsError) throw defectsError;
      console.log('Fetched defects:', defects?.length);

      setData(defects || []);
      setDataFetched(true);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load data. Please refresh the page.",
        variant: "destructive",
      });
      setDataFetched(true);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Session initialization
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsInitializing(true);
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log('Initial session check:', initialSession?.user?.id);
        setSession(initialSession);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event, newSession?.user?.id);
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Data fetching based on session
  useEffect(() => {
    if (session?.user?.id) {
      console.log('Session initialized. Fetching data...');
      fetchUserData(session.user.id);
    } else {
      console.log('No session, clearing data...');
      setData([]);
      setAssignedVessels([]);
      setVesselNames({});
      setDataFetched(true);
    }
  }, [session?.user?.id, fetchUserData]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setData([]);
      setAssignedVessels([]);
      setVesselNames({});
      setDataFetched(false);
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Rest of your code remains the same...
  const filteredData = React.useMemo(() => {
    return data.filter(defect => {
      const defectDate = new Date(defect['Date Reported']);
      const matchesVessel = currentVessel.length === 0 || currentVessel.includes(defect.vessel_id);
      const matchesStatus = !statusFilter || defect['Status (Vessel)'] === statusFilter;
      const matchesCriticality = !criticalityFilter || defect.Criticality === criticalityFilter;
      const matchesSearch = !searchTerm || 
        Object.values(defect).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesDateRange = 
        (!dateRange.from || defectDate >= new Date(dateRange.from)) &&
        (!dateRange.to || defectDate <= new Date(dateRange.to));

      return matchesVessel && matchesStatus && matchesCriticality && matchesSearch && matchesDateRange;
    });
  }, [data, currentVessel, statusFilter, criticalityFilter, searchTerm, dateRange]);

  // Your existing handlers...
  const handleGeneratePdf = useCallback(async () => {
    setIsPdfGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPdfGenerating(false);
    }
  }, [toast]);

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
        "Status (Vessel)": updatedDefect['Status (Vessel)'],
        Equipments: updatedDefect.Equipments,
        Description: updatedDefect.Description,
        "Action Planned": updatedDefect['Action Planned'],
        Criticality: updatedDefect.Criticality,
        "Date Reported": updatedDefect['Date Reported'],
        "Date Completed": updatedDefect['Date Completed'] || null,
        Comments: updatedDefect.Comments || ''
      };

      let result;
      if (isNewDefect) {
        const { data: insertedData, error: insertError } = await supabase
          .from('defects register')
          .insert([defectData])
          .select('*')
          .single();

        if (insertError) throw insertError;
        result = insertedData;
        
        setData(prevData => [result, ...prevData]);
      } else {
        const { data: updatedData, error: updateError } = await supabase
          .from('defects register')
          .update(defectData)
          .eq('id', updatedDefect.id)
          .select('*')
          .single();

        if (updateError) throw updateError;
        result = updatedData;
        
        setData(prevData => {
          const updatedData = prevData.map(d => d.id === result.id ? result : d);
          return [...updatedData].sort((a, b) => 
            new Date(b['Date Reported']) - new Date(a['Date Reported'])
          );
        });
      }

      toast({
        title: isNewDefect ? "Defect Added" : "Defect Updated",
        description: "Successfully saved the defect",
      });

      setIsDefectDialogOpen(false);
      setCurrentDefect(null);

    } catch (error) {
      console.error("Error saving defect:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save defect",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDefect = async (defectId) => {
    try {
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }

      const confirmed = window.confirm("Are you sure you want to delete this defect?");
      if (!confirmed) return;

      setLoading(true);

      const { error } = await supabase
        .from('defects register')
        .update({
          is_deleted: true,
          deleted_by: session.user.id,
          deleted_at: new Date().toISOString()
        })
        .eq('id', defectId);

      if (error) throw error;

      setData(prevData => prevData.filter(d => d.id !== defectId));

      toast({
        title: "Defect Deleted",
        description: "Successfully deleted the defect record",
      });

    } catch (error) {
      console.error("Error deleting defect:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete defect",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSelectedVesselsDisplay = () => {
    if (currentVessel.length === 0) return 'All Vessels';
    if (currentVessel.length === 1) {
      return vesselNames[currentVessel[0]] || 'All Vessels';
    }
    return `${currentVessel.length} Vessels Selected`;
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white">Initializing...</div>
      </div>
    );
  }

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
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
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
              
              {!dataFetched ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-white">Loading data...</div>
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-white">Loading defects...</div>
                </div>
              ) : (
                <DefectsTable
                  data={filteredData}
                  onAddDefect={handleAddDefect}
                  onEditDefect={(defect) => {
                    setCurrentDefect(defect);
                    setIsDefectDialogOpen(true);
                  }}
                  onDeleteDefect={handleDeleteDefect}
                  loading={loading}
                />
              )}

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

              <ChatBot 
                data={filteredData}
                vesselName={getSelectedVesselsDisplay()}
                filters={{
                  status: statusFilter,
                  criticality: criticalityFilter,
                  search: searchTerm
                }}
                isPdfGenerating={isPdfGenerating}
                onGeneratePdf={handleGeneratePdf}
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
