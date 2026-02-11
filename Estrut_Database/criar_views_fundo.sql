-- ============================================================================
-- VIEWS PARA TABELA FUNDO (Fundos de Investimento)
-- ============================================================================
-- Data: 09/02/2026
-- Descrição: Views para formulário e relatório de fundos
-- ============================================================================

-- Drop views se existirem
DROP VIEW IF EXISTS fundo_view CASCADE;
DROP VIEW IF EXISTS fundo_report CASCADE;

-- ============================================================================
-- FUNDO_VIEW: View para formulário (com nomes descritivos das FKs)
-- ============================================================================
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
    f.benchmark,
    f.taxa_administracao,
    f.taxa_performance,
    f.taxa_entrada,
    f.taxa_saida,
    f.possui_come_cotas,
    f.prazo_liquidacao_resgate,
    f.prazo_cotizacao_aplicacao,
    f.prazo_cotizacao_resgate,
    f.carencia_resgate_dias,
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
ORDER BY f.nome_abreviado;

COMMENT ON VIEW fundo_view IS 'View para formulário de fundos com nomes descritivos das entidades relacionadas';

-- ============================================================================
-- FUNDO_REPORT: View para relatórios (campos principais)
-- ============================================================================
CREATE VIEW fundo_report AS
SELECT
    f.id_fundo,
    f.cnpj,
    f.codigo_cvm,
    f.nome_abreviado AS fundo,
    f.tipo_fundo,
    f.classificacao_anbima,
    g.nome_completo AS gestora,
    a.nome_completo AS administradora,
    b.nome_completo AS custodiante,
    f.benchmark,
    f.taxa_administracao,
    f.taxa_performance,
    f.patrimonio_liquido,
    f.numero_cotistas,
    f.cotacao_atual,
    f.data_cotacao_atual,
    f.status
FROM fundo f
LEFT JOIN gestoras g ON f.id_gestora = g.id_gestora
LEFT JOIN administradoras a ON f.id_administradora = a.id_administradora
LEFT JOIN bancos b ON f.id_custodiante = b.id_banco
ORDER BY f.nome_abreviado;

COMMENT ON VIEW fundo_report IS 'View simplificada para relatórios de fundos';

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
