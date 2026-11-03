import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';

const base=process.env.SITE_URL||'http://127.0.0.1:8765/';
await mkdir('screenshots',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const failures=[],errors=[];let passed=0;
async function check(title,fn){try{await fn();passed++;console.log('PASS',title)}catch(err){failures.push({title,error:String(err)});console.error('FAIL',title,err?.stack||err)}}
async function visit(path,width=1440,height=900,mobile=false){
 const page=await browser.newPage({viewport:{width,height},isMobile:mobile,hasTouch:mobile});
 page.on('pageerror',e=>errors.push(path+': '+e.message));
 await page.goto(base+path,{waitUntil:'domcontentloaded'});
 return page;
}
const pages=['index.html','areas-de-practica.html','equipo.html','contacto.html'];
const home=await visit('index.html');
await check('Identidad precisa, contenido y páginas de práctica',async()=>{
 assert.match(await home.title(),/Castiglioni/);
 const text=await home.locator('body').innerText();
 for(const term of ['Castiglioni & Asociados','Derecho Corporativo','Litigios','Propiedad Intelectual','Carmelo','Fabrizio','Asunción'])assert.ok(text.includes(term),term);
 assert.equal(/Lorem ipsum|Nuestros clientes felices|casos ganados|100% éxito/i.test(text),false);
 assert.equal(await home.locator('h1').count(),1);
});
await check('Fotografías arquitectónicas locales cargan',async()=>{
 for(const selector of ['.hero-image img','.method-visual img']){
  const img=home.locator(selector);
  await img.scrollIntoViewIfNeeded();
  await img.evaluate(x=>x.decode().catch(()=>{}));
  assert.ok(await img.evaluate(x=>x.complete&&x.naturalWidth>0),selector);
 }
});
await check('Cinco áreas de práctica sin contenido inventado',async()=>{
 assert.equal(await home.locator('.practice-row').count(),5);
 await home.locator('.practice-row[href*="competencia"]').click();
 await home.waitForURL(/areas-de-practica\.html#competencia/);
 assert.match(await home.locator('#competencia').innerText(),/competencia/i);
});
await check('Sección de crédito y cobro judicial y extrajudicial',async()=>{
 const text=await home.locator('body').innerText();
 for(const w of ['pagarés','cheques','facturas','extrajudicial'])assert.match(text,new RegExp(w,'i'));
});
const team=await visit('equipo.html');
await check('Equipo real sin retratos ficticios ni datos académicos falsos',async()=>{
 const data=await team.locator('body').innerText();
 assert.match(data,/Carmelo Castiglioni/);
 assert.match(data,/Fabrizio Castiglioni/);
 assert.match(data,/Doctor en Ciencias Jurídicas/);
 assert.equal(await team.locator('.profile-photo img').count(),0);
 assert.equal(await team.locator('.profile-fallback').count(),2);
});
const contact=await visit('contacto.html?area=litigios');
await check('Contacto oficial y especialidad preseleccionada',async()=>{
 assert.equal(await contact.locator('#subjectArea').inputValue(),'litigios');
 const text=await contact.locator('body').innerText();
 assert.match(text,/\+595 981 267406/);
 assert.match(text,/Humaitá 505/);
 assert.match(text,/info@castiglioni.com.py/);
});
await check('Formulario evita envío vacío',async()=>{
 await contact.locator('#inquiryForm button[type="submit"]').click();
 assert.equal(await contact.locator('#fullName').evaluate(el=>el.validity.valueMissing),true);
});
await check('WhatsApp prepara borrador correctamente',async()=>{
 await contact.locator('#fullName').fill('Contacto Prueba');
 await contact.locator('#company').fill('Empresa Ejemplo');
 await contact.locator('#contactEmail').fill('contacto@empresa.com');
 await contact.locator('#message').fill('Quisiera evaluar la recuperación de un pagaré.');
 await contact.evaluate(()=>{window.__opened='';window.open=(u)=>{window.__opened=u;return {}}});
 await contact.locator('#inquiryForm button[type="submit"]').click();
 const u=await contact.evaluate(()=>window.__opened);
 assert.match(u,/^https:\/\/wa\.me\/595981267406\?text=/);
 assert.match(decodeURIComponent(u),/Contacto Prueba/);
 assert.match(decodeURIComponent(u),/Litigios y recuperación de créditos/);
});
await check('Correo preparado con destinatario correcto',async()=>{
 await contact.locator('#sendEmail').click();
 const u=await contact.evaluate(()=>window.__opened);
 assert.match(u,/^mailto:info@castiglioni.com.py/);
 assert.match(decodeURIComponent(u),/pagaré/);
});
await check('Preguntas frecuentes se abren correctamente',async()=>{
 const details=contact.locator('details').first();
 await details.locator('summary').click();
 assert.notEqual(await details.getAttribute('open'),null);
});
await check('Archivos y medios esenciales disponibles',async()=>{
 for(const path of [...pages,'assets/style.css','assets/app.js','assets/media/architecture.jpg','assets/media/interior.jpg']){
  const response=await contact.request.get(base+path);
  assert.equal(response.status(),200,path);
 }
});
await check('Sin recortes y superposiciones en 4 páginas × 6 tamaños',async()=>{
 for(const path of pages){
  const p=await visit(path,390,840);
  for(const width of [320,390,768,1024,1440,1600]){
   await p.setViewportSize({width,height:880});
   const check=await p.evaluate(()=>{
    const hs=[...document.querySelectorAll('h1,h2,h3')].filter(el=>{
     const r=el.getBoundingClientRect(),s=getComputedStyle(el);
     return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden';
    }).map(el=>{const r=el.getBoundingClientRect();return {text:el.textContent.slice(0,28),left:r.left,right:r.right,client:el.clientWidth,scroll:el.scrollWidth}});
    return {doc:document.documentElement.scrollWidth,inner:innerWidth,headings:hs,brand:document.querySelector('.brand-mark')?.getBoundingClientRect().width||0};
   });
   assert.ok(check.doc<=width+2,path+' @'+width+' scrollWidth='+check.doc);
   assert.ok(check.brand<=36,'Sobredimension logo '+check.brand);
   for(const h of check.headings){
     assert.ok(h.left>=-3&&h.right<=width+3,path+' @'+width+' heading outside viewport '+JSON.stringify(h));
     assert.ok(h.scroll<=h.client+5,path+' @'+width+' heading clipping '+JSON.stringify(h));
   }
  }
  await p.close();
 }
});
const mobile=await visit('index.html',390,844,true);
await check('Menú móvil y navegación funcionan',async()=>{
 await mobile.locator('#menuToggle').click();
 assert.equal(await mobile.locator('#menuToggle').getAttribute('aria-expanded'),'true');
 await mobile.locator('#mobileMenu a[href="equipo.html"]').click();
 await mobile.waitForURL(/equipo\.html/);
 assert.match(await mobile.title(),/Equipo profesional/);
});
await check('Sin excepciones JavaScript',async()=>assert.deepEqual(errors,[]));
const capture=await visit('index.html');
await capture.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=620){scrollTo(0,y);await new Promise(r=>setTimeout(r,30))}scrollTo({top:0,behavior:'instant'})});
await capture.locator('.hero-image img').evaluate(x=>x.decode().catch(()=>{}));
await capture.screenshot({path:'screenshots/castiglioni-desktop.png',fullPage:true,animations:'disabled'});
const phone=await visit('index.html',390,844,true);
await phone.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=430){scrollTo(0,y);await new Promise(r=>setTimeout(r,30))}scrollTo({top:0,behavior:'instant'})});
await phone.screenshot({path:'screenshots/castiglioni-mobile.png',fullPage:true,animations:'disabled'});
await team.screenshot({path:'screenshots/castiglioni-team.png',fullPage:true,animations:'disabled'});
await browser.close();
console.log(passed+'/'+(passed+failures.length)+' verificaciones aprobadas');
if(failures.length)process.exitCode=1;
