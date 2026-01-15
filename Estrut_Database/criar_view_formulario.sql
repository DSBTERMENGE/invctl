-- ============================================
-- CRIAR VIEW PARA FORMULÁRIO - TIPO INVESTIMENTO
-- Execute no pgAdmin conectado ao database invctl_db
-- ============================================

CREATE OR REPLACE VIEW tipo_investimento_view AS
SELECT 
    id_tipo_investimento,
    codigo,
    descricao,
    classe,
    garantia_fgc,
    ativo,
    obs
FROM tipo_investimento
ORDER BY codigo;

-- Verificar criação
SELECT 'tipo_investimento_view criada com sucesso!' as status;

-- Testar (deve retornar campos SEM alias)
SELECT * FROM tipo_investimento_view LIMIT 3;
