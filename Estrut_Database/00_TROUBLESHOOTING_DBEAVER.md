# 🚨 TROUBLESHOOTING: DBEAVER + POSTGRESQL

## ⚠️ PROBLEMA CRÍTICO RECORRENTE

### **SINTOMA:**
- Tabelas são criadas (CREATE TABLE executa sem erro)
- Mas queries SELECT retornam erro "relação não existe"
- DBeaver mostra tabelas na árvore, mas não aparecem em queries
- Scripts SQL executam mas parecem "não salvar"

---

## ✅ CAUSA RAIZ (99% DOS CASOS):

### **ARQUIVO SQL NÃO ESTÁ ASSOCIADO À CONEXÃO DO DATABASE!**

Quando você:
1. Abre um arquivo .sql direto no DBeaver (File → Open)
2. Ou abre pelo VS Code/Explorer
3. **NÃO há conexão ativa selecionada**
4. Executar Alt+X dá erro: **"No active connection"**
5. Ou pior: executa em outra conexão/database errado

---

## 🔧 SOLUÇÃO DEFINITIVA:

### **MÉTODO 1 - Abrir SQL Editor PELA CONEXÃO (Recomendado):**

1. **Database Navigator** (painel esquerdo do DBeaver)
2. **Clique direito em `invctl_db`** (ou database correto)
3. **SQL Editor → New SQL Script** (ou F3)
4. **Cole o código SQL** do VS Code
5. **Execute:** Alt+X (ou Ctrl+Enter)
6. ✅ **Garantido que está na conexão correta**

### **MÉTODO 2 - Verificar Dropdown de Conexão:**

1. Ao abrir um arquivo .sql no DBeaver
2. **Olhe no TOPO do editor** (barra de ferramentas)
3. **Procure um DROPDOWN/COMBOBOX** mostrando a conexão
4. **Se estiver vazio ou errado:** Selecione `invctl_db`
5. **Agora execute:** Alt+X

### **MÉTODO 3 - Abrir Script Pela Conexão:**

1. **Clique direito em `invctl_db`**
2. **SQL Editor → Open SQL Script**
3. **Navegue até o arquivo .sql**
4. ✅ Automaticamente associado à conexão

---

## 🔍 DIAGNÓSTICO RÁPIDO:

### **Antes de executar qualquer script SQL, SEMPRE:**

```sql
-- Confirmar database e schema conectado
SELECT current_database() as database_conectado;
SELECT current_schema() as schema_atual;
```

Se retornar valores errados ou NULOS → Você não está conectado!

---

## 📋 CHECKLIST PRÉ-EXECUÇÃO:

- [ ] **Conexão visível:** Vejo o nome do database na barra do editor?
- [ ] **Database correto:** É realmente `invctl_db`?
- [ ] **AutoCommit ativo:** Ícone "Auto" visível e verde?
- [ ] **Teste simples:** `SELECT 1;` funciona?

---

## 🎯 BOAS PRÁTICAS:

### **SEMPRE:**
✅ Abrir SQL Editor PELO database (clique direito → SQL Editor → New)  
✅ Confirmar conexão antes de executar  
✅ Executar `SELECT current_database();` no início  
✅ Dar F5 (Refresh) na árvore após criar tabelas  

### **NUNCA:**
❌ Abrir arquivo .sql direto sem verificar conexão  
❌ Assumir que está no database certo  
❌ Confiar só na árvore do DBeaver (pode estar em cache)  
❌ Executar scripts longos sem testar conexão antes  

---

## 💾 LEMBRETE SOBRE AUTOCOMMIT:

- **Ícone "Auto"** na toolbar = AutoCommit Mode
- Se estiver **ATIVO (verde)**: Cada comando comita automaticamente
- Se estiver **INATIVO**: Precisa dar `COMMIT;` manualmente
- **Scripts devem incluir `COMMIT;`** explicitamente no final

---

## 🔴 ERRO RECORRENTE #1: "No active connection"

**Causa:** Arquivo SQL não associado a database  
**Solução:** Método 1 ou 2 acima

## 🔴 ERRO RECORRENTE #2: "Relação não existe"

**Causas possíveis:**
1. Conexão errada (database errado)
2. Schema errado (public vs outro)
3. Transação não commitada (falta `COMMIT;`)
4. Cache do DBeaver desatualizado (F5 para refresh)

---

## 📝 HISTÓRICO DE PROBLEMAS:

- **2026-01-13:** Perdidas 5 horas debugando problema de conexão não selecionada
- **Anteriormente:** Problema ocorreu 3x já
- **Lição:** SEMPRE verificar conexão ANTES de executar scripts

---

## 🎓 PARA PRÓXIMAS IAs:

**ANTES de começar qualquer diagnóstico complexo:**

1. ✅ Perguntar: "Você selecionou a conexão no DBeaver antes de executar?"
2. ✅ Pedir: "Execute `SELECT current_database();` e me diga o resultado"
3. ✅ Confirmar: "O dropdown de conexão no topo mostra `invctl_db`?"

**Só depois disso investigar problemas mais complexos!**

---

## 📖 REFERÊNCIAS:

- DBeaver Docs: https://dbeaver.io/docs/
- PostgreSQL: https://www.postgresql.org/docs/

---

**Data:** 2026-01-13  
**Autor:** Documentado após incidente de 5 horas de debugging  
**Prioridade:** CRÍTICA - Ler ANTES de ajudar com DBeaver!
