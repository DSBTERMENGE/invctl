-- ============================================
-- VIEW REPORT: CONTATOS DE INSTITUIÇÕES
-- Estrutura para relatórios com todas as informações
-- ============================================

CREATE VIEW contatos_instituicao_report AS
SELECT 
    c.id_contato,
    c.tipo_instituicao,
    
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
    
    -- Status formatado
    CASE 
        WHEN c.ativo = 'S' THEN 'Ativo'
        WHEN c.ativo = 'N' THEN 'Inativo'
        ELSE 'Indefinido'
    END AS status_formatado,
    
    c.ativo,
    c.data_cadastro,
    c.data_ultima_atualizacao,
    
    -- Informações adicionais da instituição (se corretora)
    CASE 
        WHEN c.tipo_instituicao = 'corretora' THEN cor.cnpj
        ELSE NULL
    END AS cnpj_instituicao,
    
    CASE 
        WHEN c.tipo_instituicao = 'corretora' THEN cor.email_institucional
        ELSE NULL
    END AS email_instituicao,
    
    CASE 
        WHEN c.tipo_instituicao = 'corretora' THEN cor.telefone_institucional
        ELSE NULL
    END AS telefone_instituicao
    
FROM contatos_instituicao c
LEFT JOIN corretoras cor ON c.tipo_instituicao = 'corretora' AND c.id_instituicao = cor.id_corretora
ORDER BY c.tipo_instituicao, nome_instituicao, c.cargo, c.nome_completo;

COMMENT ON VIEW contatos_instituicao_report IS 
'View para relatórios de contatos com informações completas das instituições';

-- Verificação
SELECT 'View contatos_instituicao_report criada com sucesso!' as status;
SELECT COUNT(*) as total_contatos FROM contatos_instituicao_report;
