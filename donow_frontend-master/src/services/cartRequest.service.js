// import axios from "axios";
// import StaticData from "../components/StaticData";
// const API_URL = StaticData.BEURL;
// const config = {
//   headers: {
//     "Content-Type": "application/json",
//   },
// };

// let request = (method, extension, data = null, extraArgs = null) => {
//   let token = localStorage["token"];
//   if (token) {
//     config.headers["Authorization"] = `Token ${token}`;
//   }
//   if (method === "post") {
//     return axios.post(API_URL + extension, data, config);
//   } else if (method === "get") {
//     if (data != null) {
//       return axios.get(API_URL + extension + "?data=" + data, config);
//     } else {
//       return axios.get(API_URL + extension, config);
//     }
//   } else if (method === "put" && extraArgs !== null) {
//     return axios.put(API_URL + extension + "?data=" + data, extraArgs, config);
//   }
// };

let addToCart = (item) => {
  let cart = getCart();
  let initialLength = cart.length;
  cart.push(item);
  let finalLength = cart.length;
  setCart(cart);
  return finalLength > initialLength;
};

let removeFromCart = (id) => {
  let cart = getCart();
  let initialLength = cart.length;
  cart = cart.filter((cartitem) => {
    return cartitem.id !== id;
  });
  let finalLength = cart.length;
  setCart(cart);
  return finalLength < initialLength;
};

let getCart = () => {
  let cart = localStorage["cart"];
  //   if (cart) cart.splice(0, 4);
  console.log(cart);
  if (cart && IsJsonString(cart)) {
    return JSON.parse(cart);
  } else {
    return [];
  }
};

let setCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

let clearCart = () => {
  setCart([]);
};

let itemExists = (id) => {
  let cart = getCart();
  cart = cart.filter((cartitem) => {
    return cartitem.id === id;
  });
  return cart.length > 0;
};

function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

const CartService = {
  addToCart,
  removeFromCart,
  getCart,
  itemExists,
  clearCart,
};
export default CartService;
