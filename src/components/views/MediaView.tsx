'use client';

import React from 'react';
import UploadForm from '@/components/UploadForm';
import PortfolioPreview from '@/components/PortfolioPreview';
import PortfolioActions from '@/components/PortfolioActions';

export default function MediaView() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-nunito">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Sidebar - Upload & Actions */}
                <div className="lg:col-span-1 space-y-8">
                    <UploadForm />
                    <PortfolioActions />
                </div>

                {/* Main Content - Portfolio Preview */}
                <div className="lg:col-span-2">
                    <PortfolioPreview />
                </div>
            </div>
        </div>
    );
}
