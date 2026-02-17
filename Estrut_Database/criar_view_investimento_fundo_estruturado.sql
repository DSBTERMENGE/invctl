-- =====================================================
-- VIEW: INVESTIMENTO_FUNDO_ESTRUTURADO_VIEW
-- =====================================================
-- Combina dados de investimentos em fundos estruturados
-- com informações do fundo e da corretora

CREATE OR REPLACE VIEW investimento_fundo_estruturado_view AS
SELECT 
    ife.id_investimento_fundo_estruturado,
    ife.id_fundo_estruturado,
    ife.id_corretora,
    ife.data_operacao,
    ife.tipo_operacao,
    ife.quantidade_cotas,
    ife.preco_cota,
    ife.valor_total,
    ife.observacoes,
    
    -- Dados do Fundo Estruturado
    fe.codigo_negociacao AS fundo_ticker,
    fe.nome_abreviado AS fundo_nome,
    fe.tipo_fundo AS fundo_tipo,
    
    -- Dados da Corretora
    c.nome_fantasia AS corretora_nome
    
FROM investimento_fundo_estruturado ife
LEFT JOIN fundo_estruturado fe ON ife.id_fundo_estruturado = fe.id_fundo_estruturado
LEFT JOIN corretoras c ON ife.id_corretora = c.id_corretora

ORDER BY ife.data_operacao DESC, ife.id_investimento_fundo_estruturado DESC;

-- Comentário
COMMENT ON VIEW investimento_fundo_estruturado_view IS 
'VIEW para consulta de investimentos em fundos estruturados com dados do fundo e corretora';
