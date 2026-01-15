-- ============================================
-- VIEW UNIFICADA: TODAS AS INSTITUIÇÕES (VERSÃO SIMPLES)
-- Para popular segunda select do formulário Contatos
-- Apenas com corretoras por enquanto (outras tabelas não existem)
-- ============================================

DROP VIEW IF EXISTS instituicoes_view CASCADE;

CREATE VIEW instituicoes_view AS

-- CORRETORAS
SELECT 
    1 AS id_tipo_instituicao,
    'corretora' AS tipo_instituicao,
    id_corretora AS id_instituicao,
    nome_fantasia,
    nome_completo,
    COALESCE(ativo, 'S') AS ativo
FROM corretoras
WHERE COALESCE(ativo, 'S') = 'S';

-- ============================================
-- COMENTÁRIOS E TESTES
-- ============================================

-- A view retorna:
-- - id_tipo_instituicao: 1 (fixo para corretoras)
-- - tipo_instituicao: 'corretora' (texto descritivo)
-- - id_instituicao: id_corretora (ID específico)
-- - nome_fantasia: nome para exibição na select
-- - nome_completo: nome completo da instituição
-- - ativo: status 'S' ou 'N'

-- TESTE 1: Listar todas as instituições
-- SELECT * FROM instituicoes_view ORDER BY tipo_instituicao, nome_fantasia;

-- TESTE 2: Filtrar só corretoras (o que o framework fará)
-- SELECT * FROM instituicoes_view WHERE id_tipo_instituicao = 1;

-- TESTE 3: Verificar campos retornados
-- SELECT id_tipo_instituicao, id_instituicao, nome_fantasia FROM instituicoes_view;
