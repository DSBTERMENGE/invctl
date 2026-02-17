-- ============================================================================
-- VIEWS PARA TABELA ADMINISTRADORAS
-- ============================================================================
-- Data: 12/02/2026
-- Descrição: Views para formulário e relatório de administradoras (12 campos)
-- ============================================================================

-- Drop views se existirem
DROP VIEW IF EXISTS administradoras_view CASCADE;
DROP VIEW IF EXISTS administradoras_report CASCADE;

-- ============================================================================
-- ADMINISTRADORAS_VIEW: View para formulário (todos os campos editáveis)
-- ============================================================================
CREATE OR REPLACE VIEW administradoras_view AS
SELECT
    id_administradora,
    cnpj,
    nome_completo,
    nome_fantasia,
    codigo_cvm,
    status,
    patrimonio_administrado,
    numero_fundos_administrados,
    data_inicio_operacao,
    possui_certificacao_anbima,
    rating_controles_internos,
    data_cadastro,
    observacoes
FROM administradoras
ORDER BY nome_completo;

-- ============================================================================
-- ADMINISTRADORAS_REPORT: View para relatórios (campos principais)
-- ============================================================================
CREATE OR REPLACE VIEW administradoras_report AS
SELECT
    id_administradora,
    cnpj,
    nome_completo,
    nome_fantasia,
    codigo_cvm,
    status,
    patrimonio_administrado,
    numero_fundos_administrados,
    data_inicio_operacao,
    possui_certificacao_anbima,
    rating_controles_internos,
    data_cadastro,
    observacoes
FROM administradoras
ORDER BY patrimonio_administrado DESC NULLS LAST;
