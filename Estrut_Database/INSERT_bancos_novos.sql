-- ============================================
-- INSERT NOVOS BANCOS
-- Data: 15/02/2026
-- Bancos: C6 Consignado, Will, Master, Bocom
-- ============================================

-- BANCO C6 CONSIGNADO
INSERT INTO bancos (
    codigo_bacen,
    cnpj,
    nome_completo,
    nome_fantasia,
    tipo_instituicao,
    status,
    data_inicio_operacao,
    capital_social,
    indice_basileia,
    data_atualizacao_basileia,
    rating_fitch,
    rating_moodys,
    rating_sp,
    data_atualizacao_rating,
    historico_intervencoes,
    observacoes,
    data_cadastro,
    usuario_cadastro
) VALUES (
    '626',
    '61348538000186',
    'BANCO C6 CONSIGNADO S.A.',
    'Banco C6 Consignado',
    'Banco Múltiplo',
    'ATIVO',
    '1966-07-20',
    2764877142.00,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'Especializado em crédito consignado. Filial do C6 Bank. TEM FGC.',
    CURRENT_TIMESTAMP,
    'SISTEMA'
);

-- Verificar inserção
SELECT 
    codigo_bacen, 
    nome_completo, 
    nome_fantasia, 
    status
FROM bancos 
WHERE codigo_bacen = '626';

-- BANCO WILL (438) - ⚠️ EM LIQUIDAÇÃO
INSERT INTO bancos (
    codigo_bacen,
    cnpj,
    nome_completo,
    nome_fantasia,
    tipo_instituicao,
    status,
    data_inicio_operacao,
    capital_social,
    indice_basileia,
    data_atualizacao_basileia,
    rating_fitch,
    rating_moodys,
    rating_sp,
    data_atualizacao_rating,
    historico_intervencoes,
    observacoes,
    data_cadastro,
    usuario_cadastro
) VALUES (
    '438',
    '23862762000100',
    'WILL FINANCEIRA S.A. CRÉDITO FINANCIAMENTO E INVESTIMENTO',
    'Banco Will',
    'Sociedade de Crédito Direto',
    'LIQUIDACAO',
    '2020-10-15',
    250000000.00,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'Liquidação extrajudicial decretada pelo BCB em 21/01/2026',
    'Carteiras de crédito transferidas para BRB. Clientes reportam problemas com dívidas no SCR. SEM FGC.',
    CURRENT_TIMESTAMP,
    'SISTEMA'
);

-- BANCO MASTER (247) - ⚠️ EM LIQUIDAÇÃO
INSERT INTO bancos (
    codigo_bacen,
    cnpj,
    nome_completo,
    nome_fantasia,
    tipo_instituicao,
    status,
    data_inicio_operacao,
    capital_social,
    indice_basileia,
    data_atualizacao_basileia,
    rating_fitch,
    rating_moodys,
    rating_sp,
    data_atualizacao_rating,
    historico_intervencoes,
    observacoes,
    data_cadastro,
    usuario_cadastro
) VALUES (
    '247',
    '60741390000144',
    'BANCO MASTER S.A. - CFI',
    'Banco Master',
    'Banco Múltiplo',
    'LIQUIDACAO',
    '1992-06-12',
    800000000.00,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'Liquidação extrajudicial pelo BCB. Investigação PF por fraudes em carteiras de crédito.',
    'Carteiras vendidas para BRB (R$12bi). Problemas com registros SCR. TEM FGC mas em liquidação.',
    CURRENT_TIMESTAMP,
    'SISTEMA'
);

-- BANCO BOCOM BBM (253) - ✓ ATIVO
INSERT INTO bancos (
    codigo_bacen,
    cnpj,
    nome_completo,
    nome_fantasia,
    tipo_instituicao,
    status,
    data_inicio_operacao,
    capital_social,
    indice_basileia,
    data_atualizacao_basileia,
    rating_fitch,
    rating_moodys,
    rating_sp,
    data_atualizacao_rating,
    historico_intervencoes,
    observacoes,
    data_cadastro,
    usuario_cadastro
) VALUES (
    '253',
    '50831390000192',
    'BANCO BOCOM BBM S.A.',
    'Banco Bocom BBM',
    'Banco Múltiplo',
    'ATIVO',
    '1971-09-30',
    4500000000.00,
    14.85,
    '2025-12-31',
    'BB',
    NULL,
    NULL,
    '2025-11-15',
    NULL,
    'Formado pela fusão Bocom e BBM. Foco corporate/wholesale. TEM FGC. Rating nacional: brBBB.',
    CURRENT_TIMESTAMP,
    'SISTEMA'
);

-- Verificar todas as inserções
SELECT 
    codigo_bacen, 
    nome_fantasia, 
    status,
    indice_basileia
FROM bancos 
WHERE codigo_bacen IN ('626', '438', '247', '253')
ORDER BY codigo_bacen;

-- ============================================
-- ⚠️ ALERTAS IMPORTANTES:
-- ============================================
-- 1. BANCO WILL (438): 
--    - Status: LIQUIDAÇÃO desde 21/01/2026
--    - SEM GARANTIA FGC (possui_garantia_fgc = 'N')
--    - NÃO RECOMENDADO para novos investimentos
--
-- 2. BANCO MASTER (247):
--    - Status: LIQUIDAÇÃO
--    - Investigação PF por fraudes
--    - TEM FGC mas em liquidação
--    - NÃO RECOMENDADO para novos investimentos
--
-- 3. C6 CONSIGNADO (626):
--    - Status: ATIVO
--    - TEM FGC
--    - Basileia: PENDENTE pesquisa
--
-- 4. BOCOM BBM (253):
--    - Status: ATIVO ✓
--    - TEM FGC ✓
--    - Basileia: 14.85% ✓
--    - Ratings: BB (Fitch), brBBB (nacional) ✓
--    - ÚNICO TOTALMENTE ADEQUADO para novos papéis
-- ============================================
