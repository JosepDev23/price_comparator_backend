export interface ConsumCategory {
    id: number;
    nombre: string;
    subcategories: ConsumCategory[];
}

export interface ConsumCategoryProductList {
    totalCount: number;
    hasMore: boolean;
    products: ProductDataConsum[];
}

export interface ProductDataConsum {
    id: number;
    productData: ProductData;
    media: Media[];
    priceData: PriceData;
}

export interface ProductData {
    name: string;
    url: string;
    imageURL: string;
    description: string;
}

export interface Media {
    url: string;
}

export interface PriceData {
    prices: Price[];
}

export interface Price {
    id: ID;
    value: Value;
}

export interface Value {
    centAmount: number;
    centUnitAmount: number;
}

export enum ID {
    OfferPrice = "OFFER_PRICE",
    Price = "PRICE",
}