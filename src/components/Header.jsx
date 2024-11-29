import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from './ui/dropdown-menu';
import { User, LogOut, ChevronDown, Calendar, X } from 'lucide-react';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const Header = ({ user, vessels, currentVessel, onVesselChange, onLogout, dateRange, onDateRangeChange }) => {
  const selectedVessels = Array.isArray(currentVessel) 
    ? currentVessel 
    : currentVessel ? [currentVessel] : [];

  const handleVesselToggle = (vesselId) => {
    if (vesselId === '') {
      onVesselChange([]);
      return;
    }

    const updatedSelection = selectedVessels.includes(vesselId)
      ? selectedVessels.filter(id => id !== vesselId)
      : [...selectedVessels, vesselId];
    
    onVesselChange(updatedSelection);
  };

  const getVesselDisplayText = () => {
    if (selectedVessels.length === 0) return 'All Vessels';
    if (selectedVessels.length === 1) {
      const vesselName = vessels.find(([id]) => id === selectedVessels[0])?.[1];
      return vesselName || 'All Vessels';
    }
    return `${selectedVessels.length} Vessels Selected`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-background border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Defects Manager</h1>
          
          {vessels.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2 bg-background border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 hover:bg-accent/50">
                <span>{getVesselDisplayText()}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Select Vessels
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                  <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent">
                    <label className="flex flex-1 items-center">
                      <input
                        type="checkbox"
                        className="mr-2 h-4 w-4 rounded border-gray-300"
                        checked={selectedVessels.length === 0}
                        onChange={() => handleVesselToggle('')}
                      />
                      All Vessels
                    </label>
                  </div>
                  {vessels.map(([id, name]) => (
                    <div 
                      key={id}
                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent"
                    >
                      <label className="flex flex-1 items-center">
                        <input
                          type="checkbox"
                          className="mr-2 h-4 w-4 rounded border-gray-300"
                          checked={selectedVessels.includes(id)}
                          onChange={() => handleVesselToggle(id)}
                        />
                        {name}
                      </label>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Enhanced Date Range Filter */}
          <div className="flex items-center bg-[#132337] rounded-md border border-[#3BADE5]/20 px-3">
            <Calendar className="h-4 w-4 text-[#3BADE5] mr-2" />
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="date"
                  className="h-8 w-32 px-2 text-xs bg-transparent focus:outline-none text-white"
                  value={dateRange.from || ''}
                  onChange={(e) => onDateRangeChange({ ...dateRange, from: e.target.value })}
                />
                <div className="absolute top-0 left-0 h-full w-full flex items-center px-2 pointer-events-none">
                  <span className="text-xs text-white/80">
                    {dateRange.from ? formatDate(dateRange.from) : 'Start Date'}
                  </span>
                </div>
              </div>
              <span className="text-xs text-white/60">to</span>
              <div className="relative">
                <input
                  type="date"
                  className="h-8 w-32 px-2 text-xs bg-transparent focus:outline-none text-white"
                  value={dateRange.to || ''}
                  onChange={(e) => onDateRangeChange({ ...dateRange, to: e.target.value })}
                  min={dateRange.from}
                />
                <div className="absolute top-0 left-0 h-full w-full flex items-center px-2 pointer-events-none">
                  <span className="text-xs text-white/80">
                    {dateRange.to ? formatDate(dateRange.to) : 'End Date'}
                  </span>
                </div>
              </div>
              {(dateRange.from || dateRange.to) && (
                <button
                  onClick={() => onDateRangeChange({ from: '', to: '' })}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                  title="Clear dates"
                >
                  <X className="h-4 w-4 text-white/60" />
                </button>
              )}
            </div>
          </div>
        </div>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2 hover:bg-accent rounded-full p-2">
              <User className="h-5 w-5" />
              <span className="text-sm font-medium">{user.email}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onLogout} className="text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;
