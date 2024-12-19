// EventEmitter: реализация механизма подписки и публикации событий
class EventEmitter {
    constructor() {
        this.events = {};
    }

    // Подписка на событие
    on(eventName, listener) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(listener);
    }

    // Отписка от события
    off(eventName, listener) {
        if (!this.events[eventName]) return;

        this.events[eventName] = this.events[eventName].filter(
            (l) => l !== listener
        );
    }

    // Публикация события
    emit(eventName, ...args) {
        if (!this.events[eventName]) return;

        this.events[eventName].forEach((listener) => {
            listener(...args);
        });
    }
}

// Создаем экземпляр EventEmitter
const eventBus = new EventEmitter();
console.log('Event bus started...')
