Payture = (function (Payture) {

  Payture.__internal__.model = (function (model) {
    var getDefaults = function () {
      return {
        IntervalTimerId: null,
        TimeoutTimerId: null,
        SBPPayWaitIntervalValue: 1000*60*60*72,
        BankListQR: null,
        TermUrl: null,
        SBPPayMethod: false,
        SBPPayPaymentMethodButtonIconPath: '/Templates/_assets/img/pay_sbp.svg',
        Elements: {
          SBPPayMethodButton: function () { return document.querySelector('.sbp-pay.ico')},
          SBPQRField: function () { return document.getElementById('qr')},
          SBPQRImg: function () { return document.getElementById('qr-img')},
          SBPPayBlock: function () { return document.getElementById('sbp-pay')},
        },
        VisibilitySettings: {
          SBPQRImg: true,
          SBPQRField: true,
          SBPPayCoverBlock: false,
          SBPPayMethodButton: true,
          SBPBackToMainButton: false
        },
        FormValues: {
          QRCodeId: null
        },
        LoadingButtons: {
          SBPQRField: false
        },
      }
    }

    var timerId = null;

    var intervalFlag = false;

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
        model.onSuccess({ Success: true, ErrCode: 0, CanRetry: false, RedirectUrl: model.options.TermUrl });
      } else {
        model.onError({ Success: false, ErrCode: 'WAITING_TIME_OVER', CanRetry: false, RedirectUrl: model.options.TermUrl });
      }

      clearInterval(model.options.IntervalTimerId);
      clearTimeout(model.options.TimeoutTimerId);
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

      var mobileButton = document.getElementById("sbp-mobileapp-button");
      if(!mobileButton) {
        mobileButton = document.createElement('a');
        mobileButton.setAttribute('id', 'sbp-mobileapp-button');
        mobileButton.setAttribute('class', 'description card-pay');
        mobileButton.setAttribute('type', 'button');
        mobileButton.setAttribute('target', '_blank');
      }

      mobileButton.setAttribute('href', data.QRCodePayload);

      /* window.mobileAndTabletCheck = function() {
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
      }; */

      function mobileCheck () {
        let check = false;
        let a = navigator.userAgent||navigator.vendor||window.opera;
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;
        return check;
      }

      if (mobileCheck()) {
        window.location.href = data.QRCodePayload;
        model.setOption('BankListQR', data.QRCodePayload);
      }
    }

    var onSBPPaySuccess = function (data) {
      var options = model.options,
        lang = options.Language;

      var qr = new QRious({
        element: options.Elements.SBPQRImg(),
        value: data.QRCodePayload,
        background: 'white',
        foreground: 'black',
        backgroundAlpha: 1,
        foregroundAlpha: 1,
        level: 'L', // Error correction level of the QR code (L, M, Q, H)
        mime: 'image/png',
        size: 200,
        padding: null
      })

      timerId = setInterval(function () {
        intervalFlag = true;
        checkState();
      }, 5000);

      model.setOption('IntervalTimerId', timerId);
      var timeoutTimerId = setTimeout(function () {
        clearInterval(timerId);
        mcClearInterval(options.FormValues.QRCodeId);
      }, model.options.SBPPayWaitIntervalValue);

      model.setOption('TimeoutTimerId', timeoutTimerId);
    }

    return $ph.extend(model, {
      sbpPayInit: function () {
        var options = Object.assign({}, model.options);
        model.options = model.createOptions(model.options, getDefaults(), options);
      },

      sbpPay: function () {
        var  options = model.options;
        model.setOption('LoadingButtons.SBPQRField', true);

        $ph.ajax({
          type: "POST",
          url: "/ncapi/GetQRCode",
          data: $ph.getQuery({
            Key: options.FormValues.Key,
            AddRedirectUrl: true,
            AddCard: model.options.ApiPath === '/vwapi'
          }),
          timeout: 60000,
          success: function (data) {
            model.setOption('LoadingButtons.SBPQRField', false);
            if (data.Success) {
              model.setOption('FormValues.QRCodeId', data.QRCodeId);
              model.setOption('TermUrl', data.TermUrl);
              onSBPPaySuccess(data);
              model.setOption('VisibilitySettings.SBPBlock', true);

              if(window.innerWidth < 1138) {
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
            model.setOption('LoadingButtons.SBPQRField', false);
          }
        });
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
        if (!options.Elements.SBPPayMethodButton()) {
          var button = document.createElement('button');
          button.setAttribute('type', 'button');
          button.setAttribute('class', 'button ico sbp-pay');
          button.setAttribute('data-type', 'sbp_pay');
          button.innerHTML = '<span>'+options.TemplateText[lang]['Pay']+'</span>&nbsp;&nbsp;<img src="'+options.SBPPayPaymentMethodButtonIconPath+'"/>';
          if (containerInner) {
            containerInner.append(button);
          } else {
            container.append(button);
          }
          button.style.display = 'block';
        }

        var blockHTML = '<div id="sbp-pay" class="sbp-pay d-none">'+
          '<div class="sbp-pay__description">'+
            'Проверьте подключен ли ваш банк к системе быстрых платежей <a href="https://sbp.nspk.ru/participants/" target="_new">здесь</a>'+
          '</div>'+
          '<div class="sbp-pay__container">'+
          '<div id="qr" class="sbp-pay__qr">'+
            '<img src="" id="qr-img">'+
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

        model.addListener('SBPPayMethod', function (fieldName, fieldNewValue) {
          if (fieldNewValue) {
            model.setOption('VisibilitySettings.CardPayMethodButtonContainer', 'reset');
            model.setOption('PaymentType', 'init');
            $ph.addEvent('click', elements.CardPayMethodButton(), view.paymentTypeHandlingCallback);
            $ph.addEvent('click', elements.SBPPayMethodButton(), view.paymentTypeHandlingCallback);
          }
        })
        document.querySelector('.button.pay').insertAdjacentHTML('beforebegin', blockHTML);
        model.setOption('SBPPayMethod', true);
        model.setOption('IsAnyAdditionalPayMethodAvailable', true);
      }
    }

    var setupButtonSettings = function () {
      model.addListener('VisibilitySettings.SBPPayBlock', function (fieldName, fieldNewValue) {
        if (model.options.VisibilitySettings.PayMethodsBlocks) {
          model.setOption('VisibilitySettings.SBPBackToMainButton', fieldNewValue);
        }
      })
    }

    var listenResponse = function () {
      model.addListener('BankListQR', function (fieldName, fieldNewValue) {
        if (fieldNewValue) {
          showBankList(fieldNewValue)
        }
      })
    }

    var bankListJSON = [
      {
          "bankName": "Сбербанк",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000111.png",
          "schema": "bank100000000111"
      },
      {
          "bankName": "ВТБ",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000005.png",
          "schema": "bank100000000005"
      },
      {
          "bankName": "Райффайзенбанк",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000007.png",
          "schema": "bank100000000007"
      },
      {
          "bankName": "Тинькофф",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000004.png",
          "schema": "bank100000000004"
      },
      {
          "bankName": "Альфа-Банк",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000008.png",
          "schema": "bank100000000008"
      },
      {
          "bankName": "Промсвязьбанк",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000010.png",
          "schema": "bank100000000010"
      },
      {
          "bankName": "Газпромбанк",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000001.png",
          "schema": "bank100000000001"
      },
      {
          "bankName": "Открытие",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000015.png",
          "schema": "bank100000000015"
      },
      {
          "bankName": "Россельхозбанк",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000020.png",
          "schema": "bank100000000020"
      },
      {
          "bankName": "Росбанк",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000012.png",
          "schema": "bank100000000012"
      },
      {
          "bankName": "Совкомбанк",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000013.png",
          "schema": "bank100000000013"
      },
      {
          "bankName": "Юникредит Банк",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000030.png",
          "schema": "bank100000000030"
      },
      {
          "bankName": "Авангард",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000028.jpg",
          "schema": "bank100000000028"
      },
      {
          "bankName": "Газэнергобанк",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000043.png",
          "schema": "bank100000000043"
      },
      {
          "bankName": "СКБ-банк",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000003.png",
          "schema": "bank100000000003"
      },
      {
          "bankName": "Модульбанк",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000099.png",
          "schema": "bank100000000099"
      },
      {
          "bankName": "МКБ",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000025.png",
          "schema": "bank100000000025"
      },
      {
          "bankName": "АБ РОССИЯ",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000095.png",
          "schema": "bank100000000095"
      },
      {
          "bankName": "Бланк банк",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000053.png",
          "schema": "bank100000000053"
      },
      {
          "bankName": "Банк ВБРР",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000049.png",
          "schema": "bank100000000049"
      },
      {
          "bankName": "Банк ДОМ.РФ",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000082.png",
          "schema": "bank100000000082"
      },
      {
          "bankName": "Банк ПСКБ",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000087.png",
          "schema": "bank100000000087"
      },
      {
          "bankName": "Экспобанк",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000044.png",
          "schema": "bank100000000044"
      },
      {
          "bankName": "МС Банк Рус",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000229.png",
          "schema": "bank100000000229"
      },
      {
          "bankName": "НОВИКОМБАНК",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000177.png",
          "schema": "bank100000000177"
      },
      {
          "bankName": "Банк Санкт-Петербург",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000029.png",
          "schema": "bank100000000029"
      },
      {
          "bankName": "РНКБ Банк",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000011.png",
          "schema": "bank100000000011"
      },
      {
          "bankName": "БАНК ОРЕНБУРГ",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000124.png",
          "schema": "bank100000000124"
      },
      {
          "bankName": "Агропромкредит",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000118.png",
          "schema": "bank100000000118"
      },
      {
          "bankName": "Почта Банк",
          "logoURL": "https://qr.nspk.ru/proxyapp/logo/bank100000000016.png",
          "schema": "bank100000000016"
      }
    ]

    var showBankList = function (qrPayload) {
        var bankListContainer = null;
        var ul = null;
        if (document.getElementById('sbp-bank-list')) {
          bankListContainer = document.getElementById('sbp-bank-list');
        } else {
          bankListContainer = document.createElement('div');
          bankListContainer.setAttribute('id', 'sbp-bank-list');
          bankListContainer.setAttribute('class', 'sbp-bank-list');

          var title  = document.createElement('div');
          title.innerHTML = '<div class="slide-up-widget__header">'+
            '<div class="header"><div class="header__logo"></div>'+
            '<div class="header__description"><div class="provider-name" style="display: block;">Payture</div>'+
            '<div class="provider-description" translate-value="ProviderDescription" style="display: block;">Процессинговый центр</div>'+
            '</div></div>'+
            '<div class="slide-up-widget__header-close-btn">×</div>'+
            '<div class="slide-up-widget__header-text">Подтвердите оплату в Вашем банковском приложении</div></div>';
          bankListContainer.append(title);

          ul =  document.createElement('ul');
          ul.setAttribute('id', 'sbp-bank-list-ul');
          ul.setAttribute('class', 'sbp-bank-list-ul');

          bankListContainer.append(ul);

          var li = document.createElement('li');
          li.innerHTML = '<a href="'+qrPayload+'"><div><span>Открыть банк по-умолчанию</span></div><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 13L11 8L6 3" stroke="black"/></svg></a>';
          ul.append(li);

          bankListJSON.map(function (item, index) {
            li =  document.createElement('li');//intent://qr.nspk.ru/AD10000O3I16PNFO9SQOIIM9JFQ70GD9?type=02&bank=100000000014&sum=375700&cur=RUB&crc=97A3
            li.innerHTML = '<a href="'+qrPayload.replace('https://', item.schema + '://')+'#Intent;scheme=bank100000000016;end"><div><img src="'+item.logoURL+'" ' + (item.schema === 'bank100000000016' ? "height='14'":"") + ' width="30" loading="lazy" alt="'+item.bankName+'"><span>'+item.bankName+'</span></div><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 13L11 8L6 3" stroke="black"/></svg></a>';
            ul.append(li);
          })
          document.querySelector('body').append(bankListContainer);
          $ph.addEvent('click', document.querySelector('.slide-up-widget__header-close-btn'), function (event) {
            bankListContainer.style.display = 'none';
          })
        }
        bankListContainer.style.display = 'block';
    }

    return $ph.extend(view, {
      sbpPayInit: function () {
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
    SBPPay: function () {
      this.__internal__.model.sbpPayInit();
      this.__internal__.view.sbpPayInit();
    }
  })

})(Payture)
