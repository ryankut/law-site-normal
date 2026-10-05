import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { contactSubmissionAPI } from '@/lib/api';

export function ContactAdmin() {
  return (
    <AdminCrudPage
      title="Messages"
      description="Review contact form submissions from the website."
      fetchAll={() => contactSubmissionAPI.getAll()}
      allowCreate={false}
      allowEdit={false}
      allowDelete={false}
      columns={[
        {
          key: 'fullName',
          label: 'From',
          render: (row) => (
            <span style={{ fontWeight: row.isRead ? 400 : 600 }}>{row.fullName}</span>
          ),
        },
        { key: 'email', label: 'Email' },
        { key: 'subject', label: 'Subject', render: (row) => row.subject || '—' },
        {
          key: 'message',
          label: 'Message',
          render: (row) => (
            <span title={row.message}>
              {row.message.length > 60 ? row.message.slice(0, 60) + '…' : row.message}
            </span>
          ),
        },
        {
          key: 'submittedAt',
          label: 'Received',
          render: (row) => new Date(row.submittedAt).toLocaleDateString(),
        },
        {
          key: 'isRead',
          label: 'Status',
          render: (row) => (row.isRead ? 'Read' : 'New'),
        },
      ]}
      fields={[]}
      extraRowAction={(row, reload) =>
        !row.isRead ? (
          <button
            onClick={async () => {
              await contactSubmissionAPI.markRead(row.id);
              reload();
            }}
            className="px-2 py-1 text-xs font-medium text-blue-600 border border-blue-200 rounded hover:bg-blue-50"
          >
            Mark Read
          </button>
        ) : null
      }
    />
  );
}