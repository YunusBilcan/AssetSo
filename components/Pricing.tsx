
import React from 'react';
import { ICONS } from '../constants';

interface PricingProps {
  currentProductCount: number;
  onSelectPlan: (plan: string) => void;
}

const Pricing: React.FC<PricingProps> = ({ currentProductCount, onSelectPlan }) => {
  const plans = [
    {
      name: 'Başlangıç (Ücretsiz)',
      price: '0',
      limit: '10 Ürün',
      features: ['Temel Envanter Yönetimi', 'Tekli Görsel Yükleme', 'Düşük Öncelikli Destek'],
      buttonText: 'Mevcut Plan',
      isCurrent: true,
      color: 'gray'
    },
    {
      name: 'Profesyonel',
      price: '99.99',
      limit: '100 Ürün',
      features: ['Toplu Görsel İndirme', 'AI Ürün Açıklamaları', 'Video Yükleme Desteği', 'Detaylı Analizler'],
      buttonText: 'Hemen Yükselt',
      isCurrent: false,
      recommended: true,
      color: 'indigo'
    },
    {
      name: 'Business',
      price: '139.99',
      limit: '300 Ürün',
      features: ['100 Planına Ek Olarak:', 'Sınırsız PDF Kılavuz', 'Gelişmiş Audit Log', 'API Erişimi'],
      buttonText: 'Hemen Yükselt',
      isCurrent: false,
      color: 'purple'
    },
    {
      name: 'Enterprise',
      price: '249',
      limit: '500 Ürün',
      features: ['Sınırsız Kullanıcı Yönetimi', 'Özel SLA Desteği', 'Bulut Yedekleme', 'Beyaz Etiketleme'],
      buttonText: 'Hemen Yükselt',
      isCurrent: false,
      color: 'blue'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-16">
        <h2 className="text-indigo-600 font-bold tracking-widest uppercase text-xs mb-3">Abonelik Yönetimi</h2>
        <h1 className="text-4xl font-black text-gray-900 mb-4">Planınızı Seçin</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Şu anda <strong>{currentProductCount}</strong> ürün yönetiyorsunuz. 10 ürünlük ücretsiz limitinize ulaştınız. Kesintisiz hizmet için size uygun paketi seçin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan, i) => (
          <div 
            key={i} 
            className={`relative bg-white rounded-3xl p-8 border ${
              plan.recommended ? 'border-indigo-600 shadow-2xl shadow-indigo-100 ring-2 ring-indigo-600 ring-opacity-10' : 'border-gray-100 shadow-xl'
            } flex flex-col transition-all hover:-translate-y-2`}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                En Popüler
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                <span className="text-gray-400 font-bold text-sm">₺/ay</span>
              </div>
              <p className="text-indigo-600 font-bold text-xs mt-2">{plan.limit}</p>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((feat, j) => (
                <li key={j} className="flex items-start gap-3 text-sm text-gray-600">
                  <div className={`mt-1 text-${plan.color === 'gray' ? 'gray' : plan.color}-500`}>
                    <ICONS.Check />
                  </div>
                  {feat}
                </li>
              ))}
            </ul>

            <button
              onClick={() => !plan.isCurrent && onSelectPlan(plan.name)}
              disabled={plan.isCurrent}
              className={`w-full py-4 rounded-2xl font-bold transition-all ${
                plan.isCurrent 
                  ? 'bg-gray-100 text-gray-400 cursor-default' 
                  : plan.recommended 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
                    : 'bg-white border-2 border-gray-100 text-gray-900 hover:border-indigo-600 hover:text-indigo-600'
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-20 bg-gray-900 rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-2">Kurumsal Çözümler</h3>
          <p className="text-gray-400 max-w-lg">Binlerce ürününüz mü var? Özel entegrasyonlar ve sınırsız kapasite için ekibimizle görüşün.</p>
        </div>
        <button className="relative z-10 bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all">
          Bize Ulaşın
        </button>
        <div className="absolute top-0 right-0 opacity-10 -mr-20 -mt-20">
          <svg width="400" height="400" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="100" fill="white"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
