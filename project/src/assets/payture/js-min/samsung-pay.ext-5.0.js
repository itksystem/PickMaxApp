Payture = (function (Payture) {

  Payture.__internal__.model = (function (model) {
    var getDefaults = function () {
      return {
        SamsungSuccessUri: 'https://sandbox.payture.com/Templates/SamsungPay4'+model.options.ApiPath+'/success.html',
        SamsungFailUri: 'https://sandbox.payture.com/Templates/SamsungPay4/error.html',
        ServiceId: '9311432adebb44c986ec7c',
        CurrencyCode: 'RUB',
        Elements: {
          SamsungPayButton: document.getElementsByClassName('samsung-pay')[0]
        },
        VisibilitySettings: {
          SamsungPayButton: true
        }
      }
    }

    return $ph.extend(model, {
      samsungPayInit: function () {
        var options = Object.assign({}, model.options);
        model.options = model.createOptions( model.options, getDefaults(), options);
      },
      samsungPay: function () {
        var options = model.options,
          amount = parseInt(document.getElementsByName('Amount')[0].value) / 100;

        model.setOption('LoadingButtons.PayButton', true);
        model.setOption('DisableSettings.PayButton', true);

        $ph.ajax({
          url: '/peapi/SamsungPayTransactionsPOST',
          headers: {
            "Content-type": "application/json",
            "X-Request-Id": new Date().getTime()
          },
          dataType: 'json',
          data: JSON.stringify({
            callback: options.SamsungSuccessUri +
              "?Key=" + encodeURIComponent('Key=' + options.FormValues.Key)  +
              "&EChequeCustomerContact=" + options.FormValues.EChequeCustomerContact,
            paymentDetails: {
              service: {
                id: "{serviceId}"
              },
              orderNumber: options.QueryParams.SessionId,
              recurring: false,
              protocol: {
                type: "3DS",
                version: "80"
              },
              amount: {
                option: "FORMAT_TOTAL_ESTIMATED_AMOUNT",
                currency: model.options.CurrencyCode,
                total: amount
              },
              merchant: {
                name: "Payture",
                reference: "123456789"
              },
              allowedBrands: ["VI", "MC"]
            }
          }),
          type: 'POST',
          timeout: 60000,
          success: function (response) {
            SamsungPay.connect(
              response.id,
              response.href,
              options.ServiceId,
              options.SamsungSuccessUri,
              options.SamsungFailUri,
              'ru',
              response.encInfo.mod,
              response.encInfo.exp,
              response.encInfo.keyId
            );
          },
          error: function (response) {
            model.onError(response);
          }
        })
      }
    })
  })(Payture.__internal__.model)


  Payture.__internal__.view = (function (view) {
    var model = null,
      options = null,
      elements = null;

    return $ph.extend(view, {
      samsungPayInit: function () {
        model = Payture.__internal__.model;
        options = model.options;
        elements = options.Elements;

      }
    })
  })(Payture.__internal__.view)

  return $ph.extend(Payture, {
    SamsungPay: function () {
      this.__internal__.model.samsungPayInit();
      this.__internal__.view.samsungPayInit();
    }
  })

})(Payture)