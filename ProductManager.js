import {promises as fs} from "fs";

class ProductManager {
    constructor() {
        this.products = [];
        this.path = "./products.txt";
    }

    static id = 0;

    addProduct = async (title, description, price, thumbnail, code, stock) => {
        ProductManager.id++;
        if (this.validateCode(code)) {
            console.log("El código del producto ya existe");
        } if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log(`Todos los campos son obligatorios`);
        } else {
        const newProduct = {id: ProductManager.id, title:title, description:description, price:price, thumbnail:thumbnail, code:code, stock:stock};
        this.products.push (newProduct);
        }

        await fs.writeFile(this.path, JSON.stringify(this.products));
    }

    validateCode(code) {
        return this.products.some(item => item.code === code);
    }

    readProducts = async () => {
        let respond = await fs.readFile(this.path, "utf-8");
        return JSON.parse(respond);
    }

    getProducts = async () => {
        let respond2 = await this.readProducts();
        return respond2;
    }

    getProductsById = async (id) => {
        let respond3 = await this.readProducts();
        return respond3.find(item => item.id === id) || "Not found";
    }

    deleteProduct = async (id) => {
        let respond3 = await this.readProducts();
        let productFilter = respond3.filter(products => products.id != id)

        await fs.writeFile(this.path, JSON.stringify(productFilter));

        console.log("Producto eliminado");
    }

    updateProduct = async ({id, ...product}) => {
        await this.deleteProduct(id);
        let oldProduct = await this.readProducts()

        let modifiedProducts = [{id, ...product}, ...oldProduct]

        await fs.writeFile(this.patch, JSON.stringify(modifiedProducts));
    }

}

const products = new ProductManager;

console.log(products.getProducts()); //Antes de agregar un producto devuelve un array vacío.

products.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
products.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc124", 24);
products.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc125", 23)
console.log(products.getProducts()); //Ahora devuelve los productos agregados, cada uno con un ID incrementable.

console.log(products.getProductsById(2)); //Devuelve el producto cuyo ID es 2.
console.log(products.getProductsById(5)); //Devuelve "Not found".


products.deleteProduct();

products.updateProduct()