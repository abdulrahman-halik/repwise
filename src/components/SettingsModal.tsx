'use client';

import React, { useState, useRef } from 'react';
import { X, Download, Upload, RotateCcw, ShieldCheck, Sun, Moon, Laptop } from 'lucide-react';
import { useTheme, ThemeMode } from '@/context/ThemeContext';

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
  const { theme, setTheme } = useTheme();
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

  const themeOptions: { mode: ThemeMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { mode: 'light', label: 'Light', icon: Sun },
    { mode: 'dark', label: 'Dark', icon: Moon },
    { mode: 'system', label: 'System', icon: Laptop },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-150 transition-colors duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Settings & Preferences</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {importStatus && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
            {importStatus}
          </div>
        )}

        <div className="mt-4 space-y-3">
          {/* Theme Selector */}
          <div className="p-3.5 rounded-xl bg-gray-50/90 dark:bg-gray-950/60 border border-gray-200/90 dark:border-gray-800/80">
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-200">Theme Appearance</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Choose light, dark, or system match</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-gray-200/60 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              {themeOptions.map(({ mode, label, icon: Icon }) => {
                const isActive = theme === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTheme(mode)}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white text-gray-950 dark:bg-gray-800 dark:text-white shadow-xs font-semibold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Export JSON */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50/90 dark:bg-gray-950/60 border border-gray-200/90 dark:border-gray-800/80">
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-200">Backup Habits</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Download all records as JSON file</div>
            </div>
            <button
              type="button"
              onClick={onExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 dark:bg-gray-800 dark:border-transparent dark:hover:bg-gray-700 dark:text-gray-200 text-xs font-medium shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50/90 dark:bg-gray-950/60 border border-gray-200/90 dark:border-gray-800/80">
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-200">Restore Data</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Import records from JSON backup</div>
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
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 dark:bg-gray-800 dark:border-transparent dark:hover:bg-gray-700 dark:text-gray-200 text-xs font-medium shadow-xs transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import</span>
              </button>
            </div>
          </div>

          {/* Reset to Sample Defaults */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50/90 dark:bg-gray-950/60 border border-gray-200/90 dark:border-gray-800/80">
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-200">Reset to Defaults</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Restore default demo habits</div>
            </div>
            <button
              type="button"
              onClick={handleResetConfirm}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="mt-5 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-950/40 border border-gray-200/90 dark:border-gray-900 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
            All your habit records are stored 100% locally in your browser&apos;s localStorage. No external telemetry, no remote databases.
          </p>
        </div>
      </div>
    </div>
  );
}
