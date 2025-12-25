import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * ImageSlider (ImageCompare) Component
 * Allows users to visually compare two images using a draggable slider.
 * 
 * @param {Object} props
 * @param {string} props.beforeImage - URL of original image.
 * @param {string} props.afterImage - URL of upscaled image.
 */
const ImageSlider = ({ beforeImage, afterImage }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isResizing, setIsResizing] = useState(false);
    const containerRef = useRef(null);

    const handleMouseDown = useCallback(() => setIsResizing(true), []);
    const handleMouseUp = useCallback(() => setIsResizing(false), []);

    const handleMouseMove = useCallback((e) => {
        if (!isResizing || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;

        setSliderPosition(percentage);
    }, [isResizing]);

    // Touch support for mobile/tablets
    const handleTouchMove = useCallback((e) => {
        if (!isResizing || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;

        setSliderPosition(percentage);
    }, [isResizing]);

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchend', handleMouseUp);
        document.addEventListener('touchmove', handleTouchMove);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchend', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
        };
    }, [handleMouseUp, handleMouseMove, handleTouchMove]);

    return (
        <div
            ref={containerRef}
            className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-xl shadow-2xl select-none bg-zinc-900 group"
        >
            {/* After Image (Background) - Relative to define container size */}
            <img
                src={afterImage}
                alt="After"
                className="block w-full h-auto max-h-[65vh] object-contain mx-auto"
                draggable={false}
            />

            {/* Before Image (Clipped overlay) */}
            <div
                className="absolute inset-0 w-full h-full"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img
                    src={beforeImage}
                    alt="Before"
                    className="w-full h-full object-contain mx-auto"
                    draggable={false}
                />
                {/* Label - Before */}
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-2 py-1 rounded text-xs text-white font-medium">
                    Original
                </div>
            </div>

            {/* Label - After (Positioned relative to container but visible on right) */}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur px-2 py-1 rounded text-xs text-white font-medium">
                Upscaled (x4)
            </div>


            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 google-slider-handle hover:cursor-ew-resize active:cursor-move z-10"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
            >
                <div className="absolute inset-y-0 -left-px w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]"></div>
                <div className="absolute top-1/2 -left-3.5 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-lg flex items-center justify-center cursor-ew-resize transform transition-transform hover:scale-110 active:scale-95 text-purple-600">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" transform="rotate(90 12 12)" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

ImageSlider.propTypes = {
    beforeImage: PropTypes.string.isRequired,
    afterImage: PropTypes.string.isRequired
};

export default ImageSlider;
