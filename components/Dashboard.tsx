
import React from 'react';
import { Product } from '../types';
import { ICONS } from '../constants';

interface DashboardProps {
  products: Product[];
  onNavigate: (view: 'LIST' | 'FORM' | 'BULK_UPDATE' | 'PRICING') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ products, onNavigate }) => {
  const totalAssets = products.reduce((acc, p) => acc + p.assets.length, 0);
  const totalValue = products.reduce((acc, p) => acc + p.currentPrice, 0);
  const recentProducts = [...products].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 5);

  const usagePercent = Math.min((products.length / 10) * 100, 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Varlık Özeti</h1>
          <p className="text-gray-500">Ürün portföyünüze gerçek zamanlı bakış</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white px-6 py-2.5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center min-w-[200px]">
             <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Plan Kullanımı</span>
                <span className="text-[10px] font-black text-indigo-600 uppercase">{products.length}/10 Ürün</span>
             </div>
             <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${usagePercent > 90 ? 'bg-red-500' : 'bg-indigo-600'}`} 
                  style={{ width: `${usagePercent}%` }}
                />
             </div>
          </div>
          <button 
            onClick={() => products.length >= 10 ? onNavigate('PRICING') : onNavigate('FORM')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-200"
          >
            <ICONS.Plus />
            Yeni Ürün
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Toplam Ürün', value: products.length, icon: <ICONS.Package />, color: 'bg-blue-50 text-blue-600' },
          { label: 'Aktif Varlıklar', value: totalAssets, icon: <ICONS.Info />, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Portföy Değeri', value: `$${totalValue.toLocaleString()}`, icon: <ICONS.Settings />, color: 'bg-purple-50 text-purple-600' },
          { label: 'Ortalama Fiyat', value: `$${(totalValue / (products.length || 1)).toFixed(2)}`, icon: <ICONS.Dashboard />, color: 'bg-orange-50 text-orange-600' },
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
            <h2 className="font-bold text-gray-900">Son Envanter Kayıtları</h2>
            <button 
              onClick={() => onNavigate('LIST')}
              className="text-sm text-indigo-600 font-medium hover:underline"
            >
              Hepsini gör
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
                  <p className="text-xs text-gray-400">{p.assets.length} döküman</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-900 rounded-2xl p-8 text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4">Üyelik Planı</h2>
            <p className="text-indigo-200 mb-6">Şu an ücretsiz sürümdesiniz. Ürün limitinizi artırmak ve premium özelliklere erişmek için planınızı yükseltin.</p>
            <button 
              onClick={() => onNavigate('PRICING')}
              className="bg-white text-indigo-900 px-6 py-2 rounded-xl font-bold hover:bg-indigo-50 transition-colors"
            >
              Planları İncele
            </button>
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
