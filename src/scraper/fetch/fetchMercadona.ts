import Product from "src/products/product.schema";
import axios from "axios";

export class Category {
    public id: number;
    public name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

export class SubCategory {
    public id: number;
    public name: string;
    public category: Category | undefined;

    constructor(id: number, name: string, category: Category | undefined) {
        this.id = id;
        this.name = name;
        this.category = category;
    }
}

// export class Product {
//     id: string;
//     name: string;
//     description: string;
//     price: number;
//     img: string;
//     category: Category | undefined;
//     subCategory: SubCategory | undefined;

//     constructor(id: string, name: string, description: string, price: number, img: string, category: Category | undefined, subCategory: SubCategory | undefined) {
//         this.id = id;
//         this.name = name;
//         this.description = description;
//         this.price = price;
//         this.img = img;
//         this.category = category;
//         this.subCategory = subCategory;
//     }
// }

export interface CategoryResponse {
    results: Result[]
}

export interface Result {
    id: number
    name: string
    categories?: Result[]
}

export interface CategoryData {
    id: number
    name: string
    categories?: CategoryData[]
    products?: ProductData[]
}

export interface ProductData {
    id: string
    thumbnail: string
    display_name: string
    price_instructions: PriceInstructions
}

export interface PriceInstructions {
    unit_price: number
}

export async function getAllMercadonaProducts(): Promise<Product[]> {
    const mercadonaCategoryList: Category[] = [];
    const mercadonaProductList: Product[] = [];


    const categoriesJSON: CategoryResponse = await axios.get('https://tienda.mercadona.es/api/categories/');

    categoriesJSON.results.forEach((upperCategory: Result) => {
        upperCategory.categories?.forEach((lowerCategory: Result) => {
            mercadonaCategoryList.push(new Category(lowerCategory.id, lowerCategory.name));
        });
    });

    const categoriesPromise: Array<Promise<CategoryData>> = mercadonaCategoryList.map(async (category: Category) => {
        return await axios.get(`https://tienda.mercadona.es/api/categories/${category.id}/?lang=es`);
    });

    const categories: CategoryData[] = await Promise.all(categoriesPromise);

    categories.forEach((data: CategoryData) => {
        data.categories?.forEach((subCategory: CategoryData) => {
            subCategory.products?.forEach((productData: ProductData) => {
                const product = new Product();
                    product.name = productData.display_name;
                    product.price = productData.price_instructions.unit_price;
                    product.img = productData.thumbnail,
                    product.description = "";
                mercadonaProductList.push(product);
            });
        });
    });

    return mercadonaProductList;
}