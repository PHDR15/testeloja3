// Dados do catálogo (livros fictícios criados para este trabalho)
var books = [
  { id: 1, titulo: "O Farol de Papel", autor: "Helena Duarte", genero: "Romance", preco: 54.90, img: "images/livro1.jpg", desc: "Uma bibliotecária herda um farol abandonado e descobre, entre as estantes, cartas que nunca foram entregues. Um romance sobre memória e recomeços." },
  { id: 2, titulo: "Rios Subterrâneos", autor: "Caio Bastos", genero: "Ficção científica", preco: 62.00, img: "images/livro2.jpg", desc: "Em uma cidade construída sobre a água, uma engenheira segue um rio que ninguém deveria conhecer. Ficção científica com clima de mistério." },
  { id: 3, titulo: "Receitas de Domingo", autor: "Marta Lins", genero: "Gastronomia", preco: 79.90, img: "images/livro3.jpg", desc: "Cinquenta receitas de família para preparar sem pressa, com histórias de quem cozinhou cada prato antes de você." },
  { id: 4, titulo: "A Última Estação", autor: "Otávio Reis", genero: "Suspense", preco: 49.90, img: "images/livro4.jpg", desc: "Um trem noturno, seis passageiros e uma parada que não estava no itinerário. Suspense para ler de uma vez só." },
  { id: 5, titulo: "Cartas ao Mar", autor: "Inês Carvalho", genero: "Poesia", preco: 39.90, img: "images/livro5.jpg", desc: "Poemas curtos escritos à beira-mar, sobre saudade, partida e o que a maré devolve." },
  { id: 6, titulo: "Mapa das Coisas Perdidas", autor: "Bruno Andrade", genero: "Aventura", preco: 58.00, img: "images/livro6.jpg", desc: "Três irmãos encontram um mapa que leva a objetos esquecidos ao redor do mundo. Uma aventura para leitores de todas as idades." },
  { id: 7, titulo: "Pequeno Manual de Silêncio", autor: "Lúcia Prado", genero: "Crônicas", preco: 44.90, img: "images/livro7.jpg", desc: "Crônicas curtas sobre pausas, esperas e o valor de não dizer nada. Boas para ler antes de dormir." },
  { id: 8, titulo: "Código e Café", autor: "Rafael Nunes", genero: "Tecnologia", preco: 89.90, img: "images/livro8.jpg", desc: "Um guia prático de programação para iniciantes, com exercícios curtos e explicações em linguagem simples." }
];

function formatarPreco(v) {
  return "R$ " + v.toFixed(2).replace(".", ",");
}
function buscarLivro(id) {
  for (var i = 0; i < books.length; i++) { if (books[i].id === Number(id)) return books[i]; }
  return null;
}

// Carrinho salvo no navegador (localStorage)
function lerCarrinho() {
  try { return JSON.parse(localStorage.getItem("carrinho")) || []; } catch (e) { return []; }
}
function salvarCarrinho(c) {
  localStorage.setItem("carrinho", JSON.stringify(c));
  atualizarContador();
}
function adicionarAoCarrinho(id, qtd) {
  var c = lerCarrinho();
  var achou = false;
  for (var i = 0; i < c.length; i++) {
    if (c[i].id === Number(id)) { c[i].qtd += qtd; achou = true; }
  }
  if (!achou) c.push({ id: Number(id), qtd: qtd });
  salvarCarrinho(c);
}
function atualizarContador() {
  var total = 0, c = lerCarrinho();
  for (var i = 0; i < c.length; i++) total += c[i].qtd;
  var els = document.querySelectorAll(".cart-count");
  for (var j = 0; j < els.length; j++) els[j].textContent = total;
}

// Página inicial: botões "Adicionar ao carrinho"
function iniciarHome() {
  var botoes = document.querySelectorAll("[data-add]");
  botoes.forEach(function (b) {
    b.addEventListener("click", function () {
      adicionarAoCarrinho(b.getAttribute("data-add"), 1);
      b.textContent = "Adicionado";
      setTimeout(function () { b.textContent = "Adicionar ao carrinho"; }, 1200);
    });
  });
}

