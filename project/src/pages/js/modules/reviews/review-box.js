class ReviewsSection extends HTMLElement {
  constructor(productId = null) {
    super();
    this.attachShadow({ mode: 'open' }); // Создаем Shadow DOM
    this.comments = [];
    this.api = new WebAPI();
    this.apiEndpoint =  this.api.getReviewsMethod(productId);
  }

  connectedCallback() {
    const styleLink = document.createElement('link');
    styleLink.setAttribute('rel', 'stylesheet');
    styleLink.setAttribute('href', '/src/pages/js/modules/reviews/css/review-box.css');

    const styleLink2 = document.createElement('link');
    styleLink2.setAttribute('rel', 'stylesheet');
    styleLink2.setAttribute('href', '/src/pages/plugins/fontawesome-free/css/all.min.css');

    const styleLink3 = document.createElement('link');
    styleLink2.setAttribute('rel', 'stylesheet');
    styleLink2.setAttribute('href', '/src/pages/css/bootstrap.min.css');
    this.shadowRoot.appendChild(styleLink);
    this.shadowRoot.appendChild(styleLink2);
    this.shadowRoot.appendChild(styleLink3);


    const ReviewsContainerHeader = document.createElement("div");
     ReviewsContainerHeader.className = "reviews-card-container";
     ReviewsContainerHeader.innerHTML = `<h3 class="card-title">Отзывы о </h3>`;
     this.shadowRoot.appendChild(ReviewsContainerHeader);
     this.loadReviews();
     this.render();
    }



  async loadReviews() {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Ошибка загрузки комментариев: ${response.status}`);
      }

      const data = await response.json();
      this.reviews = data.reviews || [];
      this.renderComments();
    } catch (error) {
      console.error('Ошибка при загрузке комментариев:', error);
      this.shadowRoot.getElementById('comments-list').innerHTML = `<li>Ошибка при загрузке комментариев.</li>`;
    }
  }

  getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  renderComments() {
    let createdAt = new DatetimeValidator();
    const commentsList = this.reviews.map(review => `
      <li class="review-box__comment">
        <div class="review-box__user">
          <div class="review-box__info">
            <div class="row">
              <div class="col-3 top-avatar-header">
                <div class="review-box__avatar">
                  <img src="${review.avatar || 'https://static-basket-01.wbbasket.ru/vol2/site/i/v3/user/avatar.png'}" alt="User avatar">
                </div>
                <div class="review-box__author">${review.author || 'Аноним'}</div>
                <div class="review-box__rating">${'<i class="fa-solid fa-star"></i>'.repeat(review.rating || 5)}</div>
                <div class="review-box__date">${createdAt.formatToCustom(review.created) || this.getCurrentTime()}</div>
              </div>
              <div class="col-9">
                <div class="review-box__text">${review. comment || 'Без комментария'}</div>
              </div>
            </div>
            <div class="row">
              <div class="col-9">
                ${(review.images || []).map(img => `<img src="${img.src}" class="review-box__thumbnail_image">`).join('')}
              </div>
            </div>
          </div>
        </div>
      </li>
    `).join('');

    this.shadowRoot.getElementById('comments-list').innerHTML = commentsList || '<li>Комментариев пока нет.</li>';
  }


  render() {
    this.shadowRoot.innerHTML = `
      <div id="comments-container">
        <ul id="comments-list" class="comments-list">Загрузка комментариев...</ul>
      </div>
    `;
  }
}

customElements.define('reviews-section', ReviewsSection);
