/*******************************************************************/
/* Загрузчик компонента управления запросом                        */
/* Sinyagin Dmitry rel.at 19.03.2022                               */
/*******************************************************************/
// eslint-disable-next-line no-undef
const chat = new CallChatDialog()
chat.historyLoad($('#output.servicecall-editor').attr('call-id'))
chat.scrollDown()

$('#call-comment-send').off('click').on('click', () => {
  const callId = $('#output.servicecall-editor').attr('call-id')
  const message = $('#chat-message-input-dialog').val()
  let result = chat.send(callId, message,   ()=>{
       chat.start = true
       chat.historyLoad(callId)
       chat.scrollDown()
       $('#chat-message-input-dialog').val('')
   }
 );
})
