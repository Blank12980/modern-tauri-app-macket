import { themeManager } from './utils/themeManager';
import {Menu} from './components/menu/menu'
import { preloadSettingsData } from './tabs/settings';
import './style.css'

// Предзагрузка данных при запуске
preloadSettingsData().then(() => {
    // Применяем тему после загрузки данных
    themeManager.applyTheme(themeManager.getCurrentTheme());
    
    // Рендерим приложение
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div id="window" style="
        margin: 0; 
        padding: 0; 
        height: 100vh; 
        width: 100vw;
        overflow: hidden;
        position: fixed;
        top: 0;
        left: 0;
    ">
      <div id="window-content" style="
          display: flex;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          position: relative;
          background-color: var(--background-color);
          color: var(--text-color);
      ">
        ${Menu()}  
        <div id="main-content-container" style="
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        ">
          <div id="main-content" style="
              flex-grow: 1;
              padding: 20px;
              box-sizing: border-box;
              overflow-y: auto;
              overflow-x: hidden;
          ">
            <!-- Основной контент будет здесь -->
          </div>
        </div>
      </div>
    </div>
  `}).catch(console.error);
