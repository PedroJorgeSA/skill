// Grava uma demo do produto rodando, com cursor visível e digitação no ritmo de uma pessoa.
// Uso: bun scripts/gravar-demo.ts <url-do-app> <cena> [saida.mp4]
// Precisa de: bun add -d playwright-core && npx playwright install chromium, e ffmpeg no PATH.
// Escreva suas cenas em CENAS, abaixo. Cada cena é uma sequência de ações do objeto h.
import { chromium, type Page } from "playwright-core";
import { mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const [URL_APP, CENA, SAIDA] = process.argv.slice(2);
if (!URL_APP || !CENA) { console.error("uso: bun scripts/gravar-demo.ts <url> <cena> [saida.mp4]"); process.exit(1); }
const W = 1600, H = 1000; // 16:10, o tamanho do molde demo
const TMP = join(import.meta.dir, ".raw");

const CURSOR = `(() => {
  if (window.__cursor) return; window.__cursor = 1;
  const add = () => {
    const c = document.createElement('div');
    c.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 2l15 11-6.5 1.2L16 21l-3 1.4-3.3-6.6L4 20z" fill="#ECEBE9" stroke="#111" stroke-width="1.2" stroke-linejoin="round"/></svg>';
    Object.assign(c.style, { position: 'fixed', left: '0', top: '0', zIndex: 2147483647, pointerEvents: 'none', transform: 'translate(-100px,-100px)', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.5))' });
    document.documentElement.appendChild(c);
    const ring = document.createElement('div');
    Object.assign(ring.style, { position: 'fixed', width: '34px', height: '34px', borderRadius: '50%', border: '2px solid #C9FF4D', zIndex: 2147483646, pointerEvents: 'none', opacity: '0' });
    document.documentElement.appendChild(ring);
    addEventListener('mousemove', (e) => { c.style.transform = 'translate(' + (e.clientX - 3) + 'px,' + (e.clientY - 2) + 'px)'; }, true);
    addEventListener('mousedown', (e) => { ring.style.left = (e.clientX - 17) + 'px'; ring.style.top = (e.clientY - 17) + 'px'; ring.style.transition = 'none'; ring.style.opacity = '1'; ring.style.transform = 'scale(.5)'; requestAnimationFrame(() => { ring.style.transition = 'opacity .45s, transform .45s'; ring.style.opacity = '0'; ring.style.transform = 'scale(1.3)'; }); }, true);
  };
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', add); else add();
})();`;

function humano(page: Page) {
  let pos = { x: W / 2, y: H / 2 };
  const ir = async (x: number, y: number) => {
    await page.mouse.move(x, y, { steps: Math.max(12, Math.round(Math.hypot(x - pos.x, y - pos.y) / 18)) });
    pos = { x, y };
  };
  return {
    async clicar(sel: string, espera = 500) {
      const el = page.locator(sel).first();
      await el.waitFor({ state: "visible", timeout: 15000 });
      const b = (await el.boundingBox())!;
      await ir(b.x + b.width / 2, b.y + b.height / 2);
      await page.waitForTimeout(220);
      await page.mouse.down(); await page.waitForTimeout(70); await page.mouse.up();
      await page.waitForTimeout(espera);
    },
    async digitar(sel: string, texto: string) {
      await this.clicar(sel, 200);
      await page.locator(sel).first().pressSequentially(texto, { delay: 38 + Math.random() * 20 });
      await page.waitForTimeout(250);
    },
    async olhar(sel: string, ms = 1200) {
      const b = (await page.locator(sel).first().boundingBox())!;
      await ir(b.x + b.width / 2, b.y + Math.min(b.height / 2, 30));
      await page.waitForTimeout(ms);
    },
    esperar: (ms: number) => page.waitForTimeout(ms),
    esperarTexto: (t: string) => page.getByText(t).first().waitFor({ timeout: 20000 }),
  };
}

// Suas cenas. Uma ideia por cena, até 30 s.
const CENAS: Record<string, (page: Page) => Promise<void>> = {
  exemplo: async (page) => {
    const h = humano(page);
    await page.goto(URL_APP); await h.esperar(1200);
    // await h.digitar('input[name="mensagem"]', "Minha maquininha parou de ler cartão");
    // await page.keyboard.press("Enter");
    // await h.esperarTexto("Resolvido");
    // await h.olhar(".painel", 1600);
    await h.olhar("body", 2000);
  },
};

if (!CENAS[CENA]) { console.error(`cena desconhecida: ${CENA}. Disponíveis: ${Object.keys(CENAS).join(", ")}`); process.exit(1); }
rmSync(TMP, { recursive: true, force: true }); mkdirSync(TMP, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ["--hide-scrollbars"] });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, recordVideo: { dir: TMP, size: { width: W, height: H } }, colorScheme: "dark" });
await ctx.addInitScript(CURSOR);
const page = await ctx.newPage();
try { await CENAS[CENA](page); } finally { await page.waitForTimeout(600); await ctx.close(); await browser.close(); }

const raw = join(TMP, readdirSync(TMP).find((f) => f.endsWith(".webm"))!);
const mp4 = SAIDA ?? `video/${CENA}.mp4`;
const poster = mp4.replace(/([^/]+)\.mp4$/, "poster-$1.jpg");
// corta o primeiro segundo (página em branco) e gera H.264 que toca em qualquer navegador
const ff = Bun.spawnSync(["ffmpeg", "-y", "-loglevel", "error", "-ss", "0.8", "-i", raw, "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", mp4]);
if (ff.exitCode !== 0) throw new Error(String(ff.stderr));
Bun.spawnSync(["ffmpeg", "-y", "-loglevel", "error", "-ss", "2", "-i", mp4, "-frames:v", "1", "-q:v", "3", poster]);
rmSync(TMP, { recursive: true, force: true });
console.log(`gravado: ${mp4} e ${poster}`);
