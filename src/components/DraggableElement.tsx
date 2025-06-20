'use client';

import React, { useState, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical, faCog } from '@fortawesome/free-solid-svg-icons';

interface DraggableElementProps {
    id: string;
    children: React.ReactNode;
    onContextMenu: (e: React.MouseEvent) => void;
    className?: string;
}

export default function DraggableElement({
    id,
    children,
    onContextMenu,
    className = '',
}: DraggableElementProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const [isPressed, setIsPressed] = useState(false);
    const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const dragThreshold = 5; // pixels

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const isInteractiveElement = (target: HTMLElement): boolean => {
        // Check if the target or any parent is an interactive element
        return !!(
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.tagName === 'BUTTON' ||
            target.contentEditable === 'true' ||
            target.closest('input, textarea, select, button, [contenteditable="true"]') ||
            target.closest('.resize-handle') ||
            target.classList.contains('resize-handle') ||
            target.closest('[data-resizing="true"]') ||
            target.closest('.drag-handle') ||
            target.classList.contains('drag-handle')
        );
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;

        // Don't interfere with interactive elements or drag handles
        if (isInteractiveElement(target)) {
            return;
        }

        setIsPressed(true);
        setStartPos({ x: e.clientX, y: e.clientY });

        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isPressed || !startPos) return;

        const deltaX = Math.abs(e.clientX - startPos.x);
        const deltaY = Math.abs(e.clientY - startPos.y);

        // If we've moved beyond threshold, cancel the click
        if (deltaX > dragThreshold || deltaY > dragThreshold) {
            setIsPressed(false);
            setStartPos(null);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (isPressed && startPos) {
            const target = e.target as HTMLElement;

            // Don't show context menu if we're over an interactive element
            if (isInteractiveElement(target)) {
                setIsPressed(false);
                setStartPos(null);
                return;
            }

            const deltaX = Math.abs(e.clientX - startPos.x);
            const deltaY = Math.abs(e.clientY - startPos.y);

            // If mouse didn't move much, treat as click and show context menu
            if (deltaX < dragThreshold && deltaY < dragThreshold) {
                // Small delay to ensure it's not a double-click for text editing
                timeoutRef.current = setTimeout(() => {
                    onContextMenu(e);
                }, 100);
            }
        }
        setIsPressed(false);
        setStartPos(null);
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        // Cancel the context menu timeout on double click
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        // Allow double-click to propagate for text editing
    };

    const handleClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;

        // Stop propagation only if we're not clicking on interactive elements
        if (!isInteractiveElement(target)) {
            e.stopPropagation();
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group relative ${className} ${isDragging ? 'opacity-50' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onDoubleClick={handleDoubleClick}
            onClick={handleClick}
        >
            {/* Drag Handle and Settings - only visible on hover, positioned on the left */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 z-10">
                <div
                    className="drag-handle p-1 bg-background rounded-lg shadow-neumorphic text-gray-500 hover:text-primary cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-neumorphic-sm active:shadow-neumorphic-inset"
                    title="Drag to move"
                    {...attributes}
                    {...listeners}
                >
                    <FontAwesomeIcon icon={faGripVertical} className="w-3 h-3" />
                </div>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onContextMenu(e);
                    }}
                    className="p-1 bg-background rounded-lg shadow-neumorphic text-gray-500 hover:text-primary transition-all duration-200 hover:shadow-neumorphic-sm active:shadow-neumorphic-inset"
                    title="Settings"
                >
                    <FontAwesomeIcon icon={faCog} className="w-3 h-3" />
                </button>
            </div>
            {children}
        </div>
    );
}
