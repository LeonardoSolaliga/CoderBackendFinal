import {cartsService, productsService, historiesService} from '../DAOs/index.js'

const register=(req,res)=>{
    res.render('register',{});
}

const login=(req,res)=>{
    res.render('login',{user:req.session.user});
}

const logout=(req,res)=>{
    try{
    req.session.destroy();
    res.redirect('/')
    }catch(err){
        res.send(err);
    }
}

const profile=async(req,res)=>{
    const history = await historiesService.getHistoryBy({user:req.user.id})
    res.render('profile',{user:req.session.user,events:history?history.events:[]})
}

const inicio=async(req, res)=>{
    const page=req.query.page|| 1;
    const ProductosPagination=await productsService.getProducts({},page);
    const Productos=ProductosPagination.docs;
    const paginationData={
        hasPrevPage:ProductosPagination.hasPrevPage,
        hasNextPage:ProductosPagination.hasNextPage,
        nextPage:ProductosPagination.nextPage,
        prevPage:ProductosPagination.prevPage,
        page:ProductosPagination.page
    }
    res.render("inicio",{user:req.session.user,Productos,paginationData});
}
const crearProducto=(req,res)=>{
    res.render('productos');
}

const cart=async(req,res)=>{
    const cartid=req.session.user.cart
    const cart=await cartsService.getCartById(cartid,{populate:true})
    const name=req.session.user.nombre
    res.render('carts',{Productos:cart.products,name})
}

const completedpurchase=(req,res)=>{
    res.render('completePurchase');
}


export default{
    register,
    login,
    logout,
    profile,
    inicio,
    crearProducto,
    cart,
    completedpurchase

}