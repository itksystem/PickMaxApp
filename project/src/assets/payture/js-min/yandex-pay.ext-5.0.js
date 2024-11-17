Payture = (function (Payture) {

  Payture.__internal__.model = (function (model) {
    var getDefaults = function () {
      return {
        YandexPayment: null,
        YandexButton: null,
        Token: '',
        YaPayAutoStart: false,
        YandexPayMethod: false,
        Elements: {
          YandexPayButton: document.getElementById('yandex-pay-button'),
          YandexOverlayWait: document.getElementById('overlay-wait'),
          YandexOverlayCvv: document.getElementById('overlay-cvv'),
          YandexCvvButton: document.querySelectorAll("#overlay-cvv button.yandex")[0],
          YandexCvv: document.getElementsByName('yandex-cvv')[0],
        },
        CommonSettings: {
          Amount: String(parseInt(document.getElementsByName('Amount')[0].value) / 100),
          Product: document.getElementsByName('Product')[0].value,
          OrderId: document.getElementsByName('OrderId')[0].value
        },
        ServiceSettings: {
          Version: '2',
          MerchantId: 'bbb9c171-2fab-45e6-b1f8-6212980aa9bb',
          CurrencyCode: 'RUB',
          MerchantName: 'Payture',
          CountryCode: 'RU',
          Gateway: 'payture',
          GatewayMerchantId: '123654',
          env: 'SANDBOX'
        },
        YPButtonStyle: {
          ButtonType: 'PAY', // 'SIMPLE', 'PAY'
          ButtonTheme: 'BLACK', // window.matchMedia('(prefers-color-scheme: dark)').matches ? 'WHITE':'BLACK','WHITE-OUTLINED','BLACK','RED'
          ButtonWidth: 'MAX' // 'AUTO', 'MAX'
        },
        VisibilitySettings: {
          YandexPayButton: false,
          YandexOverlayWait: false,
          YandexOverlayCvv: false,
          YandexCvvButton: false,
          YandexCvv: false
        },
        UsingFormValues: {
          YandexCvv: false
        },
        LoadingButtons: {
          YandexCvvButton: false
        },
        DisableSettings: {
          YandexCvvButton: false
        },
        FormValues: {
          YandexCvv: '',
        },
        Data: {
          YandexCvv: document.getElementsByName('yandex-cvv')[0],
        }
      }
    }

    var checkTypeToken = function () { // происходит проверка - токенизированная карта или нет
      var data = model.options.Token,
        b64string = unescape(encodeURIComponent(data));
      var payment = model.options.YandexPayment;
      $ph.ajax({
        url: '/apim/CheckTypeGoogleToken',
        data: $ph.getQuery({
          PayToken: b64string,
          Key: model.options.FormValues.Key
        }),
        type: 'POST',
        timeout: 60000,
        success: function (data) {
          switch (data.Type) {
            case 1: // карта нетокенизированная - показываем окно для ввода cvv
              model.options.UsingFormValues.YandexCvv = true;
              model.setOption('VisibilitySettings.EmailVisibility', false);
              model.setOption('VisibilitySettings.CardOneBlock', false);
              model.setOption('VisibilitySettings.PayMethodsBlocks', false);
              model.setOption('VisibilitySettings.PayButton', true);
              model.setOption('VisibilitySettings.YandexOverlayCvv', true);
              model.setOption('VisibilitySettings.YandexCvvButton', true);
              model.setOption('VisibilitySettings.YandexCvv', true);
              payment.complete('auth-redirect')
              break;
            case 2: // карта токенизированная - сразу производим оплату
              model.options.UsingFormValues.YandexCvv = false;
              model.setOption('VisibilitySettings.YandexOverlayWait', true);
              var promise = processPaymentAfterCVV();
              promise.then(function (response) {
                if (response.Success == true) {
                  model.onSuccess(response);
                } else {
                  if (response.CanRetry) {
                    model.options.YandexButton.unmount(model.options.Elements.YandexPayButton);
                    model.options.YandexPayment.destroy();
                    model.yandexPayInit();
                  }
                  model.onError(response);
                }
                model.setOption('VisibilitySettings.YandexOverlayWait', false);
              })
              .catch(function () {
                model.options.YandexButton.unmount(model.options.Elements.YandexPayButton);
                model.options.YandexPayment.destroy();
                model.yandexPayInit();
                model.setOption('VisibilitySettings.YandexOverlayWait', false);
                model.onError({"CanRetry": true, "ErrCode": "default" });
              });
              break;
            default:
              payment.complete('close');
              model.onError(data);
          }
        },
        error: function (data) {
          payment.complete('close');
          model.onError(data);
        }
      })
    }

    var processPaymentAfterCVV = function () {
      var options = model.options,
        cvv = model.options.FormValues.YandexCvv,
        data = model.options.Token,
        b64string = unescape(encodeURIComponent(data));

      var payment = model.options.YandexPayment;

      var cvvObj = {},
        amount = parseInt(document.getElementsByName('Amount')[0].value);

      if (cvv) {
        cvvObj = {
          SecureCode: cvv
        }
      }

      if(options.UsingFormValues.BrowserData) {
        cvvObj.BrowserData = options.FormValues.BrowserData;
      }

      if (model.options.FormValues.AddCard && model.options.FormValues.AddCard === "True") {
        cvvObj.AddCard = "True";
      }

      return new Promise(function(resolve, reject){
        $ph.ajax({
          url: model.options.ApiPath + '/PaySubmitMobile',
          data: $ph.getQuery({
            Amount: amount, // стоимость в копейках
            Json: true,
            PayToken: b64string, // token полученный от устройства
            EChequeCustomerContact: options.FormValues.EChequeCustomerContact, // email для отправки чека (если был указан)
            Data: $ph.getDelimitedParams($ph.extend({
              Key: options.FormValues.Key // Key с шаблона
            }, cvvObj)) // cvv если оплата по нетокенизированной карте, иначе пустой
          }),
          type: 'POST',
          timeout: 60000,
          success: function (res) {
            payment.complete('success');
            resolve(res);
          },
          error: function (res) {
            payment.complete('error');
            reject(res);
          }
        })
      })
    }

    return $ph.extend(model, {
      yandexPayInit: function () {
        model.options = model.createOptions(model.options, getDefaults());
        view = Payture.__internal__.view;
        var YaPay = window.YaPay;
        if (YaPay) {
          var requestData = {
            env: model.options.ServiceSettings.env,
            version: model.options.ServiceSettings.Version,
            countryCode: model.options.ServiceSettings.CountryCode,
            currencyCode: model.options.ServiceSettings.CurrencyCode,
            merchant:{
              id: model.options.ServiceSettings.MerchantId,
              name: model.options.MerchantName||model.options.ServiceSettings.MerchantName,
              url: model.options.SiteUrl||""
            },
            order: {
              id: model.options.CommonSettings.OrderId,
              total: {
                amount: model.options.CommonSettings.Amount,
              },
              items: [
                { label: model.options.CommonSettings.Product, amount: model.options.CommonSettings.Amount }
              ]
            },
            paymentMethods: [
              {
                type: YaPay.PaymentMethodType.Card,
                gateway: model.options.ServiceSettings.Gateway,
                gatewayMerchantId: model.options.ServiceSettings.GatewayMerchantId,
                allowedAuthMethods: [YaPay.AllowedAuthMethod.PanOnly],
                verificationDetails: typeof model.options.VerificationDetails === 'undefined' || model.options.VerificationDetails === null ? true:model.options.VerificationDetails,
                allowedCardNetworks: [
                  YaPay.AllowedCardNetwork.Visa,
                  YaPay.AllowedCardNetwork.Mastercard,
                  YaPay.AllowedCardNetwork.Mir
                ]
              }
            ]
          };

          YaPay.createPayment(requestData)
            .then(function (payment) {
              if (!model.options.Elements.YandexPayButton) {
                var div = document.createElement('div');
                div.setAttribute('type', 'button');
                div.setAttribute('class', 'yandex-pay button ico');
                div.setAttribute('data-type', 'yandex_pay');
                div.setAttribute('id', 'yandex-pay-button');

                var container = document.querySelector('#payment-methods');
                var containerInner = document.querySelector('#payment-methods .payment-methods__inner');

                if (containerInner) {

                  var cardSectionContainer = document.querySelector('.card-section-container');
                  if (cardSectionContainer) {
                    cardSectionContainer.insertAdjacentElement("afterend", div);
                  } else {
                    containerInner.append(div);
                  }
                } else {
                  container.append(div);
                }

                div.style.display = 'block';
                div.style.height = '46px';

                model.setOption('Elements.YandexPayButton', document.getElementById('yandex-pay-button'));
              }

              model.setOption('VisibilitySettings.YandexPayButton', true)
              var button = YaPay.Button.create({
                type: model.options.YPButtonStyle.ButtonType,
                theme: model.options.YPButtonStyle.ButtonTheme,
                width: model.options.YPButtonStyle.ButtonWidth,
              });

              button.mount(model.options.Elements.YandexPayButton);

              model.setOption('YandexButton', button);
              model.setOption('YandexPayment', payment);

              if (model.options.YaPayAutoStart) {
                button.buttonElement.click();
              }


              payment.on('process', function (processEvent) {
                model.setOption('Token', processEvent.token);
                checkTypeToken();
              });


              payment.on('error', function (errorEvent) {
                model.setOption('PaymentType', 'init');
                model.onError({CanRetry: true, ErrCode: errorEvent.reason})
                view.checkButton();
              });


              payment.on('abort', function (abortEvent) {
                console.log('Платеж отменен, причина: '+abortEvent.reason);
                model.setOption('PaymentType', 'init');
                view.checkButton();
              });

              model.setOption('YandexPayMethod', true);
              model.setOption('IsAnyAdditionalPayMethodAvailable', true);
              model.setOption('VisibilitySettings.CardPayMethodButtonContainer', 'reset');

            })
            .catch(function (err) {
            // Если использовалась кастомна кнопка Yandex Pay, то скрываем ее.
            });

        }
      },
      yandexPay: function () {
        var payment = model.options.YandexPayment;
        payment.checkout();
      },
      processPaymentWCVVAction: function () { // вызывается при оплате нетокенизированной картой после потдтверждения ввода CVV
        model.setOption('VisibilitySettings.YandexOverlayWait', true);
        var promise = processPaymentAfterCVV();

        promise
          .then(function (response) {
            if (response.Success == true) {
              model.onSuccess(response);
            } else {
              if (response.CanRetry) {
                model.options.YandexButton.unmount(model.options.Elements.YandexPayButton);
                model.options.YandexPayment.destroy();
                model.yandexPayInit();
              }
              model.onError(response);
            }
            setTimeout(function(){
              model.setOption('VisibilitySettings.YandexOverlayCvv', false);
              model.setOption('VisibilitySettings.YandexOverlayWait', false);
              model.setOption('LoadingButtons.YandexCvvButton', false);
              model.setOption('LoadingButtons.YandexCvv', false);
              model.options.Data.YandexCvv.value = '';
              model.options.FormValues.YandexCvv = '';
            }, 1500)

          })
          .catch(function(response){
            model.setOption('VisibilitySettings.YandexOverlayCvv', false);
            model.setOption('VisibilitySettings.YandexOverlayWait', false);
            model.setOption('LoadingButtons.YandexCvvButton', false);
            model.setOption('LoadingButtons.YandexCvv', false);
            model.options.Data.YandexCvv.value = '';
            model.options.FormValues.YandexCvv = '';
            model.onError(response);
          })
      }
    })
  })(Payture.__internal__.model)


  Payture.__internal__.view = (function (view) {
    var model = null,
      options = null,
      elements = null;

    var setPageEventHandlers = function () {
      $ph.addEvent('click', elements.YandexCvvButton, function (event) {
        if(model.options.FormValues.YandexCvv.length >= 3) {
          model.setOption('LoadingButtons.YandexCvvButton', true);
          model.processPaymentWCVVAction();
        }
      })
    }

    var setListeners = function () {
      model.addListener('VisibilitySettings.YandexOverlayCvv', function (fieldName, fieldNewValue) {
        if (fieldNewValue) {
          var payment = model.options.YandexPayment;
          model.setOption('VisibilitySettings.PayButton', false);
          model.setOption('VisibilitySettings.EMailBlock', false);
          setTimeout(function(){
            options.Data.YandexCvv.focus();
          }, 500)
        } else {
          model.setOption('VisibilitySettings.EmailVisibility', true);
          model.setOption('VisibilitySettings.CardOneBlock', true);
          model.setOption('VisibilitySettings.PayMethodsBlocks', true);

          model.setOption('VisibilitySettings.PayButton', true);
          //model.setOption('VisibilitySettings.EMailBlock', true);
        }
      })

      model.addListener('YandexPayMethod', function (fieldName, fieldNewValue) {
        if (fieldNewValue) {
          model.setOption('VisibilitySettings.PayByCardButtonContainer', 'reset');
          model.setOption('PaymentType', 'init');
          $ph.addEvent('click', elements.CardPayMethodButton(), view.paymentTypeHandlingCallback);
          $ph.addEvent('click', elements.YandexPayButton, view.paymentTypeHandlingCallback);
        }
      })
    }

    return $ph.extend(view, {
      yandexPayInit: function () {
        model = Payture.__internal__.model;
        options = model.options;
        elements = options.Elements;

        setPageEventHandlers();
        setListeners();
      }
    })
  })(Payture.__internal__.view)

  return $ph.extend(Payture, {
    YandexPay: function () {
      this.__internal__.model.yandexPayInit();
      this.__internal__.view.yandexPayInit();
    }
  })

})(Payture)
