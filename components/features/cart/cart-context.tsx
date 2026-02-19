"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string | null;
  price: number;
  variantName: string;
  quantity: number;
  maxStock: number;
};

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const savedCart = localStorage.getItem("zinc-cart");
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          setItems(parsed);
        } catch (e) {
          console.error("Failed to parse cart", e);
        }
      }
      setIsLoaded(true);
    }, 0);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("zinc-cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = (
    newItem: Omit<CartItem, "quantity"> & { quantity?: number },
  ) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === newItem.id);

      if (existing) {
        const quantity = newItem.quantity || 1;
        if (existing.quantity + quantity > existing.maxStock) {
          toast.error("Cannot add more items than available stock");
          return current;
        }

        toast.success("Updated cart quantity", {
          description: `${newItem.name} (${newItem.variantName})`,
        });

        return current.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      toast.success("Added to cart", {
        description: `${newItem.name} (${newItem.variantName})`,
      });

      return [...current, { ...newItem, quantity: newItem.quantity || 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    toast.success("Removed from cart");
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id === id) {
          if (quantity > item.maxStock) {
            toast.error(`Only ${item.maxStock} items available`);
            return { ...item, quantity: item.maxStock };
          }
          return { ...item, quantity: Math.max(1, quantity) };
        }
        return item;
      }),
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.success("Cart cleared");
  };

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
