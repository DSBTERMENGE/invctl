-- ============================================
-- Script: Criação de Índices Adicionais
-- Data: 03/01/2026
-- Autor: David
-- Descrição: Cria índices para otimização de consultas
--            (além dos automáticos de PK e FK)
-- ============================================

-- ============================================
-- ÍNDICES - BANCO
-- ============================================
CREATE INDEX idx_banco_cnpj ON banco(cnpj);
CREATE INDEX idx_banco_nome ON banco(nome_completo);
CREATE INDEX idx_banco_codigo_bacen ON banco(codigo_bacen);
CREATE INDEX idx_banco_status ON banco(status_operacional);

-- ============================================
-- ÍNDICES - SECURITIZADORA
-- ============================================
CREATE INDEX idx_securitizadora_cnpj ON securitizadora(cnpj);
CREATE INDEX idx_securitizadora_nome ON securitizadora(nome_completo);
CREATE INDEX idx_securitizadora_codigo_cvm ON securitizadora(codigo_cvm);

-- ============================================
-- ÍNDICES - CORRETORA
-- ============================================
CREATE INDEX idx_corretora_cnpj ON corretora(cnpj);
CREATE INDEX idx_corretora_nome ON corretora(nome_completo);

-- ============================================
-- ÍNDICES - GESTORA
-- ============================================
CREATE INDEX idx_gestora_cnpj ON gestora(cnpj);
CREATE INDEX idx_gestora_nome ON gestora(nome_completo);

-- ============================================
-- ÍNDICES - ADMINISTRADORA
-- ============================================
CREATE INDEX idx_administradora_cnpj ON administradora(cnpj);
CREATE INDEX idx_administradora_nome ON administradora(nome_completo);

-- ============================================
-- ÍNDICES - FUNDO
-- ============================================
CREATE INDEX idx_fundo_cnpj ON fundo(cnpj);
CREATE INDEX idx_fundo_nome ON fundo(nome_completo);
CREATE INDEX idx_fundo_codigo_cvm ON fundo(codigo_cvm);
CREATE INDEX idx_fundo_tipo ON fundo(tipo_fundo);
CREATE INDEX idx_fundo_gestora ON fundo(id_gestora);
CREATE INDEX idx_fundo_administradora ON fundo(id_administradora);
CREATE INDEX idx_fundo_status ON fundo(status);

-- ============================================
-- ÍNDICES - USUARIO
-- ============================================
CREATE INDEX idx_usuario_cpf ON usuario(cpf);
CREATE INDEX idx_usuario_nome ON usuario(nome_completo);
CREATE INDEX idx_usuario_email ON usuario(email);

-- ============================================
-- ÍNDICES - INV_RF
-- ============================================
CREATE INDEX idx_inv_rf_usuario ON inv_rf(id_usuario);
CREATE INDEX idx_inv_rf_tipo ON inv_rf(id_tipo_investimento);
CREATE INDEX idx_inv_rf_data_aplicacao ON inv_rf(data_aplicacao);
CREATE INDEX idx_inv_rf_data_vencimento ON inv_rf(data_vencimento);
CREATE INDEX idx_inv_rf_status ON inv_rf(status);
CREATE INDEX idx_inv_rf_emissor ON inv_rf(id_banco_emissor);
CREATE INDEX idx_inv_rf_securitizadora ON inv_rf(id_securitizadora);

-- Índice composto para consultas frequentes
CREATE INDEX idx_inv_rf_usuario_status ON inv_rf(id_usuario, status);
CREATE INDEX idx_inv_rf_usuario_vencimento ON inv_rf(id_usuario, data_vencimento);

-- ============================================
-- ÍNDICES - INV_RF_CUPOM
-- ============================================
CREATE INDEX idx_inv_rf_cupom_investimento ON inv_rf_cupom(id_inv_rf);
CREATE INDEX idx_inv_rf_cupom_data_pagamento ON inv_rf_cupom(data_prevista_pagamento);
CREATE INDEX idx_inv_rf_cupom_status ON inv_rf_cupom(status);

-- ============================================
-- ÍNDICES - INV_FUNDO
-- ============================================
CREATE INDEX idx_inv_fundo_usuario ON inv_fundo(id_usuario);
CREATE INDEX idx_inv_fundo_fundo ON inv_fundo(id_fundo);
CREATE INDEX idx_inv_fundo_tipo ON inv_fundo(id_tipo_fundo);
CREATE INDEX idx_inv_fundo_status ON inv_fundo(status);
CREATE INDEX idx_inv_fundo_data_aplicacao ON inv_fundo(data_aplicacao_inicial);
CREATE INDEX idx_inv_fundo_avaliacao ON inv_fundo(avaliacao_atual);

-- Índices para alertas
CREATE INDEX idx_inv_fundo_alertas ON inv_fundo(id_usuario, status) 
WHERE alerta_performance = 'S' OR alerta_gestao = 'S' OR alerta_taxas = 'S' OR alerta_estrategia = 'S';

-- Índice composto para consultas frequentes
CREATE INDEX idx_inv_fundo_usuario_status ON inv_fundo(id_usuario, status);

-- ============================================
-- ÍNDICES - INV_FUNDO_MOVIMENTACAO
-- ============================================
CREATE INDEX idx_inv_fundo_mov_investimento ON inv_fundo_movimentacao(id_inv_fundo);
CREATE INDEX idx_inv_fundo_mov_tipo ON inv_fundo_movimentacao(tipo_movimentacao);
CREATE INDEX idx_inv_fundo_mov_data_solicitacao ON inv_fundo_movimentacao(data_solicitacao);
CREATE INDEX idx_inv_fundo_mov_data_liquidacao ON inv_fundo_movimentacao(data_liquidacao);

-- ============================================
-- ÍNDICES - INV_FUNDO_REVIEW
-- ============================================
CREATE INDEX idx_inv_fundo_review_investimento ON inv_fundo_review(id_inv_fundo);
CREATE INDEX idx_inv_fundo_review_data ON inv_fundo_review(data_review);
CREATE INDEX idx_inv_fundo_review_decisao ON inv_fundo_review(decisao);

-- ============================================
-- ÍNDICES - PENALIDADE
-- ============================================
CREATE INDEX idx_penalidade_orgao ON penalidade(id_orgao_regulador);
CREATE INDEX idx_penalidade_tipo_instituicao ON penalidade(tipo_instituicao, id_instituicao);
CREATE INDEX idx_penalidade_data_autuacao ON penalidade(data_autuacao);
CREATE INDEX idx_penalidade_status ON penalidade(status);
CREATE INDEX idx_penalidade_gravidade ON penalidade(gravidade);

-- ============================================
-- ÍNDICES - CERTIFICACAO
-- ============================================
CREATE INDEX idx_certificacao_orgao ON certificacao(id_orgao_regulador);
CREATE INDEX idx_certificacao_tipo_instituicao ON certificacao(tipo_instituicao, id_instituicao);
CREATE INDEX idx_certificacao_status ON certificacao(status);
CREATE INDEX idx_certificacao_data_validade ON certificacao(data_validade);

-- ============================================
-- ÍNDICES - INTERVENCAO_REGULATORIA
-- ============================================
CREATE INDEX idx_intervencao_banco ON intervencao_regulatoria(id_banco);
CREATE INDEX idx_intervencao_orgao ON intervencao_regulatoria(id_orgao_regulador);
CREATE INDEX idx_intervencao_tipo ON intervencao_regulatoria(tipo_intervencao);
CREATE INDEX idx_intervencao_status ON intervencao_regulatoria(status);

-- ============================================
-- Fim do Script 09
-- ============================================
