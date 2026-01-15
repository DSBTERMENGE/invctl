-- Script para criar tipos_instituicao e FK
-- Executar via psql no PowerShell

\c invctl_db

DROP TABLE IF EXISTS tipos_instituicao CASCADE;

CREATE TABLE tipos_instituicao (
    id_tipo_instituicao SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    descricao VARCHAR(50) NOT NULL,
    ativo CHAR(1) DEFAULT 'S' CHECK (ativo IN ('S', 'N')),
    ordem_exibicao INTEGER,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tipos_instituicao (codigo, descricao, ordem_exibicao) VALUES
('corretora', 'Corretora', 1),
('banco', 'Banco', 2),
('gestora', 'Gestora', 3),
('administradora', 'Administradora', 4),
('securitizadora', 'Securitizadora', 5),
('custodiante', 'Custodiante', 6);

ALTER TABLE contatos_instituicao
ADD CONSTRAINT fk_tipo_instituicao 
    FOREIGN KEY (id_tipo_instituicao) 
    REFERENCES tipos_instituicao(id_tipo_instituicao)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;

-- Verificação
SELECT 'Criado com sucesso!' as status;
SELECT * FROM tipos_instituicao;
SELECT constraint_name FROM information_schema.table_constraints 
WHERE table_name = 'contatos_instituicao' AND constraint_type = 'FOREIGN KEY';
