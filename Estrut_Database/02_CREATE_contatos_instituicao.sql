-- ============================================
-- STEP 2: CREATE - Nova estrutura simplificada
-- Execute DEPOIS do script 01_DELETE
-- ============================================

-- ============================================
-- TABELA: CONTATOS DE INSTITUIÇÕES FINANCEIRAS
-- Estrutura Simplificada: tipo_instituicao + id_instituicao
-- ============================================

CREATE TABLE contatos_instituicao (
    id_contato SERIAL PRIMARY KEY,
    
    -- 🎯 CAMPOS CHAVE SIMPLIFICADOS
    tipo_instituicao VARCHAR(20) NOT NULL CHECK (
        tipo_instituicao IN ('corretora', 'banco', 'gestora', 'administradora', 'securitizadora', 'custodiante')
    ),
    id_instituicao INTEGER NOT NULL,
    
    -- 👤 DADOS DO CONTATO
    nome_completo VARCHAR(255) NOT NULL,
    cargo VARCHAR(50),              -- assessor, gerente, diretor, presidente
    funcao VARCHAR(100),             -- gestor de carteira, analista, etc
    setor VARCHAR(100),              -- comercial, operacional, compliance
    
    -- 📞 CONTATOS
    email VARCHAR(255),
    telefone VARCHAR(20),
    celular VARCHAR(20),
    ramal VARCHAR(10),
    
    -- 📝 OBSERVAÇÕES E STATUS
    observacoes TEXT,
    ativo CHAR(1) DEFAULT 'S' CHECK (ativo IN ('S', 'N')),
    
    -- 📅 AUDITORIA
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ultima_atualizacao TIMESTAMP,
    
    -- 🔍 ÍNDICES COMPOSTOS PARA PERFORMANCE
    CONSTRAINT idx_tipo_instituicao UNIQUE (tipo_instituicao, id_instituicao, nome_completo)
);

-- 📋 CRIAR ÍNDICES PARA QUERIES RÁPIDAS
CREATE INDEX idx_contatos_tipo ON contatos_instituicao(tipo_instituicao);
CREATE INDEX idx_contatos_instituicao_id ON contatos_instituicao(id_instituicao);
CREATE INDEX idx_contatos_tipo_id ON contatos_instituicao(tipo_instituicao, id_instituicao);
CREATE INDEX idx_contatos_cargo ON contatos_instituicao(cargo);
CREATE INDEX idx_contatos_ativo ON contatos_instituicao(ativo);

-- 📝 COMENTÁRIOS DESCRITIVOS
COMMENT ON TABLE contatos_instituicao IS 
'Contatos (pessoas) vinculados a instituições financeiras - Estrutura simplificada com tipo_instituicao + id_instituicao';

COMMENT ON COLUMN contatos_instituicao.tipo_instituicao IS 
'Tipo da instituição: corretora, banco, gestora, administradora, securitizadora, custodiante';

COMMENT ON COLUMN contatos_instituicao.id_instituicao IS 
'ID genérico da instituição - referencia id_corretora, id_banco, etc conforme tipo_instituicao';

COMMENT ON COLUMN contatos_instituicao.cargo IS 
'Cargo formal: assessor, gerente, diretor, presidente, analista';

COMMENT ON COLUMN contatos_instituicao.funcao IS 
'Função específica: gestor de carteira, analista de renda fixa, trader, etc';

-- ============================================
-- VIEW: CONTATOS COM NOME DA INSTITUIÇÃO
-- Facilita consultas juntando com nome da instituição
-- ============================================

CREATE VIEW contatos_instituicao_view AS
SELECT 
    c.id_contato,
    c.tipo_instituicao,
    c.id_instituicao,
    
    -- Nome da instituição baseado no tipo
    CASE 
        WHEN c.tipo_instituicao = 'corretora' THEN cor.nome_fantasia
        -- Adicionar outros tipos conforme tabelas forem criadas:
        -- WHEN c.tipo_instituicao = 'banco' THEN ban.nome_banco
        -- WHEN c.tipo_instituicao = 'gestora' THEN ges.nome_fantasia
        ELSE 'Instituição não encontrada'
    END AS nome_instituicao,
    
    c.nome_completo,
    c.cargo,
    c.funcao,
    c.setor,
    c.email,
    c.telefone,
    c.celular,
    c.ramal,
    c.observacoes,
    c.ativo,
    c.data_cadastro,
    c.data_ultima_atualizacao
FROM contatos_instituicao c
LEFT JOIN corretoras cor ON c.tipo_instituicao = 'corretora' AND c.id_instituicao = cor.id_corretora;

COMMENT ON VIEW contatos_instituicao_view IS 
'View com contatos e nome das instituições - facilita consultas e relatórios';

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================

SELECT 'Tabela contatos_instituicao criada com sucesso!' as status;
SELECT 'View contatos_instituicao_view criada com sucesso!' as status_view;

-- Mostrar estrutura
SELECT 
    column_name, 
    data_type, 
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'contatos_instituicao'
ORDER BY ordinal_position;

-- Contar registros (deve estar vazio)
SELECT COUNT(*) as total_contatos FROM contatos_instituicao;
