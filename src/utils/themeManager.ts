import { COLOR_SCHEMES, type ColorSchemeName, DEFAULT_MENU_STYLE } from '../constants/color';

type MenuStyleSettings = {
    opacity: number;
    blur: number;
    darken: number;
};

type ThemeSettings = {
    colorScheme: ColorSchemeName;
    backgroundImage: string | null;
    customBackground: string | null;
    customTextColor: string | null;
    customBackgroundColor: string | null;
    menuStyle: MenuStyleSettings;
};


const DEFAULT_THEME: ThemeSettings = {
    colorScheme: 'dark',
    backgroundImage: null,
    customBackground: null,
    customTextColor: null,
    customBackgroundColor: null,
    menuStyle: DEFAULT_MENU_STYLE,
};

class ThemeManager {
    private currentTheme: ThemeSettings;
    private subscribers: Array<(theme: ThemeSettings) => void> = [];
    private isReady = false;

    constructor() {
        this.currentTheme = this.loadTheme();
        this.applyTheme(this.currentTheme);
    }

    public async ensureReady() {
        if (!this.isReady) {
            await new Promise(resolve => setTimeout(resolve, 100));
            this.isReady = true;
        }
    }

    private loadTheme(): ThemeSettings {
        try {
            const savedTheme = localStorage.getItem('themeSettings');
            if (savedTheme) {
                return JSON.parse(savedTheme);
            }
        } catch (e) {
            console.error('Failed to load theme from localStorage', e);
        }
        return DEFAULT_THEME;
    }

    private saveTheme(theme: ThemeSettings) {
        this.currentTheme = theme;
        localStorage.setItem('themeSettings', JSON.stringify(theme));
    }

    public getCurrentTheme(): ThemeSettings {
        this.currentTheme = this.loadTheme();
        this.applyTheme(this.currentTheme);
        return this.currentTheme;
    }

    public applyTheme(theme: ThemeSettings) {
        this.ensureReady().then(() => {
            // Применяем стиль меню
            this.applyMenuStyle(theme.menuStyle);

            // Определяем используемые цвета
            const schemeColors = COLOR_SCHEMES[theme.colorScheme];
            const textColor = theme.customTextColor || schemeColors.text;
            const backgroundColor = theme.customBackgroundColor || schemeColors.background;

            
            // Применяем цвета
            document.documentElement.style.setProperty('--text-color', textColor);
            document.documentElement.style.setProperty('--background-color', backgroundColor);
            document.documentElement.style.setProperty('--primary-color', schemeColors.primary);
            document.documentElement.style.setProperty('--secondary-color', schemeColors.secondary);

            // Применяем фон
            this.applyBackground(theme);
            this.saveTheme(theme);
            this.notifySubscribers();
        });
    }

    private applyMenuStyle(style: MenuStyleSettings) {
        const menu = document.getElementById('menu');
        if (menu) {
            menu.style.opacity = `${style.opacity}`;
            menu.style.backdropFilter = `blur(${style.blur}px)`;
            menu.style.backgroundColor = `rgba(0, 0, 0, ${0.8 * (1 - style.darken)})`;
        }
    }

    public setMenuStyle(style: Partial<MenuStyleSettings>) {
        this.applyTheme({
            ...this.currentTheme,
            menuStyle: {
                ...this.currentTheme.menuStyle,
                ...style
            }
        });
    }

    private applyBackground(theme: ThemeSettings) {
        const windowContent = document.getElementById('window-content');
        if (!windowContent) return;

        const bgImage = theme.customBackground || theme.backgroundImage;
        if (bgImage) {
            windowContent.style.background = `
                linear-gradient(
                    rgba(0, 0, 0, 0.7), 
                    rgba(0, 0, 0, 0.7)
                ), 
                url('${bgImage}')`;
            windowContent.style.backgroundSize = 'cover';
            windowContent.style.backgroundPosition = 'center';
            windowContent.style.backgroundAttachment = 'fixed';
            windowContent.style.backgroundRepeat = 'no-repeat';
        } else {
            windowContent.style.backgroundImage = 'none';
            windowContent.style.backgroundColor = theme.customBackgroundColor || 
                                               COLOR_SCHEMES[theme.colorScheme].background;
        }
    }


    public setCustomTextColor(color: string | null) {
        this.applyTheme({
            ...this.currentTheme,
            customTextColor: color
        });
    }

    public setCustomBackgroundColor(color: string | null) {
        this.applyTheme({
            ...this.currentTheme,
            customBackgroundColor: color
        });
    }

    public resetCustomColors() {
        this.applyTheme({
            ...this.currentTheme,
            customTextColor: null,
            customBackgroundColor: null
        });
    }

    public setColorScheme(scheme: ColorSchemeName) {
        this.applyTheme({
            ...this.currentTheme,
            colorScheme: scheme
        });
    }

    public setBackgroundImage(imagePath: string | null) {
        this.applyTheme({
            ...this.currentTheme,
            backgroundImage: imagePath,
            customBackground: null
        });
    }

    public setCustomBackground(imageData: string | null) {
        this.applyTheme({
            ...this.currentTheme,
            customBackground: imageData,
            backgroundImage: null
        });
    }

    public resetToDefault() {
        this.applyTheme(DEFAULT_THEME);
    }

    public subscribe(callback: (theme: ThemeSettings) => void) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    private notifySubscribers() {
        this.subscribers.forEach(callback => callback(this.currentTheme));
    }
}

export const themeManager = new ThemeManager();