import { useEffect, useState } from 'react';
import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { teamMemberAPI, practiceAreaAPI } from '@/lib/api';

export function TeamMembersAdmin() {
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

  // practiceAreaIds isn't a TeamMember column — it's synced separately
  // through the team_practice_areas junction table after the base record saves.
  const syncPracticeAreas = async (memberId: string, newIds: string[], previousIds: string[]) => {
    const toAttach = newIds.filter((id) => !previousIds.includes(id));
    const toDetach = previousIds.filter((id) => !newIds.includes(id));

    await Promise.all([
      ...toAttach.map((id) => teamMemberAPI.attachPracticeArea(memberId, id)),
      ...toDetach.map((id) => teamMemberAPI.detachPracticeArea(memberId, id)),
    ]);
  };

  const handleCreate = async (data: any) => {
    const { practiceAreaIds, ...memberData } = data;
    const res = await teamMemberAPI.create(memberData);
    if (practiceAreaIds?.length) {
      await syncPracticeAreas(res.data.id, practiceAreaIds, []);
    }
    return res;
  };

  const handleUpdate = async (id: string, data: any) => {
    const { practiceAreaIds, ...memberData } = data;
    const res = await teamMemberAPI.update(id, memberData);

    const current = await teamMemberAPI.getById(id);
    const previousIds = (current.data.practiceAreas || []).map((pa: any) => pa.practiceAreaId);
    await syncPracticeAreas(id, practiceAreaIds || [], previousIds);

    return res;
  };

  return (
    <AdminCrudPage
      title="Team Members"
      description="Add or update advocate profiles displayed on the legal team page."
      fetchAll={() => teamMemberAPI.getAll()}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={(id) => teamMemberAPI.delete(id)}
      columns={[
        { key: 'fullName', label: 'Name' },
        { key: 'roleTitle', label: 'Role' },
        { key: 'email', label: 'Email' },
        { key: 'isActive', label: 'Status', render: (row) => (row.isActive ? 'Active' : 'Inactive') },
      ]}
      fields={[
        { name: 'fullName', label: 'Full Name', type: 'text', required: true },
        { name: 'roleTitle', label: 'Role Title', type: 'text', required: true },
        { name: 'bio', label: 'Bio', type: 'textarea' },
        { name: 'email', label: 'Email', type: 'text' },
        { name: 'linkedinUrl', label: 'LinkedIn URL', type: 'text' },
        { name: 'photoUrl', label: 'Photo', type: 'file', accept: 'image/*' },
        {
          name: 'practiceAreaIds',
          label: 'Practice Areas',
          type: 'multiselect',
          options: practiceAreaOptions,
          fromRow: (row) => (row.practiceAreas || []).map((pa: any) => pa.practiceAreaId),
        },
        { name: 'sortOrder', label: 'Display Order', type: 'number', defaultValue: 0 },
        { name: 'isActive', label: 'Active', type: 'checkbox', defaultValue: true },
      ]}
    />
  );
}