-- ============================================
-- Script: Criação de Tabelas - Investimentos RF
-- Data: 03/01/2026
-- Autor: David
-- Descrição: Cria tabelas de investimentos em
--            Renda Fixa e seus cupons
-- ============================================

-- ============================================
-- TABELA: INV_RF
-- ============================================
CREATE TABLE inv_rf (
    id_inv_rf SERIAL PRIMARY KEY,
    
    -- Identificação
    id_usuario INTEGER NOT NULL REFERENCES usuario(id_usuario),
    id_tipo_investimento INTEGER NOT NULL REFERENCES tipo_investimento(id_tipo_investimento),
    id_banco_emissor INTEGER REFERENCES banco(id_banco),
    id_securitizadora INTEGER REFERENCES securitizadora(id_securitizadora),
    id_corretora INTEGER REFERENCES corretora(id_corretora),
    codigo_ativo VARCHAR(50),
    
    -- Datas
    data_aplicacao DATE NOT NULL,
    data_vencimento DATE NOT NULL,
    data_liquidacao DATE,
    
    -- Valores
    valor_aplicado NUMERIC(18, 2) NOT NULL,
    valor_liquido_aplicado NUMERIC(18, 2),
    
    -- Rentabilidade
    id_indexador INTEGER REFERENCES indexador(id_indexador),
    percentual_indexador NUMERIC(8, 4),
    taxa_prefixada NUMERIC(8, 4),
    tipo_rentabilidade VARCHAR(20),
    
    -- Liquidez e Garantias
    liquidez VARCHAR(30),
    dias_carencia INTEGER,
    possui_garantia_fgc CHAR(1) DEFAULT 'N' CHECK (possui_garantia_fgc IN ('S', 'N')),
    valor_garantido_fgc NUMERIC(18, 2),
    
    -- Cupons
    possui_cupom CHAR(1) DEFAULT 'N' CHECK (possui_cupom IN ('S', 'N')),
    periodicidade_cupom VARCHAR(20),
    
    -- Taxas e Custos
    taxa_administracao NUMERIC(8, 4),
    taxa_custodia NUMERIC(8, 4),
    iof_aplicavel CHAR(1) DEFAULT 'S' CHECK (iof_aplicavel IN ('S', 'N')),
    
    -- Status
    status VARCHAR(20) DEFAULT 'ATIVO',
    data_resgate DATE,
    valor_resgate_bruto NUMERIC(18, 2),
    valor_resgate_liquido NUMERIC(18, 2),
    
    -- Auditoria
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ultima_atualizacao TIMESTAMP,
    observacoes TEXT
);

COMMENT ON TABLE inv_rf IS 'Investimentos em Renda Fixa (CDB, LCI, LCA, LC, CRI, CRA)';
COMMENT ON COLUMN inv_rf.tipo_rentabilidade IS 'POS_FIXADO, PRE_FIXADO, HIBRIDO';
COMMENT ON COLUMN inv_rf.liquidez IS 'VENCIMENTO, DIARIA, D+n';
COMMENT ON COLUMN inv_rf.periodicidade_cupom IS 'MENSAL, TRIMESTRAL, SEMESTRAL, ANUAL';
COMMENT ON COLUMN inv_rf.status IS 'ATIVO, RESGATADO, VENCIDO';

-- ============================================
-- TABELA: INV_RF_CUPOM
-- ============================================
CREATE TABLE inv_rf_cupom (
    id_inv_rf_cupom SERIAL PRIMARY KEY,
    id_inv_rf INTEGER NOT NULL REFERENCES inv_rf(id_inv_rf) ON DELETE CASCADE,
    numero_cupom INTEGER NOT NULL,
    data_prevista_pagamento DATE NOT NULL,
    data_efetiva_pagamento DATE,
    valor_bruto NUMERIC(18, 2),
    valor_ir NUMERIC(18, 2),
    valor_liquido NUMERIC(18, 2),
    periodo_referencia_inicio DATE,
    periodo_referencia_fim DATE,
    status VARCHAR(20) DEFAULT 'PREVISTO',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE inv_rf_cupom IS 'Cupons de pagamento periódico de investimentos de Renda Fixa';
COMMENT ON COLUMN inv_rf_cupom.status IS 'PREVISTO, PAGO, CANCELADO';

-- ============================================
-- Fim do Script 07
-- ============================================
