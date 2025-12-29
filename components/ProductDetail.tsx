
import React, { useState } from 'react';
import { Product, AssetType, UserRole, PERMISSIONS } from '../types';
import { ICONS } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProductDetailProps {
  product: Product;
  userRole: UserRole;
  onBack: () => void;
  onEdit: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, userRole, onBack, onEdit }) => {
  const [activeTab, setActiveTab] = useState('genel');

  const images = product.assets.filter(a => a.type === AssetType.IMAGE);
  const docs = product.assets.filter(a => a.type === AssetType.PDF);
  const videos = product.assets.filter(a => a.type === AssetType.VIDEO);
  const canEdit = PERMISSIONS.EDIT_PRODUCT.includes(userRole);
  const canSeeLogs = PERMISSIONS.VIEW_AUDIT_LOGS.includes(userRole);

  const downloadAllImages = () => {
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
      }, index * 200);
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ICONS.Back />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-xs text-gray-500">SKU: <span className="font-mono">{product.sku}</span></p>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <p className="text-xs text-gray-500">Barkod: <span className="font-mono">{product.barcode || 'Girilmemiş'}</span></p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={downloadAllImages} 
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-bold hover:bg-emerald-100 transition-all border border-emerald-100"
          >
            <ICONS.Download /> Görselleri İndir
          </button>
          {canEdit && (
            <button onClick={onEdit} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-md">
              <ICONS.Edit /> Düzenle
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-4">
          <div className="aspect-square bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <img 
              src={images[0]?.url || `https://picsum.photos/seed/${product.id}/600/600`} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          {videos.length > 0 && (
            <div className="bg-black rounded-3xl overflow-hidden aspect-video relative group border border-gray-800 shadow-xl">
               <video 
                 src={videos[0].url} 
                 controls 
                 className="w-full h-full object-contain"
               />
               <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-white font-bold flex items-center gap-1">
                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                 Tanıtım Videosu
               </div>
            </div>
          )}
          <div className="grid grid-cols-4 gap-2">
            {images.slice(1, 5).map(img => (
              <div key={img.id} className="aspect-square rounded-xl border border-gray-100 overflow-hidden">
                <img src={img.url} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Sistem Bilgisi</p>
             <div className="space-y-1">
                <div className="flex justify-between text-xs">
                   <span className="text-gray-500">Açılış Tarihi</span>
                   <span className="font-bold text-gray-900">{product.entryDate}</span>
                </div>
                <div className="flex justify-between text-xs">
                   <span className="text-gray-500">ID</span>
                   <span className="font-mono text-gray-400">{product.id}</span>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="grid grid-cols-3 gap-6 border-b border-gray-50 pb-6">
              <div>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest">{product.category}</span>
                <h2 className="text-3xl font-bold text-gray-900 mt-2">${product.currentPrice.toLocaleString()}</h2>
                <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">Birim Fiyat</p>
              </div>
              <div className="text-center">
                <h2 className={`text-3xl font-bold mt-6 ${product.stock < 10 ? 'text-red-500' : 'text-gray-900'}`}>{product.stock}</h2>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Mevcut Stok</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-400 uppercase">Durum</p>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold uppercase mt-1 inline-block">Aktif</span>
              </div>
            </div>

            <div className="flex border-b border-gray-100 overflow-x-auto gap-6">
              {[
                {id: 'genel', label: 'Özet'},
                {id: 'ozellikler', label: 'Özellikler'},
                {id: 'dosyalar', label: 'Dosyalar'},
                {id: 'fiyat', label: 'Fiyat Analizi'},
                {id: 'denetim', label: 'Audit Log', hidden: !canSeeLogs}
              ].filter(t => !t.hidden).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
                    activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />}
                </button>
              ))}
            </div>

            <div className="min-h-[250px] py-4">
              {activeTab === 'genel' && (
                <div className="text-gray-600 text-sm leading-relaxed prose prose-indigo max-w-none">
                  {product.description || "Bu ürün için henüz detaylı bir açıklama girilmemiş."}
                </div>
              )}

              {activeTab === 'ozellikler' && (
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.dynamicAttributes).map(([key, val]) => (
                    <div key={key} className="bg-gray-50 p-4 rounded-2xl flex flex-col gap-1 border border-gray-100 transition-all hover:border-indigo-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{key}</span>
                      <span className="font-bold text-black text-sm">{val as string}</span>
                    </div>
                  ))}
                  {Object.keys(product.dynamicAttributes).length === 0 && (
                    <p className="col-span-2 text-center py-10 text-gray-400 text-sm">Hiç özellik tanımlanmamış.</p>
                  )}
                </div>
              )}

              {activeTab === 'dosyalar' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {docs.map(doc => (
                      <a key={doc.id} href={doc.url} target="_blank" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:border-indigo-200 transition-all group">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              <ICONS.Package />
                           </div>
                           <span className="text-xs font-bold text-gray-700 truncate max-w-[150px]">{doc.name}</span>
                        </div>
                        <ICONS.ChevronRight />
                      </a>
                    ))}
                    {videos.map(video => (
                      <div key={video.id} className="flex items-center justify-between p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100 group">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-indigo-600 text-white rounded-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
                           </div>
                           <span className="text-xs font-bold text-gray-700 truncate max-w-[150px]">{video.name}</span>
                        </div>
                        <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Video</span>
                      </div>
                    ))}
                    {docs.length === 0 && videos.length === 0 && <p className="col-span-2 text-center py-10 text-gray-400 text-xs">Yüklü döküman veya video bulunamadı.</p>}
                  </div>
                </div>
              )}

              {activeTab === 'fiyat' && (
                <div className="space-y-6">
                   <div className="h-[200px] w-full bg-gray-50 rounded-2xl p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={product.priceHistory}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                          <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} />
                          <YAxis fontSize={10} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Line type="monotone" dataKey="price" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} />
                        </LineChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="space-y-2">
                     {product.priceHistory.slice().reverse().map((h, i) => (
                       <div key={i} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-xl">
                          <div>
                            <p className="text-sm font-bold text-gray-900">${h.price.toLocaleString()}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{h.reason}</p>
                          </div>
                          <div className="text-right">
                             <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{h.date}</span>
                             <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold tracking-widest">{h.user}</p>
                          </div>
                       </div>
                     ))}
                   </div>
                </div>
              )}

              {activeTab === 'denetim' && canSeeLogs && (
                <div className="space-y-4">
                   <div className="relative border-l-2 border-indigo-100 ml-4 space-y-8 py-4">
                      {product.activityLogs?.map(log => (
                        <div key={log.id} className="relative pl-8">
                           <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-indigo-600" />
                           <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                             <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{log.action}</span>
                                <span className="text-[10px] text-gray-400 font-medium">{log.timestamp}</span>
                             </div>
                             <p className="text-xs font-bold text-gray-700">{log.details}</p>
                             <div className="mt-2 flex items-center gap-1">
                                <div className="w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center text-[8px] text-white font-bold">{log.user.charAt(0)}</div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{log.user}</span>
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
