// In Header.jsx
import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from './ui/dropdown-menu';
import { User, LogOut, ChevronDown } from 'lucide-react';

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

          {/* Simple Date Range Filter */}
          <div className="flex items-center space-x-2">
            <input
              type="date"
              className="h-8 px-2 text-xs bg-background border rounded-md focus:outline-none focus:ring-2"
              value={dateRange.from || ''}
              onChange={(e) => onDateRangeChange({ ...dateRange, from: e.target.value })}
            />
            <span className="text-xs">to</span>
            <input
              type="date"
              className="h-8 px-2 text-xs bg-background border rounded-md focus:outline-none focus:ring-2"
              value={dateRange.to || ''}
              onChange={(e) => onDateRangeChange({ ...dateRange, to: e.target.value })}
            />
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
