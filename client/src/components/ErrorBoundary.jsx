// src/components/ErrorBoundary.jsx
import React from "react";
import { logError } from "../utils/logError";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logError(error, "Global React Error");
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-center text-red-600">
          <h1 className="text-2xl font-bold">⚠️ Something went wrong.</h1>
          <p>Please refresh the page or try again later.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
