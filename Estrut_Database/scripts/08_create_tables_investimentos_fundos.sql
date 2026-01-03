-- ============================================
-- Script: Criação de Tabelas - Investimentos em Fundos
-- Data: 03/01/2026
-- Autor: David
-- Descrição: Cria tabelas de investimentos em fundos,
--            movimentações e reviews periódicos
-- ============================================

-- ============================================
-- TABELA: INV_FUNDO
-- ============================================
CREATE TABLE inv_fundo (
    id_inv_fundo SERIAL PRIMARY KEY,
    
    -- Identificação
    id_usuario INTEGER NOT NULL REFERENCES usuario(id_usuario),
    id_fundo INTEGER NOT NULL REFERENCES fundo(id_fundo),
    id_tipo_fundo INTEGER REFERENCES tipo_fundo(id_tipo_fundo),
    id_corretora INTEGER REFERENCES corretora(id_corretora),
    
    -- Aplicação Inicial
    data_aplicacao_inicial DATE NOT NULL,
    valor_aplicacao_inicial NUMERIC(18, 2) NOT NULL,
    quantidade_cotas_inicial NUMERIC(18, 6),
    valor_cota_aplicacao_inicial NUMERIC(18, 6),
    
    -- Posição Atual
    quantidade_cotas_atual NUMERIC(18, 6),
    valor_aplicado_total NUMERIC(18, 2),
    valor_resgatado_total NUMERIC(18, 2),
    saldo_investido NUMERIC(18, 2),
    
    -- Acompanhamento de Fundamentos
    rentabilidade_objetivo NUMERIC(8, 4),
    benchmark_objetivo VARCHAR(50),
    motivo_investimento TEXT,
    thesis_investimento TEXT,
    indicadores_entrada TEXT,
    
    -- Monitoramento de Performance
    alerta_performance CHAR(1) DEFAULT 'N' CHECK (alerta_performance IN ('S', 'N')),
    alerta_gestao CHAR(1) DEFAULT 'N' CHECK (alerta_gestao IN ('S', 'N')),
    alerta_taxas CHAR(1) DEFAULT 'N' CHECK (alerta_taxas IN ('S', 'N')),
    alerta_estrategia CHAR(1) DEFAULT 'N' CHECK (alerta_estrategia IN ('S', 'N')),
    data_ultimo_review DATE,
    avaliacao_atual VARCHAR(20),
    
    -- Taxas e Custos Efetivos
    taxa_administracao_efetiva NUMERIC(8, 4),
    taxa_performance_efetiva NUMERIC(8, 4),
    taxa_entrada_paga NUMERIC(8, 2),
    taxa_saida_estimada NUMERIC(8, 2),
    
    -- Status
    status VARCHAR(30) DEFAULT 'ATIVO',
    data_resgate_total DATE,
    motivo_saida TEXT,
    
    -- Rentabilidade e IR
    rentabilidade_acumulada NUMERIC(8, 4),
    valor_ir_retido_total NUMERIC(18, 2),
    valor_taxa_performance_paga NUMERIC(18, 2),
    
    -- Auditoria
    observacoes TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ultima_atualizacao TIMESTAMP
);

COMMENT ON TABLE inv_fundo IS 'Investimentos em fundos de investimento';
COMMENT ON COLUMN inv_fundo.avaliacao_atual IS 'MANTER, OBSERVAR, RESGATAR';
COMMENT ON COLUMN inv_fundo.status IS 'ATIVO, RESGATADO, PARCIALMENTE_RESGATADO';

-- ============================================
-- TABELA: INV_FUNDO_MOVIMENTACAO
-- ============================================
CREATE TABLE inv_fundo_movimentacao (
    id_movimentacao SERIAL PRIMARY KEY,
    id_inv_fundo INTEGER NOT NULL REFERENCES inv_fundo(id_inv_fundo) ON DELETE CASCADE,
    tipo_movimentacao VARCHAR(20) NOT NULL,
    data_solicitacao DATE NOT NULL,
    data_cotizacao DATE,
    data_liquidacao DATE,
    valor_financeiro NUMERIC(18, 2) NOT NULL,
    quantidade_cotas NUMERIC(18, 6),
    valor_cota NUMERIC(18, 6),
    taxa_saida NUMERIC(8, 2),
    ir_retido NUMERIC(18, 2),
    taxa_performance_retida NUMERIC(18, 2),
    valor_liquido NUMERIC(18, 2),
    observacoes TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE inv_fundo_movimentacao IS 'Histórico de aplicações, resgates e amortizações em fundos';
COMMENT ON COLUMN inv_fundo_movimentacao.tipo_movimentacao IS 'APLICACAO, RESGATE, AMORTIZACAO';

-- ============================================
-- TABELA: INV_FUNDO_REVIEW
-- ============================================
CREATE TABLE inv_fundo_review (
    id_review SERIAL PRIMARY KEY,
    id_inv_fundo INTEGER NOT NULL REFERENCES inv_fundo(id_inv_fundo) ON DELETE CASCADE,
    data_review DATE NOT NULL,
    id_usuario INTEGER NOT NULL REFERENCES usuario(id_usuario),
    
    -- Indicadores no Momento do Review
    patrimonio_liquido_fundo NUMERIC(18, 2),
    numero_cotistas INTEGER,
    rentabilidade_12m NUMERIC(8, 4),
    rentabilidade_24m NUMERIC(8, 4),
    rentabilidade_36m NUMERIC(8, 4),
    volatilidade_12m NUMERIC(8, 4),
    sharpe_ratio NUMERIC(8, 4),
    percentual_cdi_12m NUMERIC(8, 4),
    percentual_ibovespa_12m NUMERIC(8, 4),
    
    -- Análise de Aderência
    manteve_estrategia CHAR(1) CHECK (manteve_estrategia IN ('S', 'N')),
    gestora_mudou CHAR(1) CHECK (gestora_mudou IN ('S', 'N')),
    taxas_aumentaram CHAR(1) CHECK (taxas_aumentaram IN ('S', 'N')),
    performance_vs_benchmark VARCHAR(20),
    performance_vs_pares VARCHAR(30),
    liquidez_adequada CHAR(1) CHECK (liquidez_adequada IN ('S', 'N')),
    
    -- Pontos de Atenção
    pontos_positivos TEXT,
    pontos_negativos TEXT,
    riscos_identificados TEXT,
    mudancas_relevantes TEXT,
    
    -- Decisão
    decisao VARCHAR(30),
    justificativa_decisao TEXT,
    prazo_proximo_review DATE,
    
    -- Auditoria
    observacoes TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE inv_fundo_review IS 'Análises periódicas dos fundos para monitoramento de fundamentos';
COMMENT ON COLUMN inv_fundo_review.performance_vs_benchmark IS 'ACIMA, IGUAL, ABAIXO';
COMMENT ON COLUMN inv_fundo_review.performance_vs_pares IS 'ACIMA_MEDIA, MEDIA, ABAIXO_MEDIA';
COMMENT ON COLUMN inv_fundo_review.decisao IS 'MANTER, AUMENTAR_POSICAO, REDUZIR_POSICAO, RESGATAR_TOTAL';

-- ============================================
-- Fim do Script 08
-- ============================================
