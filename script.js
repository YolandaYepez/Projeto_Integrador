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
     ACESSIBILIDADE - REGIÃO DE AVISO
     Para leitores de tela
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
     MOVIMENTO REDUZIDO
     ========================================== */

  const movimentoReduzido =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;


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

    document.documentElement.style.fontSize =
      tamanhoFonte + "%";

    localStorage.setItem(
      "tamanhoFonte",
      tamanhoFonte
    );

    atualizarBotoesFonte();


    if (anunciarMudanca) {

      if (tamanhoFonte === tamanhoNormal) {

        anunciar(
          "Tamanho da fonte restaurado para o tamanho normal."
        );

      } else {

        anunciar(
          "Tamanho da fonte: " +
          tamanhoFonte +
          " por cento."
        );

      }

    }

  }


  function atualizarBotoesFonte() {

    if (btnIncrease) {

      btnIncrease.disabled =
        tamanhoFonte >= tamanhoMaximo;

      btnIncrease.setAttribute(
        "aria-disabled",
        tamanhoFonte >= tamanhoMaximo
          ? "true"
          : "false"
      );

    }


    if (btnDecrease) {

      btnDecrease.disabled =
        tamanhoFonte <= tamanhoMinimo;

      btnDecrease.setAttribute(
        "aria-disabled",
        tamanhoFonte <= tamanhoMinimo
          ? "true"
          : "false"
      );

    }

  }


  /* ==========================================
     AUMENTAR FONTE
     ========================================== */

  if (btnIncrease) {

    btnIncrease.addEventListener(
      "click",
      function () {

        if (tamanhoFonte < tamanhoMaximo) {

          tamanhoFonte += incremento;

          aplicarTamanhoFonte(true);

        } else {

          anunciar(
            "A fonte já está no tamanho máximo."
          );

        }

      }
    );

  }


  /* ==========================================
     DIMINUIR FONTE
     ========================================== */

  if (btnDecrease) {

    btnDecrease.addEventListener(
      "click",
      function () {

        if (tamanhoFonte > tamanhoMinimo) {

          tamanhoFonte -= incremento;

          aplicarTamanhoFonte(true);

        } else {

          anunciar(
            "A fonte já está no tamanho mínimo."
          );

        }

      }
    );

  }


  /* ==========================================
     RESTAURAR FONTE
     ========================================== */

  if (btnReset) {

    btnReset.addEventListener(
      "click",
      function () {

        tamanhoFonte = tamanhoNormal;

        aplicarTamanhoFonte(true);

      }
    );

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

        btnContrast.textContent =
          "Desativar Contraste";

      }


      if (anunciarMudanca) {

        anunciar(
          "Alto contraste ativado."
        );

      }

    } else {

      body.classList.remove(
        "alto-contraste"
      );


      if (btnContrast) {

        btnContrast.setAttribute(
          "aria-pressed",
          "false"
        );

        btnContrast.setAttribute(
          "aria-label",
          "Ativar modo de alto contraste"
        );

        btnContrast.textContent =
          "Alto Contraste";

      }


      if (anunciarMudanca) {

        anunciar(
          "Alto contraste desativado."
        );

      }

    }


    localStorage.setItem(
      "altoContraste",
      contrasteAtivo
    );

  }


  if (btnContrast) {

    btnContrast.addEventListener(
      "click",
      function () {

        contrasteAtivo =
          !contrasteAtivo;

        aplicarContraste(true);

      }
    );

  }


  /* ==========================================
     CRIAR NOVOS BOTÕES DE ACESSIBILIDADE
     Caso ainda não existam no HTML
     ========================================== */

  const barraAcessibilidade =
    document.querySelector(
      ".accessibility-bar"
    );


  function criarBotao(
    id,
    texto,
    ariaLabel
  ) {

    let botao =
      document.getElementById(id);


    if (!botao && barraAcessibilidade) {

      botao =
        document.createElement("button");

      botao.id = id;

      botao.type = "button";

      botao.textContent = texto;

      botao.setAttribute(
        "aria-label",
        ariaLabel
      );

      barraAcessibilidade.appendChild(
        botao
      );

    }


    return botao;

  }


  const btnReader =
    criarBotao(
      "btn-reader",
      "🔊 Ler Página",
      "Ler página em voz alta"
    );


  const btnStopReader =
    criarBotao(
      "btn-stop-reader",
      "⏹ Parar",
      "Parar leitura da página"
    );


  const btnReadingMode =
    criarBotao(
      "btn-reading-mode",
      "📖 Modo Leitura",
      "Ativar modo de leitura"
    );


  const btnCursor =
    criarBotao(
      "btn-cursor",
      "🖱 Cursor Grande",
      "Ativar cursor grande"
    );


  const btnReadingLine =
    criarBotao(
      "btn-line",
      "📏 Guia de Leitura",
      "Ativar guia de leitura"
    );


  /* ==========================================
     LEITOR DE TEXTO
     ========================================== */

  let lendoPagina = false;


  function pararLeitura() {

    if (
      "speechSynthesis" in window
    ) {

      speechSynthesis.cancel();

    }


    lendoPagina = false;


    if (btnReader) {

      btnReader.textContent =
        "🔊 Ler Página";

      btnReader.setAttribute(
        "aria-label",
        "Ler página em voz alta"
      );

    }


    if (btnStopReader) {

      btnStopReader.disabled =
        true;

    }


    anunciar(
      "Leitura interrompida."
    );

  }


  function iniciarLeitura() {

    if (
      !("speechSynthesis" in window)
    ) {

      anunciar(
        "Seu navegador não oferece leitura de texto por voz."
      );

      return;

    }


    const conteudo =
      document.querySelector("main");


    if (!conteudo) {

      anunciar(
        "Não foi encontrado conteúdo para leitura."
      );

      return;

    }


    speechSynthesis.cancel();


    const texto =
      conteudo.innerText.trim();


    if (!texto) {

      anunciar(
        "Não foi encontrado texto para leitura."
      );

      return;

    }


    const fala =
      new SpeechSynthesisUtterance(
        texto
      );


    fala.lang = "pt-BR";

    fala.rate = 0.95;

    fala.pitch = 1;


    fala.onstart = function () {

      lendoPagina = true;


      if (btnReader) {

        btnReader.textContent =
          "🔊 Lendo...";

      }


      if (btnStopReader) {

        btnStopReader.disabled =
          false;

      }


      anunciar(
        "Leitura da página iniciada."
      );

    };


    fala.onend = function () {

      lendoPagina = false;


      if (btnReader) {

        btnReader.textContent =
          "🔊 Ler Página";

      }


      if (btnStopReader) {

        btnStopReader.disabled =
          true;

      }


      anunciar(
        "Leitura da página concluída."
      );

    };


    fala.onerror = function () {

      lendoPagina = false;


      if (btnReader) {

        btnReader.textContent =
          "🔊 Ler Página";

      }


      if (btnStopReader) {

        btnStopReader.disabled =
          true;

      }


      anunciar(
        "Não foi possível realizar a leitura."
      );

    };


    speechSynthesis.speak(
      fala
    );

  }


  if (btnReader) {

    btnReader.addEventListener(
      "click",
      function () {

        if (lendoPagina) {

          pararLeitura();

        } else {

          iniciarLeitura();

        }

      }
    );

  }


  if (btnStopReader) {

    btnStopReader.disabled = true;


    btnStopReader.addEventListener(
      "click",
      function () {

        pararLeitura();

      }
    );

  }


  /* ==========================================
     MODO DE LEITURA
     ========================================== */

  let modoLeitura =
    localStorage.getItem(
      "modoLeitura"
    ) === "true";


  function aplicarModoLeitura(
    anunciarMudanca = false
  ) {

    body.classList.toggle(
      "modo-leitura",
      modoLeitura
    );


    if (btnReadingMode) {

      btnReadingMode.setAttribute(
        "aria-pressed",
        modoLeitura
          ? "true"
          : "false"
      );


      btnReadingMode.textContent =
        modoLeitura
          ? "📖 Modo Leitura: ON"
          : "📖 Modo Leitura";


      btnReadingMode.setAttribute(
        "aria-label",
        modoLeitura
          ? "Desativar modo de leitura"
          : "Ativar modo de leitura"
      );

    }


    localStorage.setItem(
      "modoLeitura",
      modoLeitura
    );


    if (anunciarMudanca) {

      anunciar(
        modoLeitura
          ? "Modo de leitura ativado."
          : "Modo de leitura desativado."
      );

    }

  }


  if (btnReadingMode) {

    btnReadingMode.addEventListener(
      "click",
      function () {

        modoLeitura =
          !modoLeitura;

        aplicarModoLeitura(
          true
        );

      }
    );

  }


  /* ==========================================
     CURSOR GRANDE
     ========================================== */

  let cursorGrande =
    localStorage.getItem(
      "cursorGrande"
    ) === "true";


  function aplicarCursorGrande(
    anunciarMudanca = false
  ) {

    body.classList.toggle(
      "cursor-grande",
      cursorGrande
    );


    if (btnCursor) {

      btnCursor.setAttribute(
        "aria-pressed",
        cursorGrande
          ? "true"
          : "false"
      );


      btnCursor.textContent =
        cursorGrande
          ? "🖱 Cursor: ON"
          : "🖱 Cursor Grande";


      btnCursor.setAttribute(
        "aria-label",
        cursorGrande
          ? "Desativar cursor grande"
          : "Ativar cursor grande"
      );

    }


    localStorage.setItem(
      "cursorGrande",
      cursorGrande
    );


    if (anunciarMudanca) {

      anunciar(
        cursorGrande
          ? "Cursor grande ativado."
          : "Cursor grande desativado."
      );

    }

  }


  if (btnCursor) {

    btnCursor.addEventListener(
      "click",
      function () {

        cursorGrande =
          !cursorGrande;

        aplicarCursorGrande(
          true
        );

      }
    );

  }


  /* ==========================================
     GUIA DE LEITURA
     ========================================== */

  let guiaAtiva =
    localStorage.getItem(
      "guiaLeitura"
    ) === "true";


  const linhaLeitura =
    document.createElement("div");


  linhaLeitura.id =
    "linha-leitura";


  linhaLeitura.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.appendChild(
    linhaLeitura
  );


  function aplicarGuiaLeitura(
    anunciarMudanca = false
  ) {

    linhaLeitura.style.display =
      guiaAtiva
        ? "block"
        : "none";


    if (btnReadingLine) {

      btnReadingLine.setAttribute(
        "aria-pressed",
        guiaAtiva
          ? "true"
          : "false"
      );


      btnReadingLine.textContent =
        guiaAtiva
          ? "📏 Guia: ON"
          : "📏 Guia de Leitura";


      btnReadingLine.setAttribute(
        "aria-label",
        guiaAtiva
          ? "Desativar guia de leitura"
          : "Ativar guia de leitura"
      );

    }


    localStorage.setItem(
      "guiaLeitura",
      guiaAtiva
    );


    if (anunciarMudanca) {

      anunciar(
        guiaAtiva
          ? "Guia de leitura ativada."
          : "Guia de leitura desativada."
      );

    }

  }


  if (btnReadingLine) {

    btnReadingLine.addEventListener(
      "click",
      function () {

        guiaAtiva =
          !guiaAtiva;

        aplicarGuiaLeitura(
          true
        );

      }
    );

  }


  document.addEventListener(
    "mousemove",
    function (event) {

      if (guiaAtiva) {

        linhaLeitura.style.top =
          event.clientY + "px";

      }

    }
  );


  document.addEventListener(
    "keydown",
    function (event) {

      if (
        guiaAtiva &&
        event.key === "ArrowUp"
      ) {

        linhaLeitura.style.top =
          Math.max(
            0,
            parseInt(
              linhaLeitura.style.top || 0
            ) - 10
          ) + "px";

      }


      if (
        guiaAtiva &&
        event.key === "ArrowDown"
      ) {

        linhaLeitura.style.top =
          Math.min(
            window.innerHeight,
            parseInt(
              linhaLeitura.style.top || 0
            ) + 10
          ) + "px";

      }

    }
  );


  /* ==========================================
     NAVEGAÇÃO SUAVE
     ========================================== */

  navLinks.forEach(
    function (link) {

      link.addEventListener(
        "click",
        function (event) {

          const destino =
            link.getAttribute(
              "href"
            );


          if (
            !destino ||
            !destino.startsWith("#")
          ) {

            return;

          }


          const elemento =
            document.querySelector(
              destino
            );


          if (!elemento) {

            return;

          }


          event.preventDefault();


          elemento.scrollIntoView({

            behavior:
              movimentoReduzido
                ? "auto"
                : "smooth",

            block: "start"

          });


          history.pushState(
            null,
            "",
            destino
          );


          if (
            !elemento.hasAttribute(
              "tabindex"
            )
          ) {

            elemento.setAttribute(
              "tabindex",
              "-1"
            );

          }


          elemento.focus({
            preventScroll: true
          });

        }
      );

    }
  );


  /* ==========================================
     DESTAQUE DA SEÇÃO ATUAL
     ========================================== */

  if (
    "IntersectionObserver" in window
  ) {

    const observer =
      new IntersectionObserver(

        function (entradas) {

          entradas.forEach(
            function (entrada) {

              if (
                entrada.isIntersecting
              ) {

                const id =
                  entrada.target.getAttribute(
                    "id"
                  );


                navLinks.forEach(
                  function (link) {

                    link.classList.remove(
                      "ativo"
                    );


                    link.removeAttribute(
                      "aria-current"
                    );


                    if (
                      link.getAttribute(
                        "href"
                      ) === "#" + id
                    ) {

                      link.classList.add(
                        "ativo"
                      );


                      link.setAttribute(
                        "aria-current",
                        "location"
                      );

                    }

                  }
                );

              }

            }
          );

        },

        {
          threshold: 0.25
        }

      );


    sections.forEach(
      function (section) {

        observer.observe(
          section
        );

      }
    );

  }


  /* ==========================================
     ANIMAÇÃO DAS SEÇÕES
     ========================================== */

  if (
    "IntersectionObserver" in window
  ) {

    const animationObserver =
      new IntersectionObserver(

        function (
          entradas,
          observer
        ) {

          entradas.forEach(
            function (entrada) {

              if (
                entrada.isIntersecting
              ) {

                entrada.target.classList.add(
                  "visivel"
                );


                observer.unobserve(
                  entrada.target
                );

              }

            }
          );

        },

        {
          threshold: 0.1
        }

      );


    sections.forEach(
      function (section) {

        section.classList.add(
          "animar"
        );


        animationObserver.observe(
          section
        );

      }
    );

  } else {

    sections.forEach(
      function (section) {

        section.classList.add(
          "visivel"
        );

      }
    );

  }


  /* ==========================================
     BOTÃO VOLTAR AO TOPO
     ========================================== */

  let botaoTopo =
    document.getElementById(
      "btn-topo"
    );


  if (!botaoTopo) {

    botaoTopo =
      document.createElement(
        "button"
      );

    botaoTopo.id =
      "btn-topo";

    botaoTopo.type =
      "button";

    botaoTopo.innerHTML =
      "↑";

    botaoTopo.setAttribute(
      "aria-label",
      "Voltar ao topo da página"
    );

    botaoTopo.setAttribute(
      "title",
      "Voltar ao topo"
    );

    document.body.appendChild(
      botaoTopo
    );

  }


  function atualizarBotaoTopo() {

    if (
      window.scrollY > 500
    ) {

      botaoTopo.classList.add(
        "mostrar"
      );

    } else {

      botaoTopo.classList.remove(
        "mostrar"
      );

    }

  }


  window.addEventListener(
    "scroll",
    atualizarBotaoTopo
  );


  botaoTopo.addEventListener(
    "click",
    function () {

      window.scrollTo({

        top: 0,

        behavior:
          movimentoReduzido
            ? "auto"
            : "smooth"

      });


      anunciar(
        "Você voltou ao topo da página."
      );


      window.setTimeout(
        function () {

          const tituloPrincipal =
            document.querySelector(
              "h1"
            );


          if (tituloPrincipal) {

            if (
              !tituloPrincipal.hasAttribute(
                "tabindex"
              )
            ) {

              tituloPrincipal.setAttribute(
                "tabindex",
                "-1"
              );

            }


            tituloPrincipal.focus();

          }

        },

        movimentoReduzido
          ? 0
          : 300

      );

    }
  );


  /* ==========================================
     LINK PULAR PARA CONTEÚDO
     ========================================== */

  let skipLink =
    document.querySelector(
      ".skip-link"
    );


  if (!skipLink) {

    skipLink =
      document.createElement(
        "a"
      );

    skipLink.className =
      "skip-link";

    skipLink.href =
      "#main-content";

    skipLink.textContent =
      "Pular para o conteúdo principal";


    document.body.insertBefore(
      skipLink,
      document.body.firstChild
    );

  }


  skipLink.addEventListener(
    "click",
    function (event) {

      const main =
        document.getElementById(
          "main-content"
        );


      if (!main) {

        return;

      }


      event.preventDefault();


      if (
        !main.hasAttribute(
          "tabindex"
        )
      ) {

        main.setAttribute(
          "tabindex",
          "-1"
        );

      }


      main.focus();


      main.scrollIntoView({

        behavior:
          movimentoReduzido
            ? "auto"
            : "smooth",

        block: "start"

      });


      history.pushState(
        null,
        "",
        "#main-content"
      );

    }
  );


  /* ==========================================
     ATALHOS DE TECLADO
     ==========================================

     ALT + A = Contraste
     ALT + + = Aumentar fonte
     ALT + - = Diminuir fonte
     ALT + 0 = Fonte normal
     ALT + L = Ler página
     ALT + P = Parar leitura
     ALT + D = Modo leitura
     ALT + C = Cursor grande
     ALT + G = Guia de leitura
     ESC = Parar leitura

     ========================================== */

  document.addEventListener(
    "keydown",
    function (event) {

      const elementoAtivo =
        document.activeElement;


      const digitando =
        elementoAtivo &&
        (
          elementoAtivo.tagName ===
            "INPUT" ||

          elementoAtivo.tagName ===
            "TEXTAREA" ||

          elementoAtivo.isContentEditable
        );


      /*
       * ESC pode parar a leitura
       * mesmo quando não estamos usando
       * um campo de texto.
       */

      if (
        event.key === "Escape" &&
        lendoPagina
      ) {

        pararLeitura();

        event.preventDefault();

        return;

      }


      /*
       * Não ativar atalhos Alt enquanto
       * a pessoa está digitando.
       */

      if (digitando) {

        return;

      }


      if (!event.altKey) {

        return;

      }


      /* Alto contraste */

      if (
        event.key === "a" ||
        event.key === "A"
      ) {

        contrasteAtivo =
          !contrasteAtivo;

        aplicarContraste(true);

        event.preventDefault();

        return;

      }


      /* Aumentar fonte */

      if (
        event.key === "+" ||
        event.key === "="
      ) {

        if (
          tamanhoFonte <
          tamanhoMaximo
        ) {

          tamanhoFonte +=
            incremento;

          aplicarTamanhoFonte(
            true
          );

        } else {

          anunciar(
            "A fonte já está no tamanho máximo."
          );

        }

        event.preventDefault();

        return;

      }


      /* Diminuir fonte */

      if (
        event.key === "-"
      ) {

        if (
          tamanhoFonte >
          tamanhoMinimo
        ) {

          tamanhoFonte -=
            incremento;

          aplicarTamanhoFonte(
            true
          );

        } else {

          anunciar(
            "A fonte já está no tamanho mínimo."
          );

        }

        event.preventDefault();

        return;

      }


      /* Fonte normal */

      if (
        event.key === "0"
      ) {

        tamanhoFonte =
          tamanhoNormal;

        aplicarTamanhoFonte(
          true
        );

        event.preventDefault();

        return;

      }


      /* Ler página */

      if (
        event.key === "l" ||
        event.key === "L"
      ) {

        if (btnReader) {

          btnReader.click();

        }

        event.preventDefault();

        return;

      }


      /* Parar leitura */

      if (
        event.key === "p" ||
        event.key === "P"
      ) {

        if (btnStopReader) {

          btnStopReader.click();

        }

        event.preventDefault();

        return;

      }


      /* Modo leitura */

      if (
        event.key === "d" ||
        event.key === "D"
      ) {

        if (btnReadingMode) {

          btnReadingMode.click();

        }

        event.preventDefault();

        return;

      }


      /* Cursor */

      if (
        event.key === "c" ||
        event.key === "C"
      ) {

        if (btnCursor) {

          btnCursor.click();

        }

        event.preventDefault();

        return;

      }


      /* Guia */

      if (
        event.key === "g" ||
        event.key === "G"
      ) {

        if (btnReadingLine) {

          btnReadingLine.click();

        }

        event.preventDefault();

        return;

      }

    }
  );


  /* ==========================================
     INICIALIZAÇÃO DOS ESTADOS
     ========================================== */

  aplicarTamanhoFonte();

  aplicarContraste();

  aplicarModoLeitura();

  aplicarCursorGrande();

  aplicarGuiaLeitura();

  atualizarBotaoTopo();


  /* ==========================================
     ARIA DOS BOTÕES EXISTENTES
     ========================================== */

  if (btnIncrease) {

    btnIncrease.setAttribute(
      "aria-label",
      "Aumentar tamanho da fonte"
    );

  }


  if (btnDecrease) {

    btnDecrease.setAttribute(
      "aria-label",
      "Diminuir tamanho da fonte"
    );

  }


  if (btnReset) {

    btnReset.setAttribute(
      "aria-label",
      "Restaurar tamanho normal da fonte"
    );

  }


  /* ==========================================
     MENSAGEM FINAL
     ========================================== */

  console.log(
    "Portal de Acessibilidade e Ciência carregado com sucesso!"
  );

});