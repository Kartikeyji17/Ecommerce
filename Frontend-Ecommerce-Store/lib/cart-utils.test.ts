import { computeTotal, CartItem } from './cart-utils'

describe('computeTotal', () => {
  test('returns 0 for empty cart', () => {
    expect(computeTotal([])).toBe(0)
  })

  test('calculates total for a single item', () => {
    const items: CartItem[] = [
      { id: '1', name: 'Shirt', price: 20, quantity: 2, image: '' },
    ]
    expect(computeTotal(items)).toBe(40)
  })

  test('calculates total across multiple items', () => {
    const items: CartItem[] = [
      { id: '1', name: 'Shirt', price: 20, quantity: 2, image: '' },
      { id: '2', name: 'Shoes', price: 50, quantity: 1, image: '' },
    ]
    expect(computeTotal(items)).toBe(90)
  })
})