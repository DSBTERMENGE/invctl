-- ============================================
-- Migration 002: Refatorar inv_rf para usar FK de papeis_rf
-- Data: 16/02/2026
-- Descrição: Remove campos duplicados e adiciona id_papel_rf
--            como Foreign Key para papeis_rf
-- ============================================

-- ============================================
-- 1. DROP TABLES (dados de teste - sem impacto)
-- ============================================
DROP TABLE IF EXISTS inv_rf_cupom CASCADE;
DROP TABLE IF EXISTS inv_rf CASCADE;

-- ============================================
-- 2. RECREATE inv_rf COM ESTRUTURA CORRETA
-- ============================================
CREATE TABLE inv_rf (
    id_inv_rf SERIAL PRIMARY KEY,
    
    -- Relacionamento com papel (NOVO - chave para tudo)
    id_papel_rf INTEGER NOT NULL REFERENCES papeis_rf(id_papel_rf),
    
    -- Identificação da operação
    id_usuario INTEGER NOT NULL DEFAULT 1 REFERENCES usuario(id_usuario),
    id_corretora INTEGER REFERENCES corretora(id_corretora),
    
    -- Datas específicas da aplicação
    data_aplicacao DATE NOT NULL,
    data_liquidacao DATE,
    
    -- Valores da operação
    valor_aplicado NUMERIC(18, 2) NOT NULL,
    valor_liquido_aplicado NUMERIC(18, 2),
    
    -- Status da operação
    status VARCHAR(20) DEFAULT 'ATIVO',
    data_resgate DATE,
    valor_resgate_bruto NUMERIC(18, 2),
    valor_resgate_liquido NUMERIC(18, 2),
    
    -- Auditoria
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ultima_atualizacao TIMESTAMP,
    observacoes TEXT
);

COMMENT ON TABLE inv_rf IS 'Investimentos em Renda Fixa - Operações de aplicação';
COMMENT ON COLUMN inv_rf.id_papel_rf IS 'FK para papeis_rf - todos dados do papel vêm dessa relação';
COMMENT ON COLUMN inv_rf.data_aplicacao IS 'Data em que o investimento foi efetivamente realizado';
COMMENT ON COLUMN inv_rf.valor_aplicado IS 'Valor bruto aplicado nesta operação específica';
COMMENT ON COLUMN inv_rf.status IS 'ATIVO, RESGATADO, VENCIDO';

-- ============================================
-- 3. RECREATE inv_rf_cupom
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
-- 4. CREATE INDEX para performance
-- ============================================
CREATE INDEX idx_inv_rf_papel ON inv_rf(id_papel_rf);
CREATE INDEX idx_inv_rf_usuario ON inv_rf(id_usuario);
CREATE INDEX idx_inv_rf_status ON inv_rf(status);
CREATE INDEX idx_inv_rf_data_aplicacao ON inv_rf(data_aplicacao);

-- ============================================
-- Fim da Migration 002
-- ============================================
