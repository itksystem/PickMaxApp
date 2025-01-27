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

        const ReviewsContainer = document.createElement("div");
        ReviewsContainer.className = "review-card-container";


        const ReviewsInfoContainer = document.createElement("dropdown-section");
        ReviewsInfoContainer.innerHTML = `
<span slot="title">Как оставить отзыв о товаре и продавце</span>
<p>Ваш отзыв о товаре и продавце очень важен для нас и других покупателей. Он поможет улучшить качество обслуживания и сделать покупки ещё приятнее.
</br>
<h6> 📦 Что можно указать в отзыве?</h6>
<p>Ваше впечатление о товаре: качество, соответствие описанию, удобство использования.</br>
Уровень обслуживания продавца: скорость обработки заказа, упаковка, доставка.</br>
Общая удовлетворенность покупкой.</p>
<h6>✍️ Оставить отзыв легко:</h6>
<p>Перейдите в раздел «Заказы».</br>
Выберите товар и нажмите «Оставить отзыв».</br>
Опишите свой опыт и добавьте фотографии (если возможно).</br>
Каждое ваше слово помогает нам становиться лучше. </br> Спасибо за доверие и обратную связь!</p>
<div class="w-100 text-end"><button class="btn btn-review-default" style="border-color: #ddd;"><a href="/reviews/${data?.productId}/my/review/page">Оставить отзыв</a></button></div>
`;
	this.addModule("ReviewInfo",ReviewsInfoContainer);


        const ReviewsContainerHeader = document.createElement("div");
        ReviewsContainerHeader.className = "card-header";
        ReviewsContainerHeader.innerHTML = 
          this.isMyReviewPage(window.location.pathname)
		? `<h3 class="card-title">Ваш отзыв о товаре</h3>`
		: `<h3 class="card-title">Отзывы о товаре</h3>`;
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
        styleLink3.setAttribute('rel', 'stylesheet');
        styleLink3.setAttribute('href', '/src/pages/css/bootstrap.min.css');
        ReviewsContainer.appendChild(styleLink3);

        if(this.isMyReviewPage(window.location.pathname)){
          const ReviewContainer = document.createElement("review-form");
          ReviewContainer.innerHTML = ``;
  	  ReviewContainer.setAttribute("rating", data?.rating || 0)
  	  ReviewContainer.setAttribute("product-id", data?.productId || 0)
          ReviewsContainer.appendChild(ReviewContainer);           
        }
 
        this.addModule("Reviews", ReviewsContainer);
    }


 isMyReviewPage(url) {
    return /^\/reviews\/[a-f0-9\-]+\/my\/review\/page$/.test(url);
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