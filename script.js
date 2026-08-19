document.addEventListener("DOMContentLoaded", function () {

  /* ==========================================
     ELEMENTOS PRINCIPAIS
     ========================================== */

  const body = document.body;

  const btnContrast = document.getElementById("btn-contrast");
  const btnIncrease = document.getElementById("btn-increase");
  const btnDecrease = document.getElementById("btn-decrease");
  const btnReset = document.getElementById("btn-reset");

  const navLinks = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll("main section");


  /* ==========================================
     CONFIGURAÇÕES DE FONTE
     ========================================== */

  const tamanhoNormal = 100;
  const tamanhoMinimo = 80;
  const tamanhoMaximo = 140;
  const incremento = 10;

  let tamanhoFonte =
    parseInt(localStorage.getItem("tamanhoFonte")) || tamanhoNormal;


  function aplicarTamanhoFonte() {

    if (tamanhoFonte < tamanhoMinimo) {
      tamanhoFonte = tamanhoMinimo;
    }

    if (tamanhoFonte > tamanhoMaximo) {
      tamanhoFonte = tamanhoMaximo;
    }

    document.documentElement.style.fontSize = tamanhoFonte + "%";

    localStorage.setItem("tamanhoFonte", tamanhoFonte);

    atualizarBotoesFonte();
  }


  function atualizarBotoesFonte() {

    if (btnIncrease) {
      btnIncrease.disabled = tamanhoFonte >= tamanhoMaximo;
    }

    if (btnDecrease) {
      btnDecrease.disabled = tamanhoFonte <= tamanhoMinimo;
    }
  }


  /* ==========================================
     AUMENTAR FONTE
     ========================================== */

  if (btnIncrease) {

    btnIncrease.addEventListener("click", function () {

      if (tamanhoFonte < tamanhoMaximo) {

        tamanhoFonte += incremento;

        aplicarTamanhoFonte();
      }

    });

  }


  /* ==========================================
     DIMINUIR FONTE
     ========================================== */

  if (btnDecrease) {

    btnDecrease.addEventListener("click", function () {

      if (tamanhoFonte > tamanhoMinimo) {

        tamanhoFonte -= incremento;

        aplicarTamanhoFonte();
      }

    });

  }


  /* ==========================================
     RESETAR TAMANHO
     ========================================== */

  if (btnReset) {

    btnReset.addEventListener("click", function () {

      tamanhoFonte = tamanhoNormal;

      aplicarTamanhoFonte();

    });

  }


  /* ==========================================
     ALTO CONTRASTE
     ========================================== */

  let contrasteAtivo =
    localStorage.getItem("altoContraste") === "true";


  function aplicarContraste() {

    if (contrasteAtivo) {

      body.classList.add("alto-contraste");

      if (btnContrast) {
        btnContrast.setAttribute(
          "aria-pressed",
          "true"
        );

        btnContrast.textContent = "Desativar Contraste";
      }

    } else {

      body.classList.remove("alto-contraste");

      if (btnContrast) {
        btnContrast.setAttribute(
          "aria-pressed",
          "false"
        );

        btnContrast.textContent = "Alto Contraste";
      }

    }

    localStorage.setItem(
      "altoContraste",
      contrasteAtivo
    );
  }


  if (btnContrast) {

    btnContrast.addEventListener("click", function () {

      contrasteAtivo = !contrasteAtivo;

      aplicarContraste();

    });

  }


  /* ==========================================
     NAVEGAÇÃO SUAVE
     ========================================== */

  navLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

      const destino = link.getAttribute("href");

      if (!destino || !destino.startsWith("#")) {
        return;
      }

      const elemento = document.querySelector(destino);

      if (!elemento) {
        return;
      }

      event.preventDefault();

      elemento.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      history.pushState(null, "", destino);

    });

  });


  /* ==========================================
     DESTAQUE DA SEÇÃO ATUAL
     ========================================== */

  const observer = new IntersectionObserver(

    function (entradas) {

      entradas.forEach(function (entrada) {

        if (entrada.isIntersecting) {

          const id = entrada.target.getAttribute("id");

          navLinks.forEach(function (link) {

            link.classList.remove("ativo");

            if (
              link.getAttribute("href") === "#" + id
            ) {

              link.classList.add("ativo");

            }

          });

        }

      });

    },

    {
      threshold: 0.25
    }

  );


  sections.forEach(function (section) {

    observer.observe(section);

  });


  /* ==========================================
     ANIMAÇÃO DAS SEÇÕES
     ========================================== */

  const animationObserver = new IntersectionObserver(

    function (entradas, observer) {

      entradas.forEach(function (entrada) {

        if (entrada.isIntersecting) {

          entrada.target.classList.add("visivel");

          observer.unobserve(entrada.target);

        }

      });

    },

    {
      threshold: 0.1
    }

  );


  sections.forEach(function (section) {

    section.classList.add("animar");

    animationObserver.observe(section);

  });


  /* ==========================================
     BOTÃO VOLTAR AO TOPO
     ========================================== */

  const botaoTopo = document.createElement("button");

  botaoTopo.id = "btn-topo";

  botaoTopo.setAttribute(
    "aria-label",
    "Voltar ao topo da página"
  );

  botaoTopo.setAttribute(
    "title",
    "Voltar ao topo"
  );

  botaoTopo.innerHTML = "↑";

  document.body.appendChild(botaoTopo);


  window.addEventListener("scroll", function () {

    if (window.scrollY > 500) {

      botaoTopo.classList.add("mostrar");

    } else {

      botaoTopo.classList.remove("mostrar");

    }

  });


  botaoTopo.addEventListener("click", function () {

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  });


  /* ==========================================
     ATALHO DE TECLADO
     ALT + A = ALTO CONTRASTE
     ALT + + = AUMENTAR FONTE
     ALT + - = DIMINUIR FONTE
     ALT + 0 = TAMANHO NORMAL
     ========================================== */

  document.addEventListener("keydown", function (event) {

    if (!event.altKey) {
      return;
    }


    if (event.key === "a" || event.key === "A") {

      contrasteAtivo = !contrasteAtivo;

      aplicarContraste();

      event.preventDefault();

    }


    if (event.key === "+") {

      if (tamanhoFonte < tamanhoMaximo) {

        tamanhoFonte += incremento;

        aplicarTamanhoFonte();

      }

      event.preventDefault();

    }


    if (event.key === "-") {

      if (tamanhoFonte > tamanhoMinimo) {

        tamanhoFonte -= incremento;

        aplicarTamanhoFonte();

      }

      event.preventDefault();

    }


    if (event.key === "0") {

      tamanhoFonte = tamanhoNormal;

      aplicarTamanhoFonte();

      event.preventDefault();

    }

  });


  /* ==========================================
     ACESSIBILIDADE DOS BOTÕES
     ========================================== */

  if (btnContrast) {
    btnContrast.setAttribute(
      "aria-pressed",
      contrasteAtivo ? "true" : "false"
    );
  }


  /* ==========================================
     RESTAURAR CONFIGURAÇÕES SALVAS
     ========================================== */

  aplicarTamanhoFonte();

  aplicarContraste();


  /* ==========================================
     MENSAGEM NO CONSOLE
     ========================================== */

  console.log(
    "Portal de Acessibilidade e Ciência carregado com sucesso!"
  );

});
