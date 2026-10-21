const products = window.shopProducts;
const productsGrid = document.getElementById('products-grid');
const compareTable = document.getElementById('comparison-table');
const compareMessage = document.getElementById('comparison-message');
const compareClearButton = document.getElementById('compare-clear');
const filtersForm = document.getElementById('filters-form');
const categoryFilters = document.getElementById('category-filters');
const filtersClearButton = document.getElementById('filters-clear');
const filterResults = document.getElementById('filter-results');
const selectedProducts = new Set();
const comparisonLimit = 4;

function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';

  const imageLink = document.createElement('a');
  imageLink.href = `product.html?id=${product.id}`;
  imageLink.setAttribute('aria-label', `Открыть карточку: ${product.name}`);

  const image = document.createElement('img');
  image.className = 'product-card__image';
  image.src = product.image;
  image.alt = product.name;
  imageLink.append(image);

  const title = document.createElement('h3');
  title.className = 'product-card__title';
  const titleLink = document.createElement('a');
  titleLink.href = `product.html?id=${product.id}`;
  titleLink.textContent = product.name;
  title.append(titleLink);

  const description = document.createElement('p');
  description.className = 'product-card__description';
  description.textContent = product.description;

  const price = document.createElement('p');
  price.className = 'product-card__price';
  price.textContent = `Цена: ${product.price} руб.`;

  const detailsLink = document.createElement('a');
  detailsLink.className = 'button button--primary product-card__button';
  detailsLink.href = `product.html?id=${product.id}`;
  detailsLink.textContent = 'Подробнее';

  const compareLabel = document.createElement('label');
  compareLabel.className = 'product-compare';
  const compareCheckbox = document.createElement('input');
  compareCheckbox.type = 'checkbox';
  compareCheckbox.value = String(product.id);
  compareCheckbox.checked = selectedProducts.has(product.id);
  compareCheckbox.setAttribute('aria-label', `Добавить ${product.name} к сравнению`);
  compareLabel.append(compareCheckbox, ' Сравнить');

  card.append(imageLink, title, description, price, compareLabel, detailsLink);
  return card;
}

function renderProducts() {
  const checkedCategories = new Set(
    Array.from(categoryFilters.querySelectorAll('input:checked'), (checkbox) => checkbox.value),
  );
  const minPrice = Number(document.getElementById('price-from').value) || 0;
  const maxPriceValue = document.getElementById('price-to').value;
  const maxPrice = maxPriceValue === '' ? Number.POSITIVE_INFINITY : Number(maxPriceValue);

  if (maxPrice < minPrice) {
    productsGrid.replaceChildren();
    filterResults.textContent = 'Максимальная цена не может быть меньше минимальной.';
    return;
  }

  const filteredProducts = products.filter((product) => (
    checkedCategories.has(product.category)
    && product.price >= minPrice
    && product.price <= maxPrice
  ));
  productsGrid.replaceChildren(...filteredProducts.map(createProductCard));
  filterResults.textContent = `Найдено товаров: ${filteredProducts.length}.`;
}

function renderComparison() {
  const selected = products.filter((product) => selectedProducts.has(product.id));
  compareTable.replaceChildren();
  compareTable.hidden = selected.length < 2;

  if (selected.length < 2) {
    compareMessage.textContent = selected.length === 1
      ? 'Выберите ещё хотя бы один товар, чтобы сравнить характеристики.'
      : 'Отметьте товары в каталоге, чтобы сравнить их характеристики.';
    return;
  }

  compareMessage.textContent = `Выбрано товаров: ${selected.length}.`;
  const caption = document.createElement('caption');
  caption.className = 'visually-hidden';
  caption.textContent = 'Сравнение выбранных товаров';
  const header = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const headerTitle = document.createElement('th');
  headerTitle.scope = 'col';
  headerTitle.textContent = 'Характеристика';
  headerRow.append(headerTitle);

  selected.forEach((product) => {
    const cell = document.createElement('th');
    cell.scope = 'col';
    cell.textContent = product.name;
    headerRow.append(cell);
  });
  header.append(headerRow);

  const body = document.createElement('tbody');
  const attributes = [
    ['Цена', (product) => `${product.price} руб.`],
    ['Категория', (product) => product.category],
    ['Материал', (product) => product.material],
    ['Размер', (product) => product.size],
    ['Вес', (product) => product.weight],
    ['Цвет', (product) => product.color],
    ['Гарантия', (product) => product.warranty],
  ];

  attributes.forEach(([label, getValue]) => {
    const row = document.createElement('tr');
    const heading = document.createElement('th');
    heading.scope = 'row';
    heading.textContent = label;
    row.append(heading);

    selected.forEach((product) => {
      const cell = document.createElement('td');
      cell.textContent = getValue(product);
      row.append(cell);
    });
    body.append(row);
  });

  compareTable.append(caption, header, body);
}

if (
  productsGrid
  && compareTable
  && compareMessage
  && compareClearButton
  && filtersForm
  && categoryFilters
  && filtersClearButton
  && filterResults
) {
  const categories = [...new Set(products.map((product) => product.category))];
  categoryFilters.replaceChildren(...categories.map((category, index) => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = category;
    checkbox.checked = true;
    checkbox.id = `category-${index + 1}`;
    label.htmlFor = checkbox.id;
    label.append(checkbox, ` ${category}`);
    return label;
  }));

  renderProducts();

  filtersForm.addEventListener('submit', (event) => {
    event.preventDefault();
    renderProducts();
  });

  filtersClearButton.addEventListener('click', () => {
    categoryFilters.querySelectorAll('input').forEach((checkbox) => {
      checkbox.checked = true;
    });
    document.getElementById('price-from').value = '';
    document.getElementById('price-to').value = '';
    renderProducts();
  });

  productsGrid.addEventListener('change', (event) => {
    const checkbox = event.target;
    if (!(checkbox instanceof HTMLInputElement) || checkbox.type !== 'checkbox') {
      return;
    }

    const productId = Number(checkbox.value);
    if (checkbox.checked && selectedProducts.size >= comparisonLimit) {
      checkbox.checked = false;
      compareMessage.textContent = `Можно сравнить не более ${comparisonLimit} товаров одновременно.`;
      return;
    }

    if (checkbox.checked) {
      selectedProducts.add(productId);
    } else {
      selectedProducts.delete(productId);
    }
    renderComparison();
  });

  compareClearButton.addEventListener('click', () => {
    selectedProducts.clear();
    productsGrid.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.checked = false;
    });
    renderComparison();
  });

  renderComparison();
}