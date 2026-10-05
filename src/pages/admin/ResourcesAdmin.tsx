import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { resourceAPI } from '@/lib/api';

export function ResourcesAdmin() {
  return (
    <AdminCrudPage
      title="Resources"
      description="Manage downloadable documents and resource files."
      fetchAll={() => resourceAPI.getAll()}
      onCreate={(data) => resourceAPI.create(data)}
      onUpdate={(id, data) => resourceAPI.update(id, data)}
      onDelete={(id) => resourceAPI.delete(id)}
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'category', label: 'Category' },
        { key: 'downloadCount', label: 'Downloads' },
        { key: 'isActive', label: 'Status', render: (row) => (row.isActive ? 'Active' : 'Inactive') },
      ]}
      fields={[
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'fileUrl', label: 'File', type: 'file', accept: '.pdf,.doc,.docx,.txt,image/*', required: true },
        { name: 'category', label: 'Category', type: 'text' },
      ]}
    />
  );
}