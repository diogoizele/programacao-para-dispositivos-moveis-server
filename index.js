const fs = require("fs");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

// Rota de Cadastro
app.post("/cadastro", (req, res) => {
  const { email, senha } = req.body;
  const usuariosDB = "usuarios.json";
  let usuarios = [];

  try {
    const data = fs.readFileSync(usuariosDB, "utf8");
    usuarios = JSON.parse(data);
  } catch (error) {
    console.log("Arquivo não encontrado, criando um novo.");
  }

  // Cria o hash da senha
  const saltRounds = 10; // Fator de complexidade do hash
  const senhaComHash = bcrypt.hashSync(senha, saltRounds);

  // Adiciona o novo usuário
  usuarios.push({ email, senha: senhaComHash }); // Salva o hash, não a senha original

  // Salva de volta no arquivo
  fs.writeFileSync(usuariosDB, JSON.stringify(usuarios, null, 2));

  res.status(201).send({ message: "Usuário cadastrado com sucesso!" });
});

// Rota de Login
app.post("/login", (req, res) => {
  console.log(req.body);
  const { email, senha } = req.body;
  const usuariosDB = "usuarios.json";
  let usuarios = [];

  try {
    const data = fs.readFileSync(usuariosDB, "utf8");
    usuarios = JSON.parse(data);
  } catch (error) {
    return res.status(400).send({ message: "Email ou senha inválidos." });
  }

  // Localiza o usuário
  console.log("Usuario: ", email), console.log("Senha: ", senha);
  const usuarioEncontrado = usuarios.find(
    (user) => user.email === email && bcrypt.compareSync(senha, user.senha)
  );

  // Verifica se o usuário foi encontrado
  if (usuarioEncontrado) {
    res.send({ message: "Login realizado com sucesso!" });
  } else {
    res.status(400).send({ message: "Email ou senha inválidos." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
