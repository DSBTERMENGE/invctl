-- ============================================
-- STEP 6: CRIAR VIEWS DE CONTATOS
-- Views para facilitar consultas
-- ============================================

-- ⚠️ Execute este script DEPOIS do 05_ADD_FK_contatos_instituicao.sql

-- Dropar views se existirem
DROP VIEW IF EXISTS contatos_instituicao_report CASCADE;
DROP VIEW IF EXISTS contatos_instituicao_view CASCADE;

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
COMMENT ON VIEW contatos_instituicao_view IS 
'View com contatos e nome das instituições - facilita consultas';

COMMENT ON VIEW contatos_instituicao_report IS 
'View formatada para relatórios e exportações';

-- ============================================
-- COMMIT EXPLÍCITO
-- ============================================
COMMIT;

-- ============================================
-- VERIFICAÇÃO
-- ============================================
SELECT 'Views criadas com sucesso!' as status;

-- Listar views criadas
SELECT table_name as view_name
FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name LIKE 'contatos_instituicao%'
ORDER BY table_name;

-- Testar view (deve retornar 0 pois não há registros ainda)
SELECT COUNT(*) as total_view FROM contatos_instituicao_view;
