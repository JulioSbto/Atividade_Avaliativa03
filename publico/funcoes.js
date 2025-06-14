function carregarfilial(){
  $("#caixa_filial_cad").append('<option>Selecione</option>')
  $.ajax({
    url: 'http://localhost:3000/filiais',
    type: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    success: function(dados) {
      dados.forEach(function (item) {
        $("#caixa_filial_cad").append(`
        <option value='${item.codigo_filial}'>${item.nome_filial}</option>
        `)
      })
    },
    error: function(){ alert('Falha ao acessar GET /filiais')}
  })

}

$(document).ready(function () {
carregarfilial();
// Oculta td
  $("#tela_escura section").hide();
  $("#tela_escura").hide();

// Esconde pag inicial qnd clicar em algo do menu
  $(".btn_menu").click(function () {
    const target = $(this).data("target");
    $("#pagina_inicial").hide();

// Puxa o target e mostra o card 
    $("#tela_escura").css("display", "flex");
    $("#" + target).css("display", "flex");
  });

//Oculta o card e puxa a pag inicial dnv
  $(".btn_fechar").click(function () {
    $("#tela_escura").hide();
    $("#tela_escura section").hide();
    $("#pagina_inicial").show();
  });

// Redirecionamento p logout
  $("#btn_sair").click(function () {
    window.location.href = "logout.html";
  });


// Botao cadastrar funcionario
$("#btn_cadastrar_cad").click(function () {
  var nome_funcionario = $("#caixa_nome_cad").val();
  var filial = $("#caixa_filial_cad").val();
  var salario = $("#caixa_salario_cad").val();
  var setor = $("#caixa_setor_cad"). val();
  var status = $("#caixa_status_cad").val();
  if(nome_funcionario == "" || filial == "" || salario == "" || setor == "" || status == "") {
    alert("Preencha todos os campos!")
    return
  }
  $("#tela_escura").show();
  $("#cad_funcionario").show();
  $.ajax({
    url: 'http://localhost:3000/funcionarios',
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({ nome_funcionario, filial, salario, setor, status }),
    success: function (resposta) {
      alert(resposta.msg)
      window.location.href = '/'
    },
      error: function () {
        alert("Falha ao acessar POST /funcionario")
      }
  })
});

// Botão cadastrar filial
$("#cadastrar_filial").click(function () {
  var nome_filial = $("#nome_filial").val();
  var endereco = $("#cad_endereco").val();
  if(nome_filial == "" || endereco == "") {
    alert("Preencha todos os campos!")
    return
  }
  $("#tela_escura").show();
  $("#cad_filial").show();
  $.ajax({
    url: 'http://localhost:3000/filiais',
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({ nome_filial, endereco,}),
    success: function (resposta) {
      alert(resposta.msg)
      window.location.href = '/'
    },
      error: function () {
        alert("Falha ao acessar POST /filial")
      }

  })
});





});
