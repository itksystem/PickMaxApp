class LinkElement extends HTMLElement {
  constructor() {
    super();
    this.link = document.createElement('a');
    return this;
  }           
 
 setUrl(url){
    this.link.href = url;
    return this;
 }

 setTextContent(text){
    this.link.textContent = text;
    return this;
 }

 renderByClass(className) {
  var elements = document.getElementsByClassName(className);
  for (var i = 0; i < elements.length; i++) {
    // Удаляем все дочерние элементы
    while (elements[i].firstChild) {
      elements[i].removeChild(elements[i].firstChild);
    }
    // Создаем новый экземпляр ссылки и вставляем его
    var newLink = this.link.cloneNode(true);
    elements[i].appendChild(newLink);
  }
}


  renderById(id) {
   var element = document.getElementById(id);
   if (element) {   // Удаляем все дочерние элементы
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
    // Создаем новый экземпляр ссылки и вставляем его
    var newLink = this.link.cloneNode(true);
    element.appendChild(newLink);
  }
 }
}