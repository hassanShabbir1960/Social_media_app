import {applyMiddleware, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";
import authReducer from "./reducers/auth";
import errorReducer from "./reducers/errors";
import {combineReducers} from "redux";


const reducers = combineReducers({
   authReducer, errorReducer
});

const initialState = {};
const middleware = [thunk];

const store = createStore(
    reducers,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware)
));

export default store;
