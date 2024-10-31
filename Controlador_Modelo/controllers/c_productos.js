const productModel = require('../models/m_productos');

async function getAllProducts(req, res) {
    try{
        const productos = await productModel.getProducts();
        res.status(200).json(productos);
    }catch (err){
        res.status(500).json({mensaje: "Error al obtener productos"});
    }
}

async function insertProduct(req, res) {
    try{
        const {nombre, precio, costo} = req.body;
        if(!nombre || !precio || !costo) return res.status(400).json({error: "Faltan datos"});
        if(precio <=0 || costo <= 0) return res.status(400).json({error: "Los precios no pueden ser menores a cero"});
        const product = await productModel.insertProduct(nombre, precio, costo);
        if(product.success) {
            res.status(201).json({message: "Producto creado"});
        } else {
            res.status(400).json({message: "Producto no creado: " + product.message });
        }
    }catch (err){
        res.status(500).json({error: "Error al crear producto"});
    }
}

module.exports = {
    getAllProducts,
    insertProduct
};