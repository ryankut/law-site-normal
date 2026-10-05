import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-[#F7F5F0] pt-32 pb-24 min-h-screen" id="main-content">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-16 border-b border-[#0F1E2E]/10 pb-8">
          <span className="text-[#C6A75E] font-bold tracking-[0.5em] uppercase text-xs mb-4 block">Compliance</span>
          <h1 className="text-4xl md:text-6xl font-bold text-[#0F1E2E] serif mb-4">Privacy Policy</h1>
          <p className="text-slate-500 text-sm italic">Last updated: January 2026</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-[#0F1E2E] serif mb-6">1. Commitment to Privacy</h2>
            <p className="text-slate-700 leading-relaxed font-light">
              At Harrington and Co, we treat the privacy of our clients and website visitors with the same rigor we apply to our legal counsel. This Privacy Policy outlines how we collect, use, and safeguard your personal information in accordance with the Nigerian Data Protection Act (NDPA) and international best practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F1E2E] serif mb-6">2. Information Collection</h2>
            <p className="text-slate-700 leading-relaxed font-light mb-4">
              We collect information that is necessary to provide elite legal services, including:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-slate-700 font-light">
              <li>Contact details (name, email, professional phone number).</li>
              <li>Professional identity and institutional affiliation.</li>
              <li>Technical data related to your interaction with our digital platforms (IP addresses, cookies).</li>
              <li>Any information provided during consultation requests or engagement briefs.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F1E2E] serif mb-6">3. Use of Information</h2>
            <p className="text-slate-700 leading-relaxed font-light mb-4">
              Your data is utilized exclusively for:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-slate-700 font-light">
              <li>Managing client relationships and providing strategic advocacy.</li>
              <li>Fulfilling legal and regulatory compliance obligations.</li>
              <li>Sending professional insights, legal briefs, and firm updates (only with explicit consent).</li>
              <li>Improving the performance and security of our digital infrastructure.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F1E2E] serif mb-6">4. Data Protection Standards</h2>
            <p className="text-slate-700 leading-relaxed font-light">
              We employ military-grade encryption and strict physical security protocols at our offices in Harrington House. Access to personal data is restricted to authorized personnel who are bound by absolute confidentiality agreements. We do not sell, trade, or otherwise transfer your data to external parties for commercial purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F1E2E] serif mb-6">5. Your Legal Rights</h2>
            <p className="text-slate-700 leading-relaxed font-light mb-4">
              Under relevant data protection laws, you retain the right to:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-slate-700 font-light">
              <li>Request access to the personal data we hold about you.</li>
              <li>Demand correction of any inaccuracies in your personal records.</li>
              <li>Request the erasure of your data, subject to legal retention requirements.</li>
              <li>Withdraw consent for marketing communications at any time.</li>
            </ul>
          </section>

          <section className="bg-white p-8 border border-[#C6A75E]/20 rounded-sm">
            <h2 className="text-xl font-bold text-[#0F1E2E] serif mb-4 italic">Contact our Privacy Officer</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              For any inquiries regarding this policy or to exercise your rights, please contact our Data Protection Officer directly.
            </p>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C6A75E]">Email</span>
              <a href="mailto:mfredebel@gmail.com" target="_blank" rel="noopener noreferrer" className="text-[#0F1E2E] font-medium hover:text-[#C6A75E] transition-colors">mfredebel@gmail.com</a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;