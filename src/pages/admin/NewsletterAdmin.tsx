import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { newsletterAPI } from '@/lib/api';

export function NewsletterAdmin() {
  return (
    <AdminCrudPage
      title="Newsletter Subscribers"
      description="View and manage people who have subscribed to the firm's newsletter."
      fetchAll={() => newsletterAPI.getAll()}
      onDelete={(id) => newsletterAPI.delete(id)}
      allowCreate={false}
      allowEdit={false}
      columns={[
        { key: 'fullName', label: 'Name', render: (row) => row.fullName || '—' },
        { key: 'email', label: 'Email' },
        {
          key: 'subscribedAt',
          label: 'Subscribed',
          render: (row) => new Date(row.subscribedAt).toLocaleDateString(),
        },
      ]}
      fields={[]}
    />
  );
}