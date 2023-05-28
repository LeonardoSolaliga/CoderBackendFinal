const purchase = document.getElementById('purchase');

purchase.addEventListener('click',async evt=>{
    evt.preventDefault();
    await fetch('api/carrito/finalizar',{
        method:'POST'
    })
})