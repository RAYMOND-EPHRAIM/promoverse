// src/components/ui/Feed.tsx
'use client';

import useSWR from 'swr';
import { PostCard } from './Post';
import { Loader } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const Feed = () => {
  const { data, error, isLoading } = useSWR('/api/posts', fetcher);

  if (isLoading) return <Loader className="animate-spin mx-auto mt-10 text-gray-400" />;
  if (error) return <p className="text-center mt-10 text-red-500">Failed to load posts.</p>;
  if (!data || data.length === 0) return <p className="text-center mt-10 text-gray-400">No promos yet. Be the first!</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
      {data.map((post: any) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};
