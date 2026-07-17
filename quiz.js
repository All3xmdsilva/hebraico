window.vip = window.vip || false;

const Quiz = {
  perguntasCompletas: [
    { pergunta: 'Como se diz "paz" em hebraico?', opcoes: ['Shalom', 'Todah', 'Lechem', 'Melech'], correta: 0 },
    { pergunta: 'Qual é a primeira letra do alfabeto hebraico?', opcoes: ['Bet', 'Alef', 'Guímel', 'Dálet'], correta: 1 },
    { pergunta: 'O que significa "Todah"?', opcoes: ['Por favor', 'Obrigado', 'Desculpe', 'Bom dia'], correta: 1 },
    { pergunta: 'Como se escreve o número 1 em hebraico (masculino)?', opcoes: ['Echad', 'Shtayim', 'Shalosh', 'Arba'], correta: 0 },
    { pergunta: 'Qual é o plural de "sefer" (livro)?', opcoes: ['Sefarim', 'Sefarot', 'Sifrei', 'Sefir'], correta: 0 },
    { pergunta: 'O que significa "Shalom"?', opcoes: ['Paz', 'Guerra', 'Amor', 'Fé'], correta: 0 }
  ],
  perguntas: [],
  indiceAtual: 0,
  selecionada: null,

  async render() {
    Quiz.indiceAtual = 0;
    Quiz.selecionada = null;
    const vip = window.vip || false;
    Quiz.perguntas = vip ? Quiz.perguntasCompletas : Quiz.perguntasCompletas.slice(0, 3); // 3 perguntas gratuito
    return Quiz.montarQuestao();
  },

  montarQuestao() {
    if (Quiz.indiceAtual >= Quiz.perguntas.length) return Quiz.resultadoFinal();
    const q = Quiz.perguntas[Quiz.indiceAtual];
    let html = `<div class="fade-in quiz-container"><div class="questao">${q.pergunta}</div><div class="opcoes">`;
    q.opcoes.forEach((op, i) => {
      let classe = 'opcao';
      if (Quiz.selecionada !== null) {
        if (i === q.correta) classe += ' correta';
        else if (i === Quiz.selecionada) classe += ' incorreta';
      }
      html += `<button class="${classe}" onclick="Quiz.selecionarOpcao(${i})" ${Quiz.selecionada !== null ? 'disabled' : ''}>${op}</button>`;
    });
    html += `</div>`;
    if (Quiz.selecionada !== null) {
      const acertou = Quiz.selecionada === q.correta;
      html += `<p style="margin-bottom:1rem; font-weight:600; color:${acertou ? 'var(--success)' : 'var(--danger)'}">${acertou ? '✅ Correto!' : '❌ Incorreto!'}</p>`;
      html += `<button class="btn-primario" onclick="Quiz.proxima()">Próxima</button>`;
    }
    if (!window.vip && Quiz.perguntas.length < 6) {
      html += `<div class="card" style="margin-top:12px; text-align:center; opacity:0.8;">
        <span style="font-size:2rem;">🔒</span>
        <p>O quiz completo está disponível apenas para VIP.</p>
        <button class="btn-primario" onclick="Router.navegar('assinatura')">Seja VIP 🌟</button>
      </div>`;
    }
    html += `</div>`;
    return html;
  },

  selecionarOpcao(indice) {
    if (Quiz.selecionada !== null) return;
    Quiz.selecionada = indice;
    const q = Quiz.perguntas[Quiz.indiceAtual];
    if (indice === q.correta) {
      const perfil = Storage.getPerfil();
      perfil.xp += 20;
      if (perfil.xp >= perfil.nivel * 100) perfil.nivel += 1;
      Storage.salvarPerfil(perfil);
    }
    document.getElementById('conteudo').innerHTML = Quiz.montarQuestao();
  },

  proxima() {
    Quiz.indiceAtual++;
    Quiz.selecionada = null;
    document.getElementById('conteudo').innerHTML = Quiz.montarQuestao();
  },

  resultadoFinal() {
    return `
      <div class="fade-in quiz-container">
        <h2>Quiz concluído!</h2>
        <p>Você está com <strong>${Storage.getPerfil().xp} XP</strong> no nível <strong>${Storage.getPerfil().nivel}</strong>.</p>
        <button class="btn-primario" onclick="Router.navegar('quiz')">Refazer Quiz</button>
      </div>`;
  }
};