-- ============================================
-- TABELA: TIPOS DE INSTITUIÇÃO FINANCEIRA
-- ============================================

-- Dropar objetos existentes
DROP VIEW IF EXISTS tipos_instituicao_view CASCADE;
DROP TABLE IF EXISTS tipos_instituicao CASCADE;

CREATE TABLE tipos_instituicao (
    id_tipo_instituicao SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    descricao VARCHAR(50) NOT NULL,
    ativo CHAR(1) DEFAULT 'S' CHECK (ativo IN ('S', 'N')),
    ordem_exibicao INTEGER,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_tipos_instituicao_codigo ON tipos_instituicao(codigo);
CREATE INDEX idx_tipos_instituicao_ativo ON tipos_instituicao(ativo);

-- Comentários
COMMENT ON TABLE tipos_instituicao IS 'Tipos de instituições financeiras (corretora, banco, etc)';
COMMENT ON COLUMN tipos_instituicao.codigo IS 'Código único do tipo (usado como chave lógica)';
COMMENT ON COLUMN tipos_instituicao.ordem_exibicao IS 'Ordem de exibição nos selects';

-- ============================================
-- DADOS INICIAIS
-- ============================================

INSERT INTO tipos_instituicao (codigo, descricao, ordem_exibicao) VALUES
('corretora', 'Corretora', 1),
('banco', 'Banco', 2),
('gestora', 'Gestora', 3),
('administradora', 'Administradora', 4),
('securitizadora', 'Securitizadora', 5),
('custodiante', 'Custodiante', 6);

-- ============================================
-- VIEW PARA FORMULÁRIOS
-- ============================================

CREATE VIEW tipos_instituicao_view AS
SELECT 
    id_tipo_instituicao,
    codigo,
    descricao,
    ativo,
    ordem_exibicao
FROM tipos_instituicao
WHERE ativo = 'S'
ORDER BY ordem_exibicao;

-- ============================================
-- COMMIT EXPLÍCITO
-- ============================================
COMMIT;

-- ============================================
-- VERIFICAÇÃO (Execute separadamente se necessário)
-- ============================================
-- SELECT 'Tabela tipos_instituicao criada com sucesso!' as status;
-- SELECT * FROM tipos_instituicao ORDER BY ordem_exibicao;
