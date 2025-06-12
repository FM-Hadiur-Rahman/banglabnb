// ErrorBoundary.jsx
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorInfo: error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-100 text-red-800 p-4 rounded">
          <h2>Something went wrong.</h2>
          <pre>{this.state.errorInfo?.toString()}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
