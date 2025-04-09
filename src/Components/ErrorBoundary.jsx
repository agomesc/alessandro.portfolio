import React, { Component } from 'react';
import { Alert, AlertTitle, Button, Box, Typography, Snackbar } from '@mui/material';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isOffline: !navigator.onLine,
      showSnackbar: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error, showSnackbar: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
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

  handleRetry = () => {
    window.location.reload();
  };

  handleCloseSnackbar = () => {
    this.setState({ showSnackbar: false });
  };

  render() {
    const { hasError, error, isOffline, showSnackbar } = this.state;

    if (hasError) {
      return (
        <Box sx={{ padding: 4, textAlign: 'center' }}>
          <Alert severity="error">
            <AlertTitle>Erro inesperado</AlertTitle>
            {error?.message || 'Algo deu errado ao carregar a aplicação.'}
          </Alert>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Tente recarregar a página. Se o problema persistir, tente novamente mais tarde.
          </Typography>
          <Button variant="contained" color="error" onClick={this.handleRetry} sx={{ mt: 2 }}>
            Recarregar Página
          </Button>

          <Snackbar
            open={showSnackbar}
            autoHideDuration={8000}
            onClose={this.handleCloseSnackbar}
            message="Um erro foi detectado"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          />
        </Box>
      );
    }

    if (isOffline) {
      return (
        <>
          <Snackbar
            open
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            message="Você está offline. Verifique sua conexão com a internet."
          />
          {this.props.children}
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
