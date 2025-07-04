import { Home } from '../../tabs/home';
import { My } from '../../tabs/my';
import { Settings, initSettings  } from '../../tabs/settings';

export const Menu = () => {
    const menuHtml = `
    <div id="menu" style="
        width: 15%;
        min-width: 120px;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px;
        box-shadow: 2px 0 5px rgba(0,0,0,0.5);
        transition: all 0.2s ease-in-out;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        height: 100%;
        overflow: hidden;
        position: relative;
        z-index: 10;
    ">
        <div style="flex-direction: column; display: flex; padding-bottom: 15px;">
            <h3 style="position: absolute; padding: 0; margin: 0;">Меню</h3>
            <button id="close-menu-btn" style="
                    align-self: flex-end;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;"
            >×</button>
            
        </div>
        <button class="menu-btn" data-page="home" style="
            background: none;
            border: none;
            color: white;
            text-align: left;
            padding: 10px;
            cursor: pointer;
            margin-bottom: 5px;
            border-radius: 4px;
            transition: background-color 0.2s;
        ">Главная</button>
        <button class="menu-btn" data-page="my" style="
            background: none;
            border: none;
            color: white;
            text-align: left;
            padding: 10px;
            cursor: pointer;
            margin-bottom: 5px;
            border-radius: 4px;
            transition: background-color 0.2s;
        ">Моё</button>
        <button class="menu-btn" data-page="settings" style="
            background: none;
            border: none;
            color: white;
            text-align: left;
            padding: 10px;
            cursor: pointer;
            margin-bottom: 5px;
            border-radius: 4px;
            transition: background-color 0.2s;
        ">Настройки</button>
    </div>
    <button id="open-menu-btn" style="
        display: none;
        position: fixed;
        left: 10px;
        top: 10px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        border: none;
        cursor: pointer;
        z-index: 100;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    ">☰</button>`;

    setTimeout(() => {
        const closeButton = document.getElementById('close-menu-btn');
        const openButton = document.getElementById('open-menu-btn');
        const menu = document.getElementById('menu');
        const menuButtons = document.querySelectorAll('.menu-btn');
        const mainContent = document.getElementById('main-content');

        if (closeButton && openButton && menu && mainContent) {
            // Обработчик закрытия меню
            closeButton.addEventListener('click', () => {
                menu.style.width = '0';
                menu.style.minWidth = '0';
                menu.style.padding = '0';
                menu.style.transform = 'translateX(-100%)';
                menu.style.overflow = 'hidden';
                openButton.style.display = 'block';
            });

            // Обработчик открытия меню
            openButton.addEventListener('click', () => {
                menu.style.width = '15%';
                menu.style.minWidth = '120px';
                menu.style.padding = '20px';
                menu.style.transform = 'translateX(0)';
                menu.style.overflow = 'visible';
                openButton.style.display = 'none';
            });

            // Обработчики кнопок меню
            menuButtons.forEach(button => {
                button.addEventListener('click', async (e) => { // Добавляем async
                    const target = e.target as HTMLElement;
                    const page = target.getAttribute('data-page');
                    
                    // Подсветка активной кнопки
                    menuButtons.forEach(btn => {
                        (btn as HTMLElement).style.backgroundColor = 'transparent';
                    });
                    target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    
                    // Загрузка соответствующего контента
                    switch(page) {
                        case 'home':
                            mainContent.innerHTML = Home();
                            break;
                        case 'my':
                            mainContent.innerHTML = My();
                            break;
                        case 'settings':
                            mainContent.innerHTML = await Settings(); // Добавляем await
                            initSettings();
                            break;
                    }
                });
            });

            // Загружаем домашнюю страницу по умолчанию
            mainContent.innerHTML = Home();
            // Подсвечиваем кнопку "Главная" по умолчанию
            const homeBtn = document.querySelector('.menu-btn[data-page="home"]') as HTMLElement;
            if (homeBtn) homeBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        }
    }, 0);

    return menuHtml;
};