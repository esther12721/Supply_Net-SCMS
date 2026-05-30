import { useState, useEffect } from 'react';
import { Package, Plus, Pencil, Trash2, X, Search, Mail, Phone, MapPin } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const EMPTY = { supplierCode: '', supplierName: '', telephone: '', address: '', email: '' };

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchSuppliers = async () => {
    try {
      const { data } = await api.get('/suppliers');
      setSuppliers(data);
    } catch { toast.error('Failed to load suppliers'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit = (s) => { setForm({ supplierCode: s.supplierCode, supplierName: s.supplierName, telephone: s.telephone, address: s.address, email: s.email }); setEditId(s._id); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditId(null); setForm(EMPTY); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { supplierCode, supplierName, telephone, address, email } = form;
    if (!supplierCode || !supplierName || !telephone || !address || !email) return toast.error('All fields are required');
    setSubmitting(true);
    try {
      if (editId) {
        const { data } = await api.put(`/suppliers/${editId}`, form);
        setSuppliers(prev => prev.map(s => s._id === editId ? data : s));
        toast.success('Supplier updated!');
      } else {
        const { data } = await api.post('/suppliers', form);
        setSuppliers(prev => [data, ...prev]);
        toast.success('Supplier added!');
      }
      closeForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/suppliers/${deleteId}`);
      setSuppliers(prev => prev.filter(s => s._id !== deleteId));
      toast.success('Supplier deleted');
    } catch { toast.error('Delete failed'); }
    finally { setDeleteId(null); }
  };

  const filtered = suppliers.filter(s =>
    s.supplierName.toLowerCase().includes(search.toLowerCase()) ||
    s.supplierCode.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2"><Package className="w-7 h-7 text-brand-600" />Suppliers</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{suppliers.length} supplier{suppliers.length !== 1 ? 's' : ''} registered</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="w-4 h-4" />Add Supplier
        </button>
      </div>

      {/* Search */}
      <div className="section-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search suppliers..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9" />
        </div>
      </div>

      {/* Table */}
      <div className="section-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="table-header">Code</th>
                <th className="table-header">Supplier Name</th>
                <th className="table-header">Telephone</th>
                <th className="table-header">Address</th>
                <th className="table-header">Email</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="table-cell"><div className="h-4 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-cell text-center py-12 text-slate-400">
                    {search ? 'No results found' : 'No suppliers yet. Add your first supplier!'}
                  </td>
                </tr>
              ) : filtered.map(s => (
                <tr key={s._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="table-cell"><span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/10 px-2 py-1 rounded-lg">{s.supplierCode}</span></td>
                  <td className="table-cell font-semibold text-slate-900 dark:text-white">{s.supplierName}</td>
                  <td className="table-cell"><div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" />{s.telephone}</div></td>
                  <td className="table-cell"><div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" />{s.address}</div></td>
                  <td className="table-cell"><div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" />{s.email}</div></td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(s)} className="btn-edit"><Pencil className="w-3.5 h-3.5" />Edit</button>
                      <button onClick={() => setDeleteId(s._id)} className="btn-danger"><Trash2 className="w-3.5 h-3.5" />Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg animate-slide-up border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{editId ? 'Edit Supplier' : 'Add New Supplier'}</h2>
              <button onClick={closeForm} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Supplier Code *</label>
                  <input type="text" placeholder="e.g. SUP001" value={form.supplierCode}
                    onChange={e => setForm({ ...form, supplierCode: e.target.value })}
                    className="input-field" disabled={!!editId} />
                </div>
                <div>
                  <label className="label">Supplier Name *</label>
                  <input type="text" placeholder="Company name" value={form.supplierName}
                    onChange={e => setForm({ ...form, supplierName: e.target.value })}
                    className="input-field" />
                </div>
              </div>
              <div>
                <label className="label">Telephone *</label>
                <input type="text" placeholder="+250 7XX XXX XXX" value={form.telephone}
                  onChange={e => setForm({ ...form, telephone: e.target.value })}
                  className="input-field" />
              </div>
              <div>
                <label className="label">Address *</label>
                <input type="text" placeholder="Physical address" value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  className="input-field" />
              </div>
              <div>
                <label className="label">Email *</label>
                <input type="email" placeholder="supplier@email.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input-field" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1 justify-center">
                  {submitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editId ? 'Save Changes' : 'Add Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-slide-up border border-slate-200 dark:border-slate-700 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Supplier?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
