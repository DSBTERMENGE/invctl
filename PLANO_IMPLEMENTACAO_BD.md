# Plano de Implementação - Banco de Dados InvCtl

**Data:** 03/01/2026  
**SGBD:** PostgreSQL  
**Status:** Aguardando Aprovação

---

## 1. Estratégia de Isolamento

### Opção Recomendada: **DATABASE SEPARADO**

Criar um novo database PostgreSQL chamado `invctl_db`, completamente isolado do `finctl_db`.

**Vantagens:**
- ✅ Isolamento total - zero risco para o FinCtl
- ✅ Backups independentes
- ✅ Gerenciamento de permissões separado
- ✅ Possibilidade de migrar para servidor diferente no futuro
- ✅ Escalabilidade independente

**Configuração:**
```sql
-- Conexão como superusuário
CREATE DATABASE invctl_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'pt_BR.UTF-8'
    LC_CTYPE = 'pt_BR.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Criar usuário específico (opcional, mas recomendado)
CREATE USER invctl_user WITH PASSWORD 'senha_segura_aqui';
GRANT ALL PRIVILEGES ON DATABASE invctl_db TO invctl_user;
```

---

## 2. Estrutura de Diretórios do Projeto

```
InvCtl/
├── Estrut_Database/                          ← PASTA PARA ESTRUTURA DO BANCO
│   ├── documentacao/
│   │   ├── # Documento Mestre – Banco de Dados.MD
│   │   └── PLANO_IMPLEMENTACAO_BD.md
│   ├── scripts/
│   │   ├── 01_create_database.sql
│   │   ├── 02_create_tables_entidades_base.sql
│   │   │       (ORGAO_REGULADOR, INDEXADOR, TIPO_INVESTIMENTO, TIPO_FUNDO, USUARIO)
│   │   ├── 03_create_tables_instituicoes.sql
│   │   │       (BANCO, SECURITIZADORA, CORRETORA, GESTORA, ADMINISTRADORA)
│   │   ├── 04_create_tables_regulatorias.sql
│   │   │       (PENALIDADE, CERTIFICACAO, INTERVENCAO_REGULATORIA)
│   │   ├── 05_create_tables_historico_indices.sql
│   │   │       (HISTORICO_IPCA, HISTORICO_SELIC)
│   │   ├── 06_create_tables_fundos.sql
│   │   │       (FUNDO)
│   │   ├── 07_create_tables_investimentos_rf.sql
│   │   │       (INV_RF, INV_RF_CUPOM)
│   │   ├── 08_create_tables_investimentos_fundos.sql
│   │   │       (INV_FUNDO, INV_FUNDO_MOVIMENTACAO, INV_FUNDO_REVIEW)
│   │   ├── 09_create_indexes.sql
│   │   │       Cria índices adicionais para otimização de consultas:
│   │   │       - Índices em campos de busca (CNPJ, nome, código)
│   │   │       - Índices em campos de data (data_aplicacao, data_vencimento)
│   │   │       - Índices compostos para consultas frequentes
│   │   │       - Índices em FKs para melhorar JOINs
│   │   ├── 10_create_constraints.sql
│   │   │       Adiciona constraints de validação de dados:
│   │   │       - CHECK constraints (valores percentuais 0-100, datas lógicas)
│   │   │       - UNIQUE constraints adicionais (CNPJ, códigos)
│   │   │       - DEFAULT values quando apropriado
│   │   │       - NOT NULL em campos obrigatórios não definidos no CREATE TABLE
│   │   └── 11_seed_data.sql
│   │   │       Popula dados iniciais (master data) nas tabelas de domínio:
│   │   │       - ORGAO_REGULADOR (BACEN, CVM, ANBIMA, etc)
│   │   │       - INDEXADOR (CDI, SELIC, IPCA, PRE, etc)
│   │   │       - TIPO_INVESTIMENTO (CDB, LCI, LCA, CRI, CRA, etc)
│   │   │       - TIPO_FUNDO (RF_CP, RF_LP, MM_MACRO, AC_LIVRE, etc)
│   ├── migrations/
│   │   └── YYYYMMDD_HHMMSS_descricao_mudanca.sql
│   │       Exemplo: 20260115_143000_adicionar_campo_rating_banco.sql
│   │       Migrations para evolução do schema após implantação inicial
│   │       Cada arquivo deve conter:
│   │       - Comentário com descrição da mudança
│   │       - Script de aplicação (UP)
│   │       - Script de reversão (DOWN) em comentário
│   │       - Data e autor da modificação
│   └── backups/
│       └── (backups do banco de dados)
│
└── Aplicacao/                                 ← PASTA PARA FORMULÁRIOS E CÓDIGO
    └── (a ser criada após estrutura do banco)
```

