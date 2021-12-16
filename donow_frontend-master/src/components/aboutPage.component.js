import React, { Component } from "react";
import FooterComponent from "./footer.component";
import HeaderComponent from "./header.component";
import "../css/static-pages.css";

export default class AboutPageComponent extends Component {
  render() {
    return (
      <div>
        <HeaderComponent></HeaderComponent>
        <div className="container-fluid row justify-content-center top-div">
          <h1>Donow. Anywhere. Anytime.</h1>
        </div>
        <div className="container-md mt-3 mb-lg-3">
          <h2>About Us</h2>
          <span className="red-bar"></span>
          <div className="mt-5 text-center">
            <p>
              At Donow, we've seen again and again how the seemingly simple act
              of creating can be a force for growth, change, and discovery in
              people's lives. We want to inspire and multiply the kind of
              creative exploration that furthers expression, learning and
              application.
            </p>
            <p>
              Donow is an online learning community with thousands of classes
              for creative and curious people, on topics including illustration,
              design, photography, video, freelancing. and more. On Donow,
              millions of members come together to find inspiration and take the
              next step in their creative journey.
            </p>
          </div>
          <img
            src={process.env.PUBLIC_URL + "/aboutComponenet/drawing.svg"}
            alt="..."
            style={{
              position: "absolute",
              right: "0px",
              top: "340px",
              width: "35%",
              maxWidth: "800px",
            }}
          ></img>
        </div>
        <div className="container-md mt-lg-5">
          <div className="row m-0">
            <div className="col-md-6 col-12 mb-3">
              <div className="p-5 gray">
                <h3 className="font-weight-bold">A great place to learn</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Vivamus tincidunt orci vitae eros finibus lobortis. Nullam
                  nisl lorem, faucibus sed tellus id, vulputate tincidunt
                  mauris. Cras imperdiet est neque, sed dapibus lorem ornare ac.
                  Pellentesque habitant morbi tristique senectus et netus et
                  malesuada fames ac turpis egestas. Cras vel congue velit.
                  Vestibulum vel felis vel nunc euismod porta. Pellentesque
                  habitant morbi tristique senectus et netus et malesuada fames
                  ac turpis egestas. Nam scelerisque ex et laoreet lobortis.
                  Nunc orci turpis, rhoncus eu porta vel, pretium et libero. Sed
                  quis lectus augue. Ut suscipit, arcu nec elementum euismod,
                  quam nunc placerat nibh, sed viverra ex ex id eros. Nunc
                  vulputate posuere nulla id pellentesque. Ut sodales neque a
                  dolor facilisis, eu vestibulum nulla interdum.
                </p>
                <div className="text-center">
                  <button className="btn-solid-link text-pink align-self-center">
                    Join our team
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12  text-center m-auto">
              <img
                src={process.env.PUBLIC_URL + "/aboutComponenet/drawing-1.svg"}
                alt="..."
                width="70%"
              ></img>
            </div>
          </div>
        </div>
        <div className="container-md pt-5">
          <div className="row m-0">
            <div className="col-md-6 col-12 text-center m-auto">
              <img
                src={process.env.PUBLIC_URL + "/aboutComponenet/drawing-1.svg"}
                alt="..."
                width="70%"
              ></img>
            </div>
            <div className="col-md-6 col-12 mt-3">
              <div className="p-5 gray">
                <h3 className="font-weight-bold">Transforming Lives</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Vivamus tincidunt orci vitae eros finibus lobortis. Nullam
                  nisl lorem, faucibus sed tellus id, vulputate tincidunt
                  mauris. Cras imperdiet est neque, sed dapibus lorem ornare ac.
                  Pellentesque habitant morbi tristique senectus et netus et
                  malesuada fames ac turpis egestas. Cras vel congue velit.
                  Vestibulum vel felis vel nunc euismod porta. Pellentesque
                  habitant morbi tristique senectus et netus et malesuada fames
                  ac turpis egestas. Nam scelerisque ex et laoreet lobortis.
                  Nunc orci turpis, rhoncus eu porta vel, pretium et libero. Sed
                  quis lectus augue. Ut suscipit, arcu nec elementum euismod,
                  quam nunc placerat nibh, sed viverra ex ex id eros. Nunc
                  vulputate posuere nulla id pellentesque. Ut sodales neque a
                  dolor facilisis, eu vestibulum nulla interdum.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container-md" style={{ paddingBottom: "10%" }}>
          <div className="row pt-5">
            <div className="col-md-12 col-12 text-center">
              <h4>What we empower?</h4>
            </div>
          </div>
          <div className="row m-0 text-center pt-5">
            <div className="col-md-4 col-12 mt-5">
              <img
                src={process.env.PUBLIC_URL + "/aboutComponenet/drawing-2.svg"}
                alt="..."
                width="30%"
              ></img>
              <h3 className="text-pink">Community</h3>
              <p className="text-pink m-0">Discover new content.</p>
              <p className="text-pink m-0">Get inspired.</p>
            </div>
            <div className="col-md-4 col-12 mt-5">
              <img
                src={process.env.PUBLIC_URL + "/aboutComponenet/drawing-3.svg"}
                alt="..."
                width="30%"
              ></img>
              <h3 className="text-pink">Creators</h3>
              <p className="text-pink m-0">Earn money.</p>
              <p className="text-pink m-0">Share expertise.</p>
            </div>
            <div className="col-md-4 col-12 mt-5">
              <img
                src={process.env.PUBLIC_URL + "/aboutComponenet/drawing-4.svg"}
                alt="..."
                width="30%"
              ></img>
              <h3 className="text-pink">Students</h3>
              <p className="text-pink m-0">Learn new skills.</p>
              <p className="text-pink m-0">Try new things.</p>
              <p className="text-pink m-0">Do it yourself.</p>
            </div>
          </div>
        </div>
        <FooterComponent></FooterComponent>
      </div>
    );
  }
}
