export type Product = {
  id: string
  name: string
  category: 'phones' | 'laptops'
  price: number
  favorite: boolean
}

export type SortOption = 'name' | 'price-asc' | 'price-desc'

export type Category = 'all' | 'phones' | 'laptops'

export type AddCategory = 'phones' | 'laptops'

export type RootLoaderData = {
  appName: string
  currentUser: string
}

export type CatalogActionData = {
  ok?: boolean
  error?: string
}
