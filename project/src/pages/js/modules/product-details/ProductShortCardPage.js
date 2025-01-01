class ProductShortCardSection extends PageBuilder {
    constructor(containerId) {
        super(containerId);
        this.api = new WebAPI();
    }
    /**
     * Generates the ProductShortCardSection section module.
     */
   ProductShortCardCardContainer(data){
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
      }

}