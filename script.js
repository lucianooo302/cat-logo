const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const clouseModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")

let cart = [];

//abrir o modal do carrinho

cartBtn.addEventListener("click", function() {
  cartModal.style.display = "flex"  

})

//fechar o modal do carrinho

cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
       cartModal.style.display = "none"
    }
}) 

clouseModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"

})

menu.addEventListener("click", function(event){
  //console.log(event.target)

  let parentButton = event.target.closest(".add-to-cart-btn")
 if(parentButton){

const name = parentButton.getAttribute("data-name")
const price = parseFloat(parentButton.getAttribute("data-price"))

addToCart(name, price)

 }

})

//funcao para adicionar no carrinho
function addToCart(name, price){
  const existingItem = cart.find(intem => intem.name === name)

   if(existingItem){
   existingItem.quantity +=1;
   }else{

    cart.push({

      name,
      price,
      quantity: 1,
  
    })
  } 
 
  updateCartModal()

}

//atualizar carrinho
function updateCartModal(){
  cartItemsContainer.innerHTML = "";
  let total = 0;


  cart.forEach(intem => {
  const cartItemElement = document.createElement("div");
  cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

  cartItemElement.innerHTML = `
  <div class= "flex items-center justify-between">
  
  <div>
  <p class="font-medium">${intem.name}</p>
  <p>Qtd: ${intem.quantity}</p>
  <p class="font-medium mt-2">R$ ${intem.price.toFixed(3)}</p>
 </div>


 <button class="remove-from-cart-btn" data-name="${intem.name}">
 Remover
 </button>

</div>

`

total+= intem.price * intem.quantity;


cartItemsContainer.appendChild(cartItemElement)

  })

cartTotal.textContent = total.toFixed(3).toLocaleString("pt-BR",{
style: "currency",
currency: "BRL"
});

cartCounter.innerHTML = cart.length;


}

//funcao para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event){
  if(event.target.classList.contains("remove-from-cart-btn")){
    const name = event.target.getAttribute("data-name")

removeItemCart(name);
  }

})

function removeItemCart(name){
  const index = cart.findIndex(item => item.name === name);

  if(index !== -1){
      const item = cart[index];

      if(item.quantity > 1){
         item.quantity -= 1;
         updateCartModal();
         return;

      }
      cart.splice(index,1);
      updateCartModal();

    }
  }

  checkoutBtn.addEventListener("click", function(){
if(cart.length === 0)return;

const cartItems = cart.map((item) =>{
return (

  ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price.toFixed(3)}`
)

}).join("")

const message = encodeURIComponent(cartItems)
const phone = "98985209292"

window.open(`https://wa.me/${phone}?text=${message}`, "_blank")

cart = [];
updateCartModal();

  })