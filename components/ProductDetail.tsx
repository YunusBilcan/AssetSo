
import React, { useState } from 'react';
import { Product, AssetType } from '../types';
import { ICONS } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onEdit: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onEdit }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const images = product.assets.filter(a => a.type === AssetType.IMAGE);
  const manuals = product.assets.filter(a => a.type === AssetType.MANUAL || a.type === AssetType.PDF);
  const hasFeature = (id: string) => product.activeFeatures.includes(id);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ICONS.Back />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-sm text-gray-500">Inventory ID: {product.sku}</p>
        </div>
        <button onClick={onEdit} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md">
          <ICONS.Edit /> Edit Asset
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <img 
              src={images[0]?.url || `https://picsum.photos/seed/${product.id}/600/600`} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-3 py-1 bg-gray-100 text-black rounded-full text-[10px] font-bold uppercase tracking-widest">{product.category}</span>
                <h2 className="text-3xl font-bold text-gray-900 mt-2">${product.currentPrice.toLocaleString()}</h2>
                <p className="text-xs text-gray-400 mt-1 uppercase font-bold">Base Market Valuation</p>
              </div>
            </div>

            <div className="flex border-b border-gray-100 overflow-x-auto">
              {['overview', 'specs', 'assets', 'history', 'audit'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${
                    activeTab === tab ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
                </button>
              ))}
            </div>

            <div className="py-4">
              {activeTab === 'overview' && (
                <div className="text-gray-600 leading-relaxed text-sm">
                  {product.description || "Detailed documentation pending."}
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(product.dynamicAttributes).map(([key, val]) => (
                    <div key={key} className="bg-gray-50 p-4 rounded-xl flex justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{key}</span>
                      <span className="font-bold text-black text-sm">{val as string}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-6">
                  {hasFeature('price_history') ? (
                    <>
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={product.priceHistory}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                            <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} />
                            <YAxis fontSize={10} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                            <Line type="stepAfter" dataKey="price" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price Evolution Log</p>
                        {product.priceHistory.slice().reverse().map((record, i) => (
                          <div key={i} className="flex justify-between p-4 bg-gray-50 rounded-xl border-l-4 border-indigo-500">
                             <div>
                               <p className="text-sm font-bold text-black">${record.price.toLocaleString()}</p>
                               <p className="text-xs text-gray-500 mt-1">"{record.reason}"</p>
                               <p className="text-[10px] text-indigo-600 font-bold mt-2 uppercase">BY: {record.user}</p>
                             </div>
                             <span className="text-[10px] font-bold text-gray-400">{record.date}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : <p className="text-sm text-gray-400 text-center py-10">Price tracking is disabled for this profile.</p>}
                </div>
              )}

              {activeTab === 'audit' && (
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Activity Audit</p>
                  <div className="relative border-l-2 border-gray-100 ml-3 space-y-6 py-2">
                    {product.activityLogs?.map((log, i) => (
                      <div key={log.id} className="relative pl-6">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-indigo-600 shadow-sm" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-black uppercase">{log.action}</span>
                            <span className="text-[10px] text-gray-400">{log.timestamp}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{log.details}</p>
                          <div className="flex items-center gap-1 mt-2">
                            <div className="w-4 h-4 bg-indigo-100 rounded-full flex items-center justify-center text-[8px] font-bold text-indigo-600">
                              {log.user.charAt(0)}
                            </div>
                            <span className="text-[10px] font-bold text-indigo-600 uppercase">Actor: {log.user}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
