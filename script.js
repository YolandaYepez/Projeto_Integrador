document.addEventListener('DOMContentLoaded', () => {
  const btnIncrease = document.getElementById('btn-increase-font');
  const btnDecrease = document.getElementById('btn-decrease-font');
  const btnContrast = document.getElementById('btn-toggle-contrast');

  let currentFontSize = 100; // Porcentagem do tamanho da fonte

  // Ajuste Dinâmico de Fonte
  btnIncrease.addEventListener('click', () => {
    if (currentFontSize < 150) {
      currentFontSize += 10;
      document.body.style.fontSize = `${currentFontSize}%`;
    }
  });

  btnDecrease.addEventListener('click', () => {
    if (currentFontSize > 90) {
      currentFontSize -= 10;
      document.body.style.fontSize = `${currentFontSize}%`;
    }
  });

  // Alternância do Modo Alto Contraste
  btnContrast.addEventListener('click', () => {
    document.body.classList.toggle('high-contrast');
  });
});