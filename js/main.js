const orderDialog = document.getElementById('order-dialog');

const orderButtons = document.querySelectorAll('.product-card__button');

const closeDialogButton = document.getElementById('close-order-dialog');

const selectedProductInput = document.getElementById('selected-product');

if (window.shopProducts) {
  document.querySelectorAll('#popular .product-card').forEach((card, index) => {
    const product = window.shopProducts[index];
    const title = card.querySelector('.product-card__title');
    const description = card.querySelector('.product-card__description');
    const price = card.querySelector('.product-card__price');
    const orderButton = card.querySelector('.product-card__button');

    if (!product || !title || !description || !price || !orderButton) {
      return;
    }

    card.id = `product-${product.id}`;
    description.textContent = product.description;
    price.textContent = `Цена: ${product.price} руб.`;

    const imageLink = document.createElement('a');
    imageLink.href = `product.html?id=${product.id}`;
    imageLink.setAttribute('aria-label', `Открыть карточку: ${product.name}`);
    const image = document.createElement('img');
    image.className = 'product-card__image';
    image.src = product.image;
    image.alt = product.name;
    imageLink.append(image);
    card.insertBefore(imageLink, title);

    const titleLink = document.createElement('a');
    titleLink.href = `product.html?id=${product.id}`;
    titleLink.textContent = product.name;
    title.replaceChildren(titleLink);

    const detailsLink = document.createElement('a');
    detailsLink.className = 'button button--secondary product-card__details';
    detailsLink.href = `product.html?id=${product.id}`;
    detailsLink.textContent = 'Подробнее';

    const actions = document.createElement('div');
    actions.className = 'product-card__actions';
    card.insertBefore(actions, orderButton);
    actions.append(detailsLink, orderButton);
  });
}

if (orderDialog && orderButtons.length > 0) {
  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const productName = button.dataset.product;
      if (selectedProductInput && productName) {
        selectedProductInput.value = productName;
      }
      if (typeof orderDialog.showModal === 'function') {
        orderDialog.showModal();
      } else {
        orderDialog.setAttribute('open', 'open');
      }
    });
  });
}

if (closeDialogButton && orderDialog) {
  closeDialogButton.addEventListener('click', () => {
    if (typeof orderDialog.close === 'function') {
      orderDialog.close();
    } else {
      orderDialog.removeAttribute('open');
    }
  });
}

const orderForm = document.getElementById('order-form');

const successMessage = document.getElementById('success-message');

if (orderForm && successMessage) {
  orderForm.addEventListener('submit', (event) => {

    event.preventDefault();

    const formElements = Array.from(orderForm.elements);

    formElements.forEach((element) => {
      if (element.willValidate) {
        element.removeAttribute('aria-invalid');
      }
    });

    if (!orderForm.checkValidity()) {
      formElements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          element.setAttribute('aria-invalid', 'true');
        }
      });

      orderForm.reportValidity();
      return;
    }

    successMessage.hidden = false;

    orderForm.reset();

    if (orderDialog && typeof orderDialog.close === 'function') {
      orderDialog.close();
    }
  });
}
