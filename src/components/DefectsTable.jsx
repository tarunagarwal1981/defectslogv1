import React from 'react';
import { PlusCircle, FileText } from 'lucide-react';
import ExportButton from './ui/ExportButton';
import { exportToCSV } from '../utils/exportToCSV';

const STATUS_COLORS = {
  'OPEN': {
    bg: 'bg-red-500/20',
    text: 'text-red-300',
    glow: 'shadow-[0_0_10px_rgba(255,77,79,0.3)]'
  },
  'CLOSED': {
    bg: 'bg-green-500/20',
    text: 'text-green-300',
    glow: 'shadow-[0_0_10px_rgba(82,196,26,0.3)]'
  },
  'IN PROGRESS': {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-300',
    glow: 'shadow-[0_0_10px_rgba(250,173,20,0.3)]'
  }
};

const CRITICALITY_COLORS = {
  'High': {
    bg: 'bg-red-500/20',
    text: 'text-red-300'
  },
  'Medium': {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-300'
  },
  'Low': {
    bg: 'bg-blue-500/20',
    text: 'text-blue-300'
  }
};

const DefectsTable = ({ 
  data, 
  onAddDefect, 
  onEditDefect, 
  loading,
  searchTerm = '',
  statusFilter = '',
  criticalityFilter = '' 
}) => {
  const handleExport = () => {
    exportToCSV(data, {
      search: searchTerm,
      status: statusFilter,
      criticality: criticalityFilter
    });
  };

  return (
    <div className="glass-card rounded-[4px]">
      <div className="flex justify-between items-center px-3 py-2 border-b border-white/10">
        <h2 className="text-sm font-medium text-[#f4f4f4]">Defects Register</h2>
        <div className="flex items-center gap-2">
          <ExportButton onClick={handleExport} />
          <button 
            onClick={onAddDefect} 
            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-[4px] 
            text-white bg-[#3BADE5] hover:bg-[#3BADE5]/80 transition-colors"
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
            Add Defect
          </button>
        </div>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#132337] border-b border-white/10">
              <th className="px-3 py-2 text-left font-semibold text-[#f4f4f4] opacity-90 w-12">#</th>
              <th className="px-3 py-2 text-left font-semibold text-[#f4f4f4] opacity-90 w-28">Vessel</th>
              <th className="px-3 py-2 text-left font-semibold text-[#f4f4f4] opacity-90 w-24">Status</th>
              <th className="px-3 py-2 text-left font-semibold text-[#f4f4f4] opacity-90 w-24">Criticality</th>
              <th className="px-3 py-2 text-left font-semibold text-[#f4f4f4] opacity-90 w-32">Equipment</th>
              <th className="px-3 py-2 text-left font-semibold text-[#f4f4f4] opacity-90">Description</th>
              <th className="px-3 py-2 text-left font-semibold text-[#f4f4f4] opacity-90">Action Planned</th>
              <th className="px-3 py-2 text-left font-semibold text-[#f4f4f4] opacity-90 w-36">Comments</th>
              <th className="px-3 py-2 text-left font-semibold text-[#f4f4f4] opacity-90 w-24">Reported</th>
              <th className="px-3 py-2 text-left font-semibold text-[#f4f4f4] opacity-90 w-24">Completed</th>
              <th className="px-3 py-2 text-left font-semibold text-[#f4f4f4] opacity-90 w-12">Files</th>
            </tr>
          </thead>
          <tbody className="text-[#f4f4f4]">
            {loading ? (
              <tr>
                <td colSpan="11" className="px-3 py-2 text-center">Loading...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="11" className="px-3 py-2 text-center">No defects found</td>
              </tr>
            ) : (
              data.map((defect, index) => (
                <tr
                  key={defect.id}
                  onClick={() => onEditDefect(defect)}
                  className="table-hover-row cursor-pointer border-b border-white/10 hover:bg-white/5"
                >
                  <td className="px-3 py-1.5">{index + 1}</td>
                  <td className="px-3 py-1.5">{defect.vessel_name}</td>
                  <td className="px-3 py-1.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] 
                      ${STATUS_COLORS[defect['Status (Vessel)']].bg} 
                      ${STATUS_COLORS[defect['Status (Vessel)']].text}
                      ${STATUS_COLORS[defect['Status (Vessel)']].glow}
                      transition-all duration-200`}
                    >
                      <span className="w-1 h-1 rounded-full bg-current mr-1"></span>
                      {defect['Status (Vessel)']}
                    </span>
                  </td>
                  <td className="px-3 py-1.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] 
                      ${CRITICALITY_COLORS[defect.Criticality]?.bg || 'bg-gray-500/20'} 
                      ${CRITICALITY_COLORS[defect.Criticality]?.text || 'text-gray-300'}`}
                    >
                      {defect.Criticality || 'N/A'}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 truncate max-w-[150px]" title={defect.Equipments}>
                    {defect.Equipments}
                  </td>
                  <td className="px-3 py-1.5 truncate max-w-[200px]" title={defect.Description}>
                    {defect.Description}
                  </td>
                  <td className="px-3 py-1.5 truncate max-w-[200px]" title={defect['Action Planned']}>
                    {defect['Action Planned']}
                  </td>
                  <td className="px-3 py-1.5 truncate max-w-[150px]" title={defect.Comments}>
                    {defect.Comments || '-'}
                  </td>
                  <td className="px-3 py-1.5">
                    {defect['Date Reported'] ? new Date(defect['Date Reported']).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-3 py-1.5">
                    {defect['Date Completed'] ? new Date(defect['Date Completed']).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-3 py-1.5">
                    {defect.associated_files?.length > 0 && (
                      <span className="inline-flex items-center">
                        <FileText className="h-3.5 w-3.5 text-[#3BADE5] hover:text-[#3BADE5]/80" />
                      </span>
                    )}
                  </td>
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
