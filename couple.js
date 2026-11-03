import * as THREE from 'three';
// All visible parts are volumetric geometry. No portrait planes or sprite sheets.
export function makeCouple({detail=24}={}) {
  const root=new THREE.Group();root.name='Thai_Wedding_Couple';
  const mat=(color,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness:metalness?.34:.72,metalness});
  const skin=mat('#e9b793'),blush=mat('#d88d82'),hair=mat('#241b18'),black=mat('#251e1a'),white=mat('#fffaf0'),ivory=mat('#f1dfb8'),gold=mat('#c79335',.65),silk=mat('#d8ad68',.18),darkGold=mat('#9c702c',.3),shoe=mat('#594033');
  const ball=new THREE.SphereGeometry(1,detail,Math.max(8,detail/2));
  const add=(g,geo,m,pos,scale)=>{const o=new THREE.Mesh(geo,m);o.position.set(...pos);if(scale)o.scale.set(...scale);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;};
  const ell=(g,x,y,z,sx,sy,sz,m)=>add(g,ball,m,[x,y,z],[sx,sy,sz]);
  const cyl=(g,x,y,z,rt,rb,h,m)=>add(g,new THREE.CylinderGeometry(rt,rb,h,detail),m,[x,y,z]);
  const line=(g,points,r,m)=>add(g,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),Math.max(8,detail),r,6,false),m,[0,0,0]);
  const band=(g,x,y,z,r,t,m)=>{const o=add(g,new THREE.TorusGeometry(r,t,6,detail),m,[x,y,z]);return o;};
  function person(bride){
    const g=new THREE.Group();g.name=bride?'Bride':'Groom';root.add(g);g.position.x=bride?.39:-.39;
    const head=new THREE.Group();head.name=bride?'Bride_Head':'Groom_Head';head.position.y=bride?1.55:1.65;g.add(head);
    const sx=bride?.255:.31,sy=bride?.325:.33;
    ell(head,0,0,0,sx,sy,.265,skin);
    add(head,new THREE.SphereGeometry(1,detail,Math.max(8,detail/2),0,Math.PI*2,0,Math.PI/2),hair,[0,.075,-.04],[sx*1.05,.285,.25]);
    for(const side of [-1,1]){
      ell(head,side*sx,-.015,0,.045,.07,.04,skin);
      ell(head,side*.10,-.015,.242,.033,.044,.018,white);
      ell(head,side*.10,-.014,.258,.021,.029,.009,black);
      ell(head,side*.093,-.003,.266,.007,.009,.004,white);
      line(head,[[side*.055,.064,.244],[side*.10,.078,.25],[side*.145,.064,.239]],.012,hair);
      ell(head,side*.175,-.09,.215,.042,.021,.01,blush);
    }
    ell(head,0,-.065,.269,.04,.038,.04,skin);
    if(bride){
      ell(head,0,-.14,.24,.105,.055,.024,black);ell(head,0,-.125,.26,.084,.022,.008,white);
      // Long side-parted hair, including the back, visible from every angle.
      ell(g,0,1.26,-.17,.29,.48,.12,hair);
      for(const s of [-1,1]){ell(head,s*.235,-.12,-.025,.055,.30,.09,hair);}
      for(let i=0;i<5;i++){const x=-.205+i*.07;ell(head,x,.19+(i*.025),.12,.09,.075,.12,hair);}
      // Gold flower hair ornament and dangling earrings.
      for(let i=0;i<5;i++){const a=i*Math.PI*2/5;ell(head,.26+Math.cos(a)*.033,.15+Math.sin(a)*.033,.02,.028,.026,.018,ivory);}ell(head,.26,.15,.045,.018,.018,.015,gold);
      for(const s of [-1,1]){ell(head,s*.267,-.09,.035,.019,.019,.018,gold);ell(head,s*.27,-.145,.04,.023,.036,.02,gold);}
      ell(g,0,1.05,0,.205,.29,.145,skin);
      cyl(g,0,.46,0,.165,.245,.86,silk);
      // Woven skirt ribs and gold embroidery rings.
      for(let i=0;i<14;i++){const a=i*Math.PI*2/14;line(g,[[Math.cos(a)*.167,.86,Math.sin(a)*.167],[Math.cos(a)*.20,.43,Math.sin(a)*.20],[Math.cos(a)*.245,.03,Math.sin(a)*.245]],.0055,darkGold);}
      for(const y of [.07,.12,.74,.80]){const r=.245-(y-.03)/.83*.08;const b=band(g,0,y,0,r,.007,gold);b.rotation.x=Math.PI/2;}
      // Diagonal sabai front/back wraps over the left shoulder.
      const sabai=ell(g,.012,1.06,.125,.205,.115,.035,silk);sabai.rotation.z=.58;
      const back=ell(g,.015,1.06,-.137,.21,.13,.035,silk);back.rotation.z=.58;
      line(g,[[-.17,.95,.16],[0,1.07,.17],[.19,1.22,.10]],.013,gold);
      const drape=ell(g,.225,.76,-.125,.075,.49,.035,silk);drape.rotation.z=-.08;
      line(g,[[.285,1.20,-.10],[.30,.7,-.13],[.28,.28,-.13]],.011,gold);
      cyl(g,0,.855,0,.184,.184,.045,gold);ell(g,0,.855,.188,.045,.034,.012,gold);
      line(g,[[-.13,1.285,.075],[0,1.18,.17],[.13,1.285,.075]],.009,gold);ell(g,0,1.18,.18,.025,.038,.012,gold);
      for(const x of [-.11,.11])ell(g,x,.025,.05,.066,.035,.115,gold);
    } else {
      for(let i=0;i<8;i++){const x=-.24+i*.068;ell(head,x,.22+Math.sin(i*.5)*.035,.105,.073,.085,.12,hair);}
      line(head,[[-.068,-.14,.25],[0,-.155,.265],[.068,-.14,.25]],.009,black);
      ell(g,0,1.02,0,.26,.32,.18,ivory);cyl(g,0,1.28,0,.09,.10,.09,ivory);
      for(const x of [-.13,.13]){
        ell(g,x,.57,0,.135,.26,.15,silk);cyl(g,x,.31,0,.065,.055,.27,white);ell(g,x,.11,.05,.09,.065,.15,shoe);
        // Fold of chong kraben.
        line(g,[[x,.76,.14],[x*.65,.53,.145],[x,.38,.10]],.009,darkGold);
      }
      for(let i=0;i<5;i++)ell(g,0,1.21-i*.105,.183,.017,.017,.012,gold);
      line(g,[[.07,1.24,.16],[.16,1.13,.18],[.20,1.20,.11]],.012,gold);
      ell(g,.14,1.15,.19,.026,.026,.012,gold);
      cyl(g,0,.77,0,.228,.228,.035,gold);
    }
    // Raised outer arm: a real shoulder/elbow hierarchy for animation.
    const s=bride?1:-1;
    const arm=new THREE.Group();arm.name=bride?'Bride_Wave':'Groom_Wave';arm.position.set(s*(bride?.205:.25),1.15,0);arm.rotation.z=-s*.55;g.add(arm);
    ell(arm,0,.115,0,.058,.145,.064,bride?skin:ivory);
    const elbow=new THREE.Group();elbow.position.y=.23;elbow.rotation.x=.25;arm.add(elbow);
    ell(elbow,0,.095,0,.048,.12,.052,bride?skin:ivory);ell(elbow,0,.235,.01,.057,.075,.032,skin);
    // Thumb and four fingers remain separated in silhouette.
    ell(elbow,-s*.055,.22,.01,.025,.035,.023,skin);
    for(let i=0;i<4;i++)ell(elbow,-.038+i*.025,.304+Math.sin(i*.9)*.009,.012,.012,.046,.013,skin);
    if(bride){const b=band(elbow,0,.16,0,.052,.008,gold);b.rotation.x=Math.PI/2;}
    const inner=new THREE.Group();inner.position.set(-s*(bride?.21:.25),1.12,0);inner.rotation.z=-s*.13;g.add(inner);
    ell(inner,0,-.17,0,.059,.205,.062,bride?skin:ivory);ell(inner,0,-.365,.01,.053,.065,.035,skin);
    g.userData={head,arm,s};return g;
  }
  const groom=person(false),bride=person(true);
  cyl(root,0,-.045,0,.93,.95,.09,ivory);cyl(root,0,-.09,0,.95,.95,.015,gold);
  root.userData.tick=t=>{for(const c of [groom,bride]){c.userData.arm.rotation.z=-c.userData.s*.55+Math.sin(t*3.2)*.20;c.userData.head.rotation.z=Math.sin(t*1.3+(c===bride?1:0))*.025;}};
  return root;
}
export function lighting(scene){scene.add(new THREE.HemisphereLight(0xfff5df,0x879980,2.3));const a=new THREE.DirectionalLight(0xfff1d4,3);a.position.set(-3,5,5);scene.add(a);const b=new THREE.DirectionalLight(0xffffff,1.5);b.position.set(3,2,-4);scene.add(b);}
export function waveClips(){const times=[0,.3,.6,.9,1.2];return [new THREE.AnimationClip('Greeting',1.2,['Bride_Wave','Groom_Wave'].map((name,i)=>new THREE.QuaternionKeyframeTrack(name+'.quaternion',times,times.flatMap(t=>new THREE.Quaternion().setFromEuler(new THREE.Euler(0,0,(i?.55:-.55)+Math.sin(t/1.2*Math.PI*2)*.20)).toArray()))))];}
