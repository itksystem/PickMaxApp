/*******************************************************************/
/* Компонент управления списком					   */
/* Sinyagin Dmitry rel.at 10.10.2021                               */
/* 
 config.target - элемент в который проводится рендеринг компонента
 config.list[] - список
 config.list[].id - идентификатор элемента в списке
 config.list[].name - наименование атрибута списка
 config.list[].class_name - наименование класса атрибута
*/

/*******************************************************************/

class ListComponent {
   config;   
   
    
  constructor(config) {
      console.log('ListComponent=>',config);	
      this.config = config;
  }

  div(relId,  name, class_name){
   return `<div class="col ${class_name}" rel="${relId}">${name}</div>`;
  }

  render() {
     let o = this;
     let s="<div class='container'>";
     $.each(this.config.list, function( key, val) {
          console.log(val);	
          console.log(val.order[4] !== undefined);	
          s+='<div class="card" rel="'+val.id+'">'; 
          s+='<div class="row '+val.title_class+'" rel="'+val.id+'">';
          s+=(val.order[0] !== undefined) ?  o.div(val.id, val.order[0].name, val.order[0].class_name) : '';
          s+=(val.order[1] !== undefined) ?  o.div(val.id, val.order[1].name, val.order[1].class_name) : '';
          s+=(val.order[2] !== undefined) ?  o.div(val.id, val.order[2].name, val.order[2].class_name) : '';
          s+=(val.order[3] !== undefined) ?  o.div(val.id, val.order[3].name, val.order[3].class_name) : '';
          s+=(val.order[4] !== undefined) ?  o.div(val.id, val.order[4].name, val.order[4].class_name) : '';
	  s+='</div></div>';
          });
          s+="</div>"
          $(this.config.target).html(s);
  }

}
