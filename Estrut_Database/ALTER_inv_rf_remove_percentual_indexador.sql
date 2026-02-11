-- ============================================================================
-- ALTERAÇÃO: Remover campo percentual_indexador da tabela inv_rf
-- ============================================================================
-- Data: 08/02/2026
-- Descrição: Remove campo percentual_indexador que não será mais utilizado
--            O indexador será identificado apenas pelo id_indexador com opções:
--            %IPCA, IPCA, IPCA+, %CDI, CDI, CDI+, %SELIC, SELIC, SELIC+, PRE_FIX
-- ============================================================================

-- Remove a coluna percentual_indexador
ALTER TABLE inv_rf DROP COLUMN IF EXISTS percentual_indexador;

-- ============================================================================
-- Recria VIEW inv_rf_view SEM o campo percentual_indexador
-- ============================================================================
DROP VIEW IF EXISTS inv_rf_view CASCADE;

CREATE VIEW inv_rf_view AS
SELECT
    rf.id_inv_rf,
    rf.id_usuario,
    rf.id_tipo_investimento,
    ti.descricao AS tipo_investimento_descricao,
    rf.id_banco_emissor,
    be.nome_completo AS banco_emissor_nome,
    rf.id_corretora,
    cor.nome_completo AS corretora_nome,
    rf.codigo_ativo,
    rf.data_aplicacao,
    rf.data_vencimento,
    rf.data_liquidacao,
    rf.valor_aplicado,
    rf.valor_liquido_aplicado,
    rf.id_indexador,
    idx.descricao AS indexador_descricao,
    rf.taxa_prefixada,
    rf.tipo_rentabilidade,
    rf.liquidez,
    rf.dias_carencia,
    rf.garantia_fgc,
    rf.valor_garantido_fgc,
    rf.periodicidade_cupom,
    rf.taxa_administracao,
    rf.taxa_custodia,
    rf.iof_aplicavel,
    rf.status,
    rf.data_resgate,
    rf.valor_resgate_liquido,
    rf.data_ultima_atualizacao,
    rf.observacoes
FROM inv_rf rf
INNER JOIN tipo_investimento ti ON rf.id_tipo_investimento = ti.id_tipo_investimento
INNER JOIN bancos be ON rf.id_banco_emissor = be.id_banco
INNER JOIN corretoras cor ON rf.id_corretora = cor.id_corretora
INNER JOIN indexador idx ON rf.id_indexador = idx.id_indexador
WHERE ti.codigo NOT IN ('CRI', 'CRA')
ORDER BY rf.data_aplicacao DESC;

-- ============================================================================
-- Recria VIEW inv_rf_report SEM o campo percentual_indexador
-- ============================================================================
DROP VIEW IF EXISTS inv_rf_report CASCADE;

CREATE VIEW inv_rf_report AS
SELECT
    id_inv_rf,
    id_tipo_investimento,
    id_banco_emissor,
    codigo_ativo,
    data_aplicacao,
    data_vencimento,
    valor_aplicado,
    taxa_prefixada,
    status
FROM inv_rf
ORDER BY data_aplicacao DESC;
