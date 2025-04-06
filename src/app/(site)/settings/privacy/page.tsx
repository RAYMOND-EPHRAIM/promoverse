'use client';

import { useEffect, useState } from 'react';

export default function PrivacySettings() {
  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    allowDMs: true,
    allowTagging: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/user/privacy')
      .then((res) => res.json())
      .then(setPrivacy);
  }, []);

  const updatePrivacy = async (key: string, value: boolean) => {
    setLoading(true);
    const res = await fetch('/api/user/privacy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [key]: value }),
    });
    setLoading(false);
    if (res.ok) {
      setPrivacy((prev) => ({ ...prev, [key]: value }));
    } else {
      alert('Update failed.');
    }
  };

  const Toggle = ({
    label,
    field,
  }: {
    label: string;
    field: keyof typeof privacy;
  }) => (
    <div className="flex justify-between items-center py-3 border-b border-neutral-800">
      <span className="text-sm">{label}</span>
      <input
        type="checkbox"
        checked={privacy[field]}
        onChange={(e) => updatePrivacy(field, e.target.checked)}
        className="scale-125"
      />
    </div>
  );

  return (
    <div className="max-w-xl mx-auto mt-16 p-6 border rounded-xl shadow-xl dark:border-neutral-700 bg-white dark:bg-neutral-900">
      <h2 className="text-2xl font-bold mb-4">🔐 Privacy Settings</h2>
      <Toggle field="publicProfile" label="Make my profile visible in search" />
      <Toggle field="allowDMs" label="Allow direct messages from others" />
      <Toggle field="allowTagging" label="Allow others to tag me in promos" />
      {loading && <p className="text-xs text-gray-400 mt-4">Saving...</p>}
    </div>
  );
}
