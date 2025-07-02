document.addEventListener('DOMContentLoaded', () => {

  const satForm   = document.getElementById('sat-form');
  const satResult = document.getElementById('sat-result');

  const scaleScore = (raw, maxRaw, maxScore) => {
    if (raw < 0) return 0;
    if (raw >= maxRaw) return maxScore;
    return Math.round((raw / maxRaw) * maxScore / 10) * 10;
  };

  satForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const readingRaw = Number(document.getElementById('sat-reading-raw').value);
    const writingRaw = Number(document.getElementById('sat-writing-raw').value);
    const mathRaw = Number(document.getElementById('sat-math-raw').value);

    if ([readingRaw, writingRaw, mathRaw].some(v => Number.isNaN(v))) {
      satResult.textContent = 'Please enter valid numbers.';
      return;
    }
    if (readingRaw < 0 || readingRaw > 52 || writingRaw < 0 || writingRaw > 44 || mathRaw < 0 || mathRaw > 58) {
      satResult.textContent = 'Please enter values within the specified ranges.';
      return;
    }

    const readingTestScore = scaleScore(readingRaw, 52, 40);
    const writingTestScore = scaleScore(writingRaw, 44, 40);
    const mathTestScore = scaleScore(mathRaw, 58, 40);

    const ebrwScore = (readingTestScore + writingTestScore) * 10;
    const mathScore = mathTestScore * 20;

    const finalEbrw = Math.max(200, ebrwScore);
    const finalMath = Math.max(200, mathScore);

    satResult.textContent = `Total SAT Score: ${finalEbrw + finalMath} (EBRW: ${finalEbrw}, Math: ${finalMath})`;
  });

  const actForm   = document.getElementById('act-form');
  const actResult = document.getElementById('act-result');

  actForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = ['act-english', 'act-math', 'act-reading', 'act-science'];
    const scores = fields.map(id => Number(document.getElementById(id).value));

    if (scores.some(v => Number.isNaN(v))) {
      actResult.textContent = 'Please enter a number for all sections.';
      return;
    }
    if (scores.some(v => v < 1 || v > 36)) {
      actResult.textContent = 'Section scores must be between 1 and 36.';
      return;
    }

    const composite = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    actResult.textContent = `ACT Composite Score: ${composite}`;
  });
});