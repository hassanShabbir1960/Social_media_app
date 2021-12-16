import React from "react";
import Loader from "react-loader-spinner";

export default function LoadingPageComponent() {
  return (
    <div
      className="container-fluid text-center vh-100"
      style={{
        opacity: "0.8",
        backgroundColor: "white",
        position: "fixed",
        top: "0",
        left: "0",
        zIndex: "10",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          marginTop: "-50px",
          left: "50%",
          marginLeft: "-50px",
        }}
      >
        <Loader type="Puff" color="#cd3333" height={100} width={100} />
      </div>
    </div>
  );
}
