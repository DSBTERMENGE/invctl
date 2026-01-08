-- ============================================
-- SCRIPT MASTER - CRIAÇÃO COMPLETA DO BANCO INVCTL
-- Execute ESTE ARQUIVO ÚNICO no pgAdmin4
-- ============================================

-- IMPORTANTE: Execute conectado ao database 'postgres' primeiro
-- para poder criar o database invctl_db

-- Se o database já existir, comente as 3 linhas abaixo:
DROP DATABASE IF EXISTS invctl_db;
CREATE DATABASE invctl_db;
-- Agora reconecte ao database invctl_db e execute o resto

-- ============================================
-- TABELA: ORGAO_REGULADOR
-- ============================================
CREATE TABLE IF NOT EXISTS orgao_regulador (
    id_orgao_regulador SERIAL PRIMARY KEY,
    sigla VARCHAR(20) NOT NULL UNIQUE,
    nome_completo VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    esfera VARCHAR(20) NOT NULL,
    website VARCHAR(255),
    descricao TEXT,
    data_criacao DATE,
    ativo CHAR(1) DEFAULT 'S' CHECK (ativo IN ('S', 'N')),
    observacoes TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABELA: INDEXADOR
-- ============================================
CREATE TABLE IF NOT EXISTS indexador (
    id_indexador SERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    descricao VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    ativo CHAR(1) DEFAULT 'S' CHECK (ativo IN ('S', 'N')),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABELA: TIPO_INVESTIMENTO (COM ALTERAÇÕES)
-- ============================================
CREATE TABLE IF NOT EXISTS tipo_investimento (
    id_tipo_investimento SERIAL PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    descricao VARCHAR(255) NOT NULL,
    classe VARCHAR(30) NOT NULL,
    garantia_fgc CHAR(1) DEFAULT 'N' CHECK (garantia_fgc IN ('S', 'N')),
    ativo CHAR(1) DEFAULT 'S' CHECK (ativo IN ('S', 'N')),
    obs TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABELA: USUARIOS
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(20),
    perfil_investidor VARCHAR(20),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo CHAR(1) DEFAULT 'S' CHECK (ativo IN ('S', 'N'))
);

-- ============================================
-- INSERIR DADOS INICIAIS - INDEXADOR
-- ============================================
INSERT INTO indexador (codigo, descricao, tipo, ativo) VALUES
('CDI', 'Certificado de Depósito Interbancário', 'POS_FIXADO', 'S'),
('SELIC', 'Sistema Especial de Liquidação e de Custódia', 'POS_FIXADO', 'S'),
('IPCA', 'Índice Nacional de Preços ao Consumidor Amplo', 'INFLACAO', 'S'),
('PRE', 'Pré-fixado', 'PRE_FIXADO', 'S')
ON CONFLICT (codigo) DO NOTHING;

-- ============================================
-- INSERIR DADOS INICIAIS - TIPO_INVESTIMENTO
-- ============================================
INSERT INTO tipo_investimento (codigo, descricao, classe, garantia_fgc, ativo) VALUES
('CDB', 'Certificado de Depósito Bancário', 'RENDA_FIXA', 'S', 'S'),
('LCI', 'Letra de Crédito Imobiliário', 'RENDA_FIXA', 'S', 'S'),
('LCA', 'Letra de Crédito do Agronegócio', 'RENDA_FIXA', 'S', 'S'),
('LC', 'Letra de Câmbio', 'RENDA_FIXA', 'S', 'S'),
('CRI', 'Certificado de Recebíveis Imobiliários', 'RENDA_FIXA', 'N', 'S'),
('CRA', 'Certificado de Recebíveis do Agronegócio', 'RENDA_FIXA', 'N', 'S'),
('TESOURO_SELIC', 'Tesouro Selic', 'RENDA_FIXA', 'N', 'S'),
('TESOURO_PREFIXADO', 'Tesouro Prefixado', 'RENDA_FIXA', 'N', 'S'),
('TESOURO_IPCA', 'Tesouro IPCA+', 'RENDA_FIXA', 'N', 'S'),
('ACAO', 'Ação', 'RENDA_VARIAVEL', 'N', 'S'),
('FII', 'Fundo de Investimento Imobiliário', 'RENDA_VARIAVEL', 'N', 'S')
ON CONFLICT (codigo) DO NOTHING;

-- ============================================
-- CRIAR VIEW PARA LOGIN
-- ============================================
CREATE OR REPLACE VIEW usuarios_ativos_view AS
SELECT 
    id_usuario AS id,
    username,
    password_hash,
    cpf,
    nome_completo,
    email,
    ativo
FROM usuarios
WHERE ativo = 'S';

-- ============================================
-- INSERIR USUÁRIO ADMINISTRADOR PADRÃO
-- senha: admin (hash bcrypt)
-- ============================================
INSERT INTO usuarios (username, password_hash, cpf, nome_completo, email, perfil_investidor, ativo) VALUES
('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5ztK6W5zFGvXC', '00000000000', 'Administrador', 'admin@invctl.com', 'MODERADO', 'S')
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- FIM - BANCO CRIADO COM SUCESSO!
-- ============================================
SELECT 'BANCO INVCTL_DB CRIADO COM SUCESSO!' as status;
