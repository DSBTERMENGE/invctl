-- ============================================================================
-- ATUALIZAÇÃO: Tabela indexador com novas opções
-- ============================================================================
-- Data: 08/02/2026
-- Descrição: Atualiza tabela indexador com opções padronizadas para renda fixa
--            %IPCA, IPCA, IPCA+, %CDI, CDI, CDI+, %SELIC, SELIC, SELIC+, PRE_FIX
-- ============================================================================

-- Limpa dados existentes (se necessário)
-- TRUNCATE TABLE indexador;

-- Insere novos indexadores padronizados
INSERT INTO indexador (descricao, tipo, observacoes) VALUES
('PRE_FIX', 'Prefixado', 'Investimento com taxa prefixada, sem indexador'),
('%IPCA', 'Híbrido', 'Percentual do IPCA (ex: 80% do IPCA)'),
('IPCA', 'Pós-fixado', 'IPCA puro (variação integral do índice)'),
('IPCA+', 'Híbrido', 'IPCA mais taxa prefixada (ex: IPCA + 6% a.a.)'),
('%CDI', 'Híbrido', 'Percentual do CDI (ex: 102% do CDI)'),
('CDI', 'Pós-fixado', 'CDI puro (variação integral do índice)'),
('CDI+', 'Híbrido', 'CDI mais taxa prefixada (ex: CDI + 2% a.a.)'),
('%SELIC', 'Híbrido', 'Percentual da SELIC (ex: 100% da SELIC)'),
('SELIC', 'Pós-fixado', 'SELIC pura (variação integral da taxa)'),
('SELIC+', 'Híbrido', 'SELIC mais taxa prefixada (ex: SELIC + 1% a.a.)')
ON CONFLICT (descricao) DO NOTHING;

-- Verifica os dados inseridos
SELECT * FROM indexador ORDER BY id_indexador;
