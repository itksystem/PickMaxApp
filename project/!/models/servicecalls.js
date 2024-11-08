/* eslint-disable prefer-rest-params */
/* eslint-disable max-statements-per-line */
/* eslint-disable camelcase */
/*                                                */
/*  Oбьект - запрос. (с) Синягин Д.В. 21.03.2022  */
/*                                                */
// eslint-disable-next-line no-undef
const db = require('../../../../smes/smes-dbconnector/dbConnector')
// eslint-disable-next-line no-undef
const config = require('../../../../smes/params/params.js')
const params = config.getIniParams()

// eslint-disable-next-line no-undef
module.exports = class serviceCall {
  constructor(a = null) {
    if (a == null) {
      return this
    }

    this.initialize(a)
    return this
  }

  /* GET */
  getId() {
    return this.id
  }

  getExitId() {
    return this.ext_id
  }

  getObjectSearchCode() {
    return this.object_search_code
  }

  getObjectId() {
    return this.object_id
  }

  getUserId() {
    return this.user_id
  }

  getUserName() {
    return this.user_name
  }

  getUserSearchCode() {
    return this.user_search_code
  }

  getMileage() {
    return this.mileage
  }

  getUserGroupId() {
    return this.group_id
  }

  getUserGroupName() {
    return this.group_name
  }

  getUserOrgId() {
    return this.org_id
  }

  getUserOrgName() {
    return this.org_name
  }

  getFinishDate() {
    return this.finishdate
  }

  getCreated() {
    return this.created
  }

  getDeadline() {
    return this.deadline
  }

  getAssigned() {
    return this.assigned
  }

  getTripTime() {
    return this.triptime
  }

  getTripDate() {
    return this.tripdate
  }

  getLocatorId() {
    return this.locator_id
  }

  getTripLatitude() {
    return this.trip_latitude
  }

  getTripLongitude() {
    return this.trip_longitude
  }

  getInformation() {
    return this.information
  }

  getSolution() {
    return this.solution
  }

  getStatus() {
    return this.status
  }

  getTrip() {
    return this.trip
  }

  getMode() {
    return this.mode
  }

  getModeName() {
    return this.mode_name
  }

  getStartLocalAddressExclude() {
    return this.start_local_address_exclude
  }

  getLastDayArrivalExclude() {
    return this.last_day_arrival_exclude
  }

  getReturnLocalAddressExclude() {
    return this.return_local_address_exclude
  }

  getStartLocalAddressInclude() {
    return this.start_local_address_include
  }

  getReturnLocalAddressInclude() {
    return this.return_local_address_include
  }

  // SET
  setId(v = null) {
    this.id = v
    return this
  }

  setExitId(v = null) {
    this.ext_id = v; return this
  }

  setUserGroupId(v = null) {
    this.group_id = v; return this
  }

  setUserGroupName(v = null) {
    this.group_name = v; return this
  }

  setUserOrgId(v = null) {
    this.org_id = v; return this
  }

  setUserOrgName(v = null) {
    this.org_name = v; return this
  }

  setCustomerId(v = null) {
    this.customer_id = v
    return this
  }

  getCustomerId() {
    return this.customer_id
  }

  setCustomerPrefix(v = null) {
    this.customer_prefix = v
    return this
  }

  getCustomerPrefix() {
    return this.customer_prefix
  }

  setObjectSearchCode(v = null) {
    this.object_search_code = v; return this
  }

  setObjectId(v = null) {
    this.object_id = v; return this
  }

  setUserId(v = null) {
    this.user_id = v; return this
  }

  setUserName(v = null) {
    this.user_name = v; return this
  }

  setLocatorId(v = null) {
    this.locator_id = v; return this
  }

  setUserSearchCode(v = null) {
    this.user_search_code = v; return this
  }

  setMileage(v = null) {
    this.mileage = v; return this
  }

  setFinishDate(v = null) {
    this.finishdate = v; return this
  }

  setCreated(v = null) {
    this.created = v; return this
  }

  setDeadline(v = null) {
    this.deadline = v; return this
  }

  setAssigned(v = null) {
    this.assigned = v; return this
  }

  setTripTime(v = null) {
    this.triptime = v; return this
  }

  setTripDate(v = null) {
    this.tripdate = v; return this
  }

  getReported() {
    return this.reported
  }

  setReported(v = null) {
    this.reported = v
    return this
  }

  setTripLatitude(v = null) {
    this.trip_latitude = (v != null) ? v.split(',')[0] : null
    return this
  }

  setTripLongitude(v = null) {
    this.trip_longitude = (v != null) ? v.split(',')[1] : null
    return this
  }

  setInformation(v = null) {
    this.information = v; return this
  }

  setSolution(v = null) {
    this.solution = v; return this
  }

  setStatus(v = null) {
    this.status = v; return this
  }

  setTrip(v = null) {
    this.trip = v; return this
  }

  setMode(v = null) {
    this.mode = v; return this
  }

  setModeName(v = null) {
    this.mode_name = v; return this
  }

  setStartLocalAddressExclude(v = null) {
    this.start_local_address_exclude = (v == 1)
    return this
  }

  setLastDayArrivalExclude(v = null) {
    this.last_day_arrival_exclude = (v == 1)
    return this
  }

  setReturnLocalAddressExclude(v = null) {
    this.return_local_address_exclude = (v == 1)
    return this
  }

  setStartLocalAddressInclude(v = null) {
    this.start_local_address_include = (v == 1)
    return this
  }

  setReturnLocalAddressInclude(v = null) {
    this.return_local_address_include = (v == 1)
    return this
  }

  async findByUserId(userId = null) { // Загрузка пользователя по ID
    if (userId != null) {
      try {
        const result = await db.querySQL(params[params.dbtype.provider].query.getUserById, request.params.id)
        const withOutResponse = (arguments[arguments.length - 1] == true)
        if (withOutResponse) {
          return result[0]
        }

        this.setUserId(result[0].user_id)
      } catch (error) {
        console.error(error)
        this.setUserId(null)
      }
    } else {
      this.setUserId(null)
    }

    return this
  }

  async findByUserSearchCode(UserSearchCode = null) { // Загрузка пользователя по searchCode
    if (UserSearchCode != null) {
      try {
        const result = await db.querySQL(params[params.dbtype.provider].query.getUserById, UserSearchCode)
        const withOutResponse = (arguments[arguments.length - 1] == true)
        if (withOutResponse) {
          return result[0]
        }

        this.setUserId(result[0].user_id)
      } catch (error) {
        console.error(error)
        this.setUserSearchCode(null)
      }
    } else {
      this.setUserSearchCode(null)
    }

    return this; 
  }

  async findByCallId(ID = null) { // Загрузка пользователя по searchCode
    try {
      const result = await db.querySQL(params[params.dbtype.provider].query.getCall, [ID, ID])
      this.initialize(result[0])
    } catch (error) {
      console.error(error)
      return this
    }

    return this
  }

  async SaveCallToDatabase(ID = null) { // Сохранение запроса в базе
    try {
      const result = await db.querySQL(params[params.dbtype.provider].query.ХХХХХgetCall, [ID, ID])
      this.initialize(result[0])
    } catch (error) {
      console.error(error)
      return this
    }

    return this
  }

  clear() { // Очистка обьекта
    this.setId()
    this.setExitId()
    this.setObjectSearchCode()
    this.setObjectId()

    this.setUserId()
    this.setUserName()
    this.setUserSearchCode()
    this.setUserGroupId()
    this.setUserGroupName()
    this.setUserOrgId()
    this.setUserOrgName()
    this.setMileage()
    this.setLocatorId()

    this.setCustomerId()
    this.setCustomerPrefix()

    this.setFinishDate()
    this.setCreated()
    this.setDeadline()
    this.setAssigned()
    this.setTripTime()
    this.setTripDate()

    this.setTripLatitude()
    this.setTripLongitude()

    this.setInformation()
    this.setSolution()

    this.setStatus()
    this.setTrip()
    this.setMode()
    this.setModeName()

    this.setStartLocalAddressExclude()
    this.setLastDayArrivalExclude()
    this.setStartLocalAddressExclude()
    this.setStartLocalAddressTripInclude()
    this.setReturnLocalAddressInclude()

    this.setReported()

    return this
  }

  initialize(a = null) { // иницициализация обьекта на основании атрибутов ввнесенного обьекта
    if (a == null) {
      return this
    }

    this.setId(a.id)
    this.setExitId(a.ext_id)
    this.setObjectSearchCode(a.object_search_code)
    this.setObjectId(a.object_id)

    this.setCustomerId(a.customer_id)

    this.setUserId(a.user_id)
    this.setUserName(a.user_name)
    this.setUserSearchCode(a.user_search_code)
    this.setUserGroupId(a.group_id)
    this.setUserGroupName(a.group_name)
    this.setUserOrgId(a.org_id)
    this.setUserOrgName(a.org_name)
    this.setMileage(a.mileage)
    this.setLocatorId(a.locator_id)

    this.setFinishDate(a.finishdate)
    this.setCreated(a.created)
    this.setDeadline(a.deadline)
    this.setAssigned(a.assigned)
    this.setTripTime(a.triptime)
    this.setTripDate(a.tripdate)
    this.getCustomerId(a.customer_id)
    this.getCustomerPrefix(a.customer_prefix)

    this.setTripLatitude(a.trip_location)
    this.setTripLongitude(a.trip_location)

    this.setInformation(a.information)
    this.setSolution(a.solution)

    this.setStatus(a.status)
    this.setTrip(a.trip)
    this.setMode(a.mode)
    this.setModeName(a.mode_name)

    this.setStartLocalAddressExclude(a.start_local_address_exclude)
    this.setLastDayArrivalExclude(a.last_day_arrival_exclude)
    this.setReturnLocalAddressExclude(a.return_local_address_exclude)
    this.setStartLocalAddressInclude(a.start_local_address_include)
    this.setReturnLocalAddressInclude(a.return_local_address_include)

    this.setReported(a.reported)

    return this
  }

  entity() {
    const obj = {}
    obj.id = this.getId()
    obj.ext_id = this.getExitId()
    obj.status = this.getStatus()
    obj.person = this.getUserName()
    obj.information = this.getInformation()
    obj.solution = this.getSolution()
    obj.customer_id = this.getCustomerId()
    obj.customer_prefix = this.getCustomerPrefix()

    const user = {}
    user.id = this.getUserId()
    user.name = this.getUserName()
    user.search_code = this.getUserSearchCode()
    user.group_id = this.getUserGroupId()
    user.group_name = this.getUserGroupName()
    user.org_id = this.getUserOrgId()
    user.org_name = this.getUserOrgName()

    user.org_name = this.getUserOrgName()
    obj.user = user

    const object = {}
    object.search_code = this.getObjectSearchCode()
    object.id = this.getObjectId()
    obj.object = object

    const dates = {}
    dates.finishdate = this.getFinishDate()
    dates.created = this.getCreated()
    dates.deadline = this.getDeadline()
    dates.assigned = this.getAssigned()
    dates.triptime = this.getTripTime()
    dates.tripdate = this.getTripDate()
    obj.dates = dates

    const details = {}
    details.trip_latitude = this.getTripLatitude()
    details.trip_longitude = this.getTripLongitude()
    details.trip = this.getTrip()
    details.mode = this.getMode()
    details.mode_name = this.getModeName()
    details.milage = this.getMileage()
    details.locator_id = this.getLocatorId()
    obj.details = details

    const options = {}
    options.start_local_address_exclude = this.getStartLocalAddressExclude()
    options.last_day_arrival_exclude = this.getLastDayArrivalExclude()
    options.return_local_address_exclude = this.getReturnLocalAddressExclude()
    options.start_local_address_include = this.getStartLocalAddressInclude()
    options.return_local_address_include = this.getReturnLocalAddressInclude()
    obj.options = options

    obj.reported = this.getReported()

    return obj
  }

  toJSON() {
    return JSON.parse(this.entity())
  }
}

