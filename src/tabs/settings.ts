import { themeManager } from '../utils/themeManager';
import { COLOR_SCHEMES, DEFAULT_COLORS, DEFAULT_MENU_STYLE } from '../constants/color';



// Глобальный кэш для фоновых изображений
let backgroundImagesCache: string[] = [];

// Функция для предзагрузки данных
export async function preloadSettingsData() {
    try {
        // Загружаем фоновые изображения
        const images = import.meta.glob('/src/assets/backgrounds/*.{jpg,jpeg,png,webp}', { eager: true });
        backgroundImagesCache = Object.values(images).map((img: any) => img.default);
        
        // Применяем текущую тему
        themeManager.applyTheme(themeManager.getCurrentTheme());
    } catch (e) {
        console.error('Error preloading settings data:', e);
    }
}

// Получаем фоновые изображения из кэша
function getBackgroundImages() {
    return backgroundImagesCache;
}


export async function Settings() {
    const currentTheme = themeManager.getCurrentTheme();
    const backgrounds = getBackgroundImages();
    const menuStyle = currentTheme.menuStyle || DEFAULT_MENU_STYLE;
    console.log(currentTheme)

    return `
    <div style="padding: 20px;">
        <h1 style="padding-bottom: 30px;">Настройки</h1>
        
        <!-- Секция цветовых схем -->
        <div class="setting-section">
            <h2 style="padding-left: 10px;">Цветовая схема</h2>
            <div class="color-schemes-grid" style="padding-left: 20px;">
                ${Object.entries(COLOR_SCHEMES).map(([name, scheme]) => `
                    <div class="color-scheme ${currentTheme.colorScheme === name ? 'selected' : ''}" 
                        data-scheme="${name}"
                        style="background: ${scheme.background};
                                color: ${scheme.text};
                                border-color: ${scheme.primary}">
                        <div class="scheme-name">${name}</div>
                        <div class="scheme-colors">
                            <div style="background: ${scheme.primary}"></div>
                            <div style="background: ${scheme.secondary}"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="setting-section" >
            <h2 style="margin-bottom: 10px;">Стиль меню</h2>
            
            <div class="style-control" style="padding-left: 10px;">
                <label>Прозрачность:</label>
                <input type="range" id="menu-opacity" min="0.1" max="1" step="0.05" 
                       value="${menuStyle.opacity}">
            </div>
            
            <div class="style-control" style="padding-left: 10px;">
                <label>Размытие:</label>
                <input type="range" id="menu-blur" min="0" max="20" step="1" 
                       value="${menuStyle.blur}">
            </div>
            
            <div class="style-control" style="padding-left: 10px;">
                <label>Затемнение:</label>
                <input type="range" id="menu-darken" min="0" max="1" step="0.05" 
                       value="${menuStyle.darken}">
            </div>
            
            <button class="reset-button" id="reset-menu-style">Сбросить стиль меню</button>
        </div>

        <!-- Секция фоновых изображений -->
        <div class="setting-section">
            <h2>Фоновое изображение</h2>
            <div class="background-options" style="padding-left: 10px;">
                <button id="no-background-btn" style="padding-left: 10px;" class="bg-toggle-btn ${!currentTheme.backgroundImage && !currentTheme.customBackground ? 'active' : ''}">
                    Без фона
                </button>
                
                <div class="preset-backgrounds">
                    <h3>Рекомендуем:</h3>
                    <div class="background-grid" style="padding-left: 10px;">
                        ${backgrounds.map(img => `
                            <div class="bg-thumbnail ${currentTheme.backgroundImage === img ? 'active' : ''}" 
                                 data-bg="${img}"
                                 style="background-image: url('${img}')">
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="custom-background">
                    <h3>Свое изображение:</h3>
                    <div class="file-upload-container" style="padding-left: 10px;">
                        <label class="file-upload-button">
                            Выбрать файл
                            <input type="file" id="bg-upload" accept="image/*">
                        </label>
                        <span class="file-name" id="custom-bg-name">
                            ${currentTheme.customBackground ? 'Изображение загружено' : 'Файл не выбран'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="setting-section">
            <h2>цвета</h2>
            <div class="color-controls">
                <div class="color-control">
                    <label>Цвет текста:</label>
                    <div class="color-input-group">
                        <input type="color" id="custom-text-color" class="input-color"  
                               value="${currentTheme.customTextColor || DEFAULT_COLORS.text}">
                        <button class="small-button" id="reset-text-color">Сброс</button>
                    </div>
                </div>
                
                <div class="color-control">
                    <label>Цвет фона:</label>
                    <div class="color-input-group">
                        <input type="color" id="custom-bg-color" class="input-color" 
                               value="${currentTheme.customBackgroundColor || DEFAULT_COLORS.background}">
                        <button class="small-button" id="reset-bg-color">Сброс</button>
                    </div>
                </div>
                
                <button class="reset-all-button" id="reset-all-colors">
                    Сбросить все цвета
                </button>
            </div>
        </div>
    </div>
    `;
};

export function initSettings() {
    setTimeout(() => {
        // Обработчик кнопки "Без фона"
        const noBackgroundBtn = document.getElementById('no-background-btn');
        noBackgroundBtn?.addEventListener('click', () => {
            themeManager.setBackgroundImage(null);
            themeManager.setCustomBackground(null);
            
            // Сбрасываем все UI элементы фона
            document.querySelectorAll('.bg-thumbnail').forEach(el => {
                el.classList.remove('active');
            });
            (document.getElementById('bg-upload') as HTMLInputElement).value = '';
            document.getElementById('custom-bg-name')!.textContent = 'Файл не выбран';
            noBackgroundBtn.classList.add('active');
        });

        // Обработчики превью фонов
        document.querySelectorAll('.bg-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', () => {
                const bgUrl = thumb.getAttribute('data-bg');
                if (bgUrl) {
                    themeManager.setBackgroundImage(bgUrl);
                    themeManager.setCustomBackground(null);
                    
                    // Сбрасываем все UI элементы фона
                    document.querySelectorAll('.bg-thumbnail').forEach(el => {
                        el.classList.remove('active');
                    });
                    thumb.classList.add('active');
                    if (noBackgroundBtn) {
                        noBackgroundBtn.classList.remove('active');
                    }
                    (document.getElementById('bg-upload') as HTMLInputElement).value = '';
                    document.getElementById('custom-bg-name')!.textContent = 'Файл не выбран';
                }
            });
        });

        // Обработчики фоновых изображений
        document.querySelectorAll('input[name="background"]').forEach(input => {
            input.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                if (target.value === 'none') {
                    themeManager.setBackgroundImage(null);
                    themeManager.setCustomBackground(null);
                } else if (target.value.startsWith('/src/assets/')) {
                    themeManager.setBackgroundImage(target.value);
                    themeManager.setCustomBackground(null);
                }
            });
        });

        // Обработчики цветовых схем
        document.querySelectorAll('.color-scheme').forEach(scheme => {
            scheme.addEventListener('click', () => {
                const schemeName = scheme.getAttribute('data-scheme') as ColorSchemeName;
                themeManager.setColorScheme(schemeName);
                
                // Снимаем выделение со всех схем
                document.querySelectorAll('.color-scheme').forEach(el => {
                    el.classList.remove('selected');
                });
                // Добавляем выделение текущей
                scheme.classList.add('selected');
            });
        });
        
        // Подписка на изменения темы для обновления UI
        themeManager.subscribe((theme) => {
            // Обновляем выделение цветовых схем
            document.querySelectorAll('.color-scheme').forEach(el => {
                const schemeName = el.getAttribute('data-scheme');
                if (schemeName === theme.colorScheme) {
                    el.classList.add('selected');
                } else {
                    el.classList.remove('selected');
                }
            });
            
            // Обновляем состояние фона
            const noBackgroundBtn = document.getElementById('no-background-btn');
            if (noBackgroundBtn) {
                noBackgroundBtn.classList.toggle('active', 
                    !theme.backgroundImage && !theme.customBackground);
            }
            
            // Обновляем превью фонов
            document.querySelectorAll('.bg-thumbnail').forEach(thumb => {
                const bgUrl = thumb.getAttribute('data-bg');
                thumb.classList.toggle('active', bgUrl === theme.backgroundImage);
            });
        });

        // Обработчики фоновых изображений
        document.querySelectorAll('[data-bg]').forEach(bg => {
            bg.addEventListener('click', () => {
                const bgUrl = bg.getAttribute('data-bg');
                themeManager.setBackgroundImage(bgUrl);
            });
        });
        
        // Обработчик выбора "без фона"
        document.querySelector('input[name="background"][value="none"]')?.addEventListener('change', () => {
            themeManager.setBackgroundImage(null);
            themeManager.setCustomBackground(null);
        });
        
        // Обработчик загрузки своего изображения
        document.getElementById('bg-upload')?.addEventListener('change', (e) => {
            const input = e.target as HTMLInputElement;
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    themeManager.setCustomBackground(event.target?.result as string);
                };
                reader.readAsDataURL(input.files[0]);
            }
        });

        // Обработчики фоновых изображений
        document.querySelectorAll('input[name="background"]').forEach(input => {
            input.addEventListener('change', (e) => {
                const value = (e.target as HTMLInputElement).value;
                if (value === 'none') {
                    themeManager.setBackgroundImage(null);
                    themeManager.setCustomBackground(null);
                } else {
                    themeManager.setBackgroundImage(value);
                }
            });
        });

        // Обработчик загрузки файла
        document.getElementById('bg-upload')?.addEventListener('change', (e) => {
            const input = e.target as HTMLInputElement;
            if (input.files?.[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    themeManager.setCustomBackground(event.target?.result as string);
                    
                    // Обновляем текст
                    document.getElementById('custom-bg-name')!.textContent = 
                        input.files?.[0]?.name || 'Изображение загружено';
                    
                    // Сбрасываем все UI элементы фона
                    document.querySelectorAll('.bg-thumbnail').forEach(el => {
                        el.classList.remove('active');
                    });
                    if (noBackgroundBtn) {
                        noBackgroundBtn.classList.remove('active');
                    }
                };
                reader.readAsDataURL(input.files[0]);
            }
        });




        // Обработчики стиля меню
        document.getElementById('menu-opacity')?.addEventListener('input', (e) => {
            const value = parseFloat((e.target as HTMLInputElement).value);
            themeManager.setMenuStyle({ opacity: value });
        });
        
        document.getElementById('menu-blur')?.addEventListener('input', (e) => {
            const value = parseInt((e.target as HTMLInputElement).value);
            themeManager.setMenuStyle({ blur: value });
        });
        
        document.getElementById('menu-darken')?.addEventListener('input', (e) => {
            const value = parseFloat((e.target as HTMLInputElement).value);
            themeManager.setMenuStyle({ darken: value });
        });
        
        document.getElementById('reset-menu-style')?.addEventListener('click', () => {
            themeManager.setMenuStyle(DEFAULT_MENU_STYLE);
            (document.getElementById('menu-opacity') as HTMLInputElement).value = DEFAULT_MENU_STYLE.opacity.toString();
            (document.getElementById('menu-blur') as HTMLInputElement).value = DEFAULT_MENU_STYLE.blur.toString();
            (document.getElementById('menu-darken') as HTMLInputElement).value = DEFAULT_MENU_STYLE.darken.toString();
        });





         // Обработчик сброса кастомного фона
        document.getElementById('reset-custom-bg')?.addEventListener('click', () => {
            themeManager.setCustomBackground(null);
            (document.getElementById('bg-upload') as HTMLInputElement).value = '';
            document.getElementById('custom-bg-name')!.textContent = 'Файл не выбран';
        });

        const textColorInput = document.getElementById('custom-text-color');
        const bgColorInput = document.getElementById('custom-bg-color');
        
        textColorInput?.addEventListener('input', (e) => {
            themeManager.setCustomTextColor((e.target as HTMLInputElement).value);
        });
        
        bgColorInput?.addEventListener('input', (e) => {
            themeManager.setCustomBackgroundColor((e.target as HTMLInputElement).value);
        });
        
        document.getElementById('reset-text-color')?.addEventListener('click', () => {
            themeManager.setCustomTextColor(null);
            if (textColorInput) (textColorInput as HTMLInputElement).value = DEFAULT_COLORS.text;
        });
        
        document.getElementById('reset-bg-color')?.addEventListener('click', () => {
            themeManager.setCustomBackgroundColor(null);
            if (bgColorInput) (bgColorInput as HTMLInputElement).value = DEFAULT_COLORS.background;
        });
        
        document.getElementById('reset-all-colors')?.addEventListener('click', () => {
            themeManager.resetCustomColors();
            if (textColorInput) (textColorInput as HTMLInputElement).value = DEFAULT_COLORS.text;
            if (bgColorInput) (bgColorInput as HTMLInputElement).value = DEFAULT_COLORS.background;
        });
        
        // Обновляем цветовые пикеры при изменении темы
        themeManager.subscribe((theme) => {
            if (textColorInput) {
                (textColorInput as HTMLInputElement).value = 
                    theme.customTextColor || 
                    COLOR_SCHEMES[theme.colorScheme].text;
            }
            if (bgColorInput) {
                (bgColorInput as HTMLInputElement).value = 
                    theme.customBackgroundColor || 
                    COLOR_SCHEMES[theme.colorScheme].background;
            }
        });

        // Подписка на изменения темы
        themeManager.subscribe((theme) => {
            // Обновляем выделение цветовой схемы
            document.querySelectorAll('.color-scheme').forEach(el => {
                const schemeName = el.getAttribute('data-scheme');
                el.style.border = schemeName === theme.colorScheme ? 
                    '2px solid var(--primary-color)' : 
                    '2px solid transparent';
            });
            
            // Обновляем выделение фона
            document.querySelectorAll('[data-bg]').forEach(el => {
                const bgUrl = el.getAttribute('data-bg');
                el.style.border = bgUrl === theme.backgroundImage ? 
                    '2px solid var(--primary-color)' : 
                    '2px solid transparent';
            });
            
            // Обновляем радио-кнопку "без фона"
            const noneRadio = document.querySelector('input[name="background"][value="none"]') as HTMLInputElement;
            if (noneRadio) {
                noneRadio.checked = !theme.backgroundImage && !theme.customBackground;
            }

            const fileName = theme.customBackground ? 'Изображение загружено' : 'Файл не выбран';
            document.getElementById('custom-bg-name')!.textContent = fileName;

        });
    }, 0);
}
