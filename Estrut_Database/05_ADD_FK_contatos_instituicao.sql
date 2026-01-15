-- ============================================
-- STEP 5: ADICIONAR FOREIGN KEY FALTANTE
-- Correção para contatos_instituicao
-- ============================================

-- ⚠️ Execute este script SOMENTE se a FK não foi criada no script anterior

-- ============================================
-- VERIFICAR SE FK JÁ EXISTE (não executar se já existe)
-- ============================================
-- SELECT constraint_name 
-- FROM information_schema.table_constraints 
-- WHERE table_name = 'contatos_instituicao' 
-- AND constraint_name = 'fk_tipo_instituicao';

-- ============================================
-- ADICIONAR FOREIGN KEY
-- ============================================
ALTER TABLE contatos_instituicao
ADD CONSTRAINT fk_tipo_instituicao 
    FOREIGN KEY (id_tipo_instituicao) 
    REFERENCES tipos_instituicao(id_tipo_instituicao)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;

-- ============================================
-- COMMIT EXPLÍCITO
-- ============================================
COMMIT;

-- ============================================
-- VERIFICAÇÃO
-- ============================================
SELECT 'FK fk_tipo_instituicao adicionada com sucesso!' as status;

-- Listar todas as constraints
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'contatos_instituicao'
ORDER BY constraint_type, constraint_name;
