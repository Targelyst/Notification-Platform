import { useState, useEffect, useRef, useCallback } from "react";
import { FiChevronUp } from "react-icons/fi";
import { MdOutlinePushPin } from "react-icons/md";
import { Resizable } from "react-resizable";

interface BottombarProps {
    children: React.ReactNode;
    initialHeight?: number;
    isDocked?: boolean;
    isOpen?: boolean;
    maxHeight?: number;
    maxHeightClass?: string;
    onDockChange?: (docked: boolean) => void;
    onOpenChange?: (open: boolean) => void;
}

const MIN_HEIGHT = 100;
const DEFAULT_HEIGHT = 300;
const DEFAULT_MAX_HEIGHT = 1200;


export const Bottombar = ({
    children,
    initialHeight = DEFAULT_HEIGHT,
    isDocked: externalDocked,
    isOpen: externalOpen,
    maxHeight = DEFAULT_MAX_HEIGHT,
    onDockChange,
    onOpenChange,
}: BottombarProps) => {
    const maxHeightClass = `max-h-${maxHeight}px`;
    const [internalOpen, setInternalOpen] = useState(false);
    const [height, setHeight] = useState(initialHeight);
    const [internalDocked, setInternalDocked] = useState(false);
    const bottombarRef = useRef<HTMLDivElement>(null);

    const isControlledDocked = externalDocked !== undefined;
    const isControlledOpen = externalOpen !== undefined;
    const isDocked = isControlledDocked ? externalDocked : internalDocked;
    const isOpen = isControlledOpen ? externalOpen : internalOpen;

    const handleOpenChange = useCallback((open: boolean) => {
        if (!isControlledOpen) setInternalOpen(open);
        onOpenChange?.(open);
    }, [isControlledOpen, onOpenChange]);

    useEffect(() => {
        if (isDocked) handleOpenChange(true);
    }, [isDocked, handleOpenChange]);

    const toggleDock = useCallback(() => {
        const newDocked = !isDocked;
        if (!isControlledDocked) setInternalDocked(newDocked);
        onDockChange?.(newDocked);
        handleOpenChange(true);
    }, [isDocked, isControlledDocked, onDockChange, handleOpenChange]);

    // Click outside handler for undocked state
    useEffect(() => {
        if (!isOpen || isDocked) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (bottombarRef.current && !bottombarRef.current.contains(e.target as Node)) {
                handleOpenChange(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, isDocked, handleOpenChange]);

    // Smooth resize handler using requestAnimationFrame
    const handleResize = useCallback((newHeight: number) => {
        const clampedHeight = Math.min(Math.max(newHeight, MIN_HEIGHT), maxHeight);
        if (bottombarRef.current) {
            bottombarRef.current.style.height = `${clampedHeight}px`;
        }
        setHeight(clampedHeight);
    }, [maxHeight]);

    return (
        <>
            <div
                ref={bottombarRef}
                className={`fixed bottom-0 z-50 left-1/2 -translate-x-1/2 w-96/100 bg-gradient-to-br from-impolar-bg-surface/80 via-impolar-bg-surface/40 to-impolar-bg-highlight/50 border-2 border-impolar-bg-highlight/90 shadow-xl backdrop-blur-sm transform transition-transform duration-300 ease-out-expo rounded-t-2xl ${maxHeightClass} ${isOpen ? "translate-y-0" : "translate-y-full"
                    }`}
                style={{ height: isOpen ? height : 0 }}
            >
                <Resizable
                    height={height}
                    width={0}
                    axis="y"
                    minConstraints={[0, MIN_HEIGHT]}
                    maxConstraints={[0, maxHeight]}
                    onResize={(_, { size }) => handleResize(size.height)}
                    resizeHandles={["n"]}
                    handle={
                        <div className="absolute top-0 left-0 right-0 h-4 cursor-row-resize flex items-center justify-center group">
                            <div className="h-1 w-8 bg-impolar-primary/50 rounded-full transition-colors" />
                        </div>
                    }
                >
                    <div className="h-full pt-6 pb-4 overflow-y-auto">
                        <button
                            type="button"
                            onClick={toggleDock}
                            className="absolute top-2 right-2 p-1.5 hover:bg-impolar-bg-highlight/30 rounded-lg transition-colors"
                        >
                            <MdOutlinePushPin
                                className={`w-5 h-5 transition-transform ${isDocked
                                    ? "text-impolar-primary rotate-45"
                                    : "text-impolar-bg-highlight-text"
                                    }`}
                            />
                        </button>

                        <button
                            type="button"
                            onClick={() => handleOpenChange(false)}
                            className="absolute top-2 right-12 p-1.5 hover:bg-impolar-bg-highlight/30 rounded-lg transition-colors"
                        >
                            <FiChevronUp className="w-4 h-4 text-impolar-bg-highlight-text transform rotate-180" />
                        </button>

                        <div className="p-24 mx-auto">
                            {children}
                        </div>
                    </div>
                </Resizable>
            </div>

            {!isOpen && (
                <div
                    className="fixed bottom-0 left-1/2 -translate-x-1/2 p-2 bg-impolar-bg border border-impolar-bg-highlight/30 rounded-t-lg shadow-lg cursor-pointer hover:bg-impolar-bg-highlight/30 transition-colors"
                    onClick={() => handleOpenChange(true)}
                >
                    <FiChevronUp className="w-4 h-4 text-impolar-bg-highlight-text" />
                </div>
            )}
        </>
    );
};
