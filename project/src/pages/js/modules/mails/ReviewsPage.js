class ReviewsCardPage extends PageBuilder {
    constructor(containerId) {
        super(containerId);
	this.containerId = containerId;
        this.api = new WebAPI();
    }
/**
* Generates the ReviewsContainer section module.
*/
   ReviewsContainer(data){
        const ProductShortCardContainer = document.createElement("product-short-card");
	ProductShortCardContainer.setAttribute("title", data?.productName)
	ProductShortCardContainer.setAttribute("like", data?.like || 0 )
	ProductShortCardContainer.setAttribute("stars", data?.rating || 0)
	ProductShortCardContainer.setAttribute("reviews", data?.reviews || 0)
	ProductShortCardContainer.setAttribute("rating", data?.rating || 0)
	ProductShortCardContainer.setAttribute("discount", data?.discount || 0)
	ProductShortCardContainer.setAttribute("seller-type", data?.sellerType || "INDIVIDUAL")
	ProductShortCardContainer.setAttribute("product-id", data?.productId || null)
	ProductShortCardContainer.setAttribute("description", data?.description || '')
	ProductShortCardContainer.setAttribute("price", (data?.price) ? `${data.price} ₽` : `Цена по договоренности`)
	ProductShortCardContainer.setAttribute("del-price", (data?.price) ? `${data.price} ₽` : null)
	const imageUrls = data.mediaFiles
	    .map(file => file.mediaKey) // Извлекаем mediaKey из каждого объекта
        .filter(Boolean);     
      	 ProductShortCardContainer.setAttribute("images", imageUrls)
        this.addModule("ProductShortCard", ProductShortCardContainer);


        const ReviewsContainer = document.createElement("div");
        ReviewsContainer.className = "review-card-container";

        const ReviewsContainerHeader = document.createElement("div");
        ReviewsContainerHeader.className = "card-header";
        ReviewsContainerHeader.innerHTML = `<h3 class="card-title">Комментарии к товару</h3>`;
        ReviewsContainer.appendChild(ReviewsContainerHeader);

        const ReviewsItemsContainer = document.createElement("div");
        ReviewsItemsContainer.className = "review-items-box";
        ReviewsItemsContainer.innerHTML = ``;
        ReviewsContainer.appendChild(ReviewsItemsContainer);

        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', '/src/pages/js/modules/reviews/css/review-box.css');
        ReviewsContainer.appendChild(styleLink);

        const styleLink2 = document.createElement('link');
        styleLink2.setAttribute('rel', 'stylesheet');
        styleLink2.setAttribute('href', '/src/pages/plugins/fontawesome-free/css/all.min.css');
        ReviewsContainer.appendChild(styleLink2);

        const styleLink3 = document.createElement('link');
        styleLink2.setAttribute('rel', 'stylesheet');
        styleLink2.setAttribute('href', '/src/pages/css/bootstrap.min.css');
        ReviewsContainer.appendChild(styleLink3);

        this.addModule("Reviews", ReviewsContainer);
    }


 ReviewsEmptyPage(){
   const container = document.querySelector('.review-items-box');
   if (!container) {
     throw new Error(`Container with class .review-items-box not found.`);
   }
   const ReviewsEmptyContainer = document.createElement("div");
   ReviewsEmptyContainer.className = "review-empty-container";
   ReviewsEmptyContainer.innerHTML = `
	<section class="text-center page-padding block-space">
	    <span class="text-center">У данного товара пока нет отзывов :( </span>
	</section>`;
   container.appendChild(ReviewsEmptyContainer);
 }

}