import React, { Component } from "react";
import { connect } from "react-redux";
import LoadingPageComponent from "./loadingPage.component";
import ShareDialog from "./shareDialog.component";
import HeaderComponent from "./header.component";
import FooterComponent from "./footer.component";
import CartItem from "./CartItem.component";
import CartService from "../services/cartRequest.service";
import APIService from "../services/apiRequest.service";
import { Link } from "react-router-dom";

class CartComponent extends Component {
  async componentDidMount() {
    await APIService.fetchUser()
      .then((res) => {
        this.setState({ user: res.data });
        this.setState({
          params: { ...this.state.params, selfid: res.data.id },
        });
      })
      .catch((err) => {
        console.log(err);
      });
    this.fetch();
  }

  fetch = () => {
    var cart = CartService.getCart();
    var total_price = 0;
    cart.forEach((item) => {
      total_price += item.price;
    });
    this.setState({
      cart: cart,
      total: {
        price: total_price,
        items: cart.length,
      },
      loading: false,
    });
  };

  calculateTotal = () => {};

  removeFromCart = (id) => {
    let success = CartService.removeFromCart(id);
    if (success) this.fetch();
  };

  shareLink = (link) => {
    if (link) {
      this.setState({
        shareDialog: {
          display: true,
          link: link,
        },
      });
    }
    document.onkeyup = (e) => {
      if (e.key === "Escape") {
        this.setState({
          shareDialog: {
            display: false,
            link: "",
          },
        });
        document.onkeyup = null;
      }
    };
  };

  toggleFavorite = (workshopID) => {
    APIService.ToggleFavorites(this.state.params.selfid, workshopID).then(
      (res) => {
        this.setState((state) => {
          var cart = [...state.cart];
          var index = cart.findIndex((w) => w.id === workshopID);
          cart[index].favorite = res.data.status;
          return {
            cart: [...cart],
          };
        });
      }
    );
  };
  state = {
    loading: true,
    selfid: undefined,
    cart: [],
    user: {},
    total: {
      items: 0,
      price: 0.0,
    },
    shareDialog: { display: false, link: "" },
  };

  oneItem = {
    id: "001",
    imageUrl: "",
    category: "Graphic Design",
    title: "Gift Card Workshop",
    author: {
      id: 1,
      firstname: "David",
      lastname: "Brax",
    },
    rating: 5.0,
    price: 16.55,
    favorite: false,
    owned: false,
    purchased: false,
  };

  render() {
    const { loading, cart, total, shareDialog } = this.state;
    return (
      <div>
        <HeaderComponent></HeaderComponent>
        <div>
          {shareDialog.display && (
            <ShareDialog link={shareDialog.link}></ShareDialog>
          )}
        </div>
        <div className="mt-5">
          {loading && <LoadingPageComponent></LoadingPageComponent>}
          <div className="h1 w-100 text-left p-md-5 p-1">My Cart</div>
        </div>
        <div className="w-100 d-flex">
          <div className="col-12 col-md-9">
            {!loading && cart.length === 0 && (
              <div className="text-muted p-sm-5 p-2">No items in Cart</div>
            )}
            {!loading &&
              cart.map((oneItem) => (
                <div className="py-4 border-bottom border-dark">
                  <CartItem
                    removeFromCart={this.removeFromCart}
                    shareLink={this.shareLink}
                    oneitem={oneItem}
                    toggleFavorite={this.toggleFavorite}
                  ></CartItem>
                </div>
              ))}
          </div>
          {total.items > 0 && (
            <div className="col-12 col-md-3 text-center">
              <div className="text-default-black font-weight-bold">
                <span>{"Subtotal: (" + total.items + ") "}</span>
                <span className="text-pink">{"$ " + total.price}</span>
              </div>
              <button className="my-3 px-3 btn btn-pink rounder btn-sm">
                Proceed to Checkout
              </button>
              <div>
                <Link
                  to="/discover/workshops"
                  className="px-3 btn alert-link btn-solid-link text-pink"
                >
                  Continue
                </Link>
              </div>
            </div>
          )}
        </div>
        <FooterComponent></FooterComponent>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CartComponent);
