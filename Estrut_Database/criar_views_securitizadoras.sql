-- ============================================
-- CRIAR VIEWS PARA SECURITIZADORAS
-- Execute no DBeaver ou pgAdmin conectado ao database invctl_db
-- ============================================

-- PRIMEIRO: Dropar views existentes para permitir alteração da tabela
DROP VIEW IF EXISTS securitizadora_view CASCADE;
DROP VIEW IF EXISTS securitizadora_report CASCADE;

-- SEGUNDO: Remover colunas da tabela (CASCADE remove as views dependentes)
ALTER TABLE securitizadora DROP COLUMN IF EXISTS historico_inadimplencia CASCADE;
ALTER TABLE securitizadora DROP COLUMN IF EXISTS historico_controversias CASCADE;

-- TERCEIRO: Recriar views sem as colunas removidas

-- VIEW PARA FORMULÁRIOS (sem aliases - nomes originais dos campos)
CREATE OR REPLACE VIEW securitizadora_view AS
SELECT 
    id_securitizadora,
    cnpj,
    nome_completo,
    nome_fantasia,
    codigo_cvm,
    status_operacional,
    capital_social,
    patrimonio_liquido,
    rating_fitch,
    rating_moodys,
    rating_sp,
    rating_nacional,
    data_atualizacao_rating,
    data_inicio_operacao,
    total_emissoes_realizadas,
    volume_total_emitido,
    total_emissoes_ativas,
    especialidade_setor,
    qualidade_originacao,
    observacoes,
    data_cadastro,
    data_ultima_atualizacao
FROM securitizadora
ORDER BY nome_completo;

-- VIEW PARA RELATÓRIOS (com aliases - nomes formatados)
-- Apenas campos essenciais para visualização agrupada
CREATE OR REPLACE VIEW securitizadora_report AS
SELECT 
    cnpj AS "CNPJ",
    nome_completo AS "Nome Completo",
    nome_fantasia AS "Nome Fantasia",
    codigo_cvm AS "Código CVM",
    status_operacional AS "Status",
    patrimonio_liquido AS "Patrimônio Líquido",
    total_emissoes_realizadas AS "Total Emissões",
    volume_total_emitido AS "Volume Emitido",
    especialidade_setor AS "Especialidade"
FROM securitizadora
ORDER BY nome_completo;

-- Verificar
SELECT 'VIEWs de securitizadora criadas com sucesso!' as status;

-- Testar VIEW de formulário (deve retornar campos sem alias)
SELECT * FROM securitizadora_view LIMIT 5;

-- Testar VIEW de relatório (deve retornar campos com aliases formatados)
SELECT * FROM securitizadora_report LIMIT 5;
