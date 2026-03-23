// GAME
const EMOJIS=['🌍','🪐','🌑','🔴','🟣','🟠','🔵','🟢'];
const PCOUNT=8,CPTS=100,WPTS=50;
let G={};

const arena=document.getElementById('arena'),
      shipEl=document.getElementById('ship'),
      bulletEl=document.getElementById('bullet'),
      planetsEl=document.getElementById('planets'),
      modalBg=document.getElementById('modal-bg'),
      flashEl=document.getElementById('flash');

function showScreen(id){['s-start','s-game','s-win'].forEach(s=>document.getElementById(s).classList.remove('active'));document.getElementById(id).classList.add('active')}

function hud(){
  if(G.combo>G.best)G.best=G.combo;
  document.getElementById('hlives').textContent=G.lives>0?'❤️'.repeat(G.lives):'💀';
  document.getElementById('hscore').textContent=G.score;
  document.getElementById('hdone').textContent=G.done;
  document.getElementById('htotal').textContent=G.qs.length;
  const b=document.getElementById('combo-badge');
  if(G.combo>=2){document.getElementById('cnum').textContent=G.combo;b.classList.add('show')}
  else b.classList.remove('show');
}




function placeShip(){
  const aw=arena.offsetWidth,ah=arena.offsetHeight;
  const sw=shipEl.offsetWidth||50,sh=shipEl.offsetHeight||50;
  shipEl.style.cssText='position:absolute;font-size:clamp(2rem,6vw,2.8rem);z-index:10;user-select:none;line-height:1;'
    +'left:'+Math.round(aw/2-sw/2)+'px;top:'+Math.round(ah-sh-20)+'px;'
    +'transform:rotate(0deg);'
    +'filter:drop-shadow(0 0 10px #00f0ff) drop-shadow(0 0 22px #00f0ff);'
    +'animation:bob 2.2s ease-in-out infinite;';
}

function cof(el){const ar=arena.getBoundingClientRect(),r=el.getBoundingClientRect();return{x:r.left+r.width/2-ar.left,y:r.top+r.height/2-ar.top}}

function aimAt(pl){
  const sc=cof(shipEl),pc=cof(pl);
  const deg=Math.atan2(pc.x-sc.x,-(pc.y-sc.y))*180/Math.PI;
  shipEl.style.animation='none';
  shipEl.style.transform='rotate('+deg+'deg)';
  shipEl.style.setProperty('--sa','rotate('+deg+'deg)');
}

function scorePop(text,color,el){
  const ar=arena.getBoundingClientRect(),r=el.getBoundingClientRect();
  const d=document.createElement('div');
  d.className='score-pop';d.textContent=text;d.style.color=color;d.style.textShadow='0 0 10px '+color;
  d.style.left=(r.left+r.width/2-ar.left-20)+'px';d.style.top=(r.top+r.height/2-ar.top-20)+'px';
  arena.appendChild(d);setTimeout(()=>d.remove(),1200);
}

function doFlash(col){
  flashEl.style.background=col;flashEl.style.animation='none';
  void flashEl.offsetWidth;flashEl.style.animation='flash .5s ease-out forwards';
}

function buildPlanets(){
  planetsEl.innerHTML='';
  G.qs.forEach((q,i)=>{
    const el=document.createElement('div');
    el.className='planet c'+i%5;el.textContent=EMOJIS[i%EMOJIS.length];
    el.style.animationDelay=(i*.4)%3+'s';
    el.addEventListener('click',()=>clickPlanet(i));
    planetsEl.appendChild(el);
  });
}

function clickPlanet(i){
  if(!G.on||G.busy)return;
  const pl=planetsEl.children[i];
  if(pl.classList.contains('dead'))return;
  aimAt(pl);openModal(i);
}

function openModal(i){
  const q=G.qs[i];
  document.getElementById('mq').textContent=q.q;
  document.getElementById('mopts').innerHTML='';
  document.getElementById('mfb').textContent='';document.getElementById('mfb').className='';
  q.o.forEach((opt,oi)=>{
    const b=document.createElement('button');b.className='opt';b.textContent=opt;
    b.addEventListener('click',()=>answer(oi,q.a,i));
    document.getElementById('mopts').appendChild(b);
  });
  modalBg.classList.add('show');
}
function closeModal(){modalBg.classList.remove('show')}

