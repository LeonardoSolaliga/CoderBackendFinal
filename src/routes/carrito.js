import { Router } from "express";
import cartsController from "../controller/carts.controller.js"




let router = new Router();

router.post("/finalizar", cartsController.finalizarCompra)
router.post("/:id/productos", cartsController.agregarAlCarrito)
router.post("/productos/:id_prod",cartsController.deleteProduct)
router.get("/",cartsController.ProductCart)


export default router;