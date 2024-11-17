Payture = (function (Payture) {

  Payture.__internal__.model = (function (model) {
    var getDefaults = function () {
      return {
        MirPayIntervalTimerId: null,
        MirPayTimeoutTimerId: null,
        MirPayWaitIntervalValue: 360000,
        MirPayPaymentMethodButtonIconPath: '/Templates/_assets/img/pay_mir_white.svg',
        MirPayMethod: false,
        Elements: {
          MirPayMethodButton: function () { return document.querySelector('.ico.mir-pay')},
          MirPayCoverBlock: function () { return document.querySelector('#overlay-wait')},
        },
        VisibilitySettings: {
          MirPayCoverBlock: false,
          MirPayBackToMainButton: false
        },
        DisableSettings: {
          MirPayMethodButton: false
        },
        FormValues: {
          MirPayUniversalLink: null,
          MirPayCryptogram: null
        },
        LoadingButtons: {
          MirPayMethodButton: false
        },
      }
    }

    var timerId = null;

    var getStateResponse = function (data) {
      if (!data) return;

      if(data.Success) {
        model.setOption('FormValues.MirPayCryptogram', data.Cryptogram);
        clearInterval(timerId);
        var promise = mobilePay();
        promise.then(function (response) {
          if (response.Success == true) {
            model.onSuccess(response);
          } else {
            model.onError(response);
          }
          model.setOption('VisibilitySettings.MirPayCoverBlock', false);
        });
      } else {
        if (data.ErrCode !== 'AUTHORIZATION_NOT_ATTEMPTED') {
          clearInterval(timerId);
          model.onError({"CanRetry": false, "ErrCode": data.ErrCode });
          model.setOption('VisibilitySettings.MirPayCoverBlock', false);
        }
      }
    }

    var mobilePay = function () {
      var options = model.options,
        b64string = options.FormValues.MirPayCryptogram;

      var cvvObj = {},
        amount = parseInt(document.getElementsByName('Amount')[0].value);

      if(options.UsingFormValues.BrowserData) {
        cvvObj.BrowserData = options.FormValues.BrowserData;
      }

      var data = {
        Amount: amount, // стоимость в копейках
        Json: true,
        PayToken: b64string, // token полученный от устройства
        EChequeCustomerContact: options.FormValues.EChequeCustomerContact, // email для отправки чека (если был указан)
        Data: $ph.getDelimitedParams($ph.extend({
          Key: options.FormValues.Key // Key с шаблона
        }, cvvObj)) // cvv если оплата по нетокенизированной карте, иначе пустой
      };

      if (model.options.UsingFormValues.AuthId) {
        $ph.extend(data, {
          AuthId: model.options.FormValues.AuthId
        })
      }

      return new Promise(function(resolve, reject){
        $ph.ajax({
          url: model.options.ApiPath + '/PaySubmitMobile',
          data: $ph.getQuery(data),
          type: 'POST',
          timeout: 60000,
          success: function (res) {
            resolve(res);
          },
          error: function (res) {
            reject(res);
          }
        })
      })
    }

    var checkState = function () {
      $ph.ajax({
        type: "POST",
        url: "/mirpay/CheckSession",
        data: $ph.getQuery({
          SessionId: model.options.QueryParams.SessionId
        }),
        timeout: 60000,
        success: function (data) {
          getStateResponse(data);
        },
        error: function () {

        }
      });
    }

    var onMirPaySuccess = function () {
      var options = model.options,
        lang = options.Language;

      window.open(options.FormValues.MirPayUniversalLink, '_blank').focus();
      //location.href =  options.FormValues.UniversalLink;

      timerId = setInterval(function () {
        intervalFlag = true;
        checkState();
      }, 3000);

      model.setOption('MirPayIntervalTimerId', timerId);

      var timeoutTimerId = setTimeout(function () {
        clearInterval(timerId);
      }, model.options.MirPayWaitIntervalValue);

      model.setOption('MirPayTimeoutTimerId', timeoutTimerId);
    }

    return $ph.extend(model, {
      mirPayInit: function () {
        var options = Object.assign({}, model.options);
        model.options = model.createOptions(model.options, getDefaults(), options);
      },
      mirPayRemovePayConfirmCover: function () {
        model.setOption('VisibilitySettings.MirPayCoverBlock', false);
        clearInterval(model.options.MirPayIntervalTimerId);
        clearTimeout(model.options.MirPayTimeoutTimerId);
      },
      mirPayGetLink: function () {
        var  options = model.options;
        model.setOption('DisableSettings.MirPayMethodButton', true);
        model.setOption('LoadingButtons.MirPayMethodButton', true);
        model.onError({Success: false});
        $ph.ajax({
          type: "POST",
          url: "/mirpay/GetUniversalLink",
          data: $ph.getQuery({
            SessionId: model.options.QueryParams.SessionId
          }),
          timeout: 60000,
          success: function (data) {
            //console.log({"method":"/mirpay/GetUniversalLink", "response": data});
            model.setOption('LoadingButtons.MirPayMethodButton', false);
            if (data.Success) {
              model.setOption('DisableSettings.MirPayMethodButton', false);
              model.setOption('FormValues.MirPayUniversalLink', data.UniversalLink);

              onMirPaySuccess();

              model.setOption('VisibilitySettings.MirPayCoverBlock', true);
            } else {
              model.onError(data);
            }
          },
          error: function (res) {
            model.setOption('DisableSettings.MirPayMethodButton', false);
            model.setOption('LoadingButtons.MirPayMethodButton', false);
            model.onError(res);
          }
        });
      }
    })
  })(Payture.__internal__.model)


  Payture.__internal__.view = (function (view) {
    var model = null,
      options = null,
      elements = null;

    var createButton = function () {
      var options = model.options,
      lang = options.Language;
      var container = document.querySelector('#payment-methods');
      var containerInner = document.querySelector('#payment-methods .payment-methods__inner');
      var ua = navigator.userAgent;
      var isAndroid = ua.indexOf('Android') > -1;
      if (isAndroid && container) {
        if (!options.Elements.MirPayMethodButton()) {
          var button = document.createElement('button');
          button.setAttribute('type', 'button');
          button.setAttribute('class', 'button ico mir-pay');
          button.setAttribute('data-type', 'mir_pay');
          button.innerHTML = '<span>'+options.TemplateText[lang]['Pay']+'</span>&nbsp;&nbsp;<img src="'+options.MirPayPaymentMethodButtonIconPath+'"/>';

          if (containerInner) {
            containerInner.append(button);
          } else {
            container.append(button);
          }
          button.style.display = 'block';
          $ph.addEvent('click', elements.MirPayMethodButton(), function (event) {
            model.mirPayGetLink();
            event.preventDefault();
          });
        }
        model.addListener('MirPayMethod', function (fieldName, fieldNewValue) {
          if (fieldNewValue) {
            model.setOption('VisibilitySettings.CardPayMethodButtonContainer', 'reset');
            model.setOption('PaymentType', 'init');
            $ph.addEvent('click', elements.CardPayMethodButton(), view.paymentTypeHandlingCallback);
            $ph.addEvent('click', elements.MirPayMethodButton(), view.paymentTypeHandlingCallback);
          }
        })
        model.setOption('MirPayMethod', true);
        model.setOption('IsAnyAdditionalPayMethodAvailable', true);
      }
    }

    var listenCoverBlockVisibility = function () {
      model.addListener('VisibilitySettings.MirPayCoverBlock', function (fieldName, fieldNewValue) {
        var el = document.querySelector('.button.back-mir-pay');
        if (fieldNewValue) {
          if (!el) {
            var button = document.createElement('button');
            button.setAttribute('type', 'button');
            button.setAttribute('class', 'button back-mir-pay');
            button.innerHTML = model.options.TemplateText[model.options.Language]['Cancel'];
            model.options.Elements.MirPayCoverBlock().append(button);
            $ph.addEvent('click', button, function (event) {
              model.mirPayRemovePayConfirmCover();
              event.preventDefault();
            });
          }
        } else {
          if (el) {
            el.parentNode.removeChild(el);
          }
        }
      })
    }

    return $ph.extend(view, {
      mirPayInit: function () {
        model = Payture.__internal__.model;
        options = model.options;
        elements = options.Elements;
        createButton();
        listenCoverBlockVisibility();
      }
    })
  })(Payture.__internal__.view)

  return $ph.extend(Payture, {
    MirPay: function () {
      this.__internal__.model.mirPayInit();
      this.__internal__.view.mirPayInit();
    }
  })

})(Payture)
