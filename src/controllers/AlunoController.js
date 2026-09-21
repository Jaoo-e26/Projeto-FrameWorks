const alunoService = require("../services/AlunoService");

class AlunoController {
  findMany(request, response) {
    const alunos = alunoService.findMany();
    return response.status(200).json({ alunos });
  }

  create(request, response) {
    const aluno = alunoService.create(request.body);
    if (!aluno) {
      return response.status(400).json({
        error: "Campos nome, email, nota1 e nota2 são obrigatórios"
      });
    }
    return response.status(201).json({ aluno });
  }

  delete(request, response) {
    const { id } = request.params;
    const aluno = alunoService.delete(id);
    if (!aluno) {
      return response.status(404).json({
        error: "Aluno não encontrado!"
      });
    }
    return response.status(204).end();
  }
}

module.exports = new AlunoController();