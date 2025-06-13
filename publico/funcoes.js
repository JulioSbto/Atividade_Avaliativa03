$(document).ready(function () {

// Ocuta td
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

});
