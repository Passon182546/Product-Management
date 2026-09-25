# 📘 คู่มืออธิบายการทำงานของระบบจัดการสินค้า (Product Management)
**FlowAccount Engineering Workshop - Fresh Graduate Coding Challenge (React Track)**

เอกสารฉบับนี้จัดทำขึ้นเพื่อใช้อธิบายโครงสร้าง หลักการทำงาน และการตัดสินใจในการออกแบบระบบ (Architectural Decisions) ของแอปพลิเคชันจัดการสินค้าที่ได้รับการพัฒนาด้วย **React**, **TypeScript**, และ **CSS** โดยแบ่งตามแต่ละโจทย์ (Challenge 1 - 5) อย่างครบถ้วน

---

## 📌 1. ภาพรวมสถาปัตยกรรมระบบ (System Architecture Overview)

ระบบถูกออกแบบให้เป็น **Single Page Application (SPA)** โดยใช้หลักการ **Component-Driven Development** เพื่อแยกหน้าที่ความรับผิดชอบ (Separation of Concerns) ออกเป็นส่วนๆ อย่างชัดเจน:

```
src/
├── types/product.ts            # (1) Data Layer: กำหนด Interface และ Data Types
├── data/mockProducts.ts       # (2) Initial State: ข้อมูลทดสอบเริ่มต้น 5 รายการ
├── components/
│   ├── ProductList.tsx         # (3) View Layer (Part 1 & 4): ตารางสินค้า, Filter, คำนวณสรุป, ปุ่มขาย
│   ├── ProductForm.tsx         # (4) Interactive Layer (Part 2): ฟอร์มเพิ่มสินค้า + Validation
│   └── NotificationToast.tsx   # (5) Feedback Layer: ระบบการแจ้งเตือน (Toast Notification)
└── App.tsx                     # (6) Controller Layer: ศูนย์กลางจัดการ State และ Business Logic
```

---

## 🔍 2. รายละเอียดการทำงานแยกตามโจทย์ (Challenges Deep Dive)

### 🟢 Part 1: Product List Component

---

### **Challenge 1: แสดงรายการสินค้าในรูปแบบตาราง (Product Table)**
* **เป้าหมาย:** สร้างโครงสร้างข้อมูลและแสดงผลตารางสินค้าตามเงื่อนไข CSS ที่กำหนด

#### **หลักการทำงาน:**
1. **การสร้าง Interface (`types/product.ts`):**
   กำหนดชนิดข้อมูล `Product` ที่รัดกุมด้วย TypeScript เพื่อป้องกันข้อผิดพลาดเรื่อง Data Type:
   ```typescript
   export interface Product {
     id: string;
     name: string;
     sku: string;
     price: number;
     stock: number;
     category: 'อาหาร' | 'เครื่องดื่ม' | 'ของใช้' | 'เสื้อผ้า';
     createdAt: string;
   }
   ```
2. **การวนลูปแสดงผล (Rendering):**
   ใน `ProductList.tsx` จะรับ props `products` เข้ามา แล้วนำไปวนลูป Render แถวของตารางด้วยฟังก์ชัน `.map()`

3. **เงื่อนไขทาง CSS (CSS Requirements):**
   * **Border ตาราง:** กำหนด `border-collapse: collapse;` และ `border: 1px solid #cbd5e1;` ใน `App.css`
   * **Header สีเขียว:** กำหนดสีพื้นหลัง `<th>` เป็นสีเขียว FlowAccount (`#00a651`)
   * **สินค้าหมดสต็อก (`stock = 0`):** ตรวจสอบค่า `product.stock === 0` หากเป็นจริง จะใส่คลาส `.row-out-of-stock` เพื่อเปลี่ยนสีพื้นหลังแถวนั้นเป็นสีแดงอ่อน (`#fee2e2`)
   * **สินค้าใกล้หมด (`stock < 10`):** ตรวจสอบค่า `product.stock < 10` หากเป็นจริง จะใส่คลาส `.stock-low-text` ในช่องสต็อก เพื่อเปลี่ยนตัวเลขเป็น **สีแดงและตัวหนา** (`color: #dc2626; font-weight: bold;`)

---

### **Challenge 2: Filter สินค้าตามหมวดหมู่ (Category Filter)**
* **เป้าหมาย:** กรองสินค้าตามหมวดหมู่แบบ Real-time ด้วยเมธอด `getFilteredProducts()`

