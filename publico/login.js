$(document).ready(function () {
  $("#btn_login").click(function () {
    const username = $("#userBox").val().trim();
    const password = $("#passwordBox").val().trim();

    if (!username || !password) {
      alert("Preencha todos os campos!");
      return;
    }

    fetch("http://localhost:3000/fazer_login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => {
        if (res.redirected) {
          window.location.href = res.url;
        } else {
          return res.text();
        }
      })
      .then((msg) => {
        if (msg) alert(msg);
      })
      .catch(() => {
        alert("Erro ao tentar fazer login.");
      });
  });

  $("#userBox, #passwordBox").on("keypress", function (e) {
    if (e.which === 13) {
      $("#btn_login").click();
    }
  });
});
