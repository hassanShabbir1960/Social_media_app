import React from "react";
import { Link } from "react-router-dom";

export default function Component404() {
  return (
    <div class="container vh-100">
      <div class="row h-100 align-items-center">
        <div class="col-md-12 text-center">
          <div className="display-4 text-pink">
            You've landed yourself on the 404!
          </div>
          <div className="h1">Did you mistype something?</div>
          <div className="h3">
            Don't worry! We can get you back to a{" "}
            <Link className="alert-link text-pink" to="/home">
              safe place
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
