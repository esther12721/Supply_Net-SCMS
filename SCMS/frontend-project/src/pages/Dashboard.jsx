import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, PackageCheck, BarChart3, TrendingUp, ArrowRight, Activity } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ label, value, icon: Icon, color, to }) => (
  <Link to={to} className={`section-card flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-pointer group`}>
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center flex-shrink-0`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <div className="flex-1">
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold text-slate-900 dark:text-white mt-0.5">{value}</p>
    </div>
    <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
  </Link>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports/summary').then(({ data }) => {
      setSummary(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statusColor = {
    'Pending': 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    'In Transit': 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
    'Delivered': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    'Cancelled': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
    'Complete': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    'Partial': 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400',
    'Failed': 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Welcome back, <span className="font-semibold text-brand-600 dark:text-brand-400">{user?.username}</span> — here's your supply chain overview.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl">
          <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">System Active</span>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="section-card h-24 animate-pulse bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="Total Suppliers" value={summary?.totalSuppliers || 0} icon={Package} color="bg-brand-600" to="/suppliers" />
          <StatCard label="Total Shipments" value={summary?.totalShipments || 0} icon={Truck} color="bg-violet-600" to="/shipments" />
          <StatCard label="Total Deliveries" value={summary?.totalDeliveries || 0} icon={PackageCheck} color="bg-emerald-600" to="/deliveries" />
          <StatCard label="Total Qty Delivered" value={(summary?.totalQuantityDelivered || 0).toLocaleString()} icon={TrendingUp} color="bg-amber-600" to="/reports" />
        </div>
      )}

      {/* Tables row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Shipments */}
        <div className="section-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-500" />
              Recent Shipments
            </h2>
            <Link to="/shipments" className="text-sm text-brand-600 dark:text-brand-400 hover:underline font-semibold">View all</Link>
          </div>
          <div className="space-y-2">
            {summary?.recentShipments?.length ? summary.recentShipments.slice(0, 5).map(s => (
              <div key={s._id} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{s.shipmentNumber}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{s.destination} · {s.supplier?.supplierName}</p>
                </div>
                <span className={`status-badge ${statusColor[s.shipmentStatus] || 'bg-gray-100 text-gray-600'}`}>
                  {s.shipmentStatus}
                </span>
              </div>
            )) : (
              <p className="text-sm text-slate-400 text-center py-6">No shipments yet</p>
            )}
          </div>
        </div>

        {/* Recent Deliveries */}
        <div className="section-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-emerald-500" />
              Recent Deliveries
            </h2>
            <Link to="/deliveries" className="text-sm text-brand-600 dark:text-brand-400 hover:underline font-semibold">View all</Link>
          </div>
          <div className="space-y-2">
            {summary?.recentDeliveries?.length ? summary.recentDeliveries.slice(0, 5).map(d => (
              <div key={d._id} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{d.deliveryCode}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Qty: {d.quantityDelivered} · {new Date(d.deliveryDate).toLocaleDateString()}</p>
                </div>
                <span className={`status-badge ${statusColor[d.deliveryStatus] || 'bg-gray-100 text-gray-600'}`}>
                  {d.deliveryStatus}
                </span>
              </div>
            )) : (
              <p className="text-sm text-slate-400 text-center py-6">No deliveries yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {summary?.shipmentsByStatus?.length > 0 && (
          <div className="section-card">
            <h2 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-violet-500" />
              Shipments by Status
            </h2>
            <div className="space-y-3">
              {summary.shipmentsByStatus.map(s => (
                <div key={s._id} className="flex items-center gap-3">
                  <span className={`status-badge ${statusColor[s._id] || 'bg-gray-100 text-gray-600'} min-w-24 text-center`}>{s._id}</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                    <div
                      className="h-2 rounded-full bg-brand-500"
                      style={{ width: `${Math.min(100, (s.count / summary.totalShipments) * 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 w-8 text-right">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {summary?.deliveriesByStatus?.length > 0 && (
          <div className="section-card">
            <h2 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
              Deliveries by Status
            </h2>
            <div className="space-y-3">
              {summary.deliveriesByStatus.map(s => (
                <div key={s._id} className="flex items-center gap-3">
                  <span className={`status-badge ${statusColor[s._id] || 'bg-gray-100 text-gray-600'} min-w-24 text-center`}>{s._id}</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: `${Math.min(100, (s.count / summary.totalDeliveries) * 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 w-8 text-right">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
