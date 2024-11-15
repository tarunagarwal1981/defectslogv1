// src/components/Header.jsx
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { User, LogOut } from 'lucide-react';

const Header = ({ user, vessels, currentVessel, onVesselChange, onLogout }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-background border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Defects Manager</h1>
          
          {/* Vessel Selector */}
          {vessels.length > 0 && (
            <select
              value={currentVessel}
              onChange={(e) => onVesselChange(e.target.value)}
              className="bg-background border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2"
            >
              <option value="">All Vessels</option>
              {vessels.map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          )}
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
