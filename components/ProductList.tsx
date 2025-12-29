
import React, { useState } from 'react';
import { Product, AssetType } from '../types';
import { ICONS } from '../constants';

interface ProductListProps {
  products: Product[];
  onView: (p: Product) => void;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ products, onView, onEdit, onDelete, canDelete }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const downloadAllImages = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const images = product.assets.filter(a => a.type === AssetType.IMAGE);
    if (images.length === 0) {
      alert("Bu ürün için indirilecek görsel bulunamadı.");
      return;
    }
    
    images.forEach((img, index) => {
      const link = document.createElement('a');
      link.href = img.url;
      link.download = `${product.sku}_gorsel_${index + 1}`;
      document.body.appendChild(link);
      setTimeout(() => {
        link.click();
        document.body.removeChild(link);
      }, index * 200); // Browser throttle protection
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Envanter Bankası</h2>
          <p className="text-sm text-gray-500">{products.length} adet kayıtlı varlık profili yönetiliyor</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Izgara
            </button>
            <button 
               onClick={() => setViewMode('table')}
               className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'table' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Liste
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <div 
              key={p.id} 
              className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden"
            >
              <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden">
                <img 
                  src={p.assets.find(a => a.type === AssetType.IMAGE)?.url || `https://picsum.photos/seed/${p.id}/400/300`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt={p.name}
                />
                <div className="absolute top-4 left-4">
                   <span className="px-2 py-1 bg-white/90 backdrop-blur rounded text-[9px] font-bold text-black uppercase tracking-widest shadow-sm">{p.category}</span>
                </div>
                
                <div className="absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(p); }} 
                    className="p-2 bg-white/95 text-indigo-600 rounded-xl shadow-lg hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center transform active:scale-90"
                    title="Düzenle"
                  >
                    <ICONS.Edit />
                  </button>
                  <button 
                    onClick={(e) => downloadAllImages(e, p)} 
                    className="p-2 bg-white/95 text-emerald-600 rounded-xl shadow-lg hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center transform active:scale-90"
                    title="Görselleri İndir"
                  >
                    <ICONS.Download />
                  </button>
                  {canDelete && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(p.id); }} 
                      className="p-2 bg-white/95 text-red-500 rounded-xl shadow-lg hover:bg-red-600 hover:text-white transition-all flex items-center justify-center transform active:scale-90"
                      title="Sil"
                    >
                      <ICONS.Trash />
                    </button>
                  )}
                </div>

                <div className="absolute bottom-4 right-4">
                   <div className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest shadow-sm ${p.stock < 10 ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                      Stok: {p.stock}
                   </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1 truncate">{p.name}</h3>
                <div className="flex justify-between items-center mb-4">
                   <p className="text-[10px] text-gray-400 font-bold font-mono tracking-widest">{p.sku}</p>
                   <p className="text-[10px] text-gray-400 font-bold font-mono tracking-widest">{p.barcode}</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                   <span className="text-xl font-bold text-gray-900">${p.currentPrice.toLocaleString()}</span>
                   <button 
                    onClick={() => onView(p)}
                    className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:gap-2 transition-all uppercase tracking-widest"
                   >
                     Detaylar <ICONS.ChevronRight />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Varlık / Barkod</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kategori</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stok</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fiyat</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Durum</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors cursor-pointer group" onClick={() => onView(p)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.assets.find(a => a.type === AssetType.IMAGE)?.url || `https://picsum.photos/seed/${p.id}/40/40`} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{p.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono tracking-widest">{p.barcode || p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[9px] font-bold text-black bg-gray-100 px-2 py-1 rounded uppercase tracking-widest">{p.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold ${p.stock < 10 ? 'text-red-500' : 'text-gray-700'}`}>{p.stock} Adet</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">${p.currentPrice.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold uppercase tracking-widest">Aktif</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                       <button onClick={(e) => downloadAllImages(e, p)} className="p-2 hover:bg-white rounded-lg transition-colors text-emerald-500 hover:text-emerald-700" title="Görselleri İndir">
                         <ICONS.Download />
                       </button>
                       <button onClick={() => onEdit(p)} className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-indigo-600" title="Düzenle">
                         <ICONS.Edit />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;
