'use client';

import React, { useState } from 'react';
import { usePortfolio, MediaItem } from '@/contexts/PortfolioContext';
import { uploadFile } from '@/lib/api';

interface UploadFormProps {
    onSuccess?: () => void;
}

export default function UploadForm({ onSuccess }: UploadFormProps) {
    const { state, dispatch } = usePortfolio();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Photography',
        date: '',
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles(files);

        // Create previews
        const newPreviews: string[] = [];
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                newPreviews.push(event.target?.result as string);
                if (newPreviews.length === files.length) {
                    setPreviews([...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedFiles.length === 0) return;

        setIsUploading(true);
        dispatch({ type: 'SET_LOADING', payload: true });

        try {
            for (const file of selectedFiles) {
                const uploadedItem = await uploadFile(
                    file,
                    formData.title || file.name,
                    formData.description,
                    formData.category,
                    formData.date
                );

                dispatch({ type: 'ADD_ITEM', payload: uploadedItem });
            }

            // Reset form
            setFormData({
                title: '',
                description: '',
                category: 'Photography',
                date: '',
            });
            setSelectedFiles([]);
            setPreviews([]);

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const getFileType = (file: File): 'image' | 'video' => {
        return file.type.startsWith('image/') ? 'image' : 'video';
    };

    return (
        <div className="bg-background font-nunito dark:bg-background rounded-2xl shadow-neumorphic p-6 lg:p-12 max-w-6xl mx-auto">
            <h2 className="text-xl lg:text-2xl font-bold mb-12 text-primary dark:text-white tracking-widest uppercase">
                UPLOAD MEDIA
            </h2>

            <form onSubmit={handleSubmit} className="space-y-12">
                {/* File Upload */}
                <div className="space-y-6">
                    <label className="block text-sm font-bold text-primary dark:text-white mb-4 uppercase tracking-wider">
                        SELECT FILES
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <input
                            id="file-upload"
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            onChange={handleFileSelect}
                            className="sr-only"
                        />
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg shadow-neumorphic bg-primary/10 text-primary font-bold text-sm uppercase tracking-wider
                                hover:bg-primary/20 active:bg-primary/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/15
                                transition-all duration-200 ease-out hover:scale-[1.01] active:scale-[0.99] active:shadow-neumorphic-inset min-w-fit"
                        >
                            <svg
                                className="w-4 h-4 transition-transform duration-300 ease-out group-hover:scale-110"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                            CHOOSE FILES
                        </label>
                        <span className="text-gray-600 dark:text-gray-400 font-medium text-base">
                            {selectedFiles.length > 0
                                ? `${selectedFiles.length} file(s) selected`
                                : 'No file chosen'}
                        </span>
                    </div>
                </div>

                {/* File Previews */}
                {previews.length > 0 && (
                    <div className="space-y-6">
                        <h3 className="text-base font-bold text-primary dark:text-white uppercase tracking-wider">
                            PREVIEW
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {previews.map((preview, index) => (
                                <div key={index} className="relative">
                                    {getFileType(selectedFiles[index]) === 'image' ? (
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-36 object-cover rounded-xl shadow-neumorphic"
                                        />
                                    ) : (
                                        <video
                                            src={preview}
                                            className="w-full h-36 object-cover rounded-xl shadow-neumorphic"
                                            controls={false}
                                        />
                                    )}
                                    <div className="absolute top-3 right-3 bg-primary/80 text-white text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wide">
                                        {getFileType(selectedFiles[index])}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Title */}
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-primary dark:text-white uppercase tracking-wider">
                        TITLE
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-5 py-4 shadow-neumorphic bg-background rounded-lg text-sm text-primary dark:text-white
                     focus:ring-2 focus:ring-primary active:ring-2 active:ring-primary/70
                     dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Enter Title (Optional - will use file name if empty.)"
                    />
                </div>

                {/* Description */}
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-primary dark:text-white uppercase tracking-wider">
                        DESCRIPTION
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-5 py-4 shadow-neumorphic bg-background rounded-lg text-sm text-primary dark:text-white
                     focus:ring-2 focus:ring-primary active:ring-2 active:ring-primary/70
                     dark:bg-gray-700 resize-none placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Describe your media..."
                    />
                </div>

                {/* Category */}
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-primary dark:text-white uppercase tracking-wider">
                        CATEGORY
                    </label>
                    <div className="relative">
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-5 py-4 pr-10 text-primary shadow-neumorphic bg-background rounded-lg text-sm
                         focus:ring-2 focus:ring-primary active:ring-2 active:ring-primary/70
                         dark:bg-gray-700 dark:text-white appearance-none"
                        >
                            {state.categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
                            <svg className="h-6 w-6 text-primary dark:text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Date (conditional based on file type) */}
                {selectedFiles.some(file => getFileType(file) === 'image') && (
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-primary dark:text-white uppercase tracking-wider">
                            DATE TAKEN
                        </label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-5 py-4 rounded-lg text-sm text-primary dark:text-white shadow-neumorphic bg-background
                       focus:ring-2 focus:ring-primary active:ring-2 active:ring-primary/70
                       dark:bg-gray-700"
                        />
                    </div>
                )}

                {/* Submit Button */}
                <div className="pt-8">
                    <button
                        type="submit"
                        disabled={selectedFiles.length === 0 || isUploading}
                        className="w-full bg-primary hover:bg-primary/90 active:bg-primary/85 disabled:bg-gray-400 disabled:cursor-not-allowed
                       text-white font-bold py-4 px-6 rounded-lg shadow-neumorphic text-sm uppercase tracking-wider
                       transition-all duration-200 ease-out hover:scale-[1.01] active:scale-[0.99] active:shadow-neumorphic-inset disabled:hover:scale-100
                       focus:ring-2 focus:ring-primary/50"
                    >
                        {isUploading ? 'UPLOADING...' : `UPLOAD ${selectedFiles.length} FILE(S)`}
                    </button>
                </div>
            </form>
        </div>
    );
}
