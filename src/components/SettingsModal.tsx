'use client';

import React, { useState, useRef } from 'react';
import { X, Download, Upload, RotateCcw, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onImport: (jsonString: string) => boolean;
  onReset: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  onExport,
  onImport,
  onReset,
}: SettingsModalProps) {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = onImport(content);
      if (success) {
        setImportStatus('Habits restored successfully!');
        setTimeout(() => {
          setImportStatus(null);
          onClose();
        }, 1200);
      } else {
        setImportStatus('Invalid JSON backup file. Please verify format.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetConfirm = () => {
    if (confirm('Are you sure you want to restore default sample habits? Current modifications will be reset.')) {
      onReset();
      setImportStatus('Reset to sample habits completed.');
      setTimeout(() => {
        setImportStatus(null);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Data & Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {importStatus && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            {importStatus}
          </div>
        )}

        <div className="mt-4 space-y-3">
          {/* Export JSON */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-950/60 border border-gray-800/80">
            <div>
              <div className="text-sm font-semibold text-gray-200">Backup Habits</div>
              <div className="text-xs text-gray-500">Download all records as JSON file</div>
            </div>
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-950/60 border border-gray-800/80">
            <div>
              <div className="text-sm font-semibold text-gray-200">Restore Data</div>
              <div className="text-xs text-gray-500">Import records from JSON backup</div>
            </div>
            <div>
              <label htmlFor="backup-file-input" className="sr-only">
                Restore habits from JSON backup
              </label>
              <input
                id="backup-file-input"
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json,application/json"
                aria-label="Restore habits from JSON backup file"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import</span>
              </button>
            </div>
          </div>

          {/* Reset to Sample Defaults */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-950/60 border border-gray-800/80">
            <div>
              <div className="text-sm font-semibold text-gray-200">Reset to Defaults</div>
              <div className="text-xs text-gray-500">Restore default demo habits</div>
            </div>
            <button
              onClick={handleResetConfirm}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="mt-5 p-3.5 rounded-xl bg-gray-950/40 border border-gray-900 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-gray-400 leading-relaxed">
            All your habit records are stored 100% locally in your browser’s localStorage. No external telemetry, no remote databases.
          </p>
        </div>
      </div>
    </div>
  );
}
