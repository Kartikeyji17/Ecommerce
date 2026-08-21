export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export function computeTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}