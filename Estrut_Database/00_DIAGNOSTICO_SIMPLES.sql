-- ============================================
-- DIAGNÓSTICO SIMPLIFICADO - TUDO EM UMA QUERY
-- ============================================

-- 1️⃣ INFORMAÇÕES DA CONEXÃO
SELECT 
    'CONEXÃO' as tipo,
    current_database() as info,
    'Database conectado' as descricao
UNION ALL
SELECT 
    'CONEXÃO',
    current_schema(),
    'Schema atual'
UNION ALL
SELECT 
    'CONEXÃO',
    current_user,
    'Usuário'
UNION ALL
SELECT 
    'CONEXÃO',
    (SELECT COUNT(*)::text FROM information_schema.tables WHERE table_schema = 'public') as info,
    'Total tabelas no schema public'
ORDER BY descricao;

-- ============================================

-- 2️⃣ LISTAR TODAS AS TABELAS DO SCHEMA PUBLIC
SELECT 
    table_name as tabela,
    table_type as tipo
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- ============================================

-- 3️⃣ BUSCAR TABELAS ESPECÍFICAS
SELECT 
    CASE 
        WHEN table_name = 'contatos_instituicao' THEN '✅ EXISTE'
        ELSE '❌ NÃO EXISTE'
    END as status,
    'contatos_instituicao' as tabela_procurada
FROM information_schema.tables
WHERE table_schema = 'public' 
  AND table_name = 'contatos_instituicao'
UNION ALL
SELECT 
    '❌ NÃO EXISTE',
    'contatos_instituicao'
WHERE NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'contatos_instituicao'
)
UNION ALL
SELECT 
    CASE 
        WHEN table_name = 'tipos_instituicao' THEN '✅ EXISTE'
        ELSE '❌ NÃO EXISTE'
    END,
    'tipos_instituicao'
FROM information_schema.tables
WHERE table_schema = 'public' 
  AND table_name = 'tipos_instituicao'
UNION ALL
SELECT 
    '❌ NÃO EXISTE',
    'tipos_instituicao'
WHERE NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'tipos_instituicao'
)
UNION ALL
SELECT 
    CASE 
        WHEN table_name = 'corretoras' THEN '✅ EXISTE'
        ELSE '❌ NÃO EXISTE'
    END,
    'corretoras'
FROM information_schema.tables
WHERE table_schema = 'public' 
  AND table_name = 'corretoras'
UNION ALL
SELECT 
    '❌ NÃO EXISTE',
    'corretoras'
WHERE NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'corretoras'
)
UNION ALL
SELECT 
    CASE 
        WHEN table_name = 'tipo_investimento' THEN '✅ EXISTE'
        ELSE '❌ NÃO EXISTE'
    END,
    'tipo_investimento'
FROM information_schema.tables
WHERE table_schema = 'public' 
  AND table_name = 'tipo_investimento'
UNION ALL
SELECT 
    '❌ NÃO EXISTE',
    'tipo_investimento'
WHERE NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'tipo_investimento'
);

-- ============================================
-- 📋 INSTRUÇÕES:
-- 1. Execute as 3 queries acima (uma de cada vez)
-- 2. Cada query vai gerar UMA ABA de resultado no DBeaver
-- 3. Copie e cole TODAS as abas de resultado aqui
-- ============================================
