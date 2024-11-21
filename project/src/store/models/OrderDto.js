class OrderDto {
    constructor(dbRecord) {
        this.orderId = dbRecord?.orderId || undefined;
        this.userId = dbRecord?.userId || undefined;
        this.totalAmount = dbRecord?.totalAmount || undefined;
        this.status = dbRecord?.status || undefined;
        this.createdAt = dbRecord?.createdAt || null;
        this.updatedAt = dbRecord?.updatedAt || undefined;
        this.referenceId = dbRecord?.referenceId || undefined;
    }

    // Метод для проверки валидности статуса
    isValidOrderStatus(status) {
        return Object.values(OrderStatus).includes(status);
    }

    // Геттеры
    getOrderId() {
        return this.orderId;
    }

    getDeliveryId() {
        return this.deliveryId;
    }


    getUserId() {
        return this.userId;
    }

    getTotalAmount() {
        return this.totalAmount;
    }

    getStatus() {
        return this.status;
    }

    getCreatedAt() {
        return this.createdAt;
    }

    getUpdatedAt() {
        return this.updatedAt;
    }

    getReferenceId() {
        return this.referenceId;
    }

    setDeliveryId(deliveryId) {
        this.deliveryId = deliveryId;
    }

    // Сеттеры
    setOrderId(orderId) {
        this.orderId = orderId;
    }

    setUserId(userId) {
        this.userId = userId;
    }

    setTotalAmount(totalAmount) {
        this.totalAmount = totalAmount;
    }

    setStatus(status) {
        if (Object.values(OrderStatus).includes(status)) {
            this.status = status;
        } else {
            throw new Error('Invalid status value');
        }
    }

    setCreatedAt(createdAt) {
        this.createdAt = createdAt;
    }

    setUpdatedAt(updatedAt) {
        this.updatedAt = updatedAt;
    }

    setReferenceId(referenceId) {
        this.referenceId = referenceId;
    }

    // Метод для сохранения объекта в localStorage
    saveToLocalStorage(key) {
        const serializedData = JSON.stringify(this);
        localStorage.setItem(key, serializedData);
    }


    loadFromLocalStorage(key) {
        const serializedData = localStorage.getItem(key);
        if (serializedData) {
            const parsedData = JSON.parse(serializedData);
            this.orderId = parsedData?.orderId || undefined;
            this.userId = parsedData?.userId || undefined;
            this.totalAmount = parsedData?.totalAmount || undefined;
            this.status = parsedData?.status || undefined;
            this.createdAt = parsedData?.createdAt || null;
            this.updatedAt = parsedData?.updatedAt || undefined;
            this.referenceId = parsedData?.referenceId || undefined;
            this.deliveryId  = parsedData?.deliveryId || undefined;
          }
        return null;
    }
}
