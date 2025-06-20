'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faImages, faCog } from '@fortawesome/free-solid-svg-icons';

interface NavigationProps {
    activeTab: 'edit' | 'media';
    onTabChange: (tab: 'edit' | 'media') => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
    const tabs = [
        { id: 'edit' as const, label: 'Edit', icon: faEdit },
        { id: 'media' as const, label: 'Media', icon: faImages },
    ];

    return (
        <nav className="bg-background font-nunito dark:bg-background shadow-neumorphic rounded-2xl mx-4 mt-4 mb-8 py-4">
            <div className="max-w-7xl mx-auto px-8 lg:px-16">
                <div className="flex justify-center space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center space-x-3 py-3 px-6 font-bold text-sm uppercase tracking-wider transition-all duration-200 ease-out rounded-lg ${activeTab === tab.id
                                ? 'bg-primary/10 text-primary shadow-neumorphic-inset dark:bg-white/10 dark:text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-primary/5 hover:text-primary dark:hover:bg-white/5 dark:hover:text-white hover:scale-[1.01] active:scale-[0.99]'
                                }`}
                        >
                            <FontAwesomeIcon icon={tab.icon} className="w-4 h-4" />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}