#### **หลักการทำงาน:**
1. **การเก็บ State การกรอง:**
   ใช้ State `selectedCategory` เก็บหมวดหมู่ที่ผู้ใช้เลือก (ค่าเริ่มต้นคือ `'ทั้งหมด'`)
2. **การทำงานของฟังก์ชัน `getFilteredProducts()`:**
   ```typescript
   const getFilteredProducts = (): Product[] => {
     if (selectedCategory === 'ทั้งหมด') {
       return products; // คืนค่าสินค้าทั้งหมด
     }
     return products.filter((product) => product.category === selectedCategory); // คืนค่าเฉพาะสินค้าที่หมวดหมู่ตรงกัน
   };
   ```
3. **การอัปเดตแบบ Real-time:**
   เมื่อผู้ใช้เลือกหมวดหมู่ใน `<select>` เกิดเหตุการณ์ `onChange` -> ทำการเรียก `setSelectedCategory(newValue)` -> ตัวแปร State เปลี่ยน -> React ทำการ Re-render และเรียก `getFilteredProducts()` เพื่อนำเฉพาะสินค้าที่ตรงเงื่อนไขมาแสดงบนตารางทันที

---

### **Challenge 3: คำนวณมูลค่ารวมของสินค้า (Total Value Calculation)**
* **เป้าหมาย:** สรุปจำนวนสินค้าและคำนวณมูลค่ารวม `Total Value = sum of (price × stock)`

#### **หลักการทำงาน:**
1. **การคำนวณราคารวม:**
   ใช้อาร์เรย์เมธอด `.reduce()` จากรายการสินค้าที่ผ่านการ Filter แล้ว (`filteredProducts`) เพื่อหาผลรวมมูลค่า:
   ```typescript
   const totalValue = filteredProducts.reduce(
     (sum, item) => sum + item.price * item.stock, 
     0
   );
   ```
2. **การแสดงผลส่วนสรุป (Summary Box):**
   แสดงผลสรุป 3 การ์ดด้านล่างตาราง:
   * **รายการสินค้าทั้งหมด:** แสดงจำนวนชนิดสินค้าตาม Filter (`filteredProducts.length`)
   * **จำนวนสินค้าคงเหลือรวม:** แสดงจำนวนชิ้นสต็อกรวม (`sum of stock`)
   * **มูลค่ารวมของสินค้า (Total Value):** แสดงมูลค่าเงินบาท รวมทศนิยม 2 ตำแหน่ง (`฿totalValue.toFixed(2)`)

---

### 🔴 Part 2: Interactive Features

---

### **Challenge 4: ปุ่มขายสินค้า (Sell Button)**
* **เป้าหมาย:** กดปุ่ม "ขาย" ในแต่ละแถว เพื่อตัดสต็อก 1 ชิ้น พร้อมแสดงการแจ้งเตือน และจัดการสถานะ Disabled

#### **หลักการทำงาน:**
1. **ปุ่มในแต่ละแถว (`ProductList.tsx`):**
   ในคอลัมน์การจัดการ เพิ่มปุ่ม `<button>` ขายสินค้า เมื่อถูกคลิกจะเรียกฟังก์ชัน `onSellProduct(product.id)`
2. **เงื่อนไข Disabled ปุ่ม:**
   ตรวจสอบถ้า `product.stock === 0` จะใส่ Property `disabled={true}` และใส่คลาส `.btn-disabled` เพื่อเปลี่ยนสีปุ่มเป็นสีเทา ไม่สามารถกดได้
3. **Logic การตัดสต็อก (`App.tsx`):**
   ```typescript
   const handleSellProduct = (productId: string) => {
     const targetProduct = products.find((p) => p.id === productId);
     if (!targetProduct || targetProduct.stock <= 0) {
       addNotification('error', `ขายไม่สำเร็จ! สินค้าหมดแล้ว`);
       return;
     }

     // ตัดสต็อกลง 1 ชิ้นแบบ Immutable
     setProducts((prev) =>
       prev.map((p) => (p.id === productId ? { ...p, stock: p.stock - 1 } : p))
     );

     // แสดง Notification แจ้งเตือนสำเร็จ
     addNotification('success', `ขาย "${targetProduct.name}" สำเร็จ 1 ชิ้น! สต็อกคงเหลือ ${targetProduct.stock - 1} ชิ้น`);
   };
   ```

