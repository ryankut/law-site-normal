import { useEffect, useState } from 'react';
import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { faqAPI, practiceAreaAPI } from '@/lib/api';

export function FaqsAdmin() {
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
      title="FAQs"
      description="Manage frequently asked questions, optionally tied to a practice area."
      fetchAll={() => faqAPI.getAll()}
      onCreate={(data) => faqAPI.create(data)}
      onUpdate={(id, data) => faqAPI.update(id, data)}
      onDelete={(id) => faqAPI.delete(id)}
      columns={[
        { key: 'question', label: 'Question' },
        {
          key: 'practiceAreaId',
          label: 'Practice Area',
          render: (row) =>
            practiceAreaOptions.find((o) => o.value === row.practiceAreaId)?.label || '—',
        },
        { key: 'isActive', label: 'Status', render: (row) => (row.isActive ? 'Active' : 'Inactive') },
      ]}
      fields={[
        { name: 'question', label: 'Question', type: 'text', required: true },
        { name: 'answer', label: 'Answer', type: 'textarea', required: true },
        { name: 'practiceAreaId', label: 'Practice Area', type: 'select', options: practiceAreaOptions },
        { name: 'sortOrder', label: 'Display Order', type: 'number', defaultValue: 0 },
        { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
      ]}
    />
  );
}