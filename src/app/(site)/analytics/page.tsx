'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChart, Line } from 'recharts';
import { Calendar, TrendingUp, Users, Star, Zap } from 'lucide-react';
import { useState } from 'react';

const mockData = [
  { name: 'Mon', views: 400, engagement: 240 },
  { name: 'Tue', views: 300, engagement: 139 },
  { name: 'Wed', views: 200, engagement: 980 },
  { name: 'Thu', views: 278, engagement: 390 },
  { name: 'Fri', views: 189, engagement: 480 },
  { name: 'Sat', views: 239, engagement: 380 },
  { name: 'Sun', views: 349, engagement: 430 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('week');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your promotion performance across the cosmos
        </p>
      </div>

      {/* Time Range Filter */}
      <div className="flex gap-2 mb-8">
        {['day', 'week', 'month', 'year'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg transition ${
              timeRange === range
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700'
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
            <Users size={20} />
            <span>Total Views</span>
          </div>
          <div className="text-2xl font-bold">24,567</div>
          <div className="text-green-500 text-sm">+12.5% from last period</div>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
            <Star size={20} />
            <span>Engagement</span>
          </div>
          <div className="text-2xl font-bold">1,234</div>
          <div className="text-green-500 text-sm">+8.3% from last period</div>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
            <Zap size={20} />
            <span>Boosted Views</span>
          </div>
          <div className="text-2xl font-bold">5,678</div>
          <div className="text-green-500 text-sm">+23.1% from last period</div>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
            <Calendar size={20} />
            <span>Active Promotions</span>
          </div>
          <div className="text-2xl font-bold">12</div>
          <div className="text-green-500 text-sm">+2 from last period</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Views Over Time</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Engagement Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="engagement" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Performing Promotions */}
      <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Top Performing Promotions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-600 dark:text-gray-400">
                <th className="pb-4">Promotion</th>
                <th className="pb-4">Views</th>
                <th className="pb-4">Engagement</th>
                <th className="pb-4">Boost Level</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className="border-t dark:border-neutral-700">
                  <td className="py-4">Summer Music Festival</td>
                  <td className="py-4">2,345</td>
                  <td className="py-4">567</td>
                  <td className="py-4">Level 3</td>
                  <td className="py-4">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 