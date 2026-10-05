import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { uploadAPI } from '@/lib/api';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'checkbox'
  | 'select'
  | 'multiselect'
  | 'file';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[]; // for type 'select' and 'multiselect'
  defaultValue?: any;
  fromRow?: (row: any) => any; // custom extractor when the field doesn't map 1:1 to row[name]
  accept?: string; // for type 'file', e.g. 'image/*' or '.pdf,.doc,.docx'
}

export interface ColumnConfig {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface AdminCrudPageProps {
  title: string;
  description?: string;
  columns: ColumnConfig[];
  fields: FieldConfig[];
  fetchAll: () => Promise<any>;
  onCreate?: (data: any) => Promise<any>;
  onUpdate?: (id: string, data: any) => Promise<any>;
  onDelete?: (id: string) => Promise<any>;
  idKey?: string;
  allowCreate?: boolean;
  allowEdit?: boolean;
  allowDelete?: boolean;
  extraRowAction?: (row: any, reload: () => void) => React.ReactNode;
}

export function AdminCrudPage({
  title,
  description,
  columns,
  fields,
  fetchAll,
  onCreate,
  onUpdate,
  onDelete,
  idKey = 'id',
  allowCreate = true,
  allowEdit = true,
  allowDelete = true,
  extraRowAction,
}: AdminCrudPageProps) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAll();
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openAddModal = () => {
    const defaults: Record<string, any> = {};
    fields.forEach((f) => {
      defaults[f.name] =
        f.defaultValue ?? (f.type === 'checkbox' ? false : f.type === 'multiselect' ? [] : '');
    });
    setFormData(defaults);
    setEditingRow(null);
    setModalOpen(true);
  };

  const openEditModal = (row: any) => {
    const values: Record<string, any> = {};
    fields.forEach((f) => {
      if (f.fromRow) {
        values[f.name] = f.fromRow(row);
      } else {
        values[f.name] =
          row[f.name] ?? (f.type === 'checkbox' ? false : f.type === 'multiselect' ? [] : '');
      }
    });
    setFormData(values);
    setEditingRow(row);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRow(null);
  };

  const handleFieldChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (name: string, file: File) => {
    setUploading((prev) => ({ ...prev, [name]: true }));
    try {
      const res = await uploadAPI.uploadFile(file);
      handleFieldChange(name, res.data.url);
    } catch (err) {
      setError('Failed to upload file.');
    } finally {
      setUploading((prev) => ({ ...prev, [name]: false }));
    }
  };

  const isImageUrl = (url: string) => /\.(png|jpe?g|gif|webp|svg)$/i.test(url);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingRow) {
        if (onUpdate) await onUpdate(editingRow[idKey], formData);
      } else {
        if (onCreate) await onCreate(formData);
      }
      closeModal();
      await load();
    } catch (err) {
      setError('Failed to save. Check the required fields.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (onDelete) await onDelete(deleteTarget[idKey]);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError('Failed to delete.');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
          {description && <p className="text-slate-500 text-sm mt-1">{description}</p>}
        </div>
        {allowCreate && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-8 text-slate-500">
                    Loading...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-8 text-slate-500">
                    No records yet.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row[idKey]}
                    className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="py-3 px-4 text-sm text-slate-900 dark:text-white">
                        {col.render ? col.render(row) : row[col.key] ?? '—'}
                      </td>
                    ))}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {allowEdit && (
                          <button
                            onClick={() => openEditModal(row)}
                            className="p-1.5 text-slate-500 hover:text-blue-600"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                        {allowDelete && (
                          <button
                            onClick={() => setDeleteTarget(row)}
                            className="p-1.5 text-slate-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                        {extraRowAction && extraRowAction(row, load)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="font-bold text-slate-900 dark:text-white">
                {editingRow ? `Edit ${title}` : `Add ${title}`}
              </h2>
              <button onClick={closeModal}>
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.name] ?? ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      rows={5}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm"
                    />
                  ) : field.type === 'checkbox' ? (
                    <input
                      type="checkbox"
                      checked={!!formData[field.name]}
                      onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                      className="rounded border-slate-300"
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={formData[field.name] ?? ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm"
                    >
                      <option value="">— Select —</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'multiselect' ? (
                    <div className="border border-slate-300 dark:border-slate-700 rounded-lg p-2 max-h-40 overflow-y-auto space-y-1">
                      {field.options?.map((opt) => {
                        const selected: string[] = formData[field.name] ?? [];
                        const checked = selected.includes(opt.value);
                        return (
                          <label
                            key={opt.value}
                            className="flex items-center gap-2 text-sm px-1 py-0.5"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                const next = e.target.checked
                                  ? [...selected, opt.value]
                                  : selected.filter((v) => v !== opt.value);
                                handleFieldChange(field.name, next);
                              }}
                              className="rounded border-slate-300"
                            />
                            {opt.label}
                          </label>
                        );
                      })}
                      {(!field.options || field.options.length === 0) && (
                        <p className="text-sm text-slate-400 px-1">No options available.</p>
                      )}
                    </div>
                  ) : field.type === 'file' ? (
                    <div>
                      {formData[field.name] &&
                        (isImageUrl(formData[field.name]) ? (
                          <img
                            src={formData[field.name]}
                            alt=""
                            className="w-24 h-24 object-cover rounded-lg border border-slate-200 dark:border-slate-700 mb-2"
                          />
                        ) : (
                          <a
                            href={formData[field.name]}
                            target="_blank"
                            rel="noreferrer"
                            className="block text-sm text-blue-600 mb-2"
                          >
                            View current file
                          </a>
                        ))}
                      <input
                        type="file"
                        accept={field.accept}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(field.name, file);
                        }}
                        className="text-sm"
                      />
                      {uploading[field.name] && (
                        <p className="text-xs text-slate-400 mt-1">Uploading...</p>
                      )}
                    </div>
                  ) : (
                    <input
                      type={field.type === 'number' ? 'number' : 'text'}
                      value={formData[field.name] ?? ''}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-sm w-full p-6">
            <h2 className="font-bold text-slate-900 dark:text-white mb-2">Confirm Delete</h2>
            <p className="text-sm text-slate-500 mb-6">
              Are you sure you want to delete this? This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}