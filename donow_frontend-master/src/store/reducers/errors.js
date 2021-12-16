import {GET_ERROR} from '../actions/actionTypes'
import {updateObject} from "../utility";

const initialState ={
    msg:  {},
    status: null
}

const getError = (state, action) => {
    return updateObject(state, {
            msg: action.msg,
            status: action.status
        })
}

const errorReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ERROR: return getError(state, action)

        default:
            return state
    }
}

export default errorReducer;
