export const COLOR_SCHEMES = {
    dark: {
        text: '#ffffff',
        background: '#1a1a1a',
        primary: '#646cff',
        secondary: '#535bf2'
    },
    light: {
        text: '#213547',
        background: '#ffffff',
        primary: '#646cff',
        secondary: '#747bff'
    },
    future: {
        text: '#00ff88',
        background: '#0a192f',
        primary: '#64ffda',
        secondary: '#112240'
    },
    modern: {
        text: '#e0e0e0',
        background: '#121212',
        primary: '#bb86fc',
        secondary: '#3700b3'
    },
    ocean: {
        text: '#e0f7fa',
        background: '#006064',
        primary: '#80deea',
        secondary: '#00838f'
    },
    
} as const;

// Экспортируем тип для названий цветовых схем
export type ColorSchemeName = keyof typeof COLOR_SCHEMES;

// Экспортируем тип для самой цветовой схемы
export type ColorScheme = typeof COLOR_SCHEMES[keyof typeof COLOR_SCHEMES];

export const DEFAULT_COLORS = {
    text: '#ffffff',
    background: '#1a1a1a'
};

export const DEFAULT_MENU_STYLE = {
    opacity: 0.95,
    blur: 0,
    darken: 0.2
};

export const DEFAULT_IMAGE_SETTINGS = {
    brightness: 100,
    contrast: 100,
    opacity: 1,
    blur: 0,
    darken: 0.2
};