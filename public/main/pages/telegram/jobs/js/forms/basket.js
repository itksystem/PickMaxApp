class BasketForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.items = [];
        this.totalElement = this.form.querySelector('.total');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.submitForm();
        });
    }

    addItem(item) {
        this.items.push(item);
        this.renderItems();
        this.updateTotal();
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.renderItems();
        this.updateTotal();
    }

    updateItem(itemId, newQuantity) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            item.quantity = newQuantity;
        }
        this.renderItems();
        this.updateTotal();
    }

    renderItems() {
        const itemsContainer = this.form.querySelector('.items');
        itemsContainer.innerHTML = '';
        this.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item';
            itemElement.innerHTML = `
                <span class="name">${item.name}</span>
                <span class="price">${item.price}</span>
                <input type="number" class="quantity" value="${item.quantity}" data-id="${item.id}">
                <button class="remove" data-id="${item.id}">Remove</button>
            `;
            itemsContainer.appendChild(itemElement);
        });
        this.attachEventListeners();
    }

    attachEventListeners() {
        const quantityInputs = this.form.querySelectorAll('.quantity');
        quantityInputs.forEach(input => {
            input.addEventListener('change', (event) => {
                const itemId = parseInt(event.target.getAttribute('data-id'));
                const newQuantity = parseInt(event.target.value);
                this.updateItem(itemId, newQuantity);
            });
        });

        const removeButtons = this.form.querySelectorAll('.remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const itemId = parseInt(event.target.getAttribute('data-id'));
                this.removeItem(itemId);
            });
        });
    }

    updateTotal() {
        const total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        this.totalElement.textContent = `Total: $${total.toFixed(2)}`;
    }

    submitForm() {
        console.log('Form submitted:', this.items);
        // Here you can handle the form submission, e.g., send data to the server
    }
}

