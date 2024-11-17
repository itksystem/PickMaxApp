Payture = (function (Payture) {

  Payture.__internal__.model = (function (model) {
      var getDefaults = function () {
          return {
              QiwiPayIntervalTimerId: null,
              QiwiPayTimeoutTimerId: null,
              QiwiIntervalFlag: false,
              QiwiWaitIntervalValue: 360000,
              QiwiPayPaymentMethodButtonIconPath: '/Templates/_assets/img/pay_qiwi.png',
              QiwiPayMethod: false,              
              Elements: {
                  QiwiPayButton: function () { return document.querySelector('.qiwi-pay.ico')},
                  QiwiCoverBlock: function () { return document.querySelector('#overlay-wait') },
              },
              VisibilitySettings: {
                  QiwiPayButton: true,
                  QiwiCoverBlock: false,
                  QiwiPayBackToMainButton: false
              },
              DisableSettings: {
                  QiwiPayButton: false,
              },
              LoadingButtons: {
                  QiwiPayButton: false,
              },
          }
      }

      var timerId = null;

      var mcClearInterval = function () {
          if (!model.options.QiwiIntervalFlag) {
              showResult(false, '', ['Оплата не произведена', 'Время ожидания окончено']);
          }
      }

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

      var clickOnLink = function (event) {
          event.preventDefault();
          window.top.open(this.href, '_blank');
      }

      var showResult = function (isSuccess, urls, errors) {
          model.setOption('InnerHTML.ResultBlockHeader', isSuccess ? errors[0] : errors[1]);
          model.setOption('InnerHTML.ResultBlockReturnMessage', "Через несколько секунд вы будете перемещены на страницу магазина или нажмите <a id='pay-link' href=" + (model.options.TermUrl) + ">сюда</a> чтобы перейти без ожидания");
          document.querySelector('#pay-link').addEventListener('click', clickOnLink);

          var icon = document.querySelector('.return-icon__' + (isSuccess ? "true" : "false"));
          if (icon) { icon.style.display = 'block'; }

          model.setOption('VisibilitySettings.PayForm', false);
          model.setOption('VisibilitySettings.ResultBlock', true);

          if (isSuccess) {
              window.parent.postMessage(JSON.stringify({ method: 'Payture.PaymentSuccess' }), '*');
          } else {
              window.parent.postMessage(JSON.stringify({ method: 'Payture.PaymentFail', errCode: 0, errText: errors[1] }), '*');
          }

          setTimeout(function () {
              if (!document.hidden && model.options.TermUrl) {
                  window.location.href = model.options.TermUrl;
              }
          }, 3000);
      }

      var getStateResponse = function (data) {
          var responseObject = doParseStateFromXMLNode(data);
          document.querySelector('#pay-link').removeEventListener('click', clickOnLink);

          if (responseObject.State === 'Charged') {
              showResult(true, '', ['Оплата произведена', 'Время ожидания окончено']);
          } else if (responseObject.State === 'Rejected') {
              showResult(false, '', ['Оплата не произведена', 'Время ожидания окончено']);
          } else {
              intervalFlag = false;
              if (!timerId) {
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


      var onQiwiPaySuccess = function (data) {
          var options = model.options,
              lang = options.Language;

          model.setOption('VisibilitySettings.PayForm', false);
          model.setOption('VisibilitySettings.ResultBlock', true);

          model.setOption('InnerHTML.ResultBlockHeader', '');
          model.setOption('InnerHTML.ResultBlockMessage', 'Сейчас вы будете перенаправлены на страницу оплаты Qiwi Кошелек');
          model.setOption('InnerHTML.ResultBlockReturnMessage', `
              Если окно не открылось, перейдите пожалуйста <a href="${data.RedirectUrl}" style="color: #007BFF; text-decoration: none;">по этой ссылке</a> для завершения оплаты
          `);

          var newTab = window.open(data.RedirectUrl);
          if (newTab) {
              newTab.focus();
          } else {
              console.error('Could not open a new tab');
          }

          var timerId = setInterval(function () {
              model.setOption('QiwiIntervalFlag', true);
              checkState();
          }, 5000);

          model.setOption('QiwiIntervalTimerId', timerId);

          var timeoutTimerId = setTimeout(function () {
              clearInterval(options.QiwiIntervalTimerId);
          }, model.options.QiwiWaitIntervalValue);

          model.setOption('QiwiTimeoutTimerId', timeoutTimerId);
      }

      return $ph.extend(model, {
          qiwiPayInit: function () {
              var options = Object.assign({}, model.options);
              model.options = model.createOptions(model.options, getDefaults(), options);
          },
          qiwiPayRemovePayConfirmCover: function () {
              model.setOption('VisibilitySettings.QiwiCoverBlock', false);
              clearInterval(model.options.QiwiPayIntervalTimerId);
              clearTimeout(model.options.QiwiPayTimeoutTimerId);
          },
          qiwiPay: function () {
              var options = model.options;
              model.setOption('LoadingButtons.QiwiPayButton', true);

              $ph.ajax({
                  type: "POST",
                  url: "/apim/PaySubmit",
                  data: $ph.getQuery({
                      Data: 'Key=' + encodeURIComponent(options.FormValues.Key) +
                          ';isNoCard=true' + ';NoCardPaymentType=2',
                      Json: true
                  }),
                  timeout: 60000,
                  success: function (data) {
                      if (data.Success) {
                          onQiwiPaySuccess(data);
                          model.setOption('VisibilitySettings.QiwiPayButton', false);
                          model.setOption('VisibilitySettings.PayButton', false);
                      } else {
                          model.onError(data);
                      }
                      model.setOption('LoadingButtons.QiwiPayButton', false);
                  },
                  error: function (res) {
                      model.setOption('LoadingButtons.QiwiPayButton', false);
                      model.onError(res);
                  }
              });
          },
      });
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
          if (container) {
              if (!options.Elements.QiwiPayButton()) {
                  var button = document.createElement('button');
                  button.setAttribute('type', 'button');
                  button.setAttribute('class', 'button ico qiwi-pay');
                  button.setAttribute('data-type', 'qiwi_pay');
                  button.innerHTML = '<span>'+options.TemplateText[lang]['Pay']+'</span>&nbsp;&nbsp;<img src="'+options.QiwiPayPaymentMethodButtonIconPath+'"/>';

                  if (containerInner) {
                      containerInner.append(button);
                  } else {
                      container.append(button);
                  }
                  button.style.display = 'block';
              }
              $ph.addEvent('click', elements.QiwiPayButton(), function (event) {
                  event.preventDefault();
                  model.qiwiPay();
              });
              model.addListener('QiwiPayMethod', function (fieldName, fieldNewValue) {
                if (fieldNewValue) {
                  model.setOption('VisibilitySettings.CardPayMethodButtonContainer', 'reset');
                  model.setOption('PaymentType', 'init');
                  $ph.addEvent('click', elements.CardPayMethodButton(), view.paymentTypeHandlingCallback);
                  $ph.addEvent('click', elements.QiwiPayButton(), view.paymentTypeHandlingCallback);
                }
              })
              model.setOption('QiwiPayMethod', true);
              model.setOption('IsAnyAdditionalPayMethodAvailable', true);
          }
      }

      var listenCoverBlockVisibility = function () {
          model.addListener('VisibilitySettings.QiwiCoverBlock', function (fieldName, fieldNewValue) {
              var el = document.querySelector('.button.back-qiwi-pay');
              if (fieldNewValue) {
                  if (!el) {
                      var button = document.createElement('button');
                      button.setAttribute('type', 'button');
                      button.setAttribute('class', 'button back-qiwi-pay');
                      button.innerHTML = model.options.TemplateText[model.options.Language]['Cancel'];
                      model.options.Elements.QiwiCoverBlock().append(button);
                      $ph.addEvent('click', button, function (event) {
                          model.qiwiPayRemovePayConfirmCover();
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
          qiwiPayInit: function () {
              model = Payture.__internal__.model;
              options = model.options;
              elements = options.Elements;
              createButton();
              listenCoverBlockVisibility();
          }
      })
  })(Payture.__internal__.view)

  return $ph.extend(Payture, {
      QiwiPay: function () {
          this.__internal__.model.qiwiPayInit();
          this.__internal__.view.qiwiPayInit();
      }
  })
})(Payture)