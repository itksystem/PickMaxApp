/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
const User = require('../../../models/user')
// const Group = require("../../../models/group.js");
const userController = require('../../../controllers/userController');
// const groupController = require("../../../controllers/groupController");
// const db = require("../../../smes/smes-dbconnector/dbConnector"); 
const config = require('../../../smes/params/params.js');
// const logger = require("../../../smes/logs/logController.js"); // Подключаем лог-файлы
// var exphbs = require('express-handlebars'); // Шаблоны
// const auth = require("../../../smes/smes-auth/auth.js"); // Работа с авторизацией, сесииями и таймлайнами
let params = config.getIniParams() // Загружаем ini-файл с настройками
const hbs = require('hbs') // Шаблоны

hbs.registerHelper('set-selected', (arg1, arg2) => {
  if (arg1 == arg2) {
    return ('selected')
  }
})

exports.getProfileTitle = function (b) {
  if (!b) {
    return 'Создать нового пользователя'
  }

  return 'Профиль пользователя'
}

exports.render = async function (request, response) { // рендерим данные на страницу
  try {
    // hbs.registerPartials(__dirname + "/views/profile/partials");
    params = config.getIniParams()
    const dto = new User(await userController.getUserById(request, response, true));
    // var groups        =  await groupController.getUserIdGroup(request, response, true);
    //    var organizations =  await groupController.getUserIdOrganization(request, response, true);
    console.log((typeof dto.user == 'undefined'))
    response.render(
      params.router.profileFile, {
        userId: request.params.id,
        mapSize: (request.params.short == 'short') ? '52rem;' : '110rem;',
        geoYandexUsed: (params.main.geoProvider == 'yandex'),
        geoGoogleUsed: (params.main.geoProvider == 'google'),
        tooltip: params.tooltip,
        labels: params.labels,
        title: exports.getProfileTitle((typeof dto.user != 'undefined')),
        avatarAlt: (typeof dto.user != 'undefined') ? dto.user.name : '',
        avatar: (typeof dto.user != 'undefined') ? params.url.avatar + dto.user.photo : '/main/images/user-default.jpg'
      })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Error', error)
  }
}
