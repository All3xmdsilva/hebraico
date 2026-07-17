const AuthUI = {
  render() {
    if (typeof auth !== 'undefined' && auth && !auth.currentUser) {
      return `
        <div class="fade-in card" style="max-width:400px; margin:0 auto;">
          <h2>Entrar ou Cadastrar</h2>
          <form id="loginForm">
            <div class="form-grupo"><label>Email</label><input type="email" id="authEmail" required></div>
            <div class="form-grupo"><label>Senha</label><input type="password" id="authSenha" required minlength="6"></div>
            <button class="btn-primario" type="submit">Entrar</button>
            <button class="btn-secundario" type="button" id="btnCriarConta">Criar Conta</button>
          </form>
          <p id="authMensagem" style="margin-top:12px;"></p>
        </div>
      `;
    }
    if (typeof auth !== 'undefined' && auth && auth.currentUser) {
      return Perfil.render();
    }
    return Perfil.render();
  },

  setupEvents() {
    if (typeof auth === 'undefined' || !auth) return;
    const form = document.getElementById('loginForm');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('authEmail').value;
      const senha = document.getElementById('authSenha').value;
      const msg = document.getElementById('authMensagem');
      try {
        await auth.signInWithEmailAndPassword(email, senha);
        Router.navegar('perfil');
      } catch (error) {
        msg.textContent = 'Erro: ' + error.message;
      }
    });
    const btnCriar = document.getElementById('btnCriarConta');
    if (btnCriar) {
      btnCriar.addEventListener('click', async () => {
        const email = document.getElementById('authEmail').value;
        const senha = document.getElementById('authSenha').value;
        const msg = document.getElementById('authMensagem');
        try {
          const cred = await auth.createUserWithEmailAndPassword(email, senha);
          await db.collection('usuarios').doc(cred.user.uid).set({
            email, vip: false, xp: 0, nivel: 1, ouro: 0
          });
          Router.navegar('perfil');
        } catch (error) {
          msg.textContent = 'Erro: ' + error.message;
        }
      });
    }
  }
};