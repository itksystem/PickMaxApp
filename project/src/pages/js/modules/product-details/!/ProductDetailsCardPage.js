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
	ProductDetailsContainer.setAttribute("title", data.productName)
	ProductDetailsContainer.setAttribute("like", "1")
	ProductDetailsContainer.setAttribute("stars", "5")
	ProductDetailsContainer.setAttribute("reviews", "15")
	ProductDetailsContainer.setAttribute("discount", "15")
	ProductDetailsContainer.setAttribute("seller-type", "ORGANIZATION")
	ProductDetailsContainer.setAttribute("product-id", data.productId)
	ProductDetailsContainer.setAttribute("description", data.description)
	ProductDetailsContainer.setAttribute("price", `${data.price} ₽`)
	ProductDetailsContainer.setAttribute("del-price", `${data.price} ₽`)
	const imageUrls = data.mediaFiles
	    .map(file => file.mediaKey) // Извлекаем mediaKey из каждого объекта
        .filter(Boolean);     
      	 ProductDetailsContainer.setAttribute("images", imageUrls)
        this.addModule("ProductDetails", ProductDetailsContainer);
      }

}