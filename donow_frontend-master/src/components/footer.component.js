import React from "react";
import { Link } from "react-router-dom";

export const FooterComponent = () => {
  return (
    <footer className="page-footer bg-pink font-small text-white p-3 pb-5">
      <div className="container-fluid text-center text-md-left pb-3">
        <div className="row">
          <div className="col-lg-8 pt-3">
            <div className="h3">
              <strong>Create your own workshop.</strong>
              <div className="w-100 d-sm-none d-block"></div>
              <button
                className="ml-3 btn btn-danger bg-transparent rounder p-2 px-3 text-white border-white"
                style={{ border: "3px solid" }}
              >
                <strong>Get Started</strong>
              </button>
            </div>
            <div className="w-100 bg-white" style={{ height: "1px" }}></div>
            <div className="row mt-3">
              <div className="col-sm-4 col-6">
                <Link to="/help" className="btn-solid-link text-white h5 mb-3">
                  <strong>Accounts</strong>
                </Link>
                <ul className="list-unstyled">
                  <li>
                    <Link to="/sign-up" className="text-white my-2">
                      Sign Up
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="text-white my-2">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/help" className="text-white my-2">
                      Help
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-sm-4 col-6">
                <Link
                  to="/discover"
                  className="btn-solid-link text-white h5 mb-3"
                >
                  <strong>Discover</strong>
                </Link>
                <ul className="list-unstyled">
                  <li>
                    <Link to="/discover/creators" className="text-white my-2">
                      Creators
                    </Link>
                  </li>
                  <li>
                    <Link to="/discover/workshops" className="text-white my-2">
                      Workshops
                    </Link>
                  </li>
                  <li>
                    <Link to="discover/sitemap" className="text-white my-2">
                      Sitemap
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-sm-4 col-6">
                <Link to="/about" className="btn-solid-link text-white h5 mb-3">
                  <strong>Company</strong>
                </Link>
                <ul className="list-unstyled">
                  <li>
                    <Link to="/about" className="text-white my-2">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-white my-2">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/careers" className="text-white my-2">
                      Career
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog" className="text-white my-2">
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="w-75 bg-white mt-5 d-md-block d-none"
              style={{ height: "1px" }}
            ></div>
            <div
              className="w-100 bg-white mt-5 d-md-none d-block"
              style={{ height: "1px" }}
            ></div>
            <div className="mt-1">
              <span className="footer-copyright mr-3">© 2020 DoNow LLC</span>
              <div className="w-100 d-sm-none d-block"></div>
              <Link
                className="alert-link text-white mx-3"
                to="/terms-of-service"
              >
                Terms of Service
              </Link>
              <div className="w-100 d-sm-none d-block"></div>
              <Link className="alert-link text-white mx-3" to="/privacy-policy">
                Privacy Policy
              </Link>
              <div className="w-100 d-sm-none d-block"></div>
              <Link className="alert-link text-white mx-3" to="/cookie-policy">
                Cookie Policy
              </Link>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="h-50 d-none d-lg-block"></div>
            <div className="mt-4 text-center">
              <button className="btn btn-secondary m-1 bg-dark btn-lg">
                Google Play
              </button>
              <button className="btn btn-secondary m-1 bg-dark btn-lg">
                Apple Store
              </button>
            </div>
            <div className="mt-4 text-center">
              <p className="m-0">
                <strong>Follow Us</strong>
              </p>
              <div>
                <Link to="#i" className="text-white lead my-1 mx-3">
                  <i className="fa fa-instagram"></i>
                </Link>
                <Link to="#y" className="text-white lead my-1 mx-3">
                  <i className="fa fa-youtube"></i>
                </Link>
                <Link to="#t" className="text-white lead my-1 mx-3">
                  <i className="fa fa-twitter"></i>
                </Link>
                <Link to="#f" className="text-white lead my-1 mx-3">
                  <i className="fa fa-facebook"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
