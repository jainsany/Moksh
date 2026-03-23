// CONFETTI
const Confetti=(()=>{
  const COLS=['#ffd700','#00f0ff','#ff2d78','#00ff88','#a855f7','#f97316'];
  let cv,cx,parts=[],raf;
  function start(){cv=document.getElementById('cc');cx=cv.getContext('2d');cv.width=innerWidth;cv.height=innerHeight;cancelAnimationFrame(raf);parts=Array.from({length:160},()=>({x:Math.random()*cv.width,y:-10,vx:(Math.random()-.5)*5,vy:Math.random()*3+2,rot:Math.random()*360,rv:(Math.random()-.5)*7,w:Math.random()*11+5,h:Math.random()*5+3,col:COLS[Math.floor(Math.random()*COLS.length)],a:1}));loop()}
  function loop(){cx.clearRect(0,0,cv.width,cv.height);parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.06;p.rot+=p.rv;if(p.y>cv.height*.75)p.a-=.018;cx.save();cx.globalAlpha=Math.max(0,p.a);cx.translate(p.x,p.y);cx.rotate(p.rot*Math.PI/180);cx.fillStyle=p.col;cx.fillRect(-p.w/2,-p.h/2,p.w,p.h);cx.restore()});parts=parts.filter(p=>p.a>0);if(parts.length)raf=requestAnimationFrame(loop)}
  function stop(){cancelAnimationFrame(raf);if(cx)cx.clearRect(0,0,cv.width,cv.height)}
  return{start,stop};
})();
