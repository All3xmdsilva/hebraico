const Storage = {
  getPerfil() {
    return JSON.parse(localStorage.getItem('hebraico_perfil')) || {
      nome: 'Visitante',
      email: '',
      xp: 0,
      nivel: 1
    };
  },
  salvarPerfil(perfil) {
    localStorage.setItem('hebraico_perfil', JSON.stringify(perfil));
  },
  getProgressoCurso() {
    return JSON.parse(localStorage.getItem('hebraico_progresso')) || [];
  },
  salvarProgressoCurso(aulasConcluidas) {
    localStorage.setItem('hebraico_progresso', JSON.stringify(aulasConcluidas));
  },
  getConfig() {
    return JSON.parse(localStorage.getItem('hebraico_config')) || { tema: 'claro', som: true };
  },
  salvarConfig(config) {
    localStorage.setItem('hebraico_config', JSON.stringify(config));
  },
  getConquistas() {
    return JSON.parse(localStorage.getItem('hebraico_conquistas')) || [];
  },
  desbloquearConquista(id) {
    const conquistas = this.getConquistas();
    if (!conquistas.includes(id)) {
      conquistas.push(id);
      localStorage.setItem('hebraico_conquistas', JSON.stringify(conquistas));
    }
  },
  getOuro() {
    return parseInt(localStorage.getItem('hebraico_ouro')) || 0;
  },
  addOuro(qtd) {
    const atual = this.getOuro();
    localStorage.setItem('hebraico_ouro', atual + qtd);
  },
  getFlashcardsProgresso() {
    const dados = localStorage.getItem('hebraico_flashcards');
    if (!dados) return {};
    const obj = JSON.parse(dados);
    const primeiro = Object.values(obj)[0];
    if (typeof primeiro === 'number') {
      const novo = {};
      for (const [chave, caixa] of Object.entries(obj)) {
        novo[chave] = { caixa: caixa, proximaRevisao: Date.now(), facilidade: 2.5 };
      }
      localStorage.setItem('hebraico_flashcards', JSON.stringify(novo));
      return novo;
    }
    return obj;
  },
  salvarFlashcardsProgresso(cartas) {
    const progresso = {};
    cartas.forEach(c => {
      progresso[c.hebraico] = {
        caixa: c.caixa,
        proximaRevisao: c.proximaRevisao || Date.now(),
        facilidade: c.facilidade || 2.5
      };
    });
    localStorage.setItem('hebraico_flashcards', JSON.stringify(progresso));
  },
  getMissoesProgresso() {
    const hoje = new Date().toLocaleDateString();
    const dados = JSON.parse(localStorage.getItem('hebraico_missoes')) || {};
    if (dados.data !== hoje) {
      const novo = { data: hoje, aula: false, quiz: 0, versiculo: false };
      localStorage.setItem('hebraico_missoes', JSON.stringify(novo));
      return novo;
    }
    return dados;
  },
  atualizarMissao(tipo, valor = true) {
    const progresso = this.getMissoesProgresso();
    if (tipo === 'quiz') progresso.quiz = (progresso.quiz || 0) + valor;
    else progresso[tipo] = valor;
    localStorage.setItem('hebraico_missoes', JSON.stringify(progresso));
    this.verificarRecompensaMissao(progresso);
  },
  verificarRecompensaMissao(progresso) {
    if (progresso.aula && !this.getMissoesConcluidas().includes('aula_diaria')) {
      this.addOuro(5);
      this.registrarMissaoConcluida('aula_diaria');
      alert('Missão "Aula diária" concluída! +5 ouro.');
    }
    if (progresso.quiz >= 3 && !this.getMissoesConcluidas().includes('quiz_diario')) {
      this.addOuro(10);
      this.registrarMissaoConcluida('quiz_diario');
      alert('Missão "Quiz diário" concluída! +10 ouro.');
    }
    if (progresso.versiculo && !this.getMissoesConcluidas().includes('versiculo_diario')) {
      this.addOuro(15);
      this.registrarMissaoConcluida('versiculo_diario');
      alert('Missão "Leitura bíblica" concluída! +15 ouro.');
    }
  },
  getMissoesConcluidas() {
    return JSON.parse(localStorage.getItem('hebraico_missoes_concluidas')) || [];
  },
  registrarMissaoConcluida(id) {
    const concluidas = this.getMissoesConcluidas();
    if (!concluidas.includes(id)) {
      concluidas.push(id);
      localStorage.setItem('hebraico_missoes_concluidas', JSON.stringify(concluidas));
    }
  },
  verificarConquistas() {
    const perfil = this.getPerfil();
    const progresso = this.getProgressoCurso();
    if (progresso.length >= 5) this.desbloquearConquista('5_licoes');
    if (perfil.xp >= 100) this.desbloquearConquista('100_xp');
    if ([1,2,3,4,5,6].every(id => progresso.includes(id))) this.desbloquearConquista('mestre_alfabeto');
  }
};