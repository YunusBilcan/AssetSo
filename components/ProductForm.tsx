
import React, { useState } from 'react';
import { Product, DEFAULT_FEATURES, PriceRecord } from '../types';
import { ICONS } from '../constants';
import { suggestAttributes, generateProductDescription } from '../services/geminiService';

interface ProductFormProps {
  initialData?: Product;
  onSave: (data: Product) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Product>>(initialData || {
    name: '',
    sku: '',
    barcode: '',
    category: '',
    currentPrice: 0,
    description: '',
    assets: [],
    dynamicAttributes: {},
    activeFeatures: ['manuals', 'certificates', 'price_history'],
    variantCodes: [],
    priceHistory: [],
    activityLogs: []
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [newAttrKey, setNewAttrKey] = useState('');
  const [newAttrValue, setNewAttrValue] = useState('');
  const [priceUpdateReason, setPriceUpdateReason] = useState('');

  const isPriceChanged = initialData && formData.currentPrice !== initialData.currentPrice;

  const handleFinalSave = () => {
    let updatedFormData = { ...formData };
    const currentUser = "Jane Doe";

    if (isPriceChanged) {
      if (!priceUpdateReason.trim()) {
        alert("CRITICAL: You must provide a reason for the price adjustment.");
        return;
      }
      const newPriceRecord: PriceRecord = {
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
        price: formData.currentPrice || 0,
        reason: priceUpdateReason,
        user: currentUser
      };
      updatedFormData.priceHistory = [...(formData.priceHistory || []), newPriceRecord];
    } else if (!initialData) {
      updatedFormData.priceHistory = [{
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
        price: formData.currentPrice || 0,
        reason: 'Initial Entry',
        user: currentUser
      }];
    }

    onSave(updatedFormData as Product);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500 mb-20">
      <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{initialData ? 'Edit Asset Profile' : 'New Asset Configuration'}</h2>
          <p className="text-sm text-gray-500">Authorized session: Jane Doe (Product Manager)</p>
        </div>
        <button 
          onClick={async () => {
            if (!formData.name || !formData.category) return;
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
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium text-sm disabled:opacity-50"
        >
          {aiLoading ? 'AI Thinking...' : '✨ AI Assist'}
        </button>
      </div>

      <div className="p-8 space-y-8">
        <section className="space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">1</span>
            Core Identity & Pricing
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Product Name</label>
              <input 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-black"
                placeholder="Product Name"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">SKU Code</label>
              <input 
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-black font-mono"
                placeholder="SKU-XXXX"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-black font-bold"
              >
                <option value="">Select Category</option>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Logistics">Logistics</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Base Price ($)</label>
              <input 
                type="number"
                value={formData.currentPrice}
                onChange={e => setFormData({ ...formData, currentPrice: Number(e.target.value) })}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-black font-bold text-lg"
              />
            </div>
          </div>
          
          {isPriceChanged && (
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 animate-in slide-in-from-top-2">
               <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-200 rounded-lg text-amber-700">
                     <ICONS.Info />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-bold text-amber-800 block mb-1">MANDATORY: Price Change Reason</label>
                    <p className="text-xs text-amber-600 mb-3">Audit logs require a justification for any price modification.</p>
                    <textarea 
                      value={priceUpdateReason}
                      onChange={e => setPriceUpdateReason(e.target.value)}
                      className="w-full p-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 outline-none bg-white text-black text-sm min-h-[100px]"
                      placeholder="e.g., Seasonal inflation adjustment based on Q3 vendor report..."
                      required
                    />
                  </div>
               </div>
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">2</span>
            Dynamic Module Config
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {DEFAULT_FEATURES.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setFormData(prev => {
                  const features = prev.activeFeatures || [];
                  return { ...prev, activeFeatures: features.includes(feature.id) ? features.filter(id => id !== feature.id) : [...features, feature.id] };
                })}
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${
                  formData.activeFeatures?.includes(feature.id) ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100' : 'border-gray-100 bg-white text-gray-600'
                }`}
              >
                <p className="font-bold text-xs">{feature.label}</p>
              </button>
            ))}
          </div>
        </section>

        <div className="flex gap-4 pt-4 border-t border-gray-50">
          <button 
            onClick={handleFinalSave}
            className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
          >
            Authorize & Save Asset
          </button>
          <button onClick={onCancel} className="px-8 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
