function App() {
  const { toast } = useToast();

  const [isInitializing, setIsInitializing] = useState(true);
  const [session, setSession] = useState(null);
  const [data, setData] = useState([]);
  const [assignedVessels, setAssignedVessels] = useState([]);
  const [vesselNames, setVesselNames] = useState({});
  const [loading, setLoading] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const [currentVessel, setCurrentVessel] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [criticalityFilter, setCriticalityFilter] = useState('');
  const [dataFetched, setDataFetched] = useState(false);
  const [isDefectDialogOpen, setIsDefectDialogOpen] = useState(false);
  const [currentDefect, setCurrentDefect] = useState(null);

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

      const vesselIds = userVessels.map((v) => v.vessel_id);
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
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data. Please refresh the page.',
        variant: 'destructive',
      });
      setDataFetched(true);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const initializeAuth = async () => {
    try {
      setIsInitializing(true);
      let attempts = 0;
      let sessionData = null;

      while (attempts < 5) {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession?.user?.id) {
          sessionData = currentSession;
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms
        attempts++;
      }

      setSession(sessionData);
      console.log('Final session after retries:', sessionData?.user?.id);
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event, newSession?.user?.id);
      if (event === 'SIGNED_IN') {
        setSession(newSession);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setData([]);
        setAssignedVessels([]);
        setVesselNames({});
        setDataFetched(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      console.log('Session initialized. Fetching data...');
      fetchUserData(session.user.id);
    }
  }, [session?.user?.id, fetchUserData]);

  const handleAddDefect = () => {
    if (assignedVessels.length === 0) {
      toast({
        title: 'Error',
        description: 'No vessels assigned to you. Contact administrator.',
        variant: 'destructive',
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

  const filteredData = React.useMemo(() => {
    return data.filter((defect) => {
      const defectDate = new Date(defect['Date Reported']);
      const matchesVessel = currentVessel.length === 0 || currentVessel.includes(defect.vessel_id);
      const matchesStatus = !statusFilter || defect['Status (Vessel)'] === statusFilter;
      const matchesCriticality = !criticalityFilter || defect.Criticality === criticalityFilter;
      const matchesSearch =
        !searchTerm ||
        Object.values(defect).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesDateRange =
        (!dateRange.from || defectDate >= new Date(dateRange.from)) &&
        (!dateRange.to || defectDate <= new Date(dateRange.to));

      return matchesVessel && matchesStatus && matchesCriticality && matchesSearch && matchesDateRange;
    });
  }, [data, currentVessel, statusFilter, criticalityFilter, searchTerm, dateRange]);

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
              onLogout={async () => {
                await supabase.auth.signOut();
                setSession(null);
              }}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />

            <main className="container mx-auto pt-20">
              <StatsCards data={filteredData} />

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
                />
              )}
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
