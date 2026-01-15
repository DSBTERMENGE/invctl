-- ============================================
-- VIEW UNIFICADA: TODAS AS INSTITUIÇÕES
-- Para popular segunda select do formulário Contatos
-- ============================================

-- ⚠️ ESTA VIEW UNE TODAS AS TABELAS DE INSTITUIÇÕES EM UMA SÓ

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
WHERE COALESCE(ativo, 'S') = 'S'

UNION ALL

-- BANCOS (quando existir)
SELECT 
    2 AS id_tipo_instituicao,
    'banco' AS tipo_instituicao,
    id_banco AS id_instituicao,
    nome_fantasia,
    nome_completo,
    COALESCE(ativo, 'S') AS ativo
FROM banco
WHERE COALESCE(ativo, 'S') = 'S'

UNION ALL

-- GESTORAS (quando existir)
SELECT 
    3 AS id_tipo_instituicao,
    'gestora' AS tipo_instituicao,
    id_gestora AS id_instituicao,
    nome_fantasia,
    nome_completo,
    COALESCE(ativo, 'S') AS ativo
FROM gestora
WHERE COALESCE(ativo, 'S') = 'S'

UNION ALL

-- ADMINISTRADORAS (quando existir)
SELECT 
    4 AS id_tipo_instituicao,
    'administradora' AS tipo_instituicao,
    id_administradora AS id_instituicao,
    nome_fantasia,
    nome_completo,
    COALESCE(ativo, 'S') AS ativo
FROM administradora
WHERE COALESCE(ativo, 'S') = 'S'

UNION ALL

-- SECURITIZADORAS (quando existir)
SELECT 
    5 AS id_tipo_instituicao,
    'securitizadora' AS tipo_instituicao,
    id_securitizadora AS id_instituicao,
    nome_fantasia,
    nome_completo,
    COALESCE(ativo, 'S') AS ativo
FROM securitizadora
WHERE COALESCE(ativo, 'S') = 'S'

UNION ALL

-- CUSTODIANTES (quando existir)
SELECT 
    6 AS id_tipo_instituicao,
    'custodiante' AS tipo_instituicao,
    id_custodiante AS id_instituicao,
    nome_fantasia,
    nome_completo,
    COALESCE(ativo, 'S') AS ativo
FROM custodiante
WHERE COALESCE(ativo, 'S') = 'S';

-- ============================================
-- TESTE DA VIEW
-- ============================================
-- SELECT * FROM instituicoes_view ORDER BY tipo_instituicao, nome_fantasia;
-- SELECT * FROM instituicoes_view WHERE id_tipo_instituicao = 1; -- Só corretoras
