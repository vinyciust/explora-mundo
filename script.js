// API pública com informações dos países
const API = 'https://countries.dev';
const CAMPOS = 'name,capital,region,population,flags,alpha3Code';

const lista = document.getElementById('lista-paises');
const mensagem = document.getElementById('mensagem');
const quantidade = document.getElementById('quantidade');
const campoNome = document.getElementById('nome-pais');
const campoRegiao = document.getElementById('regiao');
const janela = document.getElementById('janela');
const detalhes = document.getElementById('detalhes');

// Faz uma requisição para a API e transforma o resultado em JSON.
async function consultarAPI(caminho) {
  const resposta = await fetch(API + caminho);
  if (!resposta.ok) {
    throw new Error('Erro HTTP ' + resposta.status);
  }
  return await resposta.json();
}

function nomeDoPais(pais) {
  return pais.name || 'Sem nome';
}

function mostrarMensagem(texto) {
  mensagem.textContent = texto;
  mensagem.style.display = 'block';
}

// Exibe vários países usando repetição.
function mostrarPaises(paises) {
  lista.innerHTML = '';
  const ordenados = [...paises].sort((a, b) => nomeDoPais(a).localeCompare(nomeDoPais(b), 'pt-BR'));
  quantidade.textContent = ordenados.length + ' países';
  mensagem.style.display = ordenados.length ? 'none' : 'block';
  if (!ordenados.length) mostrarMensagem('Nenhum país encontrado.');

  ordenados.forEach(pais => {
    const cartao = document.createElement('article');
    cartao.className = 'cartao';

    const imagem = document.createElement('img');
    imagem.className = 'bandeira';
    imagem.src = pais.flags?.png || pais.flags?.svg || '';
    imagem.alt = 'Bandeira de ' + nomeDoPais(pais);
    imagem.loading = 'lazy';
    cartao.appendChild(imagem);

    const conteudo = document.createElement('div');
    conteudo.className = 'conteudo-cartao';
    const titulo = document.createElement('h3');
    titulo.textContent = nomeDoPais(pais);
    conteudo.appendChild(titulo);

    const capital = document.createElement('p');
    capital.textContent = 'Capital: ' + (pais.capital || 'Não informada');
    conteudo.appendChild(capital);

    const regiao = document.createElement('p');
    regiao.textContent = 'Região: ' + (pais.region || 'Não informada');
    conteudo.appendChild(regiao);

    const botao = document.createElement('button');
    botao.className = 'ver-detalhes';
    botao.textContent = 'Ver detalhes →';
    botao.addEventListener('click', () => abrirDetalhes(pais.alpha3Code));
    conteudo.appendChild(botao);
    cartao.appendChild(conteudo);
    lista.appendChild(cartao);
  });
}

// Método 1: buscar todos os países, sem filtro.
async function carregarTodos() {
  lista.innerHTML = '';
  quantidade.textContent = 'Carregando...';
  mostrarMensagem('Carregando países...');
  try {
    const paises = await consultarAPI('/countries?fields=' + CAMPOS);
    mostrarPaises(paises);
  } catch (erro) {
    mostrarMensagem('Não foi possível acessar a API. Confira a conexão e tente novamente.');
    console.error('Erro na consulta à API:', erro);
    quantidade.textContent = 'Erro';
  }
}

// Método 2: buscar países por nome, com filtro.
document.getElementById('form-busca').addEventListener('submit', async function(evento) {
  evento.preventDefault();
  const nome = campoNome.value.trim();
  if (!nome) {
    campoRegiao.value = '';
    carregarTodos();
    return;
  }
  campoRegiao.value = '';
  lista.innerHTML = '';
  mostrarMensagem('Pesquisando...');
  try {
    const paises = await consultarAPI('/name/' + encodeURIComponent(nome));
    mostrarPaises(paises);
  } catch (erro) {
    if (erro.message.includes('404')) mostrarPaises([]);
    else { mostrarMensagem('Erro na pesquisa. Tente novamente.'); console.error(erro); }
  }
});

// Método 3: buscar países por região, com filtro.
campoRegiao.addEventListener('change', async function() {
  campoNome.value = '';
  if (!campoRegiao.value) {
    carregarTodos();
    return;
  }
  lista.innerHTML = '';
  mostrarMensagem('Filtrando por região...');
  try {
    const paises = await consultarAPI('/region/' + encodeURIComponent(campoRegiao.value));
    mostrarPaises(paises);
  } catch (erro) {
    mostrarMensagem('Não foi possível buscar essa região.');
    console.error(erro);
  }
});

// Método 4: buscar um único país pelo código, sem repetição.
async function abrirDetalhes(codigo) {
  janela.classList.remove('escondido');
  detalhes.innerHTML = '<p>Carregando detalhes...</p>';
  try {
    const resultado = await consultarAPI('/alpha/' + encodeURIComponent(codigo));
    const pais = Array.isArray(resultado) ? resultado[0] : resultado;
    const bandeira = document.createElement('img');
    bandeira.className = 'bandeira-detalhe';
    bandeira.src = pais.flags?.svg || pais.flags?.png || '';
    bandeira.alt = 'Bandeira de ' + nomeDoPais(pais);
    const titulo = document.createElement('h2');
    titulo.id = 'titulo-detalhes';
    titulo.textContent = nomeDoPais(pais);
    detalhes.replaceChildren(titulo, bandeira);
    const informacoes = [
      ['Nome oficial', pais.name],
      ['Capital', pais.capital],
      ['Região', pais.region],
      ['Sub-região', pais.subregion],
      ['População', pais.population?.toLocaleString('pt-BR')],
      ['Área', pais.area ? pais.area.toLocaleString('pt-BR') + ' km²' : null],
      ['Idiomas', pais.languages ? pais.languages.map(idioma => idioma.name).join(', ') : null],
      ['Moeda', pais.currencies ? pais.currencies.map(moeda => moeda.name).join(', ') : null]
    ];
    informacoes.forEach(([rotulo, valor]) => {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = rotulo + ': ';
      p.append(strong, document.createTextNode(valor || 'Não informado'));
      detalhes.appendChild(p);
    });
  } catch (erro) {
    detalhes.textContent = 'Não foi possível carregar os detalhes deste país.';
  }
}

function fecharDetalhes() {
  janela.classList.add('escondido');
}

document.getElementById('fechar').addEventListener('click', fecharDetalhes);
janela.addEventListener('click', evento => {
  if (evento.target === janela) fecharDetalhes();
});
document.addEventListener('keydown', evento => {
  if (evento.key === 'Escape') fecharDetalhes();
});
document.getElementById('limpar').addEventListener('click', () => {
  campoNome.value = '';
  campoRegiao.value = '';
  carregarTodos();
});

carregarTodos();
