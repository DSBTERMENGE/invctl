-- ============================================
-- Script: Criação de Tabelas - Entidades Base
-- Data: 03/01/2026
-- Autor: David
-- Descrição: Cria tabelas de domínio e entidades
--            base sem dependências externas
-- ============================================

-- Conectar ao database invctl_db antes de executar
-- \c invctl_db

-- ============================================
-- TABELA: ORGAO_REGULADOR
-- ============================================
CREATE TABLE orgao_regulador (
    id_orgao_regulador SERIAL PRIMARY KEY,
    sigla VARCHAR(20) NOT NULL UNIQUE,
    nome_completo VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    esfera VARCHAR(20) NOT NULL,
    website VARCHAR(255),
    descricao TEXT,
    data_criacao DATE,
    ativo CHAR(1) DEFAULT 'S' CHECK (ativo IN ('S', 'N')),
    observacoes TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE orgao_regulador IS 'Órgãos reguladores e autorreguladores do mercado financeiro';
COMMENT ON COLUMN orgao_regulador.tipo IS 'REGULADOR, AUTORREGULADOR, FISCALIZADOR, INFRAESTRUTURA';
COMMENT ON COLUMN orgao_regulador.esfera IS 'FEDERAL, PRIVADO';

-- ============================================
-- TABELA: INDEXADOR
-- ============================================
CREATE TABLE indexador (
    id_indexador SERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    descricao VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    ativo CHAR(1) DEFAULT 'S' CHECK (ativo IN ('S', 'N')),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE indexador IS 'Índices que remuneram investimentos';
COMMENT ON COLUMN indexador.tipo IS 'POS_FIXADO, INFLACAO, PRE_FIXADO, HIBRIDO';

-- ============================================
-- TABELA: TIPO_INVESTIMENTO
-- ============================================
CREATE TABLE tipo_investimento (
    id_tipo_investimento SERIAL PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    descricao VARCHAR(255) NOT NULL,
    classe VARCHAR(30) NOT NULL,
    garantia_fgc CHAR(1) DEFAULT 'N' CHECK (garantia_fgc IN ('S', 'N')),
    ativo CHAR(1) DEFAULT 'S' CHECK (ativo IN ('S', 'N')),
    obs TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE tipo_investimento IS 'Tipos de investimentos disponíveis no sistema';
COMMENT ON COLUMN tipo_investimento.classe IS 'RENDA_FIXA, RENDA_VARIAVEL, FUNDO';
COMMENT ON COLUMN tipo_investimento.garantia_fgc IS 'S=Com garantia FGC, N=Sem garantia FGC';

-- ============================================
-- TABELA: TIPO_FUNDO
-- ============================================
CREATE TABLE tipo_fundo (
    id_tipo_fundo SERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    descricao VARCHAR(255) NOT NULL,
    classe_principal VARCHAR(30) NOT NULL,
    subclasse VARCHAR(100),
    permite_alavancagem CHAR(1) DEFAULT 'N' CHECK (permite_alavancagem IN ('S', 'N')),
    tem_tributacao_especial CHAR(1) DEFAULT 'N' CHECK (tem_tributacao_especial IN ('S', 'N')),
    descricao_estrategia TEXT,
    publico_alvo_padrao VARCHAR(30),
    benchmark_comum VARCHAR(50),
    perfil_risco VARCHAR(20),
    ativo CHAR(1) DEFAULT 'S' CHECK (ativo IN ('S', 'N')),
    observacoes TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE tipo_fundo IS 'Tipos de fundos de investimento do mercado brasileiro (exceto FII, FI-Infra e FIAGRO)';
COMMENT ON COLUMN tipo_fundo.classe_principal IS 'RENDA_FIXA, MULTIMERCADO, ACOES, CAMBIAL, PREVIDENCIA, ETF';
COMMENT ON COLUMN tipo_fundo.publico_alvo_padrao IS 'VAREJO, QUALIFICADO, PROFISSIONAL';
COMMENT ON COLUMN tipo_fundo.perfil_risco IS 'CONSERVADOR, MODERADO, AGRESSIVO';

-- ============================================
-- TABELA: USUARIO
-- ============================================
CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(20),
    perfil_investidor VARCHAR(20),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo CHAR(1) DEFAULT 'S' CHECK (ativo IN ('S', 'N'))
);

COMMENT ON TABLE usuario IS 'Investidores que possuem carteiras de investimento';
COMMENT ON COLUMN usuario.perfil_investidor IS 'CONSERVADOR, MODERADO, AGRESSIVO';

-- ============================================
-- Fim do Script 02
-- ============================================
