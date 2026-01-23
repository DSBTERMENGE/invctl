-- ============================================================================
-- VIEWS PARA CRI E CRA (da tabela inv_rf)
-- ============================================================================
-- Data: 17/01/2026
-- Descrição: Views específicas para CRI/CRA com securitizadora obrigatória
-- ============================================================================

-- Drop views se existirem
DROP VIEW IF EXISTS inv_cri_cra_view CASCADE;
DROP VIEW IF EXISTS inv_cri_cra_report CASCADE;

-- ============================================================================
-- INV_CRI_CRA_VIEW: View para formulário (filtra CRI/CRA com securitizadora)
-- ============================================================================
CREATE VIEW inv_cri_cra_view AS
SELECT
    rf.id_inv_rf,
    rf.id_usuario,
    rf.id_tipo_investimento,
    ti.descricao AS tipo_investimento_desc,
    rf.id_banco_emissor,
    be.nome_completo AS banco_emissor_nome,
    rf.id_securitizadora,
    sec.nome_completo AS securitizadora_nome,
    rf.id_corretora,
    cor.nome_completo AS corretora_nome,
    rf.codigo_ativo,
    rf.data_aplicacao,
    rf.data_vencimento,
    rf.data_liquidacao,
    rf.valor_aplicado,
    rf.valor_liquido_aplicado,
    rf.id_indexador,
    idx.descricao AS indexador_nome,
    rf.percentual_indexador,
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
INNER JOIN securitizadoras sec ON rf.id_securitizadora = sec.id_securitizadora  -- OBRIGATÓRIO
INNER JOIN corretoras cor ON rf.id_corretora = cor.id_corretora  -- OBRIGATÓRIO
INNER JOIN indexador idx ON rf.id_indexador = idx.id_indexador  -- OBRIGATÓRIO
WHERE ti.codigo IN ('CRI', 'CRA')  -- Filtra apenas CRI e CRA
ORDER BY rf.data_aplicacao DESC;

-- ============================================================================
-- INV_CRI_CRA_REPORT: View para relatórios (campos principais)
-- ============================================================================
CREATE VIEW inv_cri_cra_report AS
SELECT
    rf.id_inv_rf,
    ti.descricao AS tipo,
    sec.nome_completo AS securitizadora,
    rf.codigo_ativo,
    rf.data_aplicacao,
    rf.data_vencimento,
    rf.valor_aplicado,
    rf.taxa_prefixada,
    rf.percentual_indexador,
    rf.status
FROM inv_rf rf
INNER JOIN tipo_investimento ti ON rf.id_tipo_investimento = ti.id_tipo_investimento
INNER JOIN securitizadoras sec ON rf.id_securitizadora = sec.id_securitizadora
WHERE ti.codigo IN ('CRI', 'CRA')
ORDER BY rf.data_aplicacao DESC;
