import React, { Component } from 'react';
import MessageSnackbar from './MessageSnackbar';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isOffline: !navigator.onLine // Inicia verificando o estado da conexão
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('Erro capturado:', error, errorInfo);
  }

  componentDidMount() {
    window.addEventListener('online', this.handleOnlineStatus);
    window.addEventListener('offline', this.handleOnlineStatus);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnlineStatus);
    window.removeEventListener('offline', this.handleOnlineStatus);
  }

  handleOnlineStatus = () => {
    this.setState({ isOffline: !navigator.onLine });
  };

  render() {
    if (this.state.hasError) {
      return (
        <MessageSnackbar
          message={this.state.error ? this.state.error.message : 'Ocorreu um erro'}
          severity={this.state.error ? 'error' : 'info'}
        />
      );
    }

    if (this.state.isOffline) {
      return (
        <MessageSnackbar
          message="Você está offline. Verifique sua conexão com a internet."
          severity="warning"
        />
      );
    }

    return this.props.children;
  }
}

export default React.memo(ErrorBoundary);