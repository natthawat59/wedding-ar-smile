# Wedding mild — ฉบับการ์ด Canva ของผู้ใช้

เว็บการ์ดแต่งงาน ณัฐณิชา (มายด์) & ณัฐดนัย (โอ๊ต) วันที่ 18 มกราคม 2570

## Deploy GitHub Pages
1. นำไฟล์ภายในโฟลเดอร์นี้ทั้งหมดขึ้น root ของ repository (รวม .github และ .nojekyll)
2. ใช้ branch main แล้ว commit/push
3. Settings > Pages > Source เลือก GitHub Actions
4. รอ workflow Deploy wedding AR to GitHub Pages สำเร็จ
5. เปิด URL Pages บนมือถือผ่าน Safari หรือ Chrome แล้วอนุญาตกล้อง

ไม่มี backend, API key หรือระบบล็อกอินในซอร์สนี้
ทดสอบเครื่องตัวเองด้วย python3 -m http.server 8000 แล้วเปิด http://localhost:8000 บนเครื่องเดียวกัน
การเปิดกล้องจากมือถือที่เข้า IP ในเครือข่ายต้องใช้ HTTPS

## สิ่งที่อัปเดต
- ภาพการ์ดหน้า–หลังตรงกับฉบับที่ผู้ใช้แก้ใน Canva
- การ์ดหน้าใช้ assets/card-user-front-v14.png พร้อมไฟล์จดจำ card-user-front-v14.mind
- 08:09 พิธีสงฆ์ / 09:09 พิธีขันหมาก / 12:00 รับประทานอาหารร่วมกัน
- แผนที่จาก QR บนการ์ด: https://maps.app.goo.gl/aiRHxSQhMGvvc5gj6
- พิกัดร้านธนาภิวัฒน์โซล่าเซลล์ 17.5769752, 103.7363624
- ปุ่มกระจกโค้งมน และมาสคอต 4 ท่าที่แก้รอยใบหน้าซ้อนแล้ว

## ไฟล์หลัก
index.html / style.css / design.js / app-clean-v13.js / mascot-clean-v13.js / share.js
assets/ เก็บการ์ด ภาพมาสคอต และไลบรารี Three.js, MindAR, QRCode พร้อมไฟล์ license

การ์ดในชุดนี้เป็นภาพจากมุมมอง Canva สำหรับแสดงบนเว็บ; ไฟล์ PDF เป็นสำเนาภาพสองหน้า ไม่ใช่ไฟล์ข้อความแก้ไขได้หรือไฟล์เตรียมพิมพ์
ต้นฉบับ Canva: https://canva.link/hdb5cfie6az86y6
เปลี่ยนหน้าการ์ดอีกครั้งต้อง compile ไฟล์ .mind ใหม่ด้วย
มาสคอตเป็นภาพ 2.5D เคลื่อนไหวแบบ canvas ไม่ใช่โมเดล 3D ที่หมุนดูได้รอบตัว
ตรวจการแสดงเว็บ สลับภาพ และแผนที่แล้ว ยังไม่ได้ทดสอบ image tracking ผ่านกล้องมือถือจริง
หากเผยแพร่ repository แบบ public รูปและที่อยู่ที่อยู่ในซอร์สจะเป็นข้อมูลสาธารณะ
