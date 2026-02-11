-- ============================================================================
-- MIGRAÇÃO: Remover id_usuario da tabela inv_rf e recriar view
-- ============================================================================
-- Data: 06/02/2026
-- Descrição: Remove campo id_usuario (single-user system)
-- ============================================================================

-- ============================================================================
-- PASSO 1: Remover Foreign Key e Default
-- ============================================================================
-- Primeiro, precisamos descobrir o nome da constraint FK
SELECT 
    conname AS constraint_name,
    contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'inv_rf'::regclass
  AND contype = 'f';  -- 'f' = foreign key

-- Execute o resultado acima para ver o nome da constraint, depois descomente abaixo:
-- ALTER TABLE inv_rf DROP CONSTRAINT <nome_da_constraint>;

-- ============================================================================
-- PASSO 2: Remover coluna id_usuario
-- ============================================================================
ALTER TABLE inv_rf DROP COLUMN id_usuario;

-- ============================================================================
-- PASSO 3: Recriar VIEW sem id_usuario
-- ============================================================================
DROP VIEW IF EXISTS inv_rf_view CASCADE;

CREATE VIEW inv_rf_view AS
SELECT
    rf.id_inv_rf,
    rf.id_tipo_investimento,
    ti.descricao AS tipo_investimento_desc,
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
INNER JOIN corretoras cor ON rf.id_corretora = cor.id_corretora
INNER JOIN indexador idx ON rf.id_indexador = idx.id_indexador
WHERE ti.codigo NOT IN ('CRI', 'CRA')
ORDER BY rf.data_aplicacao DESC;

-- ============================================================================
-- PASSO 4: Verificar estrutura final
-- ============================================================================
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'inv_rf'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- ============================================================================
-- PASSO 5: Verificar view
-- ============================================================================
SELECT 
    column_name
FROM information_schema.columns
WHERE table_name = 'inv_rf_view'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- ============================================================================
-- TESTE: Inserir registro sem id_usuario
-- ============================================================================
-- INSERT INTO inv_rf (
--     id_tipo_investimento, id_banco_emissor, id_corretora, id_indexador,
--     codigo_ativo, data_aplicacao, data_vencimento, valor_aplicado
-- ) VALUES (
--     1, 1, 1, 4,
--     'TESTE-REMOVE-USER', '2026-02-06', '2027-02-06', 10000.00
-- );

-- SELECT * FROM inv_rf WHERE codigo_ativo = 'TESTE-REMOVE-USER';
-- DELETE FROM inv_rf WHERE codigo_ativo = 'TESTE-REMOVE-USER';

-- ============================================================================
-- NOTAS IMPORTANTES
-- ============================================================================
-- 1. Esta é uma mudança PERMANENTE - não há volta fácil
-- 2. Todos os registros existentes perdem informação de usuário
-- 3. Sistema passa a ser definitivamente single-user
-- 4. Se no futuro precisar multi-user, terá que:
--    - Recriar coluna id_usuario
--    - Popular com valor padrão para registros antigos
--    - Recriar view incluindo id_usuario
--    - Modificar backend para gerenciar sessões
-- ============================================================================
