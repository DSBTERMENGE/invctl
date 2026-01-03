-- ============================================
-- Script: Criação de Tabelas - Regulatórias
-- Data: 03/01/2026
-- Autor: David
-- Descrição: Cria tabelas de relacionamento com
--            órgãos reguladores (penalidades,
--            certificações e intervenções)
-- ============================================

-- ============================================
-- TABELA: PENALIDADE
-- ============================================
CREATE TABLE penalidade (
    id_penalidade SERIAL PRIMARY KEY,
    id_orgao_regulador INTEGER NOT NULL REFERENCES orgao_regulador(id_orgao_regulador),
    tipo_instituicao VARCHAR(30) NOT NULL,
    id_instituicao INTEGER NOT NULL,
    numero_processo VARCHAR(50),
    tipo_penalidade VARCHAR(30),
    data_autuacao DATE,
    data_julgamento DATE,
    descricao TEXT,
    valor_multa NUMERIC(18, 2),
    status VARCHAR(30),
    gravidade VARCHAR(20),
    link_documento VARCHAR(500),
    observacoes TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE penalidade IS 'Penalidades e processos administrativos aplicados por órgãos reguladores';
COMMENT ON COLUMN penalidade.tipo_instituicao IS 'BANCO, CORRETORA, SECURITIZADORA, GESTORA, ADMINISTRADORA';
COMMENT ON COLUMN penalidade.tipo_penalidade IS 'MULTA, ADVERTENCIA, SUSPENSAO, INABILITACAO, INTERVENCAO';
COMMENT ON COLUMN penalidade.status IS 'EM_ANDAMENTO, JULGADO, RECURSO, ARQUIVADO';
COMMENT ON COLUMN penalidade.gravidade IS 'LEVE, MEDIA, GRAVE, GRAVISSIMA';

-- ============================================
-- TABELA: CERTIFICACAO
-- ============================================
CREATE TABLE certificacao (
    id_certificacao SERIAL PRIMARY KEY,
    id_orgao_regulador INTEGER NOT NULL REFERENCES orgao_regulador(id_orgao_regulador),
    tipo_instituicao VARCHAR(30) NOT NULL,
    id_instituicao INTEGER NOT NULL,
    tipo_certificacao VARCHAR(100),
    numero_registro VARCHAR(50),
    descricao TEXT,
    data_concessao DATE,
    data_validade DATE,
    status VARCHAR(30),
    observacoes TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE certificacao IS 'Certificações e autorizações concedidas por órgãos reguladores';
COMMENT ON COLUMN certificacao.tipo_instituicao IS 'BANCO, CORRETORA, SECURITIZADORA, GESTORA, ADMINISTRADORA';
COMMENT ON COLUMN certificacao.tipo_certificacao IS 'REGISTRO_CVM, AUTORIZACAO_BACEN, CERTIFICACAO_ANBIMA, QUALIFICACAO_PROFISSIONAL';
COMMENT ON COLUMN certificacao.status IS 'ATIVO, SUSPENSO, CANCELADO, VENCIDO';

-- ============================================
-- TABELA: INTERVENCAO_REGULATORIA
-- ============================================
CREATE TABLE intervencao_regulatoria (
    id_intervencao SERIAL PRIMARY KEY,
    id_banco INTEGER NOT NULL REFERENCES banco(id_banco),
    id_orgao_regulador INTEGER NOT NULL REFERENCES orgao_regulador(id_orgao_regulador),
    tipo_intervencao VARCHAR(50),
    data_inicio DATE,
    data_fim DATE,
    motivo TEXT,
    interventor_responsavel VARCHAR(255),
    status VARCHAR(30),
    impacto_investidores TEXT,
    link_documento VARCHAR(500),
    observacoes TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE intervencao_regulatoria IS 'Intervenções e regimes especiais aplicados pelo Banco Central';
COMMENT ON COLUMN intervencao_regulatoria.tipo_intervencao IS 'INTERVENCAO, LIQUIDACAO_EXTRAJUDICIAL, RAET, REGIME_ESPECIAL, ADMINISTRACAO_TEMPORARIA';
COMMENT ON COLUMN intervencao_regulatoria.status IS 'EM_ANDAMENTO, CONCLUIDO, TRANSFERIDO';

-- ============================================
-- Fim do Script 04
-- ============================================
