'use client';

import React, { useState } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { savePortfolio, loadPortfolio } from '@/lib/api';

export default function PortfolioActions() {
    const { state, dispatch } = usePortfolio();
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSave = async () => {
        if (state.items.length === 0) {
            setMessage('No items to save');
            setTimeout(() => setMessage(''), 3000);
            return;
        }

        setIsSaving(true);
        try {
            await savePortfolio(state.userId, state.items);
            setMessage('Portfolio saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Save failed:', error);
            setMessage('Failed to save portfolio');
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLoad = async () => {
        setIsLoading(true);
        try {
            const items = await loadPortfolio(state.userId);
            dispatch({ type: 'LOAD_PORTFOLIO', payload: items });
            setMessage(`Loaded ${items.length} items`);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Load failed:', error);
            setMessage('Failed to load portfolio');
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        if (confirm('Are you sure you want to clear all items? This cannot be undone.')) {
            dispatch({ type: 'CLEAR_PORTFOLIO' });
            setMessage('Portfolio cleared');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <div className="bg-background font-nunito dark:bg-background rounded-2xl shadow-neumorphic p-6 lg:p-12">
            <h2 className="text-xl lg:text-2xl font-bold mb-12 text-primary dark:text-white tracking-widest uppercase">
                Portfolio Actions
            </h2>

            <div className="space-y-8">
                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={isSaving || state.items.length === 0}
                    className="w-full bg-background hover:bg-background/80 active:bg-primary/60 disabled:bg-gray-400 disabled:cursor-not-allowed
                   text-primary font-bold py-4 px-6 rounded-lg shadow-neumorphic text-sm uppercase tracking-wider
                   transition-all duration-200 ease-out hover:scale-[1.01] active:scale-[0.99] active:shadow-neumorphic-inset disabled:hover:scale-100
                   flex items-center justify-center"
                >
                    {isSaving ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            SAVING...
                        </>
                    ) : (
                        <>
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            SAVE PORTFOLIO
                        </>
                    )}
                </button>

                {/* Load Button */}
                <button
                    onClick={handleLoad}
                    disabled={isLoading}
                    className="w-full bg-background hover:bg-background/80 active:bg-primary/60 disabled:bg-gray-400 disabled:cursor-not-allowed
                   text-primary font-bold py-4 px-6 rounded-lg shadow-neumorphic text-sm uppercase tracking-wider
                   transition-all duration-200 ease-out hover:scale-[1.01] active:scale-[0.99] active:shadow-neumorphic-inset disabled:hover:scale-100
                   flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            LOADING...
                        </>
                    ) : (
                        <>
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            LOAD PORTFOLIO
                        </>
                    )}
                </button>

                {/* Clear Button */}
                <button
                    onClick={handleClear}
                    disabled={state.items.length === 0}
                    className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                   text-white font-bold py-4 px-6 rounded-lg shadow-neumorphic text-sm uppercase tracking-wider
                   transition-all duration-200 ease-out hover:scale-[1.01] active:scale-[0.99] active:shadow-neumorphic-inset disabled:hover:scale-100
                   flex items-center justify-center"
                >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    CLEAR ALL ITEMS
                </button>
            </div>

            {/* Status Message */}
            {message && (
                <div className={`mt-10 p-4 rounded-lg shadow-neumorphic text-sm text-center font-bold uppercase tracking-wider ${message.includes('success') || message.includes('Loaded') || message.includes('cleared')
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}>
                    {message}
                </div>
            )}

            {/* Portfolio Stats */}
            <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="bg-background rounded-lg shadow-neumorphic p-4 text-center">
                    <div className="text-2xl font-bold text-primary dark:text-white mb-1">
                        {state.items.length}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 font-bold uppercase tracking-wider">
                        Items
                    </div>
                </div>
                <div className="bg-background rounded-lg shadow-neumorphic p-4 text-center">
                    <div className="text-2xl font-bold text-primary dark:text-white mb-1">
                        {Object.keys(state.items.reduce((groups, item) => {
                            groups[item.category || 'Other'] = true;
                            return groups;
                        }, {} as Record<string, boolean>)).length}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 font-bold uppercase tracking-wider">
                        Types
                    </div>
                </div>
            </div>
        </div>
    );
}
