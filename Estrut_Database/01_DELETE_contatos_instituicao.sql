-- ============================================
-- STEP 1: DELETE - Remover estruturas antigas
-- Execute PRIMEIRO este script
-- ============================================

-- Desabilitar verificação de FK temporariamente (se necessário)
SET session_replication_role = 'replica';

-- DROP VIEW (se existir)
DROP VIEW IF EXISTS v_contatos_instituicao CASCADE;
DROP VIEW IF EXISTS view_contatos_instituicao CASCADE;

-- DROP TABELA (CASCADE remove dependências)
DROP TABLE IF EXISTS contatos_instituicao CASCADE;

-- Reabilitar verificação de FK
SET session_replication_role = 'origin';

-- Verificar remoção
SELECT 'Tabela contatos_instituicao DELETADA com sucesso!' as status;
SELECT count(*) as views_restantes 
FROM information_schema.views 
WHERE table_name LIKE '%contatos%';
