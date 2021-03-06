import React from "react";
import "../Pages/CssPages/Wishlist.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import FirebaseServices from "../firebase/services";

library.add(faInfoCircle);

const firebaseServices = new FirebaseServices();

class ProductProgressbar extends React.Component {
  render() {
    const quantity = this.props.quantity;
    const remaining = this.props.remaining;
    const percent = (remaining * 100) / quantity;
    const label = this.props.label;
    const progressStyle = {
      width: percent + "%",
      color: "black"
    };
    var progressClass = "progress-bar ";
    if (label === "yourProgress") {
      if (percent <= 30) progressClass += "bg-danger";
      else if (percent > 30 && percent <= 60) progressClass += "bg-warning";
      else if (percent >= 100) progressClass += "bg-success";
      else progressClass += "bg-info";
    } else if (label === "avgOfCompetitors") {
      if (percent <= 30) progressClass += "bg-success";
      else if (percent > 30 && percent <= 60) progressClass += "bg-warning";
      else if (percent >= 100) progressClass += "bg-danger";
      else progressClass += "bg-info";
    } else progressClass += "bg-info";

    return (
      <div className="progress">
        <div
          className={progressClass}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin="0"
          aria-valuemax="100"
          style={progressStyle}
        >
          {remaining + "/" + quantity}
        </div>
      </div>
    );
  }
}

/*Picture component-fixed */

class Picture extends React.Component {
  render() {
    const productPicture = this.props.url;
    const productName = this.props.name;
    return (
      <img
        className="rounded imag d-block"
        width="100"
        height="100"
        src={productPicture}
        alt={productName}
      />
    );
  }
}

class Title extends React.Component {
  render() {
    const brandName = this.props.brandName;
    const companyName = this.props.companyName;
    return (
      <div>
        <strong>
          {this.props.sponsored
            ? `Sponsored by ${brandName}`
            : `${companyName}`}{" "}
        </strong>
      </div>
    );
  }
}

class ProductModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = { brand: {}, company: {}, avgOfCompetitors: 0 };
    this.subscriptions = [];
  }

  componentWillMount() {
    this.subscriptions.push(
      firebaseServices.getBrand(this.props.product.brandID).subscribe(brand => {
        this.setState({ brand: brand });
      })
    );
    this.subscriptions.push(
      firebaseServices
        .getCompany(this.props.product.companyID)
        .subscribe(company => {
          this.setState({ company: company });
        })
    );
    fetch(
      `https://stravakudos.herokuapp.com/wishlistAverage?productId=${
        this.props.product.key
      }`
    )
      .then(res => {
        if (res.status !== 200) {
          //console.log("Could not fetch average of competitors");
          return;
        }
        res
          .json()
          .then(data => {
            this.setState({ avgOfCompetitors: data });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  componentWillUnmount() {
    this.subscriptions.forEach(obs => obs.unsubscribe());
  }

  render() {
    const product = this.props.product;
    const sponsored = product.sponsored;
    const brand = this.state.brand;
    const productName = product.name;
    const stock = product.stock;
    const productDescription = product.description;
    const productPicture = product.picURL;

    const brandName = brand.name;
    const company = this.state.company;
    const companyName = company.name;

    const price = product.price;
    const tresholdPercentage = product.tresholdPercentage;
    const priceToUnlock = (price * tresholdPercentage).toFixed(2);

    const avgOfCompetitors = this.state.avgOfCompetitors;
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="card card-primary">
            <div className="card-header bg-primary  ">
              <div className="row">
                <div
                  className="col-sm-6 text-white"
                  style={{ fontWeight: "bold" }}
                >
                  {price} Coins
                </div>
                <div className="col-sm-6 text-right text-white">
                  <Title
                    brandName={brandName}
                    sponsored={sponsored}
                    companyName={companyName}
                  />
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-4">
                  <div className="row ml-0 mt-1">
                    <Picture
                      className="productPicture"
                      url={productPicture}
                      name={productName}
                    />
                  </div>
                  <p className="strong d-flex justify-content-left mt-2">
                    Description:
                  </p>
                </div>
                <div className="col-md-5">
                  <div className="pb-2">Stock: {stock}</div>
                  <p className="text-left mb-1">Average of competitors</p>
                  <div className="pb-2">
                    <ProductProgressbar
                      quantity={priceToUnlock}
                      remaining={avgOfCompetitors}
                      label={"avgOfCompetitors"}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md">
                  <p className="d-flex justify-content-left align-content-center">
                    {productDescription}
                  </p>
                </div>
                <div className="col-md text-right">
                  Unlocking value: {priceToUnlock} Coins
                  <FontAwesomeIcon
                    style={{ marginLeft: "5px" }}
                    data-tip="React-tooltip"
                    icon="info-circle"
                  />
                  <ReactTooltip place="left" type="dark" effect="solid">
                    <p>
                      To unlock a product, you must gain at least this amount of
                      Coins from the moment you added it to the wishlist and
                      have enough Coins to buy it
                    </p>
                  </ReactTooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductModal;
