import { useState, useEffect } from 'react';
import { Truck, Plus, Pencil, Trash2, X, Search, MapPin, Calendar } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STATUSES = ['Pending', 'In Transit', 'Delivered', 'Cancelled'];
const EMPTY = { shipmentNumber: '', shipmentDate: '', shipmentStatus: 'Pending', destination: '', supplier: '' };

const statusColor = {
  'Pending': 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  'In Transit': 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  'Delivered': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  'Cancelled': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
};

export default function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = async () => {
    try {
      const [s, sup] = await Promise.all([api.get('/shipments'), api.get('/suppliers')]);
      setShipments(s.data);
      setSuppliers(sup.data);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit = (s) => {
    setForm({
      shipmentNumber: s.shipmentNumber,
      shipmentDate: s.shipmentDate?.split('T')[0] || '',
      shipmentStatus: s.shipmentStatus,
      destination: s.destination,
      supplier: s.supplier?._id || ''
    });
    setEditId(s._id); setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditId(null); setForm(EMPTY); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.shipmentNumber || !form.shipmentDate || !form.destination || !form.supplier)
      return toast.error('All fields are required');
    setSubmitting(true);
    try {
      if (editId) {
        const { data } = await api.put(`/shipments/${editId}`, form);
        setShipments(prev => prev.map(s => s._id === editId ? data : s));
        toast.success('Shipment updated!');
      } else {
        const { data } = await api.post('/shipments', form);
        setShipments(prev => [data, ...prev]);
        toast.success('Shipment added!');
      }
      closeForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/shipments/${deleteId}`);
      setShipments(prev => prev.filter(s => s._id !== deleteId));
      toast.success('Shipment deleted');
    } catch { toast.error('Delete failed'); }
    finally { setDeleteId(null); }
  };

  const filtered = shipments.filter(s =>
    s.shipmentNumber?.toLowerCase().includes(search.toLowerCase()) ||
    s.destination?.toLowerCase().includes(search.toLowerCase()) ||
    s.supplier?.supplierName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2"><Truck className="w-7 h-7 text-violet-600" />Shipments</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{shipments.length} shipment{shipments.length !== 1 ? 's' : ''} tracked</p>
        </div>
        <button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" />Add Shipment</button>
      </div>

      <div className="section-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search shipments..." value={search}
            onChange={e => setSearch(e.target.value)} className="input-field pl-9" />
        </div>
      </div>

      <div className="section-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="table-header">Shipment #</th>
                <th className="table-header">Date</th>
                <th className="table-header">Supplier</th>
                <th className="table-header">Destination</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>{[...Array(6)].map((_, j) => (
                    <td key={j} className="table-cell"><div className="h-4 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="table-cell text-center py-12 text-slate-400">
                  {search ? 'No results found' : 'No shipments yet'}
                </td></tr>
              ) : filtered.map(s => (
                <tr key={s._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="table-cell"><span className="font-mono text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 px-2 py-1 rounded-lg">{s.shipmentNumber}</span></td>
                  <td className="table-cell"><div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" />{new Date(s.shipmentDate).toLocaleDateString()}</div></td>
                  <td className="table-cell font-semibold text-slate-900 dark:text-white">{s.supplier?.supplierName || '-'}</td>
                  <td className="table-cell"><div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" />{s.destination}</div></td>
                  <td className="table-cell"><span className={`status-badge ${statusColor[s.shipmentStatus] || 'bg-gray-100 text-gray-600'}`}>{s.shipmentStatus}</span></td>
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
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{editId ? 'Edit Shipment' : 'Add New Shipment'}</h2>
              <button onClick={closeForm} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Shipment Number *</label>
                  <input type="text" placeholder="e.g. SHP001" value={form.shipmentNumber}
                    onChange={e => setForm({ ...form, shipmentNumber: e.target.value })}
                    className="input-field" disabled={!!editId} />
                </div>
                <div>
                  <label className="label">Shipment Date *</label>
                  <input type="date" value={form.shipmentDate}
                    onChange={e => setForm({ ...form, shipmentDate: e.target.value })}
                    className="input-field" />
                </div>
              </div>
              <div>
                <label className="label">Supplier *</label>
                <select value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} className="input-field">
                  <option value="">Select supplier</option>
                  {suppliers.map(s => <option key={s._id} value={s._id}>{s.supplierName} ({s.supplierCode})</option>)}
                </select>
              </div>
              <div>
                <label className="label">Destination *</label>
                <input type="text" placeholder="Delivery destination" value={form.destination}
                  onChange={e => setForm({ ...form, destination: e.target.value })}
                  className="input-field" />
              </div>
              <div>
                <label className="label">Status</label>
                <select value={form.shipmentStatus} onChange={e => setForm({ ...form, shipmentStatus: e.target.value })} className="input-field">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1 justify-center">
                  {submitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editId ? 'Save Changes' : 'Add Shipment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-slide-up border border-slate-200 dark:border-slate-700 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Shipment?</h3>
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
