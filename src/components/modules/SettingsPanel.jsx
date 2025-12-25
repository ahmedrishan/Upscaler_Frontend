import React from 'react';
import PropTypes from 'prop-types';

/**
 * SettingsPanel Component
 * Displays configuration controls for the upscaling process.
 * 
 * @param {Object} props
 * @param {string} props.modelName - Name of the active model.
 * @param {number} props.scale - Upscaling factor.
 * @param {number} props.tileSize - Current tile size setting.
 * @param {Function} props.onTileSizeChange - Handler for tile size changes.
 * @param {boolean} props.disabled - Whether controls are disabled.
 */
const SettingsPanel = ({
    modelName = "RealESRGAN_x4plus",
    scale = 4,
    tileSize = 0,
    onTileSizeChange,
    disabled = false
}) => {
    return (
        <div className="w-full p-6 bg-zinc-900 rounded-xl border border-white/10 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Model Info (Read-only) */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-300 font-medium">Model</label>
                    <div className="p-3 bg-zinc-950/50 rounded-lg border border-white/5 flex items-center justify-between">
                        <span className="text-zinc-200 font-mono text-sm">{modelName}</span>
                        <span className="px-2 py-1 text-xs font-bold text-purple-400 bg-purple-400/10 rounded">
                            x{scale}
                        </span>
                    </div>
                    <p className="text-xs text-zinc-500">
                        Standard high-quality model for general images.
                    </p>
                </div>

                {/* Tile Size (Editable) */}
                <div className="space-y-2">
                    <label className="text-sm text-gray-300 font-medium flex items-center gap-2">
                        Tile Size
                        <span className="group relative">
                            <svg className="w-4 h-4 text-gray-500 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black text-xs text-gray-300 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                Use 0 for auto. Lower values (e.g., 256) help on low VRAM GPUs.
                            </span>
                        </span>
                    </label>
                    <select
                        value={tileSize}
                        onChange={(e) => onTileSizeChange(Number(e.target.value))}
                        disabled={disabled}
                        className="w-full p-3 bg-zinc-800 text-white rounded-lg border border-white/10 focus:ring-2 focus:ring-purple-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                    >
                        <option value={0}>Auto (0) - Default</option>
                        <option value={512}>512 - High VRAM</option>
                        <option value={256}>256 - Med VRAM</option>
                        <option value={128}>128 - Low VRAM</option>
                    </select>
                    <p className="text-xs text-zinc-500">
                        Adjust if you experience Out of Memory errors.
                    </p>
                </div>
            </div>
        </div>
    );
};

SettingsPanel.propTypes = {
    modelName: PropTypes.string,
    scale: PropTypes.number,
    tileSize: PropTypes.number,
    onTileSizeChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

export default SettingsPanel;
