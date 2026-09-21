const alunos = require("../models/alunoModel");

class AlunoService {
  findMany() {
    return alunos;
  }

  create(aluno) {
    const { nome, email, nota1, nota2 } = aluno;
    if (!nome || !email || !nota1 || !nota2) {
      return null;
    }

    const novoAluno = {
      id: alunos.length > 0 ? alunos[alunos.length - 1].id + 1 : 1,
      nome,
      email,
      nota1,
      nota2
    };

    alunos.push(novoAluno);
    return novoAluno;
  }

  delete(id) {
    const indexAluno = alunos.findIndex((a) => a.id === parseInt(id));
    if (indexAluno === -1) {
      return null;
    }

    const [aluno] = alunos.splice(indexAluno, 1);
    return aluno;
  }
}

module.exports = new AlunoService();