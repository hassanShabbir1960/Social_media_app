import React, {Component, Fragment} from "react";
import {withAlert} from 'react-alert';
import {connect} from "react-redux";

export class Alerts extends Component{
    componentDidUpdate(prevProps, prevState, snapshot) {
        const {error, alert} = this.props
        if (error !== prevProps.error){
            if (error.msg.non_field_errors)
                alert.error(error.msg.non_field_errors.join())
            else if (error.msg.username)
                alert.error(error.msg.username.join())
            else if (error.msg.email)
                alert.error(error.msg.email.join())
            else if (error.msg.message)
                alert.error(error.msg.message)

        }
    }

    render() {
        return <Fragment />
    }
}
const mapStateToProps = state => ({
    error: state.errorReducer
})
export default connect(mapStateToProps)(withAlert()(Alerts))
