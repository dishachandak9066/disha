import React from 'react';
import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-gray-400 font-medium animate-pulse">Loading dashboard statistics...</p>
    </div>
  );
}
