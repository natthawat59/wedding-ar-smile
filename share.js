// Generate QR locally from this deployment, including /repository/ on GitHub Pages.
// No API call, API key, ChatGPT account or backend is required.
import QRCode from './assets/qrcode.js';

const siteUrl = new URL('./', window.location.href).href;
const image = document.querySelector('#siteQr');
const download = document.querySelector('#downloadQr');

async function prepareQr() {
  try {
    const dataUrl = await QRCode.toDataURL(siteUrl, {
      width: 600,
      margin: 4,
      errorCorrectionLevel: 'M',
      color: { dark: '#704e59', light: '#ffffff' },
    });
    image.src = dataUrl;
    image.hidden = false;
    download.href = dataUrl;
    download.download = 'wedding-ar-qr.png';
    download.hidden = false;
  } catch (error) {
    console.error('Could not create QR', error);
    document.querySelector('#qrHelp').textContent =
      'สร้าง QR ไม่สำเร็จ คัดลอกลิงก์เว็บนี้เพื่อเปิดบนมือถือแทน';
  }
}

prepareQr();
