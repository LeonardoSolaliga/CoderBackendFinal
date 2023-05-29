
async function obtenerCantidad() {
    const paginacion=Number(document.getElementById("page").innerText);

    const response = await fetch(`/api/products/?page=${paginacion}`, {
        method: 'GET'
    })
    const productos = await response.json();
    const products=productos.payload;
    products.forEach((product, indice) => {
        let contador=1;
        let botonSuma = document.getElementById(`botonAdd${indice}`)
        botonSuma.addEventListener("click", (e) => {
            e.preventDefault();
            if (contador<product.stock){
                let cont=document.getElementById(`cont${indice}`)
                contador++;
                cont.innerHTML=contador;
            }else{
                alert("no puede ingresar un numero mas alto que el stock")
            }

        });
        let botonResta=document.getElementById(`botonRes${indice}`)
        botonResta.addEventListener("click", (e) => {
            e.preventDefault();
            if (1<contador){
                let cont=document.getElementById(`cont${indice}`)
                contador--;
                cont.innerHTML=contador;
            }else{
                alert("no puede ingresar un numero menor que el 1")
            }

        });
        let botonAgregar=document.getElementById(`botonAgregar${indice}`);
        botonAgregar.addEventListener("click",async(e)=>{
            e.preventDefault()
            const productonuevo={_id:product._id,quantity:contador}
            await fetch(`/api/carrito/${product.code}/productos`,{
                method:'POST',
                body:JSON.stringify(productonuevo),
                headers:{
                    "Content-Type":"application/json"
                }
            })
            window.location.replace('/carts')
        })
    })
}



obtenerCantidad()