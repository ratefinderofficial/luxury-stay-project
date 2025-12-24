import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Aap yahan error ko logging service (Sentry/LogRocket) par bhej sakte hain
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom Fallback UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-gray-100">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle size={48} className="text-red-500" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h1>
            <p className="text-gray-500 mb-6">
              We encountered an unexpected issue. Our technical team has been notified.
            </p>

            {/* Developer Mode mein actual error dikhana helpful hota hai */}
            {process.env.NODE_ENV === 'development' && (
               <div className="bg-gray-100 p-3 rounded text-left text-xs text-red-600 mb-6 overflow-auto max-h-32">
                 {this.state.error?.toString()}
               </div>
            )}

            <button
              onClick={this.handleReload}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-900 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              <RefreshCw size={18} />
              Reload Application
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="mt-4 text-sm text-gray-500 hover:text-primary underline"
            >
              Go back to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;