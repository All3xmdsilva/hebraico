const Acesso = {
  async isVip() {
    if (typeof auth === 'undefined' || !auth || !auth.currentUser) return false;
    try {
      const doc = await db.collection('usuarios').doc(auth.currentUser.uid).get();
      return doc.exists && doc.data().vip === true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
};