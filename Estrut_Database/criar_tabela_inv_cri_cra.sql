-- ============================================================================
-- TABELA INV_CRI_CRA (Investimentos em CRI e CRA)
-- ============================================================================
-- Data: 17/01/2026
-- Descrição: Tabela específica para CRI e CRA com securitizadora obrigatória
-- ============================================================================

-- Drop tabela se existir
DROP TABLE IF EXISTS inv_cri_cra CASCADE;

-- ============================================================================
-- CRIAR TABELA INV_CRI_CRA
-- ============================================================================
CREATE TABLE inv_cri_cra (
    id_inv_cri_cra SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    id_tipo_investimento INTEGER NOT NULL,
    id_banco_emissor INTEGER NOT NULL,
    id_securitizadora INTEGER NOT NULL,  -- OBRIGATÓRIO para CRI/CRA
    id_corretora INTEGER,
    codigo_ativo VARCHAR(50) NOT NULL UNIQUE,
    data_aplicacao DATE NOT NULL,
    data_vencimento DATE,
    data_liquidacao DATE,
    valor_aplicado DECIMAL(15,2) NOT NULL,
    valor_liquido_aplicado DECIMAL(15,2),
    id_indexador INTEGER,
    percentual_indexador DECIMAL(8,4),
    taxa_prefixada DECIMAL(8,4),
    tipo_rentabilidade VARCHAR(50),
    liquidez VARCHAR(50),
    dias_carencia INTEGER,
    garantia_fgc CHAR(1) DEFAULT 'N' CHECK (garantia_fgc IN ('S', 'N')),
    valor_garantido_fgc DECIMAL(15,2),
    periodicidade_cupom VARCHAR(50),
    taxa_administracao DECIMAL(8,4),
    taxa_custodia DECIMAL(8,4),
    iof_aplicavel CHAR(1) DEFAULT 'S' CHECK (iof_aplicavel IN ('S', 'N')),
    status VARCHAR(20) DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'VENCIDO', 'RESGATADO', 'CANCELADO')),
    data_resgate DATE,
    valor_resgate_liquido DECIMAL(15,2),
    data_ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observacoes TEXT,
    
    -- Foreign Keys
    CONSTRAINT fk_cri_cra_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    CONSTRAINT fk_cri_cra_tipo FOREIGN KEY (id_tipo_investimento) REFERENCES tipo_investimento(id_tipo_investimento),
    CONSTRAINT fk_cri_cra_banco FOREIGN KEY (id_banco_emissor) REFERENCES bancos(id_banco),
    CONSTRAINT fk_cri_cra_securitizadora FOREIGN KEY (id_securitizadora) REFERENCES securitizadoras(id_securitizadora),
    CONSTRAINT fk_cri_cra_corretora FOREIGN KEY (id_corretora) REFERENCES corretoras(id_corretora),
    CONSTRAINT fk_cri_cra_indexador FOREIGN KEY (id_indexador) REFERENCES indexador(id_indexador)
);

-- Índices para performance
CREATE INDEX idx_cri_cra_usuario ON inv_cri_cra(id_usuario);
CREATE INDEX idx_cri_cra_tipo ON inv_cri_cra(id_tipo_investimento);
CREATE INDEX idx_cri_cra_data_aplicacao ON inv_cri_cra(data_aplicacao);
CREATE INDEX idx_cri_cra_status ON inv_cri_cra(status);

-- Comentários
COMMENT ON TABLE inv_cri_cra IS 'Investimentos do usuário em CRI e CRA (com securitizadora obrigatória)';
COMMENT ON COLUMN inv_cri_cra.id_securitizadora IS 'Securitizadora obrigatória para CRI/CRA';
