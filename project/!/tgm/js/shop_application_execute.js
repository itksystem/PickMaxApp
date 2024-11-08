/* eslint-disable no-undef */
$(document).ready(() => {
  // eslint-disable-next-line no-undef, indent
  const api = new WebAPI()
  // eslint-disable-next-line no-unused-vars, no-undef
  const webRequest = new WebRequest()
  const user = new CurrentUser()
  const shop = new CurrentShop(shopId)
  shop.setCurrentShopId(shopId)

  $.ajax({
    cache: false,
    method: 'GET',
    dataType: 'json',
    url: api.getShopOrderMethod(shopId, $('#application_id').val()),
    beforeSend() {},
    success(response) {
      let ownerChatId = null

      // Append order number
      $(`div.application-execute-card[rel="${$('#application_id').val()}"]`).append(
        `<div class="row order"><h2>Заказ № ${response.number}</h2></div>`
      )

      // Append order details
      $.each(response.order, (index, item) => {
        $(`div.card[rel="${$('#application_id').val()}"]`).append(
          `<div class="row order dotted">
                        <div class="col-1">${index + 1}</div>
                        <div class="col-6">${item.title}</div>
                        <div class="col-2">${item.price}${item.currency_type}</div>
                        <div class="col-2"><img class="order_product_image" src="${item.card_image}"></div>
                    </div>`
        )
        ownerChatId = item.owner_chat_id
      })

      // Check if the current user is the owner
      if (ownerChatId === user.getUserId()) {
        appendCustomerDetails(response)
      }
    },
    error(err) {
      // eslint-disable-next-line no-console
      console.log(err)
    },
    async: true
  })

  function appendCustomerDetails(orderData) {
    const applicationId = $('#application_id').val()

    // Append customer and recipient details
    $(`div.application-execute-card[rel="${applicationId}"]`).append(`
            <div class="row order"><h2>Данные заказчика</h2></div>
            <div class="row order dotted"><div class="col"><i class="fa fa-user"></i>&nbsp;&nbsp;Заказчик:</div><div class="col">${orderData.buyer_name}</div></div>
            <div class="row order dotted"><div class="col"><i class="fa fa-phone"></i>&nbsp;&nbsp;Телефон заказчика:</div><div class="col">${orderData.buyer_phone}</div></div>
            <div class="row order"><div class="col"><i class="fa fa-map"></i>&nbsp;&nbsp;Адрес заказчика:</div><div class="col">${orderData.buyer_address}</div></div>
            <div class="row order"><h2>Данные получателя</h2></div>
            <div class="row order dotted"><div class="col"><i class="fa fa-user"></i>&nbsp;&nbsp;Получатель:</div><div class="col">${orderData.recipient_name}</div></div>
            <div class="row order dotted"><div class="col"><i class="fa fa-phone"></i>&nbsp;&nbsp;Телефон получателя:</div><div class="col">${orderData.recipient_phone}</div></div>
            <div class="row order"><div class="col"><i class="fa fa-map"></i>&nbsp;&nbsp;Адрес доставки:</div><div class="col">${orderData.recipient_address}</div></div>\
         `+(
		(orderData.order_message)
		? `<div class="row order" ><h2>Комментарий к доставке</h2></div><div class="row order"><div class="col">${orderData.order_message}</div></div>`
		: ``)
        )

    // Append comment input and status buttons
    $(`div.application-execute-card[rel="${applicationId}"]`).append(`
      <div class="card card-execute-buttons-dialog">
      <div class="card-body">
	<div class="row order">
          <div class="col">
            <textarea id="executer_application_comment" rows=3 placeholder="Введите комментарий по исполнению заказа" 
                      class="form-control editor-textarea"></textarea>
            </div>
          </div>
	<div class="row order">
          <div class="col"> 
               <h2>Установите текущий статус заказа</h2>
           </div>
       </div>
	<div class="row order">
          <div class="col"> 
            <button type='button' class='btn w-100 application_paid_btn' status='PAID' rel='${applicationId}'>
                <i class='fa fa-money-bill'></i> Оплачен
             </button>
          </div>
          <div class="col"> 
            <button type='button' class='btn w-100 application_execute_btn' status='DONE' rel='${applicationId}'>
                <i class='fa fa-check'></i> Исполнен
            </button>
          </div>
          <div class="col"> 
            <button type='button' class='btn w-100 application_reject_btn' status='REJECTED' rel='${applicationId}'>
                <i class='fa fa-ban'></i> Отменен
            </button>
           </div>
       </div>
	<div class="row order">
          <dl> 
            <dt>Пояснения</dt>
	     <dd>
                    Если магазин принял оплату удаленно, установите статус "Оплачен".
            </dd>
	     <dd>
                    После передачи товара установите статус "Выполнено".
            </dd>
	     <dd>
                    Если клиент отказался от товара, установите статус "Отменен".
            </dd>
           </dl>
       </div>
       </div>
       </div>
        `)

    // Event listeners for status buttons
    $('.application_paid_btn, .application_execute_btn, .application_reject_btn').on('click', function () {
      const status = $(this).attr('status')
      const applicationId = $(this).attr('rel')
      const comment = $('#executer_application_comment').val()

      $.ajax({
        url:  api.setShopOrderActionMethod(shopId, $('#application_id').val()),
        type: 'POST',
        data: api.setShopOrderActionPayload({ applicationId: applicationId, comment: comment,  status : status }),
        success(data) {
          // eslint-disable-next-line no-console
          console.log(data)
          redirectToAnotherPage(`application_execute_${status.toLowerCase()}/${applicationId}`)
        },
        error(data) {
          // eslint-disable-next-line no-console
          console.log(data)
          redirectToAnotherPage('application_failed')
        }
      })
    })
  }
})
