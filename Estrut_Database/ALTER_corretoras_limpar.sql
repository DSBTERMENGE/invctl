-- ============================================
-- LIMPEZA DA TABELA CORRETORAS
-- Remove campos desnecessários
-- ============================================

-- 1. DROP VIEWS
DROP VIEW IF EXISTS corretoras_view CASCADE;
DROP VIEW IF EXISTS corretoras_report CASCADE;

-- 2. REMOVER CAMPOS DESNECESSÁRIOS
ALTER TABLE corretoras DROP COLUMN IF EXISTS id_banco;
ALTER TABLE corretoras DROP COLUMN IF EXISTS tipo;
ALTER TABLE corretoras DROP COLUMN IF EXISTS taxa_custodia_renda_variavel;
ALTER TABLE corretoras DROP COLUMN IF EXISTS taxa_corretagem_padrao;
ALTER TABLE corretoras DROP COLUMN IF EXISTS ativo;

-- 3. AJUSTAR TIPO DO CNPJ
ALTER TABLE corretoras ALTER COLUMN cnpj TYPE VARCHAR(18);

-- 4. REMOVER CHECK CONSTRAINTS SE HOUVER
ALTER TABLE corretoras DROP CONSTRAINT IF EXISTS corretora_status_check;
ALTER TABLE corretoras DROP CONSTRAINT IF EXISTS corretora_tipo_check;

-- 5. RECRIAR VIEWS
CREATE OR REPLACE VIEW corretoras_view AS
SELECT
    id_corretora,
    cnpj,
    nome_completo,
    nome_fantasia,
    codigo_cvm,
    status,
    email_insitucional,
    telefone_institucional,
    website,
    observacoes,
    data_cadastro,
    data_ultima_atualizacao
FROM corretoras
ORDER BY nome_completo;

CREATE OR REPLACE VIEW corretoras_report AS
SELECT
    id_corretora,
    cnpj,
    nome_completo,
    nome_fantasia,
    codigo_cvm,
    status,
    email_insitucional,
    telefone_institucional
FROM corretoras
ORDER BY nome_completo;
