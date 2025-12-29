
import React, { useState, useRef } from 'react';
import { Product, Asset, AssetType, UserRole, PERMISSIONS } from '../types';
import { ICONS } from '../constants';
import { suggestAttributes, generateProductDescription } from '../services/geminiService';

interface ProductFormProps {
  initialData?: Product;
  categories: string[];
  userRole: UserRole;
  onSave: (data: Product) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, categories, userRole, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Product>>(initialData || {
    name: '',
    sku: '',
    barcode: '',
    category: '',
    currentPrice: 0,
    stock: 0,
    entryDate: new Date().toISOString().split('T')[0],
    description: '',
    assets: [],
    dynamicAttributes: {},
    activeFeatures: ['price_history'],
    variantCodes: [],
    priceHistory: [],
    activityLogs: []
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [newAttrKey, setNewAttrKey] = useState('');
  const [newAttrValue, setNewAttrValue] = useState('');
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const canEditPrice = PERMISSIONS.EDIT_PRICE.includes(userRole);
  const canUpload = PERMISSIONS.UPLOAD_ASSETS.includes(userRole);

  const handleAddAttribute = () => {
    if (!newAttrKey) return;
    setFormData(prev => ({
      ...prev,
      dynamicAttributes: {
        ...prev.dynamicAttributes,
        [newAttrKey]: newAttrValue
      }
    }));
    setNewAttrKey('');
    setNewAttrValue('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: AssetType) => {
    if (!canUpload) return alert("Dosya yükleme yetkiniz yok.");
    const files = e.target.files;
    if (files) {
      // Added explicit type to 'file' to resolve 'unknown' type errors reported in line numbers 67 and 76
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newAsset: Asset = {
            id: Math.random().toString(36).substr(2, 9),
            type: type,
            name: file.name,
            url: event.target?.result as string,
            createdAt: new Date().toISOString()
          };
          setFormData(prev => ({
            ...prev,
            assets: [...(prev.assets || []), newAsset]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
    // Reset input to allow same file upload if needed
    e.target.value = '';
  };

  const removeAsset = (id: string) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets?.filter(a => a.id !== id)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500 mb-20">
      <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{initialData ? 'Ürünü Düzenle' : 'Yeni Ürün Oluştur'}</h2>
          <p className="text-sm text-gray-500">Yetki: <span className="font-bold text-indigo-600 uppercase">{userRole}</span></p>
        </div>
        <button 
          onClick={async () => {
            if (!formData.name || !formData.category) return alert("AI yardımı için ad ve kategori gereklidir.");
            setAiLoading(true);
            const suggested = await suggestAttributes(formData.name, formData.category);
            const description = await generateProductDescription(formData.name, formData.category, formData.dynamicAttributes);
            setFormData(prev => ({
              ...prev,
              description: description || prev.description,
              dynamicAttributes: { ...prev.dynamicAttributes, ...suggested.reduce((acc, key) => ({ ...acc, [key]: '' }), {}) }
            }));
            setAiLoading(false);
          }}
          disabled={aiLoading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium text-sm disabled:opacity-50 hover:shadow-lg transition-all"
        >
          {aiLoading ? 'Hazırlanıyor...' : '✨ Zeki Öneri'}
        </button>
      </div>

      <div className="p-8 space-y-8">
        <section className="space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">1</span>
            Genel Bilgiler ve Envanter
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1 col-span-2 md:col-span-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ürün Adı</label>
              <input 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-200 bg-white text-black outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Örn: Fiber Optik Kablo"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ürün Kodu (SKU)</label>
              <input 
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-200 bg-white text-black font-mono outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="SKU-123"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Barkod</label>
              <input 
                value={formData.barcode}
                onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-200 bg-white text-black font-mono outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="868XXXXXXXXXX"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kategori</label>
              <input 
                list="cats"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-200 bg-white text-black font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Seçin veya yazın..."
              />
              <datalist id="cats">{categories.map(c => <option key={c} value={c} />)}</datalist>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stok Miktarı</label>
              <input 
                type="number"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full p-3 rounded-xl border border-gray-200 bg-white text-black font-bold outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Açılış Tarihi</label>
              <input 
                type="date"
                value={formData.entryDate}
                onChange={e => setFormData({ ...formData, entryDate: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-200 bg-white text-black outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Birim Fiyat ($)</label>
              <input 
                type="number"
                disabled={!canEditPrice}
                value={formData.currentPrice}
                onChange={e => setFormData({ ...formData, currentPrice: Number(e.target.value) })}
                className={`w-full p-3 rounded-xl border border-gray-200 bg-white text-black font-bold text-lg outline-none focus:ring-2 focus:ring-indigo-500 ${!canEditPrice && 'opacity-50'}`}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">2</span>
            Özelleştirilmiş Özellikler
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(formData.dynamicAttributes || {}).map(([key, val]) => (
              <div key={key} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center group shadow-sm transition-all hover:border-indigo-200">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Özellik Adı</p>
                    <p className="text-sm font-bold text-black">{key}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Özellik Değeri</p>
                    <input 
                      value={val as string}
                      onChange={e => setFormData({
                        ...formData,
                        dynamicAttributes: { ...formData.dynamicAttributes, [key]: e.target.value }
                      })}
                      className="bg-transparent border-none p-0 text-sm font-bold w-full focus:ring-0 text-black border-b border-gray-100"
                    />
                  </div>
                </div>
                <button onClick={() => {
                  const n = { ...formData.dynamicAttributes }; delete n[key]; setFormData({...formData, dynamicAttributes: n});
                }} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><ICONS.Trash /></button>
              </div>
            ))}
            <div className="bg-white p-4 rounded-xl border border-dashed border-indigo-200 flex items-center gap-4">
               <div className="flex-1 space-y-2">
                 <input placeholder="Yeni Özellik Adı" value={newAttrKey} onChange={e => setNewAttrKey(e.target.value)} className="w-full bg-white border border-gray-100 rounded-lg p-2 text-xs font-bold text-black outline-none focus:border-indigo-500"/>
                 <input placeholder="Değer" value={newAttrValue} onChange={e => setNewAttrValue(e.target.value)} className="w-full bg-white border border-gray-100 rounded-lg p-2 text-xs text-black outline-none focus:border-indigo-500" onKeyDown={e => e.key === 'Enter' && handleAddAttribute()}/>
               </div>
               <button onClick={handleAddAttribute} className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 shadow-md transition-all"><ICONS.Plus /></button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">3</span>
            Görsel, Video ve Dokümanlar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ürün Görselleri</label>
              <div onClick={() => canUpload && imageInputRef.current?.click()} className={`border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center transition-all ${canUpload ? 'cursor-pointer hover:border-indigo-400' : 'opacity-50'}`}>
                <input type="file" ref={imageInputRef} hidden accept="image/*" multiple onChange={(e) => handleFileUpload(e, AssetType.IMAGE)} />
                <div className="flex justify-center mb-2"><ICONS.Package /></div>
                <p className="text-[10px] font-bold text-gray-400">Çoklu Görsel Seç</p>
              </div>
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                {formData.assets?.filter(a => a.type === AssetType.IMAGE).map(a => (
                  <div key={a.id} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 group">
                    <img src={a.url} className="w-full h-full object-cover" />
                    <button onClick={() => removeAsset(a.id)} className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center"><ICONS.Trash /></button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ürün Videoları</label>
              <div onClick={() => canUpload && videoInputRef.current?.click()} className={`border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center transition-all ${canUpload ? 'cursor-pointer hover:border-indigo-400' : 'opacity-50'}`}>
                <input type="file" ref={videoInputRef} hidden accept="video/*" multiple onChange={(e) => handleFileUpload(e, AssetType.VIDEO)} />
                <div className="flex justify-center mb-2 text-indigo-600"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg></div>
                <p className="text-[10px] font-bold text-gray-400">Çoklu Video Yükle</p>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {formData.assets?.filter(a => a.type === AssetType.VIDEO).map(a => (
                  <div key={a.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-[10px] border border-transparent hover:border-indigo-200 transition-all">
                    <span className="truncate flex-1 font-bold text-black" title={a.name}>{a.name}</span>
                    <button onClick={() => removeAsset(a.id)} className="text-gray-400 hover:text-red-500 ml-2"><ICONS.Trash /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PDF Kılavuzlar</label>
              <div onClick={() => canUpload && docInputRef.current?.click()} className={`border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center transition-all ${canUpload ? 'cursor-pointer hover:border-indigo-400' : 'opacity-50'}`}>
                <input type="file" ref={docInputRef} hidden accept=".pdf" multiple onChange={(e) => handleFileUpload(e, AssetType.PDF)} />
                <div className="flex justify-center mb-2"><ICONS.Edit /></div>
                <p className="text-[10px] font-bold text-gray-400">Çoklu Kılavuz Seç</p>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {formData.assets?.filter(a => a.type === AssetType.PDF).map(a => (
                  <div key={a.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-[10px] border border-transparent hover:border-indigo-200 transition-all">
                    <span className="truncate flex-1 font-bold text-black" title={a.name}>{a.name}</span>
                    <button onClick={() => removeAsset(a.id)} className="text-gray-400 hover:text-red-500 ml-2"><ICONS.Trash /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="flex gap-4 pt-4 border-t border-gray-50">
          <button onClick={() => onSave(formData as Product)} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all">Veriyi Kaydet ve Onayla</button>
          <button onClick={onCancel} className="px-8 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all">Vazgeç</button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
