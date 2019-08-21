const express = require("express");

const server = express();
server.use(express.json());

const projects = [];
var contRequisicao = 0;

//Middlewares
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project)
    return res.status(400).send({ error: "Projeto com esse id não existe" });

  return next();
}

function logRequest(req, res, next) {
  contRequisicao++;
  console.log(`Número de requisições: ${contRequisicao}`);
  return next();
}

//Middleware Global
server.use(logRequest);

//Rotas

//Todos
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//Um só
server.get("/projects/:id", checkProjectExists, (req, res) => {
  const project = projects.find(p => p.id == req.params.id);
  return res.json(project);
});

//Inserir
server.post("/projects", (req, res) => {
  const project = projects.find(p => p.id == req.body.id);
  if (project) return res.status(400).send({ error: "Id já está em uso" });

  req.body.tasks = [];
  projects.push(req.body);
  return res.json(projects);
});

//Adicionar uma tarefa
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.tasks.push(title);

  return res.json(project);
});

//Atualizar
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  const project = projects.find(p => p.id == id);
  project.title = title;

  return res.json(project);
});

//Remover
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);
  return res.send();
});

server.listen(3001);
