import React, { Component, ErrorInfo, ReactNode } from 'react';
import AppFallback from './AppFallback';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log additional debugging information
    console.error('Error stack:', error.stack);
    console.error('Component stack:', errorInfo.componentStack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // Check for common issues
    if (error.message.includes('Supabase')) {
      console.error('Supabase connection issue detected');
    }
    if (error.message.includes('gtag')) {
      console.error('Google Analytics issue detected');
    }
    if (error.message.includes('import')) {
      console.error('Module import issue detected');
    }
    
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return <AppFallback error={this.state.error} onRetry={this.handleReload} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
