class DOMHelper {
    static createElement(tag, className = '', innerHTML = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }

    static createButton(label, extraClass = '', onClick = null) {
        const placement = this.createElement("div", "width-100 text-end", "");
        const button = this.createElement("button", `profile-button btn btn-primary ${extraClass}`, label);
        placement.append(button);
        if (onClick) button.addEventListener("click", onClick);
        return placement;
    }

    static createConfirmationLabel(label = null, extraClass = '') {
        const placement = this.createElement("div", "width-100 text-end", "");
        placement.className = `registration-confirm-message ${extraClass}`;
        placement.innerHTML = label || '';
        return placement;
    }

    static createProfileItem(label, id, placeholder, required = false, feedbackError = '', value = null) {
        const container = this.createElement("div", "profile-item-container");
        const labelElement = this.createElement("label", "form-label", label);
        labelElement.setAttribute("for", id);

        const inputElement = this.createElement("input", "form-control");
        inputElement.type = "text";
        inputElement.id = id;
        inputElement.placeholder = placeholder;
        if (value) inputElement.value = value;

        if (required) inputElement.setAttribute("required", "required");
        if (!required) inputElement.setAttribute("disabled", "disabled");

        const errorElement = this.createElement("div", "invalid-feedback", feedbackError);
        errorElement.id = `${id}-error`;
        errorElement.style.display = "none";

        container.append(labelElement, inputElement, errorElement);
        return container;
    }
}
