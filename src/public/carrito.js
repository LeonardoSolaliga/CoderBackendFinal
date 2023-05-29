async function Cart(){
    const purchase = document.getElementById('purchase');
    purchase.addEventListener('click',async evt=>{
        evt.preventDefault();
        await fetch('api/carrito/finalizar',{
            method:'POST'
        })
        window.location.replace("/completedPurchase")
    })
    const response = await fetch(`/api/carrito/`, {
        method: 'GET'
    })
    const res=await response.json();
    const CarritoCompleto=res.payload.products
    CarritoCompleto.forEach((product, indice) =>{
        let deletProd = document.getElementById(`deleteProduct${indice}`)
        deletProd.addEventListener("click", async(e)=>{
            e.preventDefault()
            const delprod={_id:product._id} 
            await fetch(`/api/carrito/productos/${product.code}`,{
                method:'POST',
                body:JSON.stringify(delprod),
                headers:{
                    "Content-Type":"application/json"
                }
            })
            window.location.replace('/carts')
        })

    })
}






Cart();