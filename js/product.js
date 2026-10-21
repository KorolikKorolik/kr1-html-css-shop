const productId = Number(new URLSearchParams(window.location.search).get('id'));
const product = window.shopProducts.find((item) => item.id === productId);
const productContent = document.getElementById('product-content');
const productError = document.getElementById('product-error');

if (!product) {
  productContent.hidden = true;
  productError.hidden = false;
} else {
  document.title = `${product.name} — Учебный интернет-магазин`;
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('product-description').textContent = product.description;
  document.getElementById('product-price').textContent = `${product.price} руб.`;

  const image = document.getElementById('product-image');
  image.src = product.image;
  image.alt = product.name;

  const specifications = [
    ['Категория', product.category],
    ['Материал', product.material],
    ['Размер', product.size],
    ['Вес', product.weight],
    ['Цвет', product.color],
    ['Гарантия', product.warranty],
  ];
  const specificationsBody = document.getElementById('product-specifications');

  specifications.forEach(([label, value]) => {
    const row = document.createElement('tr');
    const heading = document.createElement('th');
    heading.scope = 'row';
    heading.textContent = label;
    const cell = document.createElement('td');
    cell.textContent = value;
    row.append(heading, cell);
    specificationsBody.append(row);
  });
}
