window.vip = window.vip || false;

const ArrastarLetras = {
  palavraObj: null,
  letrasDisponiveis: [],
  resposta: [],

  async render() {
    try {
      const palavras = await DataLoader.carregarJSON('dicionario');
      const validas = palavras.filter(p => p.hebraico.length >= 3 && p.hebraico.length <= 5);
      if (validas.length === 0) return '<p>Sem palavras disponíveis.</p>';
      ArrastarLetras.palavraObj = validas[Math.floor(Math.random() * validas.length)];
      ArrastarLetras.resposta = [];
      const original = ArrastarLetras.palavraObj.hebraico.split('');
      ArrastarLetras.letrasDisponiveis = original.map((l, i) => ({ letra: l, id: i, usada: false }));
      ArrastarLetras.letrasDisponiveis = ArrastarLetras.embaralhar(ArrastarLetras.letrasDisponiveis);
      return ArrastarLetras.montarTela();
    } catch (e) {
      console.error(e);
      return '<p style="color:var(--danger)">Erro ao carregar jogo.</p>';
    }
  },

  embaralhar(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  montarTela() {
    let html = `
      <div class="fade-in" style="max-width:500px; margin:0 auto;">
        <h2>Monte a Palavra</h2>
        <p>Significado: <strong>${ArrastarLetras.palavraObj.significado}</strong></p>
        <div style="min-height:60px; border:2px dashed var(--border); border-radius:8px; margin:16px 0; 
                    display:flex; flex-wrap:wrap; gap:8px; padding:8px; justify-content:center; font-size:2rem; font-family:'Cinzel',serif;">
          ${ArrastarLetras.resposta.map(l => `
            <span onclick="ArrastarLetras.removerLetra(${l.id})" 
                  style="background:var(--primary); color:white; padding:8px 12px; border-radius:4px; cursor:pointer;">
              ${l.letra}
            </span>
          `).join('')}
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center;">`;
    ArrastarLetras.letrasDisponiveis.forEach(item => {
      if (!item.usada) {
        html += `<button class="btn-secundario" style="font-size:1.5rem; padding:8px 16px;" 
                  onclick="ArrastarLetras.adicionarLetra(${item.id})">${item.letra}</button>`;
      } else {
        html += `<button class="btn-secundario" disabled style="opacity:0.5;">${item.letra}</button>`;
      }
    });
    html += `</div>
        <div style="margin-top:16px; display:flex; gap:8px;">
          <button class="btn-perigo" onclick="ArrastarLetras.limpar()">Limpar</button>
          <button class="btn-primario" onclick="ArrastarLetras.verificar()">Verificar</button>
          <button class="btn-secundario" onclick="Router.navegar('arrastar-letras')">Nova palavra</button>
        </div>`;
    if (!window.vip) {
  html += `<div class="card" style="margin-top:8px; text-align:center;">
    <span style="font-size:2rem;">🔒</span>
    <p>Recursos extras liberados apenas para VIP.</p>
    <button class="btn-primario" onclick="Router.navegar('assinatura')">Seja VIP 🌟</button>
  </div>`;
}
    html += `</div>`;
    return html;
  },

  adicionarLetra(id) {
    const item = ArrastarLetras.letrasDisponiveis.find(l => l.id === id);
    if (!item || item.usada) return;
    item.usada = true;
    ArrastarLetras.resposta.push({ letra: item.letra, id: item.id });
    document.getElementById('conteudo').innerHTML = ArrastarLetras.montarTela();
  },

  removerLetra(id) {
    const index = ArrastarLetras.resposta.findIndex(r => r.id === id);
    if (index !== -1) {
      ArrastarLetras.resposta.splice(index, 1);
      const item = ArrastarLetras.letrasDisponiveis.find(l => l.id === id);
      if (item) item.usada = false;
      document.getElementById('conteudo').innerHTML = ArrastarLetras.montarTela();
    }
  },

  limpar() {
    ArrastarLetras.resposta = [];
    ArrastarLetras.letrasDisponiveis.forEach(item => item.usada = false);
    document.getElementById('conteudo').innerHTML = ArrastarLetras.montarTela();
  },

  verificar() {
    const respostaStr = ArrastarLetras.resposta.map(r => r.letra).join('');
    if (respostaStr === ArrastarLetras.palavraObj.hebraico) {
      alert('Correto! +30 XP, +10 ouro.');
      const perfil = Storage.getPerfil();
      perfil.xp += 30;
      Storage.salvarPerfil(perfil);
      Storage.addOuro(10);
      Router.navegar('arrastar-letras');
    } else {
      alert('Ainda não está correto. Continue tentando!');
    }
  }
};
