const NovidadesPage = {
  async render() {
    try {
      const noticias = await DataLoader.carregarJSON('novidades');
      if (!noticias || noticias.length === 0) {
        return '<p>Nenhuma novidade no momento.</p>';
      }
      let html = `<div class="fade-in"><h2>Novidades</h2>`;
      noticias.forEach(n => {
        html += `
          <div class="card" style="margin-bottom:16px;">
            <h3>${n.titulo}</h3>
            <p style="color:var(--text-secondary); font-size:0.9rem;">${new Date(n.data).toLocaleDateString('pt-BR')}</p>
            <p style="margin-top:8px;">${n.texto}</p>
          </div>`;
      });
      html += `</div>`;
      return html;
    } catch (e) {
      console.error('Erro ao carregar novidades:', e);
      return '<p style="color:var(--danger)">Erro ao carregar novidades.</p>';
    }
  }
};