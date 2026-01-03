-- ============================================
-- Script: Dados Iniciais (Seed Data)
-- Data: 03/01/2026
-- Autor: David
-- Descrição: Popula tabelas de domínio com dados
--            iniciais necessários para o sistema
-- ============================================

-- ============================================
-- SEED DATA - ORGAO_REGULADOR
-- ============================================
INSERT INTO orgao_regulador (sigla, nome_completo, tipo, esfera, website, descricao, data_criacao, ativo) VALUES
('BACEN', 'Banco Central do Brasil', 'REGULADOR', 'FEDERAL', 'https://www.bcb.gov.br', 'Autarquia federal responsável pela regulação e supervisão do sistema financeiro nacional', '1964-12-31', 'S'),
('CVM', 'Comissão de Valores Mobiliários', 'REGULADOR', 'FEDERAL', 'https://www.gov.br/cvm', 'Autarquia federal responsável pela regulação e fiscalização do mercado de valores mobiliários', '1976-12-07', 'S'),
('ANBIMA', 'Associação Brasileira das Entidades dos Mercados Financeiro e de Capitais', 'AUTORREGULADOR', 'PRIVADO', 'https://www.anbima.com.br', 'Entidade autorreguladora que representa instituições do mercado financeiro e de capitais', '2009-10-21', 'S'),
('B3', 'Brasil, Bolsa, Balcão', 'INFRAESTRUTURA', 'PRIVADO', 'https://www.b3.com.br', 'Bolsa de valores, mercadorias e futuros do Brasil', '2017-03-30', 'S'),
('PREVIC', 'Superintendência Nacional de Previdência Complementar', 'REGULADOR', 'FEDERAL', 'https://www.gov.br/previc', 'Autarquia federal responsável pela fiscalização e supervisão das entidades de previdência complementar', '2009-05-04', 'S'),
('SUSEP', 'Superintendência de Seguros Privados', 'REGULADOR', 'FEDERAL', 'https://www.gov.br/susep', 'Autarquia federal responsável pela fiscalização dos mercados de seguro, previdência complementar aberta, capitalização e resseguro', '1966-11-21', 'S'),
('CMN', 'Conselho Monetário Nacional', 'REGULADOR', 'FEDERAL', NULL, 'Órgão normativo máximo do Sistema Financeiro Nacional', '1964-12-31', 'S');

-- ============================================
-- SEED DATA - INDEXADOR
-- ============================================
INSERT INTO indexador (codigo, descricao, tipo, ativo) VALUES
('CDI', 'Certificado de Depósito Interbancário', 'POS_FIXADO', 'S'),
('SELIC', 'Sistema Especial de Liquidação e de Custódia', 'POS_FIXADO', 'S'),
('IPCA', 'Índice Nacional de Preços ao Consumidor Amplo', 'INFLACAO', 'S'),
('PRE', 'Pré-fixado', 'PRE_FIXADO', 'S'),
('IGPM', 'Índice Geral de Preços do Mercado', 'INFLACAO', 'S'),
('INPC', 'Índice Nacional de Preços ao Consumidor', 'INFLACAO', 'S'),
('TR', 'Taxa Referencial', 'POS_FIXADO', 'S'),
('IPCA+', 'IPCA + Taxa Prefixada', 'HIBRIDO', 'S'),
('CDI+', 'CDI + Spread', 'HIBRIDO', 'S');

-- ============================================
-- SEED DATA - TIPO_INVESTIMENTO
-- ============================================
INSERT INTO tipo_investimento (codigo, descricao, classe, possui_garantia_fgc_padrao, ativo) VALUES
-- Renda Fixa - Banco
('CDB', 'Certificado de Depósito Bancário', 'RENDA_FIXA', 'S', 'S'),
('LCI', 'Letra de Crédito Imobiliário', 'RENDA_FIXA', 'S', 'S'),
('LCA', 'Letra de Crédito do Agronegócio', 'RENDA_FIXA', 'S', 'S'),
('LC', 'Letra de Câmbio', 'RENDA_FIXA', 'S', 'S'),

-- Renda Fixa - Securitizadora
('CRI', 'Certificado de Recebíveis Imobiliários', 'RENDA_FIXA', 'N', 'S'),
('CRA', 'Certificado de Recebíveis do Agronegócio', 'RENDA_FIXA', 'N', 'S'),

