import React from 'react';
import { cookies } from 'next/headers';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import StatsCards from '@/components/dashboard/StatsCards';
import ContinueReading from '@/components/dashboard/ContinueReading';
import { getDashboardStats } from '@/services/dashboardService';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('readeverse_user')?.value;
  
  let userId = 'demo-user-id'; // Fallback for tests if no cookie
  if (userCookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(userCookie));
      userId = parsed.id;
    } catch (e) {
      console.error("Failed to parse user cookie", e);
    }
  }

  const stats = await getDashboardStats(userId);

  return (
    <div className="animate-in fade-in duration-500">
      <WelcomeBanner />
      <StatsCards stats={stats} />
      
      <div className="flex flex-col gap-8">
        <ContinueReading book={null} />
      </div>
    </div>
  );
}
