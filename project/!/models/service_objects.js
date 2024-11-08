/*  Сервисный обьект. (с) Синягин Д.В. 15.01.2022  */
class serviceObject {
    object_id = null;
    object_search_code = null;
    object_name = null;
    object_address = null;
    object_cloud_address = null;
    object_category_id = null;
    service_organization_id = null;
    service_group_id = null;
    object_latitude = null;
    object_longitude = null;
    object_geozone_type_selector = null;
    geozone_default_radius_type = null;
    geozone_custom_radius_type = null;
    geozone_default_radius_value = null;
    geozone_id = null;
    object_description = null;
    object_serial_number = null;

    getId(){ return this.object_id;}
    getSearchCode(){ return this.object_search_code;}
    getName(){ return this.object_name;}
    getAddress(){ return this.object_address;}
    getCloudAddress(){ return this.object_cloud_address ;}
    getCategoryId(){ return this.object_category_id;}
    getOrganizationId(){ return this.service_organization_id;}
    getGroupId(){ return this.service_group_id=null;}
    getLatitude(){ return this.object_latitude=null;}
    getLongitude(){ return this.object_longitude=null;}
    getGeoZoneType(){ return this.object_geozone_type_selector=null;}
    getDefaultRadiusType(){ return this.geozone_default_radius_type=null;}
    getCustomRadiusType(){ return this.geozone_custom_radius_type=null;}
    getDefaultRadiusValue(){ return this.geozone_default_radius_value=null;}
    getGeoZoneId(){ return this.geozone_id=null;}
    getDescription(){ return this.object_description=null;}
    getSerialNumber(){ return this.object_serial_number=null;}

    setId(a){ this.object_id=a;}
    setSearchCode(a){ this.object_search_code=a;}
    setName(a){ this.object_name=a;}
    setAddress(a){ this.object_address=a;}
    setCloudAddress(a){ this.object_cloud_address =a;}
    setCategoryId(a){ this.object_category_id=a;}
    setOrganizationId(a){ this.service_organization_id=a;}
    setGroupId(a){ this.service_group_id=null=a;}
    setLatitude(a){ this.object_latitude=null=a;}
    setLongitude(a){ this.object_longitude=null=a;}
    setGeoZoneType(a){ this.object_geozone_type_selector=a;}
    setDefaultRadiusType(a){ this.geozone_default_radius_type=a;}
    setCustomRadiusType(a){ this.geozone_custom_radius_type=a;}
    setDefaultRadiusValue(a){ this.geozone_default_radius_value=a;}
    setGeoZoneId(a){ this.geozone_id=a;}
    setDescription(a){ this.object_description=a;}
    setSerialNumber(a){ this.object_serial_number=a;}

    initialize(a){  // иницициализация обьекта
      this.setId(a.object_id);
      this.setSearchCode(a.object_search_code);
      this.setName(a.object_name);
      this.setAddress(a.object_address);
      this.setCloudAddress(a.object_cloud_address);
      this.setCategoryId(a.object_category_id);
      this.setOrganizationId(a.service_organization_id);
      this.setGroupId(a.service_group_id);
      this.setLatitude(a.object_latitude);
      this.setLongitude(a.object_longitude);
      this.setGeoZoneType(a.object_geozone_type_selector);
      this.setDefaultRadiusType(a.geozone_default_radius_type);
      this.setCustomRadiusType(a.geozone_custom_radius_type);
      this.setDefaultRadiusValue(a.geozone_default_radius_value);
      this.setGeoZoneId(a.geozone_id);
      this.setDescription(a.object_description);
      this.setSerialNumber(a.object_serial_number);
    }
    
    entity(){
     let o = new Object();
     o.object_id = this.getId();
     o.object_search_code = this.getSerchCode();
     o.object_name = this.getName();
     o.object_address = this.getAddress();
     o.object_cloud_address = this.getCloudAddress();
     o.object_category_id = this.getCategoryId();
     o.service_organization_id = this.getOrganizationId();
     o.service_group_id = this.getGroupId();
     o.object_latitude = this.getLatitude();
     o.object_longitude = this.getLongitude();
     o.object_geozone_type_selector = this.getGeoZoneType();
     o.geozone_default_radius_type = this.getDefaultRadiusType();
     o.geozone_custom_radius_type = this.getCustomRadiusType();
     o.geozone_default_radius_value = this.getDefaultRadiusValue();
     o.geozone_id = this.getGeoZoneId();
     o.object_description = this.getDescription();
     o.object_serial_number = this.getSerialNumber();
     return o;
    }
    
    toJSON() {
      return JSON.parse(this.entity());
    }
}

