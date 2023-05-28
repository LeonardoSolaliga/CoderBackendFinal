
export let usersService;
export let productsService;
export let cartsService;
export let ticketService;
export let historiesService;
switch ('mongo') {
    case 'mongo':
        const {default:MongoUser} = await import('./UserDAO.js');
        const {default:MongoProducts} = await import('./ProductsDAO.js');
        const {default:MongoCart} = await import('./CartDAO.js');
        const {default:MongoTickets}=await import('./ticketDAO.js')
        const {default:MongoHistory}=await import('./historiesDAO.js')

        usersService = new MongoUser();
        productsService = new MongoProducts();
        cartsService = new MongoCart();
        ticketService=new MongoTickets();
        historiesService=new MongoHistory();
        break;
}
