// Shared sprite animation for the 2D preview and the image-tracked AR plane.
export const SHEET_URL = './assets/thai-couple-pink-v6.png';
export const FRAMES = 4;
export const SEQUENCE = [0, 1, 2, 3, 2, 1];
export function frameAt(seconds) { return SEQUENCE[Math.floor(Math.max(0, seconds) * 4) % SEQUENCE.length]; }
export function loadSheet() {
  return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('MASCOT_LOAD'));img.src=SHEET_URL;});
}
function heart(ctx,x,y,s,alpha){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.globalAlpha=alpha;ctx.fillStyle='#bc7891';ctx.beginPath();ctx.moveTo(0,.35);ctx.bezierCurveTo(-1,-.3,-.55,-1,0,-.45);ctx.bezierCurveTo(.55,-1,1,-.3,0,.35);ctx.fill();ctx.restore();}
export function drawMascot(canvas,img,time=0) {
  const ctx=canvas.getContext('2d');const w=canvas.width,h=canvas.height;
  ctx.clearRect(0,0,w,h);
  const sw=img.naturalWidth/FRAMES,sh=img.naturalHeight;
  const scale=Math.min(w*.88/sw,h*.87/sh);
  const dw=sw*scale,dh=sh*scale;const x=(w-dw)/2,y=h*.95-dh;
  const breath=1+Math.sin(time*2)*.003;
  ctx.save();ctx.translate(w/2,h*.95);ctx.scale(breath,breath);ctx.translate(-w/2,-h*.95);
  const frame=frameAt(time);ctx.drawImage(img,frame*sw,0,sw,sh,x,y,dw,dh);ctx.restore();
  for(let i=0;i<5;i++){const phase=(time*.19+i*.21)%1;const xx=w*(i%2?.84:.15)+Math.sin(time+i)*w*.025;const yy=h*(.65-phase*.5);heart(ctx,xx,yy,w*(.018+(i%2)*.009),Math.sin(phase*Math.PI)*.65);}
}
