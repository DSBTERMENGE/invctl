-- ============================================================
-- SIMPLIFICAÇÃO TABELA SECURITIZADORAS
-- Remove campos desnecessários e padroniza nomenclatura
-- ============================================================

-- 1. DROP VIEWs que dependem da tabela
DROP VIEW IF EXISTS securitizadoras_view CASCADE;
DROP VIEW IF EXISTS securitizadoras_report CASCADE;

-- 2. ALTER TABLE - Remover campos e renomear
ALTER TABLE securitizadoras 
    DROP COLUMN IF EXISTS qualidade_originacao,
    DROP COLUMN IF EXISTS rating_nacional,
    DROP COLUMN IF EXISTS historico_inadimplencia;

ALTER TABLE securitizadoras 
    RENAME COLUMN status_operacional TO status;

ALTER TABLE securitizadoras 
    ALTER COLUMN cnpj TYPE VARCHAR(18);

-- 3. Recriar VIEWs
CREATE OR REPLACE VIEW securitizadoras_view AS
SELECT 
    id_securitizadora,
    cnpj,
    nome_completo,
    nome_fantasia,
    codigo_cvm,
    status,
    capital_social,
    patrimonio_liquido,
    rating_fitch,
    rating_moodys,
    rating_sp,
    data_atualizacao_rating,
    data_inicio_operacao,
    total_emissoes_realizadas,
    volume_total_emitido,
    total_emissoes_ativas,
    especialidade_setor,
    observacoes,
    data_cadastro,
    data_ultima_atualizacao
FROM securitizadoras
ORDER BY nome_fantasia;

CREATE OR REPLACE VIEW securitizadoras_report AS
SELECT 
    id_securitizadora,
    cnpj,
    nome_completo,
    nome_fantasia,
    codigo_cvm,
    status,
    capital_social,
    patrimonio_liquido,
    rating_fitch,
    rating_moodys,
    rating_sp,
    data_atualizacao_rating,
    data_inicio_operacao,
    total_emissoes_realizadas,
    volume_total_emitido,
    total_emissoes_ativas,
    especialidade_setor,
    observacoes
FROM securitizadoras
ORDER BY nome_fantasia;
