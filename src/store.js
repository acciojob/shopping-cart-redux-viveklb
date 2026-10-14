import { createStore } from "redux";

export const PRODUCTS = [
  { id: "stoneware-vase", name: "Stoneware bud vase", category: "Ceramics", price: 38, color: "Chalk / moss", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=900&q=85", imageAlt: "Handmade ceramic vase on a wooden table" },
  { id: "linen-throw", name: "Washed linen throw", category: "Textiles", price: 86, color: "Olive stripe", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85", imageAlt: "Soft linen throw draped across a lounge chair" },
  { id: "arc-lamp", name: "Arc bedside lamp", category: "Lighting", price: 124, color: "Warm white", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85", imageAlt: "Warm sculptural lamp lighting a quiet room" },
  { id: "ritual-cup", name: "Daily ritual cup", category: "Ceramics", price: 24, color: "Oat glaze", image: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&w=900&q=85", imageAlt: "Ceramic coffee cup beside a book" },
  { id: "woven-basket", name: "Market woven basket", category: "Storage", price: 54, color: "Natural reed", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=900&q=85", imageAlt: "Natural woven basket in a sunlit home" },
  { id: "linen-cushion", name: "Linen cushion cover", category: "Textiles", price: 42, color: "Terracotta", image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=85", imageAlt: "Textured cushion on a neutral sofa" },
];

export const COUPONS = { SAVE10: 10, WELCOME10: 10, DISCOUNT10: 10, ACCIO10: 10, WELCOME15: 15 };

export const initialState = { cart: [], wishlist: [], discount: null };

export const actionTypes = {
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  INCREASE_QUANTITY: "INCREASE_QUANTITY",
  DECREASE_QUANTITY: "DECREASE_QUANTITY",
  TOGGLE_WISHLIST: "TOGGLE_WISHLIST",
  APPLY_DISCOUNT: "APPLY_DISCOUNT",
  CLEAR_DISCOUNT: "CLEAR_DISCOUNT",
};

export const addToCart = (product) => ({ type: actionTypes.ADD_TO_CART, product });
export const removeFromCart = (productId) => ({ type: actionTypes.REMOVE_FROM_CART, productId });
export const increaseQuantity = (productId) => ({ type: actionTypes.INCREASE_QUANTITY, productId });
export const decreaseQuantity = (productId) => ({ type: actionTypes.DECREASE_QUANTITY, productId });
export const toggleWishlist = (productId) => ({ type: actionTypes.TOGGLE_WISHLIST, productId });
export const applyDiscount = (code, percent) => ({ type: actionTypes.APPLY_DISCOUNT, code, percent });
export const clearDiscount = () => ({ type: actionTypes.CLEAR_DISCOUNT });

export function cartReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.ADD_TO_CART: {
      const existingItem = state.cart.find((item) => item.product.id === action.product.id);
      const cart = existingItem
        ? state.cart.map((item) => item.product.id === action.product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item)
        : [...state.cart, { product: action.product, quantity: 1 }];
      return { ...state, cart };
    }
    case actionTypes.REMOVE_FROM_CART:
      return { ...state, cart: state.cart.filter((item) => item.product.id !== action.productId) };
    case actionTypes.INCREASE_QUANTITY:
      return {
        ...state,
        cart: state.cart.map((item) => item.product.id === action.productId
          ? { ...item, quantity: item.quantity + 1 }
          : item),
      };
    case actionTypes.DECREASE_QUANTITY:
      return {
        ...state,
        cart: state.cart
          .map((item) => item.product.id === action.productId
            ? { ...item, quantity: item.quantity - 1 }
            : item)
          .filter((item) => item.quantity > 0),
      };
    case actionTypes.TOGGLE_WISHLIST:
      return {
        ...state,
        wishlist: state.wishlist.includes(action.productId)
          ? state.wishlist.filter((id) => id !== action.productId)
          : [...state.wishlist, action.productId],
      };
    case actionTypes.APPLY_DISCOUNT:
      return { ...state, discount: { code: action.code, percent: action.percent } };
    case actionTypes.CLEAR_DISCOUNT:
      return { ...state, discount: null };
    default:
      return state;
  }
}

export const store = createStore(cartReducer);