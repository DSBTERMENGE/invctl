-- =====================================================
-- TABELA: INVESTIMENTO_FUNDO_ESTRUTURADO
-- =====================================================
-- Registra operações de compra, venda, dividendos e outros
-- eventos em fundos estruturados (FII, FIAGRO, FI-Infra)

CREATE TABLE IF NOT EXISTS investimento_fundo_estruturado (
    id_investimento_fundo_estruturado SERIAL PRIMARY KEY,
    id_fundo_estruturado INTEGER NOT NULL,
    id_corretora INTEGER NOT NULL,
    data_operacao DATE NOT NULL,
    tipo_operacao VARCHAR(50) NOT NULL,  -- Compra, Venda, Dividendo, Outros
    quantidade_cotas NUMERIC(18, 6),     -- Quantidade de cotas (NULL para dividendos)
    preco_cota NUMERIC(18, 6),           -- Preço unitário (NULL para dividendos)
    valor_total NUMERIC(18, 2) NOT NULL, -- Calculado: quantidade × preço (ou valor direto para dividendos)
    observacoes TEXT,
    
    -- Foreign Keys
    CONSTRAINT fk_investimento_fundo_estruturado_fundo 
        FOREIGN KEY (id_fundo_estruturado) 
        REFERENCES fundo_estruturado(id_fundo_estruturado)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    
    CONSTRAINT fk_investimento_fundo_estruturado_corretora 
        FOREIGN KEY (id_corretora) 
        REFERENCES corretoras(id_corretora)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- Índices para melhor performance
CREATE INDEX idx_investimento_fe_fundo ON investimento_fundo_estruturado(id_fundo_estruturado);
CREATE INDEX idx_investimento_fe_corretora ON investimento_fundo_estruturado(id_corretora);
CREATE INDEX idx_investimento_fe_data ON investimento_fundo_estruturado(data_operacao);

-- Comentários
COMMENT ON TABLE investimento_fundo_estruturado IS 
'Registro de operações em fundos estruturados (FII, FIAGRO, FI-Infra): compras, vendas, dividendos';

COMMENT ON COLUMN investimento_fundo_estruturado.tipo_operacao IS 
'Tipo: Compra (Débito), Venda (Crédito), Dividendo (Rendimento), Outros (Ajustes)';

COMMENT ON COLUMN investimento_fundo_estruturado.quantidade_cotas IS 
'Quantidade de cotas negociadas (NULL para dividendos e outros sem movimentação de cotas)';

COMMENT ON COLUMN investimento_fundo_estruturado.preco_cota IS 
'Preço unitário da cota na operação (NULL para dividendos e outros sem preço)';

COMMENT ON COLUMN investimento_fundo_estruturado.valor_total IS 
'Valor total da operação: quantidade × preço para compra/venda, ou valor direto para dividendos';
