-- ============================================
-- Script: Criação de Tabela - Fundos
-- Data: 03/01/2026
-- Autor: David
-- Descrição: Cria tabela de fundos de investimento
--            (exceto FII, FI-Infra e FIAGRO)
-- ============================================

-- ============================================
-- TABELA: FUNDO
-- ============================================
CREATE TABLE fundo (
    id_fundo SERIAL PRIMARY KEY,
    
    -- Identificação
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    codigo_cvm VARCHAR(20) UNIQUE,
    nome_completo VARCHAR(255) NOT NULL,
    nome_abreviado VARCHAR(100),
    
    -- Classificação
    tipo_fundo VARCHAR(50),
    classificacao_anbima VARCHAR(100),
    publico_alvo VARCHAR(30),
    condominio VARCHAR(20),
    
    -- Gestão
    id_gestora INTEGER REFERENCES gestora(id_gestora),
    id_administradora INTEGER REFERENCES administradora(id_administradora),
    id_custodiante INTEGER REFERENCES banco(id_banco),
    
    -- Rentabilidade e Benchmark
    benchmark VARCHAR(50),
    objetivo_investimento TEXT,
    estrategia TEXT,
    
    -- Taxas
    taxa_administracao NUMERIC(8, 4),
    taxa_performance NUMERIC(8, 4),
    taxa_entrada NUMERIC(8, 2),
    taxa_saida NUMERIC(8, 2),
    possui_come_cotas CHAR(1) DEFAULT 'S' CHECK (possui_come_cotas IN ('S', 'N')),
    
    -- Aplicação e Resgate
    aplicacao_minima_inicial NUMERIC(18, 2),
    aplicacao_minima_adicional NUMERIC(18, 2),
    saldo_minimo_permanencia NUMERIC(18, 2),
    prazo_liquidacao_resgate INTEGER,
    prazo_cotizacao_aplicacao INTEGER,
    prazo_cotizacao_resgate INTEGER,
    carencia_resgate_dias INTEGER,
    
    -- Indicadores
    patrimonio_liquido NUMERIC(18, 2),
    data_atualizacao_pl DATE,
    numero_cotistas INTEGER,
    cotacao_atual NUMERIC(18, 6),
    data_cotacao_atual DATE,
    
    -- Datas
    data_inicio DATE,
    data_encerramento DATE,
    status VARCHAR(30),
    
    -- Auditoria
    observacoes TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ultima_atualizacao TIMESTAMP
);

COMMENT ON TABLE fundo IS 'Fundos de investimento (RF, Multimercado, Ações, Cambial, ETF, Previdência) - Exceto FII, FI-Infra e FIAGRO';
COMMENT ON COLUMN fundo.tipo_fundo IS 'RENDA_FIXA, MULTIMERCADO, ACOES, CAMBIAL, ETF, PREVIDENCIA';
COMMENT ON COLUMN fundo.publico_alvo IS 'VAREJO, QUALIFICADO, PROFISSIONAL';
COMMENT ON COLUMN fundo.condominio IS 'ABERTO, FECHADO';
COMMENT ON COLUMN fundo.status IS 'ATIVO, ENCERRADO, LIQUIDACAO, SUSPENSO';

-- ============================================
-- Fim do Script 06
-- ============================================
