import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { AlertCircle, Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center border border-slate-200">
        <AlertCircle className="w-8 h-8" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Clinical Route Not Found (404)</h1>
        <p className="text-sm text-slate-500 mt-1 max-w-md">
          The requested page or clinical view does not exist or has been relocated.
        </p>
      </div>
      <Link to="/overview">
        <Button variant="primary" icon={Home}>
          Return to Overview
        </Button>
      </Link>
    </div>
  );
}
