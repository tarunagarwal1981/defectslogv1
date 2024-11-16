import React from 'react';
import { PlusCircle } from 'lucide-react';

const DefectsTable = ({ data, onAddDefect, onEditDefect, loading }) => {
  return (
    <div className="glass-card rounded-[4px]">
      <div className="flex justify-between items-center p-4 border-b border-white/10">
        <h2 className="text-base font-semibold text-[#f4f4f4]">Defects Register</h2>
        <button 
          onClick={onAddDefect} 
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-[4px] text-white bg-[#3BADE5] hover:bg-[#3BADE5]/80 transition-colors"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Defect
        </button>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-4 text-left font-medium text-[#f4f4f4] opacity-80">ID</th>
              <th className="p-4 text-left font-medium text-[#f4f4f4] opacity-80">Status</th>
              <th className="p-4 text-left font-medium text-[#f4f4f4] opacity-80">Criticality</th>
              <th className="p-4 text-left font-medium text-[#f4f4f4] opacity-80">Equipment</th>
              <th className="p-4 text-left font-medium text-[#f4f4f4] opacity-80">Description</th>
              <th className="p-4 text-left font-medium text-[#f4f4f4] opacity-80">Reported</th>
              <th className="p-4 text-left font-medium text-[#f4f4f4] opacity-80">Completed</th>
            </tr>
          </thead>
          <tbody className="text-[#f4f4f4]">
            {loading ? (
              <tr>
                <td colSpan="7" className="p-4 text-center">Loading...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center">No defects found</td>
              </tr>
            ) : (
              data.map((defect) => (
                <tr
                  key={defect.id}
                  onClick={() => onEditDefect(defect)}
                  className="table-hover-row cursor-pointer border-b border-white/10"
                >
                  <td className="p-4">{defect.SNo}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      defect['Status (Vessel)'] === 'Open' 
                        ? 'bg-red-500/20 text-red-300' 
                        : 'bg-green-500/20 text-green-300'
                    }`}>
                      {defect['Status (Vessel)']}
                    </span>
                  </td>
                  <td className="p-4">{defect.Criticality}</td>
                  <td className="p-4 truncate max-w-[200px]">{defect.Equipments}</td>
                  <td className="p-4 truncate max-w-[300px]">{defect.Description}</td>
                  <td className="p-4">{new Date(defect['Date Reported']).toLocaleDateString()}</td>
                  <td className="p-4">{defect['Date Completed'] ? new Date(defect['Date Completed']).toLocaleDateString() : '-'}</td>
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
