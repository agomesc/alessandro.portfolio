import React, { Component } from 'react';
import MessageSnackbar from './MessageSnackbar';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('Erro capturado:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <MessageSnackbar message={this.state.error.message} severity="info" />
      );
    }

    return this.props.children;
  }
}

export default React.memo(ErrorBoundary);
