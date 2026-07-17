const DicionarioPage = {
  async render() {
    try {
      const palavras = await DataLoader.carregarJSON('dicionario');
      window.__dicionarioCache = palavras;
      return `
        <div class="fade-in">
          <h2>Dicionário</h2>
          <div style="margin-bottom:16px; max-width:400px;">
            <input type="text" id="buscaDicionario" placeholder="Buscar palavra (hebraico ou significado)" 
                   style="width:100%; padding:10px; border:1px solid var(--border); border-radius: var(--radius-btn); font-family:inherit;"
                   oninput="DicionarioPage.filtrar()">
          </div>
          <div id="resultadosDicionario"></div>
        </div>`;
    } catch (e) {
      console.error(e);
      return '<p style="color:var(--danger)">Erro ao carregar dicionário.</p>';
    }
  },

  filtrar() {
    const termo = document.getElementById('buscaDicionario').value.toLowerCase().trim();
    const palavras = window.__dicionarioCache || [];
    const resultados = termo === '' ? [] : palavras.filter(p =>
      p.hebraico.includes(termo) || p.transliteracao.includes(termo) || p.significado.toLowerCase().includes(termo) || p.raiz.includes(termo)
    );
    this.exibirResultados(resultados);
  },

  exibirResultados(resultados) {
    const container = document.getElementById('resultadosDicionario');
    if (!container) return;
    if (resultados.length === 0) {
      container.innerHTML = '<p style="color:var(--text-secondary); margin-top:8px;">Nenhuma palavra encontrada.</p>';
      return;
    }
    let html = '<div style="display:flex; flex-direction:column; gap:12px; margin-top:8px;">';
    resultados.forEach(p => {
      html += `
        <div class="card" style="padding:16px;">
          <h3 style="font-family:'Inter',sans-serif; font-size:1.5rem; direction:rtl; text-align:left;">${p.hebraico}</h3>
          <p><strong>Transliteração:</strong> ${p.transliteracao}</p>
          <p><strong>Significado:</strong> ${p.significado}</p>
          <p><strong>Raiz:</strong> ${p.raiz} | <strong>Classe:</strong> ${p.classe}</p>
          <p style="color:var(--text-secondary); font-style:italic;">Exemplo: ${p.exemplo}</p>
        </div>`;
    });
    html += '</div>';
    container.innerHTML = html;
  }
};