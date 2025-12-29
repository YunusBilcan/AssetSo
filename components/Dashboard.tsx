
import React from 'react';
import { Product } from '../types';
import { ICONS } from '../constants';

interface DashboardProps {
  products: Product[];
  onNavigate: (view: 'LIST' | 'FORM' | 'BULK_UPDATE') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ products, onNavigate }) => {
  const totalAssets = products.reduce((acc, p) => acc + p.assets.length, 0);
  const totalValue = products.reduce((acc, p) => acc + p.currentPrice, 0);
  const recentProducts = [...products].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Asset Overview</h1>
          <p className="text-gray-500">Real-time insight into your product portfolio</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => onNavigate('FORM')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-200"
          >
            <ICONS.Plus />
            New Product
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Products', value: products.length, icon: <ICONS.Package />, color: 'bg-blue-50 text-blue-600' },
          { label: 'Active Assets', value: totalAssets, icon: <ICONS.Info />, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Portfolio Value', value: `$${totalValue.toLocaleString()}`, icon: <ICONS.Settings />, color: 'bg-purple-50 text-purple-600' },
          { label: 'Average Price', value: `$${(totalValue / (products.length || 1)).toFixed(2)}`, icon: <ICONS.Dashboard />, color: 'bg-orange-50 text-orange-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-gray-900">Recent Inventory</h2>
            <button 
              onClick={() => onNavigate('LIST')}
              className="text-sm text-indigo-600 font-medium hover:underline"
            >
              View all
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentProducts.map((p) => (
              <div key={p.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4">
                <img 
                  src={p.assets[0]?.url || `https://picsum.photos/seed/${p.id}/100/100`} 
                  className="w-12 h-12 rounded-lg object-cover bg-gray-100" 
                  alt={p.name}
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{p.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] bg-gray-100 text-black font-bold uppercase px-1.5 py-0.5 rounded tracking-wide">{p.category}</span>
                    <p className="text-xs text-gray-500">SKU: {p.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${p.currentPrice.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">{p.assets.length} assets</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-900 rounded-2xl p-8 text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Bulk Management</h2>
            <p className="text-indigo-200 mb-6">Import thousands of products instantly via CSV or integration hooks. Automate asset mapping with AI.</p>
            <button 
              onClick={() => onNavigate('BULK_UPDATE')}
              className="bg-white text-indigo-900 px-6 py-2 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
            >
              Manage Bulk Changes
            </button>
            <p className="mt-3 text-[10px] text-indigo-300 font-bold">CSV Template available in tool</p>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <ICONS.Package />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
