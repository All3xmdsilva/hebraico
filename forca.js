window.vip = window.vip || false;

const Forca = {
  palavra: {},
  letrasCorretas: [],
  letrasErradas: [],
  maxErros: 6,

  async render() {
    try {
      const palavras = await DataLoader.carregarJSON('dicionario');
      const validas = palavras.filter(p => p.hebraico.length >= 3 && p.hebraico.length <= 6);
      if (validas.length === 0) return '<p>Sem palavras disponíveis.</p>';
      Forca.palavra = validas[Math.floor(Math.random() * validas.length)];
      Forca.letrasCorretas = [];
      Forca.letrasErradas = [];
      return Forca.montarTela();
    } catch (e) {
      console.error(e);
      return '<p style="color:var(--danger)">Erro ao carregar forca.</p>';
    }
  },

  montarTela() {
    const exibida = Forca.palavra.hebraico.split('').map(l => Forca.letrasCorretas.includes(l) ? l : '_').join(' ');
    const enforcado = Forca.desenharForca(Forca.letrasErradas.length);
    let html = `
      <div class="fade-in" style="max-width:500px; margin:0 auto;">
        <h2>Forca</h2>
        <div class="card" style="text-align:center; font-size:2rem; font-family:'Cinzel',serif; direction:rtl;">${exibida}</div>
        <p style="margin-top:8px;">Dica: ${Forca.palavra.significado}</p>
        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:16px; justify-content:center;">${Forca.gerarBotoesLetras()}</div>
        <p style="color:var(--danger);">Erros: ${Forca.letrasErradas.length}/${Forca.maxErros}</p>
        <pre>${enforcado}</pre>
        <button class="btn-secundario" onclick="Router.navegar('forca')">Nova palavra</button>`;
if (!window.vip) {
  html += `<div class="card" style="margin-top:8px; text-align:center;">
    <span style="font-size:2rem;">🔒</span>
    <p>Recursos extras liberados apenas para VIP.</p>
    <button class="btn-primario" onclick="Router.navegar('assinatura')">Seja VIP 🌟</button>
  </div>`;
}
    html += `</div>`;

    if (!exibida.includes('_')) {
      setTimeout(() => {
        alert(`Parabéns! +20 XP, +5 ouro.`);
        Storage.getPerfil().xp += 20;
        Storage.salvarPerfil(Storage.getPerfil());
        Storage.addOuro(5);
        Router.navegar('forca');
      }, 100);
    } else if (Forca.letrasErradas.length >= Forca.maxErros) {
      setTimeout(() => {
        alert(`Que pena! A palavra era: ${Forca.palavra.hebraico}`);
        Router.navegar('forca');
      }, 100);
    }
    return html;
  },

  gerarBotoesLetras() {
    const alfabeto = 'אבגדהוזחטיכלמנסעפצקרשת';
    let botoes = '';
    for (const letra of alfabeto) {
      const desabilitada = Forca.letrasCorretas.includes(letra) || Forca.letrasErradas.includes(letra);
      botoes += `<button class="btn-secundario" style="padding:8px 12px;" ${desabilitada ? 'disabled' : ''} onclick="Forca.tentarLetra('${letra}')">${letra}</button>`;
    }
    return botoes;
  },

  tentarLetra(letra) {
    if (Forca.palavra.hebraico.includes(letra)) Forca.letrasCorretas.push(letra);
    else Forca.letrasErradas.push(letra);
    document.getElementById('conteudo').innerHTML = Forca.montarTela();
  },

  desenharForca(erros) {
    const estagios = [
      "  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========",
      "  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========",
      "  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========",
      "  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========",
      "  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========",
      "  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========",
      "  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n========="
    ];
    return estagios[erros] || estagios[6];
  }
};