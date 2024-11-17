Payture = (function (Payture) {

  Payture.__internal__.model = (function (model) {
    var getDefaults = function () {
      return {
        SberIntervalTimerId: null,
        SberTimeoutTimerId: null,
        SberIntervalFlag: false,
        SberWaitIntervalValue: 1000*60*60*72,
        IMaskSberPhoneMask: null,
        SberReturnUrl: null,
        SberPayMethod: false,
        SberPayPaymentMethodButtonIconPath: '/Templates/_assets/img/pay_sber.svg',
        Elements: {
          SberPayMethodButton: function () { return document.querySelector('.sber-pay.ico')},
          SberPaySubmitButton: function () { return document.querySelector('.sber_pay.button__pay')},
          SberPayBlock: function () { return document.getElementById('sber-pay-block') },
          SberPayCoverBlock: function () { return document.getElementById('sber-pay-cover-block') },
          SberPayPhoneField: function () { return document.getElementById('sber-pay-phone-field') }
        },
        VisibilitySettings: {
          SberPaySubmitButton: true,
          SberPayCoverBlock: false,
          SberPayMethodButton: true
        },
        DisableSettings: {
          SberPaySubmitButton: false
        },
        LoadingButtons: {
          SberPaySubmitButton: false
        },
      }
    }

    var mcClearInterval = function () {
      if (!model.options.SberIntervalFlag) {
        showResult(false, model.options.SberReturnUrl, false);
      }
    }

    var showResult = function (isSuccess, urls, isTemplateReturn) {
      var errorField = model.options.Elements.ErrorField;
      errorField.innerHTML = '';
      if (isSuccess) {
        model.onSuccess({ Success: true, ErrCode: 0, CanRetry: false, RedirectUrl: model.options.SberReturnUrl });
      } else {
        if (!isTemplateReturn) {
          model.onError({ Success: false, ErrCode: 'WAITING_TIME_OVER', CanRetry: false, RedirectUrl: model.options.SberReturnUrl });
        } else {
          model.setNewKey(urls);
          errorField.innerHTML = 'Ошибка при оплате через СберПей';
          view.requestInitView();
        }
      }
      model.setOption('SberIntervalFlag', false);
      clearInterval(model.options.SberIntervalTimerId);
      clearTimeout(model.options.SberTimeoutTimerId);
    }

    var getStateResponse = function (data) {
      if(data.State === 'Charged' || data.State === "Authorized"){
        showResult(true, data.ReturnUrl, false);
      } else if (data.State === 'Rejected') {
        showResult(false, data.Key, true);
      } else {
        model.setOption('SberIntervalFlag', false);
        if(!model.options.SberIntervalTimerId){
          mcClearInterval();
        }
      }
    }

    var checkState = function () {
      $ph.ajax({
        type: "POST",
        url: "/ncapi/GetState?SessionId=" + model.options.QueryParams.SessionId + "&Key=" + encodeURIComponent(model.options.FormValues.Key) + "&NoCardPaymentType=13&CompileRedirectURL=true&InPay=true",
        timeout: 60000,
        success: function (data) {
          model.setOption('SberReturnUrl', data.ReturnUrl);
          getStateResponse(data);
        },
        error: function () {

        }
      });
      return false;
    }

    var onSberPaySuccess = function (data) {
      var options = model.options,
        lang = options.Language;

/*       model.setOption('VisibilitySettings.SberPayBlock', false);
      model.setOption('VisibilitySettings.SberPaySubmitButton', false); */

      model.onWaitScreen();

      var timerId = setInterval(function () {
        model.setOption('SberIntervalFlag', true);
        checkState();
      }, 5000);

      model.setOption('SberIntervalTimerId', timerId);

      var timeoutTimerId = setTimeout(function () {
        clearInterval(options.SberIntervalTimerId);
        mcClearInterval(options.FormValues.QRCodeId);
      }, model.options.SberWaitIntervalValue);

      model.setOption('SberTimeoutTimerId', timeoutTimerId);
    }

    return $ph.extend(model, {
      sberPayInit: function () {
        var options = Object.assign({}, model.options);
        model.options = model.createOptions(model.options, getDefaults(), options);
      },

      sberRemovePayConfirmCover: function () {
        model.setOption('VisibilitySettings.SberPayCoverBlock', false);
        clearInterval(model.options.SberIntervalTimerId);
        clearTimeout(model.options.SberTimeoutTimerId);
      },

      sberPay: function () {

        var  options = model.options;
        model.setOption('LoadingButtons.SberPaySubmitButton', true);

        $ph.ajax({
          url: '/' + (model.options.PayMethod === "inpay" ? "apim":"vwapi") + '/PaySubmit',
          data: $ph.getQuery({
            Data: 'Key=' + encodeURIComponent(options.FormValues.Key) +
                  ';Phone=' + options.Elements.SberPayPhoneField().value.replace(/[^0-9\+]/g, "") +
                  ';isNoCard=true' + ';NoCardPaymentType=13' +
                  (model.options.FormValues.AddCard && model.options.FormValues.AddCard === 'True' ? ';AddCard=True':''),
            //,
            Json: true
          }),
          type: 'POST',
          timeout: 60000,
          success: function (data) {
            if (data.Success) {
              onSberPaySuccess(data);
            } else {
              model.onError(data);
            }
            model.options.IMaskSberPhoneMask.value = "";
            model.options.IMaskSberPhoneMask.updateValue()
            model.setOption('LoadingButtons.SberPaySubmitButton', false);
          },
          error: function (res) {
            model.setOption('LoadingButtons.SberPaySubmitButton', false);
            model.onError(res);
          }
        })
      }
    })
  })(Payture.__internal__.model)


  Payture.__internal__.view = (function (view) {
    var model = null,
      options = null,
      elements = null;

    var maskFields = function () {
      var phoneMask = IMask(
        elements.SberPayPhoneField(), {
        mask: '+{7} (000) 000-00-00',
        lazy: false
      });

      phoneMask.on("accept", function (a,b) {
        $ph.removeClass(model.options.Elements.SberPayPhoneField().parentElement, 'error');
      });

      phoneMask.on("complete", function () {
        $ph.removeClass(model.options.Elements.SberPayPhoneField().parentElement, 'error');
      });

      $ph.addEvent('keydown', phoneMask.el.input, function (event) {
        var charCode = event.which || event.keyCode;
        if (charCode === 13 && model.options.IMaskSberPhoneMask.unmaskedValue.length === 11) {
          model.sberPay();
        }
      });

      model.setOption('IMaskSberPhoneMask', phoneMask)
    }

    var appendPayButton = function () {
      var options = model.options,
      lang = options.Language;

      if (!options.Elements.SberPayMethodButton()) {
        var button = document.createElement('button');
        button.setAttribute('class', 'button ico sber-pay');
        button.setAttribute('data-type', 'sber_pay');
        button.innerHTML = '<span>'+options.TemplateText[lang]['Pay']+'</span><img src="'+options.SberPayPaymentMethodButtonIconPath+'"/>';
        var container = document.getElementById('payment-methods');
        var containerInner = document.querySelector('#payment-methods .payment-methods__inner');

        if (containerInner) {
          containerInner.append(button);
        } else {
          container.append(button);
        }

        var blockHTML = '<div id="sber-pay-block">'+
          '<div class="ic">'+
          '<div class="caption top label-text" translate-value="SberPayPhoneFieldCaption">'+
          'Номер телефона, привязанный к СберБанк Онлайн'+
          '</div>'+
          '<input type="tel" class="mask middle" id="sber-pay-phone-field" />'+
          '</div>'+
          '<div class="controls">'+
          '<button class="button button__pay sber_pay" type="button" translate-value="SberPaySubmitButton">SberPaySubmitButton</button>'+
          '<button class="button button__cancel button__cancel_pay sber_pay" type="button" translate-value="Cancel">Отмена</button>'+
          '</div>'+
          '</div>';

        document.querySelector('.button.pay').insertAdjacentHTML('beforebegin', blockHTML);
        model.setOption('VisibilitySettings.SberPayMethodButton', true);
      }
      model.addListener('SberPayMethod', function (fieldName, fieldNewValue) {
        if (fieldNewValue) {
          model.setOption('VisibilitySettings.CardPayMethodButtonContainer', 'reset');
          model.setOption('PaymentType', 'init');
          $ph.addEvent('click', elements.CardPayMethodButton(), view.paymentTypeHandlingCallback);
          $ph.addEvent('click', elements.SberPayMethodButton(), view.paymentTypeHandlingCallback);
        }
      })
      model.setOption('SberPayMethod', true);
      model.setOption('IsAnyAdditionalPayMethodAvailable', true);
      setUpButtonSetting();
    }

    const setUpButtonSetting = function() {
      $ph.addEvent('click', model.options.Elements.SberPaySubmitButton(), function () {
        if (!checkPhoneField()) return;
        model.sberPay();
      })
    }

    var checkPhoneField = function () {
      if (model.options.IMaskSberPhoneMask.unmaskedValue.length !== 11) {
        $ph.addClass(model.options.Elements.SberPayPhoneField().parentElement, 'error');
      } else {
        $ph.removeClass(model.options.Elements.SberPayPhoneField().parentElement, 'error');
        model.sberPay();
      }
    }

    return $ph.extend(view, {
      sberPayInit: function () {
        model = Payture.__internal__.model;
        options = model.options;
        elements = options.Elements;
        appendPayButton();
        maskFields();
      }
    })
  })(Payture.__internal__.view)

  return $ph.extend(Payture, {
    SberPay: function () {
      this.__internal__.model.sberPayInit();
      this.__internal__.view.sberPayInit();
    }
  })

})(Payture)
