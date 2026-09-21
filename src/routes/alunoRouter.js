const { Router } = require('express');
const alunoController = require('../controllers/AlunoController');

const router = Router();

// Requisito 1: Listagem com paginação, ordenação (orderBy/order) e total de registros
router.get('/alunos', (req, res) => alunoController.findMany(req, res));

// Requisito 2: Buscar um único aluno pelo ID
router.get('/alunos/:id', (req, res) => alunoController.findUnique(req, res));

// Requisito 3: Atualizar um aluno por ID (suporta PUT e PATCH)
router.put('/alunos/:id', (req, res) => alunoController.update(req, res));
router.patch('/alunos/:id', (req, res) => alunoController.update(req, res));

// Requisito 4: Remover um aluno por ID
router.delete('/alunos/:id', (req, res) => alunoController.delete(req, res));

module.exports = router;