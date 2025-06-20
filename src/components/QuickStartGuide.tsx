'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faTimes, faMousePointer, faArrowsAlt, faCog } from '@fortawesome/free-solid-svg-icons';

export default function QuickStartGuide() {
    const [isOpen, setIsOpen] = useState(false);

    const features = [
        {
            icon: faMousePointer,
            title: "Right-click for Settings",
            description: "Right-click any element to access spacing, alignment, and styling options."
        },
        {
            icon: faArrowsAlt,
            title: "Resize Images",
            description: "Hover over images to see resize handles. Drag to resize while maintaining aspect ratio."
        },
        {
            icon: faCog,
            title: "Section Heights",
            description: "Set sections to full screen, half screen, or custom heights. Perfect for hero sections!"
        }
    ];

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-6 z-50 bg-primary text-white rounded-lg p-3 shadow-neumorphic hover:shadow-neumorphic-sm hover:bg-primary/90 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] active:shadow-neumorphic-inset"
                title="Quick Start Guide"
            >
                <FontAwesomeIcon icon={faQuestionCircle} className="w-4 h-4" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 font-nunito left-6 z-50 bg-background rounded-lg shadow-neumorphic p-6 max-w-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-primary uppercase tracking-wider">Quick Start</h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded hover:shadow-neumorphic-sm transition-all duration-200"
                >
                    <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-4">
                {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center shadow-neumorphic-inset">
                            <FontAwesomeIcon icon={feature.icon} className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm">{feature.title}</h4>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
