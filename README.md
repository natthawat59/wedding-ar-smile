# Wedding AR — GitHub Pages

เว็บเปิดกล้อง ส่องการ์ดแต่งงานสีชมพู แล้วแสดงมาสคอตชุดไทย 2.5D โบกมือและหัวใจเคลื่อนไหว รุ่นใบหน้าเจ้าสาวล่าสุด

**พร้อมใช้เป็นเว็บ static ไม่ต้อง `npm install` หรือ build และไม่มีระบบล็อกอิน ChatGPT**

## Deploy ผ่าน GitHub Pages

1. สร้าง repository ชื่อ `wedding-ar` ใน GitHub
2. แตก ZIP แล้วอัปโหลด **ไฟล์ข้างในโฟลเดอร์** ให้ `index.html` อยู่ระดับบนสุดของ repository พร้อม `assets/` และ `.github/workflows/pages.yml` อย่าอัปโหลด ZIP ทั้งก้อน
3. เข้า repository → **Settings → Pages → Build and deployment → Source → GitHub Actions**
4. เปิดแท็บ **Actions → Deploy wedding AR to GitHub Pages → Run workflow → main** หากรอบแรกที่เกิดจาก push ล้มเหลวก่อนเปิด Pages ให้สั่ง Run workflow อีกครั้ง
5. รอ workflow สำเร็จ แล้วเปิด URL ที่ GitHub แสดง เช่น `https://YOUR_USERNAME.github.io/wedding-ar/`
6. เปิด URL นั้นบนคอมพิวเตอร์ แล้วดาวน์โหลด QR จากหน้าเว็บ **QR จะใช้ URL ของ GitHub Pages โดยอัตโนมัติ**
7. สแกน QR บนมือถือ เปิดด้วย Safari/Chrome → เปิดกล้องดู AR → อนุญาตกล้อง → ส่องการ์ดด้านหน้า

GitHub Free รองรับ Pages จาก public repository; หากใช้ public repo รูปบ่าวสาวและที่อยู่ในไฟล์จะถูกเผยแพร่พร้อมซอร์ส ดูแผนและเงื่อนไขของบัญชีคุณก่อนเลือก private repo

### Push ด้วย Git บน Mac

เปิด Terminal ในโฟลเดอร์ที่แตก ZIP แล้ว ใช้กับ repository ใหม่ที่ยังว่าง:

```bash
git init
git add .
git commit -m "Add wedding AR website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/wedding-ar.git
git push -u origin main
```

เปลี่ยน `YOUR_USERNAME` เป็นชื่อบัญชีของคุณ แล้วทำขั้น Settings → Pages ด้านบน หากหาโฟลเดอร์ `.github` ไม่เจอใน Finder กด `Command + Shift + .` เพื่อแสดงไฟล์ที่ซ่อน หรือใช้ `git add .` ตามคำสั่ง

## เปิดบนเครื่องเพื่อดูตัวอย่าง

```bash
python3 -m http.server 5173
```

เข้า `http://localhost:5173` บนคอมพิวเตอร์เครื่องเดียวกัน ไม่เปิด `index.html` ด้วย `file://`

บนมือถือให้ใช้ URL HTTPS ของ GitHub Pages; การเปิดด้วย `http://192.168...` ไม่ใช่ secure context และกล้องอาจไม่ทำงาน QR ที่สร้างตอนเปิด localhost จะชี้ localhost จึงต้องดาวน์โหลด QR หลัง deploy จริง

## ไฟล์หลัก

| ไฟล์ | หน้าที่ |
| --- | --- |
| `index.html` | หน้าเว็บ ปุ่มเปิดกล้อง ปุ่มปิดและดาวน์โหลดการ์ด |
| `app.js` | เปิด/ปิดกล้อง MindAR ตรวจจับภาพ วางระนาบมาสคอต และจัดการข้อผิดพลาด |
| `mascot.js` | เล่นสไปรต์โบกมือ 4 เฟรม พร้อมหัวใจเคลื่อนไหว |
| `share.js` | สร้าง QR ในเบราว์เซอร์จาก URL เว็บปัจจุบัน ไม่ส่ง URL ไปบริการ QR ภายนอก |
| `style.css` | หน้าตาเว็บและหน้ากล้อง |
| `assets/card-pink-v6.png` | การ์ดด้านหน้าที่ต้องส่อง |
| `assets/card-pink-v6.mind` | ไฟล์จดจำที่สร้างจากการ์ดด้านหน้านี้โดยตรง |
| `assets/thai-couple-pink-v6.png` | สไปรต์มาสคอตพื้นหลังโปร่งใส 4 เฟรมเรียงแนวนอน |
| `assets/card-pink-back.png` | การ์ดด้านหลัง ใช้แสดง/ดาวน์โหลด ไม่ใช่ภาพตรวจจับ |
| `assets/wedding-invitation.pdf` | การ์ดหน้า–หลังสำหรับดาวน์โหลด |
| `.github/workflows/pages.yml` | GitHub Actions สำหรับเผยแพร่อัตโนมัติเมื่อ push ไป `main` |

