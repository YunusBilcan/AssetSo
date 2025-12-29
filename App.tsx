
import React, { useState, useMemo } from 'react';
import { Product, ViewState, AssetType, ActivityLog, User, UserRole, PERMISSIONS } from './types';
import { ICONS } from './constants';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import ProductForm from './components/ProductForm';
import BulkUpdateView from './components/BulkUpdateView';
import UserManagement from './components/UserManagement';
import Pricing from './components/Pricing';

const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Ahmet Yılmaz', role: UserRole.ADMIN },
  { id: 'u2', name: 'Ayşe Kaya', role: UserRole.MANAGER },
  { id: 'u3', name: 'Mehmet Can', role: UserRole.VIEWER },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Endüstriyel Fiber Switch PRO 1000',
    sku: 'IFS-1000-B',
    barcode: '8681234567890',
    category: 'Donanım',
    currentPrice: 899.99,
    currency: 'USD',
    stock: 142,
    entryDate: '2023-11-15',
    variantCodes: ['IFS-1000-B-SILVER'],
    description: 'Aşırı ortamlar için tasarlanmış endüstriyel sınıf fiber switch.',
    activeFeatures: ['price_history'],
    dynamicAttributes: { 'Port Sayısı': 8, 'IP Sınıfı': 'IP67' },
    assets: [],
    priceHistory: [
      { date: '10 Oca', price: 950, reason: 'İlk Kayıt', user: 'Ahmet Yılmaz' }
    ],
    activityLogs: [
      { id: 'l1', timestamp: '2024-03-05 14:22', user: 'Ahmet Yılmaz', action: 'PRICE_CHANGE', details: 'Fiyat güncellendi' }
    ]
  }
];

export default function App() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(users[0]);
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const hasPermission = (permission: keyof typeof PERMISSIONS) => {
    return PERMISSIONS[permission].includes(currentUser.role);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery)
    );
  }, [products, searchQuery]);

  const uniqueCategories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    ['Donanım', 'Yazılım', 'Lojistik', 'Endüstriyel'].forEach(c => cats.add(c));
    return Array.from(cats).filter(Boolean).sort();
  }, [products]);

  const handleAddUser = (user: User) => {
    setUsers(prev => [...prev, user]);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    if (currentUser.id === id) setCurrentUser(users[0]);
  };

  const handleSaveProduct = (data: Product) => {
    if (!hasPermission('EDIT_PRODUCT')) return alert("Yetkiniz yok.");
    
    // SaaS Limit Check: Only for NEW products
    if (!data.id && products.length >= 10) {
      alert("Ücretsiz plan limitine (10 ürün) ulaştınız. Lütfen paketinizi yükseltin.");
      setView('PRICING');
      return;
    }

    if (data.id) {
      setProducts(prev => prev.map(p => p.id === data.id ? data : p));
    } else {
      const newProduct = { ...data, id: Date.now().toString(), entryDate: new Date().toISOString().split('T')[0] };
      setProducts(prev => [newProduct, ...prev]);
    }
    setView('LIST');
  };

  const handleNavigateToAddProduct = () => {
    if (products.length >= 10) {
      setView('PRICING');
    } else {
      setSelectedProduct(null);
      setView('FORM');
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
              { id: 'DASHBOARD' as ViewState, label: 'Panel', icon: <ICONS.Dashboard /> },
              { id: 'LIST' as ViewState, label: 'Envanter Bankası', icon: <ICONS.Package /> },
              { id: 'USER_MANAGEMENT' as ViewState, label: 'Kullanıcılar', icon: <ICONS.Users />, hidden: !hasPermission('MANAGE_USERS') },
              { id: 'PRICING' as ViewState, label: 'Abonelik & Fiyat', icon: <ICONS.Info /> },
              { id: 'BULK_UPDATE' as ViewState, label: 'Toplu Güncelleme', icon: <ICONS.Edit />, hidden: !hasPermission('EDIT_PRICE') },
            ].filter(i => !i.hidden).map(item => (
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

        <div className="mt-auto p-8 space-y-4">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Aktif Kullanıcı</p>
            <div className="relative group">
              <select 
                className="w-full bg-white text-black text-xs border border-gray-200 rounded-lg p-3 font-bold outline-none ring-offset-0 focus:ring-2 focus:ring-indigo-600 appearance-none cursor-pointer hover:border-indigo-400 transition-all shadow-sm"
                value={currentUser.id}
                onChange={(e) => setCurrentUser(users.find(u => u.id === e.target.value)!)}
              >
                {users.map(u => (
                  <option 
                    key={u.id} 
                    value={u.id} 
                    className="bg-white text-black py-2 hover:bg-indigo-600 hover:text-white"
                  >
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-indigo-600 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
          <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100/50">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-white shadow-inner border border-white/10">{currentUser.name.charAt(0)}</div>
               <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate leading-none">{currentUser.name}</p>
                  <p className="text-[9px] opacity-80 mt-1 uppercase font-black tracking-[0.1em]">{currentUser.role}</p>
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
              placeholder="Ürün, Barkod veya SKU ara..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                if (view !== 'LIST') setView('LIST');
              }}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-black transition-all"
            />
          </div>
          <div className="flex items-center gap-4 ml-8">
             {hasPermission('EDIT_PRODUCT') && (
               <button 
                  onClick={handleNavigateToAddProduct}
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                >
                  <ICONS.Plus /> Ürün Ekle
               </button>
             )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {view === 'DASHBOARD' && <Dashboard products={products} onNavigate={setView} />}
          {view === 'LIST' && (
            <ProductList 
              products={filteredProducts} 
              onView={(p) => { setSelectedProduct(p); setView('DETAIL'); }}
              onDelete={(id) => setProducts(p => p.filter(x => x.id !== id))}
              onEdit={(p) => { setSelectedProduct(p); setView('FORM'); }}
              canDelete={hasPermission('DELETE_PRODUCT')}
            />
          )}
          {view === 'USER_MANAGEMENT' && (
            <UserManagement users={users} onAddUser={handleAddUser} onDeleteUser={handleDeleteUser} />
          )}
          {view === 'PRICING' && (
            <Pricing currentProductCount={products.length} onSelectPlan={(plan) => {
              alert(`${plan} seçildi. Ödeme sayfasına yönlendiriliyorsunuz...`);
              setView('DASHBOARD');
            }} />
          )}
          {view === 'DETAIL' && selectedProduct && (
            <ProductDetail product={selectedProduct} userRole={currentUser.role} onBack={() => setView('LIST')} onEdit={() => setView('FORM')} />
          )}
          {view === 'FORM' && (
            <ProductForm 
              initialData={selectedProduct || undefined} 
              categories={uniqueCategories} 
              userRole={currentUser.role} 
              onSave={handleSaveProduct} 
              onCancel={() => setView('LIST')} 
            />
          )}
          {view === 'BULK_UPDATE' && (
            <BulkUpdateView onBulkUpdate={() => setView('LIST')} onCancel={() => setView('DASHBOARD')} />
          )}
        </div>
      </main>
    </div>
  );
}
