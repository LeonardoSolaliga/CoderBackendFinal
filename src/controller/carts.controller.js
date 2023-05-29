import {cartsService, historiesService, usersService,ticketService} from '../DAOs/index.js'
import { makeid } from '../utils.js';
import { DateTime } from "luxon";
import Mailer from "../services/nodemailer.js"


const agregarAlCarrito=async(req,res)=>{
    const user=req.session.user;
    const prdct=req.body;
    const cart=await cartsService.getCartById(user.cart)
    const exists=cart.products.some(prod=>prod._id.toString()===prdct._id.toString())
    if (exists){
        let newCart=cart.products.filter(elem=>elem._id.toString()!=prdct._id.toString())
        await cartsService.updateCart(cart._id,{products:newCart})
        let Carrito=await cartsService.getCartById(user.cart)
        Carrito.products.push(prdct)
        await cartsService.updateCart(cart._id,{products:Carrito.products})
        return res.send({status: "success",message:"carrito agregado perro"})

    }else{
        cart.products.push(prdct)
        await cartsService.updateCart(cart._id,{products:cart.products});
        return  res.send({status: "success",message:"carrito agregado perro"})
    }
}
const finalizarCompra=async(req,res)=>{
    const user=await usersService.getUserBy({_id:req.user.id})
    const cart=await cartsService.getCartById(user.cart);
    const populateCart=await cartsService.getCartById(user.cart,{populate:true})
    const precioTotal=populateCart.products.reduce((previous,current)=>previous+(current._id.price)*current.quantity,0)
    const ticket={
        user:user._id,
        products:cart.products,
        total:precioTotal,
        code:makeid(20)
    }
    await cartsService.updateCart(cart._id,{products:[]});
    await ticketService.createTicket(ticket);
    const history = await historiesService.getHistoryBy({user:user._id});
    const event = {
        event:'Purchase',
        date: DateTime.now().toISO(),
        description:`Hizo una compra de ${populateCart.products.length>1?"Varios productos":"un producto"}`
    }
    if(!history){
        await historiesService.createHistory({user:user._id,events:[event]})
    }else{
        history.events.push(event);
        await historiesService.updateHistory(history._id,{events:history.events})
    } 
    await cartsService.updateCart(cart._id,{products:[]});  
    let contenedor = ``;
    
    for(const producto of (populateCart.products)){

        if (producto._id) {
            contenedor += `<span>Titulo:${producto._id.title}</span> <span>Price: $${producto._id.price}</span><span>Cantidad:${producto._id.description}</span> <span>Cantidad:${producto.quantity}</span></p>`
        }
    }
    contenedor+=`<span>PRECIO TOTAL:$${precioTotal}</span>`
    contenedor+=`<p><span>Ticket de compra:${ticket.code}</span><p>` 
    contenedor+=`<span>Gracias por su compra :)</span>` 
    await Mailer.sendMail({
        from:'Compra completada <coderEcommerce@gmail.com>',
        to:req.session.user.email,
        subject:'Gracias por su compra :)',
        html:`${contenedor}`,
    })
    res.send({status: "success", message: "Compra finalizada"})
}

const deleteProduct=async(req,res)=>{
    const user=req.session.user;
    const prdct=req.body;
    const cart=await cartsService.getCartById(user.cart)
    const prodDelete=cart.products.filter(prod=>prod._id!=prdct._id)
    cart.products=prodDelete;
    await cartsService.updateCart(user.cart,cart)
    res.send({status:"success", message:"se elimino el producto del carrito"})
}

const ProductCart=async(req,res)=>{
    const user=req.session.user;
    const cart=await cartsService.getCartById(user.cart)
    res.send({status:"sucess",payload:cart})
}


export default {
    agregarAlCarrito,
    finalizarCompra,
    deleteProduct,
    ProductCart
}