import { useEffect, useState } from 'react';
import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { newsArticleAPI, newsCategoryAPI, teamMemberAPI } from '@/lib/api';

const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'ARCHIVED', label: 'Archived' },
];

export function NewsArticlesAdmin() {
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);
  const [authorOptions, setAuthorOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    newsCategoryAPI.getAllAdmin().then((res) => {
      setCategoryOptions(res.data.map((c: any) => ({ value: c.id, label: c.name })));
    });
    teamMemberAPI.getAll().then((res) => {
      setAuthorOptions(res.data.map((m: any) => ({ value: m.id, label: m.fullName })));
    });
  }, []);

  return (
    <AdminCrudPage
      title="Articles"
      description="Manage news, updates, and legal insights published to the firm's blog."
      fetchAll={() => newsArticleAPI.getAllAdmin()}
      onCreate={(data) => newsArticleAPI.create(data)}
      onUpdate={(id, data) => newsArticleAPI.update(id, data)}
      onDelete={(id) => newsArticleAPI.delete(id)}
      columns={[
        { key: 'title', label: 'Title' },
        {
          key: 'categoryId',
          label: 'Category',
          render: (row) => categoryOptions.find((o) => o.value === row.categoryId)?.label || '—',
        },
        {
          key: 'authorId',
          label: 'Author',
          render: (row) => authorOptions.find((o) => o.value === row.authorId)?.label || '—',
        },
        { key: 'status', label: 'Status' },
      ]}
      fields={[
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'categoryId', label: 'Category', type: 'select', options: categoryOptions },
        { name: 'authorId', label: 'Author', type: 'select', options: authorOptions },
        { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
        { name: 'body', label: 'Body', type: 'textarea', required: true },
        { name: 'featuredImage', label: 'Featured Image', type: 'file', accept: 'image/*' },
        { name: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS, defaultValue: 'DRAFT' },
        { name: 'publishedAt', label: 'Publish Date (YYYY-MM-DD)', type: 'text' },
      ]}
    />
  );
}