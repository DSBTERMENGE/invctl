-- ============================================
-- Script: Criação de Tabelas - Histórico de Índices
-- Data: 03/01/2026
-- Autor: David
-- Descrição: Cria tabelas de histórico de índices
--            econômicos (IPCA e SELIC)
-- ============================================

-- ============================================
-- TABELA: HISTORICO_IPCA
-- ============================================
CREATE TABLE historico_ipca (
    id SERIAL PRIMARY KEY,
    ano INTEGER NOT NULL,
    mes INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
    ipca NUMERIC(8, 4) NOT NULL,
    tipo CHAR(1) DEFAULT 'P' CHECK (tipo IN ('R', 'P')),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ultima_atualizacao TIMESTAMP,
    UNIQUE (ano, mes)
);

COMMENT ON TABLE historico_ipca IS 'Histórico e projeções mensais do IPCA';
COMMENT ON COLUMN historico_ipca.ipca IS 'Valor percentual mensal do IPCA';
COMMENT ON COLUMN historico_ipca.tipo IS 'R = Real (divulgado pelo IBGE), P = Projetado';

CREATE INDEX idx_historico_ipca_ano_mes ON historico_ipca(ano, mes);

-- ============================================
-- TABELA: HISTORICO_SELIC
-- ============================================
CREATE TABLE historico_selic (
    id SERIAL PRIMARY KEY,
    ano INTEGER NOT NULL,
    mes INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
    selic NUMERIC(8, 4) NOT NULL,
    tipo CHAR(1) DEFAULT 'P' CHECK (tipo IN ('R', 'P')),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ultima_atualizacao TIMESTAMP,
    UNIQUE (ano, mes)
);

COMMENT ON TABLE historico_selic IS 'Histórico e projeções mensais da Taxa SELIC';
COMMENT ON COLUMN historico_selic.selic IS 'Taxa percentual mensal da SELIC';
COMMENT ON COLUMN historico_selic.tipo IS 'R = Real (divulgado pelo Banco Central), P = Projetado';

CREATE INDEX idx_historico_selic_ano_mes ON historico_selic(ano, mes);

-- ============================================
-- Fim do Script 05
-- ============================================
