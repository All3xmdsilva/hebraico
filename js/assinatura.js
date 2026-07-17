const AssinaturaPage = {
  valor: 29.90,
  chavePix: 'all3xmds@gmail.com', // substitua pela sua chave PIX real

  render() {
    const qrCodeUrl = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${encodeURIComponent(AssinaturaPage.chavePix)}`;
    return `
      <div class="fade-in" style="max-width:500px; margin:0 auto;">
        <h2>Seja VIP</h2>
        <div class="card">
          <h3>Valor: R$ ${AssinaturaPage.valor.toFixed(2)}</h3>
          <p>Escaneie o QR Code com seu banco ou copie a chave PIX:</p>
          <div style="text-align:center; margin:16px 0;">
            <img src="${qrCodeUrl}" alt="QR Code PIX" style="max-width:200px;" onerror="this.style.display='none'">
          </div>
          <p style="word-break:break-all; background:var(--surface); padding:8px; border-radius:4px;">${AssinaturaPage.chavePix}</p>
          <button class="btn-secundario" onclick="navigator.clipboard.writeText('${AssinaturaPage.chavePix}').then(()=>alert('Chave copiada!'))">Copiar chave</button>
        </div>
        <div class="card" style="margin-top:16px;">
          <h3>Já pagou?</h3>
          <p>Cole o código da transação ou um identificador do comprovante:</p>
          <input type="text" id="comprovante" placeholder="Ex: TRANS123" style="width:100%; padding:8px; margin:8px 0; border:1px solid var(--border); border-radius:4px;">
          <button class="btn-primario" id="btnSolicitarVip" style="width:100%;">Solicitar VIP</button>
          <p id="msgSolicitacao" style="margin-top:8px; color:var(--success);"></p>
        </div>
      </div>
    `;
  },

  setupEvents() {
    const btn = document.getElementById('btnSolicitarVip');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const comprovante = document.getElementById('comprovante').value.trim();
      if (!comprovante) return alert('Cole o comprovante.');
      const perfil = Storage.getPerfil();
      const solicitacoes = JSON.parse(localStorage.getItem('hebraico_solicitacoes_vip') || '[]');
      solicitacoes.push({
        email: perfil.email || 'anonimo@email.com',
        comprovante: comprovante,
        data: new Date().toISOString(),
        status: 'pendente'
      });
      localStorage.setItem('hebraico_solicitacoes_vip', JSON.stringify(solicitacoes));
      document.getElementById('msgSolicitacao').textContent = 'Solicitação enviada! Aguarde a liberação.';
      btn.disabled = true;
    });
  }
};