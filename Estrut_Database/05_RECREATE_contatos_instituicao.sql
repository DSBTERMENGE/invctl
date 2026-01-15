-- ============================================
-- RECRIAR: CONTATOS COM FK PARA TIPOS
-- Execute DEPOIS de deletar a tabela antiga
-- ============================================

CREATE TABLE contatos_instituicao (
    id_contato SERIAL PRIMARY KEY,
    
    -- 🎯 CAMPOS CHAVE COM FK
    id_tipo_instituicao INTEGER NOT NULL REFERENCES tipos_instituicao(id_tipo_instituicao),
    id_instituicao INTEGER NOT NULL,
    
    -- 👤 DADOS DO CONTATO
    nome_completo VARCHAR(255) NOT NULL,
    cargo VARCHAR(50),
    funcao VARCHAR(100),
    setor VARCHAR(100),
    
    -- 📞 CONTATOS
    email VARCHAR(255),
    telefone VARCHAR(20),
    celular VARCHAR(20),
    ramal VARCHAR(10),
    
    -- 📝 OBSERVAÇÕES E STATUS
    observacoes TEXT,
    ativo CHAR(1) DEFAULT 'S' CHECK (ativo IN ('S', 'N')),
    
    -- 📅 AUDITORIA
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_ultima_atualizacao TIMESTAMP,
    
    -- 🔍 CONSTRAINT ÚNICO
    CONSTRAINT uk_contato_instituicao UNIQUE (id_tipo_instituicao, id_instituicao, nome_completo)
);

-- 📋 ÍNDICES
CREATE INDEX idx_contatos_tipo ON contatos_instituicao(id_tipo_instituicao);
CREATE INDEX idx_contatos_instituicao_id ON contatos_instituicao(id_instituicao);
CREATE INDEX idx_contatos_tipo_inst ON contatos_instituicao(id_tipo_instituicao, id_instituicao);
CREATE INDEX idx_contatos_cargo ON contatos_instituicao(cargo);
CREATE INDEX idx_contatos_ativo ON contatos_instituicao(ativo);

-- 📝 COMENTÁRIOS
COMMENT ON TABLE contatos_instituicao IS 
'Contatos vinculados a instituições - usa FK para tipos_instituicao';

COMMENT ON COLUMN contatos_instituicao.id_tipo_instituicao IS 
'FK para tipos_instituicao - define se é corretora, banco, etc';

COMMENT ON COLUMN contatos_instituicao.id_instituicao IS 
'ID genérico - referencia id_corretora, id_banco, etc conforme tipo';

-- Verificação
SELECT 'Tabela contatos_instituicao recriada com sucesso!' as status;
