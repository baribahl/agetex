/**
 * Data module for Agetex website
 * 
 * This file previously contained data management functionality that has been simplified
 * as the website now uses a static approach. It's retained for potential future use
 * if dynamic content management is needed.
 * 
 * Possible future enhancements:
 * - Contact form submission handling
 * - Theme settings management
 * - Partner data management
 */

// Current website theme (matches Tailwind config)
export const theme = {
    primary: '#2C3E50',
    accent: '#F39C12',
    textcolor: '#4A4A4A',
    bgcolor: '#FAFAFA',
    light: '#ECF0F1',
    dark: '#1A2530'
};

// export partner logos for potential use in dynamic loading
export const partnerLogos = {
    sublitex: './images/logo-sublitex-full.svg',
    monti: './images/logo-monti-full.svg',
    tts: './images/logo-tts-full.svg'
};
