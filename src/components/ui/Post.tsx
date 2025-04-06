'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export const PostCard = ({ post }: { post: any }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length ?? 0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isBoosting, setIsBoosting] = useState(false);
  const [hasBoosted, setHasBoosted] = useState(post.boosted);
  const [analytics, setAnalytics] = useState<{ views: number; clicks: number } | null>(null);

  // 📊 Track views
  useEffect(() => {
    fetch(`/api/analytics/${post.id}`, { method: 'POST' });
  }, [post.id]);

  // 📈 Get analytics
  useEffect(() => {
    fetch(`/api/analytics/${post.id}`)
      .then((res) => res.json())
      .then(setAnalytics);
  }, [post.id]);

  // 🖤 Like
  const toggleLike = async () => {
    const res = await fetch(`/api/post/${post.id}/like`, { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
      setLiked(data.liked);
      setLikeCount(data.count);
    }
  };

  // 💬 Comment
  const submitComment = async () => {
    if (!newComment.trim()) return;

    const res = await fetch(`/api/post/${post.id}/comment`, {
      method: 'POST',
      body: JSON.stringify({ text: newComment }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      const added = await res.json();
      setComments((prev) => [...prev, added]);
      setNewComment('');
    }
  };

  // 🚀 Boost
  const handleBoost = async () => {
    if (isBoosting) return;
    setIsBoosting(true);

    const res = await fetch('/api/wallet/boost', {
      method: 'POST',
      body: JSON.stringify({ postId: post.id, amount: 25 }),
      headers: { 'Content-Type': 'application/json' },
    });

    setIsBoosting(false);

    if (res.ok) {
      setHasBoosted(true);
      alert('🚀 Promo successfully boosted!');
    } else {
      const err = await res.json();
      alert(err.error || 'Boost failed. Try again.');
    }
  };

  // 🧠 Load comments
  useEffect(() => {
    fetch(`/api/post/${post.id}/comment`)
      .then((res) => res.json())
      .then(setComments);
  }, [post.id]);

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
      {post.mediaUrl && (
        <img src={post.mediaUrl} alt="media" className="w-full h-52 object-cover" />
      )}
      <div className="p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">@{post.author?.username}</p>
        <p className="text-lg font-semibold mb-2">{post.content}</p>

        <div className="flex flex-wrap gap-2 mb-2">
          {post.hashtags?.map((tag: string) => (
            <Link key={tag} href={`/hashtag/${tag}`} className="text-indigo-600 text-sm hover:underline">
              #{tag}
            </Link>
          ))}
        </div>

        {/* Like */}
        <button onClick={toggleLike} className="flex items-center gap-1 text-sm mb-3">
          <Heart size={16} className={liked ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
          {likeCount}
        </button>

        {/* Comments */}
        <div className="space-y-2">
          {comments.map((c: any, i: number) => (
            <div key={i} className="text-sm text-gray-700 dark:text-gray-300">
              <strong>@{c.author.username}</strong>: {c.text}
            </div>
          ))}
        </div>

        {/* Comment input */}
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 px-3 py-1 rounded-md border text-sm dark:bg-neutral-800 dark:text-white"
          />
          <button
            onClick={submitComment}
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            Post
          </button>
        </div>

        {/* Boost button */}
        <div className="mt-4">
          {hasBoosted ? (
            <p className="text-sm text-green-500 font-medium">✅ This promo is boosted</p>
          ) : (
            <button
              onClick={handleBoost}
              disabled={isBoosting}
              className="text-sm font-medium text-indigo-600 hover:underline disabled:opacity-50"
            >
              {isBoosting ? 'Boosting...' : '🚀 Boost this post (25 credits)'}
            </button>
          )}
        </div>

        {/* Analytics display */}
        {analytics && (
          <p className="mt-3 text-xs text-gray-400">
            👁️ {analytics.views} views · 🔗 {analytics.clicks} clicks · CTR{' '}
            {analytics.views > 0 ? ((analytics.clicks / analytics.views) * 100).toFixed(1) : 0}%
          </p>
        )}
      </div>
    </div>
  );
};
