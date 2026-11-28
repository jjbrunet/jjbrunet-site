
window.__doBeat=async function(b){
 const log=[];const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 const hx=s=>new Uint8Array(s.match(/../g).map(h=>parseInt(h,16)));
 const ck=await crypto.subtle.importKey('raw',hx(window.__K),'AES-CBC',false,['decrypt']);
 const top=()=>[...document.querySelectorAll('.js-upload-digital-file-row')].filter(r=>!r.closest('.variant-upload-filelist'));
 const inputs=()=>[...document.querySelectorAll('input[type=file]')].filter(f=>f.parentElement.getBoundingClientRect().width>0).sort((a,c)=>a.parentElement.getBoundingClientRect().y-c.parentElement.getBoundingClientRect().y);
 const put=(inp,file)=>{const dt=new DataTransfer();dt.items.add(file);inp.files=dt.files;inp.dispatchEvent(new Event('change',{bubbles:true}));};
 const getF=async(ext,name,type)=>{const e=await fetch('https://raw.githubusercontent.com/jjbrunet/jjbrunet-site/xfer-tmp/'+b.slug+'_'+ext+'.bin').then(r=>{if(!r.ok)throw new Error('fetch '+r.status);return r.arrayBuffer()});const d=await crypto.subtle.decrypt({name:'AES-CBC',iv:hx(window.__I)},ck,e);return new File([d],name,{type})};
 const waitRow=async(name)=>{for(let i=0;i<240;i++){await sleep(1000);const r=top().find(r=>r.innerText.includes(name.replace(/\.(mp3|wav)$/,'')) && r.innerText.includes(name.slice(-3)));if(r&&!/Uploading/.test(r.innerText)&&/variants|Lease|Unlimited/.test(r.innerText))return r;}throw new Error('timeout '+name)};
 // cover
 if(b.cover!==false){const ins=inputs(); const cb=await fetch('https://raw.githubusercontent.com/jjbrunet/jjbrunet-site/main/covers/'+b.slug+'.jpg').then(r=>r.blob()); put(ins[1],new File([cb],b.slug+'.jpg',{type:'image/jpeg'})); log.push('cover'); await sleep(3000);}
 // mp3
 if(!top().some(r=>r.innerText.includes(b.mp3.replace(/\.mp3$/,''))&&r.innerText.includes('.mp3'))){put(inputs()[0],await getF('mp3',b.mp3,'audio/mpeg')); await waitRow(b.mp3); log.push('mp3');}
 if(!top().some(r=>r.innerText.includes(b.wav.replace(/\.wav$/,''))&&r.innerText.includes('.wav'))){put(inputs()[0],await getF('wav',b.wav,'audio/wav')); await waitRow(b.wav); log.push('wav');}
 return log.join(',')+' | '+top().map(r=>r.innerText.replace(/\s+/g,' ').slice(0,90)).join(' || ');
};
window.__finish=async function(b){
 const sleep=ms=>new Promise(r=>setTimeout(r,ms)); const log=[];
 const top=()=>[...document.querySelectorAll('.js-upload-digital-file-row')].filter(r=>!r.closest('.variant-upload-filelist'));
 // wav variants: remove MP3 Lease
 { const wr=top().find(r=>r.innerText.includes(b.wav.replace(/\.wav$/,''))&&/\.wav/.test(r.innerText)); if(wr){const $s=jQuery(wr.querySelector('select')); const ti=$s.data('tagsinput'); const it=ti&&ti.itemsArray.find(i=>i.variantName==='MP3 Lease'); if(it){$s.tagsinput('remove',it); log.push('wavvar');} await sleep(600);} else log.push('NOWAV'); }
 // delete long overdue
 for(let i=0;i<4;i++){const r=top().find(r=>!r.innerText.includes(b.mp3.replace(/\.mp3$/,''))); if(!r)break; r.querySelector('.js-uploaddelete').click(); await sleep(800); const y=[...document.querySelectorAll('button')].find(x=>/Yes, delete it/.test(x.innerText)&&x.offsetParent); if(!y){log.push('noconfirm');break;} y.click(); await sleep(2500); const ok=[...document.querySelectorAll('button')].find(x=>x.innerText.trim()==='OK'&&x.offsetParent); if(ok)ok.click(); await sleep(700); log.push('del');}
 // desc
 const q=document.querySelector('.ql-container').__quill; q.setContents([]); q.clipboard.dangerouslyPasteHTML(0,b.desc); document.querySelector('input[name=p_desc]').value=q.root.innerHTML;
 const iv=document.querySelector('input[name=product_status][value=invisible]'); iv.click(); iv.checked=true; iv.dispatchEvent(new Event('change',{bubbles:true})); const nm=document.querySelector('input[name=p_name]'); nm.value=b.t; nm.dispatchEvent(new Event('input',{bubbles:true})); nm.dispatchEvent(new Event('change',{bubbles:true})); if(b.three){const ps=[...document.querySelectorAll('input.js-variant-price-input')]; ['34.99','49.99','79.99'].forEach((v,i)=>{ps[i].value=v; ps[i].dispatchEvent(new Event('input',{bubbles:true})); ps[i].dispatchEvent(new Event('change',{bubbles:true}));});}
 const summ=top().map(r=>r.querySelector('.file-name-and-file-size-and-variants-outer-wrapper').innerText.replace(/\s+/g,' ').slice(-60)).join(' || ');
 document.querySelector('input[value="Save Changes"]').click(); log.push('saved');
 return log.join(',')+' | '+summ;
};
'ok'

window.__run=async function(k){const m=await fetch('https://raw.githubusercontent.com/jjbrunet/jjbrunet-site/xfer-tmp/manifest.json?'+Date.now()).then(r=>r.json()); const b=m.find(x=>x.k===k); if(document.querySelector('input[name=p_name]').value!==b.t) throw new Error('wrong page'); const a=await window.__doBeat(b); const f=await window.__finish(b); return b.t+': '+a.split('|')[0]+' / '+f;};

window.__run2=async function(t){const m=await fetch('https://raw.githubusercontent.com/jjbrunet/jjbrunet-site/xfer-tmp/manifest.json?'+Date.now()).then(r=>r.json()); const b=m.find(x=>x.t===t); const cur=document.querySelector('input[name=p_name]').value; if(!/COPY OF face it/.test(cur)&&cur!==b.t) throw new Error('wrong page '+cur); b.cover=false; const a=await window.__doBeat(b); const f=await window.__finish(b); return b.t+' @'+location.pathname.split('/').pop()+': '+a.split('|')[0]+' / '+f;};
