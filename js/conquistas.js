const ConquistasPage = {
  async render() {
    const conquistas = await DataLoader.carregarJSON('conquistas');
    const desbloqueadas = Storage.getConquistas();
    let html = '<h2>Conquistas</h2><div class="grid-dashboard">';
    conquistas.forEach(c => {
      const desbloqueada = desbloqueadas.includes(c.id);
      html += `
        <div class="card stats-card" style="opacity:${desbloqueada ? '1' : '0.5'}">
          <div class="stats-icone"><span class="material-symbols-outlined">${c.icone}</span></div>
          <div class="stats-info">
            <h3>${c.nome}</h3>
            <p>${c.descricao}</p>
            <small>${c.raridade} ${desbloqueada ? '✅' : '🔒'}</small>
          </div>
        </div>`;
    });
    html += '</div>';
    return html;
  }
};