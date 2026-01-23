-- ============================================================================
-- VIEWS PARA TABELA GESTORAS
-- ============================================================================
-- Data: 16/01/2026
-- Descrição: Views para formulário e relatório de gestoras
-- ============================================================================

-- Drop views se existirem
DROP VIEW IF EXISTS gestora_view CASCADE;
DROP VIEW IF EXISTS gestora_report CASCADE;

-- ============================================================================
-- GESTORA_VIEW: View para formulário (todos os campos editáveis)
-- ============================================================================
CREATE OR REPLACE VIEW gestora_view AS
SELECT
    id_gestora,
    cnpj,
    nome_completo,
    nome_fantasia,
    codigo_cvm,
    status_operacional,
    patrimonio_sob_gestao,
    data_atualizacao_aum,
    numero_fundos_geridos,
    data_inicio_operacao,
    anos_experiencia_mercado,
    rentabilidade_media_fundos,
    numero_gestores,
    gestor_principal,
    rating_governanca,
    observacoes,
    data_cadastro
FROM gestora
ORDER BY nome_completo;

-- ============================================================================
-- GESTORA_REPORT: View para relatórios (campos principais)
-- ============================================================================
CREATE OR REPLACE VIEW gestoras_report AS
SELECT
    id_gestora,
    cnpj,
    nome_completo,
    codigo_cvm,
    status_operacional,
    patrimonio_sob_gestao,
    numero_fundos_geridos,
    rentabilidade_media_fundos,
    rating_governanca
FROM gestoras
ORDER BY nome_completo;
