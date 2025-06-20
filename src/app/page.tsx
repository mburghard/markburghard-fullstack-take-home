'use client';

import React, { useState, useEffect } from 'react';
import { PortfolioProvider } from '@/contexts/PortfolioContext';
import Navigation from '@/components/Navigation';
import EditView from '@/components/views/EditView';
import MediaView from '@/components/views/MediaView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'edit' | 'media'>('edit');

  // Listen for tab change events from EditView
  useEffect(() => {
    const handleTabChange = (event: CustomEvent) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('tab-change', handleTabChange as EventListener);
    return () => {
      window.removeEventListener('tab-change', handleTabChange as EventListener);
    };
  }, []);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'edit':
        return <EditView />;
      case 'media':
        return <MediaView />;
      default:
        return <EditView />;
    }
  };

  return (
    <PortfolioProvider>
      <div className="min-h-screen bg-background font-nunito">
        {/* Navigation - shown for all views */}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <main className="pb-8">
          {renderActiveView()}
        </main>
      </div>
    </PortfolioProvider>
  );
}
