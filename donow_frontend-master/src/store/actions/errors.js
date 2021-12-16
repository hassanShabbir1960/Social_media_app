import {GET_ERROR} from "./actionTypes";


export const getError = (msg, status) => {
    return{
        type: GET_ERROR,
        msg,
        status
     }
}
