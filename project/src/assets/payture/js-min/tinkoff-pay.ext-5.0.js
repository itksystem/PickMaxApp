Payture = (function (Payture) {

  Payture.__internal__.model = (function (model) {
    var getDefaults = function () {
      return {
        TinkoffIntervalTimerId: null,
        TinkoffTimeoutTimerId: null,
        TinkoffPayWaitIntervalValue: 1000*60*60*72,
        TinkoffBankListQR: null,
        TermUrl: null,
        TinkoffPayMethod: false,
        TinkoffPayPaymentMethodButtonIconPath: '/Templates/_assets/img/pay_tinkoff.svg',
        Elements: {
          TinkoffPayMethodButton: function () { return document.querySelector('.tinkoff-pay.ico')},
          TinkoffQRField: function () { return document.getElementById('tinkoff-qr')},
          TinkoffPayBlock: function () { return document.getElementById('tinkoff-pay')},
        },
        VisibilitySettings: {
          TinkoffQRImg: true,
          TinkoffQRField: true,
          TinkoffPayCoverBlock: false,
          TinkoffPayMethodButton: true,
          TinkoffBackToMainButton: false
        },
        FormValues: {
          TinkoffQRCodeId: null
        },
        LoadingButtons: {
          TinkoffQRField: false
        },
      }
    }

    var tinkoffTimerId = null;

    var tinkoffIntervalFlag = false;

    var doParseStateFromXMLNode = function (ADocument) {
      var lResult = {};
      lNode = ADocument.firstChild;
      lResult.Success = lNode.getAttribute("Success") == "True" ? true : false;
      lResult.State = lNode.getAttribute("State");
      lResult.OrderId = lNode.getAttribute("OrderId");
      lResult.ErrCode = lNode.getAttribute("ErrCode");
      lResult.Amount = lNode.getAttribute("Amount");
      lResult.Forwarded = lNode.getAttribute("Forwarded");
      lResult.MerchantContract = lNode.getAttribute("MerchantContract");
      lResult.Status = lNode.getAttribute("Status");

      return lResult;
    }

    var mcClearInterval = function () {
      if (!intervalFlag) {
        showResult(false);
      }
    }

    var showResult = function (isSuccess) {

      if (isSuccess) {
        model.onSuccess({ Success: true, ErrCode: 0, CanRetry: false, RedirectUrl: model.options.TinkoffTermUrl });
      } else {
        model.onError({ Success: false, ErrCode: 'WAITING_TIME_OVER', CanRetry: false, RedirectUrl: model.options.TermUrl });
      }

      clearInterval(model.options.TinkoffIntervalTimerId);
      clearTimeout(model.options.TinkoffTimeoutTimerId);
    }

    var getStateResponse = function (data) {
      var responseObject = doParseStateFromXMLNode(data);

      if(responseObject.State === 'Charged' || responseObject.State === 'Authorized'){
        showResult(true);
      } else if (responseObject.State === 'Rejected') {
        showResult(false);
      } else {
        intervalFlag = false;
        if(!timerId){
          mcClearInterval();
        }
      }

    }

    var checkState = function () {
      $ph.ajax({
        type: "POST",
        url: "/api/GetState?SessionId=" + model.options.QueryParams.SessionId,
        timeout: 60000,
        success: function (data) {
          getStateResponse(data);
        },
        error: function () {

        }
      }, true);
      return false;
    }

    var showMobileAPPButton = function (data) {

      var mobileButton = document.getElementById("tinkoff-mobileapp-button");
      if(!mobileButton) {
        mobileButton = document.createElement('a');
        mobileButton.setAttribute('id', 'tinkoff-mobileapp-button');
        mobileButton.setAttribute('class', 'description card-pay');
        mobileButton.setAttribute('type', 'button');
        mobileButton.setAttribute('target', '_blank');
      }

      mobileButton.setAttribute('href', data.RedirectUrl);
      mobileButton.innerHTML = 'Перейти в приложение банка';
      model.options.Elements.TinkoffQRField().append(mobileButton);
      window.location.href = data.RedirectUrl;
    }

    var onSBPPaySuccess = function (data) {
      var options = model.options,
        lang = options.Language;

      function mobileCheck () {
        let check = false;
        let a = navigator.userAgent||navigator.vendor||window.opera;
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;
        return check;
      }

      if (!mobileCheck()) {
        options.Elements.TinkoffQRField().innerHTML = data.RedirectUrl;
      }

      timerId = setInterval(function () {
        tinkoffIntervalFlag = true;
        checkState();
      }, 5000);

      model.setOption('TinkoffIntervalTimerId', timerId);
      var tinkoffTimeoutTimerId = setTimeout(function () {
        clearInterval(tinkoffTimerId);
        mcClearInterval(options.FormValues.TinkoffQRCodeId);
      }, model.options.TinkoffPayWaitIntervalValue);

      model.setOption('TinkoffTimeoutTimerId', tinkoffTimeoutTimerId);
    }

    return $ph.extend(model, {
      tinkoffPayInit: function () {
        var options = Object.assign({}, model.options);
        model.options = model.createOptions(model.options, getDefaults(), options);
      },

      tinkoffPay: function () {
        var  options = model.options;
        model.setOption('LoadingButtons.TinkoffQRField', true);

        function mobileCheck () {
          let check = false;
          let a = navigator.userAgent||navigator.vendor||window.opera;
          if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;
          return check;
        }

        $ph.ajax({
          url: '/' + (model.options.PayMethod === "inpay" ? "apim":"vwapi") + '/PaySubmit',
          data: $ph.getQuery({
            Data: 'Key=' + encodeURIComponent(options.FormValues.Key) +
                  ';qr=' + !mobileCheck() +
                  ';isNoCard=true' + ';NoCardPaymentType=TinkoffPay' +
                  (model.options.FormValues.AddCard && model.options.FormValues.AddCard === 'True' ? ';AddCard=True':''),
            //,
            Json: true
          }),
          type: 'POST',
          timeout: 60000,
          success: function (data) {
            model.setOption('LoadingButtons.TinkoffQRField', false);
            if (data.Success) {
              model.setOption('FormValues.TinkoffQRCodeId', data.RedirectUrl);
              model.setOption('TinkoffTermUrl', data.TermUrl);
              onSBPPaySuccess(data);
              model.setOption('VisibilitySettings.TinkoffBlock', true);

              if(mobileCheck()) {
                showMobileAPPButton(data)
              }

              if(data.Key){
                model.setNewKey(data.Key)
              }
            } else {
              model.onIntermediateError(data);
            }
          },
          error: function (res) {
            model.onError(res);
            model.setOption('LoadingButtons.TinkoffQRField', false);
          }
        })

      }
    })
  })(Payture.__internal__.model)


  Payture.__internal__.view = (function (view) {
    var model = null,
      options = null,
      elements = null;

    var createPayButton = function () {
      var options = model.options,
          lang = options.Language;
      var container = document.querySelector('#payment-methods');
      var containerInner = document.querySelector('#payment-methods .payment-methods__inner');
      if (container) {
        if (!options.Elements.TinkoffPayMethodButton()) {
          var button = document.createElement('button');
          button.setAttribute('type', 'button');
          button.setAttribute('class', 'button ico tinkoff-pay');
          button.setAttribute('data-type', 'tinkoff_pay');
          button.innerHTML = '<span>'+options.TemplateText[lang]['Pay']+'</span>&nbsp;&nbsp;<img src="'+options.TinkoffPayPaymentMethodButtonIconPath+'"/>';
          if (containerInner) {
            containerInner.append(button);
          } else {
            container.append(button);
          }
          button.style.display = 'block';
        }

        var blockHTML = '<div id="tinkoff-pay" class="tinkoff-pay d-none">'+
          '<div class="sbp-pay__container">'+
          '<div id="tinkoff-qr" class="sbp-pay__qr">'+
          '</div>'+
          '<div class="sbp-pay__steps">'+
            '<div class="sbp-pay__steps-caption"><b>Оплата через камеру телефона</b></div>'+

            '<div class="sbp-pay__steps-item"><b>1</b> Отсканируйте QR-код с помощью камеры телефона</div>'+
            '<div class="sbp-pay__steps-item"><b>2</b> По ссылке откройте приложение банка и следуйте инструкциям</div>'+
            '<div class="sbp-pay__steps-item"><b>3</b> Оплата произойдет в течение минуты</div>'+

            '<div class="sbp-pay__steps-divider">&nbsp;</div>'+
            '<div class="sbp-pay__steps-caption"><b>Оплата через приложение банка</b></div>'+

            '<div class="sbp-pay__steps-item"><b>1</b> Перейдите в раздел «Платежи»</div>'+
            '<div class="sbp-pay__steps-item"><b>2</b> Выберите пункт «Оплата по QR&#8209;коду» и отсканируйте QR&#8209;код</div>'+
            '<div class="sbp-pay__steps-item"><b>3</b> Оплата произойдет в течение минуты</div>'+

          '</div>'+
          '</div>'+
          '<button class="button button__cancel" type="button" translate-value="Cancel">Отмена</button>'+
          '</div>';

        model.addListener('TinkoffPayMethod', function (fieldName, fieldNewValue) {
          if (fieldNewValue) {
            model.setOption('VisibilitySettings.CardPayMethodButtonContainer', 'reset');
            $ph.addEvent('click', elements.CardPayMethodButton(), view.paymentTypeHandlingCallback);
            $ph.addEvent('click', elements.TinkoffPayMethodButton(), view.paymentTypeHandlingCallback);
            model.setOption('PaymentType', 'init');
          }
        })
        document.querySelector('.button.pay').insertAdjacentHTML('beforebegin', blockHTML);
        model.setOption('TinkoffPayMethod', true);
        model.setOption('IsAnyAdditionalPayMethodAvailable', true);
      }
    }

    var setupButtonSettings = function () {
      model.addListener('VisibilitySettings.TinkoffPayBlock', function (fieldName, fieldNewValue) {
        if (model.options.VisibilitySettings.PayMethodsBlocks) {
          model.setOption('VisibilitySettings.TinkoffBackToMainButton', fieldNewValue);
        }
      })
    }

    var listenResponse = function () {
      model.addListener('TinkoffBankListQR', function (fieldName, fieldNewValue) {
        if (fieldNewValue) {

        }
      })
    }

    return $ph.extend(view, {
      tinkoffPayInit: function () {
        model = Payture.__internal__.model;
        options = model.options;
        elements = options.Elements;
        createPayButton();
        setupButtonSettings();
        listenResponse();
      }
    })
  })(Payture.__internal__.view)

  return $ph.extend(Payture, {
    TinkoffPay: function () {
      this.__internal__.model.tinkoffPayInit();
      this.__internal__.view.tinkoffPayInit();
    }
  })

})(Payture)
