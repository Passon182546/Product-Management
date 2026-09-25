import type { Product } from '../types/product';

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    sku: 'FOOD-001',
    name: 'ข้าวผัด',
    category: 'อาหาร',
    price: 45.0,
    stock: 20,
    createdAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'prod-2',
    sku: 'DRK-001',
    name: 'น้ำส้ม',
    category: 'เครื่องดื่ม',
    price: 25.0,
    stock: 50,
    createdAt: '2026-09-02T11:30:00.000Z',
  },
  {
    id: 'prod-3',
    sku: 'USE-001',
    name: 'สบู่',
    category: 'ของใช้',
    price: 35.0,
    stock: 0,
    createdAt: '2026-09-03T09:15:00.000Z',
  },
  {
    id: 'prod-4',
    sku: 'CLO-001',
    name: 'เสื้อยืด',
    category: 'เสื้อผ้า',
    price: 299.0,
    stock: 5,
    createdAt: '2026-09-04T14:20:00.000Z',
  },
  {
    id: 'prod-5',
    sku: 'FOOD-002',
    name: 'ผัดไทยกุ้งสด',
    category: 'อาหาร',
    price: 85.0,
    stock: 8,
    createdAt: '2026-09-05T16:45:00.000Z',
  },
];
