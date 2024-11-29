import React from 'react';
import { format } from "date-fns";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from './ui/dropdown-menu';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";
import { User, LogOut, ChevronDown, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

const Header = ({ 
  user, 
  vessels, 
  currentVessel, 
  onVesselChange, 
  onLogout,
  dateRange,
  onDateRangeChange 
}) => {
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
          
          {/* Vessel Multi-select Dropdown */}
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

          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex items-center space-x-2 bg-background border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 hover:bg-accent/50 h-[34px]",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="h-4 w-4 opacity-50" />
                <span>
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM d, yyyy")
                    )
                  ) : (
                    "Date Range"
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={onDateRangeChange}
                numberOfMonths={2}
              />
              <div className="p-3 border-t border-border">
                <Button
                  variant="outline"
                  className="w-full text-xs"
                  onClick={() => onDateRangeChange({ from: '', to: '' })}
                >
                  Reset Date Range
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* User Menu */}
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
