import React from 'react';

interface Props { children: React.ReactNode }
interface State { hasError: boolean; error: Error | null }

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
        <div className="max-w-lg w-full bg-white rounded-xl border border-red-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">⚠️</span>
            <h2 className="text-lg font-bold text-red-700">Something went wrong</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            The application encountered an unexpected error. Check the browser console for details.
          </p>
          <pre className="text-xs bg-red-50 p-4 rounded-lg overflow-auto text-red-800 max-h-40">
            {this.state.error?.message}
          </pre>
          <button
            className="mt-4 btn-primary"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
