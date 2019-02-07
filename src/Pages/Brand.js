import React, { Component } from "react";
import FirebaseServices from "../firebase/services";
import Modal from "react-modal";
import ProductModal from "../Components/ProductModal";
import ReactLoading from "react-loading";

const firebaseServices = new FirebaseServices();

const modalStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "0",
    display: "inline-block",
    overflow: "hidden"
  }
};

class Picture extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const productPicture = this.props.url;
    const productName = this.props.name;
    return (
      <img
        className="rounded imag"
        width="100"
        height="90"
        src={productPicture}
        alt={productName}
      />
    );
  }
}

class ProductPrice extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const price = this.props.price;
    return <h6>{price} Kudos</h6>;
  }
}

class WishlistButton extends React.Component {
  productKey = "";
  userKey = "";
  wishlist = [];
  constructor(props) {
    super(props);
    this.subscriptions = [];
    this.addToWishlist = this.addToWishlist.bind(this);
    this.isInWishlist = this.isInWishlist.bind(this);
    this.state = {
      isInWishlist: false
    };
  }
  componentDidMount() {
    this.productKey = this.props.productKey;
    this.userKey = this.props.userKey;
    this.subscriptions.push(
      firebaseServices.getWishlist(this.userKey).subscribe(items => {
        this.setState({ isInWishlist: false });
        this.wishlist = items;
        this.isInWishlist();
      })
    );
  }

  componentWillUnmount() {
    this.subscriptions.forEach(obs => obs.unsubscribe());
  }

  addToWishlist(event) {
    firebaseServices.addToWishlist(this.productKey, this.userKey);
    event.stopPropagation();
  }
  isInWishlist() {
    this.wishlist.forEach(item => {
      if (item.productID === this.productKey) {
        this.setState({ isInWishlist: true });
      }
    });
  }
  render() {
    const inWishlist = this.state.isInWishlist;
    return (
      <button
        className="wishlistButton btn btn-primary btn-sm"
        role="button"
        onClick={this.addToWishlist}
        disabled={inWishlist}
      >
        {inWishlist ? "Item in Wishlist" : "Add to Wishlist"}
      </button>
    );
  }
}

