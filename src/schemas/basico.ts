import { z } from 'zod';

export const ESTADOS_REGEX =
  /^(AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO)$/;

export const CREATE_SERVIDOR_SCHEMA = z.object({
  id: z.string(),
  nome: z.string().max(255).nullable(),
  matricula: z.string().max(255).nullable(),
  cpf: z.string().max(255).nullable(),
  rg: z.string().max(255).optional(),
  emissorRg: z.string().max(255).optional(),
  dtEmissaoRg: z.string().max(255).optional(),
  ufRg: z.string().max(255).optional(),
  dtNascimento: z
    .date()
    .min(new Date(1900, 0, 1))
    .max(new Date())
    .describe('ISO format')
    .or(z.string().min(2)),
  banco: z.string().max(255).optional(),
  agencia: z.string().max(255).optional(),
  conta: z.string().max(255).optional(),
  // regimeId: z.string().max(255).optional(),
  // orgaoId: z.string().max(255).optional(),
  cargoEstavel: z.boolean().optional(),
  carteiraTrabalho: z.string().max(255).optional(),
  pis: z.string().max(255).optional(),
  estadoCivil: z.string().max(255).optional(),
  sexo: z.string().max(255).optional(),
  nomePai: z.string().max(255).optional(),
  nomeMae: z.string().max(255).optional(),
  nacionalidade: z.string().max(255).optional(),
  escolaridade: z.string().max(255).optional(),
  email: z.string().max(255).optional(),
  celular: z.string().max(255).optional(),
  telefone: z.string().max(255).optional(),
  endereco: z.string().max(255).optional(),
  numero: z.string().max(255).optional(),
  complemento: z.string().max(255).optional(),
  bairro: z.string().max(255).optional(),
  cidade: z.string().max(255).optional(),
  uf: z.string().max(255).optional(),
  cep: z.string().max(255).optional(),
  //   secretaria: z.string().max(255).nullable(),
  secretariaId: z.string().max(255).optional(),
  //   departamento: z.string().max(255).nullable(),
  departamentoId: z.string().max(255).optional(),
  dtAdmissao: z.string().max(255).optional(),
  dtDemissao: z.string().max(255).optional(),
  dtAposent: z.string().max(255).optional(),
  anoMesIncluso: z.string().max(255).optional(),
  pazoFinalVinculo: z.string().max(255).optional(),
  anoMesAtualizacao: z.string().max(255).optional(),
  dtAtualizacao: z.string().max(255).optional(),
  dtUltimaAtualizacao: z.string().max(255).optional(),
  categoria: z.string().max(255).optional(),
  cadastroValidado: z.boolean().optional(),
  cadastroAtivo: z.boolean().optional(),
  dtCadastroValidado: z.string().max(255).optional(),
  senhaServidor: z.string().max(255).optional(),
  dtHoraExpiracaoSenha: z.string().max(255).optional(),
  competenciaFerias: z.string().max(255).optional(),
  dtUltimaAtualizacaoFerias: z.string().max(255).optional(),
  orgaoMatricula: z.string().max(255).optional(),
  orgaoNome: z.string().max(255).optional(),
  isentoRestricaoPortabilidade: z.boolean().optional(),
  imagem: z.string().max(255).optional(),
});

export const CREATE_NOTE_SCHEMA = z.object({
  id: z.string(),
  text: z.string(),
  // empresaId: z.string().optional(),
});

export const CREATE_PERFIL_ACESSO_SCHEMA = z.object({
  id: z.string(),
  descricao: z.string(),
  userId: z.string().optional(),
});

export const CREATE_OCORRENCIA_SCHEMA = z.object({
  id: z.string(),
  pesid: z.string().optional(),
  callsId: z.string().optional(),
  orderId: z.string().optional(),
  userId: z.string().optional(),
  data_inversa: z.preprocess((arg) => {
    // Verifica se o valor é uma instância de Date, e se for, converte para string ISO
    if (arg instanceof Date) {
      return arg.toISOString();
    }
    return arg; // Deixa o valor como está se não for Date
  }, z.string().optional()), // Valida como string após o preprocessamento
  dia_semana: z.string().optional(),
  horario: z.string().optional(),
  uf: z.string().optional(),
  br: z.string().optional(),
  municipio: z.string().optional(),
  causa_principal: z.string().optional(),
  causa_acidente: z.string().optional(),
  ordem_tipo_acidente: z.string().optional(),
  tipo_acidente: z.string().optional(),
  classificacao_acidente: z.string().optional(),
  fase_dia: z.string().optional(),
  sentido_via: z.string().optional(),
  condicao_metereologica: z.string().optional(),
  tipo_pista: z.string().optional(),
  tracado_via: z.string().optional(),
  uso_solo: z.string().optional(),
  id_veiculo: z.string().optional(),
  tipo_veiculo: z.string().optional(),
  marca: z.string().optional(),
  ano_fabricacao_veiculo: z.number(),
  tipo_envolvido: z.string().optional(),
  estado_fisico: z.string().optional(),
  idade: z.string().optional(),
  sexo: z.string().optional(),
  ilesos: z.string().optional(),
  feridos_leves: z.string().optional(),
  feridos_graves: z.string().optional(),
  mortos: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  regional: z.string().optional(),
  delegacia: z.string().optional(),
  uop: z.string().optional(),
});
