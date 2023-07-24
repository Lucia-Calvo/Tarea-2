import {promises as fs} from "fs";

class ProductManager {
    constructor() {
        this.products = [];
        this.path = "./products.txt";
    }

    static id = 0;

    addProduct = async (title, description, price, thumbnail, code, stock) => {
        try {
            ProductManager.id++;
            
            if (this.validateCode(code)) {
                console.log("El código del producto ya existe");
                return
            } if (this.validateFields(title, description, price, thumbnail, code, stock)) {
                console.log(`Todos los campos son obligatorios`);
                return
            }            
            const newProduct = {id: ProductManager.id, title:title, description:description, price:price, thumbnail:thumbnail, code:code, stock:stock};
            this.products.push (newProduct);
            await fs.writeFile(this.path, JSON.stringify(this.products));

        } catch (error) {
            console.log(error)
        }
    }

    validateCode(code) {
        return this.products.some(item => item.code === code);
    }

    validateFields(title, description, price, thumbnail, code, stock) {
        return !title || !description || !price || !thumbnail || !code || !stock
    }

    readProducts = async () => {
        try {
            let respond = await fs.readFile(this.path, "utf-8");
            return JSON.parse(respond);
        } catch (error) {
            console.log(error);
        }
    }

    getProducts = async () => {
        try {
            let respond2 = await this.readProducts();
            return console.log(respond2);
        } catch (error) {
            console.log(error);
        }
    }

    getProductsById = async (id) => {
        try{
            let respond3 = await this.readProducts();
            let productFilter = respond3.find((product) => product.id === id);
            return console.log(productFilter);
        } catch (error) {
            console.log(error);
        }
    }

    deleteProduct = async (id) => {
        let respond3 = await this.readProducts();
        let productFilter = respond3.filter(products => products.id != id)

        await fs.writeFile(this.path, JSON.stringify(productFilter));

        console.log("Producto eliminado");
    }

    updateProduct = async (id, title, description, price, thumbnail, code, stock) => {
        try {
            let toUpdateProduct = await this.readProducts();
            let productUpdate = toUpdateProduct.findIndex(
                (product) => product.id === id
            );
            if (productUpdate.length > 0) {
                return;
            }
            if (this.validateCode(code)) {
                console.log("El código del producto ya existe");
                return
            }
            if (this.validateFields(title, description, price, thumbnail, code, stock)) {
                console.log(`No se puede actualizar el producto con campos vacios`);
                return
            }

            if (productUpdate !== -1) {
                toUpdateProduct[productUpdate].title = title;
                toUpdateProduct[productUpdate].description = description;
                toUpdateProduct[productUpdate].price = price;
                toUpdateProduct[productUpdate].thumbnail = thumbnail;
                toUpdateProduct[productUpdate].code = code;
                toUpdateProduct[productUpdate].stock = stock;
                await fs.writeFile(this.path, JSON.stringify(toUpdateProduct));
                console.log(`Producto actualizado`);
            } else {
                console.log(`No existe el producto con el id ingresado que quieres actualizar`);
            }
            } catch (error) {
            console.error('Se produjo un error:', error);
            }
        };

}

const products = new ProductManager;

console.log(products.getProducts()); //Antes de agregar un producto devuelve un array vacío.

products.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
products.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc124", 24);
products.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc125", 23);
console.log(products.getProducts()); //Ahora devuelve los productos agregados, cada uno con un ID incrementable.

console.log(products.getProductsById(2)); //Devuelve el producto cuyo ID es 2.
console.log(products.getProductsById(5)); //Devuelve "Not found".

products.updateProduct();
products.deleteProduct();

products.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", 23);
console.log(products.getProducts());