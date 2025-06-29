document.addEventListener('DOMContentLoaded', () => {
  const readInput = document.getElementById('raw-reading');
  const mathInput = document.getElementById('raw-math');
  const resultDiv = document.getElementById('result');

  const readingScale = [200,210,210,210,210,210,210,220,220,230,230,240,240,250,260,270,300,310,320,330,330,340,350,350,360,370,380,380,390,400,410,410,420,430,440,450,460,470,470,480,490,500,510,520,530,550,560,570,580,590,600,610,620,630,640,660,670,680,690,700,710,720,730,740,760,780,800];
  const mathScale   = [200,210,210,210,210,210,210,220,230,240,260,290,320,330,340,350,350,360,370,380,380,390,390,400,410,420,430,440,450,460,460,480,490,500,510,520,530,550,560,590,600,610,630,650,670,690,710,740,760,770,780,790,800,800];

  document.getElementById('calculate-btn').addEventListener('click', () => {
    const rawRead = Math.min(Math.max(parseInt(readInput.value) || 0, 0), readingScale.length - 1);
    const rawMath = Math.min(Math.max(parseInt(mathInput.value) || 0, 0), mathScale.length - 1);

    const scaledRead = readingScale[rawRead];
    const scaledMath = mathScale[rawMath];
    const totalScore = scaledRead + scaledMath;

    resultDiv.textContent = `Your SAT score: ${scaledRead} (RW) + ${scaledMath} (Math) = ${totalScore}`;
  });
});