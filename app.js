import { loadSheet, drawMascot } from "./mascot.js?v=pink-v6-1";
const $ = (s) => document.querySelector(s);
let paused = matchMedia("(prefers-reduced-motion: reduce)").matches;
let noticeTimer;
function notice(msg) {
  clearTimeout(noticeTimer);
  $("#notice").textContent = msg;
  $("#notice").hidden = false;
  noticeTimer = setTimeout(() => $("#notice").hidden = true, 6e3);
}
const sheetPromise = loadSheet();
sheetPromise.catch(() => {
});
const previewCanvas = document.createElement("canvas");
previewCanvas.width = 720;
previewCanvas.height = 840;
previewCanvas.setAttribute("role", "img");
previewCanvas.setAttribute("aria-label", "\u0E1A\u0E48\u0E32\u0E27\u0E2A\u0E32\u0E27\u0E0A\u0E38\u0E14\u0E44\u0E17\u0E22\u0E42\u0E1A\u0E01\u0E21\u0E37\u0E2D \u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E2B\u0E31\u0E27\u0E43\u0E08\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E2B\u0E27");
$("#model").appendChild(previewCanvas);
let clock = 0, last = 0, previewReady = false;
sheetPromise.then((img) => {
  previewReady = true;
  const draw = (ms) => {
    const dt = last ? Math.min((ms - last) / 1e3, 0.05) : 0;
    last = ms;
    if (!paused && !document.hidden) clock += dt;
    drawMascot(previewCanvas, img, clock);
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
}).catch(() => {
  $("#model").innerHTML = '<p class="asset-error">\u0E42\u0E2B\u0E25\u0E14\u0E20\u0E32\u0E1E\u0E15\u0E31\u0E27\u0E25\u0E30\u0E04\u0E23\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08<br>\u0E42\u0E1B\u0E23\u0E14\u0E25\u0E2D\u0E07\u0E23\u0E35\u0E40\u0E1F\u0E23\u0E0A\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E27\u0E47\u0E1A</p>';
});
function updateMotion() {
  const text = paused ? "\u25B7 \u0E40\u0E25\u0E48\u0E19\u0E20\u0E32\u0E1E\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E2B\u0E27" : "\u2161 \u0E2B\u0E22\u0E38\u0E14\u0E0A\u0E31\u0E48\u0E27\u0E04\u0E23\u0E32\u0E27";
  $("#motion").textContent = text;
  $("#motion").setAttribute("aria-label", paused ? "\u0E40\u0E25\u0E48\u0E19\u0E20\u0E32\u0E1E\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E2B\u0E27" : "\u0E2B\u0E22\u0E38\u0E14\u0E20\u0E32\u0E1E\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E2B\u0E27");
  $("#motion").setAttribute("aria-pressed", String(paused));
}
updateMotion();
$("#motion").onclick = () => {
  paused = !paused;
  updateMotion();
};
$("#preview").onclick = () => {
  $(".stage").scrollIntoView({ behavior: "smooth", block: "center" });
  if (!previewReady) notice("\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14\u0E15\u0E31\u0E27\u0E25\u0E30\u0E04\u0E23\u0E0A\u0E38\u0E14\u0E44\u0E17\u0E22\u2026");
};
let active = null, busy = false, generation = 0;
function disposeAR(ar) {
  if (!ar) return;
  try {
    ar.renderer?.setAnimationLoop(null);
    ar.controller?.stopProcessVideo();
    ar.video?.srcObject?.getTracks().forEach((t) => t.stop());
  } catch {
  }
  ar.video?.remove();
  ar.renderer?.dispose();
  ar.renderer?.domElement.remove();
  ar.cssRenderer?.domElement.remove();
  ar.scene?.traverse((o) => {
    o.geometry?.dispose();
    for (const m of o.material ? Array.isArray(o.material) ? o.material : [o.material] : []) {
      m.map?.dispose();
      m.dispose();
    }
  });
}
function close() {
  generation++;
  disposeAR(active);
  active = null;
  $("#arCamera").replaceChildren();
  $("#arView").hidden = true;
  document.body.style.overflow = "";
  document.querySelector("main").inert = false;
  document.querySelector("header").inert = false;
  busy = false;
  $("#start").focus();
}
async function startAR() {
  if (busy) return;
  busy = true;
  const current = ++generation;
  $("#arView").hidden = false;
  document.body.style.overflow = "hidden";
  document.querySelector("main").inert = true;
  document.querySelector("header").inert = true;
  $("#closeAR").focus();
  $("#status").textContent = "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E40\u0E15\u0E23\u0E35\u0E22\u0E21\u0E15\u0E31\u0E27\u0E25\u0E30\u0E04\u0E23\u0E41\u0E25\u0E30\u0E01\u0E25\u0E49\u0E2D\u0E07\u2026";
  $("#retry").hidden = true;
  $("#scanFrame").hidden = false;
  let ar;
  try {
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) throw new Error("SECURE");
    const [{ MindARThree }, THREE, img] = await Promise.all([import("./assets/mindar-image-three.prod.js"), import("three"), sheetPromise]);
    if (current !== generation) return;
    ar = new MindARThree({ container: $("#arCamera"), imageTargetSrc: "./assets/card-pink-v6.mind", uiLoading: "no", uiScanning: "no", uiError: "no", maxTrack: 1, filterMinCF: 1e-3, filterBeta: 10 });
    active = ar;
    ar.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    const anchor = ar.addAnchor(0);
    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 720;
    textureCanvas.height = 840;
    drawMascot(textureCanvas, img, 0);
    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1.08, 1.26), material);
    plane.position.set(0, -0.02, 0.12);
    anchor.group.add(plane);
    anchor.onTargetFound = () => {
      $("#status").textContent = "\u0E40\u0E08\u0E2D\u0E01\u0E31\u0E19\u0E41\u0E25\u0E49\u0E27 \u2661 \u0E1A\u0E48\u0E32\u0E27\u0E2A\u0E32\u0E27\u0E0A\u0E38\u0E14\u0E44\u0E17\u0E22";
      $("#scanFrame").hidden = true;
    };
    anchor.onTargetLost = () => {
      $("#status").textContent = "\u0E2A\u0E48\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E4C\u0E14\u0E0A\u0E21\u0E1E\u0E39\u0E14\u0E49\u0E32\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E43\u0E2B\u0E49\u0E40\u0E2B\u0E47\u0E19\u0E17\u0E31\u0E49\u0E07\u0E43\u0E1A\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07";
      $("#scanFrame").hidden = false;
    };
    $("#status").textContent = "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15\u0E01\u0E25\u0E49\u0E2D\u0E07 \u0E41\u0E25\u0E49\u0E27\u0E23\u0E2D\u0E2A\u0E31\u0E01\u0E04\u0E23\u0E39\u0E48";
    await ar.start();
    if (current !== generation) {
      disposeAR(ar);
      return;
    }
    $("#status").textContent = "\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E41\u0E25\u0E49\u0E27 \xB7 \u0E2A\u0E48\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E4C\u0E14\u0E0A\u0E21\u0E1E\u0E39\u0E14\u0E49\u0E32\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E43\u0E1A\u0E43\u0E2B\u0E21\u0E48";
    let arClock = 0, previous = 0, previousDraw = -1;
    ar.renderer.setAnimationLoop((ms) => {
      const dt = previous ? Math.min((ms - previous) / 1e3, 0.05) : 0;
      previous = ms;
      if (!paused) arClock += dt;
      if (ms - previousDraw > 65) {
        drawMascot(textureCanvas, img, arClock);
        texture.needsUpdate = true;
        previousDraw = ms;
      }
      ar.renderer.render(ar.scene, ar.camera);
    });
  } catch (e) {
    console.error("AR startup failed", e);
    disposeAR(ar);
    if (active === ar) active = null;
    if (current !== generation) return;
    $("#scanFrame").hidden = true;
    $("#status").textContent = e.name === "NotAllowedError" ? "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15\u0E01\u0E25\u0E49\u0E2D\u0E07 \u0E40\u0E1B\u0E34\u0E14\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E01\u0E25\u0E49\u0E2D\u0E07\u0E41\u0E25\u0E49\u0E27\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48" : e.name === "NotFoundError" ? "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E01\u0E25\u0E49\u0E2D\u0E07 \u0E25\u0E2D\u0E07\u0E40\u0E1B\u0E34\u0E14\u0E40\u0E27\u0E47\u0E1A\u0E19\u0E35\u0E49\u0E1A\u0E19\u0E21\u0E37\u0E2D\u0E16\u0E37\u0E2D" : e.message === "SECURE" ? "\u0E42\u0E1B\u0E23\u0E14\u0E40\u0E1B\u0E34\u0E14\u0E25\u0E34\u0E07\u0E01\u0E4C HTTPS \u0E14\u0E49\u0E27\u0E22 Safari \u0E2B\u0E23\u0E37\u0E2D Chrome" : e.message === "MASCOT_LOAD" ? "\u0E42\u0E2B\u0E25\u0E14\u0E20\u0E32\u0E1E\u0E15\u0E31\u0E27\u0E25\u0E30\u0E04\u0E23\u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08 \u0E15\u0E23\u0E27\u0E08\u0E2D\u0E34\u0E19\u0E40\u0E17\u0E2D\u0E23\u0E4C\u0E40\u0E19\u0E47\u0E15\u0E41\u0E25\u0E49\u0E27\u0E23\u0E35\u0E40\u0E1F\u0E23\u0E0A\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E27\u0E47\u0E1A" : /WebGL|context/i.test(e.message) ? "\u0E40\u0E1A\u0E23\u0E32\u0E27\u0E4C\u0E40\u0E0B\u0E2D\u0E23\u0E4C\u0E19\u0E35\u0E49\u0E40\u0E1B\u0E34\u0E14 AR \u0E44\u0E21\u0E48\u0E44\u0E14\u0E49 \u0E25\u0E2D\u0E07 Safari \u0E2B\u0E23\u0E37\u0E2D Chrome \u0E1A\u0E19\u0E21\u0E37\u0E2D\u0E16\u0E37\u0E2D \u0E2B\u0E23\u0E37\u0E2D\u0E14\u0E39\u0E20\u0E32\u0E1E\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E2B\u0E27\u0E43\u0E19\u0E2B\u0E19\u0E49\u0E32\u0E40\u0E27\u0E47\u0E1A" : "\u0E40\u0E1B\u0E34\u0E14 AR \u0E44\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08 \u0E15\u0E23\u0E27\u0E08\u0E2D\u0E34\u0E19\u0E40\u0E17\u0E2D\u0E23\u0E4C\u0E40\u0E19\u0E47\u0E15\u0E41\u0E25\u0E30\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E01\u0E25\u0E49\u0E2D\u0E07 \u0E41\u0E25\u0E49\u0E27\u0E25\u0E2D\u0E07 Safari \u0E2B\u0E23\u0E37\u0E2D Chrome";
    $("#retry").hidden = false;
  } finally {
    if (current === generation) busy = false;
  }
}
$("#start").onclick = startAR;
$("#closeAR").onclick = close;
$("#retry").onclick = startAR;
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !$("#arView").hidden) close();
});
window.addEventListener("pagehide", () => {
  generation++;
  disposeAR(active);
  active = null;
});
