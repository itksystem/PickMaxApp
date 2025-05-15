// basket-item.js - основной класс элемента корзины
class BasketItem {
  static DEFAULT_SETTINGS = {
    DEFAULT_IMAGE: 'default-image.png',
    DEFAULT_PRODUCT_NAME: 'Product Name'
  };

  constructor(containerClass, item) {
    this.item = item;
    this.container = document.querySelector(`.${containerClass}`);
    if (!this.container) {
      throw new Error('Container not found');
    }

    this.render();
    this.setupDeleteHandler();
  }

  render() {
    this.basketItemElement = document.createElement("div");
    this.basketItemElement.className = "basket-item";

    const basketItemBody = document.createElement("div");
    basketItemBody.className = "card-body";
    basketItemBody.innerHTML = this.getItemHTML();

    this.basketItemElement.appendChild(basketItemBody);
    this.container.appendChild(this.basketItemElement);
  }

  getItemHTML() {
    const { productId, productName, quantity = 0, price = 0, mediaFiles = [] } = this.item;
    const imageSrc = mediaFiles[0]?.mediaKey || BasketItem.DEFAULT_SETTINGS.DEFAULT_IMAGE;
    const totalPrice = quantity * price;

    return `
      <div class="row">        
        <div class="col-5 col-xs-6 col-sm-3 col-md-3">
          <img class="image" src="${imageSrc}" alt="${productName}">
        </div>        
        <div class="col-7 col-xs-6 col-sm-9 col-md-9">        
          <div class="row">
            <div class="col-12 col-xs-12 col-sm-12 col-md-12">
              <div class="basket-card-title">${productName || BasketItem.DEFAULT_SETTINGS.DEFAULT_PRODUCT_NAME}</div>
            </div>
            <div class="col-12 col-xs-12 col-sm-6 col-md-4">
              <basket-button 
                class="button-add-to-basket" 
                product-id="${productId}"
                basket-skin="white" 
                basket-count="${quantity}">
              </basket-button>
            </div>
            <div class="col-12 col-xs-12 col-sm-6 col-md-4">
              <div class="basket-card-price" for="${productId}">
                ${totalPrice} ₽
              </div>
            </div>
            <div>
              <delete-confirm>
                <i slot="trigger" class="fa-solid fa-trash-alt basket-card-trash-hotkey"></i>
              </delete-confirm>
            </div>
          </div>
        </div>                                             
      </div>`;
  }

  setupDeleteHandler() {
    const deleteConfirm = this.basketItemElement.querySelector('delete-confirm');
    deleteConfirm.addEventListener('delete-confirmed', this.declineItem.bind(this));
  }

  async declineItem() {
    try {
      this.api = new WebAPI();
      const response = await fetch(this.api.removeItemBasketMethod() + `/${this.item.productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to remove item');

      this.basketItemElement.remove();
      if (toastr) {
        toastr.success('Товар удален из корзины', 'Товары', { 
          timeOut: 3000 
        });
      }

      if (eventBus) {
        eventBus.emit(EVENT_BASKET_ITEM_UPDATE, { 
          productId: this.item.productId, 
          quantity: 1 
        });
      }
    } catch (error) {
      console.error('Ошибка при удалении товара:', error);
      if (toastr) {
        toastr.error('Ошибка при удалении из корзины', 'Товары', { 
          timeOut: 3000 
        });
      }
      this.basketItemElement.querySelector('delete-confirm').reset();
    }
  }
}