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



class DataBase {
  db = ""
  items = [];

  constructor(name) {
    this.db = name;
    this.initialize();
  }

  initialize() {
    try {
      const data = fs.readFileSync(this.db, "utf8");
      this.items = JSON.parse(data);
    } catch {
      this.items = [];
    }
  }

  read() {
    return this.items;
  }

  create(item) {
    const newItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
    };
    this.items.push(newItem);
    fs.writeFileSync(this.db, JSON.stringify(this.items, null, 2));
    return newItem;
  }

  update(id, item) {
    const index = this.items.findIndex((i) => i.id === id);
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...item };
      fs.writeFileSync(this.db, JSON.stringify(this.items, null, 2));
      return this.items[index];
    }
    return null;
  }

  delete(id) {
    const index = this.items.findIndex((i) => i.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      fs.writeFileSync(this.db, JSON.stringify(this.items, null, 2));
      return true;
    }
    return false;
  }
}


// CRUD - ESTOQUE
const estoque = new DataBase("estoque.json");

// POST - CREATE
app.post("/estoque", (req, res) => {
  const newItem = estoque.create(req.body);
  res.status(201).send(newItem);
});
// GET - READ
app.get("/estoque", (req, res) => {
  const items = estoque.read();
  res.send(items);
});
// PUT - UPDATE
app.put("/estoque/:id", (req, res) => {
  const { id } = req.params;
  const updatedItem = estoque.update(id, req.body);
  if (updatedItem) {
    res.send(updatedItem);
  } else {
    res.status(404).send({ message: "Item não encontrado." });
  }
});
// DELETE - DELETE
app.delete("/estoque/:id", (req, res) => {
  const { id } = req.params;
  const deleted = estoque.delete(id);
  if (deleted) {
    res.send({ message: "Item deletado com sucesso." });
  } else {
    res.status(404).send({ message: "Item não encontrado." });
  }
});

// FIM CRUD ESTOQUE

// CRUD - VENDAS
const vendas = new DataBase("vendas.json");

// POST - CREATE
app.post("/vendas", (req, res) => {
  const newItem = vendas.create(req.body);
  res.status(201).send(newItem);
});
// GET - READ
app.get("/vendas", (req, res) => {
  const items = vendas.read();
  res.send(items);
});
// PUT - UPDATE
app.put("/vendas/:id", (req, res) => {
  const { id } = req.params;
  const updatedItem = vendas.update(id, req.body);
  if (updatedItem) {
    res.send(updatedItem);
  } else {
    res.status(404).send({ message: "Item não encontrado." });
  }
});
// DELETE - DELETE
app.delete("/vendas/:id", (req, res) => {
  const { id } = req.params;
  const deleted = vendas.delete(id);
  if (deleted) {
    res.send({ message: "Item deletado com sucesso." });
  } else {
    res.status(404).send({ message: "Item não encontrado." });
  }
});
// FIM CRUD VENDAS

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});
