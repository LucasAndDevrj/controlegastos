let entrada = document.getElementById("entrada");
let saida = document.getElementById("saida");
let saldo = document.getElementById("saldo");

function renderizar() {
  let totalEntrada = 0;
  let totalSaida = 0;
  lista.innerHTML = "";
  soma = 0;

  gastos.forEach(gasto => {
    let li = document.createElement("li");

    let cor = gasto.valor >= 0 ? "green" : "red";
    if (gasto.valor >= 0) {
    totalEntrada += gasto.valor;
    } else {
    totalSaida += gasto.valor;
}

  li.innerHTML = `
   <span style="color: ${cor}">
    ${gasto.descricao} - R$ ${parseFloat(gasto.valor).toFixed(2)}
    </span>
    <button class="remover">❌</button>
    `;

    let botaoRemover = li.querySelector(".remover");

    botaoRemover.onclick = function () {
      gastos = gastos.filter(g => g.id !== gasto.id);

      salvarDados();
      renderizar();
    };

    lista.appendChild(li);

    soma += parseFloat(gasto.valor);
  });

  if (entrada && saida && saldo) {
  entrada.textContent = totalEntrada.toFixed(2);
  saida.textContent = Math.abs(totalSaida).toFixed(2);
  saldo.textContent = (totalEntrada + totalSaida).toFixed(2);
}

  atualizarGrafico();
}
// elementos da tela
let lista = document.getElementById("lista");
let total = document.getElementById("total");


// estado
let soma = 0;
let gastos = [];
let chart = null; // 🔥 IMPORTANTE (global)

// salvar dados
function salvarDados() {
  localStorage.setItem("gastos", JSON.stringify(gastos));
}

// carregar dados
let dadosSalvos = localStorage.getItem("gastos");

if (dadosSalvos) {
  gastos = JSON.parse(dadosSalvos);
}
renderizar();

// criar item na tela


// adicionar gasto

  function adicionarGasto() {
  let descricao = document.getElementById("descricao").value;
  let valor = document.getElementById("valor").value;

  if (descricao === "" || valor === "") return;

  let gasto = {
    id: Date.now(),
    descricao: descricao,
    valor: parseFloat(valor)
  };

  gastos.push(gasto);
  salvarDados();
  renderizar();

  document.getElementById("descricao").value = "";
  document.getElementById("valor").value = "";
}

document.getElementById("valor")
  .addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      adicionarGasto();
    }
  });

// gráfico pizza
function atualizarGrafico() {
  let canvas = document.getElementById("grafico");
  if (!canvas) return;

  let ctx = canvas.getContext("2d");

  let labels = gastos.map(g => g.descricao);
  let valores = gastos.map(g => Math.abs(parseFloat(g.valor)));

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: labels,
    datasets: [{
      data: valores,
      backgroundColor: [
        "#22c55e",
        "#3b82f6",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#14b8a6"
      ]
    }]
  },
  plugins: [ChartDataLabels],
  options: {
    plugins: {
      datalabels: {
        color: "#fff",
        formatter: (value, context) => {
          let total = context.chart.data.datasets[0].data
            .reduce((a, b) => a + b, 0);

          let porcentagem = (value / total) * 100;

          return porcentagem.toFixed(1) + "%";
        }
      }
    }
  }
    });
}