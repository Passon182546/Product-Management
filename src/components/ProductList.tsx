import React, { useState } from 'react';
import type { Product, CategoryFilter } from '../types/product';
import { Filter, ShoppingCart, Tag, DollarSign, Package, PackageX, PackageCheck } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  onSellProduct: (productId: string) => void;
  onDeleteProduct?: (productId: string) => void;
}

const CATEGORY_OPTIONS: CategoryFilter[] = ['ทั้งหมด', 'อาหาร', 'เครื่องดื่ม', 'ของใช้', 'เสื้อผ้า'];

export const ProductList: React.FC<ProductListProps> = ({ products, onSellProduct }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('ทั้งหมด');

  // Challenge 2: method getFilteredProducts()
  const getFilteredProducts = (): Product[] => {
    if (selectedCategory === 'ทั้งหมด') {
      return products;
    }
    return products.filter((product) => product.category === selectedCategory);
  };

  const filteredProducts = getFilteredProducts();

  // Challenge 3: Calculate total value = sum of (price * stock)
  const totalValue = filteredProducts.reduce((sum, item) => sum + item.price * item.stock, 0);
  const totalStockCount = filteredProducts.reduce((sum, item) => sum + item.stock, 0);

  return (
    <div className="card product-list-card">
      <div className="card-header list-header-flex">
        <div className="header-title">
          <Package size={22} className="header-icon" />
          <h2>รายการสินค้า (Product List)</h2>
        </div>

        {/* Challenge 2: Dropdown/select สำหรับเลือกหมวดหมู่ */}
        <div className="filter-box">
          <label htmlFor="category-filter" className="filter-label">
            <Filter size={16} />
            <span>กรองตามหมวดหมู่:</span>
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as CategoryFilter)}
            className="select-filter"
          >
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Challenge 1: แสดงรายการสินค้าในรูปแบบตาราง */}
      <div className="table-responsive">
        <table className="product-table">
          <thead>
            <tr>
              <th>รหัสสินค้า (SKU)</th>
              <th>ชื่อสินค้า</th>
              <th>หมวดหมู่</th>
              <th>ราคา (บาท)</th>
              <th>สต็อก</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="no-data">
                  ไม่พบรายการสินค้าในหมวดหมู่นี้
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const isOutOfStock = product.stock === 0;
                const isLowStock = product.stock < 10;

                return (
                  <tr
                    key={product.id}
                    // CSS Requirement: แถวที่สินค้าหมด (stock = 0) ให้มีพื้นหลังสีแดงอ่อน
                    className={isOutOfStock ? 'row-out-of-stock' : ''}
                  >
                    <td className="sku-cell">{product.sku}</td>
                    <td className="name-cell font-medium">{product.name}</td>
                    <td>
                      <span className={`badge badge-${product.category}`}>{product.category}</span>
                    </td>
                    {/* CSS Requirement: ราคา (แสดงเป็นทศนิยม 2 ตำแหน่ง) */}
                    <td className="price-cell">฿{product.price.toFixed(2)}</td>
                    <td>
                      {/* CSS Requirement: แถวที่สินค้าใกล้หมด (stock < 10) ให้ตัวเลข stock เป็นสีแดงและตัวหนา */}
                      <span className={isLowStock ? 'stock-low-text' : 'stock-normal-text'}>
                        {product.stock} ชิ้น
                      </span>
                      {isOutOfStock && <span className="badge-out">หมด</span>}
                      {isLowStock && !isOutOfStock && <span className="badge-warn">ใกล้หมด</span>}
                    </td>
                    <td>
                      {/* Challenge 4: ปุ่มขายสินค้า (Sell Button) */}
                      <button
                        onClick={() => onSellProduct(product.id)}
                        disabled={isOutOfStock}
                        className={`btn btn-sell ${isOutOfStock ? 'btn-disabled' : ''}`}
                        title={isOutOfStock ? 'สินค้าหมด ไม่สามารถขายได้' : 'ขายสินค้า 1 ชิ้น'}
                      >
                        <ShoppingCart size={15} />
                        <span>ขาย</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Challenge 3: คำนวณมูลค่ารวมของสินค้า & สรุปข้อมูล */}
      <div className="table-summary-container">
        <div className="summary-card">
          <div className="summary-icon bg-blue">
            <Tag size={20} />
          </div>
          <div className="summary-info">
            <span className="summary-label">รายการสินค้าทั้งหมด (หมวดหมู่: {selectedCategory})</span>
            <span className="summary-value">{filteredProducts.length} รายการ</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon bg-amber">
            {totalStockCount < 10 ? <PackageX size={20} /> : <PackageCheck size={20} />}
          </div>
          <div className="summary-info">
            <span className="summary-label">จำนวนสินค้าคงเหลือรวม</span>
            <span className="summary-value">{totalStockCount.toLocaleString()} ชิ้น</span>
          </div>
        </div>

        <div className="summary-card summary-card-highlight">
          <div className="summary-icon bg-green">
            <DollarSign size={20} />
          </div>
          <div className="summary-info">
            <span className="summary-label">มูลค่ารวมของสินค้า (Total Value)</span>
            <span className="summary-value highlight-text">฿{totalValue.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
