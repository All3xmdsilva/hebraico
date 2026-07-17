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
    // Só usamos hashchange para navegação externa (botões do navegador)
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1) || 'dashboard';
      if (hash !== this.paginaAtual) {
        this.rotaHash();
      }
    });
    this.rotaHash();
  },

  navegar(page) {
    // Se já está na página, força re-renderização imediata
    if (this.paginaAtual === page) {
      this.renderizarPagina(page);
      return;
    }
    window.location.hash = page;
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
      novidades: NovidadesPage.render,
      assinatura: AssinaturaPage.render,
      admin: AdminPage.render,
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

        // Configurar eventos específicos de cada página
        if (page === 'perfil' && typeof Perfil.setupEvents === 'function') {
          Perfil.setupEvents();
        }
        if (page === 'admin' && typeof AdminPage.setupEvents === 'function') {
          AdminPage.setupEvents();
        }
        if (page === 'assinatura' && typeof AssinaturaPage.setupEvents === 'function') {
          AssinaturaPage.setupEvents();
        }
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