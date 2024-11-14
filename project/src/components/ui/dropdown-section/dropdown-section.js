  document.querySelectorAll('.toggle-content').forEach(button => {
    button.addEventListener('click', function() {
        // Используем 'this' для ссылки на кнопку, по которой кликнули
        const collapse = this.closest('.header').nextElementSibling.querySelector('.collapse');
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
         console.log(isExpanded);
        // Показать или скрыть контент
        collapse.style.display = isExpanded ? 'none' : 'block';
        this.setAttribute('aria-expanded', !isExpanded);

        // Найти родительский элемент <section> и добавить класс
        let  section = this.closest('.faq-item');
        if (!section)  section = this.closest('section');
        if (section) {
            if (isExpanded) {
                section.classList.remove('dropdown-open');
            } else {
                section.classList.add('dropdown-open');
            }
        }
    });
  });
