import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCopy } from '@fortawesome/free-solid-svg-icons';

export interface ContextMenuProps {
    menuState: {
        visible: boolean;
        x: number;
        y: number;
        context: {
            type: 'element' | 'section';
            title?: string;
        };
    };
    onAction: (action: string, value?: any) => void;
}

const ContextMenu = React.forwardRef<HTMLDivElement, ContextMenuProps>(({ menuState, onAction }, ref) => {
    if (!menuState.visible) return null;

    const menuStyle: React.CSSProperties = {
        position: 'fixed',
        top: menuState.y,
        left: menuState.x,
        zIndex: 1000,
    };

    const handleAction = (action: string, value?: any) => {
        onAction(action, value);
    };

    return (
        <div
            ref={ref}
            style={menuStyle}
            className="bg-background backdrop-blur-sm rounded-xl shadow-neumorphic-lg p-4 w-64 text-gray-800 font-nunito"
        >
            <div className="font-bold text-lg mb-3 pb-2 text-primary uppercase tracking-wider">Editing Tools</div>

            {menuState.context.type === 'element' && (
                <div className="space-y-3">
                    <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Element Settings</div>
                    <button
                        onClick={() => handleAction('delete')}
                        className="w-full text-left px-4 py-2 rounded-lg bg-background shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset 
                            text-primary hover:text-red-600 transition-all duration-200 flex items-center font-medium"
                    >
                        <FontAwesomeIcon icon={faTrash} className="mr-3 w-4 h-4" />
                        Delete Element
                    </button>
                    <button
                        onClick={() => handleAction('duplicate')}
                        className="w-full text-left px-4 py-2 rounded-lg bg-background shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset 
                            text-primary hover:text-primary transition-all duration-200 flex items-center font-medium"
                    >
                        <FontAwesomeIcon icon={faCopy} className="mr-3 w-4 h-4" />
                        Duplicate Element
                    </button>
                </div>
            )}

            {menuState.context.type === 'section' && (
                <div className="space-y-3">
                    <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Section Settings</div>
                    <div className="px-4">
                        <label htmlFor="sectionTitle" className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wider">Title</label>
                        <input
                            id="sectionTitle"
                            type="text"
                            value={menuState.context.title || ''}
                            onChange={(e) => handleAction('rename-section', e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-background rounded-lg shadow-neumorphic-inset border-0 
                                focus:outline-none focus:shadow-neumorphic-inset transition-all duration-200"
                            placeholder="Enter section title"
                        />
                    </div>
                    <button
                        onClick={() => handleAction('delete-section')}
                        className="w-full text-left px-4 py-2 rounded-lg bg-background shadow-neumorphic hover:shadow-neumorphic-sm active:shadow-neumorphic-inset 
                            text-primary hover:text-red-600 transition-all duration-200 flex items-center font-medium"
                    >
                        <FontAwesomeIcon icon={faTrash} className="mr-3 w-4 h-4" />
                        Delete Section
                    </button>
                </div>
            )}
        </div>
    );
});

export default ContextMenu;