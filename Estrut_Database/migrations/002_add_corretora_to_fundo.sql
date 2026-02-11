-- ============================================================================
-- MIGRATION: Adicionar campo id_corretora na tabela fundo
-- ============================================================================
-- Data: 09/02/2026
-- Descrição: Adiciona FK para corretora onde o cliente compra as cotas
-- ============================================================================

\c invctl_db

-- Adicionar coluna id_corretora
ALTER TABLE fundo 
ADD COLUMN id_corretora INTEGER REFERENCES corretoras(id_corretora);

COMMENT ON COLUMN fundo.id_corretora IS 'Corretora onde cliente pode comprar cotas do fundo';

-- Atualizar VIEW fundo_view para incluir corretora
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
LEFT JOIN corretoras c ON f.id_corretora = c.id_corretora
ORDER BY f.nome_abreviado;

COMMENT ON VIEW fundo_view IS 'View para formulário de fundos com nomes descritivos das entidades relacionadas';

-- ============================================================================
-- FIM DA MIGRATION
-- ============================================================================