---

### **Challenge 5: เพิ่มสินค้าใหม่ (Form & Validation)**
* **เป้าหมาย:** สร้าง Form สำหรับเพิ่มสินค้า มีการตรวจสอบความถูกต้องของข้อมูล (Validation) แสดง Error message และล้างฟอร์มเมื่อสำเร็จ

#### **หลักการทำงาน (`ProductForm.tsx`):**
1. **การจัดการ Form State:**
   แยก State สำหรับเก็บค่าอินพุต (`name`, `sku`, `price`, `stock`, `category`), State สำหรับข้อผิดพลาด (`errors`), และ State สำหรับการแตะช่องอินพุต (`touched`)

2. **กฎการตรวจสอบความถูกต้อง (Validation Rules):**
   ฟังก์ชัน `validate()` จะทำงานทุกครั้งที่มีการพิมพ์หรือเปลี่ยนค่า:
   * **ชื่อสินค้า:** ต้องไม่ว่าง และมีความยาวอย่างน้อย 3 ตัวอักษร (`name.trim().length >= 3`)
   * **รหัสสินค้า (SKU):** ต้องไม่ว่าง และต้อง **ไม่ซ้ำ** กับ SKU ที่มีในระบบ (`!existingSkus.includes(sku)`)
   * **ราคา (Price):** ต้องเป็นตัวเลข และมีค่ามากกว่า 0 (`price > 0`)
   * **สต็อก (Stock):** ต้องเป็นตัวเลข และมีค่ามากกว่าหรือเท่ากับ 0 (`stock >= 0`)
   * **หมวดหมู่ (Category):** ต้องเลือกหมวดหมู่ใดหมวดหมู่หนึ่ง

3. **การแสดง Error Messages:**
   เมื่อฟีลด์ใดไม่ผ่าน Validation และถูกแตะแล้ว (`touched[field] && errors[field]`) จะแสดงกล่องข้อความสีแดงพร้อมไอคอนเตือนใต้ช่องอินพุตนั้น และขอบกล่องอินพุตจะเปลี่ยนเป็นสีแดง (`.input-error`)

4. **การเปิด/ปิด ปุ่มเพิ่มสินค้า (Disabled State):**
   ปุ่ม "เพิ่มสินค้า" จะถูกใส่ `disabled={!isValid}` โดยค่า `isValid` จะเป็น `true` ต่อเมื่อไม่มี Error ในฟอร์มเลย (`Object.keys(errors).length === 0`)

5. **การ Submit และ Reset Form:**
   เมื่อผู้ใช้กดกดปุ่ม Submit:
   * ส่งข้อมูลสินค้าใหม่ไปเพิ่มในอาร์เรย์ `products` ที่ `App.tsx`
   * แสดง Toast Notification สีเขียวแจ้งเตือน "เพิ่มสินค้าสำเร็จ!"
   * ล้างค่าอินพุตในฟอร์มกลับเป็นค่าว่างทันที (Clear Form)

---

## 🗣️ สรุปเทคนิคนำเสนอ (Presentation Talking Points)

หากต้องนำเสนอต่อหน้ากรรมการหรือทีมงาน สามารถสรุป 3 จุดเด่นหลักได้ดังนี้:

1. **State Management & Immutability:** 
   ใช้ React State แบบ Immutable ป้องกันการแก้ไข State โดยตรง ทำให้ระบบมีความเสถียร ตารางอัปเดตแบบ Real-time และ Re-render เฉพาะส่วนที่จำเป็น
2. **User Experience (UX) & Form Validation:** 
   ระบบ Validation ของฟอร์มทำงานแบบ Real-time ให้ Feedback ทันทีเมื่อกรอกผิด พร้อมระบบป้องกัน SKU ซ้ำ และปุ่ม Submit จะถูกกดได้เมื่อข้อมูลถูกต้อง 100% เท่านั้น
3. **Design & Code Standards:** 
   เขียนด้วย **TypeScript** เพื่อให้ประเภทข้อมูลปลอดภัย (Type safety), ตกแต่ง UI ด้วย CSS ตรงตาม Requirement ของโจทย์ (สีเขียว FlowAccount, พื้นหลังแดงสินค้าหมด, ตัวหนาสีแดงสินค้าใกล้หมด)
