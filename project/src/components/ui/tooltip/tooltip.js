class Tooltip {
  constructor(options) {
    this.options = {
      title: "Настроим погоду и новости для вас",
      subtitle: "Разрешите определить ваш город, чтобы показывать актуальную информацию",
      primaryButtonText: "Разрешить",
      secondaryButtonText: "Изменить",
      onPrimaryClick: () => console.log("Primary clicked"),
      onSecondaryClick: () => console.log("Secondary clicked"),
      ...options,
    };

    this.element = this.#createTooltip();
  }

  #createTooltip() {
    const tooltip = document.createElement("div");
    tooltip.className = "_tooltip";
    tooltip.innerHTML = `
      <h3 class="tooltip__title">${this.options.title}</h3>
      <div class="tooltip__subtitle">${this.options.subtitle}</div>
      <div class="tooltip__buttons">
        <button class="tooltip__button tooltip__button--primary">${this.options.primaryButtonText}</button>
        <button class="tooltip__button tooltip__button--regular">${this.options.secondaryButtonText}</button>
      </div>
    `;

    // Добавляем обработчики
    const primaryBtn = tooltip.querySelector(".tooltip__button--primary");
    const secondaryBtn = tooltip.querySelector(".tooltip__button--regular");

    primaryBtn.addEventListener("click", this.options.onPrimaryClick);
    secondaryBtn.addEventListener("click", this.options.onSecondaryClick);

    return tooltip;
  }

  show(parent = document.body) { 
    parent.appendChild(this.element);
  }

  hide() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
