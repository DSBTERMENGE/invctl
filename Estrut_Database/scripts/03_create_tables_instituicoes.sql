-- ============================================
-- Script: Criação de Tabelas - Instituições
-- Data: 03/01/2026
-- Autor: David
-- Descrição: Cria tabelas de instituições financeiras
--            (bancos, corretoras, gestoras, etc)
-- ============================================

-- ============================================
-- TABELA: BANCO
-- ============================================
CREATE TABLE banco (
    id_banco SERIAL PRIMARY KEY,
    codigo_bacen VARCHAR(10) UNIQUE,
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    nome_completo VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    tipo_instituicao VARCHAR(50),
    status_operacional VARCHAR(30),
    data_inicio_operacao DATE,
    
    -- Indicadores de Solidez
    capital_social NUMERIC(18, 2),
    indice_basileia NUMERIC(5, 2),
    data_atualizacao_basileia DATE,
    rating_fitch VARCHAR(10),
    rating_moodys VARCHAR(10),
    rating_sp VARCHAR(10),
    rating_nacional VARCHAR(10),
    data_atualizacao_rating DATE,
    
    -- Informações de Risco
    possui_garantia_fgc CHAR(1) DEFAULT 'S' CHECK (possui_garantia_fgc IN ('S', 'N')),
    historico_intervencoes TEXT,
    observacoes TEXT,
    
    -- Auditoria
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ultima_atualizacao TIMESTAMP,
    usuario_cadastro VARCHAR(100),
    usuario_ultima_atualizacao VARCHAR(100)
);

COMMENT ON TABLE banco IS 'Instituições financeiras (bancos, cooperativas, etc)';
COMMENT ON COLUMN banco.tipo_instituicao IS 'Banco Comercial, Banco Múltiplo, Cooperativa de Crédito, Corretora, DTVM, Securitizadora';
COMMENT ON COLUMN banco.status_operacional IS 'ATIVO, LIQUIDACAO, INTERVENCAO, REGIME_ESPECIAL';

-- ============================================
-- TABELA: SECURITIZADORA
-- ============================================
CREATE TABLE securitizadora (
    id_securitizadora SERIAL PRIMARY KEY,
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    nome_completo VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    codigo_cvm VARCHAR(20) UNIQUE,
    status_operacional VARCHAR(30),
    
    -- Indicadores de Qualidade
    capital_social NUMERIC(18, 2),
    patrimonio_liquido NUMERIC(18, 2),
    rating_fitch VARCHAR(10),
    rating_moodys VARCHAR(10),
    rating_sp VARCHAR(10),
    rating_nacional VARCHAR(10),
    data_atualizacao_rating DATE,
    
    -- Histórico e Experiência
    data_inicio_operacao DATE,
    total_emissoes_realizadas INTEGER,
    volume_total_emitido NUMERIC(18, 2),
    total_emissoes_ativas INTEGER,
    historico_inadimplencia TEXT,
    historico_controversias TEXT,
    
    -- Especialização
    especialidade_setor VARCHAR(100),
    qualidade_originacao CHAR(1) CHECK (qualidade_originacao IN ('A', 'B', 'C')),
    
    -- Auditoria
    observacoes TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ultima_atualizacao TIMESTAMP,
    usuario_cadastro VARCHAR(100),
    usuario_ultima_atualizacao VARCHAR(100)
);

COMMENT ON TABLE securitizadora IS 'Securitizadoras emissoras de CRI e CRA';
COMMENT ON COLUMN securitizadora.status_operacional IS 'ATIVO, SUSPENSA, CANCELADA';
COMMENT ON COLUMN securitizadora.especialidade_setor IS 'Imobiliário, Agronegócio, Infraestrutura, Múltiplos';