-- Tesouro Direto
('TESOURO_SELIC', 'Tesouro Selic', 'RENDA_FIXA', 'N', 'S'),
('TESOURO_PREFIXADO', 'Tesouro Prefixado', 'RENDA_FIXA', 'N', 'S'),
('TESOURO_IPCA', 'Tesouro IPCA+', 'RENDA_FIXA', 'N', 'S'),
('TESOURO_PREFIXADO_JUROS', 'Tesouro Prefixado com Juros Semestrais', 'RENDA_FIXA', 'N', 'S'),
('TESOURO_IPCA_JUROS', 'Tesouro IPCA+ com Juros Semestrais', 'RENDA_FIXA', 'N', 'S'),

-- Renda Variável
('ACAO', 'Ação', 'RENDA_VARIAVEL', 'N', 'S'),
('FII', 'Fundo de Investimento Imobiliário', 'RENDA_VARIAVEL', 'N', 'S'),
('FIAGRO', 'Fundo de Investimento em Cadeias Agroindustriais', 'RENDA_VARIAVEL', 'N', 'S'),
('FI_INFRA', 'Fundo de Investimento em Infraestrutura', 'RENDA_VARIAVEL', 'N', 'S'),
('ETF', 'Exchange Traded Fund', 'RENDA_VARIAVEL', 'N', 'S'),
('BDR', 'Brazilian Depositary Receipt', 'RENDA_VARIAVEL', 'N', 'S'),

-- Fundos
('FUNDO_RF', 'Fundo de Renda Fixa', 'FUNDO', 'N', 'S'),
('FUNDO_MULTIMERCADO', 'Fundo Multimercado', 'FUNDO', 'N', 'S'),
('FUNDO_ACOES', 'Fundo de Ações', 'FUNDO', 'N', 'S'),
('FUNDO_CAMBIAL', 'Fundo Cambial', 'FUNDO', 'N', 'S'),
('FUNDO_PREVIDENCIA', 'Fundo de Previdência', 'FUNDO', 'N', 'S');

-- ============================================
-- SEED DATA - TIPO_FUNDO
-- ============================================
INSERT INTO tipo_fundo (codigo, descricao, classe_principal, subclasse, permite_alavancagem, tem_tributacao_especial, descricao_estrategia, publico_alvo_padrao, benchmark_comum, perfil_risco, ativo) VALUES
-- Renda Fixa
('RF_CP', 'Renda Fixa Curto Prazo', 'RENDA_FIXA', 'Renda Fixa - Curto Prazo', 'N', 'S', 'Investe em títulos de renda fixa de curto prazo', 'VAREJO', 'CDI', 'CONSERVADOR', 'S'),
('RF_LP', 'Renda Fixa Longo Prazo', 'RENDA_FIXA', 'Renda Fixa - Longo Prazo', 'N', 'S', 'Investe em títulos de renda fixa de médio e longo prazo', 'VAREJO', 'IMA-B', 'MODERADO', 'S'),
('RF_REF_DI', 'Renda Fixa Referenciado DI', 'RENDA_FIXA', 'Renda Fixa - Referenciado DI', 'N', 'N', 'Busca acompanhar a variação do CDI', 'VAREJO', 'CDI', 'CONSERVADOR', 'S'),
('RF_DURACAO_ALTA', 'Renda Fixa Duração Alta', 'RENDA_FIXA', 'Renda Fixa - Duração Alta Grau de Investimento', 'N', 'S', 'Investe em títulos públicos de longo prazo', 'QUALIFICADO', 'IMA-B 5+', 'MODERADO', 'S'),
('RF_CREDITO_PRIVADO', 'Renda Fixa Crédito Privado', 'RENDA_FIXA', 'Renda Fixa - Crédito Privado', 'N', 'S', 'Investe em títulos de crédito privado', 'QUALIFICADO', 'IDkA', 'MODERADO', 'S'),

-- Multimercado
('MM_MACRO', 'Multimercado Macro', 'MULTIMERCADO', 'Multimercado - Macro', 'S', 'N', 'Estratégia baseada em cenários macroeconômicos', 'QUALIFICADO', 'CDI', 'AGRESSIVO', 'S'),
('MM_LIVRE', 'Multimercado Livre', 'MULTIMERCADO', 'Multimercado - Livre', 'S', 'N', 'Estratégia livre sem compromisso com benchmark', 'QUALIFICADO', 'CDI', 'AGRESSIVO', 'S'),
('MM_JUROS_MOEDAS', 'Multimercado Juros e Moedas', 'MULTIMERCADO', 'Multimercado - Juros e Moedas', 'S', 'N', 'Foca em operações com juros e câmbio', 'QUALIFICADO', 'CDI', 'AGRESSIVO', 'S'),
('MM_LONG_SHORT', 'Multimercado Long and Short', 'MULTIMERCADO', 'Multimercado - Long and Short', 'S', 'N', 'Estratégia long and short em diversos ativos', 'PROFISSIONAL', 'CDI', 'AGRESSIVO', 'S'),
('MM_BALANCEADO', 'Multimercado Balanceado', 'MULTIMERCADO', 'Multimercado - Balanceado', 'N', 'N', 'Diversifica entre renda fixa e variável', 'VAREJO', 'CDI', 'MODERADO', 'S'),