// Página do produto
function iniciarProduto() {
  var alvo = document.getElementById("produto");
  if (!alvo) return;
  var id = new URLSearchParams(window.location.search).get("id");
  var livro = buscarLivro(id);
  if (!livro) {
    alvo.innerHTML = '<p class="empty">Livro não encontrado. <a href="index.html#catalogo">Voltar ao catálogo</a></p>';
    return;
  }
  document.title = livro.titulo + " | Livraria Marginália";
  document.getElementById("caminho").textContent = livro.titulo;
  alvo.innerHTML =
    '<img src="' + livro.img + '" alt="Capa do livro ' + livro.titulo + '">' +
    '<div>' +
      '<span class="tag">' + livro.genero + '</span>' +
      '<h1>' + livro.titulo + '</h1>' +
      '<p class="author">por ' + livro.autor + '</p>' +
      '<p>' + livro.desc + '</p>' +
      '<p class="price">' + formatarPreco(livro.preco) + '</p>' +
      '<div class="qty-row">' +
        '<label for="qtd">Quantidade</label>' +
        '<input id="qtd" type="number" min="1" max="20" value="1">' +
        '<button class="btn" id="btn-add">Adicionar ao carrinho</button>' +
      '</div>' +
      '<div class="feedback" id="feedback" role="status"></div>' +
      '<a href="carrinho.html">Ir para o carrinho</a>' +
    '</div>';
  document.getElementById("btn-add").addEventListener("click", function () {
    var q = parseInt(document.getElementById("qtd").value, 10);
    if (!q || q < 1) q = 1;
    adicionarAoCarrinho(livro.id, q);
    document.getElementById("feedback").textContent = q + (q > 1 ? " unidades adicionadas" : " unidade adicionada") + " ao carrinho.";
  });
}

// Página do carrinho
function iniciarCarrinho() {
  var lista = document.getElementById("lista-carrinho");
  if (!lista) return;
  var c = lerCarrinho();
  var resumo = document.getElementById("resumo");
  if (c.length === 0) {
    lista.innerHTML = '<p class="empty">Seu carrinho está vazio. <a href="index.html#catalogo">Ver o catálogo</a></p>';
    resumo.style.display = "none";
    return;
  }
  resumo.style.display = "block";
  var html = "", subtotal = 0;
  for (var i = 0; i < c.length; i++) {
    var l = buscarLivro(c[i].id);
    if (!l) continue;
    var totalItem = l.preco * c[i].qtd;
    subtotal += totalItem;
    html +=
      '<div class="cart-item">' +
        '<img src="' + l.img + '" alt="Capa de ' + l.titulo + '">' +
        '<div>' +
          '<h3>' + l.titulo + '</h3>' +
          '<p class="author">' + l.autor + ' · ' + formatarPreco(l.preco) + '</p>' +
          '<label>Qtd. <input type="number" min="1" max="20" value="' + c[i].qtd + '" data-qtd="' + l.id + '"></label>' +
          '<button class="link-btn" data-remover="' + l.id + '">Remover</button>' +
        '</div>' +
        '<strong class="item-total">' + formatarPreco(totalItem) + '</strong>' +
      '</div>';
  }
  lista.innerHTML = html;
  var frete = subtotal >= 150 ? 0 : 14.90;
  document.getElementById("subtotal").textContent = formatarPreco(subtotal);
  document.getElementById("frete").textContent = frete === 0 ? "Grátis" : formatarPreco(frete);
  document.getElementById("total").textContent = formatarPreco(subtotal + frete);

  lista.querySelectorAll("[data-qtd]").forEach(function (inp) {
    inp.addEventListener("change", function () {
      var novo = parseInt(inp.value, 10);
      var cc = lerCarrinho();
      for (var k = 0; k < cc.length; k++) {
        if (cc[k].id === Number(inp.getAttribute("data-qtd"))) cc[k].qtd = novo > 0 ? novo : 1;
      }
      salvarCarrinho(cc);
      iniciarCarrinho();
    });
  });
  lista.querySelectorAll("[data-remover]").forEach(function (b) {
    b.addEventListener("click", function () {
      var id = Number(b.getAttribute("data-remover"));
      salvarCarrinho(lerCarrinho().filter(function (x) { return x.id !== id; }));
      iniciarCarrinho();
    });
  });
}

function finalizarCompra() {
  salvarCarrinho([]);
  document.getElementById("lista-carrinho").innerHTML = '<p class="empty">Pedido simulado com sucesso. Este é um site de estudo, nenhuma compra foi realizada.</p>';
  document.getElementById("resumo").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  atualizarContador();
  iniciarHome();
  iniciarProduto();
  iniciarCarrinho();
  var fin = document.getElementById("btn-finalizar");
  if (fin) fin.addEventListener("click", finalizarCompra);
});
