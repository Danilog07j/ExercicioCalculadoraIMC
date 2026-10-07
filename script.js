const formulario = document.getElementById("form-imc");
const nome = document.getElementById("nome");
const peso = document.getElementById("peso");
const altura = document.getElementById("altura");
const resultado = document.getElementById("resultado");
const btnLimpar = document.getElementById("btn-limpar");
const pesquisa = document.getElementById("pesquisa");
const medias = document.getElementById("medias");
const listaCards = document.getElementById("lista-cards");

const mensagemInicial = "Digite seu nome, peso e altura.";


const cadastros = [];

function classificar(imc) {
  if (imc < 18.5) return "Abaixo do peso";
  if (imc < 25) return "Peso normal";
  if (imc < 30) return "Sobrepeso";
  if (imc < 35) return "Obesidade grau I";
  if (imc < 40) return "Obesidade grau II";
  return "Obesidade grau III";
}


function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function media(lista, campo) {
  const soma = lista.reduce(function (total, item) {
    return total + item[campo];
  }, 0);
  return soma / lista.length;
}


function extremo(lista, maior) {
  return lista.reduce(function (atual, item) {
    if (maior) {
      return item.imc > atual.imc ? item : atual;
    }
    return item.imc < atual.imc ? item : atual;
  });
}

function criarCard(pessoa) {
  const card = document.createElement("div");
  card.className = "card";

  const titulo = document.createElement("h3");
  titulo.textContent = pessoa.nome;
  card.appendChild(titulo);

  const linhas = [
    "Peso: " + pessoa.peso + " kg",
    "Altura: " + pessoa.altura + " m",
    "IMC: " + pessoa.imc.toFixed(2),
    "Classificação: " + pessoa.classificacao
  ];

  linhas.forEach(function (texto) {
    const p = document.createElement("p");
    p.textContent = texto;
    card.appendChild(p);
  });

  return card;
}

function renderizar() {
  const termo = normalizar(pesquisa.value.trim());

  const filtrados = cadastros.filter(function (pessoa) {
    return normalizar(pessoa.nome).includes(termo);
  });

  listaCards.innerHTML = "";
  medias.innerHTML = "";

  if (filtrados.length === 0) {
    const aviso = document.createElement("p");
    aviso.textContent =
      cadastros.length === 0
        ? "Nenhum cadastro ainda."
        : "Nenhum cadastro encontrado.";
    listaCards.appendChild(aviso);
    return;
  }


  const titulo = document.createElement("h3");
  titulo.textContent =
    "Resumo (" + filtrados.length + (filtrados.length === 1 ? " cadastro)" : " cadastros)");

  const maior = extremo(filtrados, true);
  const menor = extremo(filtrados, false);

  const linhas = [
    "Peso: " + media(filtrados, "peso").toFixed(2) + " kg",
    "Altura: " + media(filtrados, "altura").toFixed(2) + " m",
    "IMC: " + media(filtrados, "imc").toFixed(2),
    "Maior IMC: " + maior.imc.toFixed(2) + " (" + maior.nome + ")",
    "Menor IMC: " + menor.imc.toFixed(2) + " (" + menor.nome + ")"
  ];

  medias.appendChild(titulo);
  linhas.forEach(function (texto) {
    const p = document.createElement("p");
    p.textContent = texto;
    medias.appendChild(p);
  });

  filtrados.forEach(function (pessoa) {
    listaCards.appendChild(criarCard(pessoa));
  });
}

function limparCampos() {
  formulario.reset();
  nome.focus();
}

formulario.addEventListener("submit", function (event) {
  event.preventDefault();

  const nomePessoa = nome.value.trim();
  const valorPeso = Number(peso.value);
  const valorAltura = Number(altura.value);

  if (nomePessoa === "") {
    resultado.textContent = "Insira um nome";
    return;
  }

  if (isNaN(valorPeso) || isNaN(valorAltura) || valorPeso <= 0 || valorAltura <= 0) {
    resultado.textContent = "Insira valores válidos";
    return;
  }

  const imc = valorPeso / (valorAltura * valorAltura);
  const classificacao = classificar(imc);

  resultado.innerHTML =
    "O IMC de " + nomePessoa + " é " + imc.toFixed(2) +
    "<br>Classificação: " + classificacao;

  cadastros.unshift({
    nome: nomePessoa,
    peso: valorPeso,
    altura: valorAltura,
    imc: imc,
    classificacao: classificacao
  });

  renderizar();
  limparCampos();
});

btnLimpar.addEventListener("click", function () {
  limparCampos();
  resultado.textContent = mensagemInicial;
});

pesquisa.addEventListener("input", renderizar);

renderizar();
