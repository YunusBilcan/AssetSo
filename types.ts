
export enum AssetType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  PDF = 'PDF',
  DOC = 'DOC',
  CERTIFICATE = 'CERTIFICATE',
  MANUAL = 'MANUAL'
}

export interface Asset {
  id: string;
  type: AssetType;
  url: string;
  name: string;
  createdAt: string;
}

export interface PriceRecord {
  date: string;
  price: number;
  reason: string;
  user: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PRICE_CHANGE' | 'ASSET_LINK';
  details: string;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  description: string;
  category: string;
  currentPrice: number;
  currency: string;
  variantCodes: string[];
  assets: Asset[];
  priceHistory: PriceRecord[];
  activityLogs: ActivityLog[];
  dynamicAttributes: Record<string, string | number | boolean>;
  activeFeatures: string[];
}

export type ViewState = 'DASHBOARD' | 'LIST' | 'DETAIL' | 'FORM';

export const DEFAULT_FEATURES = [
  { id: 'manuals', label: 'User Manuals', icon: 'Book' },
  { id: 'certificates', label: 'Certificates', icon: 'Shield' },
  { id: 'procurement', label: 'Procurement Docs', icon: 'FileText' },
  { id: 'video_gallery', label: 'Video Gallery', icon: 'Video' },
  { id: 'price_history', label: 'Price History Chart', icon: 'TrendingUp' },
  { id: 'variants', label: 'Variant Management', icon: 'Layers' }
];
