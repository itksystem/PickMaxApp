document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('top-header').shadowRoot.querySelector('.header');
    let lastScroll = 0;

    // Функция для скрытия/отображения меню при прокрутке
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > lastScroll && currentScroll > header.offsetHeight) {
            // Прокрутка вниз - скрыть меню
            header.style.top = `-${header.offsetHeight}px`;
        } else {
            // Прокрутка вверх - показать меню
            header.style.top = '0';
        }

        lastScroll = currentScroll <= 0 ? 0 : currentScroll; // Для мобильных устройств
    });

    // Обработка открытия мобильного меню

    const topHeader = document.querySelector('top-header').shadowRoot.querySelector('.header');
/*
    burger.addEventListener('click', () => {
        topHeader.classList.toggle('header--mobile-menu-open');
    });
*/
    // Обработка свайпов для мобильных устройств
    let touchStartY = 0;
    let touchEndY = 0;

    const handleGesture = () => {
        if (touchEndY < touchStartY - 50) {
            // Свайп вверх - скрыть меню
            header.style.top = `-${header.offsetHeight}px`;
        }

        if (touchEndY > touchStartY + 50) {
            // Свайп вниз - показать меню
            header.style.top = '0';
        }
    };

    window.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    }, false);

    window.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleGesture();
    }, false);

    // Закрытие мобильного меню при выборе пункта
    const navLinks = document.querySelector('top-header').shadowRoot.querySelectorAll('.header__nav-item a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            topHeader.classList.remove('header--mobile-menu-open');
        });
    });
});
