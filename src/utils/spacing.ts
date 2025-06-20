// Utility functions for handling spacing and styling

// Generate inline style object for margins
export const getMarginStyles = (margins?: { top?: number; bottom?: number; left?: number; right?: number }) => {
    if (!margins) return {};
    
    const style: React.CSSProperties = {};
    
    if (margins.top !== undefined && margins.top !== null) {
        style.marginTop = `${margins.top}px`;
    }
    if (margins.bottom !== undefined && margins.bottom !== null) {
        style.marginBottom = `${margins.bottom}px`;
    }
    if (margins.left !== undefined && margins.left !== null) {
        style.marginLeft = `${margins.left}px`;
    }
    if (margins.right !== undefined && margins.right !== null) {
        style.marginRight = `${margins.right}px`;
    }
    
    return style;
};

// Individual margin utilities (kept for backward compatibility)
export const getMarginTopClass = (value?: number) => {
    if (value === undefined || value === null) return 'mt-4';
    return `mt-[${value}px]`;
};

export const getMarginBottomClass = (value?: number) => {
    if (value === undefined || value === null) return 'mb-4';
    return `mb-[${value}px]`;
};

export const getMarginLeftClass = (value?: number) => {
    if (value === undefined || value === null) return 'ml-0';
    return `ml-[${value}px]`;
};

export const getMarginRightClass = (value?: number) => {
    if (value === undefined || value === null) return 'mr-0';
    return `mr-[${value}px]`;
};

// Combined margin utility (deprecated - use getMarginStyles instead)
export const getMarginClasses = (margins?: { top?: number; bottom?: number; left?: number; right?: number }) => {
    if (!margins) return 'my-4';
    
    return [
        getMarginTopClass(margins.top),
        getMarginBottomClass(margins.bottom),
        getMarginLeftClass(margins.left),
        getMarginRightClass(margins.right)
    ].join(' ');
};

// Legacy margin class for backward compatibility
export const getMarginClass = (margin?: string) => {
    switch (margin) {
        case 'none':
            return 'my-0';
        case 'small':
            return 'my-2';
        case 'normal':
            return 'my-4';
        case 'large':
            return 'my-8';
        default:
            return 'my-4';
    }
};

export const getTextAlignmentClass = (textAlign?: string) => {
    switch (textAlign) {
        case 'left':
            return 'text-left';
        case 'center':
            return 'text-center';
        case 'right':
            return 'text-right';
        case 'justify':
            return 'text-justify';
        default:
            return 'text-left';
    }
};

// Fixed image alignment - these should work with flexbox parent
export const getImageAlignmentClass = (alignment?: string) => {
    switch (alignment) {
        case 'left':
            return 'self-start';
        case 'center':
            return 'self-center mx-auto';
        case 'right':
            return 'self-end ml-auto';
        default:
            return 'self-center mx-auto';
    }
};

export const getImageMarginClass = (margin?: string) => {
    switch (margin) {
        case 'none':
            return 'my-0';
        case 'small':
            return 'my-2';
        case 'normal':
            return 'my-4';
        case 'large':
            return 'my-8';
        default:
            return 'my-4';
    }
};
