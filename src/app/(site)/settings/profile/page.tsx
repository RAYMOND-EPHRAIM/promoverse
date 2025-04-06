'use client';

import { useState, useEffect } from 'react';

interface UserData {
  name?: string;
  username?: string;
  bio?: string;
}

export default function ProfileSettings() {
  const [user, setUser] = useState<UserData | null>(null);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/user/me')
      .then((res) => res.json())
      .then((data: UserData) => {
        setUser(data);
        setName(data.name || '');
        setUsername(data.username || '');
        setBio(data.bio || '');
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('username', username);
    formData.append('bio', bio);
    if (image) formData.append('image', image);

    const res = await fetch('/api/user/me', {
      method: 'POST',
      body: formData,
    });

    setSaving(false);
    if (res.ok) alert('Profile updated!');
    else alert('Failed to save.');
  };

  return (
    <div className="max-w-xl mx-auto mt-16 p-6 border rounded-xl shadow-lg dark:border-neutral-700 bg-white dark:bg-neutral-900">
      <h2 className="text-2xl font-bold mb-6">Edit Your Profile</h2>

      <label className="block text-sm font-medium mb-1">Display Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded-md border dark:bg-neutral-800 dark:text-white"
      />

      <label className="block text-sm font-medium mb-1">Username</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded-md border dark:bg-neutral-800 dark:text-white"
      />

      <label className="block text-sm font-medium mb-1">Bio</label>
      <textarea
        rows={3}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded-md border dark:bg-neutral-800 dark:text-white"
      />

      <label className="block text-sm font-medium mb-1">Profile Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] ?? null)}
        className="mb-6"
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