---

## 3. Ordem de Criação das Tabelas

### FASE 1: Entidades Base (sem dependências externas)
1. `ORGAO_REGULADOR`
2. `INDEXADOR`
3. `TIPO_INVESTIMENTO`
4. `TIPO_FUNDO`
5. `USUARIO`

### FASE 2: Instituições Financeiras
6. `BANCO`
7. `SECURITIZADORA`
8. `CORRETORA`
9. `GESTORA`
10. `ADMINISTRADORA`

### FASE 3: Relacionamentos Institucionais
11. `PENALIDADE`
12. `CERTIFICACAO`
13. `INTERVENCAO_REGULATORIA`

### FASE 4: Histórico de Índices
14. `HISTORICO_IPCA`
15. `HISTORICO_SELIC`

### FASE 5: Fundos
16. `FUNDO`

### FASE 6: Investimentos em Renda Fixa
17. `INV_RF`
18. `INV_RF_CUPOM`

### FASE 7: Investimentos em Fundos
19. `INV_FUNDO`
20. `INV_FUNDO_MOVIMENTACAO`
21. `INV_FUNDO_REVIEW`

---

## 4. Dados Iniciais (Seeds)

### 4.1 Tabelas que precisam de dados iniciais:

**ORGAO_REGULADOR:**
- BACEN, CVM, ANBIMA, B3, PREVIC, SUSEP, CMN

**INDEXADOR:**
- CDI, SELIC, IPCA, PRE, IGP-M, IGPM, INPC, TR

**TIPO_INVESTIMENTO:**
- CDB, LCI, LCA, LC, CRI, CRA, TESOURO_SELIC, TESOURO_IPCA, TESOURO_PREFIXADO

**TIPO_FUNDO:**
- RF_CP, RF_LP, RF_REF_DI, MM_MACRO, MM_LIVRE, AC_LIVRE, AC_DIVIDENDOS, etc.

---

## 5. Índices e Constraints

### 5.1 Índices Principais:
- Chaves primárias (automático)
- Chaves estrangeiras (automático)
- CNPJ (único) em todas as entidades institucionais
- Campos de data em tabelas de investimento
- Campos de busca comum (nome, código)

### 5.2 Constraints Adicionais:
- CHECK constraints para validação de valores
- UNIQUE constraints para códigos e identificadores
- NOT NULL onde apropriado

---

## 6. Cronograma de Execução

### Etapa 1: Preparação (30 min)
- [ ] Backup do servidor PostgreSQL atual (precaução)
- [ ] Verificar versão do PostgreSQL
- [ ] Criar estrutura de diretórios
  ```bash
  mkdir -p "Estrut_Database/documentacao"
  mkdir -p "Estrut_Database/scripts"
  mkdir -p "Estrut_Database/migrations"
  mkdir -p "Estrut_Database/backups"
  ```
- [ ] Mover documentos para Estrut_Database/documentacao/

### Etapa 2: Criação do Database (5 min)
- [ ] Executar script de criação do database
- [ ] Verificar conexão

### Etapa 3: Criação das Tabelas (1-2 horas)
- [ ] Executar scripts na ordem (Fase 1 a 7)
- [ ] Validar criação de cada tabela
- [ ] Verificar constraints e FKs

### Etapa 4: Dados Iniciais (30 min)
- [ ] Executar seed data
- [ ] Validar inserções

### Etapa 5: Índices e Otimizações (30 min)
- [ ] Criar índices adicionais
- [ ] Testar performance básica

### Etapa 6: Documentação (30 min)
- [ ] Documentar strings de conexão
- [ ] Criar README de uso do banco
- [ ] Documentar processo de backup

