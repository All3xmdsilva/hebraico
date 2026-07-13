const Flashcards = {
  cartas: [],
  cartasRevisar: [],
  indice: 0,
  virado: false,
  revisando: false,

  async carregarDados() {
    try {
      const palavras = await DataLoader.carregarJSON('dicionario');
      const progresso = Storage.getFlashcardsProgresso();
      Flashcards.cartas = palavras.map(p => {
        const meta = progresso[p.hebraico] || { caixa: 1, proximaRevisao: Date.now(), facilidade: 2.5 };
        return { ...p, ...meta };
      });
    } catch (e) {
      console.error(e);
      Flashcards.cartas = [];
    }
  },

  async render() {
    await Flashcards.carregarDados();
    return Flashcards.renderPainel();
  },

  renderPainel() {
    const agora = Date.now();
    const pendentes = Flashcards.cartas.filter(c => c.proximaRevisao <= agora);
    let html = `
      <div class="fade-in">
        <h2>Flashcards (Revisão Espaçada)</h2>
        <p>Total de cartas: <strong>${Flashcards.cartas.length}</strong></p>
        <p>Cartas para revisar agora: <strong>${pendentes.length}</strong></p>
        <div style="margin-top:16px; display:flex; gap:12px; flex-wrap:wrap;">`;
    if (pendentes.length > 0) {
      html += `<button class="btn-primario" data-action="Flashcards.iniciarRevisao">Iniciar revisão (${pendentes.length})</button>`;
    } else {
      html += `<p style="color:var(--success)">🎉 Nenhuma carta pendente. Volte mais tarde!</p>`;
    }
    html += `<button class="btn-secundario" data-action="Flashcards.iniciarTodas">Revisar todas (${Flashcards.cartas.length})</button>`;
    html += `<button class="btn-perigo" data-action="Flashcards.resetarProgresso">Resetar progresso</button>`;
    html += `</div></div>`;
    return html;
  },

  iniciarRevisao() {
    if (Flashcards.cartas.length === 0) return alert('Nenhuma carta disponível.');
    const agora = Date.now();
    Flashcards.cartasRevisar = Flashcards.cartas.filter(c => c.proximaRevisao <= agora);
    if (Flashcards.cartasRevisar.length === 0) return alert('Nada para revisar.');
    Flashcards.cartasRevisar = Flashcards.embaralhar(Flashcards.cartasRevisar);
    Flashcards.indice = 0;
    Flashcards.virado = false;
    Flashcards.revisando = true;
    Flashcards.mostrarCarta();
  },

  iniciarTodas() {
    if (Flashcards.cartas.length === 0) return alert('Nenhuma carta disponível.');
    Flashcards.cartasRevisar = Flashcards.embaralhar([...Flashcards.cartas]);
    Flashcards.indice = 0;
    Flashcards.virado = false;
    Flashcards.revisando = true;
    Flashcards.mostrarCarta();
  },

  resetarProgresso() {
    if (confirm('Tem certeza? Todo o progresso de flashcards será perdido.')) {
      localStorage.removeItem('hebraico_flashcards');
      Flashcards.carregarDados().then(() => Router.navegar('flashcards'));
    }
  },

  mostrarCarta() {
    if (!Flashcards.cartasRevisar || Flashcards.cartasRevisar.length === 0 || Flashcards.indice >= Flashcards.cartasRevisar.length) {
      alert('Sessão de revisão concluída!');
      Flashcards.revisando = false;
      Router.navegar('flashcards');
      return;
    }
    const carta = Flashcards.cartasRevisar[Flashcards.indice];
    Flashcards.virado = false;
    const html = `
      <div class="fade-in" style="max-width:400px; margin:0 auto;">
        <button class="btn-secundario" onclick="Flashcards.voltarPainel()" style="margin-bottom:16px;">← Parar revisão</button>
        <div class="card" id="flashcard" data-action="Flashcards.virar" style="min-height:200px; display:flex; align-items:center; justify-content:center; cursor:pointer; text-align:center; font-size:2rem; font-family:'Cinzel',serif; user-select:none;">${carta.hebraico}</div>
        <div style="display:flex; gap:12px; margin-top:16px;">
          <button class="btn-perigo" data-action="Flashcards.avaliar" data-args='[0]'>Não lembrei</button>
          <button class="btn-primario" data-action="Flashcards.avaliar" data-args='[1]'>Lembrei</button>
        </div>
        <p style="margin-top:8px; color:var(--text-secondary);">${Flashcards.indice+1} de ${Flashcards.cartasRevisar.length}</p>
      </div>`;
    document.getElementById('conteudo').innerHTML = html;
  },

  virar() {
    const carta = Flashcards.cartasRevisar[Flashcards.indice];
    Flashcards.virado = !Flashcards.virado;
    const cardEl = document.getElementById('flashcard');
    if (cardEl) {
      cardEl.innerHTML = Flashcards.virado ? `<div><small>${carta.transliteracao}</small><br>${carta.significado}</div>` : carta.hebraico;
      cardEl.style.fontFamily = Flashcards.virado ? 'Inter, sans-serif' : 'Cinzel, serif';
    }
  },

  avaliar(qualidade) {
    const carta = Flashcards.cartasRevisar[Flashcards.indice];
    const original = Flashcards.cartas.find(c => c.hebraico === carta.hebraico);
    if (!original) return;
    const agora = Date.now();
    if (qualidade === 0) {
      original.caixa = 1;
      original.proximaRevisao = agora + 24 * 60 * 60 * 1000;
      original.facilidade = Math.max(1.3, original.facilidade - 0.2);
    } else {
      original.caixa = Math.min(original.caixa + 1, 5);
      const intervalos = [0, 1, 3, 7, 14, 30];
      original.proximaRevisao = agora + intervalos[original.caixa] * 24 * 60 * 60 * 1000;
      original.facilidade = Math.min(3.0, original.facilidade + 0.1);
    }
    Storage.salvarFlashcardsProgresso(Flashcards.cartas);
    Flashcards.indice++;
    Flashcards.mostrarCarta();
  },

  voltarPainel() {
    Flashcards.revisando = false;
    Router.navegar('flashcards');
  },

  embaralhar(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
};