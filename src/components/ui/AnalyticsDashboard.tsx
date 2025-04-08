'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

interface AnalyticsData {
  views: number;
  clicks: number;
  engagementRate: string;
  boostEffectiveness: string;
  boostLevel: number;
  verseEngagement: Array<{
    verseId: string;
    views: number;
    clicks: number;
  }>;
  locationEngagement: Array<{
    latitude: number;
    longitude: number;
    views: number;
    clicks: number;
  }>;
  dailyStats: Array<{
    date: string;
    views: number;
    clicks: number;
  }>;
}

interface AnalyticsDashboardProps {
  promotionId: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AnalyticsDashboard({ promotionId }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/analytics/${promotionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        const data = await response.json();
        setAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [promotionId]);

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (!analytics) {
    return <div className="text-center py-8">No analytics data available</div>;
  }

  const verseData = analytics.verseEngagement.map((engagement) => ({
    name: `Verse ${engagement.verseId}`,
    views: engagement.views,
    clicks: engagement.clicks,
  }));

  const locationData = analytics.locationEngagement.map((engagement) => ({
    name: `${engagement.latitude}, ${engagement.longitude}`,
    views: engagement.views,
    clicks: engagement.clicks,
  }));

  const dailyData = analytics.dailyStats.map((stat) => ({
    ...stat,
    date: format(new Date(stat.date), 'MMM d'),
  }));

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Views</h3>
          <p className="text-2xl font-bold">{analytics.views}</p>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Clicks</h3>
          <p className="text-2xl font-bold">{analytics.clicks}</p>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 dark:text-gray-400">Engagement Rate</h3>
          <p className="text-2xl font-bold">{analytics.engagementRate}</p>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 dark:text-gray-400">Boost Level</h3>
          <p className="text-2xl font-bold">{analytics.boostLevel}</p>
        </div>
      </div>

      {/* Daily Stats Chart */}
      <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Daily Performance</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#0088FE"
                name="Views"
              />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#00C49F"
                name="Clicks"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Verse Engagement Chart */}
      <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Verse Engagement</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={verseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" fill="#0088FE" name="Views" />
              <Bar dataKey="clicks" fill="#00C49F" name="Clicks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Location Engagement Chart */}
      <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Location Engagement</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={locationData}
                dataKey="views"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {locationData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 