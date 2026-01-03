-- ============================================
-- Script: Criação de Constraints Adicionais
-- Data: 03/01/2026
-- Autor: David
-- Descrição: Adiciona constraints de validação de dados
--            e regras de negócio
-- ============================================

-- ============================================
-- CONSTRAINTS - BANCO
-- ============================================
ALTER TABLE banco
    ADD CONSTRAINT chk_banco_indice_basileia 
    CHECK (indice_basileia IS NULL OR (indice_basileia >= 0 AND indice_basileia <= 100));

ALTER TABLE banco
    ADD CONSTRAINT chk_banco_capital_social 
    CHECK (capital_social IS NULL OR capital_social >= 0);

-- ============================================
-- CONSTRAINTS - SECURITIZADORA
-- ============================================
ALTER TABLE securitizadora
    ADD CONSTRAINT chk_securitizadora_capital 
    CHECK (capital_social IS NULL OR capital_social >= 0);

ALTER TABLE securitizadora
    ADD CONSTRAINT chk_securitizadora_patrimonio 
    CHECK (patrimonio_liquido IS NULL OR patrimonio_liquido >= 0);

ALTER TABLE securitizadora
    ADD CONSTRAINT chk_securitizadora_emissoes 
    CHECK (total_emissoes_realizadas IS NULL OR total_emissoes_realizadas >= 0);

ALTER TABLE securitizadora
    ADD CONSTRAINT chk_securitizadora_volume 
    CHECK (volume_total_emitido IS NULL OR volume_total_emitido >= 0);

-- ============================================
-- CONSTRAINTS - GESTORA
-- ============================================
ALTER TABLE gestora
    ADD CONSTRAINT chk_gestora_patrimonio 
    CHECK (patrimonio_sob_gestao IS NULL OR patrimonio_sob_gestao >= 0);

ALTER TABLE gestora
    ADD CONSTRAINT chk_gestora_numero_fundos 
    CHECK (numero_fundos_geridos IS NULL OR numero_fundos_geridos >= 0);

ALTER TABLE gestora
    ADD CONSTRAINT chk_gestora_numero_gestores 
    CHECK (numero_gestores IS NULL OR numero_gestores >= 0);

-- ============================================
-- CONSTRAINTS - ADMINISTRADORA
-- ============================================
ALTER TABLE administradora
    ADD CONSTRAINT chk_administradora_patrimonio 
    CHECK (patrimonio_administrado IS NULL OR patrimonio_administrado >= 0);

ALTER TABLE administradora
    ADD CONSTRAINT chk_administradora_taxas 
    CHECK (
        (taxa_administracao_padrao IS NULL OR taxa_administracao_padrao >= 0) AND
        (taxa_performance_padrao IS NULL OR taxa_performance_padrao >= 0)
    );

-- ============================================
-- CONSTRAINTS - FUNDO
-- ============================================
ALTER TABLE fundo
    ADD CONSTRAINT chk_fundo_taxas 
    CHECK (
        (taxa_administracao IS NULL OR taxa_administracao >= 0) AND
        (taxa_performance IS NULL OR taxa_performance >= 0) AND
        (taxa_entrada IS NULL OR taxa_entrada >= 0) AND
        (taxa_saida IS NULL OR taxa_saida >= 0)
    );

ALTER TABLE fundo
    ADD CONSTRAINT chk_fundo_valores_aplicacao 
    CHECK (
        (aplicacao_minima_inicial IS NULL OR aplicacao_minima_inicial >= 0) AND
        (aplicacao_minima_adicional IS NULL OR aplicacao_minima_adicional >= 0) AND
        (saldo_minimo_permanencia IS NULL OR saldo_minimo_permanencia >= 0)
    );

ALTER TABLE fundo
    ADD CONSTRAINT chk_fundo_prazos 
    CHECK (
        (prazo_liquidacao_resgate IS NULL OR prazo_liquidacao_resgate >= 0) AND
        (prazo_cotizacao_aplicacao IS NULL OR prazo_cotizacao_aplicacao >= 0) AND
        (prazo_cotizacao_resgate IS NULL OR prazo_cotizacao_resgate >= 0) AND
        (carencia_resgate_dias IS NULL OR carencia_resgate_dias >= 0)
    );

ALTER TABLE fundo
    ADD CONSTRAINT chk_fundo_patrimonio 
    CHECK (patrimonio_liquido IS NULL OR patrimonio_liquido >= 0);

ALTER TABLE fundo
    ADD CONSTRAINT chk_fundo_numero_cotistas 
    CHECK (numero_cotistas IS NULL OR numero_cotistas >= 0);

ALTER TABLE fundo
    ADD CONSTRAINT chk_fundo_datas 
    CHECK (data_encerramento IS NULL OR data_encerramento >= data_inicio);

-- ============================================
-- CONSTRAINTS - INV_RF
-- ============================================
ALTER TABLE inv_rf
    ADD CONSTRAINT chk_inv_rf_valores 
    CHECK (
        valor_aplicado > 0 AND
        (valor_liquido_aplicado IS NULL OR valor_liquido_aplicado > 0)
    );

ALTER TABLE inv_rf
    ADD CONSTRAINT chk_inv_rf_datas 
    CHECK (data_vencimento > data_aplicacao);

