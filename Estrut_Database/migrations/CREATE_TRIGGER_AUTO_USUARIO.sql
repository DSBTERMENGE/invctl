-- ============================================================================
-- TRIGGER: Auto-preencher id_usuario = 1 em todas as tabelas de investimentos
-- ============================================================================
-- Data: 06/02/2026
-- Descrição: Trigger genérico que preenche id_usuario automaticamente
--            Solução single-user: sempre usa id_usuario = 1
-- ============================================================================

-- ============================================================================
-- FUNÇÃO: Preencher id_usuario automaticamente
-- ============================================================================
CREATE OR REPLACE FUNCTION auto_preenche_usuario()
RETURNS TRIGGER AS $$
BEGIN
    -- Se id_usuario não foi fornecido ou é NULL, usa 1
    IF NEW.id_usuario IS NULL THEN
        NEW.id_usuario := 1;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGER: inv_rf
-- ============================================================================
DROP TRIGGER IF EXISTS trg_auto_usuario_inv_rf ON inv_rf;
CREATE TRIGGER trg_auto_usuario_inv_rf
    BEFORE INSERT OR UPDATE ON inv_rf
    FOR EACH ROW
    EXECUTE FUNCTION auto_preenche_usuario();

-- ============================================================================
-- TRIGGER: inv_cri_cra
-- ============================================================================
DROP TRIGGER IF EXISTS trg_auto_usuario_inv_cri_cra ON inv_cri_cra;
CREATE TRIGGER trg_auto_usuario_inv_cri_cra
    BEFORE INSERT OR UPDATE ON inv_cri_cra
    FOR EACH ROW
    EXECUTE FUNCTION auto_preenche_usuario();

-- ============================================================================
-- ADICIONE TRIGGERS para outras tabelas conforme forem criadas:
-- ============================================================================
-- DROP TRIGGER IF EXISTS trg_auto_usuario_inv_acoes ON inv_acoes;
-- CREATE TRIGGER trg_auto_usuario_inv_acoes
--     BEFORE INSERT OR UPDATE ON inv_acoes
--     FOR EACH ROW
--     EXECUTE FUNCTION auto_preenche_usuario();

-- DROP TRIGGER IF EXISTS trg_auto_usuario_inv_fundos ON inv_fundos;
-- CREATE TRIGGER trg_auto_usuario_inv_fundos
--     BEFORE INSERT OR UPDATE ON inv_fundos
--     FOR EACH ROW
--     EXECUTE FUNCTION auto_preenche_usuario();

-- ============================================================================
-- TESTAR: Inserir registro sem id_usuario
-- ============================================================================
-- INSERT INTO inv_rf (id_tipo_investimento, id_banco_emissor, codigo_ativo, 
--                      data_aplicacao, data_vencimento, valor_aplicado)
-- VALUES (1, 1, 'TESTE-001', '2026-02-06', '2027-02-06', 10000.00);

-- SELECT id_inv_rf, id_usuario, codigo_ativo FROM inv_rf WHERE codigo_ativo = 'TESTE-001';
-- Deve mostrar id_usuario = 1

-- ============================================================================
-- VERIFICAR TRIGGERS CRIADOS
-- ============================================================================
SELECT 
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation
FROM information_schema.triggers
WHERE trigger_name LIKE 'trg_auto_usuario%'
ORDER BY event_object_table;

-- ============================================================================
-- NOTAS IMPORTANTES
-- ============================================================================
-- 1. TRIGGER executa ANTES do INSERT/UPDATE - preenche id_usuario se for NULL
-- 2. Backend NÃO precisa enviar id_usuario nas requisições
-- 3. Frontend NÃO deve incluir campo id_usuario nos formulários
-- 4. Quando implementar multi-user no futuro:
--    - Modificar a função auto_preenche_usuario() para ler de SESSION variable
--    - Backend configura: SET SESSION app.current_user_id = <id_autenticado>
--    - Função usa: NEW.id_usuario := current_setting('app.current_user_id')::INTEGER
--    - NUNCA aceitar id_usuario do frontend (risco de segurança)
-- ============================================================================
