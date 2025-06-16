const db = require("./conexao");
const express = require("express");
const session = require("express-session");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "publico")));

app.use(
  session({
    secret: "46feb3e2fec47e6d6cd7bc44bfe1aef9",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 15 * 60 * 1000 },
  })
);

function verificarLogin(req, res, next) {
  if (req.session.usuarioLogado) {
    next();
  } else {
    res.redirect("/login");
  }
}

// Página protegida
app.get("/", verificarLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "privado", "index.html"));
});

// Rota login
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "publico", "login.html"));
});

// Rota logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.sendFile(path.join(__dirname, "publico", "logout.html"));
  });
});

// Login (validação)
app.post("/fazer_login", (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM usuarios WHERE username=? AND password=?",
    [username, password],
    (erro, resultado) => {
      if (erro) return res.send("Falha no login! " + erro.message);
      if (resultado.length >= 1) {
        req.session.usuarioLogado = "Sim";
        res.redirect("/");
      } else {
        res.send("Usuário e/ou senha incorretos");
      }
    }
  );
});

// API filiais
app.get("/api/filiais", (req, res) => {
  db.query("SELECT * FROM filiais", (erro, resultado) => {
    if (erro)
      return res.json({
        msg: "Falha ao consultar as filiais: " + erro.message,
      });
    return res.json(resultado);
  });
});

// Endpoint p cadastrar filial
app.post("/api/filiais", (req, res) => {
  const { nome_filial, endereco } = req.body;

  if (!nome_filial || !endereco) {
    return res.status(400).json({ msg: "Preencha todos os campos!" });
  }

  // Conta as filiais pra gerar o codigo
  db.query("SELECT COUNT(*) AS total FROM filiais", (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ msg: "Erro ao consultar filiais: " + err.message });

    const novoCodigoFilial = results[0].total + 1;

    db.query(
      "INSERT INTO filiais (codigo_filial, nome_filial, endereco) VALUES (?, ?, ?)",
      [novoCodigoFilial, nome_filial, endereco],
      (erro, resultado) => {
        if (erro)
          return res
            .status(500)
            .json({ msg: "Falha ao cadastrar filial: " + erro.message });

        return res.json({
          msg: "Filial cadastrada com sucesso!",
        });
      }
    );
  });
});

// API funcionários
app.get("/api/funcionarios", (req, res) => {
  db.query("SELECT * FROM vw_funcionarios_filiais", (erro, resultado) => {
    if (erro)
      return res.json({
        msg: "Falha ao consultar os funcionários: " + erro.message,
      });
    return res.json(resultado);
  });
});

// Puxa os dados do funcionário
app.get("/api/funcionarios/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT * FROM funcionarios WHERE matricula = ?",
    [id],
    (erro, resultado) => {
      if (erro)
        return res
          .status(500)
          .json({ msg: "Erro ao consultar funcionário: " + erro.message });
      if (resultado.length === 0)
        return res.status(404).json({ msg: "Funcionário não encontrado" });
      return res.json(resultado[0]);
    }
  );
});

// Endpoint p cadastrar funcionário
app.post("/api/funcionarios", (req, res) => {
  const { nome_funcionario, codigo_filial, salario, setor, status } = req.body;
  db.query(
    `INSERT INTO funcionarios (nome_funcionario, codigo_filial, salario, setor, status)
    VALUES (?, ?, ?, ?, ?)`,
    [nome_funcionario, codigo_filial, salario, setor, status],
    (erro, resultado) => {
      if (erro) return res.json({ msg: "Falha ao cadastrar: " + erro.message });
      return res.json({ msg: "Funcionário cadastrado com sucesso!" });
    }
  );
});

// Endpoint p atualizar dados de funcionário
app.put("/api/funcionarios/:id", (req, res) => {
  const id = req.params.id;
  const { nome_funcionario, codigo_filial, salario, setor, status } = req.body;

  db.query(
    `UPDATE funcionarios SET nome_funcionario = ?, codigo_filial = ?, salario = ?, setor = ?, status = ? WHERE matricula = ?`,
    [nome_funcionario, codigo_filial, salario, setor, status, id],
    (erro, resultado) => {
      if (erro)
        return res
          .status(500)
          .json({ msg: "Falha ao atualizar funcionário: " + erro.message });
      return res.json({ msg: "Funcionário atualizado com sucesso!" });
    }
  );
});

// Endpoint p excluir funcionário
app.delete("/api/funcionarios/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "DELETE FROM funcionarios WHERE matricula = ?",
    [id],
    (erro, resultado) => {
      if (erro)
        return res
          .status(500)
          .json({ msg: "Erro ao excluir funcionário: " + erro.message });
      return res.json({ msg: "Funcionário excluído com sucesso!" });
    }
  );
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
