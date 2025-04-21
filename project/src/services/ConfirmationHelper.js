class ConfirmationHelper {
    /**
     * Send confirmation code for verification
     * @param {string} code - The confirmation code
     * @param {string} requestId - The request ID from the confirmation request
     * @param {string} action - The request ID from the confirmation request
     * @returns {Promise<Object>} - Response from the server
     */
      static PHONE = 'phone';
      static EMAIL = 'email';
      static SECURITY_QUESTION = 'security-question';

      static api = new WebAPI();
      static webRequest = new WebRequest();


      static checkConfirmationCode(code, requestId, action,  attributes = {}) {
        try {
	    console.log(code, requestId, action,  attributes);	
            const response =
	        ConfirmationHelper.webRequest.post(
	        ConfirmationHelper.api.checkConfirmationCodeMethod(), 
		{
		code, 
		requestId,
		action,
		...attributes
		}, true);
                console.log(response);
            return response.requestId ?? null;
        } catch (error) {
            console.error('checkConfirmationCodeMethod ', error);
            return null;
        }
        return null;
    }
    /**
     * Create new confirmation request
     * @param {string} confirmationType  - The channel type
     * @returns {Promise<Object>} - Response from the server
     */
     static createConfirmationRequest(confirmationType = null) { 
        console.log('createConfirmationRequest ');	
        try {
            const response =
	         ConfirmationHelper.webRequest.post(
	  	 ConfirmationHelper.api.createConfirmationRequestMethod(), {confirmationType}, true);
                 console.log(response);
            return response?.requestId ?? null;
        } catch (error) {
            console.error('createConfirmationRequest ', error);
            return null;
        }
        return null;
    }
    /**
     * delivery code over confirmation channel type 
     * @param {string} confirmationType  - The channel type
     * @param {string} requestId - The request ID from the confirmation request
     * @returns {Promise<Object>} - Response from the server
     */
    static deliveryConfirmationCodeRequest(confirmationType = null, requestId = null) { 
        console.log('deliveryConfirmationCodeRequest ');	
        try {
	   if(!confirmationType || !requestId ) throw('!confirmationType || !requestId error');
           const response =  
		ConfirmationHelper.webRequest.post(
		ConfirmationHelper.api.deliveryConfirmationCodeRequestMethod(), 
		{confirmationType, requestId}, true);
	        console.log(response);
            return response?.requestId ?? null;
        } catch (error) {
            console.error('deliveryConfirmationCodeRequest ', error);
            return false;
        }
        return false;
    }
}