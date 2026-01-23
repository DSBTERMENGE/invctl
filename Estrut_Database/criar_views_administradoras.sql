-- ============================================================================
-- VIEWS PARA TABELA ADMINISTRADORAS
-- ============================================================================
-- Data: 16/01/2026
-- Descrição: Views para formulário e relatório de administradoras
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
    id_banco,
    cnpj,
    nome_completo,
    nome_fantasia,
    codigo_cvm,
    status_operacional,
    patrimonio_administrado,
    numero_fundos_administrados,
    data_inicio_operacao,
    possui_certificacao_anbima,
    rating_controles_internos,
    taxa_administracao_padrao,
    taxa_performance_padrao,
    observacoes,
    data_cadastro
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
    codigo_cvm,
    status_operacional,
    patrimonio_administrado,
    numero_fundos_administrados,
    rating_controles_internos
FROM administradoras
ORDER BY nome_completo;
