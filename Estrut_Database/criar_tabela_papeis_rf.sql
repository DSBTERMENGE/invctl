-- ============================================================================
-- TABELA PAPEIS_RF (Papéis de Renda Fixa disponíveis no mercado)
-- ============================================================================
-- Data: 19/01/2026
-- Descrição: Cadastro de papéis de RF (CDB, LCI, LCA, Debêntures, etc)
--            SEM CRI/CRA (têm tabela separada papeis_cri_cra)
--            SEM id_usuario (papéis são públicos)
--            SEM id_corretora (definida no investimento)
-- ============================================================================

-- Drop tabela se existir
DROP TABLE IF EXISTS papeis_rf CASCADE;

-- ============================================================================
-- CRIAR TABELA PAPEIS_RF
-- ============================================================================
CREATE TABLE papeis_rf (
    id_papel_rf SERIAL PRIMARY KEY,
    id_tipo_investimento INTEGER NOT NULL,
    id_banco_emissor INTEGER NOT NULL,
    id_indexador INTEGER NOT NULL,
    codigo_ativo VARCHAR(50) NOT NULL UNIQUE,
    descricao VARCHAR(255),
    data_emissao DATE,
    data_vencimento DATE,
    valor_nominal DECIMAL(15,2),
    taxa_prefixada DECIMAL(8,4),
    percentual_indexador DECIMAL(8,4),
    tipo_rentabilidade VARCHAR(50) CHECK (tipo_rentabilidade IN ('PRE_FIXADO', 'POS_FIXADO', 'HIBRIDO')),
    liquidez VARCHAR(50) CHECK (liquidez IN ('DIARIA', 'VENCIMENTO', 'PARCIAL')),
    dias_carencia INTEGER DEFAULT 0,
    garantia_fgc CHAR(1) DEFAULT 'S' CHECK (garantia_fgc IN ('S', 'N')),
    valor_garantido_fgc DECIMAL(15,2),
    periodicidade_cupom VARCHAR(50),
    taxa_administracao DECIMAL(8,4),
    taxa_custodia DECIMAL(8,4),
    iof_aplicavel CHAR(1) DEFAULT 'S' CHECK (iof_aplicavel IN ('S', 'N')),
    ativo CHAR(1) DEFAULT 'S' CHECK (ativo IN ('S', 'N')),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_inativacao DATE,
    observacoes TEXT,
    
    -- Foreign Keys
    CONSTRAINT fk_papel_rf_tipo FOREIGN KEY (id_tipo_investimento) REFERENCES tipo_investimento(id_tipo_investimento),
    CONSTRAINT fk_papel_rf_banco FOREIGN KEY (id_banco_emissor) REFERENCES bancos(id_banco),
    CONSTRAINT fk_papel_rf_indexador FOREIGN KEY (id_indexador) REFERENCES indexador(id_indexador)
);

-- Índices para performance
CREATE INDEX idx_papel_rf_tipo ON papeis_rf(id_tipo_investimento);
CREATE INDEX idx_papel_rf_banco ON papeis_rf(id_banco_emissor);
CREATE INDEX idx_papel_rf_codigo ON papeis_rf(codigo_ativo);
CREATE INDEX idx_papel_rf_ativo ON papeis_rf(ativo);

-- Comentários
COMMENT ON TABLE papeis_rf IS 'Papéis de Renda Fixa disponíveis no mercado (exceto CRI/CRA)';
COMMENT ON COLUMN papeis_rf.codigo_ativo IS 'Código único do papel (ex: CDB-ITAU-2028-120CDI)';
COMMENT ON COLUMN papeis_rf.ativo IS 'S=Disponível para novos investimentos, N=Inativo/Vencido';
