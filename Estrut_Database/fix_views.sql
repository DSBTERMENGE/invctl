-- ============================================
-- SCRIPT PARA CORRIGIR VIEWS - INVCTL
-- Execute no pgAdmin conectado ao database invctl_db
-- ============================================

-- VIEW PARA FORMULÁRIOS (sem aliases - nomes originais dos campos)
-- Padrão: nome_tabela_view
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

-- VIEW PARA RELATÓRIOS (com aliases - nomes formatados)
-- Padrão: nome_tabela_report
CREATE OR REPLACE VIEW tipo_investimento_report AS
SELECT 
    codigo AS "Código",
    descricao AS "Descrição",
    classe AS "Classe",
    garantia_fgc AS "FGC",
    ativo AS "Ativo",
    obs AS "Obs"
FROM tipo_investimento
ORDER BY codigo;

-- Verificar se as VIEWs foram criadas corretamente
SELECT 'tipo_investimento_view criada com sucesso!' as status;
SELECT 'tipo_investimento_report criada com sucesso!' as status;

-- Testar VIEW de formulário (deve retornar campos sem alias)
SELECT * FROM tipo_investimento_view LIMIT 1;

-- Testar VIEW de relatório (deve retornar campos com alias)
SELECT * FROM tipo_investimento_report LIMIT 1;
