const ApiError = require('./ApiError');

class EmailJaCadastradoError extends ApiError {
  constructor(message = 'O e-mail informado já está em uso por outro aluno') {
    super(message, 409);
  }
}

module.exports = EmailJaCadastradoError;