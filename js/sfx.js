// SOUND (Web Audio API - no files needed)
const SFX=(()=>{
  let ctx=null;
  function ac(){if(!ctx){try{ctx=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}return ctx}
  function tone(freq,type,dur,vol,atk){
    try{const c=ac();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(0,c.currentTime);g.gain.linearRampToValueAtTime(vol||.25,c.currentTime+(atk||.01));g.gain.exponentialRampToValueAtTime(.001,c.currentTime+dur);o.start();o.stop(c.currentTime+dur)}catch(e){}}
  function noise(dur,vol){
    try{const c=ac();if(!c)return;const buf=c.createBuffer(1,c.sampleRate*dur,c.sampleRate),d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;const s=c.createBufferSource(),g=c.createGain();s.buffer=buf;s.connect(g);g.connect(c.destination);g.gain.setValueAtTime(vol||.15,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+dur);s.start();s.stop(c.currentTime+dur)}catch(e){}}
  return{
    shoot(){tone(900,'sawtooth',.08,.2);tone(1300,'square',.05,.08)},
    correct(){tone(523,'sine',.1,.25);setTimeout(()=>tone(659,'sine',.1,.25),80);setTimeout(()=>tone(784,'sine',.18,.3),160)},
    wrong(){tone(220,'sawtooth',.15,.3);noise(.2,.2)},
    explode(){noise(.35,.35);tone(150,'sawtooth',.3,.2)},
    combo(){tone(1047,'sine',.07,.3);setTimeout(()=>tone(1319,'sine',.07,.3),60);setTimeout(()=>tone(1568,'sine',.14,.35),120)},
    win(){for(let i=0;i<6;i++)setTimeout(()=>tone(400+i*150,'sine',.2,.25),i*80)}
  };
})();
