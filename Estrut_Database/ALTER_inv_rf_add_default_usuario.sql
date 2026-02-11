-- ================================================================
-- ADICIONAR VALOR PADRÃO PARA id_usuario NA TABELA inv_rf
-- ================================================================
-- 
-- JUSTIFICATIVA:
-- Como o sistema InvCtl é de uso pessoal (apenas 1 usuário),
-- não faz sentido enviar id_usuario do frontend (risco de segurança).
-- Definindo DEFAULT 1 no banco, todos os registros automaticamente
-- pertencem ao usuário padrão.
--
-- FUTURO: Se implementar multi-usuário, usar sessões Flask para
-- capturar id_usuario autenticado no backend.
-- ================================================================

ALTER TABLE inv_rf 
ALTER COLUMN id_usuario SET DEFAULT 1;

-- Verificar se funcionou
SELECT column_name, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'inv_rf' AND column_name = 'id_usuario';
