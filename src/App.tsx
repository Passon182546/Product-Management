import { useState } from 'react';
import type { Product, NotificationMessage } from './types/product';
import { initialProducts } from './data/mockProducts';
import { ProductList } from './components/ProductList';
import { ProductForm } from './components/ProductForm';
import { NotificationToast } from './components/NotificationToast';
import { Store, Layers, PlusCircle, AlertOctagon } from 'lucide-react';
import './App.css';

export function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'add'>('all');

  // Helper to add notification
  const addNotification = (type: NotificationMessage['type'], message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setNotifications((prev) => [...prev, { id, type, message }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Challenge 4: ปุ่มขายสินค้า (Sell Button) logic
  const handleSellProduct = (productId: string) => {
    const targetProduct = products.find((p) => p.id === productId);

    if (!targetProduct) {
      addNotification('error', 'ไม่พบสินค้าในระบบ');
      return;
    }

    if (targetProduct.stock <= 0) {
      // Challenge 4: แสดง alert/notification เมื่อขายไม่สำเร็จ
      addNotification('error', `ขายไม่สำเร็จ! สินค้า "${targetProduct.name}" หมดแล้ว (Stock = 0)`);
      return;
    }

    // ตัดสต็อก 1 ชิ้น
    const updatedStock = targetProduct.stock - 1;
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: updatedStock } : p))
    );

    // Challenge 4: แสดง alert/notification เมื่อขายสำเร็จ
    addNotification(
      'success',
      `ขาย "${targetProduct.name}" สำเร็จ 1 ชิ้น! สต็อกคงเหลือ ${updatedStock} ชิ้น`
    );
  };

  // Challenge 5: เพิ่มสินค้าใหม่ logic
  const handleAddProduct = (newProductData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setProducts((prev) => [newProduct, ...prev]);

    // Challenge 5: เมื่อ submit สำเร็จ -> แสดง notification
    addNotification(
      'success',
      `เพิ่มสินค้าใหม่ "${newProduct.name}" (SKU: ${newProduct.sku}) เข้าสู่ระบบสำเร็จ!`
    );
  };

  const existingSkus = products.map((p) => p.sku);
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock < 10).length;

  return (
    <div className="app-container">
      {/* Toast Notification Container */}
      <NotificationToast notifications={notifications} onDismiss={handleDismissNotification} />

      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-logo">
              <Store size={26} />
            </div>
            <div>
              <h1 className="brand-title">FlowAccount Product Manager</h1>
              <p className="brand-subtitle">
                Fresh Graduate Coding Challenge - ระบบจัดการสินค้าสำหรับร้านค้า SME
              </p>
            </div>
          </div>

          <div className="tab-buttons">
            <button
              onClick={() => setActiveTab('all')}
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            >
              <Layers size={16} />
              <span>รายการสินค้า ({products.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
            >
              <PlusCircle size={16} />
              <span>+ เพิ่มสินค้าใหม่</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="app-content">
        {/* Banner Alert for Out of stock */}
        {outOfStockCount > 0 && (
          <div className="alert-banner alert-warning">
            <AlertOctagon size={18} />
            <span>
              มีสินค้า <strong>หมดสต็อก {outOfStockCount} รายการ</strong>{' '}
              {lowStockCount > 0 && `และสินค้าใกล้หมด (${lowStockCount} รายการ)`} กรุณาตรวจสอบและเติมสินค้า
            </span>
          </div>
        )}

        <div className="grid-layout">
          {/* Left / Main Section: Product List */}
          <div className={`grid-main ${activeTab === 'add' ? 'hide-mobile' : ''}`}>
            <ProductList products={products} onSellProduct={handleSellProduct} />
          </div>

          {/* Right Section: Add Product Form */}
          <div className={`grid-side ${activeTab === 'all' ? 'hide-mobile' : ''}`}>
            <ProductForm onAddProduct={handleAddProduct} existingSkus={existingSkus} />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>FlowAccount Engineering Workshop &copy; 2026 - Fresh Graduate Coding Challenge (React Track)</p>
      </footer>
    </div>
  );
}

export default App;
