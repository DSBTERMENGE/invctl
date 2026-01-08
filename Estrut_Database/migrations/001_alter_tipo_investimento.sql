-- ============================================
-- MIGRAÇÃO: Alteração da tabela tipo_investimento
-- Data: 06/01/2026
-- Descrição: 
--   1. Renomear coluna possui_garantia_fgc_padrao para garantia_fgc
--   2. Adicionar coluna obs (observações)
-- ============================================

-- Conectar ao database invctl_db antes de executar
\c invctl_db

-- ============================================
-- ALTERAÇÃO 1: Renomear coluna
-- ============================================
ALTER TABLE tipo_investimento 
RENAME COLUMN possui_garantia_fgc_padrao TO garantia_fgc;

-- ============================================
-- ALTERAÇÃO 2: Adicionar coluna obs
-- ============================================
ALTER TABLE tipo_investimento 
ADD COLUMN obs TEXT;

-- ============================================
-- VERIFICAÇÃO: Mostrar estrutura atualizada
-- ============================================
\d tipo_investimento

-- ============================================
-- RESULTADO ESPERADO:
-- ============================================
-- Coluna: garantia_fgc (renomeada)
-- Coluna: obs (nova)
-- Dados: Preservados (22 registros de tipo_investimento)
-- ============================================
