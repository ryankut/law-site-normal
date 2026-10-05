import React, { useState } from 'react';
import { postJson } from '../services/contentService';

export const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await postJson('/api/newsletter', { email });
      setStatus('sent');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return <p className="text-[#C6A75E] text-sm">Thank you for subscribing.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        required
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-[#F7F5F0] placeholder:text-[#F7F5F0]/40 text-sm outline-none focus:border-[#C6A75E]"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="px-6 py-3 bg-[#C6A75E] text-[#0F1E2E] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#F7F5F0] transition-colors disabled:opacity-50"
      >
        {status === 'sending' ? '...' : 'Subscribe'}
      </button>
      {status === 'error' && <p className="text-red-400 text-xs mt-2">Something went wrong.</p>}
    </form>
  );
};