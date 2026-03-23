// PARTICLES
const FX=(()=>{
  const cv=document.getElementById('fx-cv'),cx=cv.getContext('2d');
  let parts=[],running=false;
  const PCOLS=[['#c084fc','#a855f7','#fff'],['#fb923c','#f97316','#fff'],['#67e8f9','#22d3ee','#fff'],['#f472b6','#ec4899','#fff'],['#a3e635','#84cc16','#fff']];
  function rsz(){cv.width=cv.offsetWidth||innerWidth;cv.height=cv.offsetHeight||innerHeight}
  function loop(){
    cx.clearRect(0,0,cv.width,cv.height);
    for(let i=parts.length-1;i>=0;i--){
      const p=parts[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.28;p.life--;p.r*=.95;
      if(p.life<=0){parts.splice(i,1);continue}
      cx.save();cx.globalAlpha=p.life/p.ml;cx.fillStyle=p.col;cx.shadowColor=p.col;cx.shadowBlur=5;
      cx.beginPath();cx.arc(p.x,p.y,Math.max(0,p.r),0,Math.PI*2);cx.fill();cx.restore();
    }
    if(parts.length){requestAnimationFrame(loop)}else{running=false}
  }
  function burst(x,y,cols,n){
    rsz();
    for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=Math.random()*8+2,l=Math.random()*35+18;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-2,r:Math.random()*5+2,col:cols[i%cols.length],life:l,ml:l})}
    if(!running){running=true;requestAnimationFrame(loop)}
  }
  function planet(el){
    const ar=document.getElementById('arena').getBoundingClientRect(),r=el.getBoundingClientRect();
    const ci=[...el.classList].find(c=>c.startsWith('c'));
    burst(r.left+r.width/2-ar.left,r.top+r.height/2-ar.top,PCOLS[(ci?parseInt(ci[1]):0)%5],36);
  }
  function ship(el){
    const ar=document.getElementById('arena').getBoundingClientRect(),r=el.getBoundingClientRect();
    burst(r.left+r.width/2-ar.left,r.top+r.height/2-ar.top,['#ff2d78','#ff9944','#fff','#ffcc00'],24);
  }
  return{planet,ship};
})();
