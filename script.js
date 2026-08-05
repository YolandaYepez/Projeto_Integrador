document.addEventListener('DOMContentLoaded', () => {
  const btnContrast = document.getElementById('btn-contrast');
  const btnIncrease = document.getElementById('btn-increase');
  const btnDecrease = document.getElementById('btn-decrease');
  const btnReset = document.getElementById('btn-reset');

  let currentFontSize = 18;

  // Botão de Alto Contraste
  btnContrast.addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
  });

  // Botão Aumentar Fonte
  btnIncrease.addEventListener('click', () => {
    if (currentFontSize < 28) {
      currentFontSize += 2;
      document.body.style.fontSize = currentFontSize + 'px';
    }
  });

  // Botão Diminuir Fonte
  btnDecrease.addEventListener('click', () => {
    if (currentFontSize > 14) {
      currentFontSize -= 2;
      document.body.style.fontSize = currentFontSize + 'px';
    }
  });

  // Botão Resetar Fonte
  btnReset.addEventListener('click', () => {
    currentFontSize = 18;
    document.body.style.fontSize = '18px';
  });
});