function answer(chosen,correct,pi){
  document.getElementById('mopts').querySelectorAll('.opt').forEach(b=>b.disabled=true);
  const btns=document.getElementById('mopts').querySelectorAll('.opt');
  if(chosen===correct){
    btns[chosen].classList.add('ok');
    G.combo++;
    const mult=G.combo>=3?1+(G.combo-2)*.25:1;
    const pts=Math.round(CPTS*mult);
    G.score+=pts;
    const fb=G.combo>=3?'COMBO x'+G.combo+'! +'+pts+' pts!':'CORRECT! +'+pts;
    document.getElementById('mfb').textContent=fb;document.getElementById('mfb').className='ok';
    if(G.combo>=3)SFX.combo();else SFX.correct();
    hud();
    setTimeout(()=>{closeModal();shootFwd(pi,pts);},620);
  }else{
    btns[chosen].classList.add('bad');btns[correct].classList.add('ok');
    G.combo=0;
    document.getElementById('mfb').textContent='WRONG! -'+WPTS+' pts';document.getElementById('mfb').className='bad';
    SFX.wrong();hud();
    setTimeout(()=>{closeModal();shootRev(pi);},700);
  }
}

function fireBullet(sx,sy,ex,ey,col,ms,cb){
  const b=bulletEl;
  b.style.cssText='display:block;position:absolute;width:6px;height:22px;border-radius:3px;z-index:30;pointer-events:none;'
    +'background:linear-gradient(to top,'+col+',#fff);box-shadow:0 0 10px '+col+',0 0 22px '+col+';'
    +'left:'+(sx-3)+'px;top:'+(sy-11)+'px;transition:none;';
  void b.offsetWidth;
  b.style.transition='top '+ms+'ms linear,left '+ms+'ms linear';
  b.style.left=(ex-3)+'px';b.style.top=(ey-11)+'px';
  SFX.shoot();
  setTimeout(()=>{b.style.cssText='display:none;';cb();},ms+40);
}

function shootFwd(pi,pts){
  G.busy=true;const sc=cof(shipEl),pc=cof(planetsEl.children[pi]);
  fireBullet(sc.x,sc.y,pc.x,pc.y,'#00f0ff',380,()=>destroyPlanet(pi,pts));
}
function shootRev(pi){
  G.busy=true;const sc=cof(shipEl),pc=cof(planetsEl.children[pi]);
  fireBullet(pc.x,pc.y,sc.x,sc.y,'#ff2d78',420,()=>hitShip());
}

function hitShip(){
  FX.ship(shipEl);doFlash('#ff2d78');
  shipEl.style.animation='shiphit .72s ease-out forwards';
  shipEl.style.filter='drop-shadow(0 0 30px #ff2d78) drop-shadow(0 0 60px #ff2d78)';
  setTimeout(()=>{G.lives=Math.max(0,G.lives-1);G.score-=WPTS;hud();placeShip();G.busy=false;if(G.lives<=0)setTimeout(gameOver,400)},750);
}

function destroyPlanet(pi,pts){
  const pl=planetsEl.children[pi];
  SFX.explode();FX.planet(pl);
  scorePop('+'+(pts||CPTS),'#00ff88',pl);
  pl.classList.add('dead');G.done++;hud();
  shipEl.style.animation='shipdash .45s ease-out forwards';
  setTimeout(()=>{placeShip();G.busy=false;if(G.done>=G.qs.length)setTimeout(winGame,400)},480);
}

function winGame(){
  G.on=false;SFX.win();
  document.getElementById('wscore').textContent=G.score;
  document.getElementById('wcombo').textContent=G.best>=3?'Best combo: FIRE x'+G.best:'';
  showScreen('s-win');Confetti.start();
}

function gameOver(){
  G.on=false;
  doFlash('#ff2d78');
  arena.style.background='radial-gradient(ellipse at center,#2a0010 0%,#03030f 80%)';
  setTimeout(()=>{arena.style.background='';alert('No lives left! Score: '+G.score);startGame()},600);
}

function startGame(){
  Confetti.stop();
  G={qs:pickQ(PCOUNT),done:0,score:0,lives:3,combo:0,best:0,busy:false,on:true};
  buildPlanets();hud();
  showScreen('s-game');BG.rsz();
  requestAnimationFrame(()=>requestAnimationFrame(()=>{BG.rsz();placeShip()}));
}

document.getElementById('btn-start').addEventListener('click',startGame);
document.getElementById('btn-again').addEventListener('click',startGame);
modalBg.addEventListener('click',e=>{if(e.target===modalBg)closeModal()});

BG.start();
