-- =====================================================
-- ADICIONAR TIPOS DE OPERAÇÃO T e O À TABELA
-- INVESTIMENTO_FUNDO
-- =====================================================

-- Script para expandir os tipos de operação permitidos
-- na tabela investimento_fundo, adicionando:
-- T = Come-Cotas (Tributação)
-- O = Outros (Ajustes)

-- Remover constraint antiga
ALTER TABLE investimento_fundo 
DROP CONSTRAINT IF EXISTS investimento_fundo_tipo_operacao_check;

-- Adicionar constraint nova com T e O
ALTER TABLE investimento_fundo 
ADD CONSTRAINT investimento_fundo_tipo_operacao_check 
CHECK (tipo_operacao IN ('D', 'C', 'T', 'O'));

-- Verificar constraint
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'investimento_fundo'::regclass 
  AND conname LIKE '%tipo_operacao%';
