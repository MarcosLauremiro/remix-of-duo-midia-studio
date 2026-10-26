// Erros de infraestrutura. Mensagens nunca carregam valores de segredos.

/** Configuração obrigatória ausente ou inválida (ex.: SESSION_SECRET). Falha fechada. */
export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

/** Banco de dados inacessível (timeout, rede, autenticação do driver). */
export class DataUnavailableError extends Error {
  constructor() {
    super("DB_UNAVAILABLE");
    this.name = "DataUnavailableError";
  }
}
