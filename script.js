const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const clouseModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const colorSelect = document.getElementById("color"); // Selecionando a cor

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

clouseModalBtn.addEventListener("click", function() {
  cartModal.style.display = "none";
});

// Evento para adicionar ao carrinho ao clicar no botão
menu.addEventListener("click", function(event) {
  let parentButton = event.target.closest(".add-to-cart-btn");
  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    const color = colorSelect.value; // Capturando a cor selecionada

    addToCart(name, price, color);
  }
});

// Função para adicionar o item ao carrinho
function addToCart(name, price, color) {
  // Verificar se há um item com o mesmo nome e cor no carrinho
  const existingItem = cart.find(item => item.name === name && item.color === color);

  if (existingItem) {
    // Se o item com a mesma cor já existe, aumentamos a quantidade
    existingItem.quantity += 1;
  } else {
    // Caso contrário, adicionamos o novo item com a cor selecionada
    cart.push({
      name,
      price,
      color: color ? color : 'Não definida', // Adicionando a cor ao item ou colocando "Não definida"
      quantity: 1
    });
  }

  updateCartModal(); // Atualiza o modal do carrinho
}

// Função para atualizar o modal do carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = ""; // Limpar o conteúdo atual
  let total = 0;

  // Loop para exibir os itens no carrinho
  cart.forEach(item => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium">${item.name}</p>
          <p>Cor: ${item.color}</p> <!-- Exibe a cor do item -->
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(3)}</p>
        </div>
        <button class="remove-from-cart-btn" data-name="${item.name}" data-color="${item.color}">
          Remover
        </button>
      </div>
    `;

    total += item.price * item.quantity; // Calcula o total
    cartItemsContainer.appendChild(cartItemElement); // Adiciona o item ao container
  });

  // Atualiza o total no carrinho
  cartTotal.textContent = total.toFixed(3).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  // Atualiza o contador de itens no carrinho
  cartCounter.innerHTML = cart.length;
}

// Função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");
    const color = event.target.getAttribute("data-color"); // Captura a cor para remover o item correto
    removeItemCart(name, color);
  }
});

// Remover item específico do carrinho
function removeItemCart(name, color) {
  // Encontrar o item que tem o mesmo nome e a mesma cor
  const index = cart.findIndex(item => item.name === name && item.color === color);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1; // Se a quantidade for maior que 1, reduz a quantidade
      updateCartModal();
    } else {
      // Remove o item se a quantidade for 1
      cart.splice(index, 1);
      updateCartModal();
    }
  }
}

// Função para finalizar a compra e enviar mensagem via WhatsApp
checkoutBtn.addEventListener("click", function() {
  if (cart.length === 0) return;

  const cartItems = cart.map(item => {
    return `${item.name} (Cor: ${item.color}) Quantidade: (${item.quantity}) Preço: R$${item.price.toFixed(3)}`;
  }).join("\n");

  const message = encodeURIComponent(cartItems);
  const phone = "98985209292"; // Número de telefone para o WhatsApp

  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

  cart = []; // Limpa o carrinho
  updateCartModal();
});
