const CacaPalavras = {
  grid: [],
  palavras: [],
  selecionadas: [],
  tamanho: 10,
  selecaoAtual: [],

  async render() {
    try {
      const palavras = await DataLoader.carregarJSON('dicionario');
      const candidatas = palavras.filter(p => p.hebraico.length >= 3 && p.hebraico.length <= 6);
      if (candidatas.length === 0) return '<p>Sem palavras disponíveis.</p>';
      CacaPalavras.palavras = CacaPalavras.embaralhar(candidatas).slice(0, 5);
      CacaPalavras.selecionadas = [];
      CacaPalavras.selecaoAtual = [];
      CacaPalavras.gerarGrid();
      return CacaPalavras.montarTabuleiro();
    } catch (e) {
      console.error(e);
      return '<p style="color:var(--danger)">Erro ao carregar caça-palavras.</p>';
    }
  },

  embaralhar(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  gerarGrid() {
    this.grid = Array(this.tamanho).fill().map(() => Array(this.tamanho).fill(''));
    const letras = 'אבגדהוזחטיכלמנסעפצקרשת';
    this.palavras.forEach(p => {
      const direcao = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const letrasArr = p.hebraico.split('');
      let colocada = false;
      let tentativas = 0;
      while (!colocada && tentativas < 100) {
        tentativas++;
        if (direcao === 'horizontal') {
          const linha = Math.floor(Math.random() * this.tamanho);
          const colInicio = Math.floor(Math.random() * (this.tamanho - letrasArr.length + 1));
          if (this.podeInserir(linha, colInicio, letrasArr, 'horizontal')) {
            this.inserirPalavra(linha, colInicio, letrasArr, 'horizontal');
            colocada = true;
          }
        } else {
          const col = Math.floor(Math.random() * this.tamanho);
          const linhaInicio = Math.floor(Math.random() * (this.tamanho - letrasArr.length + 1));
          if (this.podeInserir(linhaInicio, col, letrasArr, 'vertical')) {
            this.inserirPalavra(linhaInicio, col, letrasArr, 'vertical');
            colocada = true;
          }
        }
      }
    });
    for (let i = 0; i < this.tamanho; i++) {
      for (let j = 0; j < this.tamanho; j++) {
        if (this.grid[i][j] === '') this.grid[i][j] = letras[Math.floor(Math.random() * letras.length)];
      }
    }
  },

  podeInserir(linha, col, letras, direcao) {
    for (let k = 0; k < letras.length; k++) {
      const l = direcao === 'horizontal' ? linha : linha + k;
      const c = direcao === 'horizontal' ? col + k : col;
      if (this.grid[l][c] !== '' && this.grid[l][c] !== letras[k]) return false;
    }
    return true;
  },

  inserirPalavra(linha, col, letras, direcao) {
    for (let k = 0; k < letras.length; k++) {
      const l = direcao === 'horizontal' ? linha : linha + k;
      const c = direcao === 'horizontal' ? col + k : col;
      this.grid[l][c] = letras[k];
    }
  },

  montarTabuleiro() {
    let html = `
      <div class="fade-in">
        <h2>Caça-palavras</h2>
        <p>Clique nas letras para selecionar.</p>
        <div style="display:flex; gap:24px; flex-wrap:wrap; margin-top:16px;">
          <div id="gridCaca" style="display:grid; grid-template-columns:repeat(${CacaPalavras.tamanho},40px); gap:2px;">`;
    for (let i = 0; i < CacaPalavras.tamanho; i++) {
      for (let j = 0; j < CacaPalavras.tamanho; j++) {
        html += `<div class="celula-caca" data-action="CacaPalavras.clicarCelula" data-args='[${i},${j}]' 
                 style="width:40px; height:40px; display:flex; align-items:center; justify-content:center; 
                        background:var(--surface); border:1px solid var(--border); border-radius:4px; 
                        cursor:pointer; font-size:1.2rem; user-select:none;">${CacaPalavras.grid[i][j]}</div>`;
      }
    }
    html += `</div><div><h3>Palavras:</h3><ul id="listaPalavras" style="list-style:none; padding:0;">`;
    CacaPalavras.palavras.forEach(p => {
      html += `<li class="palavra-alvo" data-palavra="${p.hebraico}">${p.hebraico} (${p.significado})</li>`;
    });
    html += `</ul></div></div>
        <button class="btn-secundario" onclick="Router.navegar('caca-palavras')" style="margin-top:16px;">Novo jogo</button>
      </div>`;
    return html;
  },

  clicarCelula(linha, col) {
    const celula = document.querySelector(`.celula-caca[data-args='[${linha},${col}]']`);
    if (!celula || celula.classList.contains('encontrada')) return;
    if (celula.classList.contains('selecionada')) {
      celula.classList.remove('selecionada');
      CacaPalavras.selecaoAtual = CacaPalavras.selecaoAtual.filter(c => !(c.linha === linha && c.col === col));
    } else {
      celula.classList.add('selecionada');
      CacaPalavras.selecaoAtual.push({ linha, col });
    }
    CacaPalavras.verificarPalavra();
  },

  verificarPalavra() {
    if (CacaPalavras.selecaoAtual.length < 2) return;
    const letras = CacaPalavras.selecaoAtual.map(c => CacaPalavras.grid[c.linha][c.col]).join('');
    const palavraEncontrada = CacaPalavras.palavras.find(p => p.hebraico === letras);
    if (palavraEncontrada && !CacaPalavras.selecionadas.includes(letras)) {
      CacaPalavras.selecionadas.push(letras);
      CacaPalavras.selecaoAtual.forEach(c => {
        const cel = document.querySelector(`.celula-caca[data-args='[${c.linha},${c.col}]']`);
        if (cel) { cel.classList.add('encontrada'); cel.style.background = 'var(--success)'; cel.style.color = 'white'; }
      });
      document.querySelector(`.palavra-alvo[data-palavra="${letras}"]`).style.textDecoration = 'line-through';
      CacaPalavras.selecaoAtual = [];
      document.querySelectorAll('.celula-caca.selecionada').forEach(el => el.classList.remove('selecionada'));
      if (CacaPalavras.selecionadas.length === CacaPalavras.palavras.length) {
        Storage.getPerfil().xp += 40;
        Storage.salvarPerfil(Storage.getPerfil());
        Storage.addOuro(15);
        alert('Parabéns! +40 XP, +15 ouro.');
      }
    }
  }
};