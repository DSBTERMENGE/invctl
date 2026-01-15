-- ============================================
-- STEP 3: CRIAR TABELA tipos_instituicao
-- Tabela mestra com os 6 tipos de instituições
-- ============================================

-- Dropar tabela se existir (cuidado em produção!)
DROP TABLE IF EXISTS tipos_instituicao CASCADE;

-- ============================================
-- TABELA: TIPOS DE INSTITUIÇÕES FINANCEIRAS
-- ============================================
CREATE TABLE tipos_instituicao (
    id_tipo_instituicao SERIAL PRIMARY KEY,
    nome_tipo VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT,
    ativo CHAR(1) DEFAULT 'S' CHECK (ativo IN ('S', 'N')),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INSERIR OS 6 TIPOS DE INSTITUIÇÕES
-- ============================================
INSERT INTO tipos_instituicao (nome_tipo, descricao) VALUES
    ('corretora', 'Corretora de valores - intermediação de operações no mercado financeiro'),
    ('banco', 'Instituição bancária - captação e empréstimo de recursos'),
    ('gestora', 'Gestora de recursos - administração profissional de investimentos'),
    ('administradora', 'Administradora de fundos - gestão operacional e custódia'),
    ('securitizadora', 'Securitizadora - transformação de recebíveis em títulos'),
    ('custodiante', 'Custodiante - guarda e controle de ativos financeiros');

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX idx_tipos_instituicao_nome ON tipos_instituicao(nome_tipo);
CREATE INDEX idx_tipos_instituicao_ativo ON tipos_instituicao(ativo);

-- ============================================
-- COMENTÁRIOS DESCRITIVOS
-- ============================================
COMMENT ON TABLE tipos_instituicao IS 
'Tabela mestra com os tipos de instituições financeiras do sistema';

COMMENT ON COLUMN tipos_instituicao.nome_tipo IS 
'Nome único do tipo: corretora, banco, gestora, administradora, securitizadora, custodiante';

-- ============================================
-- COMMIT EXPLÍCITO
-- ============================================
COMMIT;

-- ============================================
-- VERIFICAÇÃO
-- ============================================
SELECT 
    id_tipo_instituicao,
    nome_tipo,
    descricao,
    ativo
FROM tipos_instituicao
ORDER BY id_tipo_instituicao;

SELECT 'Tabela tipos_instituicao criada com sucesso!' as status,
       COUNT(*) as total_registros 
FROM tipos_instituicao;
