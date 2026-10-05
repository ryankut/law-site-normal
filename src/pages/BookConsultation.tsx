import React, { useCallback, useState } from 'react';
import { useContent } from '../hooks/useContent';
import { contentService, postJson } from '../services/contentService';

const BookConsultation: React.FC = () => {
  const fetchMatterTypes = useCallback(() => contentService.getMatterTypes(), []);
  const { data: matterTypes } = useContent(fetchMatterTypes);

  const fetchAttorneys = useCallback(() => contentService.getAttorneys(), []);
  const { data: attorneys } = useContent(fetchAttorneys);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    matterTypeId: '',
    preferredAttorneyId: '',
    notes: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      // NOTE: field names here (firstName/lastName/date/etc.) are inferred,
      // not confirmed against the live appointments.ts route — verify before relying on this.
      await postJson('/api/appointments', {
        ...form,
        type: 'CONSULTATION',
        date: form.date ? new Date(form.date).toISOString() : undefined,
      });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="bg-[#F7F5F0] min-h-screen flex items-center justify-center px-6 text-center">
        <div className="max-w-md">
          <h1 className="text-3xl font-bold text-[#0F1E2E] serif mb-4">Request Received</h1>
          <p className="text-slate-600 font-light">
            Thank you. A member of our team will be in touch shortly to confirm your consultation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F5F0] min-h-screen">
      <section className="relative py-40 w-full overflow-hidden flex flex-col items-center justify-center text-center px-6 bg-[#0F1E2E]">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-[#C6A75E] font-bold tracking-[0.6em] uppercase text-[10px] md:text-xs mb-4 block">
            Book a Consultation
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#F7F5F0] mb-6 serif leading-[1.1]">
            Speak With Our Team.
          </h1>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F1E2E]/60 mb-2">
                  First Name
                </label>
                <input
                  required
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full px-4 py-3 border border-[#0F1E2E]/15 bg-white focus:border-[#C6A75E] outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F1E2E]/60 mb-2">
                  Last Name
                </label>
                <input
                  required
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full px-4 py-3 border border-[#0F1E2E]/15 bg-white focus:border-[#C6A75E] outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F1E2E]/60 mb-2">
                Email
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border border-[#0F1E2E]/15 bg-white focus:border-[#C6A75E] outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F1E2E]/60 mb-2">
                Phone
              </label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 border border-[#0F1E2E]/15 bg-white focus:border-[#C6A75E] outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F1E2E]/60 mb-2">
                Preferred Date
              </label>
              <input
                required
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-3 border border-[#0F1E2E]/15 bg-white focus:border-[#C6A75E] outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F1E2E]/60 mb-2">
                Matter Type
              </label>
              <select
                value={form.matterTypeId}
                onChange={(e) => setForm({ ...form, matterTypeId: e.target.value })}
                className="w-full px-4 py-3 border border-[#0F1E2E]/15 bg-white focus:border-[#C6A75E] outline-none text-sm"
              >
                <option value="">Select a matter type</option>
                {matterTypes?.map((mt) => (
                  <option key={mt.id} value={mt.id}>
                    {mt.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F1E2E]/60 mb-2">
                Preferred Attorney
              </label>
              <select
                value={form.preferredAttorneyId}
                onChange={(e) => setForm({ ...form, preferredAttorneyId: e.target.value })}
                className="w-full px-4 py-3 border border-[#0F1E2E]/15 bg-white focus:border-[#C6A75E] outline-none text-sm"
              >
                <option value="">No preference</option>
                {attorneys?.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F1E2E]/60 mb-2">
                Notes
              </label>
              <textarea
                rows={4}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-4 py-3 border border-[#0F1E2E]/15 bg-white focus:border-[#C6A75E] outline-none text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full px-8 py-4 bg-[#0F1E2E] text-[#F7F5F0] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#C6A75E] hover:text-[#0F1E2E] transition-colors disabled:opacity-50"
            >
              {status === 'sending' ? 'Submitting...' : 'Request Consultation'}
            </button>

            {status === 'error' && (
              <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};

export { BookConsultation };