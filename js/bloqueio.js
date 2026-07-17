document.addEventListener('DOMContentLoaded', () => {
  window.vip = false;
  // força recarregar a página se não estiver bloqueada
  if (!window.vip) {
    console.log('Sistema em modo gratuito. Conteúdo restrito.');
  }
});