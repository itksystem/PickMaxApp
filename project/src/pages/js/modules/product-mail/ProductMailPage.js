class ProductMailPage extends PageBuilder {
    constructor(containerId) {
        super(containerId);
	this.containerId = containerId;
        this.api = new WebAPI();
    }
/**
* Generates the MailContainer section module.
*/
   ProductMailContainer(data){
        const ProductShortCardContainer = document.createElement("product-short-card");
	ProductShortCardContainer.setAttribute("title", data?.productName)
	ProductShortCardContainer.setAttribute("like", data?.like || 0 )
	ProductShortCardContainer.setAttribute("stars", data?.rating || 0)
	ProductShortCardContainer.setAttribute("Mails", data?.Mails || 0)

	ProductShortCardContainer.setAttribute("discount", data?.discount || 0)
	ProductShortCardContainer.setAttribute("seller-type", data?.sellerType || "INDIVIDUAL")
	ProductShortCardContainer.setAttribute("product-id", data?.productId || null)
	ProductShortCardContainer.setAttribute("description", data?.description || '')
	ProductShortCardContainer.setAttribute("price", (data?.price) ? `${data.price} ₽` : `Цена по договоренности`)
	ProductShortCardContainer.setAttribute("del-price", (data?.price) ? `${data.price} ₽` : null)
	const imageUrls = (data?.mediaFiles || [] )
	    .map(file => file?.mediaKey) // Извлекаем mediaKey из каждого объекта
        .filter(Boolean);     
      	 ProductShortCardContainer.setAttribute("images", imageUrls.join(','));
        this.addModule("ProductShortCard", ProductShortCardContainer);

        const MailsContainer = document.createElement("div");
        MailsContainer.className = "mail-card-container";

        const MailsContainerHeader = document.createElement("div");
        MailsContainerHeader.className = "card-header";
        MailsContainerHeader.innerHTML = `<h3 class="card-title">Ваша переписка</h3>`;
        MailsContainer.appendChild(MailsContainerHeader);

        const MailsItemsContainer = document.createElement("div");
        MailsItemsContainer.className = "mail-items-box";
        MailsItemsContainer.innerHTML = ``;
        MailsContainer.appendChild(MailsItemsContainer);

        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', '/src/pages/js/modules/product-mail/css/mail-box.css');
        MailsContainer.appendChild(styleLink);

        const styleLink2 = document.createElement('link');
        styleLink2.setAttribute('rel', 'stylesheet');
        styleLink2.setAttribute('href', '/src/pages/plugins/fontawesome-free/css/all.min.css');
        MailsContainer.appendChild(styleLink2);

        const styleLink3 = document.createElement('link');
        styleLink3.setAttribute('rel', 'stylesheet');
        styleLink3.setAttribute('href', '/src/pages/css/bootstrap.min.css');
        MailsContainer.appendChild(styleLink3);

        const MailContainer = document.createElement("mail-form");
        MailContainer.innerHTML = ``;
  	MailContainer.setAttribute("product-id", data?.productId || 0)
        MailsContainer.appendChild(MailContainer);           
         
        this.addModule("ProductMailInfo", MailsContainer);
    }


 isProductMailsPage(url) {
    return /^\/products\/[a-f0-9\-]+\/mails\/page$/.test(url);
 }


 ProductMailEmptyPage(){
   const container = document.querySelector('.mail-items-box');
   if (!container) {
     throw new Error(`Container with class .mail-items-box not found.`);
   }
   const MailsEmptyContainer = document.createElement("div");
   MailsEmptyContainer.className = "mail-empty-container";
   MailsEmptyContainer.innerHTML = `
	<section class="text-center page-padding block-space">
	    <span class="text-center">У вас еще не было переписки с продавцом данного товара</span>
	</section>`;
   container.appendChild(MailsEmptyContainer);
 }

}