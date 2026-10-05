import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, Newspaper, FileBox, Users, HelpCircle, Image, Mail,
  MessageSquare, CheckCircle2, XCircle, ArrowRight,
} from 'lucide-react';
import {
  practiceAreaAPI, newsArticleAPI, resourceAPI, teamMemberAPI,
  faqAPI, clientLogoAPI, newsletterAPI, contactSubmissionAPI, adminAPI,
} from '@/lib/api';

interface Counts {
  practiceAreas: number;
  articles: number;
  resources: number;
  teamMembers: number;
  faqs: number;
  clientLogos: number;
  subscribers: number;
  messages: number;
  unreadMessages: number;
}

const EMPTY_COUNTS: Counts = {
  practiceAreas: 0, articles: 0, resources: 0, teamMembers: 0,
  faqs: 0, clientLogos: 0, subscribers: 0, messages: 0, unreadMessages: 0,
};

export function AdminDashboard() {
  const [counts, setCounts] = useState<Counts>(EMPTY_COUNTS);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [
          practiceAreasRes, articlesRes, resourcesRes, teamMembersRes,
          faqsRes, clientLogosRes, subscribersRes, messagesRes, dashboardRes,
        ] = await Promise.all([
          practiceAreaAPI.getAll(),
          newsArticleAPI.getAllAdmin(),
          resourceAPI.getAll(),
          teamMemberAPI.getAll(),
          faqAPI.getAll(),
          clientLogoAPI.getAll(),
          newsletterAPI.getAll(),
          contactSubmissionAPI.getAll(),
          adminAPI.getDashboard(),
        ]);

        // practiceAreaAPI.getAll() returns only top-level areas with nested children
        const practiceAreaCount = practiceAreasRes.data.reduce(
          (sum: number, p: any) => sum + 1 + (p.children?.length || 0),
          0
        );

        const unread = messagesRes.data.filter((m: any) => !m.isRead).length;

        setCounts({
          practiceAreas: practiceAreaCount,
          articles: articlesRes.data.length,
          resources: resourcesRes.data.length,
          teamMembers: teamMembersRes.data.length,
          faqs: faqsRes.data.length,
          clientLogos: clientLogosRes.data.length,
          subscribers: subscribersRes.data.length,
          messages: messagesRes.data.length,
          unreadMessages: unread,
        });

        setRecentMessages(messagesRes.data.slice(0, 5));
        setRecentAppointments(dashboardRes.data?.recentAppointments || []);
      } catch (err) {
        // Individual sections degrade gracefully to zero counts / empty lists
        // rather than blocking the whole dashboard on one failed call.
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const mgmtRows = [
    {
      label: 'Practice Areas', icon: Briefcase, count: counts.practiceAreas,
      unit: counts.practiceAreas === 1 ? 'Practice Area' : 'Practice Areas',
      to: '/admin/practice-areas', desc: "Manage the firm's legal service offerings.",
    },
    {
      label: 'Articles', icon: Newspaper, count: counts.articles,
      unit: counts.articles === 1 ? 'Article' : 'Articles',
      to: '/admin/news-articles', desc: 'Publish news, updates, and legal insights.',
    },
    {
      label: 'Resources', icon: FileBox, count: counts.resources,
      unit: counts.resources === 1 ? 'Resource' : 'Resources',
      to: '/admin/resources', desc: 'Downloadable documents and resource files.',
    },
    {
      label: 'Team Members', icon: Users, count: counts.teamMembers,
      unit: counts.teamMembers === 1 ? 'Member' : 'Members',
      to: '/admin/team-members', desc: 'Advocate profiles shown on the team page.',
    },
    {
      label: 'FAQs', icon: HelpCircle, count: counts.faqs,
      unit: counts.faqs === 1 ? 'FAQ' : 'FAQs',
      to: '/admin/faqs', desc: 'Frequently asked questions by practice area.',
    },
    {
      label: 'Client Logos', icon: Image, count: counts.clientLogos,
      unit: counts.clientLogos === 1 ? 'Logo' : 'Logos',
      to: '/admin/client-logos', desc: 'Client logos displayed on the website.',
    },
    {
      label: 'Subscribers', icon: Mail, count: counts.subscribers,
      unit: counts.subscribers === 1 ? 'Subscriber' : 'Subscribers',
      to: '/admin/newsletter', desc: 'Newsletter subscriber list.',
    },
  ];

  const statusItems = [
    { label: 'Team Members', ok: counts.teamMembers > 0, detail: `${counts.teamMembers} published` },
    { label: 'Practice Areas', ok: counts.practiceAreas > 0, detail: `${counts.practiceAreas} listed` },
    { label: 'Articles', ok: counts.articles > 0, detail: `${counts.articles} total` },
    { label: 'Resources', ok: counts.resources > 0, detail: `${counts.resources} uploaded` },
    { label: 'Client Logos', ok: counts.clientLogos > 0, detail: `${counts.clientLogos} logos` },
  ];

  if (loading) {
    return <div className="p-8 text-slate-500">Loading dashboard...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back. Manage your firm's content from here.</p>
      </div>

      {/* Management rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {mgmtRows.map((row) => (
          <Link
            key={row.to}
            to={row.to}
            className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
          >
            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <row.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 dark:text-white text-sm">{row.label}</p>
              <p className="text-xs text-slate-500 truncate">{row.desc}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-slate-900 dark:text-white">{row.count}</p>
              <p className="text-xs text-slate-400">{row.unit}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 flex-shrink-0" />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Website status */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Website Status</h2>
          <div className="space-y-3">
            {statusItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                {item.ok ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                )}
                <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                <span className={item.ok ? 'text-slate-400' : 'text-red-500'}>
                  — {item.ok ? item.detail : 'No entries yet'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent messages */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Recent Messages
              {counts.unreadMessages > 0 && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                  {counts.unreadMessages} unread
                </span>
              )}
            </h2>
            <Link to="/admin/contact" className="text-xs text-blue-600 font-medium">
              View all
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="text-sm text-slate-400">No messages yet.</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((m) => (
                <div key={m.id} className="flex items-center justify-between text-sm">
                  <div className="min-w-0">
                    <p
                      className="text-slate-900 dark:text-white truncate"
                      style={{ fontWeight: m.isRead ? 400 : 600 }}
                    >
                      {m.fullName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{m.subject || '—'}</p>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                    {new Date(m.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent appointments */}
      <div className="mt-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Recent Consultation Requests</h2>
        {recentAppointments.length === 0 ? (
          <p className="text-sm text-slate-400">No consultation requests yet.</p>
        ) : (
          <div className="space-y-3">
            {recentAppointments.map((a: any) => (
              <div key={a.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-slate-900 dark:text-white font-medium">
                    {a.client?.firstName} {a.client?.lastName}
                  </p>
                  <p className="text-xs text-slate-500">{a.client?.email}</p>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(a.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}