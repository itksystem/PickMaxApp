class ApiService {
    constructor() {
        this.api = new WebAPI();
        this.webRequest = new WebRequest();
    }

    async saveProfile(data) {
        return this.webRequest.post(this.api.saveShopProfileMethod(), data, false);
    }

    async saveEmail(email) {
        return this.webRequest.post(this.api.saveEmailMethod(), { email }, false);
    }

    async savePhone(phone) {
        return this.webRequest.post(this.api.savePhoneMethod(), { phone }, false);
    }

    async checkEmail(email) {
        return this.webRequest.post(this.api.checkEmailMethod(), { email }, true);
    }

    async closeSession() {
        return this.webRequest.post(this.api.closeSessionMethod(), {}, false);
    }
}
