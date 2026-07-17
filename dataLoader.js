const DataLoader = {
  cache: {},
  async carregarJSON(nome) {
    if (this.cache[nome]) return this.cache[nome];
    const resposta = await fetch(`data/${nome}.json`);
    const dados = await resposta.json();
    this.cache[nome] = dados;
    return dados;
  }
};