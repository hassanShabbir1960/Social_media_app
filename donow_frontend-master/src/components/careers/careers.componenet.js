import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../../css/static-pages.css";
import HeaderComponent from "../header.component";
import FooterComponent from "../footer.component";

export default class CareersComponenet extends Component {
  render() {
    return (
      <div>
        <HeaderComponent></HeaderComponent>
        <div className="container-fluid row m-0 justify-content-center top-pan">
          <div className="text-center">
            <h1>Want to work with us?</h1>
            <p>
              Come and join our team with creative expertise, innovative ideas
              and enhance your skills more than ever
            </p>
            <Link to="/careers/groups">
              <span className="btn btn-pink rounder pl-4 pr-4">
                Join Our Team
              </span>
            </Link>
          </div>
        </div>
        <div className="container mt-5">
          <h3 className="text-center">We Prefer People</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
            accumsan mi vitae scelerisque congue. Quisque felis elit, suscipit
            eu mi at, condimentum rutrum dolor. Vivamus at laoreet augue, eu
            vulputate sem. Maecenas consequat sollicitudin venenatis. Mauris
            ullamcorper, magna in gravida placerat, justo neque placerat purus,
            ac eleifend ante orci at erat. Vestibulum porta turpis sed purus
            condimentum, id ultrices tellus pellentesque. Etiam ac velit vitae
            magna sollicitudin ullamcorper. Nullam imperdiet id tellus et
            semper. Mauris tellus est, euismod dignissim bibendum quis, rutrum
            nec ex.{" "}
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
            accumsan mi vitae scelerisque congue. Quisque felis elit, suscipit
            eu mi at, condimentum rutrum dolor. Vivamus at laoreet augue, eu
            vulputate sem. Maecenas consequat sollicitudin venenatis. Mauris
            ullamcorper, magna in gravida placerat, justo neque placerat purus,
            ac eleifend ante orci at erat. Vestibulum porta turpis sed purus
            condimentum, id ultrices tellus pellentesque. Etiam ac velit vitae
            magna sollicitudin ullamcorper. Nullam imperdiet id tellus et
            semper. Mauris tellus est, euismod dignissim bibendum quis, rutrum
            nec ex.{" "}
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
            accumsan mi vitae scelerisque congue. Quisque felis elit, suscipit
            eu mi at, condimentum rutrum dolor. Vivamus at laoreet augue, eu
            vulputate sem. Maecenas consequat sollicitudin venenatis. Mauris
            ullamcorper, magna in gravida placerat, justo neque placerat purus,
            ac eleifend ante orci at erat. Vestibulum porta turpis sed purus
            condimentum, id ultrices tellus pellentesque. Etiam ac velit vitae
            magna sollicitudin ullamcorper. Nullam imperdiet id tellus et
            semper. Mauris tellus est, euismod dignissim bibendum quis, rutrum
            nec ex.{" "}
          </p>
        </div>
        <div className="container-fluid mt-lg-5">
          <div className="row m-0">
            <div className="col-md-6 col-12 mb-3">
              <div className="p-5">
                <h3 className="font-weight-bold">Team Building</h3>
                <span className="red-bar"></span>
                <p className="mt-3">
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
            <div className="col-md-6 col-12 text-center m-auto">
              <img
                src={process.env.PUBLIC_URL + "/careers/drawing.svg"}
                alt="..."
                width="100%"
              ></img>
            </div>
          </div>
        </div>
        <div className="container-fluid pt-5">
          <div className="row m-0">
            <div className="col-md-6 col-12 text-center m-auto">
              <img
                src={process.env.PUBLIC_URL + "/careers/drawing.svg"}
                alt="..."
                width="100%"
              ></img>
            </div>
            <div className="col-md-6 col-12 mt-3">
              <div className="p-5">
                <h3 className="font-weight-bold">Meeting & Planning</h3>
                <span className="red-bar"></span>
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
        <div className="text-center">
          <h2 className="font-light">Feel free to be a part of our team</h2>
          <img
            className="img-fluid"
            src={process.env.PUBLIC_URL + "/careers/drawing.svg"}
            alt="..."
          ></img>
          <div>
            <Link to="/careers/groups">
              <span className="btn btn-pink rounder pl-4 pr-4">
                Join Our Team
              </span>
            </Link>
          </div>
        </div>
        <div className="mt-5">
          <FooterComponent></FooterComponent>
        </div>
      </div>
    );
  }
}
