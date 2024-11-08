/* eslint-disable camelcase */
/* eslint-disable no-mixed-spaces-and-tabs */
// eslint-disable-next-line no-unused-vars
class CallChatDialog {
  constructor() {
    // eslint-disable-next-line no-console
    console.log('Start CallChatDialog creating...')
    const o = this
    o.start = true
    this.user_id = sessionStorage.getItem('userId')
    // eslint-disable-next-line no-constructor-return
    return this
  }

  exist() {
    // eslint-disable-next-line no-unneeded-ternary
    return ($('.chat_container[rel=servicecalls]').length > 0) ? true : false
  }

  create() {
    // eslint-disable-next-line no-unneeded-ternary, no-console
    console.log('loadingComponent create...')
  }

  historyClear() {
    $('.chat_container[rel=servicecalls]').html('')
  }

  historyLoad(call_id) {
    const o = this
    $.ajax({
      url: `/servicecalls/${call_id}/messages`, async: false, cache: false,
      method: 'GET',
      dataType: 'json',
      success(_o) { // если запрос успешен вызываем функцию
	     o.messages = _o.messages
   	     o.output(o.messages)
	    },
      error(_o) { // если запрос успешен вызываем функцию
   		   o.messages = null
	    }
    }).done(() => {})
    return this
  }

  append(html) {
    $('.chat_container[rel=servicecalls]').append(html)
    return this;
  }

  output(messages) {
    const o = this
    o.historyClear()
    // eslint-disable-next-line no-unused-vars
    Object.entries(messages).forEach(([key, message]) => {
   	    o.append(o.message2(message))
    })
    $('.scrollbar-inner').scrollbar()
    return this;
  }

  message(message) {
    const chat_message_class = (message.user_id == this.user_id) ? 'chat_message self' : 'chat_message alone'
    const justify_content = (message.user_id == this.user_id) ? 'justify-content-end' : 'justify-content-begin'
    message.message = message.message.replace(/\n/g, "<br />");
    return `<div class="container d-flex ${justify_content}">` +
		`<div class="${chat_message_class}">`+
		'<div class="person d-flex">' +
  		'    <div class="image float-left" >' +
	        `        <img src="/main/images/users/${message.avatar}" class="img-circle elevation-2" alt="${message.name}">` +
                '    </div>' +
  		`    <div class="name float-right" style="width: 10xpx;">${message.name}</br>` +
                `         <p class="access-position d-flex">${message.updated}</p>` +
	  	'    </div>' +
		'</div>' +
	  	'  <div class="message-body">' +
           	`    <p class="name ng-binding">${message.message}</p><br>` +
        	'   </div>' +
	        '</div>'+
          '</div>' 
  }

  message2(message) {
    const chat_message_class = (message.user_id == this.user_id) ? 'right' : ''
    const justify_content = (message.user_id == this.user_id) ? 'justify-content-end' : 'justify-content-begin'
    message.message = message.message.replace(/\n/g, "<br />");
    return `<div class="container d-flex ${justify_content}">` 
		+'<div class="direct-chat-msg">'
			+'<div class="direct-chat-infos clearfix">'
				+`<span class="direct-chat-name float-left">${message.name}</span>`
				+`<span class="direct-chat-timestamp float-right">${message.updated}</span>`
			+'</div>'
			+`<img class="direct-chat-img" src="/main/images/users/${message.avatar}" alt="${message.name}">`
			+'<div class="direct-chat-text">'
				+`${message.message}`
			+'</div>'
		+'</div>';
          +'</div>' 
  }




  messageLoad() {
    $('.loading').show()
    return this;
  }

  scrollDown() {
    const o = this
    $('a.nav-link#custom-tabs-one-3-tab').on('shown.bs.tab', _e => {
      if (o.start) {
        $('div#servicecalls_chat_container').scrollTop(
          $('div#servicecalls_chat_container').prop('scrollHeight'))
     	    }

      o.start = false
    })
    return this;
  }

  send(call_id, message, callback) {
    const o = this
    $.ajax({
      url: `/servicecalls/${call_id}/message`, async: false, cache: false,
      data: { user_id: o.user_id, message },
      method: 'POST',
      dataType: 'json',
      success(_o) { // если запрос успешен вызываем функцию
	       callback();
	       return _o.message_id
	    },
      error(_o) { // если запрос успешен вызываем функцию
	     return null
	    }
    }).done(() => {})
  }

  onSend(call_id) {
    const o = this
    o.start = false
    o.historyLoad(call_id)
    return this;
  }
}

