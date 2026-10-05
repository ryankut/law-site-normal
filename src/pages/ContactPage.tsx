import React, { useCallback, useState } from 'react';
import { useContent } from '../hooks/useContent';
import { contentService, postJson } from '../services/contentService';

const ContactPage: React.FC = () => {
  const fetchFaqs = useCallback(() => contentService.getFAQItems(), []);
  const { data: faqs, loading: faqsLoading } = useContent(fetchFaqs);

  const [form, setForm] = useState({ fullName: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await postJson('/api/contact', form);
      setStatus('sent');
      setForm({ fullName: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-[#F7F5F0] min-h-screen">
      <section className="relative py-40 w-full overflow-hidden flex flex-col items-center justify-center text-center px-6 bg-[#0F1E2E]">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-[#C6A75E] font-bold tracking-[0.6em] uppercase text-[10px] md:text-xs mb-4 block">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#F7F5F0] mb-6 serif leading-[1.1]">
            Contact Us.
          </h1>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F1E2E]/60 mb-2">
                Full Name
              </label>
              <input
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-4 py-3 border border-[#0F1E2E]/15 bg-white focus:border-[#C6A75E] outline-none text-sm"
              />
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
                Subject
              </label>
              <input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-4 py-3 border border-[#0F1E2E]/15 bg-white focus:border-[#C6A75E] outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#0F1E2E]/60 mb-2">
                Message
              </label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 border border-[#0F1E2E]/15 bg-white focus:border-[#C6A75E] outline-none text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="px-8 py-4 bg-[#0F1E2E] text-[#F7F5F0] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#C6A75E] hover:text-[#0F1E2E] transition-colors disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'sent' && (
              <p className="text-green-600 text-sm">Message sent. We'll be in touch shortly.</p>
            )}
            {status === 'error' && (
              <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>
            )}
          </form>

          <div>
            <h2 className="text-2xl font-bold text-[#0F1E2E] serif mb-8">Frequently Asked Questions</h2>
            {faqsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse h-16 bg-white border border-[#0F1E2E]/10" />
                ))}
              </div>
            ) : !faqs || faqs.length === 0 ? (
              <p className="text-slate-500 text-sm">No FAQs have been added yet.</p>
            ) : (
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <details key={faq.id} className="group bg-white border border-[#0F1E2E]/10 rounded-sm p-6">
                    <summary className="font-bold text-[#0F1E2E] cursor-pointer list-none flex items-center justify-between">
                      {faq.question}
                      <span className="text-[#C6A75E] group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="text-slate-600 text-sm font-light mt-4 leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;