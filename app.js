const items=[['베개','🛏️'],['스피커','🔊'],['양말','🧦'],['알람','⏰'],['우산','☂️'],['거울','🪞'],['컵','☕'],['연필','✏️'],['지우개','🧽'],['공책','📓'],['테이프','🩹'],['선풍기','🪭'],['카메라','📷'],['주사위','🎲'],['풍선','🎈'],['미끄럼틀','🛝'],['숟가락','🥄'],['빗','🪮'],['시계','🕰️'],['장갑','🧤']].map(x=>({name:x[0],emoji:x[1]}));
const hints=[
 ['기능 옮기기', (a,b)=>b.name+'이 하는 일을 '+a.name+'이 대신한다면 어떨까?'],
 ['상황 바꾸기', a=>'이 '+a.name+'을 학교가 아니라 우주에서 쓴다면?'],
 ['불편함 더하기',(a,b)=>'일부러 조금 귀찮은 '+a.name+' × '+b.name+'을 만든다면?'],
 ['감정 넣기',(a,b)=>a.name+'과 '+b.name+'이 질투하거나 부끄러워한다면?'],
 ['크기 바꾸기',(a,b)=>'아주 작아진 '+a.name+'과 아주 커진 '+b.name+', 뭘 할 수 있을까?'],
 ['쓸모 뒤집기',(a,b)=>a.name+'이 '+b.name+'의 쓸모를 엉뚱하게 바꾼다면?']
];
const KEY='useless-invention-lab:v1',$=s=>document.querySelector(s);
let pair=[items[0],items[1]],current=null, saved=[];
try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(v))saved=v}catch{}
function persist(){try{localStorage.setItem(KEY,JSON.stringify(saved))}catch{toast('브라우저 저장 공간을 확인해줘.')}}
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove('show'),2100)}
function screen(id){document.querySelectorAll('.screen').forEach(e=>e.hidden=e.id!==id);window.scrollTo({top:0,behavior:'smooth'})}
function draw(){ $('#ea').textContent=pair[0].emoji;$('#na').textContent=pair[0].name;$('#eb').textContent=pair[1].emoji;$('#nb').textContent=pair[1].name}
function pick(exclude){const a=items.filter(x=>x.name!==exclude.name);return a[Math.floor(Math.random()*a.length)]}
function one(n){const choices=items.filter(x=>x.name!==pair[1-n].name&&x.name!==pair[n].name);pair[n]=choices[Math.floor(Math.random()*choices.length)];draw()}
function both(){const a=pick(pair[0]),b=pick(a);pair=[a,b];draw()}
$('#ma').onclick=()=>one(0);$('#mb').onclick=()=>one(1);$('#shuffle').onclick=both;
$('#hint').onclick=()=>{let n=Math.floor(Math.random()*hints.length);window.lastHint=(window.lastHint===n?(n+1)%hints.length:n);const h=hints[window.lastHint];$('#tiptext').textContent=h[0]+' · '+h[1](pair[0],pair[1]);$('#tip').hidden=false};
$('#close-tip').onclick=()=>$('#tip').hidden=true;
$('#form').onsubmit=e=>{e.preventDefault();const name=$('#title').value.trim(),desc=$('#desc').value.trim();if(!name&&!desc){toast('이름이나 설명 중 하나만 적어도 충분해.');$('#title').focus();return}current={id:Date.now().toString(36)+Math.random().toString(36).slice(2),name:name||'이름 없는 발명품',description:desc||'아직 설명은 비워뒀어.',a:{...pair[0]},b:{...pair[1]},createdAt:new Date().toISOString()};show(current)};
function show(x){current=x;$('#rea').textContent=x.a.emoji;$('#rna').textContent=x.a.name;$('#reb').textContent=x.b.emoji;$('#rnb').textContent=x.b.name;$('#rtitle').textContent=x.name;$('#rdesc').textContent=x.description;$('#serial').textContent='No. '+String(saved.length+1).padStart(3,'0');const done=saved.some(v=>v.id===x.id);$('#save').classList.toggle('saved',done);$('#save').textContent=done?'✓ 서랍에 담았어':'＋ 내 서랍에 넣기';screen('result')}
$('#save').onclick=()=>{if(!current||saved.some(v=>v.id===current.id))return;saved.unshift(current);persist();counts();$('#save').classList.add('saved');$('#save').textContent='✓ 서랍에 담았어';toast('네 발명을 서랍에 넣었어.')};
function counts(){$('#count').textContent=saved.length;$('#dcount').textContent=saved.length}
function render(){counts();$('#empty').hidden=!!saved.length;$('#notice').hidden=!saved.length;$('#list').replaceChildren();saved.forEach((x,i)=>{const card=document.createElement('article');card.className='saved';const top=document.createElement('div');top.className='savedtop';const label=document.createElement('span');label.textContent='발명 카드 · '+String(i+1).padStart(3,'0');const del=document.createElement('button');del.type='button';del.textContent='×';del.setAttribute('aria-label',x.name+' 삭제');del.onclick=e=>{e.stopPropagation();saved=saved.filter(y=>y.id!==x.id);persist();render();toast('서랍에서 꺼냈어.')};top.append(label,del);const mat=document.createElement('div');mat.className='matline';mat.textContent=x.a.emoji+' '+x.a.name+' × '+x.b.emoji+' '+x.b.name;const title=document.createElement('h3');title.textContent=x.name;const desc=document.createElement('p');desc.textContent=x.description;card.append(top,mat,title,desc);card.onclick=()=>show(x);$('#list').append(card)})}
$('#open-drawer').onclick=()=>{render();screen('drawer')};
document.querySelectorAll('[data-go]').forEach(x=>x.onclick=()=>screen(x.dataset.go));
$('#again').onclick=()=>{$('#title').value='';$('#desc').value='';$('#tip').hidden=true;both();screen('work')};
$('#empty button').onclick=()=>screen('work');
function wrap(ctx,text,x,y,max,line){let row='',cy=y;for(const c of text){if(ctx.measureText(row+c).width>max&&row){ctx.fillText(row,x,cy);row=c;cy+=line}else row+=c}if(row)ctx.fillText(row,x,cy)}
$('#download').onclick=()=>{const c=document.createElement('canvas');c.width=1200;c.height=900;const x=c.getContext('2d');x.fillStyle='#f7f4eb';x.fillRect(0,0,1200,900);x.fillStyle='#fffef9';x.strokeStyle='#dedbce';x.lineWidth=3;x.fillRect(88,78,1024,744);x.strokeRect(88,78,1024,744);x.fillStyle='#536b52';x.font='24px sans-serif';x.fillText('✳  쓸데없는 발명소',140,148);x.fillStyle='#898b80';x.font='20px sans-serif';x.fillText('작은 발명 카드',140,217);x.fillStyle='#686b61';x.font='28px sans-serif';x.fillText(current.a.emoji+'  '+current.a.name+'   ×   '+current.b.emoji+'  '+current.b.name,140,315);x.strokeStyle='#e7e4d9';x.beginPath();x.moveTo(140,356);x.lineTo(1060,356);x.stroke();x.fillStyle='#282b25';x.font='bold 52px sans-serif';wrap(x,current.name,140,450,900,65);x.fillStyle='#575a51';x.font='30px sans-serif';wrap(x,current.description,140,555,900,48);x.fillStyle='#85867c';x.font='23px sans-serif';x.fillText('따로 있던 두 물건에, 너만의 연결이 생겼어.',140,757);c.toBlob(blob=>{if(!blob){toast('이미지를 저장하지 못했어.');return}const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='나의-작은-발명.png';a.click();URL.revokeObjectURL(a.href)},'image/png')};
draw();counts();

