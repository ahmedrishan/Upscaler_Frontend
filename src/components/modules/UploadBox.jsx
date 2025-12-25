import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * UploadBox Component
 * Handles file drag & drop and selection. Displays a preview of the selected image.
 * 
 * @param {Object} props
 * @param {Function} props.onFileSelect - Callback when a file is selected (File object).
 * @param {File} props.currentFile - The currently selected file (for preview persistence).
 * @param {boolean} props.disabled - Whether interaction is disabled (e.g. processing).
 */
const UploadBox = ({ onFileSelect, currentFile, disabled = false }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Create preview URL when file changes
    React.useEffect(() => {
        if (currentFile) {
            const url = URL.createObjectURL(currentFile);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(null);
        }
    }, [currentFile]);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
    }, [disabled]);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled) return;

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                onFileSelect(file);
            } else {
                // Here we might trigger a toast error, but for now just console
                console.warn('Invalid file type');
            }
        }
    }, [onFileSelect, disabled]);

    const handleFileInput = useCallback((e) => {
        if (disabled) return;
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    }, [onFileSelect, disabled]);

    return (
        <div
            className={`relative w-full h-72 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-200 ease-in-out
        ${isDragging
                    ? 'border-purple-500 bg-purple-500/10 scale-[1.01]'
                    : 'border-white/20 hover:border-white/40 bg-zinc-900/50'
                }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {previewUrl ? (
                <div className="relative w-full h-full p-4 group">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-contain rounded-lg shadow-lg"
                    />
                    {!disabled && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                            <p className="text-white font-medium">Click or Drop to Replace</p>
                        </div>
                    )}
                    <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        onChange={handleFileInput}
                        accept="image/*"
                        disabled={disabled}
                    />
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                    <div className="p-4 bg-zinc-800 rounded-full mb-4 group-hover:bg-zinc-700 transition-colors">
                        <svg
                            width="32" height="32"
                            className={`w-6 h-6 ${isDragging ? 'text-purple-400' : 'text-gray-400'}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    <p className="mb-2 text-lg text-gray-300 font-medium">
                        {isDragging ? 'Drop Image Here' : 'Click or Drag Image to Upload'}
                    </p>
                    <p className="text-sm text-gray-500">Supports JPG, PNG (Max 10MB)</p>
                    <input
                        type="file"
                        className="hidden"
                        onChange={handleFileInput}
                        accept="image/*"
                        disabled={disabled}
                    />
                </label>
            )}
        </div>
    );
};

UploadBox.propTypes = {
    onFileSelect: PropTypes.func.isRequired,
    currentFile: PropTypes.object,
    disabled: PropTypes.bool
};

export default UploadBox;
