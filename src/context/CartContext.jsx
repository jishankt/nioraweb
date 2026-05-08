import { createContext, useContext, useEffect, useReducer, useState } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'niora_cart_v1';

const loadCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
};

const itemKey = (item) => `${item.product_id}__${item.size || ''}__${item.color || ''}`;

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      const incoming = action.item;
      const key = itemKey(incoming);
      const existing = state.find((i) => itemKey(i) === key);
      if (existing) {
        return state.map((i) =>
          itemKey(i) === key
            ? { ...i, quantity: i.quantity + incoming.quantity }
            : i
        );
      }
      return [...state, incoming];
    }
    case 'UPDATE_QTY': {
      return state
        .map((i) =>
          itemKey(i) === action.key ? { ...i, quantity: action.quantity } : i
        )
        .filter((i) => i.quantity > 0);
    }
    case 'REMOVE': {
      return state.filter((i) => itemKey(i) !== action.key);
    }
    case 'CLEAR':
      return [];
    case 'HYDRATE':
      return action.items;
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [items, dispatch] = useReducer(reducer, [], loadCart);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = (item) => {
    dispatch({ type: 'ADD', item });
    setToast(`${item.name} added to cart`);
    setTimeout(() => setToast(null), 2800);
  };

  const updateQty = (key, quantity) =>
    dispatch({ type: 'UPDATE_QTY', key, quantity });

  const removeItem = (key) => dispatch({ type: 'REMOVE', key });
  const clearCart = () => dispatch({ type: 'CLEAR' });
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const totalQuantity = items.reduce((s, i) => s + i.quantity, 0);
  const totalAmount = items.reduce(
    (s, i) => s + Number(i.price) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        toast,
        totalQuantity,
        totalAmount,
        addItem,
        updateQty,
        removeItem,
        clearCart,
        openCart,
        closeCart,
        itemKey,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
