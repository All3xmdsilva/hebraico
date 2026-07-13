const Perfil = {
  render() {
    const perfil = Storage.getPerfil();
    const ouro = Storage.getOuro();
    const conquistas = Storage.getConquistas();
    return `
      <div class="fade-in">
        <div class="perfil-header">
          <div class="avatar-placeholder">👤</div>
          <div>
            <h2>${perfil.nome}</h2>
            <p>Nível ${perfil.nivel} · ${perfil.xp} XP · ${ouro} <span class="material-symbols-outlined" style="font-size:1rem; vertical-align:middle">monetization_on</span></p>
          </div>
        </div>
        <div class="card">
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
  }
};