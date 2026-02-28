'use client';

import { useState, useEffect } from 'react';
import { updateSettingsAction, getSettings } from '../server-actions/settings';
import { AlertCircle, CheckCircle } from 'lucide-react';
import AdminShell from "../_components/AdminShell";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: '',
    contactEmail: '',
    instagramUrl: '',
    pinterestUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const data = await getSettings();
      setSettings({
        siteName: data['site_name'] || '',
        contactEmail: data['contact_email'] || '',
        instagramUrl: data['instagram_url'] || '',
        pinterestUrl: data['pinterest_url'] || '',
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateSettingsAction(settings);

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      console.error('Error submitting settings:', error);
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminShell>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Site Settings</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Manage global site configuration</p>
          </div>

          {/* Alert Messages */}
          {message && (
            <div
              className={`mb-6 flex items-center gap-3 rounded-lg px-4 py-3 border ${
                message.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
                  : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-200 border-red-200 dark:border-red-800'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Settings Form */}
          <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm p-8 border border-slate-200 dark:border-slate-700 max-w-2xl">
            {/* Site Name */}
            <div>
              <label htmlFor="siteName" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Site Name
              </label>
              <input
                id="siteName"
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                placeholder="GrowHub Tips"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:focus:ring-green-400"
              />
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">The name of your website</p>
            </div>

            {/* Contact Email */}
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Contact Email
              </label>
              <input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                placeholder="contact@example.com"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:focus:ring-green-400"
              />
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Email address for contact inquiries</p>
            </div>

            {/* Instagram URL */}
            <div>
              <label htmlFor="instagramUrl" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Instagram URL
              </label>
              <input
                id="instagramUrl"
                type="url"
                value={settings.instagramUrl}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/your-profile"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:focus:ring-green-400"
              />
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Full URL to your Instagram profile</p>
            </div>

            {/* Pinterest URL */}
            <div>
              <label htmlFor="pinterestUrl" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Pinterest URL
              </label>
              <input
                id="pinterestUrl"
                type="url"
                value={settings.pinterestUrl}
                onChange={(e) => setSettings({ ...settings, pinterestUrl: e.target.value })}
                placeholder="https://pinterest.com/your-profile"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:focus:ring-green-400"
              />
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Full URL to your Pinterest profile</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}
