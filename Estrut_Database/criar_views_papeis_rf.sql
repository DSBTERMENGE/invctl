-- ============================================================================
-- VIEWS PARA TABELA PAPEIS_RF (Papéis de Renda Fixa)
-- ============================================================================
-- Data: 19/01/2026
-- Descrição: Views para formulário e relatório de papéis de RF
-- ============================================================================

-- Drop views se existirem
DROP VIEW IF EXISTS papeis_rf_view CASCADE;
DROP VIEW IF EXISTS papeis_rf_report CASCADE;

-- ============================================================================
-- PAPEIS_RF_VIEW: View para formulário (com nomes descritivos das FKs)
-- ============================================================================
CREATE VIEW papeis_rf_view AS
SELECT
    p.id_papel_rf,
    p.id_tipo_investimento,
    ti.codigo AS tipo_investimento_texto,           -- Código curto (CDB, LCI)
    ti.descricao AS tipo_investimento_desc,         -- Descrição completa
    p.id_banco_emissor,
    b.nome_completo AS banco_emissor_texto,         -- Nome do banco
    p.id_indexador,
    idx.codigo AS indexador_texto,                  -- Código curto (CDI, IPCA)
    idx.descricao AS indexador_nome,                -- Descrição completa
    p.codigo_ativo,
    p.descricao,
    p.data_emissao,
    p.data_vencimento,
    p.valor_nominal,
    p.taxa_prefixada,
    p.percentual_indexador,
    p.tipo_rentabilidade,
    p.liquidez,
    p.dias_carencia,
    p.garantia_fgc,
    p.valor_garantido_fgc,
    p.periodicidade_cupom,
    p.taxa_administracao,
    p.taxa_custodia,
    p.iof_aplicavel,
    p.ativo,
    p.data_cadastro,
    p.data_inativacao,
    p.observacoes
FROM papeis_rf p
INNER JOIN tipo_investimento ti ON p.id_tipo_investimento = ti.id_tipo_investimento
INNER JOIN bancos b ON p.id_banco_emissor = b.id_banco
INNER JOIN indexador idx ON p.id_indexador = idx.id_indexador
WHERE ti.codigo NOT IN ('CRI', 'CRA')  -- Exclui CRI/CRA
ORDER BY p.codigo_ativo;

-- ============================================================================
-- PAPEIS_RF_REPORT: View para relatórios (campos principais)
-- ============================================================================
CREATE VIEW papeis_rf_report AS
SELECT
    p.id_papel_rf,
    p.codigo_ativo,
    ti.descricao AS tipo,
    b.nome_fantasia AS banco,
    idx.codigo AS indexador,
    p.percentual_indexador,
    p.taxa_prefixada,
    p.data_vencimento,
    p.liquidez,
    p.ativo
FROM papeis_rf p
INNER JOIN tipo_investimento ti ON p.id_tipo_investimento = ti.id_tipo_investimento
INNER JOIN bancos b ON p.id_banco_emissor = b.id_banco
INNER JOIN indexador idx ON p.id_indexador = idx.id_indexador
WHERE ti.codigo NOT IN ('CRI', 'CRA')
ORDER BY p.codigo_ativo;
