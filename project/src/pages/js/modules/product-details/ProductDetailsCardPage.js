class ProductDetailsSection extends PageBuilder {
    constructor(containerId) {
        super(containerId);
        this.api = new WebAPI();
    }
    /**
     * Generates the ProductDetailsSection section module.
     */
   ProductDetailsCardContainer(data){
        const ProductDetailsContainer = document.createElement("product-details");
	ProductDetailsContainer.setAttribute("title", data?.productName)
	ProductDetailsContainer.setAttribute("like", data?.like || 0 )
	ProductDetailsContainer.setAttribute("stars", data?.rating || 0)
	ProductDetailsContainer.setAttribute("reviews", data?.reviews || 0)
	ProductDetailsContainer.setAttribute("rating", data?.rating || 0)
	ProductDetailsContainer.setAttribute("discount", data?.discount || 0)
	ProductDetailsContainer.setAttribute("seller-type", data?.sellerType || "INDIVIDUAL")
	ProductDetailsContainer.setAttribute("product-id", data?.productId || null)
	ProductDetailsContainer.setAttribute("description", data?.description || '')
	ProductDetailsContainer.setAttribute("price", (data?.price) ? `${data.price} ₽` : `Цена по договоренности`)
	ProductDetailsContainer.setAttribute("del-price", (data?.price) ? `${data.price} ₽` : null)
	const imageUrls = data.mediaFiles
	    .map(file => file.mediaKey) // Извлекаем mediaKey из каждого объекта
        .filter(Boolean);     
      	 ProductDetailsContainer.setAttribute("images", imageUrls)
        this.addModule("ProductDetails", ProductDetailsContainer);
      }

}