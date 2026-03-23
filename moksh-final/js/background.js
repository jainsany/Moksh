// STARFIELD (start screen)
(function(){
  const cv=document.getElementById('star-cv');if(!cv)return;
  const cx=cv.getContext('2d');let st=[];
  function rsz(){cv.width=innerWidth;cv.height=innerHeight;st=Array.from({length:200},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,r:Math.random()*1.4+.2,s:Math.random()*.35+.04,o:Math.random()}))}
  function draw(){cx.clearRect(0,0,cv.width,cv.height);st.forEach(s=>{s.o+=(Math.random()-.5)*.04;s.o=Math.max(.05,Math.min(1,s.o));s.y+=s.s;if(s.y>cv.height){s.y=0;s.x=Math.random()*cv.width}cx.beginPath();cx.arc(s.x,s.y,s.r,0,Math.PI*2);cx.fillStyle='rgba(255,255,255,'+s.o+')';cx.fill()});requestAnimationFrame(draw)}
  window.addEventListener('resize',rsz);rsz();draw();
})();

// BG CANVAS (game: scrolling stars + meteors + speed lines)
const BG=(()=>{
  const cv=document.getElementById('bg-cv'),cx=cv.getContext('2d');
  let W,H,stars=[],meteors=[],lines=[];
  function rsz(){W=cv.width=cv.offsetWidth||innerWidth;H=cv.height=cv.offsetHeight||innerHeight;stars=Array.from({length:200},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.3+.2,spd:Math.random()*.5+.15,o:Math.random()}));lines=Array.from({length:22},mkL)}
  function mkL(){return{x:Math.random()*(W||800),y:Math.random()*(H||600),len:Math.random()*50+20,spd:Math.random()*2.5+1.5,o:Math.random()*.12+.04}}
  function spM(){if(!W)return;meteors.push({x:Math.random()*W*.8+W*.1,y:-20,len:Math.random()*90+50,spd:Math.random()*6+4,ang:Math.PI/4+(Math.random()-.5)*.35,o:.9,col:Math.random()<.3?'#ff9944':'#ffffff'})}
  function draw(){
    if(!W)rsz();cx.clearRect(0,0,W,H);
    lines.forEach(l=>{l.x-=l.spd;l.y+=l.spd*.1;if(l.x<-l.len||l.y>H)Object.assign(l,mkL(),{x:W+50,y:Math.random()*H});cx.save();cx.globalAlpha=l.o;cx.strokeStyle='#00f0ff';cx.lineWidth=.7;cx.beginPath();cx.moveTo(l.x,l.y);cx.lineTo(l.x+l.len,l.y);cx.stroke();cx.restore()});
    stars.forEach(s=>{s.y+=s.spd;s.o+=(Math.random()-.5)*.04;s.o=Math.max(.05,Math.min(1,s.o));if(s.y>H){s.y=0;s.x=Math.random()*W}cx.beginPath();cx.arc(s.x,s.y,s.r,0,Math.PI*2);cx.fillStyle='rgba(255,255,255,'+s.o+')';cx.fill()});
    for(let i=meteors.length-1;i>=0;i--){const m=meteors[i];m.x+=Math.cos(m.ang)*m.spd;m.y+=Math.sin(m.ang)*m.spd;m.o-=.02;if(m.o<=0||m.x>W+50||m.y>H+50){meteors.splice(i,1);continue}cx.save();cx.globalAlpha=m.o;const g=cx.createLinearGradient(m.x,m.y,m.x-Math.cos(m.ang)*m.len,m.y-Math.sin(m.ang)*m.len);g.addColorStop(0,m.col);g.addColorStop(1,'transparent');cx.strokeStyle=g;cx.lineWidth=1.8;cx.beginPath();cx.moveTo(m.x,m.y);cx.lineTo(m.x-Math.cos(m.ang)*m.len,m.y-Math.sin(m.ang)*m.len);cx.stroke();cx.beginPath();cx.arc(m.x,m.y,2,0,Math.PI*2);cx.fillStyle=m.col;cx.fill();cx.restore()}
    requestAnimationFrame(draw);
  }
  function start(){rsz();draw();setInterval(spM,1100)}
  return{start,rsz};
})();
