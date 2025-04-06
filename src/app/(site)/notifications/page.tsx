'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'boost';
  actorId: string;
  postId?: string;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data: Notification[]) => {
        setNotifications(data);
        setLoading(false);
      });
  }, []);

  const formatTime = (time: string) =>
    new Date(time).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

  const renderMessage = (note: Notification) => {
    const typeText = {
      like: 'liked your promo',
      comment: 'commented on your promo',
      boost: 'boosted your promo',
    }[note.type];

    return (
      <div key={note.id} className="p-4 border-b border-neutral-800">
        <p className="text-sm">
          <span className="font-medium">@{note.actorId}</span> {typeText}
        </p>
        {note.postId && (
          <Link
            href={`/post/${note.postId}`}
            className="text-xs text-indigo-500 hover:underline"
          >
            View Promo
          </Link>
        )}
        <p className="text-xs text-gray-500 mt-1">{formatTime(note.createdAt)}</p>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto mt-16 px-4">
      <h1 className="text-2xl font-bold mb-6">🔔 Notifications</h1>
      {loading ? (
        <p className="text-gray-400">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-400">No notifications yet.</p>
      ) : (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md">
          {notifications.map(renderMessage)}
        </div>
      )}
    </div>
  );
}
