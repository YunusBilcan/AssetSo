
import React, { useState, useRef } from 'react';
import { Product } from '../types';
import { ICONS } from '../constants';

interface ProductListProps {
  products: Product[];
  onView: (p: Product) => void;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
  onBulkUpdate: (content: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onView, onEdit, onDelete, onBulkUpdate }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        onBulkUpdate(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Bank</h2>
          <p className="text-sm text-gray-500">Managing {products.length} registered asset profiles</p>
        </div>
        <div className="flex items-center gap-4">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".csv" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-sm font-bold text-gray-600 hover:text-indigo-600 flex items-center gap-2"
          >
            <ICONS.Edit /> Bulk Price Update
          </button>
          <div className="flex bg-white p-1 rounded-xl border border-gray-200">
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Grid
            </button>
            <button 
               onClick={() => setViewMode('table')}
               className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'table' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
            >
              List
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
                  src={`https://picsum.photos/seed/${p.id}/400/300`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt={p.name}
                />
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(p)} className="p-2 bg-white rounded-xl shadow-lg hover:text-indigo-600">
                    <ICONS.Edit />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(p.id); }} className="p-2 bg-white rounded-xl shadow-lg hover:text-red-600">
                    <ICONS.Trash />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                   <span className="px-2 py-1 bg-white/90 backdrop-blur rounded text-[10px] font-bold text-black uppercase tracking-wider">{p.category}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1 truncate">{p.name}</h3>
                <p className="text-xs text-gray-400 font-medium mb-4">SKU: {p.sku}</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                   <span className="text-xl font-bold text-gray-900">${p.currentPrice.toLocaleString()}</span>
                   <button 
                    onClick={() => onView(p)}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:gap-2 transition-all"
                   >
                     DETAILS <ICONS.ChevronRight />
                   </button>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-20 text-center">
               <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                  <ICONS.Package />
               </div>
               <p className="text-gray-400 font-medium">No assets found matching your criteria.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Asset Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Assets</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onView(p)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={`https://picsum.photos/seed/${p.id}/40/40`} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-black bg-gray-100 px-2 py-1 rounded uppercase">{p.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">${p.currentPrice.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2">
                       {p.assets.slice(0, 3).map((a, i) => (
                         <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                           {a.type.slice(0, 1)}
                         </div>
                       ))}
                       {p.assets.length > 3 && (
                         <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                           +{p.assets.length - 3}
                         </div>
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-50 text-green-600 rounded text-[10px] font-bold uppercase">Active</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                       <button onClick={() => onEdit(p)} className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-indigo-600">
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
