const db = require('./conexao');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Diz ao Express para servir arquivos da pasta 'publico'
app.use(express.static(path.join(__dirname, 'publico')));

app.use(session({
  secret: '46feb3e2fec47e6d6cd7bc44bfe1aef9',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 15 * 60 * 1000 }
}));

// Pagina Principal certo
app.get('/', (req, res)=>{
  res.sendFile(path.join(__dirname, 'privado', 'index.html'))
})

app.post('/fazer_login', (req, res)=>{
  const [username, password] = req.body;
  db.query('SELECT * FROM usuarios WHERE username=? AND password=?',
  [username, password], (erro, resultado)=>{
    if(erro){return res.send("falha no login!"+erro.message)}
    if(resultado,length >= 1){
      req.session.usuarioLogado = "Sim"
      res.redirect('/')
      }else{
        res.send('Usuario e/ou senha incorretas')
    }
  })
})
// Pagina gerenciar filais certo
app.get('/filiais', (req, res)=>{
  res.sendFile(path.join(__dirname))
})

// Pagina gerenciar funcionarios certo
app.get('/funcionarios', (req, res)=>{
  res.sendFile(path.join(__dirname))
})

// endpoint para consultar as filiais certo
app.get('/filiais', (req, res)=> {
  db.query('SELECT * FROM filiais', (erro, resultado)=>{
     if(erro){return res.json({msg:'falha ao consultar as filiais'+erro.message})}
    return res.json(resultado)
    })
});

// endpoint para consultar os funcionarios certo
app.get('/funcionarios', (req, res)=> {
  db.query('SELECT * FROM funcionarios', (erro, resultado)=>{
     if(erro){return res.json({msg:'falha ao consultar os funcionarios'+erro.message})}
    return res.json(resultado)
    })
});

// Endpoint para cadastar os funcionarios certo
app.post('/funcionarios', (req, res)=>{
    const {matricula, nome_funcionario, filial, salario, setor, status} = req.body;
    db.query(`INSERT INTO funcionarios (matricula, nome,
      codigo_filial, salario, setor, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [matricula, nome_funcionario, filial, salario, setor, status],
      (erro, resultado)=>{
        if(erro){return res.json({msg: "Falha ao cadastrar"+erro.message})}
        return res.json({msg:"Cadastrado com sucesso!"})
      })
})
// endpoint para cadastar as filiais certo 
app.post('/filiais', (req, res)=>{
  const {codigo_filial, nome_filial, endereco} = req.body;
  db.query(`INSERT INTO filiais (codigo_filial, nome_filial, endereco) VALUES (?, ?, ?)`,
    [codigo_filial, nome_filial, endereco],
    (erro, resultado)=>{
      if(erro){return res.json({msg: "Falha ao cadastrar"+erro.message})}
      return res.json({msg:"Cadastrado com sucesso!"})
    })
})

// Endpoint para consultar todos os funcionarios com status ativos
app.get('/funcionarios_ativos', (req, res)=>{
  db.query(`SELECT * FROM vw_funcionarios_filiais WHERE status= 'Ativos'`,
          (erro, resultado)=>{
            if(erro){return res.json({msg:"Falha ao consultar!"+erro.message})}
            if(resultado.length == 0){return res.json({msg:"Funcionario nota 10"})}
            return res.json(resultado)
          })
})

// Endpoint para consultar todos os funcionarios com status inativos
app.get('/funcionarios_inativos', (req, res)=>{
  db.query(`SELECT * FROM vw_funcionarios_filiais WHERE status= 'Inativos'`,
          (erro, resultado)=>{
            if(erro){return res.json({msg:"Falha ao consultar!"+erro.message})}
            if(resultado.length == 0){return res.json({msg:"Nenhum projeto"})}
            return res.json(resultado)
          })
})

app.listen(3000, ()=>{
    console.log('Servidor rodando em http://localhost:3000');
});