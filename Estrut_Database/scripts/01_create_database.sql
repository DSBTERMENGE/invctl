-- ============================================
-- Script: Criação do Database InvCtl
-- Data: 03/01/2026
-- Autor: David
-- Descrição: Cria o database invctl_db com 
--            encoding UTF-8 e locale pt_BR
-- ============================================

-- Conectar como superusuário (postgres) antes de executar

-- Criar database
CREATE DATABASE invctl_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'pt_BR.UTF-8'
    LC_CTYPE = 'pt_BR.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    TEMPLATE template0;

COMMENT ON DATABASE invctl_db IS 
'Banco de dados para controle e acompanhamento de investimentos financeiros';

-- ============================================
-- OPCIONAL: Criar usuário específico
-- ============================================
-- Descomentar e ajustar senha se desejar criar usuário dedicado
/*
CREATE USER invctl_user WITH PASSWORD 'sua_senha_segura_aqui';
GRANT ALL PRIVILEGES ON DATABASE invctl_db TO invctl_user;
ALTER DATABASE invctl_db OWNER TO invctl_user;
*/

-- ============================================
-- Instruções de uso:
-- ============================================
-- 1. Conectar como superusuário:
--    psql -U postgres
--
-- 2. Executar este script:
--    \i caminho/para/01_create_database.sql
--
-- 3. Conectar ao novo database:
--    \c invctl_db
--
-- 4. Executar demais scripts de criação
-- ============================================
