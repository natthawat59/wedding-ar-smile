import {loadSheet,drawMascot,setPose} from './portrait-motion-v12.js';
const $=s=>document.querySelector(s);
let paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
let noticeTimer;
function notice(msg){clearTimeout(noticeTimer);$('#notice').textContent=msg;$('#notice').hidden=false;noticeTimer=setTimeout(()=>$('#notice').hidden=true,6000);}
const sheetPromise=loadSheet();
sheetPromise.catch(()=>{});
const previewCanvas=document.createElement('canvas');previewCanvas.width=720;previewCanvas.height=840;previewCanvas.setAttribute('role','img');previewCanvas.setAttribute('aria-label','มาสคอตคู่บ่าวสาวล่าสุด ถือพวงมาลัย โบกมือ ไหว้ และส่งหัวใจ');$('#model').appendChild(previewCanvas);
let clock=0,last=0,previewReady=false;
sheetPromise.then(img=>{previewReady=true;const draw=ms=>{const dt=last?Math.min((ms-last)/1000,.05):0;last=ms;if(!paused&&!document.hidden)clock+=dt;drawMascot(previewCanvas,img,clock);requestAnimationFrame(draw);};requestAnimationFrame(draw);}).catch(()=>{$('#model').innerHTML='<p class="asset-error">โหลดภาพตัวละครไม่สำเร็จ<br>โปรดลองรีเฟรชหน้าเว็บ</p>';});
function updateMotion(){const text=paused?'▷ เล่นภาพเคลื่อนไหว':'Ⅱ หยุดชั่วคราว';$('#motion').textContent=text;$('#motion').setAttribute('aria-label',paused?'เล่นภาพเคลื่อนไหว':'หยุดภาพเคลื่อนไหว');$('#motion').setAttribute('aria-pressed',String(paused));}
updateMotion();$('#motion').onclick=()=>{paused=!paused;updateMotion();};$('#preview').onclick=()=>{$('.stage').scrollIntoView({behavior:'smooth',block:'center'});if(!previewReady)notice('กำลังโหลดตัวละครชุดไทย…');};
let active=null,busy=false,generation=0;
function disposeAR(ar){if(!ar)return;try{ar.renderer?.setAnimationLoop(null);ar.controller?.stopProcessVideo();ar.video?.srcObject?.getTracks().forEach(t=>t.stop());}catch{}ar.video?.remove();ar.renderer?.dispose();ar.renderer?.domElement.remove();ar.cssRenderer?.domElement.remove();ar.scene?.traverse(o=>{o.geometry?.dispose();for(const m of o.material?(Array.isArray(o.material)?o.material:[o.material]):[]){m.map?.dispose();m.dispose();}});}
function close(){generation++;disposeAR(active);active=null;$('#arCamera').replaceChildren();$('#arView').hidden=true;document.body.style.overflow='';document.querySelector('main').inert=false;document.querySelector('header').inert=false;busy=false;$('#start').focus();}
async function startAR(){if(busy)return;busy=true;const current=++generation;$('#arView').hidden=false;document.body.style.overflow='hidden';document.querySelector('main').inert=true;document.querySelector('header').inert=true;$('#closeAR').focus();$('#status').textContent='กำลังเตรียมตัวละครและกล้อง…';$('#retry').hidden=true;$('#scanFrame').hidden=false;let ar;
try{
 if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia)throw new Error('SECURE');
 const [{MindARThree},THREE,img]=await Promise.all([import('./assets/mindar-image-three.prod.js'),import('three'),sheetPromise]);
 if(current!==generation)return;
 ar=new MindARThree({container:$('#arCamera'),imageTargetSrc:'./assets/card-user-front-v14.mind',uiLoading:'no',uiScanning:'no',uiError:'no',maxTrack:1,filterMinCF:.001,filterBeta:10});active=ar;
 ar.renderer.setPixelRatio(Math.min(devicePixelRatio,2));
 const anchor=ar.addAnchor(0);const textureCanvas=document.createElement('canvas');textureCanvas.width=720;textureCanvas.height=840;drawMascot(textureCanvas,img,0);
 const texture=new THREE.CanvasTexture(textureCanvas);texture.colorSpace=THREE.SRGBColorSpace;
 const material=new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,side:THREE.DoubleSide,toneMapped:false});
 const plane=new THREE.Mesh(new THREE.PlaneGeometry(.48,.56),material);plane.position.set(.25,-.38,.12);anchor.group.add(plane);
 anchor.onTargetFound=()=>{$('#status').textContent='เจอกันแล้ว ♡ มาสคอตใบหน้าจากการ์ดล่าสุด';$('#scanFrame').hidden=true;};
 anchor.onTargetLost=()=>{$('#status').textContent='ส่องการ์ดชมพูด้านหน้าให้เห็นทั้งใบอีกครั้ง';$('#scanFrame').hidden=false;};
 $('#status').textContent='กรุณาอนุญาตกล้อง แล้วรอสักครู่';await ar.start();
 if(current!==generation){disposeAR(ar);return;}
 $('#status').textContent='พร้อมแล้ว · ส่องการ์ดชมพูด้านหน้าใบใหม่';let arClock=0,previous=0,previousDraw=-1;
 ar.renderer.setAnimationLoop(ms=>{const dt=previous?Math.min((ms-previous)/1000,.05):0;previous=ms;if(!paused)arClock+=dt;if(ms-previousDraw>65){drawMascot(textureCanvas,img,arClock);texture.needsUpdate=true;previousDraw=ms;}ar.renderer.render(ar.scene,ar.camera);});
}catch(e){console.error('AR startup failed',e);disposeAR(ar);if(active===ar)active=null;if(current!==generation)return;$('#scanFrame').hidden=true;
 $('#status').textContent=e.name==='NotAllowedError'?'ยังไม่ได้อนุญาตกล้อง เปิดสิทธิ์กล้องแล้วลองใหม่':e.name==='NotFoundError'?'ไม่พบกล้อง ลองเปิดเว็บนี้บนมือถือ':e.message==='SECURE'?'โปรดเปิดลิงก์ HTTPS ด้วย Safari หรือ Chrome':e.message==='MASCOT_LOAD'?'โหลดภาพตัวละครไม่สำเร็จ ตรวจอินเทอร์เน็ตแล้วรีเฟรชหน้าเว็บ':/WebGL|context/i.test(e.message)?'เบราว์เซอร์นี้เปิด AR ไม่ได้ ลอง Safari หรือ Chrome บนมือถือ หรือดูภาพเคลื่อนไหวในหน้าเว็บ':'เปิด AR ไม่สำเร็จ ตรวจอินเทอร์เน็ตและสิทธิ์กล้อง แล้วลอง Safari หรือ Chrome';$('#retry').hidden=false;
}finally{if(current===generation)busy=false;}}
$('#start').onclick=startAR;$('#closeAR').onclick=close;$('#retry').onclick=startAR;document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#arView').hidden)close();});window.addEventListener('pagehide',()=>{generation++;disposeAR(active);active=null;});

// Pose selection is shared by the preview and live AR texture.
document.querySelectorAll("[data-pose]").forEach(button=>button.addEventListener("click",()=>{
 const value=button.dataset.pose;setPose(value==="auto"?null:Number(value));
 document.querySelectorAll("[data-pose]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.pose===value)));
}));
