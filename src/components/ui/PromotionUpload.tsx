'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const VERSE_CATEGORIES = [
  'MusicVerse',
  'EventVerse',
  'ArtVerse',
  'TechVerse',
  'FoodVerse',
  'FashionVerse',
  'SportsVerse',
  'EducationVerse',
];

export const PromotionUpload = () => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [scheduleFor, setScheduleFor] = useState('');
  const [category, setCategory] = useState('');
  const [verses, setVerses] = useState<string[]>([]);
  const [newVerse, setNewVerse] = useState('');

  const router = useRouter();

  const addVerse = () => {
    if (!newVerse.trim()) return;
    const verse = newVerse.trim().replace(/^#/, '');
    if (!verses.includes(verse)) {
      setVerses([...verses, verse]);
    }
    setNewVerse('');
  };

  const removeVerse = (verse: string) => {
    setVerses(verses.filter(v => v !== verse));
  };

  const handleUpload = async () => {
    if (!content) return alert('Please add content to your promotion.');
    if (!category) return alert('Please select a verse category.');

    const formData = new FormData();
    formData.append('content', content);
    if (media) formData.append('media', media);
    formData.append('draft', isDraft ? 'true' : 'false');
    formData.append('category', category);
    formData.append('verses', JSON.stringify(verses));
    if (scheduleFor) formData.append('scheduledFor', scheduleFor);

    setIsUploading(true);
    const res = await fetch('/api/promotions', {
      method: 'POST',
      body: formData,
    });

    setIsUploading(false);

    if (res.ok) {
      router.push('/discoververse');
    } else {
      alert('Failed to create promotion.');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-16 p-6 border rounded-xl shadow-xl dark:border-neutral-700 bg-white dark:bg-neutral-900">
      <h2 className="text-xl font-bold mb-4">Create a New Promotion</h2>

      {/* Category Selection */}
      <div className="mb-4">
        <label className="text-sm block mb-1 font-medium">Select Verse Category *</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 rounded-md border dark:bg-neutral-800 dark:text-white"
        >
          <option value="">Select a category</option>
          {VERSE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      <textarea
        rows={4}
        placeholder="What's your promotion about?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-md dark:bg-neutral-800 dark:text-white"
      />

      {/* Verses */}
      <div className="mb-4">
        <label className="text-sm block mb-1 font-medium">Add Verses (like hashtags)</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Add a verse (e.g., music, art)"
            value={newVerse}
            onChange={(e) => setNewVerse(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addVerse()}
            className="flex-1 px-3 py-2 rounded-md border dark:bg-neutral-800 dark:text-white"
          />
          <button
            onClick={addVerse}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {verses.map((verse) => (
            <span
              key={verse}
              className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full text-sm flex items-center gap-2"
            >
              #{verse}
              <button
                onClick={() => removeVerse(verse)}
                className="text-indigo-400 hover:text-indigo-600"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Media Upload */}
      <div className="mb-4">
        <label className="text-sm block mb-1 font-medium">Add Media (optional)</label>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setMedia(e.target.files?.[0] ?? null)}
          className="w-full"
        />
      </div>

      {/* Draft Option */}
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

      {/* Scheduling */}
      <div className="mb-4">
        <label className="text-sm block mb-1 font-medium">Schedule for later (optional)</label>
        <input
          type="datetime-local"
          value={scheduleFor}
          onChange={(e) => setScheduleFor(e.target.value)}
          className="w-full px-3 py-2 rounded-md border dark:bg-neutral-800 dark:text-white"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleUpload}
        disabled={isUploading}
        className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {isUploading ? 'Creating...' : 'Launch Promotion 🚀'}
      </button>
    </div>
  );
}; 