const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const templateCard = document.getElementById("template-card").content;
const fragment = document.createDocumentFragment();
const templateFooter = document.getElementById("template-footer").content;
const templateCart = document.getElementById("template-carrito").content;
let cart = {};

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});
cards.addEventListener("click", (e) => {
  addCart(e);
});

items.addEventListener("click", (e) => {
  btnAction(e);
});

const fetchData = async () => {
  try {
    const res = await fetch("api.json");
    const data = await res.json();
    showCards(data);
  } catch (error) {
    console.log(error);
  }
};

const showCards = (data) => {
  data.forEach((e) => {
    templateCard.querySelector("h5").textContent = e.title;
    templateCard.querySelector("p").textContent = e.precio;
    templateCard.querySelector("img").setAttribute("src", e.thumbnailUrl);
    templateCard.querySelector(".btn-dark").dataset.id = e.id;
    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  cards.appendChild(fragment);
};

const addCart = (e) => {
  if (e.target.classList.contains("btn-dark")) {
    setCart(e.target.parentElement);
  }
  e.stopPropagation();
};

const setCart = (obj) => {
  const product = {
    id: obj.querySelector(".btn-dark").dataset.id,
    title: obj.querySelector("h5").textContent,
    price: obj.querySelector("p").textContent,
    quantity: 1,
  };
  if (cart.hasOwnProperty(product.id)) {
    product.quantity = cart[product.id].quantity + 1;
  }
  cart[product.id] = { ...product };
  showCartHtml();
};

const showCartHtml = () => {
  items.innerHTML = "";
  Object.values(cart).forEach((e) => {
    templateCart.querySelector("th").textContent = e.id;
    templateCart.querySelectorAll("td")[0].textContent = e.title;
    templateCart.querySelectorAll("td")[1].textContent = e.quantity;
    templateCart.querySelector(".btn-info").dataset.id = e.id;
    templateCart.querySelector(".btn-danger").dataset.id = e.id;
    templateCart.querySelector("span").textContent = e.quantity * e.price;

    const clone = templateCart.cloneNode(true);
    fragment.appendChild(clone);
  });

  items.appendChild(fragment);

  showFooter();
};

const showFooter = () => {
  footer.innerHTML = "";
  if (Object.keys(cart).length === 0) {
    footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `;
    return;
  }

  const totalQuantity = Object.values(cart).reduce(
    (acc, { quantity }) => acc + quantity,
    0
  );
  const totalPrice = Object.values(cart).reduce(
    (acc, { quantity, price }) => acc + quantity * price,
    0
  );
  templateFooter.querySelectorAll("td")[0].textContent = totalQuantity;
  templateFooter.querySelector("span").textContent = totalPrice;

  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);

  const btnDeleteAll = document.getElementById("vaciar-carrito");
  btnDeleteAll.addEventListener("click", () => {
    cart = {};
    showCartHtml();
  });
};

const btnAction = (e) => {
  //add to cart
  if (e.target.classList.contains("btn-info")) {
    const product = cart[e.target.dataset.id];
    product.quantity++;
    cart[e.target.dataset.id] = { ...product };
    showCartHtml();
  }
  if (e.target.classList.contains("btn-danger")) {
    const product = cart[e.target.dataset.id];
    product.quantity--;
    if (product.quantity === 0) {
      delete cart[e.target.dataset.id];
    }
    showCartHtml();
  }

  e.stopPropagation();
};