**Tempo Total Estimado:** 3-4 horas

---

## 7. Plano de Backup e Segurança

### 7.1 Backup Preventivo (ANTES de começar):
```bash
# Backup do servidor completo (incluindo FinCtl)
pg_dumpall -U postgres > backup_completo_antes_invctl_20260103.sql
```

### 7.2 Backup do InvCtl (após criação):
```bash
# Backup apenas do InvCtl
pg_dump -U postgres invctl_db > invctl_backup_inicial.sql
```

### 7.3 Estratégia de Backup Regular:
- Backup diário automático
- Manter últimos 7 dias
- Backup semanal (manter 4 semanas)
- Backup mensal (manter 12 meses)

---

## 8. Validações de Segurança

### Checklist antes de iniciar:
- [ ] Servidor PostgreSQL está rodando
- [ ] Backup preventivo realizado
- [ ] Acesso ao superusuário confirmado
- [ ] FinCtl não será afetado (database separado)
- [ ] Espaço em disco suficiente (mínimo 1GB livre)

### Validações durante execução:
- [ ] Cada script executado com sucesso
- [ ] Nenhum erro reportado
- [ ] Contagem de tabelas criadas = 21 tabelas

### Validações finais:
- [ ] FinCtl continua funcionando normalmente
- [ ] InvCtl acessível e funcional
- [ ] Dados seed carregados corretamente
- [ ] Backup inicial criado

---

## 9. Informações de Conexão

```
Host: localhost (ou IP do servidor)
Port: 5432 (padrão PostgreSQL)
Database: invctl_db
Username: invctl_user (ou postgres)
Password: [a definir]
```

---

## 10. Próximos Passos Após Aprovação

1. **Gerar os scripts SQL** baseados no documento mestre
2. **Revisar scripts** antes da execução
3. **Executar backup preventivo**
4. **Criar database**
5. **Executar scripts em ordem**
6. **Validar criação**
7. **Popular dados iniciais**
8. **Criar backup inicial**
9. **Documentar processo**
10. **Desenvolver aplicação**

---

## 11. Pontos de Decisão Necessários

Antes de prosseguir, precisamos definir:

1. **Nome do database:** `invctl_db` ou outro?
2. **Criar usuário específico:** Sim ou usar postgres?
3. **Senha do usuário:** (se criar usuário específico)
4. **Localização dos backups:** Pasta local ou servidor?
5. **Dados iniciais:** Popular tudo ou começar vazio?

---

## 12. Estratégia de Evolução do Banco de Dados

### 12.1 Sistema de Migrations (Migrações)

**Objetivo:** Permitir alterações controladas e rastreáveis no schema após o início da operação.

**Formato de Arquivo:**
```
YYYYMMDD_HHMMSS_descricao.sql
Exemplo: 20260115_143000_adicionar_campo_rating_banco.sql
```

**Estrutura de cada Migration:**
```sql
-- ============================================
-- Migration: Adicionar campo rating ao banco
-- Data: 15/01/2026 14:30
-- Autor: David
-- Descrição: Adicionar campo rating_atual para 
--            agilizar consultas de risco
-- ============================================

-- UP (Aplicação)
ALTER TABLE banco 
ADD COLUMN rating_atual VARCHAR(10);

COMMENT ON COLUMN banco.rating_atual IS 
'Rating consolidado mais recente (cache)';

-- ============================================
-- DOWN (Reversão) - manter em comentário
-- ============================================
-- ALTER TABLE banco DROP COLUMN rating_atual;
```

### 12.2 Tipos de Mudanças Suportadas

**✅ Mudanças Seguras (sem impacto):**
- Adicionar nova tabela
- Adicionar novo campo com DEFAULT ou NULL permitido
- Criar novos índices
- Adicionar constraints opcionais
- Criar views

**⚠️ Mudanças com Cuidado:**
- Adicionar campo NOT NULL (requer valor padrão ou população prévia)
- Modificar tipo de campo (requer conversão de dados)
- Renomear campo (requer atualização de queries)
- Adicionar foreign keys (requer dados consistentes)

**🚫 Mudanças que Exigem Planejamento:**
- Remover campo com dados
- Remover tabela com dados
- Modificar constraint existente
- Alterar chave primária

