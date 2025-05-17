class AuthDto {
  constructor(data = {}) {
    this._userId = data.userId;
    this._accessToken = data.accessToken;
    this._tokenType = data.tokenType || 'telegram';
    this._pinCodeEnabled = Boolean(data.pinCodeEnabled);
    this._pinCodeChecked = Boolean(data.pinCodeChecked);
    this._isTelegramAuth = Boolean(data.isTelegramAuth);

    // Автоматически сохраняем в LocalStorage
    this.saveToLocalStorage();
  }

  // Геттеры
  get userId() {
    return this._userId;
  }

  get accessToken() {
    return this._accessToken;
  }

  get tokenType() {
    return this._tokenType;
  }

  get pinCodeEnabled() {
    return this._pinCodeEnabled;
  }

  get pinCodeChecked() {
    return this._pinCodeChecked;
  }

  get isTelegramAuth() {
    return this._isTelegramAuth;
  }

  // Сеттеры (с валидацией)
  set userId(value) {
    if (typeof value !== 'number') {
      throw new Error('userId must be a number');
    }
    this._userId = value;
    this.saveToLocalStorage(); // Сохраняем изменения
  }

  set accessToken(value) {
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error('accessToken must be a non-empty string');
    }
    this._accessToken = value;
    this.saveToLocalStorage(); // Сохраняем изменения
  }

  set tokenType(value) {
    const allowedTypes = ['telegram', 'web'];
    if (!allowedTypes.includes(value)) {
      throw new Error(`tokenType must be one of: ${allowedTypes.join(', ')}`);
    }
    this._tokenType = value;
    this.saveToLocalStorage(); // Сохраняем изменения
  }

  set pinCodeEnabled(value) {
    this._pinCodeEnabled = Boolean(value);
    this.saveToLocalStorage(); // Сохраняем изменения
  }

  set pinCodeChecked(value) {
    this._pinCodeChecked = Boolean(value);
    this.saveToLocalStorage(); // Сохраняем изменения
  }

  set isTelegramAuth(value) {
    this._isTelegramAuth = Boolean(value);
    this.saveToLocalStorage(); // Сохраняем изменения
  }

  // Сохраняет текущий объект в LocalStorage
  saveToLocalStorage() {
    localStorage.setItem('authData', JSON.stringify(this.toJSON()));
  }

  // Загружает данные из LocalStorage (статический метод)
  static loadFromLocalStorage() {
    const savedData = localStorage.getItem('authData');
    if (!savedData) return null;

    try {
      const parsedData = JSON.parse(savedData);
      return new AuthDto(parsedData);
    } catch (error) {
      console.error('Failed to parse auth data from LocalStorage', error);
      return null;
    }
  }

  // Преобразует объект в JSON
  toJSON() {
    return {
      userId: this._userId,
      accessToken: this._accessToken,
      tokenType: this._tokenType,
      pinCodeEnabled: this._pinCodeEnabled,
      pinCodeChecked: this._pinCodeChecked,
      isTelegramAuth: this._isTelegramAuth,
    };
  }

  // Проверяет, валиден ли токен
  isTokenValid() {
    return !!this._accessToken;
  }
}
