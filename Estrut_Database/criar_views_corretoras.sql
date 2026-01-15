-- ============================================
-- CRIAR VIEWS PARA CORRETORAS
-- Execute no DBeaver conectado ao database invctl_db
-- ============================================

-- VIEW PARA FORMULÁRIOS (sem aliases - nomes originais dos campos)
CREATE OR REPLACE VIEW corretoras_view AS
SELECT 
    id_corretora,
    cnpj,
    nome_completo,
    nome_fantasia,
    codigo_cvm,
    tipo,
    status_operacional,
    email_insitucional,
    telefone_institucional,
    website,
    taxa_custodia_renda_variavel,
    taxa_corretagem_padrao,
    observacoes,
    ativo
FROM corretoras
ORDER BY nome_completo;

-- VIEW PARA RELATÓRIOS (com aliases - nomes formatados)
-- Apenas campos essenciais para visualização agrupada
CREATE OR REPLACE VIEW corretoras_report AS
SELECT 
    cnpj AS "CNPJ",
    nome_completo AS "Nome Completo",
    nome_fantasia AS "Nome Fantasia",
    codigo_cvm AS "Código CVM",
    tipo AS "Tipo",
    status_operacional AS "Status",
    ativo AS "Ativo"
FROM corretoras
ORDER BY nome_completo;

-- Verificar
SELECT 'VIEWs de corretoras criadas com sucesso!' as status;

-- Testar VIEW de formulário (deve retornar campos sem alias)
SELECT * FROM corretoras_view LIMIT 1;

-- Testar VIEW de relatório (deve retornar campos com alias)
SELECT * FROM corretoras_report LIMIT 1;
