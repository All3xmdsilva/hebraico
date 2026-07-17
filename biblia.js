const BibliaPage = {
  async render() {
    try {
      const versiculos = await DataLoader.carregarJSON('biblia');
      window.__bibliaCache = versiculos;
      let html = `
        <div class="fade-in">
          <h2>Bíblia Hebraica</h2>
          <p>Selecione um versículo para leitura:</p>
          <div style="display:flex; flex-direction:column; gap:12px; margin-top:16px;">`;
      versiculos.forEach((v, i) => {
        html += `
          <div class="card" style="cursor:pointer;" onclick="BibliaPage.mostrarVersiculo(${i})">
            <strong>${v.referencia}</strong>
            <p style="direction:rtl; text-align:right; font-family:'Cinzel',serif; font-size:1.2rem; margin-top:8px;">${v.hebraico}</p>
            <p style="color:var(--text-secondary); margin-top:4px;">${v.traducao}</p>
          </div>`;
      });
      html += `</div></div>`;
      return html;
    } catch (e) {
      console.error(e);
      return '<p style="color:var(--danger)">Erro ao carregar Bíblia.</p>';
    }
  },

  mostrarVersiculo(indice) {
    const versiculos = window.__bibliaCache;
    if (!versiculos || !versiculos[indice]) return;
    const v = versiculos[indice];
    const html = `
      <div class="fade-in">
        <button class="btn-secundario" onclick="Router.navegar('biblia')" style="margin-bottom:16px;">← Voltar</button>
        <h2>${v.referencia}</h2>
        <div class="card" style="font-size:1.5rem; direction:rtl; text-align:right; font-family:'Cinzel',serif; margin:16px 0;">${v.hebraico}</div>
        <p><strong>Transliteração:</strong> ${v.transliteracao}</p>
        <p><strong>Tradução:</strong> ${v.traducao}</p>
      </div>`;
    document.getElementById('conteudo').innerHTML = html;
    Storage.atualizarMissao('versiculo');
  }
};