import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "font-awesome/css/font-awesome.css";
import store from "./store/store";
import { Provider } from "react-redux";
import { Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

//Alert options
const alertOptions = {
  timeout: 3000,
  position: "top center",
};

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <App />
        </AlertProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
