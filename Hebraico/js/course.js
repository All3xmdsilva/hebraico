const Curso = {
  mundoAtual: null,
  licaoAberta: null,

  async render() {
    try {
      if (Curso.licaoAberta !== null) return Curso.renderLicao(Curso.licaoAberta);
      if (Curso.mundoAtual !== null) return Curso.renderLicoesDoMundo(Curso.mundoAtual);

      const mundos = await DataLoader.carregarJSON('mundos');
      const progresso = Storage.getProgressoCurso();
      let html = `<div class="fade-in"><h2>Jornada do Conhecimento</h2><div class="mapa-mundos">`;

      mundos.forEach((mundo, index) => {
        const totalLicoes = mundo.licoes.length;
        const concluidas = mundo.licoes.filter(l => progresso.includes(l.id)).length;
        const bloqueado = index > 0 && progresso.length === 0;
        html += `
          <div class="mundo-card" style="border-left-color: ${bloqueado ? 'var(--border)' : 'var(--primary)'}">
            <div class="mundo-titulo">Mundo ${mundo.id}: ${mundo.nome}</div>
            <div class="estrelas">${'⭐'.repeat(concluidas)}${'☆'.repeat(totalLicoes - concluidas)}</div>
            <p>${mundo.descricao}</p>
            <p><small>${concluidas}/${totalLicoes} lições</small></p>
            <button class="btn-primario" ${bloqueado ? 'disabled' : ''} 
                    data-action="Curso.entrarMundo" data-args='[${mundo.id}]' style="margin-top:8px">
              ${bloqueado ? '🔒 Bloqueado' : 'Entrar'}
            </button>
          </div>`;
      });
      html += `</div></div>`;
      return html;
    } catch (e) {
      console.error(e);
      return '<p style="color:var(--danger)">Erro ao carregar curso.</p>';
    }
  },

  async entrarMundo(mundoId) {
    try {
      const mundos = await DataLoader.carregarJSON('mundos');
      const mundo = mundos.find(m => m.id === mundoId);
      if (!mundo) throw new Error('Mundo não encontrado');
      Curso.mundoAtual = mundo;
      Curso.licaoAberta = null;
      Router.navegar('curso');
    } catch (e) {
      alert('Erro ao entrar no mundo: ' + e.message);
    }
  },

  voltarMundos() {
    Curso.mundoAtual = null;
    Curso.licaoAberta = null;
    Router.navegar('curso');
  },

  abrirLicao(licaoId) {
    if (!Curso.mundoAtual) return;
    const licao = Curso.mundoAtual.licoes.find(l => l.id === licaoId);
    if (!licao) {
      alert('Lição não encontrada.');
      return;
    }
    Curso.licaoAberta = licao;
    Router.navegar('curso');
  },

  fecharLicao() {
    Curso.licaoAberta = null;
    Router.navegar('curso');
  },

  async concluirLicao(licaoId) {
    const progresso = Storage.getProgressoCurso();
    if (!progresso.includes(licaoId)) {
      progresso.push(licaoId);
      Storage.salvarProgressoCurso(progresso);
      const perfil = Storage.getPerfil();
      perfil.xp += 20;
      if (perfil.xp >= perfil.nivel * 100) perfil.nivel += 1;
      Storage.salvarPerfil(perfil);
      Storage.addOuro(5);
      if (progresso.length === 1) Storage.desbloquearConquista('primeira_letra');
      Storage.atualizarMissao('aula');
      Storage.verificarConquistas();
      alert('Lição concluída! +20 XP, +5 ouro.');
    }
    Curso.licaoAberta = null;
    Router.navegar('curso');
  },

  renderLicoesDoMundo(mundo) {
    const progresso = Storage.getProgressoCurso();
    let html = `
      <div class="fade-in">
        <button class="btn-secundario" data-action="Curso.voltarMundos" style="margin-bottom:16px">← Voltar para Mundos</button>
        <h2>${mundo.nome}</h2>
        <p>${mundo.descricao}</p>
        <div class="lista-aulas" style="margin-top:16px">`;
    mundo.licoes.forEach(licao => {
      const concluida = progresso.includes(licao.id);
      html += `
        <div class="aula-item">
          <span class="aula-titulo">${licao.titulo}</span>
          <span class="aula-status">${concluida ? '✅ Concluída' : '🔒'}</span>
          <button class="btn-primario" data-action="Curso.abrirLicao" data-args='[${licao.id}]'>Abrir</button>
        </div>`;
    });
    html += `</div></div>`;
    return html;
  },

  renderLicao(licao) {
    const progresso = Storage.getProgressoCurso();
    const concluida = progresso.includes(licao.id);
    return `
      <div class="fade-in">
        <button class="btn-secundario" data-action="Curso.fecharLicao" style="margin-bottom:16px">← Voltar para lições</button>
        <h2>${licao.titulo}</h2>
        <div class="card" style="margin:16px 0; white-space:pre-line;">${licao.conteudo}</div>
        ${!concluida ? `
          <button class="btn-primario" data-action="Curso.concluirLicao" data-args='[${licao.id}]'>Concluir Lição (+20 XP, +5 ouro)</button>
        ` : `<p style="color:var(--success)">✅ Lição já concluída</p>`}
      </div>`;
  }
};