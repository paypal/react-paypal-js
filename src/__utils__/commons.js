import { Component } from "react";

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error) {
        this.setState({ hasError: true });
        this.props.onError(error);
    }

    render() {
        return !this.state.hasError && this.props.children;
    }
}
