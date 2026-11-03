// Use each intact gesture portrait; no separate face patches or face masks.
export const SHEET_URL='./assets/couple-gestures-v12.png';
export const POSE_SECONDS=4;
let selectedPose=null;
export function setPose(value){selectedPose=Number.isInteger(value)&&value>=0&&value<4?value:null;}
export function poseAt(time){return selectedPose??Math.floor(Math.max(0,time)/POSE_SECONDS)%4;}
function makeCanvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
export function prepareMascot(sheet,identity,create=makeCanvas){
 const w=sheet.naturalWidth/4,h=sheet.naturalHeight;
 const poses=Array.from({length:4},(_,i)=>{const c=create(w,h),ctx=c.getContext('2d');ctx.drawImage(sheet,i*w,0,w,h,0,0,w,h);
  return c;
 });return {poses,width:w,height:h};
}
function loadImage(url){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(new Error('MASCOT_LOAD'));i.src=url;});}
export async function loadSheet(){const sheet=await loadImage(SHEET_URL);return prepareMascot(sheet,null);}
function wave(ctx,pose,time,w,h){
 // Continuous strips keep the wrists connected and the portrait area fixed.
 for(let y=0;y<h;y+=3){const band=Math.min(3,h-y),phase=Math.max(0,Math.min(1,(y-210)/210)),weight=y>=210&&y<=420?Math.sin(phase*Math.PI)**2:0,dx=Math.sin(time*5)*9*weight;
  ctx.drawImage(pose,0,y,150,band,dx,y,150,band);
  ctx.drawImage(pose,410,y,w-410,band,410-dx,y,w-410,band);
 }
 ctx.drawImage(pose,140,0,280,h,140,0,280,h);
}
function heart(ctx,x,y,s,alpha){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.globalAlpha=alpha;ctx.fillStyle='#c77d9a';ctx.beginPath();ctx.moveTo(0,.35);ctx.bezierCurveTo(-1,-.3,-.55,-1,0,-.45);ctx.bezierCurveTo(.55,-1,1,-.3,0,.35);ctx.fill();ctx.restore();}
export function drawMascot(canvas,model,time=0){
 const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height,pose=poseAt(time),img=model.poses[pose],sw=model.width,sh=model.height;
 ctx.clearRect(0,0,w,h);const scale=Math.min(w*.88/sw,h*.87/sh),dw=sw*scale,dh=sh*scale,x=(w-dw)/2,y=h*.95-dh;
 ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.translate(sw/2,sh);ctx.rotate(Math.sin(time*1.4)*(pose===3?.012:.003));const breath=1+Math.sin(time*2)*.003;ctx.scale(breath,breath);ctx.translate(-sw/2,-sh);
 if(pose===1)wave(ctx,img,time,sw,sh);
 else if(pose===2){const nod=(1-Math.cos(time*2))/2;ctx.drawImage(img,0,300,sw,sh-300,0,300,sw,sh-300);ctx.save();ctx.translate(0,300);ctx.scale(1,1-nod*.085);ctx.translate(0,-300);ctx.drawImage(img,0,0,sw,300,0,0,sw,300);ctx.restore();}
 else ctx.drawImage(img,0,0);
 ctx.restore();
 for(let i=0;i<(pose===3?9:4);i++){const phase=(time*.23+i*.17)%1;heart(ctx,w*(i%2?.83:.16)+Math.sin(time+i)*w*.025,h*(.69-phase*.52),w*(.018+(i%2)*.009),Math.sin(phase*Math.PI)*.65);}
}
