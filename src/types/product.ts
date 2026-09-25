export type Category = 'อาหาร' | 'เครื่องดื่ม' | 'ของใช้' | 'เสื้อผ้า';

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: Category;
  createdAt: string;
}

export type CategoryFilter = 'ทั้งหมด' | Category;

export interface NotificationMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}