class Title extends React.Component {
  render() {
    const brandName = this.props.brandName;
    return (
      <div className="row">
        <div className="col-lg mr-4 p-2">
          <strong>{brandName}</strong>
        </div>
      </div>
    );
  }
}
class BrandPicture extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    var productPicture = this.props.brandPicture;
    var productName = this.props.brandName;
    return (
      <img
        className="rounded image d-block"
        width="40"
        height="41"
        src={productPicture}
        alt={productName}
      />
    );
  }
}

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.subscriptions = [];
    this.isInWishlist = this.isInWishlist.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.productKey = this.props.product.key;
    this.state = {
      isInWishlist: false,
      modalIsOpen: false,
      brand: {}
    };
    this.userKey = this.props.user.key;
  }

  componentDidMount() {
    this.subscriptions.push(
      firebaseServices.getWishlist(this.userKey).subscribe(items => {
        this.setState({ isInWishlist: false });
        this.wishlist = items;
        this.isInWishlist();
      })
    );
    this.subscriptions.push(
      firebaseServices.getBrand(this.props.product.brandID).subscribe(brand => {
        this.setState({ brand: brand });
      })
    );
  }

  componentWillUnmount() {
    this.subscriptions.forEach(obs => obs.unsubscribe());
  }

  isInWishlist() {
    this.wishlist.forEach(item => {
      if (item.productID === this.productKey) {
        this.setState({ isInWishlist: true });
      }
    });
  }

  openModal() {
    if (!this.state.modalIsOpen) {
      this.setState({ modalIsOpen: true });
    }
  }
  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    const product = this.props.product;
    const brand = this.state.brand;
    const wishlist = this.props.wishlist;
    const user = this.props.user;
    const userKey = user.key;
    const productName = product.name;
    const productDescription = product.description;
    const productPicture = product.picture;
    const brandPicture = brand.picture;
    const brandName = brand.name;
    const price = product.price;
    const productKey = product.key;
    const inWishlist = this.state.isInWishlist;
    return (
      <div className="pb-5">
        <div
          className={
            "card card-primary productCard sponsored " +
            (inWishlist ? " inWishlist " : " ")
          }
          onClick={this.openModal}
        >
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={modalStyle}
            shouldCloseOnOverlayClick={true}
          >
            <div style={{ height: "80%", position: "relative" }}>
              <ProductModal product={product} user={user} />
            </div>
            <a href="#" className="closeButton" onClick={this.closeModal} />
          </Modal>
          <div
            className="card-header bg-primary p-0"
            style={{ width: "100%", height: "17%" }}
          >
            <div className="row">
              <div className="d-flex mx-auto">
                <Title brandName={brandName} />
                <BrandPicture
                  className="brandPicture"
                  brandPicture={brandPicture}
                  brandName={brandName}
                />
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-lg-4">
                <Picture
                  className="productPicture"
                  url={productPicture}
                  name={productName}
                />
              </div>
              <div className="col-lg-6 pt-4 ml-3">
                <h5>{productName}</h5>
              </div>
            </div>
            <div className="row pt-2 ml-1">
              <p>{productDescription}</p>
            </div>
            <hr />
            <div className="row">
              <div className="col-lg-6 d-flex justify-content-start">
                <ProductPrice price={price} />
              </div>
              <div className="col-lg-6 d-flex justify-content-end">
                <WishlistButton
                  productKey={productKey}
                  userKey={userKey}
                  wishlist={wishlist}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export class Brand extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wishlist: [],
      sponsoredProductList: [],
      name: "",
      fetchInProgress: true
    };
    this.subscriptions = [];
    this.isInWishlist = this.isInWishlist.bind(this);
    this.userKey = "";
    this.getOnlyThisBrandItems = this.getOnlyThisBrandItems.bind(this);
  }

  componentDidMount() {
    this.setState({
      name: this.props.match.params.brandName,
      fetchInProgress: true
    });
    this.userKey = this.props.user.key;
    this.subscriptions.push(
      firebaseServices.getWishlist(this.userKey).subscribe(items => {
        this.setState({ wishlist: items });
        firebaseServices
          .getBrandByName(this.state.name)
          .then(brand => {
            this.subscriptions.push(
              firebaseServices
                .getSponsoredProducts()
                .subscribe(sponsoredProds => {
                  this.setState({
                    sponsoredProductList: this.getOnlyThisBrandItems(
                      sponsoredProds,
                      brand.key
                    ),
                    fetchInProgress: false
                  });
                })
            );
          })
          .catch(err => {
            console.log(err);
            this.setState({ sponsoredProductList: [] });
          });
      })
    );
  }

  getOnlyThisBrandItems(arr, brandID) {
    var newArray = [];
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].brandID === brandID) {
        newArray.push(arr[i]);
      }
    }
    return newArray;
  }

  componentWillUnmount() {
    this.subscriptions.forEach(element => {
      element.unsubscribe();
    });
  }

  isInWishlist(prod) {
    this.state.wishlist.forEach(item => {
      if (item.productID === prod.key) {
        return true;
      }
    });
    return false;
  }

  render() {
    const user = this.props.user;
    this.userKey = user.key;
    var sponsoredProducts = this.state.sponsoredProductList;
    var products = sponsoredProducts;
    const wishlist = this.props.wishlist;
    const brandName = this.state.name;
    var fetchInProgress = this.state.fetchInProgress;
    console.log("fetch in progress:" + fetchInProgress);
    const listProducts = products.map(product => (
      <div className="col-md-4" key={product.key}>
        <Product product={product} user={user} wishlist={wishlist} />
      </div>
    ));
    return (
      <div className="container">
        <h1>
          Welcome to the <b>{brandName}</b> page
        </h1>
        {fetchInProgress ? (
          <div className="col d-flex justify-content-center">
            <ReactLoading
              type={"spinningBubbles"}
              color={"#fff"}
              height={640}
              width={256}
            />
          </div>
        ) : (
          <div className="col">
            <div className="row p-0">{listProducts}</div>
          </div>
        )}
      </div>
    );
  }
}

export default Brand;
