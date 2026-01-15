-- ============================================
-- DIAGNÓSTICO: INVESTIGAR PROBLEMA DE TABELAS
-- Execute estas queries NO DBEAVER para diagnosticar
-- ============================================

-- ============================================
-- 1️⃣ VERIFICAR CONEXÃO ATUAL
-- ============================================
SELECT current_database() as database_conectado;
SELECT current_schema() as schema_atual;
SELECT current_user as usuario_conectado;
SELECT version() as versao_postgresql;

-- ============================================
-- 2️⃣ LISTAR TODOS OS DATABASES
-- ============================================
SELECT datname as database_name 
FROM pg_database 
WHERE datistemplate = false
ORDER BY datname;

-- ============================================
-- 3️⃣ LISTAR TODOS OS SCHEMAS NO DATABASE ATUAL
-- ============================================
SELECT schema_name 
FROM information_schema.schemata
ORDER BY schema_name;

-- ============================================
-- 4️⃣ LISTAR TODAS AS TABELAS EM TODOS OS SCHEMAS
-- (Esta é a query mais importante!)
-- ============================================
SELECT 
    table_schema as schema,
    table_name as tabela,
    table_type as tipo
FROM information_schema.tables
WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY table_schema, table_name;

-- ============================================
-- 5️⃣ CONTAR TABELAS POR SCHEMA
-- ============================================
SELECT 
    table_schema as schema,
    COUNT(*) as total_tabelas
FROM information_schema.tables
WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
GROUP BY table_schema
ORDER BY total_tabelas DESC;

-- ============================================
-- 6️⃣ BUSCAR ESPECIFICAMENTE AS TABELAS DO INVCTL
-- ============================================
SELECT 
    table_schema as schema,
    table_name as tabela
FROM information_schema.tables
WHERE table_name IN (
    'contatos_instituicao',
    'tipos_instituicao',
    'corretoras',
    'tipo_investimento'
)
ORDER BY table_schema, table_name;

-- ============================================
-- 7️⃣ VERIFICAR SE HÁ TRANSAÇÕES PENDENTES
-- ============================================
SELECT 
    pid,
    usename,
    application_name,
    state,
    query_start,
    state_change,
    query
FROM pg_stat_activity
WHERE datname = current_database()
  AND state != 'idle'
ORDER BY query_start;

-- ============================================
-- 8️⃣ VERIFICAR SEARCH_PATH (ORDEM DE BUSCA DE SCHEMAS)
-- ============================================
SHOW search_path;

-- ============================================
-- 9️⃣ TESTE: CRIAR TABELA TEMPORÁRIA PARA VALIDAR AMBIENTE
-- ============================================
-- DESCOMENTE PARA EXECUTAR:
-- DROP TABLE IF EXISTS teste_diagnostico;
-- CREATE TABLE teste_diagnostico (
--     id SERIAL PRIMARY KEY,
--     mensagem VARCHAR(100),
--     criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
-- INSERT INTO teste_diagnostico (mensagem) VALUES ('Tabela criada com sucesso!');
-- SELECT * FROM teste_diagnostico;

-- ============================================
-- 🔟 VERIFICAR SE TABELA contatos_instituicao EXISTE
-- ============================================
SELECT EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'contatos_instituicao'
) as tabela_existe;

-- ============================================
-- 1️⃣1️⃣ MOSTRAR ESTRUTURA DA TABELA contatos_instituicao (SE EXISTIR)
-- ============================================
SELECT 
    column_name as coluna,
    data_type as tipo,
    character_maximum_length as tamanho,
    is_nullable as permite_null,
    column_default as valor_padrao
FROM information_schema.columns 
WHERE table_schema = 'public'
  AND table_name = 'contatos_instituicao'
ORDER BY ordinal_position;

-- ============================================
-- 1️⃣2️⃣ CONTAR REGISTROS NA TABELA (SE EXISTIR)
-- ============================================
-- DESCOMENTE PARA EXECUTAR:
-- SELECT COUNT(*) as total_registros FROM contatos_instituicao;

-- ============================================
-- 📋 INSTRUÇÕES PARA EXECUTAR:
-- ============================================
-- 1. No DBeaver, selecione a conexão invctl_db
-- 2. Execute cada bloco (Ctrl+Enter) separadamente
-- 3. Anote os resultados de cada query
-- 4. Especial atenção para query #4 (lista todas as tabelas)
-- 5. Verifique se o schema_atual (#1) é 'public'
-- 6. Compare resultado da query #4 com o que aparece na árvore
-- ============================================
