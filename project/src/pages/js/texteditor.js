
    tinymce.init({
      selector: '.editor-textarea',
      plugins: 'textcolor emoticons link image table',
      menubar: false, 
      mobile: {
        menubar: false
       },
      toolbar:[ 'forecolor backcolor bold italic underline strikethrough image emoticons  align lineheight table | blocks fontfamily fontsize | checklist numlist bullist indent outdent |'],
  setup: function(editor) {
   	  editor.on('init', function () {
		      // Устанавливаем размер шрифта
		      editor.getBody().style.fontSize = '0.8rem'; // Замените на нужный размер шрифта
	    });
          editor.on('PostRender', function() {
            var footer = document.querySelector('.tox-statusbar');
            if (footer) {
              footer.style.display = 'none';
            }
          })
	}
    });


