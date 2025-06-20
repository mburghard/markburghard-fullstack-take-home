import React from 'react';
import { faImage, faPlus, faTextHeight, faVectorSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Toolbar: React.FC = () => {
    const handleDragStart = (e: React.DragEvent, type: string) => {
        e.dataTransfer.setData('application/reactflow', type);
        e.dataTransfer.effectAllowed = 'move';
    };

    const toolbarItems = [
        { type: 'section', icon: faVectorSquare, label: 'Section' },
        { type: 'image', icon: faImage, label: 'Image' },
        { type: 'text', icon: faTextHeight, label: 'Text' },
    ];

    return (
        <div className="fixed top-1/2 -translate-y-1/2 left-4 z-50">
            <div className="bg-background/90 backdrop-blur-sm rounded-2xl shadow-neumorphic p-4 flex flex-col items-center space-y-4 font-nunito">
                <div className="p-3 mb-3">
                    <FontAwesomeIcon icon={faPlus} className="w-5 h-5 text-primary" />
                </div>
                {toolbarItems.map((item) => (
                    <div
                        key={item.type}
                        className="w-16 h-16 flex flex-col items-center justify-center rounded-lg cursor-grab bg-background shadow-neumorphic hover:shadow-neumorphic-inset active:shadow-neumorphic-inset transition-all group"
                        onDragStart={(e) => handleDragStart(e, item.type)}
                        draggable
                        title={`Add ${item.label}`}
                    >
                        <FontAwesomeIcon icon={item.icon} className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors mb-1" />
                        <span className="text-xs font-bold text-gray-700 group-hover:text-primary transition-colors uppercase tracking-wide">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Toolbar;