ALTER TABLE inv_rf
    ADD CONSTRAINT chk_inv_rf_taxas 
    CHECK (
        (percentual_indexador IS NULL OR percentual_indexador >= 0) AND
        (taxa_prefixada IS NULL OR taxa_prefixada >= 0) AND
        (taxa_administracao IS NULL OR taxa_administracao >= 0) AND
        (taxa_custodia IS NULL OR taxa_custodia >= 0)
    );

ALTER TABLE inv_rf
    ADD CONSTRAINT chk_inv_rf_dias_carencia 
    CHECK (dias_carencia IS NULL OR dias_carencia >= 0);

ALTER TABLE inv_rf
    ADD CONSTRAINT chk_inv_rf_emissor 
    CHECK (
        (id_banco_emissor IS NOT NULL AND id_securitizadora IS NULL) OR
        (id_banco_emissor IS NULL AND id_securitizadora IS NOT NULL)
    );

-- ============================================
-- CONSTRAINTS - INV_RF_CUPOM
-- ============================================
ALTER TABLE inv_rf_cupom
    ADD CONSTRAINT chk_inv_rf_cupom_valores 
    CHECK (
        (valor_bruto IS NULL OR valor_bruto >= 0) AND
        (valor_ir IS NULL OR valor_ir >= 0) AND
        (valor_liquido IS NULL OR valor_liquido >= 0)
    );

ALTER TABLE inv_rf_cupom
    ADD CONSTRAINT chk_inv_rf_cupom_numero 
    CHECK (numero_cupom > 0);

ALTER TABLE inv_rf_cupom
    ADD CONSTRAINT chk_inv_rf_cupom_datas 
    CHECK (
        periodo_referencia_fim IS NULL OR 
        periodo_referencia_inicio IS NULL OR
        periodo_referencia_fim >= periodo_referencia_inicio
    );

-- ============================================
-- CONSTRAINTS - INV_FUNDO
-- ============================================
ALTER TABLE inv_fundo
    ADD CONSTRAINT chk_inv_fundo_valores_iniciais 
    CHECK (
        valor_aplicacao_inicial > 0 AND
        (quantidade_cotas_inicial IS NULL OR quantidade_cotas_inicial > 0) AND
        (valor_cota_aplicacao_inicial IS NULL OR valor_cota_aplicacao_inicial > 0)
    );

ALTER TABLE inv_fundo
    ADD CONSTRAINT chk_inv_fundo_posicao 
    CHECK (
        (quantidade_cotas_atual IS NULL OR quantidade_cotas_atual >= 0) AND
        (valor_aplicado_total IS NULL OR valor_aplicado_total >= 0) AND
        (valor_resgatado_total IS NULL OR valor_resgatado_total >= 0)
    );

ALTER TABLE inv_fundo
    ADD CONSTRAINT chk_inv_fundo_taxas 
    CHECK (
        (taxa_administracao_efetiva IS NULL OR taxa_administracao_efetiva >= 0) AND
        (taxa_performance_efetiva IS NULL OR taxa_performance_efetiva >= 0) AND
        (taxa_entrada_paga IS NULL OR taxa_entrada_paga >= 0) AND
        (taxa_saida_estimada IS NULL OR taxa_saida_estimada >= 0)
    );

-- ============================================
-- CONSTRAINTS - INV_FUNDO_MOVIMENTACAO
-- ============================================
ALTER TABLE inv_fundo_movimentacao
    ADD CONSTRAINT chk_inv_fundo_mov_valores 
    CHECK (
        valor_financeiro > 0 AND
        (quantidade_cotas IS NULL OR quantidade_cotas > 0) AND
        (valor_cota IS NULL OR valor_cota > 0) AND
        (taxa_saida IS NULL OR taxa_saida >= 0) AND
        (ir_retido IS NULL OR ir_retido >= 0) AND
        (taxa_performance_retida IS NULL OR taxa_performance_retida >= 0) AND
        (valor_liquido IS NULL OR valor_liquido >= 0)
    );

-- ============================================
-- CONSTRAINTS - INV_FUNDO_REVIEW
-- ============================================
ALTER TABLE inv_fundo_review
    ADD CONSTRAINT chk_inv_fundo_review_indicadores 
    CHECK (
        (patrimonio_liquido_fundo IS NULL OR patrimonio_liquido_fundo >= 0) AND
        (numero_cotistas IS NULL OR numero_cotistas >= 0) AND
        (volatilidade_12m IS NULL OR volatilidade_12m >= 0)
    );

-- ============================================
-- CONSTRAINTS - PENALIDADE
-- ============================================
ALTER TABLE penalidade
    ADD CONSTRAINT chk_penalidade_valor 
    CHECK (valor_multa IS NULL OR valor_multa >= 0);

ALTER TABLE penalidade
    ADD CONSTRAINT chk_penalidade_datas 
    CHECK (
        data_julgamento IS NULL OR 
        data_autuacao IS NULL OR
        data_julgamento >= data_autuacao
    );

-- ============================================
-- CONSTRAINTS - INTERVENCAO_REGULATORIA
-- ============================================
ALTER TABLE intervencao_regulatoria
    ADD CONSTRAINT chk_intervencao_datas 
    CHECK (
        data_fim IS NULL OR 
        data_inicio IS NULL OR
        data_fim >= data_inicio
    );

-- ============================================
-- Fim do Script 10
-- ============================================
