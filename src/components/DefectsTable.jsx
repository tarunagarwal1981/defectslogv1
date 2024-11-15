// src/components/DefectsTable.jsx (continued)
import React from 'react';
import { AlertCircle, Clock, CheckCircle2, Pencil } from 'lucide-react';

const DefectsTable = ({
  data,
  onAddDefect,
  onEditDefect,
  loading,
}) => {
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64 bg-background/50 rounded-lg">
          <div className="text-muted-foreground">Loading defects...</div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="rounded-md border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-sm font-medium">S.No</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Vessel Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Equipment</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Action Planned</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Criticality</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Date Reported</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Date Completed</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((defect) => (
                <tr 
                  key={defect.id} 
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <td className="px-4 py-3 text-sm">{defect.SNo}</td>
                  <td className="px-4 py-3 text-sm">{defect.vessel_name}</td>
                  <td className="px-4 py-3 text-sm">{defect.Equipments}</td>
                  <td className="px-4 py-3 text-sm max-w-xs">
                    <div className="line-clamp-2">{defect.Description}</div>
                  </td>
                  <td className="px-4 py-3 text-sm max-w-xs">
                    <div className="line-clamp-2">{defect['Action Planned']}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                      ${defect.Criticality === 'High' ? 'bg-red-100 text-red-700' : 
                        defect.Criticality === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-green-100 text-green-700'}`}
                    >
                      {defect.Criticality}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{defect['Date Reported']}</td>
                  <td className="px-4 py-3 text-sm">{defect['Date Completed']}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium
                      ${defect['Status (Vessel)'] === 'Open' ? 'bg-red-100 text-red-700' :
                        defect['Status (Vessel)'] === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'}`}
                    >
                      {getStatusIcon(defect['Status (Vessel)'])}
                      {defect['Status (Vessel)']}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onEditDefect(defect)}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-9 px-3 hover:bg-accent hover:text-accent-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-center py-4">
          <button
            onClick={onAddDefect}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4"
          >
            Add Defect
          </button>
        </div>
      </div>
    </div>
  );
};

export default DefectsTable;
