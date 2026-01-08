import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from Local Storage on Mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart items", error);
        localStorage.removeItem("cartItems");
      }
    }
  }, []);

  // Save to Local Storage on Change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, sku, quantity = 1, selectedAttrs = {}) => {
    setCartItems((prevItems) => {
      // Create a unique ID for this item variation
      // If SKU exists, use SKU ID. Else use Product ID (for simple products).
      // Also strictly check attributes to differentiate variants if needed,
      // but SKU ID should ideally be unique per variant.

      const newItemId = sku ? `sku-${sku.id}` : `prod-${product.id}`;

      const existingItemIndex = prevItems.findIndex((item) => {
        // If we have a SKU, match by SKU ID
        if (sku && item.skuId === sku.id) return true;
        // If simple product, match by Product ID
        if (!sku && item.productId === product.id) return true;
        return false;
      });

      if (existingItemIndex > -1) {
        // Update existing item
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // Add new item
        const newItem = {
          uniqueId: newItemId,
          productId: product.id,
          skuId: sku ? sku.id : null,
          name: product.name,
          image: sku?.image || product.primary_image,
          price: sku ? sku.price : product.price,
          quantity: quantity,
          attributes: selectedAttrs,
          slug: product.slug, // For linking back
          maxQuantity: sku ? sku.quantity : product.stock_quantity, // For limit checking
        };
        return [...prevItems, newItem];
      }
    });

    // Auto open drawer on add
    // setIsCartOpen(true);
  };

  const removeFromCart = (uniqueId) => {
    setCartItems((prev) => prev.filter((item) => item.uniqueId !== uniqueId));
  };

  const updateQuantity = (uniqueId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.uniqueId === uniqueId) {
          // check stock limit
          if (newQuantity > item.maxQuantity) return item;
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
