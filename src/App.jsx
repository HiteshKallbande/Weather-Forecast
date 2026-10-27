import React from 'react';
import { Sparkles } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-midnight-900 text-slate-100 flex items-center justify-center p-6">
      <div className="glass-card p-8 rounded-2xl max-w-md w-full text-center">
        <Sparkles className="w-10 h-10 text-aether-cyan mx-auto mb-4 animate-pulse" />
        <h1 className="text-2xl font-bold tracking-tight">Aetheris Weather</h1>
        <p className="text-sm text-slate-400 mt-2">Ultra-luxury minimalist atmospheric forecasting system.</p>
      </div>
    </div>
  );
}
