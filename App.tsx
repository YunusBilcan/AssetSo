
import React, { useState, useMemo } from 'react';
import { Product, ViewState, AssetType, ActivityLog } from './types';
import { ICONS } from './constants';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import ProductForm from './components/ProductForm';

const CURRENT_USER = "Jane Doe";

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Industrial Fiber Switch PRO 1000',
    sku: 'IFS-1000-B',
    barcode: '4012345678901',
    category: 'Hardware',
    currentPrice: 899.99,
    currency: 'USD',
    variantCodes: ['IFS-1000-B-SILVER', 'IFS-1000-B-BLACK'],
    description: 'The IFS-1000-B is an industry-grade fiber switch designed for extreme environments.',
    activeFeatures: ['manuals', 'certificates', 'price_history', 'variants'],
    dynamicAttributes: { 'Port Count': 8, 'IP Rating': 'IP67' },
    assets: [
      { id: 'a1', type: AssetType.MANUAL, name: 'User_Manual_v2.pdf', url: '#', createdAt: '2024-01-01' }
    ],
    priceHistory: [
      { date: 'Jan 10', price: 950, reason: 'Initial Cataloging', user: 'System Admin' },
      { date: 'Mar 05', price: 899, reason: 'Supplier Cost Adjustment', user: 'Jane Doe' }
    ],
    activityLogs: [
      { id: 'l1', timestamp: '2024-03-05 14:22', user: 'Jane Doe', action: 'PRICE_CHANGE', details: 'Lowered price due to new supplier contract' }
    ]
  }
];

export default function App() {
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const addLog = (product: Product, action: ActivityLog['action'], details: string): ActivityLog => ({
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString().replace('T', ' ').substr(0, 16),
    user: CURRENT_USER,
    action,
    details
  });

  const handleSaveProduct = (data: Product) => {
    if (data.id) {
      const existing = products.find(p => p.id === data.id);
      let logs = data.activityLogs || [];
      
      if (existing && existing.currentPrice !== data.currentPrice) {
        logs = [addLog(data, 'PRICE_CHANGE', `Price updated from $${existing.currentPrice} to $${data.currentPrice}`), ...logs];
      } else {
        logs = [addLog(data, 'UPDATE', 'Product metadata updated'), ...logs];
      }
      
      const updatedProduct = { ...data, activityLogs: logs };
      setProducts(prev => prev.map(p => p.id === data.id ? updatedProduct : p));
    } else {
      const newId = Date.now().toString();
      const newProduct = { 
        ...data, 
        id: newId,
        activityLogs: [addLog(data as any, 'CREATE', 'Initial asset creation')]
      };
      setProducts(prev => [newProduct, ...prev]);
    }
    setView('LIST');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleBulkPriceUpdate = (csvContent: string) => {
    const lines = csvContent.split('\n');
    const newProducts = [...products];
    let updatedCount = 0;

    lines.forEach(line => {
      const [sku, priceStr, reasonStr] = line.split(',').map(s => s.trim());
      const price = parseFloat(priceStr);
      const reason = reasonStr || 'Bulk Price Adjustment';
      
      if (sku && !isNaN(price)) {
        const index = newProducts.findIndex(p => p.sku.toLowerCase() === sku.toLowerCase());
        if (index !== -1) {
          const product = newProducts[index];
          if (product.currentPrice === price) return;

          newProducts[index] = {
            ...product,
            currentPrice: price,
            priceHistory: [
              ...product.priceHistory,
              { 
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }), 
                price: price,
                reason: reason,
                user: CURRENT_USER
              }
            ],
            activityLogs: [
              addLog(product, 'PRICE_CHANGE', `Bulk price update: $${product.currentPrice} -> $${price}. Reason: ${reason}`),
              ...product.activityLogs
            ]
          };
          updatedCount++;
        }
      }
    });

    if (updatedCount > 0) {
      setProducts(newProducts);
      alert(`${updatedCount} products updated successfully.`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
               <ICONS.Package />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">AssetPro <span className="text-indigo-600">PIM</span></h1>
          </div>
          
          <nav className="space-y-2">
            {[
              { id: 'DASHBOARD' as ViewState, label: 'Dashboard', icon: <ICONS.Dashboard /> },
              { id: 'LIST' as ViewState, label: 'Inventory Bank', icon: <ICONS.Package /> },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all ${
                  view === item.id 
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Logged in as</p>
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">JD</div>
               <div>
                  <p className="text-sm font-bold text-gray-900 leading-none">{CURRENT_USER}</p>
                  <p className="text-[10px] text-gray-400 mt-1">Product Manager</p>
               </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex-1 max-w-2xl relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
              <ICONS.Search />
            </div>
            <input 
              placeholder="Quick search products, SKUs, or assets..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                if (view !== 'LIST') setView('LIST');
              }}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-4 ml-8">
             <button className="p-2.5 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors">
                <ICONS.Settings />
             </button>
             <div className="h-8 w-px bg-gray-100 mx-2"></div>
             <button 
                onClick={() => {
                  setSelectedProduct(null);
                  setView('FORM');
                }}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                Add Asset
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {view === 'DASHBOARD' && <Dashboard products={products} onNavigate={setView} onBulkUpdate={handleBulkPriceUpdate} />}
          {view === 'LIST' && (
            <ProductList 
              products={filteredProducts} 
              onView={(p) => { setSelectedProduct(p); setView('DETAIL'); }}
              onDelete={handleDeleteProduct}
              onEdit={(p) => { setSelectedProduct(p); setView('FORM'); }}
              onBulkUpdate={handleBulkPriceUpdate}
            />
          )}
          {view === 'DETAIL' && selectedProduct && (
            <ProductDetail 
              product={selectedProduct} 
              onBack={() => setView('LIST')} 
              onEdit={() => setView('FORM')}
            />
          )}
          {view === 'FORM' && (
            <ProductForm 
              initialData={selectedProduct || undefined}
              onSave={handleSaveProduct}
              onCancel={() => setView('LIST')}
            />
          )}
        </div>
      </main>
    </div>
  );
}
