-- ============================================
-- STEP 4: CRIAR TABELA contatos_instituicao
-- Com FK para tipos_instituicao (nova estrutura)
-- ============================================

-- ⚠️ ATENÇÃO: Execute DEPOIS do script 03_CREATE_tipos_instituicao.sql

-- Dropar objetos dependentes primeiro
DROP VIEW IF EXISTS contatos_instituicao_report CASCADE;
DROP VIEW IF EXISTS contatos_instituicao_view CASCADE;
DROP TABLE IF EXISTS contatos_instituicao CASCADE;

-- ============================================
-- TABELA: CONTATOS DE INSTITUIÇÕES FINANCEIRAS
-- Estrutura com FK para tipos_instituicao
-- ============================================
CREATE TABLE contatos_instituicao (
    id_contato SERIAL PRIMARY KEY,
    
    -- 🎯 CAMPOS CHAVE COM FK
    id_tipo_instituicao INTEGER NOT NULL,
    id_instituicao INTEGER NOT NULL,
    
    -- 👤 DADOS DO CONTATO
    nome_completo VARCHAR(255) NOT NULL,
    cargo VARCHAR(50),              -- assessor, gerente, diretor, presidente
    funcao VARCHAR(100),            -- gestor de carteira, analista, etc
    setor VARCHAR(100),             -- comercial, operacional, compliance
    
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
    
    -- 🔗 FOREIGN KEY
    CONSTRAINT fk_tipo_instituicao 
        FOREIGN KEY (id_tipo_instituicao) 
        REFERENCES tipos_instituicao(id_tipo_instituicao)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    
    -- 🔍 CONSTRAINT ÚNICA
    CONSTRAINT uk_contato_instituicao 
        UNIQUE (id_tipo_instituicao, id_instituicao, nome_completo)
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX idx_contatos_tipo_instituicao ON contatos_instituicao(id_tipo_instituicao);
CREATE INDEX idx_contatos_instituicao_id ON contatos_instituicao(id_instituicao);
CREATE INDEX idx_contatos_tipo_id_composto ON contatos_instituicao(id_tipo_instituicao, id_instituicao);
CREATE INDEX idx_contatos_cargo ON contatos_instituicao(cargo);
CREATE INDEX idx_contatos_ativo ON contatos_instituicao(ativo);
CREATE INDEX idx_contatos_email ON contatos_instituicao(email);

-- ============================================
-- TRIGGER: ATUALIZAR data_ultima_atualizacao
-- ============================================
CREATE OR REPLACE FUNCTION atualizar_data_contato()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_ultima_atualizacao = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_contato
    BEFORE UPDATE ON contatos_instituicao
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_data_contato();

-- ============================================
-- VIEW 1: CONTATOS COM NOME DA INSTITUIÇÃO
-- Facilita consultas juntando com nome
-- ============================================
CREATE VIEW contatos_instituicao_view AS
SELECT 
    c.id_contato,
    c.id_tipo_instituicao,
    t.codigo as tipo_instituicao,
    c.id_instituicao,
    
    -- Nome da instituição baseado no tipo
    CASE 
        WHEN t.codigo = 'corretora' THEN cor.nome_fantasia
        WHEN t.codigo = 'banco' THEN ban.nome_fantasia
        WHEN t.codigo = 'gestora' THEN ges.nome_fantasia
        WHEN t.codigo = 'administradora' THEN adm.nome_fantasia
        WHEN t.codigo = 'securitizadora' THEN sec.nome_fantasia
        -- custodiante não tem tabela própria ainda
        ELSE 'Instituição não cadastrada'
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
INNER JOIN tipos_instituicao t ON c.id_tipo_instituicao = t.id_tipo_instituicao
LEFT JOIN corretoras cor ON t.codigo = 'corretora' AND c.id_instituicao = cor.id_corretora
LEFT JOIN banco ban ON t.codigo = 'banco' AND c.id_instituicao = ban.id_banco
LEFT JOIN gestora ges ON t.codigo = 'gestora' AND c.id_instituicao = ges.id_gestora
LEFT JOIN administradora adm ON t.codigo = 'administradora' AND c.id_instituicao = adm.id_administradora
LEFT JOIN securitizadora sec ON t.codigo = 'securitizadora' AND c.id_instituicao = sec.id_securitizadora;

-- ============================================
-- VIEW 2: RELATÓRIO COMPLETO DE CONTATOS
-- Para exportações e relatórios gerenciais
-- ============================================
CREATE VIEW contatos_instituicao_report AS
SELECT 
    c.id_contato,
    t.codigo as tipo_instituicao,
    v.nome_instituicao,
    c.nome_completo as contato,
    c.cargo,
    c.funcao,
    c.setor,
    c.email,
    CONCAT_WS(' / ', 
        NULLIF(c.telefone, ''), 
        NULLIF(c.celular, ''),
        CASE WHEN c.ramal IS NOT NULL THEN 'Ramal: ' || c.ramal END
    ) as telefones,
    c.observacoes,
    CASE c.ativo 
        WHEN 'S' THEN 'Ativo' 
        ELSE 'Inativo' 
    END as status,
    TO_CHAR(c.data_cadastro, 'DD/MM/YYYY HH24:MI') as data_cadastro,
    TO_CHAR(c.data_ultima_atualizacao, 'DD/MM/YYYY HH24:MI') as ultima_atualizacao
FROM contatos_instituicao c
INNER JOIN tipos_instituicao t ON c.id_tipo_instituicao = t.id_tipo_instituicao
INNER JOIN contatos_instituicao_view v ON c.id_contato = v.id_contato;

-- ============================================
-- COMENTÁRIOS DESCRITIVOS
-- ============================================
COMMENT ON TABLE contatos_instituicao IS 
'Contatos (pessoas) vinculados a instituições financeiras - Estrutura com FK para tipos_instituicao';

COMMENT ON COLUMN contatos_instituicao.id_tipo_instituicao IS 
'FK para tipos_instituicao - define o tipo da instituição';

COMMENT ON COLUMN contatos_instituicao.id_instituicao IS 
'ID da instituição específica (id_corretora, id_banco, etc)';

COMMENT ON VIEW contatos_instituicao_view IS 
'View com contatos e nome das instituições - facilita consultas';

COMMENT ON VIEW contatos_instituicao_report IS 
'View formatada para relatórios e exportações';

-- ============================================
-- COMMIT EXPLÍCITO
-- ============================================
COMMIT;

-- ============================================
-- VERIFICAÇÃO FINAL (Execute separadamente se necessário)
-- ============================================
-- SELECT 'Tabela contatos_instituicao criada com sucesso!' as status;
-- SELECT 'View contatos_instituicao_view criada!' as status_view1;
-- SELECT 'View contatos_instituicao_report criada!' as status_view2;

-- Mostrar estrutura
-- SELECT 
--     column_name as coluna,
--     data_type as tipo,
--     character_maximum_length as tamanho,
--     is_nullable as permite_null
-- FROM information_schema.columns 
-- WHERE table_name = 'contatos_instituicao'
-- ORDER BY ordinal_position;

-- Contar registros (deve estar vazio)
-- SELECT COUNT(*) as total_contatos FROM contatos_instituicao;

-- Testar view
-- SELECT COUNT(*) as total_view FROM contatos_instituicao_view;
