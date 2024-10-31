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

async function deleteProduct(req, res) {
    try{
        const {nombre, id} = req.body;
        if(!nombre) return res.status(400).json({error: "Faltan datos"});
        const product = await productModel.deleteProduct(nombre);
        if(product.success) {
            res.status(201).json({message: "Producto eliminado"});
        } else {
            res.status(400).json({message: "Producto no eliminado: " + product.message });
        }
    }catch (err){
        res.status(500).json({error: "Error al eliminar producto"});
    }
}

async function updateProduct(req, res) {
    try{
        const {nombre, precio, costo, id} = req.body;
        if(!nombre || !precio || !costo || !id) return res.status(400).json({error: "Faltan datos"});
        const product = await productModel.updateProduct(id, nombre, precio, costo);
        if(product.success) {
            res.status(201).json({message: "Producto actualizado"});
        } else {
            res.status(400).json({message: "Producto no actualizado: " + product.message });
        }
    }catch (err){
        res.status(500).json({error: "Error al actualizar producto"});
    }
}

module.exports = {
    getAllProducts,
    insertProduct,
    deleteProduct,
    updateProduct
};