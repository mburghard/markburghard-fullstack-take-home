'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPalette,
    faGlobe,
    faUser,
    faShield,
    faSave,
    faDownload
} from '@fortawesome/free-solid-svg-icons';

export default function SettingsView() {
    const [settings, setSettings] = useState({
        siteName: 'My Portfolio',
        description: 'A showcase of my creative work',
        theme: 'light',
        publicUrl: 'my-portfolio',
        enableComments: false,
        enableAnalytics: false,
        contactEmail: '',
        socialLinks: {
            twitter: '',
            linkedin: '',
            github: '',
            instagram: '',
        },
    });

    const updateSetting = (key: string, value: any) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const updateSocialLink = (platform: string, url: string) => {
        setSettings(prev => ({
            ...prev,
            socialLinks: { ...prev.socialLinks, [platform]: url }
        }));
    };

    const saveSettings = () => {
        // TODO: Implement save functionality
        console.log('Saving settings:', settings);
    };

    const exportPortfolio = () => {
        // TODO: Implement export functionality
        console.log('Exporting portfolio');
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
                {/* Header */}
                <div className="bg-background font-nunito dark:bg-background rounded-2xl shadow-neumorphic p-8 lg:p-16 text-center">
                    <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-primary dark:text-white tracking-widest uppercase">Portfolio Settings</h1>
                    <p className="text-base font-medium text-gray-600 dark:text-gray-400">Customize your portfolio appearance and behavior</p>
                </div>

                {/* General Settings */}
                <div className="bg-background font-nunito dark:bg-background rounded-2xl shadow-neumorphic p-8 lg:p-16">
                    <h2 className="text-xl lg:text-2xl font-bold mb-8 text-primary dark:text-white tracking-widest uppercase flex items-center">
                        <FontAwesomeIcon icon={faGlobe} className="w-6 h-6 mr-4" />
                        General
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="block text-base font-bold text-primary dark:text-white uppercase tracking-wider">
                                Site Name
                            </label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) => updateSetting('siteName', e.target.value)}
                                className="w-full px-6 py-5 shadow-neumorphic bg-background rounded-xl text-base text-primary dark:text-white
                                    focus:ring-2 focus:ring-primary active:ring-2 active:ring-primary/70
                                    dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="block text-base font-bold text-primary dark:text-white uppercase tracking-wider">
                                Public URL
                            </label>
                            <div className="flex shadow-neumorphic rounded-xl overflow-hidden">
                                <span className="inline-flex items-center px-6 py-5 bg-primary/10 text-primary dark:bg-white/10 dark:text-white text-base font-bold">
                                    portfolio.com/
                                </span>
                                <input
                                    type="text"
                                    value={settings.publicUrl}
                                    onChange={(e) => updateSetting('publicUrl', e.target.value)}
                                    className="flex-1 px-6 py-5 bg-background text-base text-primary dark:text-white
                                        focus:ring-2 focus:ring-primary active:ring-2 active:ring-primary/70
                                        dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-3">
                            <label className="block text-base font-bold text-primary dark:text-white uppercase tracking-wider">
                                Description
                            </label>
                            <textarea
                                value={settings.description}
                                onChange={(e) => updateSetting('description', e.target.value)}
                                rows={4}
                                className="w-full px-6 py-5 shadow-neumorphic bg-background rounded-xl text-base text-primary dark:text-white
                                    focus:ring-2 focus:ring-primary active:ring-2 active:ring-primary/70
                                    dark:bg-gray-700 resize-none placeholder-gray-500 dark:placeholder-gray-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Appearance Settings */}
                <div className="bg-background font-nunito dark:bg-background rounded-2xl shadow-neumorphic p-8 lg:p-16">
                    <h2 className="text-xl lg:text-2xl font-bold mb-8 text-primary dark:text-white tracking-widest uppercase flex items-center">
                        <FontAwesomeIcon icon={faPalette} className="w-6 h-6 mr-4" />
                        Appearance
                    </h2>
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="block text-base font-bold text-primary dark:text-white uppercase tracking-wider">
                                Theme
                            </label>
                            <div className="relative">
                                <select
                                    value={settings.theme}
                                    onChange={(e) => updateSetting('theme', e.target.value)}
                                    className="w-full px-6 py-5 pr-12 text-primary shadow-neumorphic bg-background rounded-xl text-base
                                        focus:ring-2 focus:ring-primary active:ring-2 active:ring-primary/70
                                        dark:bg-gray-700 dark:text-white appearance-none"
                                >
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="auto">Auto (System)</option>
                                </select>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
                                    <svg className="h-6 w-6 text-primary dark:text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact & Social */}
                <div className="bg-background font-nunito dark:bg-background rounded-2xl shadow-neumorphic p-8 lg:p-16">
                    <h2 className="text-xl lg:text-2xl font-bold mb-8 text-primary dark:text-white tracking-widest uppercase flex items-center">
                        <FontAwesomeIcon icon={faUser} className="w-6 h-6 mr-4" />
                        Contact & Social
                    </h2>
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="block text-base font-bold text-primary dark:text-white uppercase tracking-wider">
                                Contact Email
                            </label>
                            <input
                                type="email"
                                value={settings.contactEmail}
                                onChange={(e) => updateSetting('contactEmail', e.target.value)}
                                className="w-full px-6 py-5 shadow-neumorphic bg-background rounded-xl text-base text-primary dark:text-white
                                    focus:ring-2 focus:ring-primary active:ring-2 active:ring-primary/70
                                    dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {Object.entries(settings.socialLinks).map(([platform, url]) => (
                                <div key={platform} className="space-y-3">
                                    <label className="block text-base font-bold text-primary dark:text-white uppercase tracking-wider">
                                        {platform}
                                    </label>
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => updateSocialLink(platform, e.target.value)}
                                        placeholder={`https://${platform}.com/username`}
                                        className="w-full px-6 py-5 shadow-neumorphic bg-background rounded-xl text-base text-primary dark:text-white
                                            focus:ring-2 focus:ring-primary active:ring-2 active:ring-primary/70
                                            dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Privacy & Features */}
                <div className="bg-background font-nunito dark:bg-background rounded-2xl shadow-neumorphic p-8 lg:p-16">
                    <h2 className="text-xl lg:text-2xl font-bold mb-8 text-primary dark:text-white tracking-widest uppercase flex items-center">
                        <FontAwesomeIcon icon={faShield} className="w-6 h-6 mr-4" />
                        Privacy & Features
                    </h2>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-6 bg-background/50 rounded-2xl shadow-neumorphic-inset">
                            <div>
                                <label className="text-base font-bold text-primary dark:text-white uppercase tracking-wider">
                                    Enable Comments
                                </label>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">Allow visitors to leave comments on your work</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.enableComments}
                                onChange={(e) => updateSetting('enableComments', e.target.checked)}
                                className="h-6 w-6 text-primary focus:ring-primary rounded-lg shadow-neumorphic"
                            />
                        </div>
                        <div className="flex items-center justify-between p-6 bg-background/50 rounded-2xl shadow-neumorphic-inset">
                            <div>
                                <label className="text-base font-bold text-primary dark:text-white uppercase tracking-wider">
                                    Enable Analytics
                                </label>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-1">Track portfolio views and visitor analytics</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={settings.enableAnalytics}
                                onChange={(e) => updateSetting('enableAnalytics', e.target.checked)}
                                className="h-6 w-6 text-primary focus:ring-primary rounded-lg shadow-neumorphic"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-6">
                    <button
                        onClick={saveSettings}
                        className="flex items-center justify-center px-8 py-5 bg-primary hover:bg-primary/90 active:bg-primary/85 text-white rounded-2xl shadow-neumorphic
                            font-bold text-lg uppercase tracking-wider transition-all duration-200 ease-out hover:scale-[1.01] active:scale-[0.99] active:shadow-neumorphic-inset"
                    >
                        <FontAwesomeIcon icon={faSave} className="w-6 h-6 mr-3" />
                        Save Settings
                    </button>
                    <button
                        onClick={exportPortfolio}
                        className="flex items-center justify-center px-8 py-5 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white rounded-2xl shadow-neumorphic
                            font-bold text-lg uppercase tracking-wider transition-all duration-200 ease-out hover:scale-[1.01] active:scale-[0.99] active:shadow-neumorphic-inset"
                    >
                        <FontAwesomeIcon icon={faDownload} className="w-6 h-6 mr-3" />
                        Export Portfolio
                    </button>
                </div>
            </div>
        </div>
    );
}
