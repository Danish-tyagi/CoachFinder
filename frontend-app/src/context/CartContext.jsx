import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [cartOpen, setCartOpen] = useState(false)

  const addToCart = (institute) => {
    // check if already in cart
    const exists = cartItems.find((item) => item._id === institute._id)
    if (exists) {
      return false // already added
    }
    setCartItems([...cartItems, institute])
    return true
  }

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item._id !== id))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const isInCart = (id) => {
    return cartItems.some((item) => item._id === id)
  }

  return (
    <CartContext.Provider value={{ cartItems, cartOpen, setCartOpen, addToCart, removeFromCart, clearCart, isInCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
