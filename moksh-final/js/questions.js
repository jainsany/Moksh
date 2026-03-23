// QUESTIONS
const QS=[
  {q:"Largest planet in solar system?",o:["Saturn","Jupiter","Neptune","Uranus"],a:1},
  {q:"How many sides does a hexagon have?",o:["5","7","6","8"],a:2},
  {q:"Chemical symbol for water?",o:["WA","HO","H2O","O2H"],a:2},
  {q:"Which country invented pizza?",o:["France","Greece","Spain","Italy"],a:3},
  {q:"What is 12 x 12?",o:["124","144","132","148"],a:1},
  {q:"Approximate speed of light?",o:["3x10^8 m/s","3x10^6 m/s","3x10^4","3x10^10"],a:0},
  {q:"Who wrote Romeo and Juliet?",o:["Dickens","Tolstoy","Shakespeare","Hemingway"],a:2},
  {q:"Smallest prime number?",o:["0","1","2","3"],a:2},
  {q:"Which planet is the Red Planet?",o:["Venus","Mercury","Saturn","Mars"],a:3},
  {q:"Gas plants absorb from air?",o:["Oxygen","Nitrogen","CO2","Hydrogen"],a:2},
  {q:"How many continents on Earth?",o:["5","6","8","7"],a:3},
  {q:"Powerhouse of the cell?",o:["Nucleus","Ribosome","Mitochondria","Vacuole"],a:2},
  {q:"Capital of France?",o:["Berlin","Madrid","Paris","Rome"],a:2},
  {q:"Bones in the human body?",o:["196","206","216","226"],a:1},
  {q:"Boiling point of water in Celsius?",o:["90","95","100","105"],a:2},
];
function pickQ(n){return[...QS].sort(()=>Math.random()-.5).slice(0,n)}
