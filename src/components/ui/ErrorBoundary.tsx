import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4" role="alert" aria-live="assertive">
          <h2 className="text-3xl font-serif text-[#1C1C1C] mb-4">Something went wrong.</h2>
          <p className="text-gray-600 mb-8 max-w-md">
            We apologize for the inconvenience. Please try refreshing the page or contact us if the problem persists.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-[#1C1C1C] text-[#F7F5F0] hover:bg-[#2D2D2D] transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
