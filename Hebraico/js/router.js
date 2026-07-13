const Router = {
  paginaAtual: 'dashboard',
  conteudo: document.getElementById('conteudo'),
  titulo: document.getElementById('tituloPagina'),
  botoes: document.querySelectorAll('.menu-btn'),

  init() {
    this.botoes.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const page = e.currentTarget.dataset.page;
        this.navegar(page);
      });
    });

    // Delegação global para data-action
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      e.preventDefault();
      const acao = target.dataset.action;
      const args = target.dataset.args ? JSON.parse(target.dataset.args) : [];
      const fn = acao.split('.').reduce((obj, prop) => obj?.[prop], window);
      if (typeof fn === 'function') {
        fn(...args);
      } else {
        console.warn(`Ação não encontrada: ${acao}`);
      }
    });

    // Carrega rota inicial
    this.rotaHash();
  },

  navegar(page) {
    this.paginaAtual = page;
    this.atualizarMenu();
    this.renderizarPagina(page);
    // Opcional: atualizar a hash silenciosamente
    history.replaceState(null, null, `#${page}`);
  },

  rotaHash() {
    const hash = window.location.hash.slice(1) || 'dashboard';
    this.paginaAtual = hash;
    this.atualizarMenu();
    this.renderizarPagina(hash);
  },

  atualizarMenu() {
    this.botoes.forEach(btn => {
      btn.classList.toggle('ativo', btn.dataset.page === this.paginaAtual);
    });
  },

  async renderizarPagina(page) {
    const mapeamento = {
      dashboard: Dashboard.render,
      curso: Curso.render,
      quiz: Quiz.render,
      dicionario: DicionarioPage.render,
      biblia: BibliaPage.render,
      perfil: Perfil.render,
      conquistas: ConquistasPage.render,
      configuracoes: Configuracoes.render,
      flashcards: Flashcards.render,
      memoria: Memoria.render,
      'caca-palavras': CacaPalavras.render,
      forca: Forca.render,
      'arrastar-letras': ArrastarLetras.render,
    };

    if (mapeamento[page]) {
      this.titulo.textContent = this.capitalizar(page);
      try {
        const conteudo = await mapeamento[page]();
        this.conteudo.innerHTML = conteudo;
      } catch (erro) {
        this.conteudo.innerHTML = `<p style="color:var(--danger)">Erro ao carregar a página.</p>`;
        console.error(erro);
      }
    } else {
      this.conteudo.innerHTML = '<p>Página não encontrada.</p>';
    }
  },

  capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};