-- ============================================
-- TABELA: CORRETORA
-- ============================================
CREATE TABLE corretora (
    id_corretora SERIAL PRIMARY KEY,
    id_banco INTEGER REFERENCES banco(id_banco),
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    nome_completo VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    codigo_cvm VARCHAR(20) UNIQUE,
    tipo VARCHAR(20),
    status_operacional VARCHAR(30),
    taxa_custodia_renda_variavel NUMERIC(8, 4),
    taxa_corretagem_padrao NUMERIC(8, 2),
    observacoes TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ultima_atualizacao TIMESTAMP
);

COMMENT ON TABLE corretora IS 'Corretoras e distribuidoras de valores';
COMMENT ON COLUMN corretora.tipo IS 'CORRETORA, DTVM';

-- ============================================
-- TABELA: GESTORA
-- ============================================
CREATE TABLE gestora (
    id_gestora SERIAL PRIMARY KEY,
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    nome_completo VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    codigo_cvm VARCHAR(20) UNIQUE,
    status_operacional VARCHAR(30),
    
    -- Indicadores de Porte e Experiência
    patrimonio_sob_gestao NUMERIC(18, 2),
    data_atualizacao_aum DATE,
    numero_fundos_geridos INTEGER,
    data_inicio_operacao DATE,
    anos_experiencia_mercado INTEGER,
    
    -- Performance e Qualidade
    filosofia_investimento VARCHAR(100),
    track_record TEXT,
    premios_reconhecimentos TEXT,
    rentabilidade_media_fundos NUMERIC(8, 4),
    
    -- Equipe
    numero_gestores INTEGER,
    gestor_principal VARCHAR(255),
    formacao_equipe TEXT,
    
    -- Governança
    possui_compliance CHAR(1) DEFAULT 'N' CHECK (possui_compliance IN ('S', 'N')),
    historico_processos_cvm TEXT,
    rating_governanca CHAR(1) CHECK (rating_governanca IN ('A', 'B', 'C')),
    
    -- Auditoria
    observacoes TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ultima_atualizacao TIMESTAMP
);

COMMENT ON TABLE gestora IS 'Gestoras de fundos de investimento';
COMMENT ON COLUMN gestora.filosofia_investimento IS 'Value, Growth, Quantitativa, Multi-estratégia';

-- ============================================
-- TABELA: ADMINISTRADORA
-- ============================================
CREATE TABLE administradora (
    id_administradora SERIAL PRIMARY KEY,
    id_banco INTEGER REFERENCES banco(id_banco),
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    nome_completo VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    codigo_cvm VARCHAR(20) UNIQUE,
    status_operacional VARCHAR(30),
    
    -- Indicadores de Porte
    patrimonio_administrado NUMERIC(18, 2),
    numero_fundos_administrados INTEGER,
    data_inicio_operacao DATE,
    
    -- Qualidade dos Serviços
    qualidade_relatorios CHAR(1) CHECK (qualidade_relatorios IN ('A', 'B', 'C')),
    qualidade_atendimento CHAR(1) CHECK (qualidade_atendimento IN ('A', 'B', 'C')),
    possui_certificacao_anbima CHAR(1) DEFAULT 'N' CHECK (possui_certificacao_anbima IN ('S', 'N')),
    historico_irregularidades TEXT,
    historico_processos_cvm TEXT,
    
    -- Controles
    possui_auditoria_independente CHAR(1) DEFAULT 'N' CHECK (possui_auditoria_independente IN ('S', 'N')),
    auditor VARCHAR(255),
    rating_controles_internos CHAR(1) CHECK (rating_controles_internos IN ('A', 'B', 'C')),
    
    -- Taxas
    taxa_administracao_padrao NUMERIC(8, 4),
    taxa_performance_padrao NUMERIC(8, 4),
    
    -- Auditoria
    observacoes TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ultima_atualizacao TIMESTAMP
);

COMMENT ON TABLE administradora IS 'Administradoras fiduciárias de fundos de investimento';

-- ============================================
-- Fim do Script 03
-- ============================================
