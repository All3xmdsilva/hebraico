const Memoria = {
  cartas: [],
  primeiraCarta: null,
  segundaCarta: null,
  bloqueado: false,
  paresEncontrados: 0,

  async render() {
    try {
      const palavras = await DataLoader.carregarJSON('dicionario');
      const selecionadas = Memoria.embaralhar([...palavras]).slice(0, 6);
      Memoria.paresEncontrados = 0;
      Memoria.cartas = Memoria.embaralhar([
        ...selecionadas.map(p => ({ tipo: 'hebraico', valor: p.hebraico, id: p.hebraico, significado: p.significado })),
        ...selecionadas.map(p => ({ tipo: 'significado', valor: p.significado, id: p.hebraico, significado: p.significado }))
      ]);
      return Memoria.montarTabuleiro();
    } catch (e) {
      console.error(e);
      return '<p style="color:var(--danger)">Erro ao carregar jogo da memória.</p>';
    }
  },

  embaralhar(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  montarTabuleiro() {
    let html = `
      <div class="fade-in">
        <h2>Jogo da Memória</h2>
        <p>Encontre o par: hebraico ↔ significado</p>
        <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-top:16px; max-width:600px;">`;
    Memoria.cartas.forEach((carta, index) => {
      html += `
        <div class="carta-memoria" data-action="Memoria.virarCarta" data-args='[${index}]' 
             style="aspect-ratio:1; background:var(--primary); border-radius:var(--radius-btn); display:flex; align-items:center; justify-content:center; cursor:pointer; color:white; font-weight:600; user-select:none; transition:0.2s;">
          ?
        </div>`;
    });
    html += `</div>
        <p style="margin-top:12px;">Pares encontrados: <span id="contadorPares">0</span>/6</p>
        <button class="btn-secundario" onclick="Router.navegar('memoria')" style="margin-top:12px;">Reiniciar</button>
      </div>`;
    return html;
  },

  virarCarta(indice) {
    if (Memoria.bloqueado) return;
    const cartaEl = document.querySelector(`.carta-memoria:nth-child(${indice+1})`);
    if (!cartaEl || cartaEl.classList.contains('virada')) return;

    const carta = Memoria.cartas[indice];
    cartaEl.textContent = carta.valor;
    cartaEl.style.background = 'var(--surface)';
    cartaEl.style.color = 'var(--text)';
    cartaEl.classList.add('virada');

    if (!Memoria.primeiraCarta) {
      Memoria.primeiraCarta = { indice, elemento: cartaEl, carta };
    } else {
      Memoria.segundaCarta = { indice, elemento: cartaEl, carta };
      Memoria.verificarPar();
    }
  },

  verificarPar() {
    Memoria.bloqueado = true;
    const p1 = Memoria.primeiraCarta;
    const p2 = Memoria.segundaCarta;
    if (p1.carta.id === p2.carta.id && p1.carta.tipo !== p2.carta.tipo) {
      Memoria.paresEncontrados++;
      document.getElementById('contadorPares').textContent = Memoria.paresEncontrados;
      p1.elemento.style.background = 'var(--success)';
      p2.elemento.style.background = 'var(--success)';
      Memoria.resetarSelecao();
      Memoria.bloqueado = false;
      if (Memoria.paresEncontrados === 6) {
        Storage.getPerfil().xp += 30;
        Storage.salvarPerfil(Storage.getPerfil());
        Storage.addOuro(10);
        alert('Parabéns! +30 XP, +10 ouro.');
      }
    } else {
      setTimeout(() => {
        p1.elemento.textContent = '?';
        p1.elemento.style.background = 'var(--primary)';
        p1.elemento.style.color = 'white';
        p1.elemento.classList.remove('virada');
        p2.elemento.textContent = '?';
        p2.elemento.style.background = 'var(--primary)';
        p2.elemento.style.color = 'white';
        p2.elemento.classList.remove('virada');
        Memoria.resetarSelecao();
        Memoria.bloqueado = false;
      }, 800);
    }
  },

  resetarSelecao() {
    Memoria.primeiraCarta = null;
    Memoria.segundaCarta = null;
  }
};