-- =====================================================
-- SIMPLIFICAÇÃO DA TABELA CORRETORAS
-- =====================================================
-- Remove campos desnecessários que variam por produto
-- e não podem ser representados em um único valor

-- 1. Remover colunas desnecessárias
ALTER TABLE corretoras 
DROP COLUMN IF EXISTS taxa_custodia_renda_variavel,
DROP COLUMN IF EXISTS taxa_corretagem_padrao,
DROP COLUMN IF EXISTS tipo,
DROP COLUMN IF EXISTS ativo;

-- 2. Renomear campos para clareza
ALTER TABLE corretoras 
RENAME COLUMN status_operacional TO status;

-- 3. Verificar estrutura final
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'corretoras' 
ORDER BY ordinal_position;

-- ESTRUTURA FINAL:
-- id_corretora (PK)
-- cnpj
-- nome_completo
-- nome_fantasia
-- codigo_cvm
-- status (Em uso / Inativa / Conta encerrada)
-- email_institucional
-- telefone_institucional
-- website
-- observacoes
-- data_cadastro
-- data_ultima_atualizacao
