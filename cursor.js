const canvas = document.createElement("canvas");
canvas.id = "cursorCanvas";
document.body.appendChild(canvas);

Object.assign(canvas.style, {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  zIndex: "9999",
  pointerEvents: "none",
});

const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function bodyHasAnyClass(...names) {
  return names.some((n) => document.body.classList.contains(n));
}
function attributeIsLight(el) {
  if (!el) return false;
  const attr = el.getAttribute("data-theme") || el.getAttribute("data-mode") || el.getAttribute("theme");
  if (!attr) return false;
  return String(attr).toLowerCase().includes("light");
}
function parseRgbString(rgb) {
  if (!rgb) return null;
  rgb = rgb.trim();
  if (rgb.startsWith("rgb")) {
    const nums = rgb.replace(/rgba?|\(|\)|\s/g, "").split(",");
    return nums.slice(0, 3).map((v) => parseInt(v, 10));
  }
  // hex #
  if (rgb.startsWith("#")) {
    const hex = rgb.slice(1);
    if (hex.length === 3) {
      return [hex[0]+hex[0], hex[1]+hex[1], hex[2]+hex[2]].map(h => parseInt(h,16));
    }
    if (hex.length === 6) {
      return [hex.slice(0,2), hex.slice(2,4), hex.slice(4,6)].map(h => parseInt(h,16));
    }
  }
  return null;
}
function luminanceFromRgb([r,g,b]) {
  // relative luminance approximation
  const srgb = [r/255, g/255, b/255].map(c => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055)/1.055, 2.4);
  });
  return 0.2126*srgb[0] + 0.7152*srgb[1] + 0.0722*srgb[2];
}

function isLightModeDetected() {
  const commonLightClasses = [
    "light", "theme-light", "light-mode", "is-light", "mode-light", "light-theme", "ui-light", "lt"
  ];
  if (bodyHasAnyClass(...commonLightClasses)) return true;
  const commonDarkClasses = [
    "dark", "theme-dark", "dark-mode", "is-dark", "mode-dark", "dark-theme", "ui-dark", "dk"
  ];
  if (bodyHasAnyClass(...commonDarkClasses)) return false;

  if (attributeIsLight(document.body)) return true;
  if (attributeIsLight(document.documentElement)) return true;

  const ariaTheme = document.body.getAttribute("aria-theme") || document.documentElement.getAttribute("aria-theme");
  if (ariaTheme && String(ariaTheme).toLowerCase().includes("light")) return true;

  try {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      return true;
    }
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return false;
    }
  } catch (e) {
    /* ignore */
  }
  const candidates = [
    window.getComputedStyle(document.body).backgroundColor,
    window.getComputedStyle(document.documentElement).backgroundColor
  ];
  const firstEl = document.querySelector("main, #root, .app, body > div");
  if (firstEl) candidates.push(window.getComputedStyle(firstEl).backgroundColor);

  for (const c of candidates) {
    const rgb = parseRgbString(c);
    if (rgb) {
      const lum = luminanceFromRgb(rgb);
      if (lum > 0.6) return true;
      if (lum < 0.35) return false;
    }
  }
  return false;
}
function applyBlendForMode(isLight) {
  canvas.style.mixBlendMode = isLight ? "normal" : "screen";
}
function getColorHueForMode(isLight) {
  return isLight ? (Math.random() * 18 + 35) : (Math.random() * 40 + 170);
}
let lastIsLight = isLightModeDetected();
applyBlendForMode(lastIsLight);
const observer = new MutationObserver(() => {
  const nowLight = isLightModeDetected();
  if (nowLight !== lastIsLight) {
    lastIsLight = nowLight;
    applyBlendForMode(lastIsLight);
  }
});
observer.observe(document.body, { attributes: true, attributeFilter: ["class", "data-theme", "data-mode", "theme", "aria-theme"] });
observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme", "data-mode", "theme", "aria-theme"] });
window.addEventListener("theme-change", () => {
  const nowLight = isLightModeDetected();
  lastIsLight = nowLight;
  applyBlendForMode(lastIsLight);
});
window.addEventListener("mousemove", (e) => {
  for (let i = 0; i < 5; i++) {
    particles.push(new Particle(e.clientX, e.clientY));
  }
});

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 6 + 2;
    this.speedX = (Math.random() - 0.5) * 3;
    this.speedY = (Math.random() - 0.5) * 3;
    this.alpha = 1;
    const hue = getColorHueForMode(lastIsLight);
    const lightness = lastIsLight ? 55 : 60;
    this.color = `hsl(${Math.round(hue)}, 100%, ${lightness}%)`;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.size *= 0.95;
    this.alpha -= 0.02;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = lastIsLight ? 18 : 30;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw();
    if (p.alpha <= 0 || p.size < 0.5) particles.splice(i, 1);
  }

  requestAnimationFrame(animate);
}
animate();