ไลบรารี AR, Three.js และ QR อยู่ใน `assets/` แล้ว ไม่ต้องโหลดไลบรารี JavaScript จาก CDN ส่วนฟอนต์หน้าตาเว็บโหลดจาก Google Fonts; หากโหลดฟอนต์ไม่ได้จะใช้ฟอนต์สำรอง

## จุดสำคัญในโค้ดเปิดกล้อง

ใน `app.js` ฟังก์ชัน `startAR()`:

```js
const ar = new MindARThree({
  container: document.querySelector('#arCamera'),
  imageTargetSrc: './assets/card-pink-v6.mind',
  uiLoading: 'no',
  uiScanning: 'no',
  uiError: 'no',
  maxTrack: 1,
});

const anchor = ar.addAnchor(0);
anchor.group.add(plane); // plane ใช้ CanvasTexture จากมาสคอต
await ar.start();        // ขอสิทธิ์และเปิดกล้อง
```

ตัวอย่างนี้อธิบายเฉพาะลำดับหลัก โค้ดที่รันได้ครบอยู่ใน `app.js` ซึ่งมีการ import ไลบรารี สร้าง `plane` เล่นเฟรม และปิดกล้องด้วย

เส้นทางไฟล์ใช้ `./assets/...` จึงรองรับ GitHub Pages แบบ `/ชื่อ-repository/` ไม่ต้องเปลี่ยน base URL

## เปลี่ยนการ์ดหรือมาสคอต

- เปลี่ยนดีไซน์/ข้อความ/ภาพการ์ด: ต้องสร้าง `.mind` ใหม่จาก **ภาพด้านหน้าที่จะพิมพ์จริง** แล้วเปลี่ยน `imageTargetSrc` ใน `app.js` ให้ตรงกัน การเปลี่ยน PNG อย่างเดียวไม่พอ
- เปลี่ยนมาสคอต: แก้ `SHEET_URL` ใน `mascot.js` และรักษาสไปรต์ 4 ช่องขนาดเท่ากัน หรือปรับ `FRAMES` และ `SEQUENCE`
- ปรับขนาดใน AR: แก้ `new THREE.PlaneGeometry(1.08, 1.26)` และ `plane.position.set(...)` ใน `app.js`
- แก้ข้อความหน้าเว็บ: แก้ `index.html`
- หลังเปลี่ยนไฟล์ให้ push ไป `main` เพื่อ deploy ใหม่ และใช้ชื่อไฟล์ใหม่หรือ query version เพื่อลดปัญหา cache

## ถ้ากล้องหรือ AR ไม่ขึ้น

- เปิดด้วย Safari บน iPhone หรือ Chrome บน Android โดยตรง หากอยู่ในเบราว์เซอร์ของแอปแชตให้เปิดลิงก์ภายนอก
- ตรวจว่า URL เป็น HTTPS และได้อนุญาตกล้อง
- ส่องการ์ดด้านหน้า `card-pink-v6.png` ให้เห็นทั้งใบ ไม่ส่องด้านหลังหรือแบบเก่า
- เปิดภาพบนจออีกเครื่องหรือพิมพ์จริง ใช้แสงเพียงพอ เลี่ยงแสงสะท้อนและขยับมือถือช้า ๆ
- หากพบ 404 ให้ตรวจว่า `assets/` อยู่ข้าง `index.html` และชื่อไฟล์ตัวพิมพ์ใหญ่/เล็กตรงกัน
- หน้าแอนิเมชันดูได้โดยไม่ใช้กล้อง; AR ต้องใช้ WebGL และกล้องที่เบราว์เซอร์รองรับ

## ขอบเขตการทดสอบ

ตรวจโค้ด JavaScript เส้นทางไฟล์ สไปรต์ QR และการเสิร์ฟใน subfolder แล้ว แต่ยังไม่ได้ทดสอบ image tracking ด้วยกล้องมือถือจริง หรือ deploy ผ่านบัญชี GitHub ของคุณ

## ไลบรารีและเอกสาร

- MindAR 1.2.5 — ดู `assets/MINDAR-LICENSE.txt`
- Three.js 0.160.1 — ดู `assets/THREE-LICENSE.txt`
- node-qrcode 1.5.4 (browser bundle) — ดู `assets/QRCODE-LICENSE.txt`
- GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

รุ่นนี้เป็นภาพ 2.5D เคลื่อนไหวบนระนาบที่ยึดกับการ์ด ยังไม่ใช่โมเดล 3D ที่หมุนดูรอบตัว
