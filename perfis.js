const Perfil = {
  render() {
    const perfil = Storage.getPerfil();
    const ouro = Storage.getOuro();
    const conquistas = Storage.getConquistas();
    const vip = window.vip || false;

    let html = `
      <div class="fade-in">
        <div class="perfil-header">
          <div class="avatar-placeholder">👤</div>
          <div>
            <h2>${perfil.nome}</h2>
            <p>Nível ${perfil.nivel} · ${perfil.xp} XP · ${ouro} <span class="material-symbols-outlined" style="font-size:1rem; vertical-align:middle">monetization_on</span></p>
            <p>Status: <strong>${vip ? 'VIP ⭐' : 'Gratuito'}</strong></p>
          </div>
        </div>
        <div class="card">
          ${!vip ? `
            <h3>Ativar VIP</h3>
            <p>Insira o código de ativação para desbloquear 100% do conteúdo.</p>
            <div style="display:flex; gap:8px;">
              <input type="text" id="codigoVip" placeholder="Código VIP" style="flex:1; padding:8px; border:1px solid var(--border); border-radius:4px;">
              <button class="btn-primario" id="btnAtivarVip">Ativar</button>
            </div>
          ` : '<p style="color:var(--success); font-weight:600;">Você é VIP! Todo o conteúdo está liberado.</p>'}
        </div>
        <div class="card" style="margin-top: var(--spacing-md)">
          <h3>Conquistas (${conquistas.length})</h3>
          <p style="color:var(--text-secondary)">Clique em Conquistas no menu para ver detalhes.</p>
        </div>
        <div class="card" style="margin-top: var(--spacing-md)">
          <form class="form-perfil" onsubmit="Perfil.salvar(event)">
            <div class="form-grupo">
              <label>Nome</label>
              <input type="text" id="inputNome" value="${perfil.nome}" required>
            </div>
            <div class="form-grupo">
              <label>Email</label>
              <input type="email" id="inputEmail" value="${perfil.email || ''}">
            </div>
            <button type="submit" class="btn-primario">Salvar</button>
          </form>
        </div>
      </div>
    `;
    return html;
  },

  salvar(e) {
    e.preventDefault();
    const perfil = Storage.getPerfil();
    perfil.nome = document.getElementById('inputNome').value;
    perfil.email = document.getElementById('inputEmail').value;
    Storage.salvarPerfil(perfil);
    document.getElementById('perfilNome').textContent = perfil.nome;
    Router.navegar('perfil');
    alert('Perfil atualizado!');
  },

  // Função chamada após a renderização (para adicionar eventos)
  setupEvents() {
    const btnAtivar = document.getElementById('btnAtivarVip');
    if (btnAtivar) {
      btnAtivar.addEventListener('click', () => {
        const codigo = document.getElementById('codigoVip').value.trim();
        if (!codigo) return alert('Digite um código.');

        // Lista de códigos válidos (pode ser expandida)
        const codigosValidos = JSON.parse(localStorage.getItem('hebraico_codigos_vip')) || ['VIP2026', 'ALEFVIP']; // adicione quantos quiser

        if (codigosValidos.includes(codigo)) {
          // Ativar VIP
          window.vip = true;
          localStorage.setItem('hebraico_vip', 'true');
          alert('🎉 VIP ativado! Aproveite o conteúdo completo.');
          Router.navegar('perfil'); // recarrega a página para mostrar status
        } else {
          alert('Código inválido.');
        }
      });
    }
  }
};