import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

const DefectDialog = ({ 
  isOpen, 
  onClose, 
  defect, 
  onChange, 
  onSave, 
  vessels, 
  isNew 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm font-medium">
            {isNew ? 'Add New Defect' : 'Edit Defect'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-3">
          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-[#f4f4f4]/80">Vessel</label>
            <select
              className="flex h-8 w-full rounded-[4px] border border-white/10 bg-[#132337]/50 px-2 text-xs text-[#f4f4f4] focus:outline-none focus:ring-1 focus:ring-[#3BADE5]"
              value={defect?.vessel_id || ''}
              onChange={(e) => onChange('vessel_id', e.target.value)}
            >
              <option value="">Select Vessel</option>
              {Object.entries(vessels).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-[#f4f4f4]/80">Equipment</label>
            <input
              className="flex h-8 w-full rounded-[4px] border border-white/10 bg-[#132337]/50 px-2 text-xs text-[#f4f4f4] focus:outline-none focus:ring-1 focus:ring-[#3BADE5]"
              value={defect?.Equipments || ''}
              onChange={(e) => onChange('Equipments', e.target.value)}
              placeholder="Enter equipment name"
            />
          </div>

          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-[#f4f4f4]/80">Description</label>
            <textarea
              className="flex h-16 w-full rounded-[4px] border border-white/10 bg-[#132337]/50 px-2 py-1.5 text-xs text-[#f4f4f4] focus:outline-none focus:ring-1 focus:ring-[#3BADE5]"
              value={defect?.Description || ''}
              onChange={(e) => onChange('Description', e.target.value)}
              placeholder="Enter defect description"
            />
          </div>

          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-[#f4f4f4]/80">Action Planned</label>
            <textarea
              className="flex h-16 w-full rounded-[4px] border border-white/10 bg-[#132337]/50 px-2 py-1.5 text-xs text-[#f4f4f4] focus:outline-none focus:ring-1 focus:ring-[#3BADE5]"
              value={defect?.['Action Planned'] || ''}
              onChange={(e) => onChange('Action Planned', e.target.value)}
              placeholder="Enter planned action"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <label className="text-xs font-medium text-[#f4f4f4]/80">Date Reported</label>
              <input
                type="date"
                className="flex h-8 w-full rounded-[4px] border border-white/10 bg-[#132337]/50 px-2 text-xs text-[#f4f4f4] focus:outline-none focus:ring-1 focus:ring-[#3BADE5]"
                value={defect?.['Date Reported'] || ''}
                onChange={(e) => onChange('Date Reported', e.target.value)}
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

          <div className="grid gap-1.5">
            <label className="text-xs font-medium text-[#f4f4f4]/80">Criticality</label>
            <select
              className="flex h-8 w-full rounded-[4px] border border-white/10 bg-[#132337]/50 px-2 text-xs text-[#f4f4f4] focus:outline-none focus:ring-1 focus:ring-[#3BADE5]"
              value={defect?.Criticality || ''}
              onChange={(e) => onChange('Criticality', e.target.value)}
            >
              <option value="">Select Criticality</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
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
            onClick={() => onSave(defect)}
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
