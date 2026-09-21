const { Router } = require('express');
const alunoController = require('../controllers/AlunoController');

const router = Router();

router.get('/alunos', (req, res) => alunoController.findMany(req, res));
router.get('/alunos/:id', (req, res) => alunoController.findUnique(req, res));
router.put('/alunos/:id', (req, res) => alunoController.update(req, res));
router.delete('/alunos/:id', (req, res) => alunoController.delete(req, res));

module.exports = router;