import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { practiceAreaAPI } from '@/lib/api';

export function PracticeAreasAdmin() {
  // The API returns only top-level areas with nested `children`.
  // Flatten into a single indented list, matching the old PHP admin's display.
  const fetchFlattened = async () => {
    const res = await practiceAreaAPI.getAll();
    const flat: any[] = [];
    res.data.forEach((parent: any) => {
      flat.push({ ...parent, __label: parent.name });
      (parent.children || []).forEach((child: any) => {
        flat.push({ ...child, __label: `↳ ${child.name}`, __parentName: parent.name });
      });
    });
    return { data: flat };
  };

  return (
    <AdminCrudPage
      title="Practice Areas"
      description="Manage the firm's legal service offerings shown on the website."
      fetchAll={fetchFlattened}
      onCreate={(data) => practiceAreaAPI.create(data)}
      onUpdate={(id, data) => practiceAreaAPI.update(id, data)}
      onDelete={(id) => practiceAreaAPI.delete(id)}
      columns={[
        { key: 'name', label: 'Name', render: (row) => row.__label },
        { key: 'parent', label: 'Parent', render: (row) => row.__parentName || '—' },
        { key: 'slug', label: 'Slug' },
        {
          key: 'isActive',
          label: 'Status',
          render: (row) => (row.isActive ? 'Active' : 'Inactive'),
        },
      ]}
      fields={[
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'shortDesc', label: 'Short Description', type: 'textarea' },
        { name: 'body', label: 'Full Body Content', type: 'textarea' },
        { name: 'imageUrl', label: 'Image', type: 'file', accept: 'image/*' },
        { name: 'iconUrl', label: 'Icon', type: 'file', accept: 'image/*' },
        { name: 'sortOrder', label: 'Display Order', type: 'number', defaultValue: 0 },
        { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
      ]}
    />
  );
}