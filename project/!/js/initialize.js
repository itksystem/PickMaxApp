$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip();
  $.widget.bridge('uibutton', $.ui.button)
  new flux(false).onload('page-load','main');
  $('.textarea-scrollbar').scrollbar();
  let permissions  = new Permissions();
   permissions.load();

// Грузим меню
  let menu  = new Menu();
     menu.load();
     menu.NewMenu('.treeview-left-menu');
     menu.Item('ul.nav-pills', 'fa-check-circle', {description: "Запросы", name: "servicecalls"}, 'nav-item-redirect', permissions.access('service_article_servicecalls'));
     menu.Item('ul.nav-pills', 'fa-check-circle', {description: "Публикации", name: "smm"}, 'nav-item-redirect', permissions.access('service_article_smm'));
                                                                                                                                     
     menu.Item('ul.nav-pills', 'fa-laptop-house', {description: "Обьекты", name: "objects"}, 'nav-item-redirect',permissions.access('service_article_objects'));
     menu.Item('ul.nav-pills', 'fa-globe', {description: "Геозоны", name: "geozones"}, 'nav-item-redirect',permissions.access('service_article_geozones'));
     menu.Item('ul.nav-pills', 'fa-users-cog', {description: "Контакты", name: "contacts"}, 'nav-item-redirect',permissions.access('service_article_contacts'));

     menu.subMenu('ul.nav-pills', 'nav-treeview', 'fa-users', {description: "Справочники", name: "catalogs"}, 'nav-item-redirect');

     menu.Item('ul.nav-treeview', 'fa-users', {description: "Группы", name: "groups", article: "catalogs" }, 'nav-item-redirect',permissions.access('service_article_groups'));
     menu.Item('ul.nav-treeview', 'fa-play', {description: "Функции", name: "functions", article: "catalogs" }, 'nav-item-redirect',permissions.access('service_article_functions'));
     menu.Item('ul.nav-treeview', 'fa-sitemap', {description: "Сервисы", name: "services", article: "catalogs" }, 'nav-item-redirect',permissions.access('service_article_services'));
     menu.Item('ul.nav-treeview', 'fa-user-lock', {description: "Роли", name: "roles", article: "catalogs" }, 'nav-item-redirect',permissions.access('service_article_roles'));
     menu.Item('ul.nav-treeview', 'fa-key', {description: "Лицензии", name: "licenses", article: "catalogs" }, 'nav-item-redirect',permissions.access('service_article_licenses'));

     menu.Article('ul.nav-pills', 'ДОКУМЕНТАЦИЯ');
     menu.Item('ul.nav-pills', 'fa-image', {description: "Фото и видео материалы", name: "media"}, 'nav-item-redirect',permissions.access('service_article_media'));
     menu.Item('ul.nav-pills', 'fa-image', {description: "Wiki", name: "wiki"}, 'nav-item-redirect',permissions.access('service_article_wiki'));

     menu.Article('ul.nav-pills', 'О НАС');
     menu.Item('ul.nav-pills', 'fa-address-card', {description: "Наши контакты", name: "about_company"}, 'nav-item-redirect',permissions.access('service_article_about_company'));
     menu.Item('ul.nav-pills', 'fa-envelope', {description: "Вакансии", name: "vacancions"}, 'nav-item-redirect',permissions.access('service_article_licenses'));

     menu.active(window.location.href.toString().split(window.location.host)[1]);
// 
      let orgSelector = new OrgWogSelectorComponent().load();
      $('.scrollbar-inner').scrollbar();   // включение скролинга?     

});

