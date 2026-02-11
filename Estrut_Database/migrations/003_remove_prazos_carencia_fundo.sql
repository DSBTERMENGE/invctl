-- ============================================================================
-- MIGRATION: Remover campos de prazo e carência da tabela fundo
-- ============================================================================
-- Data: 10/02/2026
-- Descrição: Remove campos prazo_liquidacao_resgate, prazo_cotizacao_aplicacao,
--            prazo_cotizacao_resgate e carencia_resgate_dias
-- ============================================================================

\c invctl_db

-- Remover colunas de prazo e carência
ALTER TABLE fundo 
DROP COLUMN IF EXISTS prazo_liquidacao_resgate,
DROP COLUMN IF EXISTS prazo_cotizacao_aplicacao,
DROP COLUMN IF EXISTS prazo_cotizacao_resgate,
DROP COLUMN IF EXISTS carencia_resgate_dias;

-- Atualizar VIEW fundo_view sem os campos de prazo e carência
DROP VIEW IF EXISTS fundo_view CASCADE;

CREATE VIEW fundo_view AS
SELECT
    f.id_fundo,
    f.cnpj,
    f.codigo_cvm,
    f.nome_completo,
    f.nome_abreviado,
    f.tipo_fundo,
    f.classificacao_anbima,
    f.id_gestora,
    g.nome_completo AS gestora_nome,
    f.id_administradora,
    a.nome_completo AS administradora_nome,
    f.id_custodiante,
    b.nome_completo AS banco_custodiante_nome,
    f.id_corretora,
    c.nome_fantasia AS corretora_nome,
    f.benchmark,
    f.taxa_administracao,
    f.taxa_performance,
    f.taxa_entrada,
    f.taxa_saida,
    f.possui_come_cotas,
    f.patrimonio_liquido,
    f.numero_cotistas,
    f.data_inicio,
    f.status,
    f.observacoes,
    f.data_cadastro,
    f.data_ultima_atualizacao
FROM fundo f
LEFT JOIN gestoras g ON f.id_gestora = g.id_gestora
LEFT JOIN administradoras a ON f.id_administradora = a.id_administradora
LEFT JOIN bancos b ON f.id_custodiante = b.id_banco
LEFT JOIN corretoras c ON f.id_corretora = c.id_corretora
ORDER BY f.nome_abreviado;

COMMENT ON VIEW fundo_view IS 'View para formulário de fundos com nomes descritivos das entidades relacionadas (sem prazos e carência)';

-- ============================================================================
-- FIM DA MIGRATION
-- ============================================================================
