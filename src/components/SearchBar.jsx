// src/components/SearchBar.jsx
import React from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const SearchBar = ({ onSearch, onFilterStatus, onFilterCriticality, status, criticality }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 px-4 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex-1">
        <Input
          placeholder="Search defects..."
          onChange={(e) => onSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <div className="flex flex-row gap-4">
        <Select value={status} onValueChange={onFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={criticality} onValueChange={onFilterCriticality}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Criticality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Criticality</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SearchBar;
