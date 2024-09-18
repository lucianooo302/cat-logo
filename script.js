const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const feedbackContainer = document.getElementById("feedback-container");

// Array para armazenar os itens no carrinho
let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
  cartModal.style.display = "flex";
});

// Fechar o modal do carrinho
cartModal.addEventListener("click", function(event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// Fechar o modal do carrinho
closeModalBtn.addEventListener("click", function() {
  cartModal.style.display = "none";
});

// Evento para adicionar ao carrinho ao clicar no botão
menu.addEventListener("click", function(event) {
  if (event.target.classList.contains("add-to-cart-btn") || event.target.closest(".add-to-cart-btn")) {
    const button = event.target.closest(".add-to-cart-btn");
    const productDiv = button.closest('.product-item');
    const name = button.getAttribute("data-name");
    const price = parseFloat(button.getAttribute("data-price"));

    addToCart(name, price);
  }
});

// Função para adicionar o item ao carrinho
function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1
    });
  }

  updateCartModal(); // Atualiza o modal do carrinho
  showFeedbackMessage(); // Mostra a mensagem de feedback
}

// Função para mostrar a mensagem de feedback
function showFeedbackMessage() {
  const feedbackMessage = document.createElement('div');
  feedbackMessage.textContent = 'Item adicionado ao carrinho!';
  feedbackMessage.style.backgroundColor = '#4CAF50';
  feedbackMessage.style.color = 'white';
  feedbackMessage.style.padding = '10px';
  feedbackMessage.style.borderRadius = '5px';
  feedbackMessage.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
  feedbackMessage.style.marginBottom = '5px';
  feedbackMessage.style.opacity = '1';
  feedbackMessage.style.transition = 'opacity 0.5s ease';

  feedbackContainer.appendChild(feedbackMessage);

  // Ocultar a mensagem após 2 segundos
  setTimeout(() => {
    feedbackMessage.style.opacity = '0';
    setTimeout(() => {
      feedbackMessage.remove();
    }, 500); // Tempo suficiente para a transição de opacidade
  }, 2000);
}

// Função para atualizar o modal do carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(3)}</p>
        </div>
        <button class="remove-from-cart-btn" data-name="${item.name}">
          Remover
        </button>
      </div>
    `;

    total += item.price * item.quantity;
    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toFixed(3).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  cartCounter.innerHTML = cart.length;
}

// Função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");
    removeItemCart(name);
  }
});

// Remover item específico do carrinho
function removeItemCart(name) {
  const index = cart.findIndex(item => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
    } else {
      cart.splice(index, 1);
      updateCartModal();
    }
  }
}

// Função para finalizar a compra e enviar mensagem via WhatsApp
checkoutBtn.addEventListener("click", function() {
  if (cart.length === 0) return;

  const cartItems = cart.map(item => {
    return `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price.toFixed(3)}`;
  }).join("\n");

  const message = encodeURIComponent(cartItems);
  const phone = "98985209292";

  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

  cart = [];
  updateCartModal();
});
