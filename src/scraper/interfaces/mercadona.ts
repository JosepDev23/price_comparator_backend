export interface Category {
    id: number;
    name: string;
}

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