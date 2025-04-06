'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const PostUpload = () => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [scheduleFor, setScheduleFor] = useState('');

  const router = useRouter();

  const handleUpload = async () => {
    if (!content || !media) return alert('Add content and media.');

    const formData = new FormData();
    formData.append('content', content);
    formData.append('media', media);
    formData.append('draft', isDraft ? 'true' : 'false');
    if (scheduleFor) formData.append('scheduledFor', scheduleFor);

    setIsUploading(true);
    const res = await fetch('/api/post', {
      method: 'POST',
      body: formData,
    });

    setIsUploading(false);

    if (res.ok) {
      router.push('/explore');
    } else {
      alert('Failed to upload post.');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-16 p-6 border rounded-xl shadow-xl dark:border-neutral-700 bg-white dark:bg-neutral-900">
      <h2 className="text-xl font-bold mb-4">Upload a Promo</h2>

      <textarea
        rows={4}
        placeholder="What's your promo? Include #hashtags"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-md dark:bg-neutral-800 dark:text-white"
      />

      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setMedia(e.target.files?.[0] ?? null)}
        className="mb-4"
      />

      <div className="mb-4">
        <label className="text-sm font-medium flex gap-2 items-center">
          <input
            type="checkbox"
            checked={isDraft}
            onChange={(e) => setIsDraft(e.target.checked)}
          />
          Save as draft
        </label>
      </div>

      <div className="mb-4">
        <label className="text-sm block mb-1 font-medium">Schedule for later (optional)</label>
        <input
          type="datetime-local"
          value={scheduleFor}
          onChange={(e) => setScheduleFor(e.target.value)}
          className="w-full px-3 py-2 rounded-md border dark:bg-neutral-800 dark:text-white"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={isUploading}
        className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition"
      >
        {isUploading ? 'Uploading...' : 'Publish Promo'}
      </button>
    </div>
  );
};
