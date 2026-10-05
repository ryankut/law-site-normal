import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean up existing data
  await prisma.refreshToken.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.intakeSubmission.deleteMany();
  await prisma.intakeForm.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.caseNote.deleteMany();
  await prisma.document.deleteMany();
  await prisma.case.deleteMany();
  await prisma.message.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.clientProfile.deleteMany();
  await prisma.adminProfile.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.practiceArea.deleteMany();
  await prisma.user.deleteMany();
  await prisma.siteSettings.deleteMany();

  console.log('Database cleaned');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@justiceco.com',
      password: adminPassword,
      firstName: 'Jonathan',
      lastName: 'Mitchell',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
      adminProfile: {
        create: {
          title: 'Managing Partner',
          bio: 'With over 25 years of experience, Jonathan Mitchell has established himself as one of the most respected attorneys in New York.',
          education: ['J.D., Harvard Law School', 'B.A., Yale University', 'LL.M., NYU School of Law'],
          barAdmissions: ['New York State Bar', 'U.S. District Court, Southern District', 'U.S. Court of Appeals, Second Circuit'],
          certifications: ['Certified Family Law Specialist', 'Certified Criminal Law Specialist'],
          awards: ['Super Lawyers 2015-2024', 'Best Lawyers in America', 'AV Preeminent Rating'],
          yearsExperience: 25,
          specialties: ['Personal Injury', 'Criminal Defense', 'Family Law'],
        },
      },
    },
  });
  console.log('Admin created:', admin.email);

  // Create test client
  const clientPassword = await bcrypt.hash('client123', 12);
  const client = await prisma.user.create({
    data: {
      email: 'client@example.com',
      password: clientPassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'CLIENT',
      phone: '(555) 123-4567',
      clientProfile: {
        create: {
          address: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          referralSource: 'Google Search',
          caseType: 'Personal Injury',
        },
      },
    },
  });
  console.log('Test client created:', client.email);

  // Create practice areas
  const practiceAreas = await prisma.practiceArea.createMany({
    data: [
      {
        slug: 'personal-injury',
        title: 'Personal Injury',
        description: 'Get the compensation you deserve for accidents and injuries caused by negligence.',
        content: `
          <h2>Personal Injury Law</h2>
          <p>If you have been injured due to someone else's negligence, you may be entitled to compensation. Our experienced personal injury attorneys have recovered millions for injured clients.</p>
          <h3>Types of Cases We Handle</h3>
          <ul>
            <li>Car accidents</li>
            <li>Truck accidents</li>
            <li>Motorcycle accidents</li>
            <li>Pedestrian accidents</li>
            <li>Slip and fall incidents</li>
            <li>Medical malpractice</li>
            <li>Product liability</li>
            <li>Workplace injuries</li>
          </ul>
          <h3>Why Choose Us</h3>
          <p>We work on a contingency fee basis, meaning you pay nothing unless we win your case. Our team will handle all aspects of your claim, allowing you to focus on recovery.</p>
        `,
        icon: 'Scale',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
        faqs: JSON.stringify([
          { question: 'How much is my case worth?', answer: 'Case value depends on many factors including medical expenses, lost wages, pain and suffering, and future damages.' },
          { question: 'How long will my case take?', answer: 'Most personal injury cases settle within 6-18 months, but complex cases may take longer.' },
          { question: 'What if I was partially at fault?', answer: 'New York follows comparative negligence laws, meaning you can still recover damages even if partially at fault.' },
        ]),
        metaTitle: 'Personal Injury Lawyer NYC | Justice & Co.',
        metaDesc: 'Experienced personal injury attorneys in NYC. Free consultation. No fees unless we win. Call today!',
        sortOrder: 1,
      },
      {
        slug: 'family-law',
        title: 'Family Law',
        description: 'Compassionate legal guidance for divorce, custody, and all family matters.',
        content: `
          <h2>Family Law Services</h2>
          <p>Family legal matters require both expertise and compassion. Our family law attorneys understand the emotional challenges you're facing and provide supportive, strategic representation.</p>
          <h3>Our Family Law Services</h3>
          <ul>
            <li>Divorce and legal separation</li>
            <li>Child custody and visitation</li>
            <li>Child support</li>
            <li>Spousal support/alimony</li>
            <li>Property division</li>
            <li>Prenuptial agreements</li>
            <li>Adoption</li>
            <li>Domestic violence protection</li>
          </ul>
        `,
        icon: 'Heart',
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop',
        faqs: JSON.stringify([
          { question: 'How long does a divorce take?', answer: 'Uncontested divorces can be finalized in 3-6 months. Contested divorces may take 1-2 years or longer.' },
          { question: 'How is child custody determined?', answer: 'Courts consider the best interests of the child, including parental fitness, stability, and the child\'s existing relationships.' },
        ]),
        metaTitle: 'Family Law Attorney NYC | Divorce & Custody | Justice & Co.',
        metaDesc: 'Compassionate family law attorneys handling divorce, custody, and support matters. Schedule a consultation today.',
        sortOrder: 2,
      },
      {
        slug: 'criminal-defense',
        title: 'Criminal Defense',
        description: 'Aggressive defense to protect your rights, reputation, and freedom.',
        content: `
          <h2>Criminal Defense</h2>
          <p>Being charged with a crime is one of the most stressful experiences a person can face. Our criminal defense attorneys provide aggressive representation to protect your rights and freedom.</p>
          <h3>Cases We Defend</h3>
          <ul>
            <li>DUI/DWI</li>
            <li>Drug crimes</li>
            <li>Assault and battery</li>
            <li>Theft crimes</li>
            <li>White collar crimes</li>
            <li>Federal crimes</li>
            <li>Probation violations</li>
            <li>Expungements</li>
          </ul>
        `,
        icon: 'Shield',
        image: 'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?w=800&h=600&fit=crop',
        faqs: JSON.stringify([
          { question: 'Should I talk to the police without a lawyer?', answer: 'No. Exercise your right to remain silent and request an attorney immediately.' },
          { question: 'What are my rights if arrested?', answer: 'You have the right to remain silent, the right to an attorney, and protection from unreasonable searches.' },
        ]),
        metaTitle: 'Criminal Defense Attorney NYC | Justice & Co.',
        metaDesc: 'Aggressive criminal defense lawyers in NYC. 24/7 availability. Free consultation. Protect your rights!',
        sortOrder: 3,
      },
      {
        slug: 'business-law',
        title: 'Business Law',
        description: 'Strategic legal solutions for businesses of all sizes.',
        content: `
          <h2>Business Law Services</h2>
          <p>From startups to established corporations, we provide comprehensive legal services to help your business thrive while minimizing risk.</p>
          <h3>Our Business Services</h3>
          <ul>
            <li>Business formation</li>
            <li>Contract drafting and review</li>
            <li>Mergers and acquisitions</li>
            <li>Employment law</li>
            <li>Intellectual property</li>
            <li>Commercial litigation</li>
            <li>Regulatory compliance</li>
          </ul>
        `,
        icon: 'Building2',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
        faqs: JSON.stringify([
          { question: 'What business structure should I choose?', answer: 'The best structure depends on liability protection, tax considerations, and management preferences. We can help you decide.' },
          { question: 'Do I need a lawyer to start a business?', answer: 'While not required, legal guidance helps ensure proper formation, contracts, and compliance from the start.' },
        ]),
        metaTitle: 'Business Attorney NYC | Corporate Law | Justice & Co.',
        metaDesc: 'Experienced business lawyers serving NYC. Formation, contracts, litigation. Schedule a consultation.',
        sortOrder: 4,
      },
    ],
  });
  console.log('Practice areas created:', practiceAreas.count);

  // Create testimonials
  const testimonials = await prisma.testimonial.createMany({
    data: [
      {
        name: 'Sarah Johnson',
        role: 'Personal Injury Client',
        content: 'The team at Justice & Co. was incredible. They fought for me every step of the way and secured a settlement that changed my life. I cannot recommend them enough.',
        rating: 5,
        isFeatured: true,
        caseType: 'Personal Injury',
      },
      {
        name: 'Michael Chen',
        role: 'Business Client',
        content: 'Professional, responsive, and incredibly knowledgeable. They handled our complex business litigation with expertise and achieved a favorable outcome.',
        rating: 5,
        isFeatured: true,
        caseType: 'Business Law',
      },
      {
        name: 'Emily Rodriguez',
        role: 'Family Law Client',
        content: 'During the most difficult time of my life, they provided compassionate support and excellent legal representation. My children and I are forever grateful.',
        rating: 5,
        isFeatured: true,
        caseType: 'Family Law',
      },
      {
        name: 'David Thompson',
        role: 'Criminal Defense Client',
        content: 'Jonathan Mitchell saved my future. His aggressive defense strategy and attention to detail resulted in all charges being dismissed.',
        rating: 5,
        isFeatured: true,
        caseType: 'Criminal Defense',
      },
    ],
  });
  console.log('Testimonials created:', testimonials.count);

  // Create blog posts
  const blogPosts = await prisma.blogPost.createMany({
    data: [
      {
        slug: 'what-to-do-after-car-accident',
        title: 'What to Do After a Car Accident: A Complete Guide',
        excerpt: 'Learn the essential steps to take immediately following a car accident to protect your rights and maximize your potential compensation.',
        content: `
          <p>Being involved in a car accident can be a traumatic and disorienting experience. Knowing what to do in the immediate aftermath can significantly impact your ability to recover damages and protect your legal rights.</p>
          <h2>Immediate Steps After an Accident</h2>
          <ol>
            <li><strong>Ensure Safety:</strong> First, check yourself and others for injuries. If anyone is hurt, call 911 immediately.</li>
            <li><strong>Move to Safety:</strong> If possible, move vehicles to the side of the road to prevent further accidents.</li>
            <li><strong>Call the Police:</strong> Even for minor accidents, a police report is crucial for insurance claims and legal proceedings.</li>
            <li><strong>Exchange Information:</strong> Get the other driver's name, contact information, insurance details, and license plate number.</li>
          </ol>
          <h2>Document Everything</h2>
          <p>Take photos of vehicle damage, the accident scene, road conditions, and any visible injuries. If there are witnesses, get their contact information.</p>
          <h2>Seek Medical Attention</h2>
          <p>Some injuries may not be immediately apparent. See a doctor as soon as possible, even if you feel fine. This creates a medical record that links your injuries to the accident.</p>
          <h2>Contact an Attorney</h2>
          <p>Before speaking with insurance companies, consult with a personal injury attorney. Insurance adjusters may try to minimize your claim or get you to admit fault.</p>
        `,
        category: 'Personal Injury',
        tags: ['car accident', 'personal injury', 'legal guide'],
        featuredImage: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&h=600&fit=crop',
        status: 'PUBLISHED',
        authorId: admin.id,
        publishedAt: new Date('2024-01-15'),
        metaTitle: 'What to Do After a Car Accident | Justice & Co.',
        metaDesc: 'Essential steps after a car accident. Protect your rights and maximize compensation. Free consultation.',
      },
      {
        slug: 'understanding-divorce-process',
        title: 'Understanding the Divorce Process in New York',
        excerpt: 'A comprehensive overview of the divorce process, from filing to final judgment, and what you can expect at each stage.',
        content: `
          <p>Divorce is never easy, but understanding the process can help reduce anxiety and ensure you're prepared for what lies ahead. This guide walks through the divorce process in New York State.</p>
          <h2>Types of Divorce in New York</h2>
          <h3>Uncontested Divorce</h3>
          <p>Both parties agree on all major issues including property division, child custody, and support. This is typically faster and less expensive.</p>
          <h3>Contested Divorce</h3>
          <p>When spouses cannot agree on one or more issues, the case must go to court for a judge to decide. These cases take longer and cost more.</p>
          <h2>The Divorce Process</h2>
          <ol>
            <li><strong>Filing the Petition:</strong> One spouse files a Summons with Notice or Summons and Complaint.</li>
            <li><strong>Service of Process:</strong> The other spouse must be formally served with divorce papers.</li>
            <li><strong>Response:</strong> The served spouse has 20 days to respond (30 if served outside NY).</li>
            <li><strong>Discovery:</strong> Exchange of financial information and other relevant documents.</li>
            <li><strong>Negotiation/Settlement:</strong> Attempt to reach agreement on contested issues.</li>
            <li><strong>Trial:</strong> If no settlement is reached, a judge decides the issues at trial.</li>
            <li><strong>Judgment:</strong> The court issues a final divorce judgment.</li>
          </ol>
        `,
        category: 'Family Law',
        tags: ['divorce', 'family law', 'New York'],
        featuredImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=600&fit=crop',
        status: 'PUBLISHED',
        authorId: admin.id,
        publishedAt: new Date('2024-01-10'),
        metaTitle: 'Divorce Process in New York | Justice & Co.',
        metaDesc: 'Complete guide to divorce in NY. Understand the process from filing to final judgment. Free consultation.',
      },
    ],
  });
  console.log('Blog posts created:', blogPosts.count);

  // Create intake form
  const intakeForm = await prisma.intakeForm.create({
    data: {
      name: 'Initial Consultation Intake',
      description: 'Standard intake form for initial consultations',
      fields: JSON.stringify([
        { name: 'incident_date', label: 'Date of Incident', type: 'date', required: true },
        { name: 'incident_location', label: 'Location of Incident', type: 'text', required: true },
        { name: 'description', label: 'Describe what happened', type: 'textarea', required: true },
        { name: 'injuries', label: 'Injuries sustained', type: 'textarea', required: false },
        { name: 'medical_treatment', label: 'Have you received medical treatment?', type: 'select', options: ['Yes', 'No'], required: true },
        { name: 'insurance_claim', label: 'Have you filed an insurance claim?', type: 'select', options: ['Yes', 'No'], required: true },
        { name: 'other_party', label: 'Other party information', type: 'textarea', required: false },
        { name: 'police_report', label: 'Was a police report filed?', type: 'select', options: ['Yes', 'No', 'Unsure'], required: true },
      ]),
      isActive: true,
    },
  });
  console.log('Intake form created:', intakeForm.name);

  // Create sample case
  const case1 = await prisma.case.create({
    data: {
      caseNumber: 'CASE-2024-001',
      title: 'Motor Vehicle Accident - Smith v. Johnson',
      description: 'Client injured in rear-end collision at intersection. Neck and back injuries requiring physical therapy.',
      practiceArea: 'Personal Injury',
      status: 'ACTIVE',
      value: 75000,
      clientId: client.id,
    },
  });
  console.log('Sample case created:', case1.caseNumber);

  // Create site settings
  await prisma.siteSettings.createMany({
    data: [
      { key: 'site_name', value: { value: 'Justice & Co.' } },
      { key: 'site_tagline', value: { value: 'Attorneys at Law' } },
      { key: 'contact_phone', value: { value: '(123) 456-7890' } },
      { key: 'contact_email', value: { value: 'contact@justiceco.com' } },
      { key: 'office_address', value: { value: '123 Legal Avenue, Suite 500, New York, NY 10001' } },
      { key: 'consultation_fee', value: { value: 0 } },
      { key: 'business_hours', value: { value: 'Mon-Fri: 9:00 AM - 6:00 PM' } },
      { key: 'enable_chat', value: { value: true } },
      { key: 'maintenance_mode', value: { value: false } },
    ],
  });
  console.log('Site settings created');

  console.log('\n✅ Seed completed successfully!');
  console.log('\nTest Accounts:');
  console.log('  Admin: admin@justiceco.com / admin123');
  console.log('  Client: client@example.com / client123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
