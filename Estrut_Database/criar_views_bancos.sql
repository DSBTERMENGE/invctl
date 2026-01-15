-- ============================================
-- CRIAR VIEWS PARA BANCOS
-- Execute no DBeaver ou pgAdmin conectado ao database invctl_db
-- ============================================

-- VIEW PARA FORMULÁRIOS (sem aliases - nomes originais dos campos)
CREATE OR REPLACE VIEW bancos_view AS
SELECT 
    id_banco,
    codigo_bacen,
    cnpj,
    nome_completo,
    nome_fantasia,
    tipo_instituicao,
    status_operacional,
    data_inicio_operacao,
    capital_social,
    indice_basileia,
    data_atualizacao_basileia,
    rating_fitch,
    rating_moodys,
    rating_sp,
    rating_nacional,
    data_atualizacao_rating,
    possui_garantia_fgc,
    historico_intervencoes,
    observacoes,
    data_cadastro,
    data_ultima_atualizacao
FROM bancos
ORDER BY nome_completo;

-- VIEW PARA RELATÓRIOS (com aliases - nomes formatados)
-- Apenas campos essenciais para visualização agrupada
CREATE OR REPLACE VIEW bancos_report AS
SELECT 
    codigo_bacen AS "Código BACEN",
    cnpj AS "CNPJ",
    nome_completo AS "Nome Completo",
    nome_fantasia AS "Nome Fantasia",
    tipo_instituicao AS "Tipo",
    status_operacional AS "Status",
    indice_basileia AS "Índice Basileia"
FROM bancos
ORDER BY nome_completo;

-- Verificar
SELECT 'VIEWs de bancos criadas com sucesso!' as status;

-- Testar VIEW de formulário (deve retornar campos sem alias)
SELECT * FROM banco_view LIMIT 1;

-- Testar VIEW de relatório (deve retornar campos com alias)
SELECT * FROM banco_report LIMIT 1;
