const AdminPage = {
  senhaCorreta: 'hebraico2026',
  abaAtual: 'codigos',

  async render() {
    const logado = sessionStorage.getItem('admin_logado') === 'true';
    if (!logado) return AdminPage.renderLogin();
    if (AdminPage.abaAtual === 'solicitacoes') return AdminPage.renderSolicitacoes();
    return AdminPage.renderPainel();
  },

  renderLogin() {
    return `
      <div class="fade-in card" style="max-width:400px; margin:0 auto;">
        <h2>🔐 Área Administrativa</h2>
        <p>Digite a senha para continuar.</p>
        <input type="password" id="adminSenha" placeholder="Senha" style="width:100%; padding:10px; margin:8px 0; border:1px solid var(--border); border-radius:4px;">
        <button class="btn-primario" id="btnAdminEntrar" style="width:100%;">Entrar</button>
        <p id="adminMensagem" style="margin-top:8px; color:var(--danger);"></p>
      </div>
    `;
  },

  renderPainel() {
    const codigos = AdminPage.getCodigos();
    return `
      <div class="fade-in">
        <h2>⚙️ Painel Administrativo</h2>
        <button class="btn-perigo" id="btnAdminSair" style="margin-bottom:16px;">Sair</button>
        <div style="display:flex; gap:8px; margin-bottom:16px;">
          <button class="btn-primario" id="btnAbaCodigos" style="flex:1;">🎫 Códigos</button>
          <button class="btn-secundario" id="btnAbaSolicitacoes" style="flex:1;">📩 Solicitações</button>
        </div>
        <div class="card" style="margin-bottom:16px;">
          <h3>Gerar novos códigos</h3>
          <div style="display:flex; gap:8px; margin-top:8px;">
            <input type="number" id="qtdCodigos" value="5" min="1" style="width:80px; padding:8px; border:1px solid var(--border); border-radius:4px;">
            <button class="btn-primario" id="btnGerarCodigos">Gerar</button>
          </div>
        </div>
        <div class="card">
          <h3>Códigos ativos (${codigos.length})</h3>
          <div id="listaCodigos" style="margin-top:8px;">
            ${codigos.map(cod => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:4px 0; border-bottom:1px solid var(--border);">
                <span>${cod}</span>
                <button class="btn-perigo" onclick="AdminPage.revogarCodigo('${cod}')" style="padding:4px 8px; font-size:0.8rem;">Revogar</button>
              </div>`).join('')}
          </div>
        </div>
      </div>
    `;
  },

  renderSolicitacoes() {
    const solicitacoes = JSON.parse(localStorage.getItem('hebraico_solicitacoes_vip') || '[]');
    return `
      <div class="fade-in">
        <h2>📩 Solicitações de VIP</h2>
        <button class="btn-perigo" id="btnAdminSair" style="margin-bottom:16px;">Sair</button>
        <div style="display:flex; gap:8px; margin-bottom:16px;">
          <button class="btn-secundario" id="btnAbaCodigos" style="flex:1;">🎫 Códigos</button>
          <button class="btn-primario" id="btnAbaSolicitacoes" style="flex:1;">📩 Solicitações</button>
        </div>
        <div class="card">
          <h3>Pendentes (${solicitacoes.filter(s => s.status === 'pendente').length})</h3>
          ${solicitacoes.length === 0 ? '<p>Nenhuma solicitação.</p>' : ''}
          ${solicitacoes.map((s, i) => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--border);">
              <div>
                <strong>${s.email}</strong><br>
                <small>${s.comprovante} - ${new Date(s.data).toLocaleDateString()}</small><br>
                <small>Status: ${s.status}</small>
              </div>
              ${s.status === 'pendente' ? `
                <button class="btn-primario" onclick="AdminPage.liberarVip(${i})" style="padding:4px 8px; font-size:0.8rem;">Liberar VIP</button>
              ` : '<span style="color:var(--success);">Liberado</span>'}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  setupEvents() {
    const btnEntrar = document.getElementById('btnAdminEntrar');
    if (btnEntrar) {
      btnEntrar.addEventListener('click', () => {
        const senha = document.getElementById('adminSenha').value;
        if (senha === AdminPage.senhaCorreta) {
          sessionStorage.setItem('admin_logado', 'true');
          Router.navegar('admin');
        } else {
          document.getElementById('adminMensagem').textContent = 'Senha incorreta.';
        }
      });
    }

    const btnSair = document.getElementById('btnAdminSair');
    if (btnSair) {
      btnSair.addEventListener('click', () => {
        sessionStorage.removeItem('admin_logado');
        Router.navegar('admin');
      });
    }

    const btnAbaCodigos = document.getElementById('btnAbaCodigos');
    if (btnAbaCodigos) {
      btnAbaCodigos.addEventListener('click', () => {
        AdminPage.abaAtual = 'codigos';
        Router.navegar('admin');
      });
    }

    const btnAbaSolicitacoes = document.getElementById('btnAbaSolicitacoes');
    if (btnAbaSolicitacoes) {
      btnAbaSolicitacoes.addEventListener('click', () => {
        AdminPage.abaAtual = 'solicitacoes';
        Router.navegar('admin');
      });
    }

    const btnGerar = document.getElementById('btnGerarCodigos');
    if (btnGerar) {
      btnGerar.addEventListener('click', () => {
        const qtd = parseInt(document.getElementById('qtdCodigos').value) || 5;
        const novos = [];
        for (let i = 0; i < qtd; i++) {
          const cod = 'VIP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
          novos.push(cod);
        }
        const atuais = AdminPage.getCodigos();
        const lista = [...atuais, ...novos];
        localStorage.setItem('hebraico_codigos_vip', JSON.stringify(lista));
        Router.navegar('admin');
      });
    }
  },

  getCodigos() {
    try {
      return JSON.parse(localStorage.getItem('hebraico_codigos_vip')) || ['VIP2026', 'ALEFVIP'];
    } catch (e) {
      return ['VIP2026', 'ALEFVIP'];
    }
  },

  revogarCodigo(codigo) {
    if (!confirm(`Revogar o código ${codigo}?`)) return;
    const codigos = AdminPage.getCodigos().filter(c => c !== codigo);
    localStorage.setItem('hebraico_codigos_vip', JSON.stringify(codigos));
    Router.navegar('admin');
  },

  liberarVip(indice) {
    const solicitacoes = JSON.parse(localStorage.getItem('hebraico_solicitacoes_vip') || '[]');
    if (solicitacoes[indice]) {
      solicitacoes[indice].status = 'liberado';
      localStorage.setItem('hebraico_solicitacoes_vip', JSON.stringify(solicitacoes));
      const codigo = 'VIP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const codigos = AdminPage.getCodigos();
      codigos.push(codigo);
      localStorage.setItem('hebraico_codigos_vip', JSON.stringify(codigos));
      alert(`VIP liberado! Código: ${codigo} (vinculado ao email ${solicitacoes[indice].email})`);
      Router.navegar('admin');
    }
  }
};