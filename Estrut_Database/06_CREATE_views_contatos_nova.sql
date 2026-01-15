-- ============================================
-- VIEWS: CONTATOS (Nova Estrutura com FK)
-- Execute DEPOIS de recriar a tabela contatos
-- ============================================

-- VIEW PARA FORMULÁRIOS
CREATE VIEW contatos_instituicao_view AS
SELECT 
    c.id_contato,
    c.id_tipo_instituicao,
    ti.codigo AS tipo_codigo,
    ti.descricao AS tipo_descricao,
    c.id_instituicao,
    
    -- Nome da instituição baseado no tipo
    CASE 
        WHEN ti.codigo = 'corretora' THEN cor.nome_fantasia
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
INNER JOIN tipos_instituicao ti ON c.id_tipo_instituicao = ti.id_tipo_instituicao
LEFT JOIN corretoras cor ON ti.codigo = 'corretora' AND c.id_instituicao = cor.id_corretora;

COMMENT ON VIEW contatos_instituicao_view IS 
'View de contatos com joins para tipos e instituições';

-- ============================================
-- VIEW PARA RELATÓRIOS
-- ============================================

CREATE VIEW contatos_instituicao_report AS
SELECT 
    c.id_contato,
    ti.descricao AS tipo_instituicao,
    
    CASE 
        WHEN ti.codigo = 'corretora' THEN cor.nome_fantasia
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
    
    CASE 
        WHEN c.ativo = 'S' THEN 'Ativo'
        WHEN c.ativo = 'N' THEN 'Inativo'
        ELSE 'Indefinido'
    END AS status_formatado,
    
    c.ativo,
    c.data_cadastro,
    c.data_ultima_atualizacao,
    
    CASE 
        WHEN ti.codigo = 'corretora' THEN cor.cnpj
        ELSE NULL
    END AS cnpj_instituicao,
    
    CASE 
        WHEN ti.codigo = 'corretora' THEN cor.email_insitucional
        ELSE NULL
    END AS email_instituicao,
    
    CASE 
        WHEN ti.codigo = 'corretora' THEN cor.telefone_institucional
        ELSE NULL
    END AS telefone_instituicao
    
FROM contatos_instituicao c
INNER JOIN tipos_instituicao ti ON c.id_tipo_instituicao = ti.id_tipo_instituicao
LEFT JOIN corretoras cor ON ti.codigo = 'corretora' AND c.id_instituicao = cor.id_corretora
ORDER BY ti.ordem_exibicao, nome_instituicao, c.cargo, c.nome_completo;

COMMENT ON VIEW contatos_instituicao_report IS 
'View para relatórios com informações completas';

-- Verificação
SELECT 'Views de contatos criadas com sucesso!' as status;
SELECT COUNT(*) as total_contatos FROM contatos_instituicao;
