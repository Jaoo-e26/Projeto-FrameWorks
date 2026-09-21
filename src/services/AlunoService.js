const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const AlunoNaoEncontradoError = require('../errors/AlunoNaoEncontradoError');
const AlunoInvalidoError = require('../errors/AlunoInvalidoError');
const EmailJaCadastradoError = require('../errors/EmailJaCadastradoError');

class AlunoService {
  // Requisito 1: Paginação, Ordenação e Contagem Total
  async findMany(page, pageSize, orderBy = 'id', order = 'asc') {
    // Sanitize da direção de ordenação (caso enviem um valor inválido)
    const direcaoValida = ['asc', 'desc'].includes(order.toLowerCase()) 
      ? order.toLowerCase() 
      : 'asc';

    // Garante que o campo de ordenação é válido (caso contrário, usa 'id')
    const camposValidos = ['id', 'nome', 'email', 'createdAt'];
    const campoValido = camposValidos.includes(orderBy) ? orderBy : 'id';

    // Consulta do total e da listagem paginada (podem ser executadas em paralelo)
    const [total, alunos] = await Promise.all([
      prisma.aluno.count(),
      prisma.aluno.findMany({
        skip: (Number(page) - 1) * Number(pageSize),
        take: Number(pageSize),
        orderBy: {
          [campoValido]: direcaoValida,
        },
      })
    ]);

    return { alunos, total };
  }

  // Requisito 2: Busca por ID
  async findUnique(id) {
    const idNumero = Number(id);
    if (isNaN(idNumero)) {
      throw new AlunoInvalidoError('ID inválido');
    }

    const aluno = await prisma.aluno.findUnique({
      where: { id: idNumero },
    });

    if (!aluno) {
      throw new AlunoNaoEncontradoError();
    }

    return aluno;
  }

  // Requisito 3: Atualização de Aluno
  async update(id, data) {
    const idNumero = Number(id);
    if (isNaN(idNumero)) {
      throw new AlunoInvalidoError('ID inválido');
    }

    const { nome, email } = data;

    // Validação: verifica se foi enviado pelo menos um campo para atualizar
    if (!nome && !email) {
      throw new AlunoInvalidoError('Informe pelo menos um campo (nome ou email) para atualização');
    }

    // Verifica se o aluno existe antes de atualizar
    const alunoExistente = await prisma.aluno.findUnique({
      where: { id: idNumero },
    });

    if (!alunoExistente) {
      throw new AlunoNaoEncontradoError();
    }

    // Se o e-mail foi alterado, verifica se já pertence a outro aluno
    if (email && email !== alunoExistente.email) {
      const emailEmUso = await prisma.aluno.findUnique({
        where: { email },
      });

      if (emailEmUso) {
        throw new EmailJaCadastradoError();
      }
    }

    const alunoAtualizado = await prisma.aluno.update({
      where: { id: idNumero },
      data: {
        ...(nome && { nome }),
        ...(email && { email }),
      },
    });

    return alunoAtualizado;
  }

  // Requisito 4: Remoção de Aluno
  async delete(id) {
    const idNumero = Number(id);
    if (isNaN(idNumero)) {
      throw new AlunoInvalidoError('ID inválido');
    }

    // Verifica se o aluno existe antes de tentar eliminar
    const alunoExistente = await prisma.aluno.findUnique({
      where: { id: idNumero },
    });

    if (!alunoExistente) {
      throw new AlunoNaoEncontradoError();
    }

    await prisma.aluno.delete({
      where: { id: idNumero },
    });
  }
}

module.exports = new AlunoService();