-- ============================================
-- INSERT CORRETORAS - 10 REGISTROS
-- ============================================

INSERT INTO corretoras (
    cnpj,
    nome_completo,
    nome_fantasia,
    codigo_cvm,
    status,
    email_insitucional,
    telefone_institucional,
    website,
    observacoes
) VALUES
-- 1. Ágora Investimentos
(
    '02179489000115',
    'Banco Bradesco Corretora de Títulos e Valores Mobiliários S.A.',
    'Ágora Investimentos',
    '0117',
    'Ativa',
    'agora@agora.bradesco.com.br',
    '(11) 3017-9111',
    'https://www.agorainvestimentos.com.br',
    'Bradesco backing, home broker pioneiro'
),
-- 2. Banco Inter
(
    '02885968000196',
    'Banco Inter S.A.',
    'Banco Inter',
    '4750',
    'Ativa',
    'invest@inter.co',
    '(31) 3003-4070',
    'https://www.inter.co/investimentos',
    '0% corretagem ações, app completo'
),
-- 3. Clear
(
    '50027269000170',
    'Clear Corretora de Valores S.A.',
    'Clear',
    '4335',
    'Ativa',
    'contato@clear.com.br',
    '(11) 4004-5962',
    'https://www.clear.com.br',
    'XP grupo, day trade líder'
),
-- 4. Rico Investimentos
(
    '02231577000185',
    'Rico Corretora de Títulos e Valores Mobiliários S.A.',
    'Rico Investimentos',
    '0358',
    'Ativa',
    'rico@rico.com.vc',
    '(11) 4000-8747',
    'https://www.rico.com.vc',
    'XP grupo, iniciantes'
),
-- 5. Genial Investimentos
(
    '10826997000186',
    'Genial Investimentos Corretora de Títulos e Valores Mobiliários S.A.',
    'Genial Investimentos',
    '0450',
    'Ativa',
    'atendimento@genialinvestimentos.com.br',
    '(11) 3003-2804',
    'https://www.genialinvestimentos.com.br',
    'Assessores fortes'
),
-- 6. Nubank
(
    '62118253000192',
    'Nu Investimentos Corretora de Títulos e Valores Mobiliários S.A.',
    'Nubank',
    '5109',
    'Ativa',
    'invest@nu.com.br',
    NULL,
    'https://nubank.com.br/investimentos',
    'App Nubank integrado'
),
-- 7. Guide Investimentos
(
    '04360590000107',
    'Guide Investimentos Corretora de Valores S.A.',
    'Guide Investimentos',
    '0119',
    'Ativa',
    'contato@guide.com.br',
    '(11) 3372-7100',
    'https://www.guide.com.br',
    'Alta renda'
),
-- 8. C6 Bank
(
    '19049289000144',
    'C6 Corretora de Títulos e Valores Mobiliários Ltda.',
    'C6 Bank',
    '5108',
    'Ativa',
    'invest@c6bank.com',
    '(11) 3003-2673',
    'https://www.c6bank.com/investimentos',
    '0% corretagem, CDBs'
),
-- 9. Íon Itaú
(
    '00682847000102',
    'Banco Itaú BBA Corretora de Câmbio, Títulos e Valores Mobiliários S.A.',
    'Íon Itaú',
    '0115',
    'Ativa',
    'ion@itau.com.br',
    '(11) 3247-8000',
    'https://www.ion.itau.com.br',
    'Itaú grupo, renda fixa'
),
-- 10. Mirae Asset
(
    '11865754000158',
    'Mirae Asset Corretora de Valores Mobiliários Ltda.',
    'Mirae Asset',
    '4334',
    'Ativa',
    'atendimento@mirae.com.br',
    '(11) 3045-5100',
    'https://www.mirae.com.br',
    'Corretagem R$7,90'
);
