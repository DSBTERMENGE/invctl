-- ============================================
-- MIGRATION: Adicionar campos de contato em corretoras
-- e criar tabela contatos_instituicao
-- Execute no DBeaver conectado ao database invctl_db
-- ============================================

-- 1. Adicionar campos em corretoras
ALTER TABLE corretoras 
ADD COLUMN IF NOT EXISTS email_institucional VARCHAR(255),
ADD COLUMN IF NOT EXISTS telefone_institucional VARCHAR(20),
ADD COLUMN IF NOT EXISTS website VARCHAR(255);

-- 2. Criar tabela de contatos
CREATE TABLE IF NOT EXISTS contatos_instituicao (
    id_contato SERIAL PRIMARY KEY,
    -- FKs para diferentes tipos de instituição (apenas UMA deve estar preenchida)
    id_corretora INTEGER,
    id_banco INTEGER,
    id_gestora INTEGER,
    id_administradora INTEGER,
    id_securitizadora INTEGER,
    -- Dados do contato
    nome_completo VARCHAR(255) NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    funcao VARCHAR(100),
    setor VARCHAR(100),
    email VARCHAR(255),
    telefone VARCHAR(20),
    celular VARCHAR(20),
    ramal VARCHAR(10),
    observacoes TEXT,
    ativo CHAR(1) DEFAULT 'S' CHECK (ativo IN ('S', 'N')),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ultima_atualizacao TIMESTAMP,
    -- Foreign Keys
    FOREIGN KEY (id_corretora) REFERENCES corretoras(id_corretora) ON DELETE CASCADE,
    -- Constraint: apenas UMA instituição por contato
    CHECK (
        (id_corretora IS NOT NULL)::int +
        (id_banco IS NOT NULL)::int +
        (id_gestora IS NOT NULL)::int +
        (id_administradora IS NOT NULL)::int +
        (id_securitizadora IS NOT NULL)::int = 1
    )
);

COMMENT ON TABLE contatos_instituicao IS 'Contatos (pessoas) vinculados a instituições financeiras';
COMMENT ON COLUMN contatos_instituicao.cargo IS 'ASSESSOR, GERENTE, DIRETOR, etc.';

-- 3. Atualizar VIEW de corretoras
CREATE OR REPLACE VIEW corretoras_view AS
SELECT 
    id_corretora,
    cnpj,
    nome_completo,
    nome_fantasia,
    codigo_cvm,
    tipo,
    status_operacional,
    email_institucional,
    telefone_institucional,
    website,
    taxa_custodia_renda_variavel,
    taxa_corretagem_padrao,
    observacoes,
    ativo
FROM corretoras
ORDER BY nome_completo;

-- 4. Verificar
SELECT 'Migration executada com sucesso!' as status;
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'corretoras' AND column_name IN ('email_institucional', 'telefone_institucional', 'website');
SELECT 'Tabela contatos_instituicao criada!' as status FROM information_schema.tables WHERE table_name = 'contatos_instituicao';
