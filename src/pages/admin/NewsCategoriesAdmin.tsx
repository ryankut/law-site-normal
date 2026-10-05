import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { newsCategoryAPI } from '@/lib/api';

export function NewsCategoriesAdmin() {
  return (
    <AdminCrudPage
      title="News Categories"
      description="Manage the categories articles can be organized under."
      fetchAll={() => newsCategoryAPI.getAll()}
      onCreate={(data) => newsCategoryAPI.create(data)}
      onUpdate={(id, data) => newsCategoryAPI.update(id, data)}
      onDelete={(id) => newsCategoryAPI.delete(id)}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'slug', label: 'Slug' },
      ]}
      fields={[
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'slug', label: 'Slug', type: 'text', required: true },
      ]}
    />
  );
}