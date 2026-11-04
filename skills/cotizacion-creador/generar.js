// Uso: node generar.js ejemplos/zegel-tiktok.json salida.pdf
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const [,, input, output] = process.argv;
const d = JSON.parse(fs.readFileSync(input, 'utf8'));
const fmt = n => 'S/ ' + Math.round(n).toLocaleString('es-PE').replace(/,/g, '.');
const font = (w) => 'file://' + path.resolve(__dirname, 'fonts', `montserrat-latin-${w}-normal.woff2`);
const cols = d.columnas; // ej. ["Precio"] o ["Opción 1","Opción 2"]
const total = i => d.items.reduce((s, it) => s + (it.precios[i] || 0), 0);
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:M;font-weight:400;src:url(${font(400)})}
@font-face{font-family:M;font-weight:600;src:url(${font(600)})}
@font-face{font-family:M;font-weight:800;src:url(${font(800)})}
@page{size:A4;margin:0}*{box-sizing:border-box;margin:0}
body{font-family:M,sans-serif;width:210mm;height:297mm;color:#111;position:relative;overflow:hidden}
.hero{background:#FFE033;padding:48px 62px 38px;height:233px;position:relative}
.eyebrow{font-size:11px;font-weight:800;letter-spacing:.2em;text-transform:uppercase}
.fecha{position:absolute;right:62px;top:48px;font-size:10.5px;font-weight:600}
h1{font-size:38px;font-weight:800;margin:14px 0 14px;letter-spacing:-.01em}
.sub{font-size:13px;line-height:1.35;max-width:545px;font-weight:600}
.sec{display:flex;align-items:center;gap:12px;margin:0 62px;font-size:11px;font-weight:800;letter-spacing:.2em;text-transform:uppercase}
.sec i{display:block;width:38px;height:8px;background:#FFE033;border:1.5px solid #111}
.cards{display:flex;gap:20px;margin:18px 62px 0}
.card{border:1.5px solid #111;border-radius:12px;padding:16px 18px;flex:1}
.card.y{background:#FFF5C2;flex:1.1}.card small{font-size:9px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;display:block;margin-bottom:6px}
.card b{display:block;font-size:19px;font-weight:800;line-height:1.1}.card em{font-style:normal;font-size:10px;color:#444}
.big{font-size:23px!important}
table{width:calc(100% - 124px);margin:18px 62px 0;border-collapse:collapse}
th{background:#111;color:#fff;font-size:9px;letter-spacing:.15em;text-transform:uppercase;padding:12px;text-align:right}th:first-child{text-align:left}
td{padding:13px 12px;border-bottom:1px solid #ddd;font-size:14px;font-weight:800;text-align:right}td:first-child{text-align:left}
td small{display:block;font-size:10.5px;font-weight:400;color:#555;margin-top:3px}
tr.t td{background:#FFE033;font-size:17px;padding:16px 12px;border:0}
.nota{margin:14px 62px 0;font-size:10.5px;color:#666;line-height:1.4}
ul{list-style:none;margin:16px 62px 0;padding:0}li{position:relative;padding-left:24px;font-size:12px;line-height:1.4;margin-bottom:11px}
li:before{content:"";position:absolute;left:0;top:3px;width:11px;height:11px;border-radius:50%;background:#FFE033;border:1.5px solid #111}
.foot{position:absolute;bottom:0;left:0;right:0;background:#111;color:#fff;padding:26px 62px;font-size:12px;display:flex;justify-content:space-between}
.foot b,.foot span{color:#FFE033;font-weight:800}
</style></head><body>
<div class="hero"><div class="eyebrow">Propuesta de colaboración</div><div class="fecha">${d.fecha}</div>
<h1>${d.titulo}</h1><div class="sub">${d.descripcion}</div></div>
<div style="height:28px"></div>
<div class="sec"><i></i>El creador</div>
<div class="cards">
<div class="card y"><small>Perfil</small><b>${d.creador.nombre}<br>${d.creador.nicho}</b><em>${d.creador.rol}</em></div>
<div class="card"><small>Instagram</small><b class="big">${d.creador.instagram.seguidores}</b><em>seguidores · ${d.creador.instagram.usuario}</em></div>
<div class="card"><small>TikTok</small><b class="big">${d.creador.tiktok.seguidores}</b><em>seguidores · ${d.creador.tiktok.usuario}</em></div></div>
<div style="height:24px"></div>
<div class="sec"><i></i>Inversión</div>
<table><tr><th>Entregable</th>${cols.map(c => `<th>${c}</th>`).join('')}</tr>
${d.items.map(it => `<tr><td>${it.nombre}<small>${it.detalle}</small></td>${cols.map((_, i) => `<td>${it.precios[i] ? fmt(it.precios[i]) : '—'}</td>`).join('')}</tr>`).join('')}
<tr class="t"><td>Total</td>${cols.map((_, i) => `<td>${fmt(total(i))}</td>`).join('')}</tr></table>
<div class="nota">${d.nota}</div>
<div style="height:14px"></div><div class="sec"><i></i>Condiciones</div>
<ul>${d.condiciones.map(c => `<li><b>${c[0]}:</b> ${c[1]}</li>`).join('')}</ul>
<div class="foot"><div><b>Nico</b> · Negocios y finanzas Perú</div><span>${d.creador.instagram.usuario}</span></div>
</body></html>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const tmp = path.resolve(__dirname, '.tmp.html'); fs.writeFileSync(tmp, html); await p.goto('file://' + tmp); fs.unlinkSync(tmp);
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: output, format: 'A4', printBackground: true });
  await b.close(); console.log('OK', output, cols.map((_, i) => fmt(total(i))).join(' | '));
})();
