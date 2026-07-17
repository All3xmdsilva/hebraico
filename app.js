const PaginasEstaticas = {
  dicionario: () => '<div class="fade-in"><h2>Dicionário</h2><p>Em desenvolvimento.</p></div>',
  biblia: () => '<div class="fade-in"><h2>Bíblia</h2><p>Em desenvolvimento.</p></div>',
  conquistas: () => '<div class="fade-in"><h2>Conquistas</h2><p>Complete ações para desbloquear.</p></div>'
};

const Configuracoes = {
  render() {
    const config = Storage.getConfig();
    return `
      <div class="fade-in card">
        <h2>Configurações</h2>
        <label style="display:flex; align-items:center; gap:0.5rem; margin-top:1rem;">
          <input type="checkbox" id="checkSom" ${config.som ? 'checked' : ''}> Sons do app
        </label>
        <button class="btn-primario" style="margin-top:1rem" onclick="Configuracoes.salvar()">Salvar</button>
      </div>`;
  },
  salvar() {
    const som = document.getElementById('checkSom').checked;
    Storage.salvarConfig({ tema: 'claro', som });
    alert('Configurações salvas!');
  }
};

window.vip = false;

if (localStorage.getItem('hebraico_vip') === 'true') {
  window.vip = true;
}

document.addEventListener('DOMContentLoaded', () => {
  
  // Exposição global (sem Firebase)
  window.Router = Router;
  window.Curso = Curso;
  window.Perfil = Perfil;
  window.Quiz = Quiz;
  window.ConquistasPage = ConquistasPage;
  window.Configuracoes = Configuracoes;
  window.NovidadesPage = NovidadesPage;
  window.AdminPage = AdminPage;
  window.AssinaturaPage = AssinaturaPage;
  window.DataLoader = DataLoader;
  window.Flashcards = Flashcards;
  window.Memoria = Memoria;
  window.CacaPalavras = CacaPalavras;
  window.Forca = Forca;
  window.ArrastarLetras = ArrastarLetras;
  window.BibliaPage = BibliaPage;
  window.DicionarioPage = DicionarioPage;
  window.Storage = Storage;

  document.getElementById('perfilNome').textContent = Storage.getPerfil().nome;
  Router.init();

  // Menu mobile
  const btnHamburger = document.getElementById('btnHamburger');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('overlay');
  btnHamburger.addEventListener('click', () => { sidebar.classList.add('aberta'); overlay.classList.add('ativo'); });
  overlay.addEventListener('click', () => { sidebar.classList.remove('aberta'); overlay.classList.remove('ativo'); });
  document.querySelectorAll('#menuLateral .menu-btn').forEach(btn => {
    btn.addEventListener('click', () => { sidebar.classList.remove('aberta'); overlay.classList.remove('ativo'); });
  });

  // Tema
  const btnTema = document.getElementById('btnTema');
  const temaSalvo = localStorage.getItem('hebraico_tema') || 'claro';
  document.body.classList.toggle('dark', temaSalvo === 'escuro');
  if (btnTema) {
    const icon = btnTema.querySelector('.material-symbols-outlined');
    if (icon) icon.textContent = temaSalvo === 'escuro' ? 'light_mode' : 'dark_mode';
    btnTema.addEventListener('click', () => {
      const ativo = document.body.classList.toggle('dark');
      const novoTema = ativo ? 'escuro' : 'claro';
      localStorage.setItem('hebraico_tema', novoTema);
      if (icon) icon.textContent = novoTema === 'escuro' ? 'light_mode' : 'dark_mode';
    });
  }
});