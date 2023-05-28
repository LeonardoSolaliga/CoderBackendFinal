import {cartsService, historiesService, usersService} from '../DAOs/index.js'
import { makeid } from '../utils.js';
import { DateTime } from "luxon";


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
    console.log(user);
    console.log(cart);
    const populateCart=await cartsService.getCartById(user.cart,{populate:true})
    console.log("--------------------------")
    console.log(populateCart.products)
    const ticket={
        user:user._id,
        products:cart.products,
        total:populateCart.products.reduce((previous,current)=>previous+(current._id.price)*current.quantity,0),
        code:makeid(20)
    }
    await cartsService.updateCart(cart._id,{games:[]});
    await ticketsService.createTicket(ticket);
    console.log(populateCart.products.reduce((previous,current)=>previous+(current._id.price)*current.quantity,0))
    console.log("----------------------------------");
    const history = await historiesService.getHistoryBy({user:user._id});
    console.log(history);
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
    res.send({status: "success", message: "Compra finalizada"})


}

const deleteProduct=async(req,res)=>{
    const user=req.session.user;
    const prdct=req.body;
    const cart=await cartsService.getCartById(user.cart)


}


export default {
    agregarAlCarrito,
    finalizarCompra,
    deleteProduct
}