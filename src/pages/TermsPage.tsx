import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="bg-[#F7F5F0] pt-32 pb-24 min-h-screen" id="main-content">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-16 border-b border-[#0F1E2E]/10 pb-8">
          <span className="text-[#C6A75E] font-bold tracking-[0.5em] uppercase text-xs mb-4 block">Legal</span>
          <h1 className="text-4xl md:text-6xl font-bold text-[#0F1E2E] serif mb-4">Terms and Conditions</h1>
          <p className="text-slate-500 text-sm italic">Standard Professional Engagement Terms • v.2026.1</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-[#0F1E2E] serif mb-6">1. Scope of Engagement</h2>
            <p className="text-slate-700 leading-relaxed font-light">
              The use of this website and the engagement of Harrington and Co ("the Firm") are subject to the following professional terms. By accessing our resources or requesting a consultation, you acknowledge and agree to these conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F1E2E] serif mb-6">2. No Attorney-Client Relationship</h2>
            <p className="text-slate-700 leading-relaxed font-light">
              Transmission of information through this website or by electronic mail does not create an attorney-client relationship. Such a relationship is only established upon the execution of a formal Letter of Engagement signed by a Partner of the Firm.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F1E2E] serif mb-6">3. Legal Content Disclaimer</h2>
            <p className="text-slate-700 leading-relaxed font-light">
              The briefings, articles, and insights provided on this website are for informational purposes only. They do not constitute specific legal advice. Law is dynamic and subject to local jurisdictional nuances; users should consult with qualified counsel regarding their individual circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F1E2E] serif mb-6">4. Professional Fees & Billing</h2>
            <p className="text-slate-700 leading-relaxed font-light">
              Our fee structure is tailored to the complexity of the mandate. Fees are calculated on either an hourly rate, a fixed-fee transactional basis, or a retainer model as detailed in specific engagement letters. All professional fees are exclusive of disbursements and applicable taxes unless otherwise stated.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F1E2E] serif mb-6">5. Intellectual Property</h2>
            <p className="text-slate-700 leading-relaxed font-light">
              The "Harrington and Co" name, logo, and all content provided on this platform are the exclusive intellectual property of the Firm. Unauthorized reproduction, distribution, or use of these assets is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F1E2E] serif mb-6">6. Limitation of Liability</h2>
            <p className="text-slate-700 leading-relaxed font-light">
              The Firm maintains professional indemnity insurance in accordance with regulatory requirements. Any liability arising from the provision of legal services is limited to the extent permitted by law and the terms specified in the individual engagement letter.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0F1E2E] serif mb-6">7. Governing Law</h2>
            <p className="text-slate-700 leading-relaxed font-light">
              These terms and any disputes arising from the use of this website or our services shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, with exclusive jurisdiction granted to the courts in Lagos.
            </p>
          </section>

          <div className="pt-12 border-t border-[#0F1E2E]/5">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest text-center italic">
              "Excellence is not an act, but a habit."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;