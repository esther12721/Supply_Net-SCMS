import { useState, useEffect } from 'react';
import { BarChart3, Download, Calendar, TrendingUp, Package, Truck, PackageCheck, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import api from '../utils/api';
import toast from 'react-hot-toast';

const PERIODS = [
  { key: 'daily', label: 'Today' },
  { key: 'weekly', label: 'This Week' },
  { key: 'monthly', label: 'This Month' },
  { key: 'all', label: 'All Time' },
];

const COLORS = ['#2896ff', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const statusColor = {
  'Pending': 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  'In Transit': 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  'Delivered': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  'Cancelled': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  'Complete': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  'Partial': 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400',
  'Failed': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
};

export default function Reports() {
  const [period, setPeriod] = useState('all');
  const [reportType, setReportType] = useState('summary');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const endpoint = reportType === 'summary' ? '/reports/summary' : `/reports/${reportType}`;
      const { data: d } = await api.get(`${endpoint}?type=${period}`);
      setData(d);
    } catch { toast.error('Failed to load report'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReport(); }, [period, reportType]);

  const handlePrint = () => window.print();

  const shipmentChartData = data?.shipmentsByStatus?.map(s => ({ name: s._id, value: s.count })) || [];
  const deliveryChartData = data?.deliveriesByStatus?.map(s => ({ name: s._id, value: s.count })) || [];

  return (
    <div className="space-y-6 animate-fade-in print:space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="page-title flex items-center gap-2"><BarChart3 className="w-7 h-7 text-amber-600" />Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Supply chain analytics and performance reports</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchReport} className="btn-secondary"><RefreshCw className="w-4 h-4" />Refresh</button>
          <button onClick={handlePrint} className="btn-primary"><Download className="w-4 h-4" />Print Report</button>
        </div>
      </div>

      {/* Period & Type selector */}
      <div className="section-card print:hidden">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="label flex items-center gap-1.5"><Calendar className="w-4 h-4" />Period</label>
            <div className="flex gap-2 flex-wrap">
              {PERIODS.map(p => (
                <button key={p.key} onClick={() => setPeriod(p.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${period === p.key ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Report Type</label>
            <select value={reportType} onChange={e => setReportType(e.target.value)} className="input-field min-w-40">
              <option value="summary">Summary</option>
              <option value="suppliers">Suppliers</option>
              <option value="shipments">Shipments</option>
              <option value="deliveries">Deliveries</option>
            </select>
          </div>
        </div>
      </div>

      {/* Print header */}
      <div className="hidden print:block text-center mb-6">
        <h1 className="text-2xl font-bold">SupplyNet Ltd — Supply Chain Report</h1>
        <p className="text-gray-500 mt-1">Period: {PERIODS.find(p => p.key === period)?.label} | Generated: {new Date().toLocaleString()}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="section-card h-24 animate-pulse bg-slate-100 dark:bg-slate-800" />)}
        </div>
      ) : data && reportType === 'summary' ? (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: 'Suppliers', value: data.totalSuppliers, icon: Package, color: 'text-brand-600' },
              { label: 'Shipments', value: data.totalShipments, icon: Truck, color: 'text-violet-600' },
              { label: 'Deliveries', value: data.totalDeliveries, icon: PackageCheck, color: 'text-emerald-600' },
              { label: 'Total Quantity', value: (data.totalQuantityDelivered || 0).toLocaleString(), icon: TrendingUp, color: 'text-amber-600' },
            ].map(stat => (
              <div key={stat.label} className="section-card text-center">
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          {(shipmentChartData.length > 0 || deliveryChartData.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {shipmentChartData.length > 0 && (
                <div className="section-card">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-violet-500" />Shipments by Status
                  </h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={shipmentChartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                        {shipmentChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
              {deliveryChartData.length > 0 && (
                <div className="section-card">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <PackageCheck className="w-5 h-5 text-emerald-500" />Deliveries by Status
                  </h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={deliveryChartData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* Recent data tables */}
          <div className="section-card overflow-hidden p-0">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-900 dark:text-white">Recent Shipments</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="table-header">Shipment #</th>
                    <th className="table-header">Date</th>
                    <th className="table-header">Supplier</th>
                    <th className="table-header">Destination</th>
                    <th className="table-header">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {data.recentShipments?.length ? data.recentShipments.map(s => (
                    <tr key={s._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="table-cell font-mono text-xs font-bold text-violet-600 dark:text-violet-400">{s.shipmentNumber}</td>
                      <td className="table-cell">{new Date(s.shipmentDate).toLocaleDateString()}</td>
                      <td className="table-cell">{s.supplier?.supplierName}</td>
                      <td className="table-cell">{s.destination}</td>
                      <td className="table-cell"><span className={`status-badge ${statusColor[s.shipmentStatus]}`}>{s.shipmentStatus}</span></td>
                    </tr>
                  )) : <tr><td colSpan={5} className="table-cell text-center py-6 text-slate-400">No shipments in this period</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : data ? (
        /* Filtered reports */
        <div className="section-card overflow-hidden p-0">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white capitalize">
              {reportType} Report — {PERIODS.find(p => p.key === period)?.label}
            </h3>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {data.count} record{data.count !== 1 ? 's' : ''}
              {data.totalQuantity ? ` · Total qty: ${data.totalQuantity.toLocaleString()}` : ''}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  {reportType === 'suppliers' && <>
                    <th className="table-header">Code</th>
                    <th className="table-header">Name</th>
                    <th className="table-header">Telephone</th>
                    <th className="table-header">Address</th>
                    <th className="table-header">Email</th>
                    <th className="table-header">Added</th>
                  </>}
                  {reportType === 'shipments' && <>
                    <th className="table-header">Shipment #</th>
                    <th className="table-header">Date</th>
                    <th className="table-header">Supplier</th>
                    <th className="table-header">Destination</th>
                    <th className="table-header">Status</th>
                  </>}
                  {reportType === 'deliveries' && <>
                    <th className="table-header">Code</th>
                    <th className="table-header">Date</th>
                    <th className="table-header">Shipment</th>
                    <th className="table-header">Supplier</th>
                    <th className="table-header">Qty</th>
                    <th className="table-header">Status</th>
                  </>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {!data.data?.length ? (
                  <tr><td colSpan={6} className="table-cell text-center py-12 text-slate-400">No data for this period</td></tr>
                ) : data.data.map(item => (
                  <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    {reportType === 'suppliers' && <>
                      <td className="table-cell font-mono text-xs font-bold text-brand-600 dark:text-brand-400">{item.supplierCode}</td>
                      <td className="table-cell font-semibold text-slate-900 dark:text-white">{item.supplierName}</td>
                      <td className="table-cell">{item.telephone}</td>
                      <td className="table-cell">{item.address}</td>
                      <td className="table-cell">{item.email}</td>
                      <td className="table-cell">{new Date(item.createdAt).toLocaleDateString()}</td>
                    </>}
                    {reportType === 'shipments' && <>
                      <td className="table-cell font-mono text-xs font-bold text-violet-600 dark:text-violet-400">{item.shipmentNumber}</td>
                      <td className="table-cell">{new Date(item.shipmentDate).toLocaleDateString()}</td>
                      <td className="table-cell">{item.supplier?.supplierName}</td>
                      <td className="table-cell">{item.destination}</td>
                      <td className="table-cell"><span className={`status-badge ${statusColor[item.shipmentStatus]}`}>{item.shipmentStatus}</span></td>
                    </>}
                    {reportType === 'deliveries' && <>
                      <td className="table-cell font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">{item.deliveryCode}</td>
                      <td className="table-cell">{new Date(item.deliveryDate).toLocaleDateString()}</td>
                      <td className="table-cell font-mono text-xs">{item.shipment?.shipmentNumber}</td>
                      <td className="table-cell">{item.shipment?.supplier?.supplierName}</td>
                      <td className="table-cell font-bold">{item.quantityDelivered?.toLocaleString()}</td>
                      <td className="table-cell"><span className={`status-badge ${statusColor[item.deliveryStatus]}`}>{item.deliveryStatus}</span></td>
                    </>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
