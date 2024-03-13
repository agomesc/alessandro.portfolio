import React, { Component } from 'react';
import MessageSnackbar from '../Components/MessageSnackbar';

class ErrorBoundary extends Component {
    constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.error={};
    this.errorInfo = {};
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.error = error;
    this.errorInfo = errorInfo;
    console.error('Erro capturado:', error, errorInfo);
    debugger
  }

  render() {
    if (this.state.hasError) {
      // Você pode personalizar a mensagem de erro aqui.
      return <MessageSnackbar message={this.error} severity="info" />
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
