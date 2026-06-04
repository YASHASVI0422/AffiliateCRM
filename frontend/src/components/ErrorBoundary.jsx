import React, { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'rgb(6 9 15)' }}>
          <div 
            className="w-full max-w-md p-6 text-center space-y-4"
            style={{
              backgroundColor: 'rgb(10 14 24)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem'
            }}
          >
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle size={24} />
            </div>
            <h2 className="text-slate-100 font-semibold text-lg" style={{ fontFamily: 'Sora, sans-serif' }}>
              Something went wrong
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary text-sm w-full py-2.5 rounded-xl font-medium transition-all"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', border: 'none', color: '#fff' }}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
