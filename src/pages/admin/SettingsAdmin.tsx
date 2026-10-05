import { useEffect, useState } from 'react';
import { firmSettingsAPI } from '@/lib/api';

const FIELDS: { name: string; label: string }[] = [
  { name: 'firmName', label: 'Firm Name' },
  { name: 'tagline', label: 'Tagline' },
  { name: 'logoUrl', label: 'Logo URL' },
  { name: 'faviconUrl', label: 'Favicon URL' },
  { name: 'email', label: 'Email' },
  { name: 'phone', label: 'Phone' },
  { name: 'facebookUrl', label: 'Facebook URL' },
  { name: 'twitterUrl', label: 'Twitter/X URL' },
  { name: 'linkedinUrl', label: 'LinkedIn URL' },
  { name: 'instagramUrl', label: 'Instagram URL' },
  { name: 'youtubeUrl', label: 'YouTube URL' },
  { name: 'officeHours', label: 'Office Hours' },
];

export function SettingsAdmin() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    firmSettingsAPI.get().then((res) => {
      setFormData(res.data || {});
      setLoading(false);
    });
  }, []);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await firmSettingsAPI.update(formData);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-500">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Firm Settings</h1>
      <p className="text-slate-500 text-sm mb-6">
        Branding and contact details used across the public site.
      </p>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        {FIELDS.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              {field.label}
            </label>
            <input
              type="text"
              value={formData[field.name] ?? ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm"
            />
          </div>
        ))}

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
          {saved && <span className="text-sm text-green-600">Saved.</span>}
        </div>
      </div>
    </div>
  );
}