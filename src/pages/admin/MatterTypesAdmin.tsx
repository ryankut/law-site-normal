import { useEffect, useState } from 'react';
import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { matterTypeAPI, practiceAreaAPI } from '@/lib/api';

export function MatterTypesAdmin() {
  const [practiceAreaOptions, setPracticeAreaOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    practiceAreaAPI.getAll().then((res) => {
      const flat: { value: string; label: string }[] = [];
      res.data.forEach((parent: any) => {
        flat.push({ value: parent.id, label: parent.name });
        (parent.children || []).forEach((child: any) => {
          flat.push({ value: child.id, label: `↳ ${child.name}` });
        });
      });
      setPracticeAreaOptions(flat);
    });
  }, []);

  return (
    <AdminCrudPage
      title="Matter Types"
      description="Manage the specific matter types clients can select when booking a consultation."
      fetchAll={() => matterTypeAPI.getAll()}
      onCreate={(data) => matterTypeAPI.create(data)}
      onUpdate={(id, data) => matterTypeAPI.update(id, data)}
      onDelete={(id) => matterTypeAPI.delete(id)}
      columns={[
        { key: 'name', label: 'Name' },
        {
          key: 'practiceAreaId',
          label: 'Practice Area',
          render: (row) =>
            practiceAreaOptions.find((o) => o.value === row.practiceAreaId)?.label || '—',
        },
        { key: 'isActive', label: 'Status', render: (row) => (row.isActive ? 'Active' : 'Inactive') },
      ]}
      fields={[
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'practiceAreaId', label: 'Practice Area', type: 'select', options: practiceAreaOptions },
        { name: 'sortOrder', label: 'Display Order', type: 'number', defaultValue: 0 },
        { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
      ]}
    />
  );
}