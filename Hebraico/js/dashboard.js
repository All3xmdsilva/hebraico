const Dashboard = {
  render() {
    const perfil = Storage.getPerfil();
    const progressoCurso = Storage.getProgressoCurso();
    const totalAulas = 24;
    const concluidas = progressoCurso.length;
    const porcentagem = Math.round((concluidas / totalAulas) * 100);
    const missoes = Storage.getMissoesProgresso();

    return `
      <div class="fade-in">
        <h2>Bem-vindo, ${perfil.nome}!</h2>
        <div class="grid-dashboard">
          <div class="card stats-card">
            <div class="stats-icone"><span class="material-symbols-outlined">star</span></div>
            <div class="stats-info">
              <h3>${perfil.xp}</h3>
              <p>XP total</p>
            </div>
          </div>
          <div class="card stats-card">
            <div class="stats-icone"><span class="material-symbols-outlined">school</span></div>
            <div class="stats-info">
              <h3>${concluidas}/${totalAulas}</h3>
              <p>Aulas concluídas</p>
            </div>
          </div>
          <div class="card stats-card">
            <div class="stats-icone"><span class="material-symbols-outlined">military_tech</span></div>
            <div class="stats-info">
              <h3>Nv. ${perfil.nivel}</h3>
              <p>Seu nível</p>
            </div>
          </div>
        </div>
        <div class="card missoes" style="margin-top: var(--spacing-md)">
          <h3>Missões diárias</h3>
          <div class="missao-item">
            <span class="material-symbols-outlined">${missoes.aula ? 'check_circle' : 'radio_button_unchecked'}</span>
            Completar 1 aula (recompensa: 5 ouro) ${missoes.aula ? '✅' : ''}
          </div>
          <div class="missao-item">
            <span class="material-symbols-outlined">${missoes.quiz >= 3 ? 'check_circle' : 'radio_button_unchecked'}</span>
            Acertar 3 perguntas no quiz (${missoes.quiz || 0}/3) ${missoes.quiz >= 3 ? '✅' : ''}
          </div>
          <div class="missao-item">
            <span class="material-symbols-outlined">${missoes.versiculo ? 'check_circle' : 'radio_button_unchecked'}</span>
            Ler um versículo (recompensa: 15 ouro) ${missoes.versiculo ? '✅' : ''}
          </div>
        </div>
        <div class="card" style="margin-top: var(--spacing-md)">
          <h3>Progresso do curso</h3>
          <div class="progresso-barra" style="margin-top: 0.75rem">
            <div class="progresso-preenchimento" style="width:${porcentagem}%"></div>
          </div>
          <p style="margin-top: 0.5rem; color: var(--text-secondary)">${porcentagem}% completo</p>
        </div>
      </div>
    `;
  }
};