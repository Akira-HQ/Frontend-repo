'use client'
import React, { useState } from 'react';
import { Zap, AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {

  const NEON_PURPLE = "#A500FF";
  const NEON_ORANGE = "#FFB300";

  return (
    // Modal Overlay
    <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-gray-950/80 backdrop-blur-sm p-4">

      {/* Modal Card */}
      <div className="w-full max-w-sm bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl shadow-purple-900/50 p-6 transform transition-all duration-300 scale-100">

        {/* Header */}
        <div className="flex items-start space-x-3 border-b border-gray-800 pb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
          <h3 className="text-xl font-bold text-white flex-1">{title}</h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-4">
          <p className="text-sm text-gray-400">{message}</p>
        </div>

        {/* Footer Buttons */}
        <div className="mt-6 flex justify-end space-x-3">

          {/* Cancel Button */}
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 transition"
          >
            {cancelText}
          </button>

          {/* Confirm Button (Neon Accent) */}
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-bold rounded-lg text-white 
                            bg-[${NEON_PURPLE}] hover:bg-[${NEON_ORANGE}] transition shadow-md shadow-purple-900/50`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmModal