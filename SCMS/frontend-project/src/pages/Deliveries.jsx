import { useState, useEffect } from 'react';
import { PackageCheck, Plus, Pencil, Trash2, X, Search, Hash, Calendar } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STATUSES = ['Pending', 'Partial', 'Complete', 'Failed'];
const EMPTY = { deliveryCode: '', deliveryDate: '', quantityDelivered: '', deliveryStatus: 'Pending', shipment: '' };

const statusColor = {
  'Pending': 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  'Partial': 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400',
  'Complete': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  'Failed': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
};

export default function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = async () => {
    try {
      const [d, s] = await Promise.all([api.get('/deliveries'), api.get('/shipments')]);
      setDeliveries(d.data);
      setShipments(s.data);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit = (d) => {
    setForm({
      deliveryCode: d.deliveryCode,
      deliveryDate: d.deliveryDate?.split('T')[0] || '',
      quantityDelivered: d.quantityDelivered,
      deliveryStatus: d.deliveryStatus,
      shipment: d.shipment?._id || ''
    });
    setEditId(d._id); setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditId(null); setForm(EMPTY); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.deliveryCode || !form.deliveryDate || !form.quantityDelivered || !form.shipment)
      return toast.error('All fields are required');
    setSubmitting(true);
    try {
      if (editId) {
        const { data } = await api.put(`/deliveries/${editId}`, form);
        setDeliveries(prev => prev.map(d => d._id === editId ? data : d));
        toast.success('Delivery updated!');
      } else {
        const { data } = await api.post('/deliveries', form);
        setDeliveries(prev => [data, ...prev]);
        toast.success('Delivery recorded!');
      }
      closeForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/deliveries/${deleteId}`);
      setDeliveries(prev => prev.filter(d => d._id !== deleteId));
      toast.success('Delivery deleted');
    } catch { toast.error('Delete failed'); }
    finally { setDeleteId(null); }
  };

  const filtered = deliveries.filter(d =>
    d.deliveryCode?.toLowerCase().includes(search.toLowerCase()) ||
    d.shipment?.shipmentNumber?.toLowerCase().includes(search.toLowerCase()) ||
    d.shipment?.supplier?.supplierName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalQty = filtered.reduce((sum, d) => sum + (d.quantityDelivered || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2"><PackageCheck className="w-7 h-7 text-emerald-600" />Deliveries</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{deliveries.length} delivery record{deliveries.length !== 1 ? 's' : ''} · Total qty: <span className="font-bold text-emerald-600 dark:text-emerald-400">{totalQty.toLocaleString()}</span></p>
        </div>
        <button onClick={openAdd} className="btn-primary"><Plus className="w-4 h-4" />Record Delivery</button>
      </div>

      <div className="section-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search deliveries..." value={search}
            onChange={e => setSearch(e.target.value)} className="input-field pl-9" />
        </div>
      </div>

      <div className="section-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="table-header">Delivery Code</th>
                <th className="table-header">Date</th>
                <th className="table-header">Shipment #</th>
                <th className="table-header">Supplier</th>
                <th className="table-header">Quantity</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>{[...Array(7)].map((_, j) => (
                    <td key={j} className="table-cell"><div className="h-4 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" /></td>
                  ))}</tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="table-cell text-center py-12 text-slate-400">
                  {search ? 'No results found' : 'No deliveries recorded yet'}
                </td></tr>
              ) : filtered.map(d => (
                <tr key={d._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="table-cell"><span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg">{d.deliveryCode}</span></td>
                  <td className="table-cell"><div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" />{new Date(d.deliveryDate).toLocaleDateString()}</div></td>
                  <td className="table-cell font-mono text-xs text-slate-600 dark:text-slate-300">{d.shipment?.shipmentNumber || '-'}</td>
                  <td className="table-cell text-slate-900 dark:text-white font-medium">{d.shipment?.supplier?.supplierName || '-'}</td>
                  <td className="table-cell"><div className="flex items-center gap-1.5"><Hash className="w-3.5 h-3.5 text-slate-400" /><span className="font-bold text-slate-900 dark:text-white">{d.quantityDelivered?.toLocaleString()}</span></div></td>
                  <td className="table-cell"><span className={`status-badge ${statusColor[d.deliveryStatus] || 'bg-gray-100 text-gray-600'}`}>{d.deliveryStatus}</span></td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(d)} className="btn-edit"><Pencil className="w-3.5 h-3.5" />Edit</button>
                      <button onClick={() => setDeleteId(d._id)} className="btn-danger"><Trash2 className="w-3.5 h-3.5" />Delete</button>
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
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{editId ? 'Edit Delivery' : 'Record New Delivery'}</h2>
              <button onClick={closeForm} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Delivery Code *</label>
                  <input type="text" placeholder="e.g. DEL001" value={form.deliveryCode}
                    onChange={e => setForm({ ...form, deliveryCode: e.target.value })}
                    className="input-field" disabled={!!editId} />
                </div>
                <div>
                  <label className="label">Delivery Date *</label>
                  <input type="date" value={form.deliveryDate}
                    onChange={e => setForm({ ...form, deliveryDate: e.target.value })}
                    className="input-field" />
                </div>
              </div>
              <div>
                <label className="label">Linked Shipment *</label>
                <select value={form.shipment} onChange={e => setForm({ ...form, shipment: e.target.value })} className="input-field">
                  <option value="">Select shipment</option>
                  {shipments.map(s => <option key={s._id} value={s._id}>{s.shipmentNumber} — {s.destination}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Quantity Delivered *</label>
                  <input type="number" min="1" placeholder="0" value={form.quantityDelivered}
                    onChange={e => setForm({ ...form, quantityDelivered: e.target.value })}
                    className="input-field" />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select value={form.deliveryStatus} onChange={e => setForm({ ...form, deliveryStatus: e.target.value })} className="input-field">
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1 justify-center">
                  {submitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editId ? 'Save Changes' : 'Record Delivery'}
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
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Delivery?</h3>
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
