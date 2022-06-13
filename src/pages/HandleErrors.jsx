import React, { Component } from "react";

class HandleEroors extends Component {
    constructor(props) {
        super(props);
        this.state = { AnyErrors: false };
    }

    componentDidCatch(error, info) {
        this.setState({ AnyErrors: true });
    }

    render() {
        if (this.state.AnyErrors) {
            return (
                <h1 className="fw3 f2 light-blue">
                    Error, Please reload and try again !
                </h1>
            );
        }
        return this.props.children;
    }
}

export default HandleEroors;
