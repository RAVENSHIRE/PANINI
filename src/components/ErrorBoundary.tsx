import React, { ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-slate-950 border border-slate-900 rounded-3xl my-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
            <AlertOctagon className="w-7 h-7 text-rose-500" />
          </div>
          <h2 className="font-sans text-lg font-black text-white tracking-tight">
            Something went wrong inside this section
          </h2>
          <p className="font-sans text-xs text-slate-400 mt-2 max-w-md leading-relaxed">
            {this.state.error?.message || 'An unexpected rendering error occurred. You can safely try reloading the applet or resetting the current tab.'}
          </p>
          <button
            onClick={this.handleReset}
            className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-sans text-xs font-bold uppercase rounded-xl transition-all cursor-pointer shadow-md"
          >
            <RefreshCcw className="w-4.5 h-4.5 animate-spin" style={{ animationDuration: '4s' }} />
            Reload & Recover App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
