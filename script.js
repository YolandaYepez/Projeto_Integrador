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
     REGIÃO PARA LEITORES DE TELA
     ========================================== */

  const mensagemAcessibilidade = document.createElement("div");

  mensagemAcessibilidade.setAttribute("aria-live", "polite");
  mensagemAcessibilidade.setAttribute("aria-atomic", "true");
  mensagemAcessibilidade.className = "sr-only";

  document.body.appendChild(mensagemAcessibilidade);


  function anunciar(mensagem) {
    mensagemAcessibilidade.textContent = "";

    setTimeout(function () {
      mensagemAcessibilidade.textContent = mensagem;
    }, 50);
  }


  /* ==========================================
     CONFIGURAÇÕES DE FONTE
     ========================================== */

  const tamanhoNormal = 100;
  const tamanhoMinimo = 80;
  const tamanhoMaximo = 140;
  const incremento = 10;

  let tamanhoFonte =
    parseInt(localStorage.getItem("tamanhoFonte")) || tamanhoNormal;


  function aplicarTamanhoFonte(anunciarMudanca = false) {

    if (tamanhoFonte < tamanhoMinimo) {
      tamanhoFonte = tamanhoMinimo;
    }

    if (tamanhoFonte > tamanhoMaximo) {
      tamanhoFonte = tamanhoMaximo;
    }

    document.documentElement.style.fontSize = tamanhoFonte + "%";

    localStorage.setItem("tamanhoFonte", tamanhoFonte);

    atualizarBotoesFonte();

    if (anunciarMudanca) {

      if (tamanhoFonte === tamanhoNormal) {
        anunciar("Tamanho da fonte restaurado para o tamanho normal.");
      } else {
        anunciar("Tamanho da fonte: " + tamanhoFonte + " por cento.");
      }

    }
  }


  function atualizarBotoesFonte() {

    if (btnIncrease) {

      btnIncrease.disabled = tamanhoFonte >= tamanhoMaximo;

      btnIncrease.setAttribute(
        "aria-disabled",
        tamanhoFonte >= tamanhoMaximo ? "true" : "false"
      );
    }

    if (btnDecrease) {

      btnDecrease.disabled = tamanhoFonte <= tamanhoMinimo;

      btnDecrease.setAttribute(
        "aria-disabled",
        tamanhoFonte <= tamanhoMinimo ? "true" : "false"
      );
    }
  }


  /* ==========================================
     AUMENTAR FONTE
     ========================================== */

  if (btnIncrease) {

    btnIncrease.addEventListener("click", function () {

      if (tamanhoFonte < tamanhoMaximo) {

        tamanhoFonte += incremento;

        aplicarTamanhoFonte(true);

      } else {

        anunciar("A fonte já está no tamanho máximo.");

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

        aplicarTamanhoFonte(true);

      } else {

        anunciar("A fonte já está no tamanho mínimo.");

      }

    });

  }


  /* ==========================================
     RESETAR TAMANHO
     ========================================== */

  if (btnReset) {

    btnReset.addEventListener("click", function () {

      tamanhoFonte = tamanhoNormal;

      aplicarTamanhoFonte(true);

    });

  }


  /* ==========================================
     ALTO CONTRASTE
     ========================================== */

  let contrasteAtivo =
    localStorage.getItem("altoContraste") === "true";


  function aplicarContraste(anunciarMudanca = false) {

    if (contrasteAtivo) {

      body.classList.add("alto-contraste");

      if (btnContrast) {

        btnContrast.setAttribute(
          "aria-pressed",
          "true"
        );

        btnContrast.setAttribute(
          "aria-label",
          "Desativar modo de alto contraste"
        );

        btnContrast.textContent = "Desativar Contraste";
      }

      if (anunciarMudanca) {
        anunciar("Alto contraste ativado.");
      }

    } else {

      body.classList.remove("alto-contraste");

      if (btnContrast) {

        btnContrast.setAttribute(
          "aria-pressed",
          "false"
        );

        btnContrast.setAttribute(
          "aria-label",
          "Ativar modo de alto contraste"
        );

        btnContrast.textContent = "Alto Contraste";
      }

      if (anunciarMudanca) {
        anunciar("Alto contraste desativado.");
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

      aplicarContraste(true);

    });

  }


  /* ==========================================
     NAVEGAÇÃO SUAVE
     ========================================== */

  const movimentoReduzido =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;


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
        behavior: movimentoReduzido ? "auto" : "smooth",
        block: "start"
      });

      history.pushState(null, "", destino);

      /* Coloca foco na seção para facilitar navegação por teclado */
      if (!elemento.hasAttribute("tabindex")) {
        elemento.setAttribute("tabindex", "-1");
      }

      elemento.focus({ preventScroll: true });

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

            link.removeAttribute("aria-current");

            if (
              link.getAttribute("href") === "#" + id
            ) {

              link.classList.add("ativo");

              link.setAttribute(
                "aria-current",
                "location"
              );

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

  botaoTopo.type = "button";

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
      behavior: movimentoReduzido ? "auto" : "smooth"
    });

    anunciar("Você voltou ao topo da página.");

    /* Devolve o foco para o início da página */
    window.setTimeout(function () {

      const tituloPrincipal =
        document.querySelector("h1");

      if (tituloPrincipal) {

        if (!tituloPrincipal.hasAttribute("tabindex")) {
          tituloPrincipal.setAttribute("tabindex", "-1");
        }

        tituloPrincipal.focus();

      }

    }, movimentoReduzido ? 0 : 300);

  });


  /* ==========================================
     ATALHOS DE TECLADO
     
     ALT + A = ALTO CONTRASTE
     ALT + + = AUMENTAR FONTE
     ALT + - = DIMINUIR FONTE
     ALT + 0 = TAMANHO NORMAL
     ========================================== */

  document.addEventListener("keydown", function (event) {

    /*
      Não ativar os atalhos enquanto a pessoa
      estiver digitando em um campo.
    */

    const elementoAtivo = document.activeElement;

    const digitando =
      elementoAtivo &&
      (
        elementoAtivo.tagName === "INPUT" ||
        elementoAtivo.tagName === "TEXTAREA" ||
        elementoAtivo.isContentEditable
      );

    if (digitando) {
      return;
    }

    if (!event.altKey) {
      return;
    }


    if (event.key === "a" || event.key === "A") {

      contrasteAtivo = !contrasteAtivo;

      aplicarContraste(true);

      event.preventDefault();

    }


    if (event.key === "+" || event.key === "=") {

      if (tamanhoFonte < tamanhoMaximo) {

        tamanhoFonte += incremento;

        aplicarTamanhoFonte(true);

      } else {

        anunciar("A fonte já está no tamanho máximo.");

      }

      event.preventDefault();

    }


    if (event.key === "-") {

      if (tamanhoFonte > tamanhoMinimo) {

        tamanhoFonte -= incremento;

        aplicarTamanhoFonte(true);

      } else {

        anunciar("A fonte já está no tamanho mínimo.");

      }

      event.preventDefault();

    }


    if (event.key === "0") {

      tamanhoFonte = tamanhoNormal;

      aplicarTamanhoFonte(true);

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