-- Ações
('AC_LIVRE', 'Ações Livre', 'ACOES', 'Ações - Livre', 'S', 'N', 'Estratégia livre de seleção de ações', 'VAREJO', 'IBOVESPA', 'AGRESSIVO', 'S'),
('AC_IBOVESPA_ATIVO', 'Ações Ibovespa Ativo', 'ACOES', 'Ações - Ibovespa Ativo', 'N', 'N', 'Busca superar o Ibovespa', 'VAREJO', 'IBOVESPA', 'AGRESSIVO', 'S'),
('AC_IBOVESPA_PASSIVO', 'Ações Ibovespa Passivo', 'ACOES', 'Ações - Ibovespa Passivo', 'N', 'N', 'Replica o Ibovespa', 'VAREJO', 'IBOVESPA', 'AGRESSIVO', 'S'),
('AC_DIVIDENDOS', 'Ações Dividendos', 'ACOES', 'Ações - Dividendos', 'N', 'N', 'Foca em ações com bom histórico de dividendos', 'VAREJO', 'IDIV', 'MODERADO', 'S'),
('AC_SMALL_CAPS', 'Ações Small Caps', 'ACOES', 'Ações - Small Caps', 'N', 'N', 'Investe em ações de empresas de menor capitalização', 'QUALIFICADO', 'SMLL', 'AGRESSIVO', 'S'),
('AC_VALUE', 'Ações Value', 'ACOES', 'Ações - Value', 'N', 'N', 'Estratégia de investimento em valor', 'QUALIFICADO', 'IBOVESPA', 'AGRESSIVO', 'S'),
('AC_GROWTH', 'Ações Growth', 'ACOES', 'Ações - Growth', 'N', 'N', 'Foca em empresas de crescimento', 'QUALIFICADO', 'IBOVESPA', 'AGRESSIVO', 'S'),

-- Cambial
('CAMBIAL', 'Cambial', 'CAMBIAL', 'Cambial', 'N', 'N', 'Investe em ativos atrelados à variação cambial', 'VAREJO', 'Dólar', 'MODERADO', 'S'),

-- ETF
('ETF_RENDA_FIXA', 'ETF Renda Fixa', 'ETF', 'ETF - Renda Fixa', 'N', 'N', 'ETF que replica índice de renda fixa', 'VAREJO', 'IMA-B', 'CONSERVADOR', 'S'),
('ETF_ACOES', 'ETF Ações', 'ETF', 'ETF - Ações', 'N', 'N', 'ETF que replica índice de ações', 'VAREJO', 'IBOVESPA', 'AGRESSIVO', 'S'),
('ETF_INTERNACIONAL', 'ETF Internacional', 'ETF', 'ETF - Internacional', 'N', 'N', 'ETF que replica índice internacional', 'VAREJO', 'S&P 500', 'AGRESSIVO', 'S'),

-- Previdência
('PREVIDENCIA_RF', 'Previdência Renda Fixa', 'PREVIDENCIA', 'Previdência - Renda Fixa', 'N', 'S', 'Fundo de previdência focado em renda fixa', 'VAREJO', 'CDI', 'CONSERVADOR', 'S'),
('PREVIDENCIA_BALANCEADO', 'Previdência Balanceado', 'PREVIDENCIA', 'Previdência - Balanceado', 'N', 'S', 'Fundo de previdência diversificado', 'VAREJO', 'CDI', 'MODERADO', 'S'),
('PREVIDENCIA_ACOES', 'Previdência Ações', 'PREVIDENCIA', 'Previdência - Ações', 'N', 'S', 'Fundo de previdência focado em ações', 'VAREJO', 'IBOVESPA', 'AGRESSIVO', 'S');

-- ============================================
-- Mensagem Final
-- ============================================
-- Dados iniciais carregados com sucesso!
-- Total de registros:
--   - ORGAO_REGULADOR: 7
--   - INDEXADOR: 9
--   - TIPO_INVESTIMENTO: 22
--   - TIPO_FUNDO: 26
-- ============================================

-- ============================================
-- Fim do Script 11
-- ============================================
