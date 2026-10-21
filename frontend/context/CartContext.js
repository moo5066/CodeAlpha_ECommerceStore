"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);

  const refresh = useCallback(async () => {
    if (!token) {
      setItems([]);
      return;
    }
    const data = await api("/cart", { token });
    setItems(data.items || []);
  }, [token]);

  useEffect(() => {
    const task = Promise.resolve().then(() => refresh()).catch(() => setItems([]));
    return () => { void task; };
  }, [refresh]);

  // Hide items from a previous session without calling setState in the effect
  const visibleItems = token ? items : [];

  const addItem = async (productId, quantity = 1) => {
    const data = await api("/cart", { method: "POST", token, body: { productId, quantity } });
    setItems(data.items || []);
  };

  const updateItem = async (productId, quantity) => {
    const data = await api(`/cart/${productId}`, { method: "PUT", token, body: { quantity } });
    setItems(data.items || []);
  };

  const removeItem = async (productId) => {
    const data = await api(`/cart/${productId}`, { method: "DELETE", token });
    setItems(data.items || []);
  };

  const count = visibleItems.reduce((sum, i) => sum + i.quantity, 0);
  const total = visibleItems.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items: visibleItems, count, total, addItem, updateItem, removeItem, refresh }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
