import React from 'react';
import { PlusCircle, FileText, CheckCircle2, CircleDot, Download } from 'lucide-react';

const STATUS_STYLES = {
  'OPEN': {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    text: 'text-red-400',
    icon: <CircleDot className="h-3 w-3" />
  },
  'CLOSED': {
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    text: 'text-green-400',
    icon: <CheckCircle2 className="h-3 w-3" />
  },
  'IN PROGRESS': {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    text: 'text-yellow-400',
    icon: <CircleDot className="h-3 w-3" />
  }
};

const CRITICALITY_STYLES = {
  'High': {
    border: 'border-red-500/30',
    text: 'text-red-400',
  },
  'Medium': {
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
  },
  'Low': {
    border: 'border-blue-500/30',
    text: 'text-blue-400',
  }
};

const DefectsTable = ({ 
  data, 
  onAddDefect, 
  onEditDefect, 
  loading,
  searchTerm = '',
  statusFilter = '',
  criticalityFilter = '',
  onExport 
}) => {
  return (
    <div className="rounded-lg border border-white/10 bg-[#132337]/30 backdrop-blur-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Defects Register</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onExport}
              className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md
              text-white/80 border border-white/10 hover:bg-white/5 transition-colors"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Export
            </button>
            <button 
              onClick={onAddDefect}
              className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md
              text-white bg-[#3BADE5] hover:bg-[#3BADE5]/90 transition-colors"
            >
              <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
              Add Defect
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="whitespace-nowrap py-3 px-4 text-left">
                <span className="text-xs font-medium text-white/70">#</span>
              </th>
              <th className="whitespace-nowrap py-3 px-4 text-left">
                <span className="text-xs font-medium text-white/70">Status</span>
              </th>
              <th className="whitespace-nowrap py-3 px-4 text-left">
                <span className="text-xs font-medium text-white/70">Criticality</span>
              </th>
              <th className="whitespace-nowrap py-3 px-4 text-left">
                <span className="text-xs font-medium text-white/70">Equipment</span>
              </th>
              <th className="whitespace-nowrap py-3 px-4 text-left">
                <span className="text-xs font-medium text-white/70">Description</span>
              </th>
              <th className="whitespace-nowrap py-3 px-4 text-left">
                <span className="text-xs font-medium text-white/70">Date Reported</span>
              </th>
              <th className="whitespace-nowrap py-3 px-4 text-left">
                <span className="text-xs font-medium text-white/70">Date Completed</span>
              </th>
              <th className="whitespace-nowrap py-3 px-4 text-left">
                <span className="text-xs font-medium text-white/70">Files</span>
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-white/10">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-4 py-3 text-center text-sm text-white/70">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-3 text-center text-sm text-white/70">
                  No defects found
                </td>
              </tr>
            ) : (
              data.map((defect, index) => (
                <tr 
                  key={defect.id}
                  onClick={() => onEditDefect(defect)}
                  className="group hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <td className="whitespace-nowrap px-4 py-2.5">
                    <span className="text-xs text-white/70">{index + 1}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    <div className={`
                      inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs
                      ${STATUS_STYLES[defect['Status (Vessel)']].bg}
                      ${STATUS_STYLES[defect['Status (Vessel)']].border}
                      ${STATUS_STYLES[defect['Status (Vessel)']].text}
                      border
                    `}>
                      {STATUS_STYLES[defect['Status (Vessel)']].icon}
                      {defect['Status (Vessel)']}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    {defect.Criticality && (
                      <span className={`
                        px-2 py-0.5 rounded-full text-xs border
                        ${CRITICALITY_STYLES[defect.Criticality].border}
                        ${CRITICALITY_STYLES[defect.Criticality].text}
                      `}>
                        {defect.Criticality}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 max-w-[200px]">
                    <div className="text-xs text-white truncate" title={defect.Equipments}>
                      {defect.Equipments}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 max-w-[300px]">
                    <div className="text-xs text-white truncate" title={defect.Description}>
                      {defect.Description}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    <span className="text-xs text-white/70">
                      {defect['Date Reported'] ? new Date(defect['Date Reported']).toLocaleDateString() : '-'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    <span className="text-xs text-white/70">
                      {defect['Date Completed'] ? new Date(defect['Date Completed']).toLocaleDateString() : '-'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    {defect.files && (
                      <FileText className="h-4 w-4 text-white/40 group-hover:text-white/60" />
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
