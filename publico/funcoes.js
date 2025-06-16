function carregarfilial() {
  const selectCad = $("#caixa_filial_cad");
  selectCad.empty();
  selectCad.append('<option value="">Selecione</option>');

  $.ajax({
    url: "http://localhost:3000/api/filiais",
    type: "GET",
    dataType: "json",
    contentType: "application/json",
    success: function (dados) {
      dados.forEach(function (item) {
        selectCad.append(
          `<option value='${item.codigo_filial}'>${item.nome_filial}</option>`
        );
      });
      carregarFiliaisAlt();
    },
    error: function () {
      alert("Falha ao acessar GET /api/filiais");
    },
  });
}

function carregarFiliaisAlt() {
  const selectAlt = $("#caixa_filial_alt");
  selectAlt.empty();
  selectAlt.append('<option value="">Selecione</option>');

  $.ajax({
    url: "http://localhost:3000/api/filiais",
    type: "GET",
    dataType: "json",
    success: function (dados) {
      dados.forEach(function (item) {
        selectAlt.append(
          `<option value='${item.codigo_filial}'>${item.nome_filial}</option>`
        );
      });
    },
    error: function () {
      alert("Falha ao carregar o gerenciamento de filiais.");
    },
  });
}

$(document).ready(function () {
  carregarfilial();

  $("#tela_escura section").hide();
  $("#tela_escura").hide();
  $("#cards_container").hide();

  $(".btn_menu").click(function () {
    const target = $(this).data("target");

    // Menu: Botão de gerenciar funcionários
    if (target === "gerenc_func") {
      $("#pagina_inicial").hide();
      $("#tela_escura").hide();
      $("#tela_escura section").hide();
      $("#cards_container").show();

      $("#coluna_adm").children(".func_card").remove();
      $("#coluna_financ").children(".func_card").remove();
      $("#coluna_sup").children(".func_card").remove();

      $.ajax({
        url: "http://localhost:3000/api/funcionarios",
        type: "GET",
        dataType: "json",
        success: function (funcionarios) {
          if (!Array.isArray(funcionarios) || funcionarios.length === 0) {
            $("#coluna_adm").append("<p>Nenhum funcionário encontrado.</p>");
            return;
          }

          funcionarios.forEach((func) => {
            const card = `
              <div class="func_card" data-id="${func.matricula}">
                <p><span class="NumMatricula"><strong>Nº de Matrícula:</strong> ${func.matricula}</span></p>
                <p><strong>Nome:</strong> ${func.nome_funcionario}</p>
                <p><strong>Filial:</strong> ${func.nome_filial}</p>
                <p><strong>Salário:</strong> R$ ${Number(func.salario).toFixed(2)}</p>
                <p><strong>Setor:</strong> ${func.setor}</p>
                <p><strong>Status:</strong> ${func.status}</p>
              </div>
            `;

            const setor = func.setor.toLowerCase();
            if (setor.includes("adm")) {
              $("#coluna_adm").append(card);
            } else if (setor.includes("fin")) {
              $("#coluna_financ").append(card);
            } else if (setor.includes("sup")) {
              $("#coluna_sup").append(card);
            } else {
              // Se n identificar o setor, joga no adm como fallback
              $("#coluna_adm").append(card);
            }
          });

          $(".func_card")
            .off("click")
            .on("click", function () {
              const id = $(this).data("id");
              abrirFormularioEdicao(id);
            });
        },
        error: function () {
          $("#coluna_adm").append("<p>Erro ao carregar funcionários.</p>");
        },
      });

    // Se não for a Section gerenc_func, puxa a section que você clicou
    } else {
      $("#cards_container").hide();
      $("#pagina_inicial").hide();
      $("#tela_escura").css("display", "flex");
      $("#tela_escura section").hide();
      $("#" + target).css("display", "flex");
    }
  });

  $("#btn_fechar_alt").click(function () {
    $("#alt_func").hide();
    $("#tela_escura").hide();
    $("#cards_container").show();
    $("#pagina_inicial").hide();
  });

  $(".btn_fechar")
    .not("#btn_fechar_alt")
    .click(function () {
      $("#tela_escura").hide();
      $("#tela_escura section").hide();
      $("#cards_container").hide();
      $("#pagina_inicial").show();
    });

  function abrirFormularioEdicao(id) {
    $.ajax({
      url: `http://localhost:3000/api/funcionarios/${id}`,
      type: "GET",
      dataType: "json",
      success: function (func) {
        $("#caixa_id_alt").val(func.matricula);
        $("#caixa_nome_alt").val(func.nome_funcionario);
        $("#caixa_filial_alt").val(func.codigo_filial);
        $("#caixa_salario_alt").val(func.salario);
        $("#caixa_setor_alt").val(func.setor);
        $("#caixa_status_alt").val(func.status);

        $("#tela_escura").css("display", "flex");
        $("#tela_escura section").hide();
        $("#alt_func").show();
        $("#pagina_inicial").hide();
      },
      error: function () {
        alert("Erro ao carregar dados do funcionário.");
      },
    });
  }

  // Botão Salvar Alterações
  $("#btn_salv_alt").click(function () {
    const matricula = $("#caixa_id_alt").val();
    const nome_funcionario = $("#caixa_nome_alt").val();
    const codigo_filial = $("#caixa_filial_alt").val();
    const salario = $("#caixa_salario_alt").val();
    const setor = $("#caixa_setor_alt").val();
    const status = $("#caixa_status_alt").val();

    if (!nome_funcionario || !codigo_filial || !salario || !setor || !status) {
      alert("Preencha todos os campos!");
      return;
    }

    $.ajax({
      url: `http://localhost:3000/api/funcionarios/${matricula}`,
      type: "PUT",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({
        nome_funcionario,
        codigo_filial,
        salario,
        setor,
        status,
      }),
      success: function () {
        alert("Alterações salvas com sucesso!");
        location.reload();
      },
      error: function () {
        alert("Erro ao salvar alterações.");
      },
    });
  });

  // Botão Excluir Funcionário
  $("#btn_excluir_alt").click(function () {
    const matricula = $("#caixa_id_alt").val();

    if (!confirm("Tem certeza que deseja excluir este funcionário?")) return;

    $.ajax({
      url: `http://localhost:3000/api/funcionarios/${matricula}`,
      type: "DELETE",
      success: function () {
        alert("Funcionário excluído com sucesso!");
        location.reload();
      },
      error: function () {
        alert("Erro ao excluir funcionário.");
      },
    });
  });

  // Menu: Botão de cadastrar funcionário
  $("#btn_cadastrar_cad").click(function () {
    var nome_funcionario = $("#caixa_nome_cad").val();
    var codigo_filial = $("#caixa_filial_cad").val();
    var salario = $("#caixa_salario_cad").val();
    var setor = $("#caixa_setor_cad").val();
    var status = $("#caixa_status_cad").val();

    if (!nome_funcionario || !codigo_filial || !salario || !setor || !status) {
      alert("Preencha todos os campos!");
      return;
    }

    $.ajax({
      url: "http://localhost:3000/api/funcionarios",
      type: "POST",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({
        nome_funcionario,
        codigo_filial,
        salario,
        setor,
        status,
      }),
      success: function (resposta) {
        alert(resposta.msg);
        window.location.href = "/";
      },
      error: function () {
        alert("Falha ao acessar POST /api/funcionarios");
      },
    });
  });

  // Menu: Botão de cadastrar filial
  $("#cadastrar_filial").click(function () {
    var nome_filial = $("#nome_filial").val();
    var endereco = $("#cad_endereco").val();

    if (!nome_filial || !endereco) {
      alert("Preencha todos os campos!");
      return;
    }

    $.ajax({
      url: "http://localhost:3000/api/filiais",
      type: "POST",
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({ nome_filial, endereco }),
      success: function (resposta) {
        alert(
          resposta.msg +
            (resposta.codigo_filial
              ? " Código filial: " + resposta.codigo_filial
              : "")
        );
        window.location.href = "/";
      },
      error: function () {
        alert("Falha ao acessar POST /api/filiais");
      },
    });
  });

  // Menu: Botão de logout
  $("#btn_sair").click(function () {
    window.location.href = "logout.html";
  });
});
