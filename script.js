document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const btnVerify = document.getElementById('btn-verify');

  // Alternar Menu Mobile
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show-menu');
    });
  }

  // Interação Temática: Simulação de Verificação de Notícia
  if (btnVerify) {
    btnVerify.addEventListener('click', () => {
      const url = prompt("Cole o link ou título da notícia para checar:");
      
      if (url) {
        // Exemplo simples de retorno interativo
        alert("🔍 Analisando fontes confiáveis e banco de dados...");
        setTimeout(() => {
          alert("⚠️ ATENÇÃO: Esta informação possui alto índice de ser inconsistente. Sempre verifique fontes oficiais!");
        }, 800);
      }
    });
  }
});