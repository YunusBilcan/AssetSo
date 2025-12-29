
export enum AssetType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  PDF = 'PDF',
  DOC = 'DOC',
  CERTIFICATE = 'CERTIFICATE',
  MANUAL = 'MANUAL'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  VIEWER = 'VIEWER'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
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
  stock: number;
  entryDate: string;
  variantCodes: string[];
  assets: Asset[];
  priceHistory: PriceRecord[];
  activityLogs: ActivityLog[];
  dynamicAttributes: Record<string, string | number | boolean>;
  activeFeatures: string[];
}

export type ViewState = 'DASHBOARD' | 'LIST' | 'DETAIL' | 'FORM' | 'BULK_UPDATE' | 'USER_MANAGEMENT' | 'PRICING';

export const PERMISSIONS = {
  EDIT_PRODUCT: [UserRole.ADMIN, UserRole.MANAGER],
  DELETE_PRODUCT: [UserRole.ADMIN],
  EDIT_PRICE: [UserRole.ADMIN, UserRole.MANAGER],
  UPLOAD_ASSETS: [UserRole.ADMIN, UserRole.MANAGER],
  VIEW_AUDIT_LOGS: [UserRole.ADMIN],
  MANAGE_USERS: [UserRole.ADMIN],
};