### 12.3 Processo de Alteração do Schema

**Passo a Passo:**
1. **Backup antes da mudança**
   ```bash
   pg_dump -U postgres invctl_db > backup_antes_migration_20260115.sql
   ```

2. **Criar arquivo de migration**
   - Nomear com timestamp + descrição
   - Documentar UP e DOWN
   - Testar em ambiente local primeiro

3. **Aplicar migration**
   ```bash
   psql -U postgres -d invctl_db -f database/migrations/20260115_143000_descricao.sql
   ```

4. **Validar aplicação**
   - Verificar estrutura: `\d+ nome_tabela`
   - Testar queries afetadas
   - Confirmar dados íntegros

5. **Documentar no histórico**
   - Atualizar versão no Documento Mestre
   - Registrar em changelog

6. **Backup após mudança**
   ```bash
   pg_dump -U postgres invctl_db > backup_apos_migration_20260115.sql
   ```

### 12.4 Controle de Versão do Schema

**Criar tabela de controle:**
```sql
CREATE TABLE schema_version (
    id SERIAL PRIMARY KEY,
    version VARCHAR(50) NOT NULL,
    description TEXT,
    migration_file VARCHAR(255),
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    applied_by VARCHAR(100),
    execution_time_ms INTEGER,
    success BOOLEAN DEFAULT TRUE
);

-- Registrar versão inicial
INSERT INTO schema_version (version, description, applied_by)
VALUES ('1.0', 'Schema inicial - 21 tabelas base', 'David');
```

**Registrar cada migration:**
```sql
-- Ao aplicar migration
INSERT INTO schema_version (version, description, migration_file, applied_by)
VALUES ('1.1', 'Adicionar campo rating_atual em banco', 
        '20260115_143000_adicionar_campo_rating_banco.sql', 'David');
```

### 12.5 Boas Práticas

**✅ FAZER:**
- Sempre criar backup antes de alterar
- Testar migration em ambiente local
- Documentar razão da mudança
- Incluir script de reversão (DOWN)
- Aplicar migrations uma por vez
- Validar após aplicação
- Manter migrations no controle de versão (Git)

**❌ NÃO FAZER:**
- Alterar schema direto em produção sem teste
- Modificar migrations já aplicadas
- Deletar migrations do histórico
- Aplicar múltiplas migrations sem validação
- Esquecer de fazer backup

### 12.6 Exemplos de Migrations Comuns

**Exemplo 1: Adicionar novo campo**
```sql
-- 20260120_100000_adicionar_email_usuario.sql
ALTER TABLE usuario 
ADD COLUMN email_secundario VARCHAR(255);
```

**Exemplo 2: Criar nova tabela**
```sql
-- 20260125_140000_criar_tabela_alerta.sql
CREATE TABLE alerta_investimento (
    id_alerta SERIAL PRIMARY KEY,
    id_usuario INTEGER REFERENCES usuario(id_usuario),
    tipo_alerta VARCHAR(50),
    mensagem TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    visualizado BOOLEAN DEFAULT FALSE
);
```

**Exemplo 3: Adicionar índice**
```sql
-- 20260130_093000_indice_busca_cpf_usuario.sql
CREATE INDEX idx_usuario_cpf ON usuario(cpf);
```

**Exemplo 4: Modificar tipo de campo**
```sql
-- 20260205_110000_aumentar_tamanho_observacoes.sql
ALTER TABLE inv_rf 
ALTER COLUMN observacoes TYPE TEXT;
```

---

## 13. Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Afetar FinCtl | Muito Baixa | Alto | Database separado + backup |
| Erro em script SQL | Média | Baixo | Validação prévia + execução por fase |
| Perda de dados | Muito Baixa | Alto | Backups antes e depois |
| Falta de espaço | Baixa | Médio | Verificar espaço antes |
| Erro de permissões | Baixa | Baixo | Usar superusuário |
| Mudança de schema sem backup | Baixa | Alto | Processo obrigatório de backup em migrations |
| Migration incompatível | Média | Médio | Teste local + script de reversão |

---

## 14. Status: ⏸️ AGUARDANDO APROVAÇÃO

**Próxima Ação:** Revisar plano e aprovar para iniciar Etapa 1
