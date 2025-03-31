export class DOMHelper {
    static createElement(tagName, className, innerHTML = '') {
        const element = document.createElement(tagName);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }

    static createDropdownSection(title, elements) {
        const section = this.createElement("div", "profile-section");
        const header = this.createElement("div", "profile-section-header", title);
        const body = this.createElement("div", "profile-section-body");

        elements.forEach(element => {
            body.appendChild(element);
        });

        section.append(header, body);
        return section;
    }

    static createProfileItem(label, id, placeholder, required, feedbackError, value = '', validationClass = '') {
        const container = this.createElement("div", "profile-input-group");

        const labelElement = this.createElement("label", "form-label");
        labelElement.htmlFor = id;
        labelElement.textContent = label;

        const inputElement = this.createElement("input", `form-control ${validationClass}`);
        inputElement.id = id;
        inputElement.type = "text";
        inputElement.placeholder = placeholder;
        inputElement.value = value;
        if (required) inputElement.required = true;

        const errorElement = this.createElement("div", "invalid-feedback");
        errorElement.id = `${id}-error`;
        errorElement.style.display = "none";
        errorElement.textContent = feedbackError;

        container.append(labelElement, inputElement, errorElement);
        return container;
    }

    static createConfirmationLabel(text, className) {
        const label = this.createElement("div", `confirmation-label ${className}`);
        label.textContent = text;
        return label;
    }

    static createButton(text, className, onClick) {
        const button = this.createElement("button", `btn btn-primary ${className}`);
        button.type = "button";
        button.textContent = text;
        button.addEventListener("click", onClick);
        return button;
    }
}
