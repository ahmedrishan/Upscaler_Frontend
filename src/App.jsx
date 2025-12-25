import React, { useState } from 'react';
import api from './services/api';
import useUpscaler from './hooks/useUpscaler';
import UploadBox from './components/modules/UploadBox';
import SettingsPanel from './components/modules/SettingsPanel';
import ActionBar from './components/modules/ActionBar';
import ImageSlider from './components/common/ImageSlider';
import Toast from './components/feedback/Toast';
import ConnectionStatus from './components/feedback/ConnectionStatus';

function App() {
    const [toasts, setToasts] = useState([]);
    const [tileSize, setTileSize] = useState(0);

    const addToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const {
        status,
        progressMessage,
        result,
        currentFile,
        handleFileSelect,
        processImage,
        reset
    } = useUpscaler(addToast);

    const isProcessing = status === 'uploading' || status === 'processing';
    const showResult = status === 'complete' && result;

    const handleDownload = () => {
        if (result?.upscaled) {
            api.downloadImage(result.upscaled, `upscaled-${Date.now()}.png`);
            addToast('Download started', 'success');
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] text-white selection:bg-purple-500/30">
            <ConnectionStatus />

            {/* Header */}
            <header className="border-b border-white/10 px-6 py-3 flex items-center justify-between backdrop-blur-md sticky top-0 z-40 bg-[#121212]/80">
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center font-bold text-base">
                        AI
                    </div>
                    <h1 className="font-semibold text-lg tracking-tight">UpscaleAI <span className="text-zinc-500 font-normal">Offline</span></h1>
                </div>

                {/* Simple History Toggle (Mock) */}
                <button className="p-2 hover:bg-white/5 rounded-full transition-colors relative">
                    <svg width="20" height="20" className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-10">
                {!showResult ? (
                    <div className="space-y-8 animate-fade-in-up">

                        <section>
                            <h2 className="text-2xl font-bold mb-2">Upload Image</h2>
                            <p className="text-zinc-400 mb-6">Support for JPG, PNG. Max 4x upscale.</p>
                            <UploadBox
                                onFileSelect={handleFileSelect}
                                currentFile={currentFile}
                                disabled={isProcessing}
                            />
                        </section>

                        {currentFile && (
                            <section className="animate-slide-up">
                                <SettingsPanel
                                    modelName="RealESRGAN_x4plus"
                                    scale={4}
                                    tileSize={tileSize}
                                    onTileSizeChange={setTileSize}
                                    disabled={isProcessing}
                                />

                                <ActionBar
                                    onUpscale={processImage}
                                    isProcessing={isProcessing}
                                    disabled={!currentFile}
                                />

                                {progressMessage && (
                                    <div className="mt-4 text-center text-sm font-medium text-purple-300 animate-pulse">
                                        {progressMessage}
                                    </div>
                                )}
                            </section>
                        )}

                    </div>
                ) : (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Upscale Result</h2>
                            <div className="flex gap-3">
                                <button
                                    onClick={reset}
                                    className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5 transition-colors text-sm font-medium"
                                >
                                    New Image
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-200 transition-colors text-sm font-bold flex items-center gap-2"
                                >
                                    <svg width="16" height="16" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download
                                </button>
                            </div>
                        </div>

                        <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-white/5">
                            <ImageSlider
                                beforeImage={result.original}
                                afterImage={result.upscaled}
                            />
                        </div>

                        <div className="flex items-center justify-center p-4 bg-zinc-900/50 rounded-lg text-sm text-zinc-400">
                            <span>Drag the slider to compare details.</span>
                        </div>
                    </div>
                )}
            </main>

            {/* Toast Container */}
            <div className="fixed bottom-0 right-0 p-6 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map(toast => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => removeToast(toast.id)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
