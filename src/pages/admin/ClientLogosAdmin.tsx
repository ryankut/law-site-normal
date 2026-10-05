import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { clientLogoAPI } from '@/lib/api';

export function ClientLogosAdmin() {
  return (
    <AdminCrudPage
      title="Client Logos"
      description="Manage the client logos displayed on the website."
      fetchAll={() => clientLogoAPI.getAll()}
      onCreate={(data) => clientLogoAPI.create(data)}
      onUpdate={(id, data) => clientLogoAPI.update(id, data)}
      onDelete={(id) => clientLogoAPI.delete(id)}
      columns={[
        { key: 'companyName', label: 'Company' },
        { key: 'websiteUrl', label: 'Website' },
        { key: 'isActive', label: 'Status', render: (row) => (row.isActive ? 'Active' : 'Inactive') },
      ]}
      fields={[
        { name: 'companyName', label: 'Company Name', type: 'text', required: true },
        { name: 'logoUrl', label: 'Logo', type: 'file', accept: 'image/*', required: true },
        { name: 'websiteUrl', label: 'Website URL', type: 'text' },
        { name: 'sortOrder', label: 'Display Order', type: 'number', defaultValue: 0 },
        { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
      ]}
    />
  );
}