export interface CategoryMercadona {
  id: number
  name: string
}

export interface CategoryResponseMercadona {
  results: ResultMercadona[]
}

export interface ResultMercadona {
  id: number
  name: string
  categories?: ResultMercadona[]
}

export interface CategoryDataMercadona {
  id: number
  name: string
  categories?: CategoryDataMercadona[]
  products?: ProductDataMercadona[]
}

export interface ProductDataMercadona {
  id: string
  thumbnail: string
  display_name: string
  price_instructions: PriceInstructionsMercadona
}

export interface PriceInstructionsMercadona {
  unit_price: number
}
