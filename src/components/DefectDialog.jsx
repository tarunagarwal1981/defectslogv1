import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Upload } from 'lucide-react';

const DefectDialog = ({ 
  isOpen, 
  onClose, 
  defect, 
  onChange, 
  onSave, 
  vessels, 
  isNew 
}) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    onChange('associated_files', selectedFiles);
  };

  const handleSave = () => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    onSave({ ...defect, files: formData });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-medium">
            {isNew ? 'Add New Defect' : 'Edit Defect'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-3">
          {/* Vessel Selection */}
          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-[#f4f4f4]/80">Vessel</label>
            <select
              className="flex h-8 w-full rounded-[4px] border border-white/10 bg-[#132337]/50 px-2 text-xs text-[#f4f4f4] focus:outline-none focus:ring-1 focus:ring-[#3BADE5]"
              value={defect?.vessel_id || ''}
              onChange={(e) => onChange('vessel_id', e.target.value)}
              required
            >
              <option value="">Select Vessel</option>
              {Object.entries(vessels).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>

          {/* Equipment Dropdown */}
          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-[#f4f4f4]/80">Equipment</label>
            <select
              className="flex h-8 w-full rounded-[4px] border border-white/10 bg-[#132337]/50 px-2 text-xs text-[#f4f4f4] focus:outline-none focus:ring-1 focus:ring-[#3BADE5]"
              value={defect?.Equipments || ''}
              onChange={(e) => onChange('Equipments', e.target.value)}
              required
            >
              <option value="">Select Equipment</option>
              <option value="Air System and Air Compressor">Air System and Air Compressor</option>
              <option value="Airconditioning & Refrigeration System">Airconditioning & Refrigeration System</option>
              <option value="Cargo and Ballast System">Cargo and Ballast System</option>
              <option value="Deck Crane and Grab">Deck Crane and Grab</option>
              <option value="BWTS">BWTS</option>
              <option value="Aux Engine">Aux Engine</option>
              <option value="Main Engine">Main Engine</option>
              <option value="LO System">LO System</option>
              <option value="FO System">FO System</option>
              <option value="FW and SW System">FW and SW System</option>
              <option value="Load line Item">Load line Item</option>
              <option value="SOLAS">SOLAS</option>
              <option value="MARPOL">MARPOL</option>
              <option value="Navigation and Radio Equipment">Navigation and Radio Equipment</option>
              <option value="Anchor and Mooring">Anchor and Mooring</option>
              <option value="Steam System">Steam System</option>
              <option value="Steering Gear and Rudder">Steering Gear and Rudder</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Rest of the component remains the same */}
          {/* Description */}
          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-[#f4f4f4]/80">Description</label>
            <textarea
              className="flex h-16 w-full rounded-[4px] border border-white/10 bg-[#132337]/50 px-2 py-1.5 text-xs text-[#f4f4f4] focus:outline-none focus:ring-1 focus:ring-[#3BADE5]"
              value={defect?.Description || ''}
              onChange={(e) => onChange('Description', e.target.value)}
              placeholder="Enter defect description"
              required
            />
          </div>

          {/* Action Planned */}
          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-[#f4f4f4]/80">Action Planned</label>
            <textarea
              className="flex h-16 w-full rounded-[4px] border border-white/10 bg-[#132337]/50 px-2 py-1.5 text-xs text-[#f4f4f4] focus:outline-none focus:ring-1 focus:ring-[#3BADE5]"
              value={defect?.['Action Planned'] || ''}
              onChange={(e) => onChange('Action Planned', e.target.value)}
              placeholder="Enter planned action"
              required
            />
          </div>

          {/* Status */}
          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-[#f4f4f4]/80">Status</label>
            <select
              className="flex h-8 w-full rounded-[4px] border border-white/10 bg-[#132337]/50 px-2 text-xs text-[#f4f4f4] focus:outline-none focus:ring-1 focus:ring-[#3BADE5]"
              value={defect?.['Status (Vessel)'] || ''}
              onChange={(e) => onChange('Status (Vessel)', e.target.value)}
              required
            >
              <option value="">Select Status</option>
              <option value="OPEN">Open</option>
              <option value="IN PROGRESS">In Progress</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          {/* Criticality */}
          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-[#f4f4f4]/80">Criticality</label>
            <select
              className="flex h-8 w-full rounded-[4px] border border-white/10 bg-[#132337]/50 px-2 text-xs text-[#f4f4f4] focus:outline-none focus:ring-1 focus:ring-[#3BADE5]"
              value={defect?.Criticality || ''}
              onChange={(e) => onChange('Criticality', e.target.value)}
              required
            >
              <option value="">Select Criticality</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <label className="text-xs font-medium text-[#f4f4f4]/80">Date Reported</label>
              <input
                type="date"
                className="flex h-8 w-full rounded-[4px] border border-white/10 bg-[#132337]/50 px-2 text-xs text-[#f4f4f4] focus:outline-none focus:ring-1 focus:ring-[#3BADE5]"
                value={defect?.['Date Reported'] || ''}
                onChange={(e) => onChange('Date Reported', e.target.value)}
                required
              />
            </div>
            <div className="grid gap-1.5">
              <label className="text-xs font-medium text-[#f4f4f4]/80">Date Completed</label>
              <input
                type="date"
                className="flex h-8 w-full rounded-[4px] border border-white/10 bg-[#132337]/50 px-2 text-xs text-[#f4f4f4] focus:outline-none focus:ring-1 focus:ring-[#3BADE5]"
                value={defect?.['Date Completed'] || ''}
                onChange={(e) => onChange('Date Completed', e.target.value)}
              />
            </div>
          </div>

          {/* Associated Files */}
          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-[#f4f4f4]/80">Associated Files</label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-[4px] border border-white/10 bg-[#132337]/50 cursor-pointer hover:bg-white/5">
                <Upload className="h-4 w-4" />
                <span className="text-xs text-[#f4f4f4]">Upload Files</span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </label>
              {files.length > 0 && (
                <span className="text-xs text-[#f4f4f4]/60">
                  {files.length} file(s) selected
                </span>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-[#f4f4f4]/80">Comments</label>
            <textarea
              className="flex h-16 w-full rounded-[4px] border border-white/10 bg-[#132337]/50 px-2 py-1.5 text-xs text-[#f4f4f4] focus:outline-none focus:ring-1 focus:ring-[#3BADE5]"
              value={defect?.Comments || ''}
              onChange={(e) => onChange('Comments', e.target.value)}
              placeholder="Add any additional comments"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="h-7 px-3 text-xs font-medium rounded-[4px] border border-white/10 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="h-7 px-3 text-xs font-medium rounded-[4px] bg-[#3BADE5] hover:bg-[#3BADE5]/90"
          >
            {isNew ? 'Add Defect' : 'Save Changes'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DefectDialog;
