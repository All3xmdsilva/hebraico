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
        <button class="btn-primario" style="margin-top:1rem" data-action="Configuracoes.salvar">Salvar</button>
      </div>`;
  },
  salvar() {
    const som = document.getElementById('checkSom').checked;
    Storage.salvarConfig({ tema: 'claro', som });
    alert('Configurações salvas!');
  }
};

window.addEventListener('DOMContentLoaded', () => {
  window.Router = Router;
  window.Curso = Curso;
  window.Perfil = Perfil;
  window.Quiz = Quiz;
  window.ConquistasPage = ConquistasPage;
  window.Configuracoes = Configuracoes;
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
  document.body.addEventListener('click', () => console.log('click no body'));

  const btnHamburger = document.getElementById('btnHamburger');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('overlay');
  function abrirMenu() { sidebar.classList.add('aberta'); overlay.classList.add('ativo'); }
  function fecharMenu() { sidebar.classList.remove('aberta'); overlay.classList.remove('ativo'); }
  btnHamburger.addEventListener('click', abrirMenu);
  overlay.addEventListener('click', fecharMenu);
  document.querySelectorAll('#menuLateral .menu-btn').forEach(b => b.addEventListener('click', fecharMenu));

  const btnTema = document.getElementById('btnTema');
  const temaSalvo = localStorage.getItem('hebraico_tema') || 'claro';
  document.body.classList.toggle('dark', temaSalvo === 'escuro');
  atualizarIconeTema(temaSalvo);
  btnTema.addEventListener('click', () => {
    const ativo = document.body.classList.toggle('dark');
    const novoTema = ativo ? 'escuro' : 'claro';
    localStorage.setItem('hebraico_tema', novoTema);
    atualizarIconeTema(novoTema);
  });
  function atualizarIconeTema(tema) {
    const icon = document.querySelector('#btnTema .material-symbols-outlined');
    if (icon) icon.textContent = tema === 'escuro' ? 'light_mode' : 'dark_mode';
  }
});