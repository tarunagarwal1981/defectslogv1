import React from 'react';
import { Button } from "./ui/button"; 
import { PlusCircle } from 'lucide-react';

const DefectsTable = ({ data, onAddDefect, onEditDefect, loading }) => {
  return (
    <div className="rounded-md border">
      <div className="flex justify-between items-center p-2 border-b">
        <h2 className="text-lg font-semibold">Defects Register</h2>
        <Button onClick={onAddDefect} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Defect
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted sticky top-0">
            <tr>
              <th className="p-2 text-left w-16">ID</th>
              <th className="p-2 text-left w-32">Status</th>
              <th className="p-2 text-left w-32">Criticality</th>
              <th className="p-2 text-left">Equipment</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left w-24">Reported</th>
              <th className="p-2 text-left w-24">Completed</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-2 text-center">Loading...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-2 text-center">No defects found</td>
              </tr>
            ) : (
              data.map((defect) => (
                <tr
                  key={defect.id}
                  onClick={() => onEditDefect(defect)}
                  className="hover:bg-muted/50 cursor-pointer border-b"
                >
                  <td className="p-2">{defect.SNo}</td>
                  <td className="p-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      defect['Status (Vessel)'] === 'Open' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {defect['Status (Vessel)']}
                    </span>
                  </td>
                  <td className="p-2">{defect.Criticality}</td>
                  <td className="p-2 truncate max-w-[200px]">{defect.Equipments}</td>
                  <td className="p-2 truncate max-w-[300px]">{defect.Description}</td>
                  <td className="p-2">{new Date(defect['Date Reported']).toLocaleDateString()}</td>
                  <td className="p-2">{defect['Date Completed'] ? new Date(defect['Date Completed']).toLocaleDateString() : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DefectsTable;
