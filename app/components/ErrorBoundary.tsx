import React, { type ReactNode } from 'react';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // log error if needed
  }
  render() {
    if (this.state.hasError) {
      return <div className="p-8 text-red-600">Something went wrong: {this.state.error?.message || 'Unknown error'}</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
