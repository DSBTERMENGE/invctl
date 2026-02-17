DROP VIEW IF EXISTS contatos_instituicao_view CASCADE;

CREATE OR REPLACE VIEW contatos_instituicao_view AS
SELECT 
    id_contato,
    instituicao,
    nome_completo,
    funcao,
    setor,
    email,
    telefone,
    celular,
    ramal,
    observacoes,
    ativo,
    data_cadastro,
    data_ultima_atualizacao
FROM contatos_instituicao
ORDER BY nome_completo;
