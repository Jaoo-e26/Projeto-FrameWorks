const alunoService = require('../services/AlunoServicervice');

class AlunoController {
  // Requisito 1: GET /alunos
  async findMany(request, response) {
    try {
      let { page, pageSize, orderBy, order, tipoordenacao } = request.query;

      page = page || 1;
      pageSize = pageSize || 10;
      
      // Aceita 'order' ou 'tipoordenacao' como parâmetro da query
      const direcao = order || tipoordenacao || 'asc';
      const campoOrdenacao = orderBy || 'id';

      const { alunos, total } = await alunoService.findMany(
        page, 
        pageSize, 
        campoOrdenacao, 
        direcao
      );

      return response.status(200).json({ alunos, total });
    } catch (error) {
      return response.status(error.statusCode || 500).json({
        message: error.message || 'Erro interno no servidor',
      });
    }
  }

  // Requisito 2: GET /alunos/:id
  async findUnique(request, response) {
    try {
      const { id } = request.params;
      const aluno = await alunoService.findUnique(id);

      return response.status(200).json(aluno);
    } catch (error) {
      return response.status(error.statusCode || 500).json({
        message: error.message || 'Erro interno no servidor',
      });
    }
  }

  // Requisito 3: PUT ou PATCH /alunos/:id
  async update(request, response) {
    try {
      const { id } = request.params;
      const { nome, email } = request.body;

      const alunoAtualizado = await alunoService.update(id, { nome, email });

      return response.status(200).json(alunoAtualizado);
    } catch (error) {
      return response.status(error.statusCode || 500).json({
        message: error.message || 'Erro interno no servidor',
      });
    }
  }

  // Requisito 4: DELETE /alunos/:id
  async delete(request, response) {
    try {
      const { id } = request.params;
      await alunoService.delete(id);

      // Resposta sem corpo (204 No Content) para remoção bem-sucedida
      return response.status(204).send();
    } catch (error) {
      return response.status(error.statusCode || 500).json({
        message: error.message || 'Erro interno no servidor',
      });
    }
  }
}

module.exports = new AlunoController();