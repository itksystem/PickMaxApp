/*
 UI Kit. ver. 2022-01-16
 Sinyagin D.V. 
*/

class uiComponents{
     loading = null;  
     idleTimeoutDialog = null;
     constructor() {
         console.log('Start uiComponents creating..');
         this.loading = new loadingComponent();
	 this.idleTimeoutDialog = new idleTimeoutDialogComponent();
	 this.flux = new flux();
         console.log('finish uiComponents creating.');

/*	$('.tooltip').click(function(e){
	    $(this).hide();
	});
*/

    }
}
let ui = new uiComponents();
