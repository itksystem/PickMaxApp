class ElementFactory {
// определение элемента
   constructor() {
    this.config = {
      feature: true,
      console: false
    };
      this.logger(`ElementFactory.constructor`);
      this.api = new WebAPI();
      return this;
   }

    define(selector, className) {
        this.logger(`ElementFactory.define`, selector, className);
       	customElements.define( selector, className);
        return this;
    }

   query(selector) {
        this.logger(`ElementFactory. query`, selector);
        return document.querySelector(selector);
    }

  logger(method, ...args) {
     if (this.config.console) {
      console.log(`MainApp.${!method ? '' : method}`, ...args);
    }
    return this;
  }

}
