import React, { useState, useEffect } from 'react';
import type { Category, Product } from '../types/product';
import { PlusCircle, AlertCircle } from 'lucide-react';

interface ProductFormProps {
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  existingSkus: string[];
}

interface FormErrors {
  name?: string;
  sku?: string;
  price?: string;
  stock?: string;
  category?: string;
}

const CATEGORIES: Category[] = ['อาหาร', 'เครื่องดื่ม', 'ของใช้', 'เสื้อผ้า'];

export const ProductForm: React.FC<ProductFormProps> = ({ onAddProduct, existingSkus }) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState<string>('');
  const [stock, setStock] = useState<string>('');
  const [category, setCategory] = useState<Category | ''>('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isValid, setIsValid] = useState(false);

  // Validate form
  const validate = () => {
    const newErrors: FormErrors = {};

    // Validate Name: อย่างน้อย 3 ตัว
    if (!name || name.trim().length < 3) {
      newErrors.name = 'ชื่อสินค้าต้องมีอย่างน้อย 3 ตัวอักษร';
    }

    // Validate SKU: ห้ามซ้ำ & ไม่ว่าง
    const trimmedSku = sku.trim();
    if (!trimmedSku) {
      newErrors.sku = 'กรุณากรอกรหัสสินค้า (SKU)';
    } else if (existingSkus.some((s) => s.toLowerCase() === trimmedSku.toLowerCase())) {
      newErrors.sku = 'รหัสสินค้า (SKU) นี้มีในระบบแล้ว';
    }

    // Validate Price: ราคา > 0
    const numPrice = parseFloat(price);
    if (price === '' || isNaN(numPrice)) {
      newErrors.price = 'กรุณากรอกราคาเป็นตัวเลข';
    } else if (numPrice <= 0) {
      newErrors.price = 'ราคาต้องมากกว่า 0 บาท';
    }

    // Validate Stock: สต็อก >= 0
    const numStock = parseInt(stock, 10);
    if (stock === '' || isNaN(numStock)) {
      newErrors.stock = 'กรุณากรอกจำนวนสต็อก';
    } else if (numStock < 0) {
      newErrors.stock = 'สต็อกต้องไม่ติดลบ (>= 0)';
    }

    // Validate Category: ต้องเลือกหมวดหมู่
    if (!category) {
      newErrors.category = 'กรุณาเลือกหมวดหมู่สินค้า';
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

  useEffect(() => {
    validate();
  }, [name, sku, price, stock, category, existingSkus]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !category) return;

    onAddProduct({
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      category: category as Category,
    });

    // Reset Form
    setName('');
    setSku('');
    setPrice('');
    setStock('');
    setCategory('');
    setTouched({});
  };

  return (
    <div className="card form-card">
      <div className="card-header">
        <PlusCircle size={20} className="header-icon" />
        <h2>เพิ่มสินค้าใหม่</h2>
      </div>

      <form onSubmit={handleSubmit} className="product-form" noValidate>
        {/* ชื่อสินค้า */}
        <div className="form-group">
          <label htmlFor="name">
            ชื่อสินค้า <span className="required">*</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="เช่น ข้าวผัดกุ้ง"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => handleBlur('name')}
            className={touched.name && errors.name ? 'input-error' : ''}
          />
          {touched.name && errors.name && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.name}</span>
            </div>
          )}
        </div>

        {/* SKU */}
        <div className="form-group">
          <label htmlFor="sku">
            รหัสสินค้า (SKU) <span className="required">*</span>
          </label>
          <input
            id="sku"
            type="text"
            placeholder="เช่น FOOD-003"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            onBlur={() => handleBlur('sku')}
            className={touched.sku && errors.sku ? 'input-error' : ''}
          />
          {touched.sku && errors.sku && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.sku}</span>
            </div>
          )}
        </div>

        {/* หมวดหมู่ */}
        <div className="form-group">
          <label htmlFor="category">
            หมวดหมู่ <span className="required">*</span>
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            onBlur={() => handleBlur('category')}
            className={touched.category && errors.category ? 'input-error' : ''}
          >
            <option value="">-- เลือกหมวดหมู่ --</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {touched.category && errors.category && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.category}</span>
            </div>
          )}
        </div>

        {/* ราคา & สต็อก */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">
              ราคา (บาท) <span className="required">*</span>
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              onBlur={() => handleBlur('price')}
              className={touched.price && errors.price ? 'input-error' : ''}
            />
            {touched.price && errors.price && (
              <div className="error-message">
                <AlertCircle size={14} />
                <span>{errors.price}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="stock">
              จำนวนคงเหลือ (สต็อก) <span className="required">*</span>
            </label>
            <input
              id="stock"
              type="number"
              placeholder="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              onBlur={() => handleBlur('stock')}
              className={touched.stock && errors.stock ? 'input-error' : ''}
            />
            {touched.stock && errors.stock && (
              <div className="error-message">
                <AlertCircle size={14} />
                <span>{errors.stock}</span>
              </div>
            )}
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={!isValid}
          className={`btn btn-primary btn-submit ${!isValid ? 'btn-disabled' : ''}`}
        >
          <PlusCircle size={18} />
          <span>เพิ่มสินค้า</span>
        </button>
      </form>
    </div>
  );
};
