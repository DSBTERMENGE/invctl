-- ============================================================================
-- MIGRAÇÃO: Adicionar DEFAULT 1 para id_usuario em TODAS as tabelas
-- ============================================================================
-- Data: 06/02/2026
-- Descrição: Define id_usuario = 1 como padrão para todas as tabelas de investimentos
--            Solução single-user: backend não precisa gerenciar sessões/autenticação
-- ============================================================================
-- IMPORTANTE: Este é um sistema single-user. Não há controle de sessões no backend.
--             O DEFAULT garante que todos os registros sejam associados ao usuário 1.
-- ============================================================================

-- VERIFICAR ESTRUTURA ATUAL
SELECT 
    table_name,
    column_name,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE column_name = 'id_usuario'
  AND table_schema = 'public'
ORDER BY table_name;

-- ============================================================================
-- APLICAR DEFAULT 1 EM TODAS AS TABELAS COM id_usuario
-- ============================================================================

-- Tabela: inv_rf
ALTER TABLE inv_rf 
ALTER COLUMN id_usuario SET DEFAULT 1;

-- Tabela: inv_cri_cra
ALTER TABLE inv_cri_cra 
ALTER COLUMN id_usuario SET DEFAULT 1;

-- ADICIONE AQUI outras tabelas de investimentos conforme forem criadas:
-- ALTER TABLE inv_acoes ALTER COLUMN id_usuario SET DEFAULT 1;
-- ALTER TABLE inv_fundos ALTER COLUMN id_usuario SET DEFAULT 1;
-- ALTER TABLE inv_tesouro ALTER COLUMN id_usuario SET DEFAULT 1;
-- etc...

-- ============================================================================
-- VERIFICAR ALTERAÇÕES
-- ============================================================================
SELECT 
    table_name,
    column_name,
    column_default,
    is_nullable,
    'DEFAULT APLICADO' as status
FROM information_schema.columns
WHERE column_name = 'id_usuario'
  AND table_schema = 'public'
  AND column_default IS NOT NULL
ORDER BY table_name;

-- ============================================================================
-- NOTAS IMPORTANTES
-- ============================================================================
-- 1. Este DEFAULT só afeta INSERT operations (não SELECT)
-- 2. Backend NÃO precisa enviar id_usuario nas requisições
-- 3. Frontend NÃO deve incluir campo id_usuario nos formulários
-- 4. Quando implementar multi-user no futuro:
--    - Implementar Flask sessions no backend
--    - Modificar backend para extrair id_usuario da sessão autenticada
--    - Backend sobrescreve DEFAULT com valor da sessão no INSERT
--    - NUNCA aceitar id_usuario do frontend (risco de segurança)
-- ============================================================================
