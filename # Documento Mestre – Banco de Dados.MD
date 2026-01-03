# Documento Mestre – Banco de Dados de Investimentos
**SGBD:** PostgreSQL  
**Versão:** 1.0  
**Status:** Em construção  
**Autor:** David  

---

## 1. Visão Geral do Sistema

### 1.1 Contexto de negócio e propósito do banco de dados

O propósito deste projeto é a construção de um **banco de dados relacional utilizando PostgreSQL**, voltado para o **controle e acompanhamento de investimentos financeiros**.

O banco deverá armazenar informações sobre diferentes **tipos de investimentos**, priorizando:
- Modelagem relacional adequada
- Evitar redundância de dados
- Reutilização de estruturas comuns entre investimentos semelhantes

A ideia central é identificar **características comuns** entre diferentes investimentos e representá-las de forma normalizada.  
Por exemplo, investimentos de **renda fixa** como **CDB, LCI, LCA, LC, CRI e CRA** compartilham diversos atributos para identificação e acompanhamento, podendo ser representados inicialmente por uma **única tabela**.

---

### 1.2 Entidades comuns no domínio

As seguintes entidades são fundamentais e servem múltiplos propósitos no sistema:

- **Banco / Instituição Financeira**: Entidade central que pode atuar como:
  - Emissor de títulos de renda fixa (CDB, LCI, LCA, LC)
  - Custodiante de ativos
  - Instituição para conta corrente/poupança
  
  Armazenará informações detalhadas de confiabilidade e solidez:
  - Índice de Basileia
  - Rating de crédito (agências nacionais e internacionais)
  - Capital social
  - Tipo de instituição (banco comercial, múltiplo, cooperativa, etc)
  - Status operacional
  - Histórico de intervenções do Banco Central

- **Securitizadora**: Emissora de certificados de recebíveis (CRI, CRA)
  - Rating de crédito
  - Capital social
  - Histórico de operações
  - Qualidade da originação

- **Corretora**: Intermediária nas operações de investimento
  - Taxas praticadas
  - Plataforma tecnológica
  - Solidez financeira

- **Gestora de Fundos**: Responsável pela gestão e estratégia de investimento
  - Track record
  - Patrimônio sob gestão
  - Equipe de gestão
  - Filosofia de investimento

- **Administradora de Fundos**: Responsável pela administração operacional
  - Controles internos
  - Histórico de irregularidades
  - Qualidade dos serviços

- **Usuário**: Investidor que possui a carteira

Essas entidades devem ser modeladas de forma independente, permitindo reutilização e integridade referencial.

---

## 2. Escopo

### 2.1 Dentro do escopo
- Investimentos de renda fixa e renda variável
- Ambiente multiusuário
- Modelagem relacional normalizada

### 2.2 Fora do escopo
- Autenticação e autorização
- Interface de usuário
- Cálculos financeiros avançados automatizados

---

## 3. Entidades Fundamentais

### 3.1 Entidade: BANCO

#### Descrição
Tabela central para armazenar informações sobre instituições financeiras. Um banco pode desempenhar múltiplos papéis no sistema (emissor, administrador, custodiante).

#### Campos
- `id_banco` (PK)
- `codigo_bacen` (código único do Banco Central)
- `cnpj`
- `nome_completo`
- `nome_fantasia`
- `tipo_instituicao` (Banco Comercial, Banco Múltiplo, Cooperativa de Crédito, Corretora, DTVM, Securitizadora, etc)
- `status_operacional` (Ativo, Liquidação, Intervenção, Regime Especial)
- `data_inicio_operacao`

**Indicadores de Solidez:**
- `capital_social`
- `indice_basileia` (percentual)
- `data_atualizacao_basileia`
- `rating_fitch`
- `rating_moodys`
- `rating_sp`
- `rating_nacional` (agências brasileiras)
- `data_atualizacao_rating`

**Informações de Risco:**
- `possui_garantia_fgc` (S/N)
- `historico_intervencoes` (texto descritivo)
- `observacoes`

**Auditoria:**
- `data_cadastro`
- `data_ultima_atualizacao`
- `usuario_cadastro`
- `usuario_ultima_atualizacao`

---

### 3.2 Entidade: SECURITIZADORA

#### Descrição
Instituições especializadas na emissão de certificados de recebíveis (CRI, CRA). A qualidade da securitizadora é fundamental para avaliar o risco do investimento.

#### Campos
- `id_securitizadora` (PK)
- `cnpj`
- `nome_completo`
- `nome_fantasia`
- `codigo_cvm`
- `status_operacional` (Ativo, Suspensa, Cancelada)

**Indicadores de Qualidade:**
- `capital_social`
- `patrimonio_liquido`
- `rating_fitch`
- `rating_moodys`
- `rating_sp`
- `rating_nacional`
- `data_atualizacao_rating`

**Histórico e Experiência:**
- `data_inicio_operacao`
- `total_emissoes_realizadas` (quantidade)
- `volume_total_emitido` (R$)
- `total_emissoes_ativas`
- `historico_inadimplencia` (texto descritivo)
- `historico_controversias` (processos, problemas regulatórios)

**Especialização:**
- `especialidade_setor` (Imobiliário, Agronegócio, Infraestrutura, Múltiplos)
- `qualidade_originacao` (avaliação qualitativa: A, B, C)

**Auditoria:**
- `observacoes`
- `data_cadastro`
- `data_ultima_atualizacao`
- `usuario_cadastro`
- `usuario_ultima_atualizacao`

---

### 3.3 Entidade: CORRETORA

#### Descrição
Corretoras e distribuidoras que intermediam operações de investimento.

#### Campos
- `id_corretora` (PK)
- `id_banco` (FK - uma corretora pode estar vinculada a um banco)
- `cnpj`
- `nome_completo`
- `nome_fantasia`
- `codigo_cvm`
- `tipo` (Corretora, DTVM)
- `status_operacional`
- `taxa_custodia_renda_variavel`
- `taxa_corretagem_padrao`
- `observacoes`
- `data_cadastro`
- `data_ultima_atualizacao`

---

### 3.4 Entidade: GESTORA

#### Descrição
Instituições responsáveis pela gestão dos recursos e estratégia de investimento dos fundos. A qualidade da gestora é crítica para o desempenho do fundo.

#### Campos
- `id_gestora` (PK)
- `cnpj`
- `nome_completo`
- `nome_fantasia`
- `codigo_cvm`
- `status_operacional`

**Indicadores de Porte e Experiência:**
- `patrimonio_sob_gestao` (R$ - AUM)
- `data_atualizacao_aum`
- `numero_fundos_geridos`
- `data_inicio_operacao`
- `anos_experiencia_mercado`

**Performance e Qualidade:**
- `filosofia_investimento` (Value, Growth, Quantitativa, Multi-estratégia, etc)
- `track_record` (texto descritivo de histórico)
- `premios_reconhecimentos` (texto)
- `rentabilidade_media_fundos` (% - indicador geral)

**Equipe:**
- `numero_gestores`
- `gestor_principal` (nome)
- `formacao_equipe` (texto descritivo)

**Governança:**
- `possui_compliance` (S/N)
- `historico_processos_cvm` (texto)
- `rating_governanca` (A, B, C)

**Auditoria:**
- `observacoes`
- `data_cadastro`
- `data_ultima_atualizacao`

---

### 3.5 Entidade: ADMINISTRADORA

#### Descrição
Instituições responsáveis pela administração fiduária e operacional dos fundos (escrituração, controles, compliance, relacionamento com investidores).

#### Campos
- `id_administradora` (PK)
- `id_banco` (FK - pode estar vinculada a um banco)
- `cnpj`
- `nome_completo`
- `nome_fantasia`
- `codigo_cvm`
- `status_operacional`

**Indicadores de Porte:**
- `patrimonio_administrado` (R$)
- `numero_fundos_administrados`
- `data_inicio_operacao`

**Qualidade dos Serviços:**
- `qualidade_relatorios` (avaliação: A, B, C)
- `qualidade_atendimento` (avaliação: A, B, C)
- `possui_certificacao_anbima` (S/N)
- `historico_irregularidades` (texto descritivo)
- `historico_processos_cvm` (texto)

**Controles:**
- `possui_auditoria_independente` (S/N)
- `auditor` (nome da empresa)
- `rating_controles_internos` (A, B, C)

**Taxas:**
- `taxa_administracao_padrao` (% a.a.)
- `taxa_performance_padrao` (% sobre o que exceder)

**Auditoria:**
- `observacoes`
- `data_cadastro`
- `data_ultima_atualizacao`

---

### 3.6 Entidade: USUARIO

#### Descrição
Investidores que possuem carteiras de investimento no sistema.

#### Campos
- `id_usuario` (PK)
- `cpf`
- `nome_completo`
- `email`
- `telefone`
- `perfil_investidor` (Conservador, Moderado, Agressivo)
- `data_cadastro`
- `ativo` (S/N)

---

### 3.7 Entidade: TIPO_INVESTIMENTO

#### Descrição
Domínio dos tipos de investimentos disponíveis no sistema.

#### Campos
- `id_tipo_investimento` (PK)
- `codigo` (CDB, LCI, LCA, LC, CRI, CRA, ACAO, FII, TESOURO_DIRETO, etc)
- `descricao`
- `classe` (RENDA_FIXA, RENDA_VARIAVEL, FUNDO)
- `possui_garantia_fgc_padrao` (S/N)
- `ativo` (S/N)

---

### 3.8 Entidade: INDEXADOR

#### Descrição
Índices que remuneram investimentos.

#### Campos
- `id_indexador` (PK)
- `codigo` (CDI, IPCA, SELIC, PRE, IGP-M, etc)
- `descricao`
- `tipo` (POS_FIXADO, INFLACAO, PRE_FIXADO, HIBRIDO)
- `ativo` (S/N)

---

### 3.9 Entidade: ORGAO_REGULADOR

#### Descrição
Órgãos e entidades reguladoras e autorreguladoras do mercado financeiro brasileiro. Utilizada para rastreabilidade de processos, certificações, intervenções e supervisão.

#### Campos
- `id_orgao_regulador` (PK)
- `sigla` (BACEN, CVM, ANBIMA, B3, PREVIC, SUSEP, CMN, etc)
- `nome_completo`
- `tipo` (REGULADOR, AUTORREGULADOR, FISCALIZADOR, INFRAESTRUTURA)
- `esfera` (FEDERAL, PRIVADO)
- `website`
- `descricao` (texto descritivo das atribuições)
- `data_criacao`
- `ativo` (S/N)
- `observacoes`
- `data_cadastro`

**Exemplos:**
- BACEN - Banco Central do Brasil
- CVM - Comissão de Valores Mobiliários
- ANBIMA - Associação Brasileira das Entidades dos Mercados Financeiro e de Capitais
- B3 - Brasil, Bolsa, Balcão
- PREVIC - Superintendência Nacional de Previdência Complementar
- SUSEP - Superintendência de Seguros Privados
- CMN - Conselho Monetário Nacional

---

### 3.10 Entidade: PENALIDADE

#### Descrição
Registro de penalidades, multas e processos administrativos aplicados por órgãos reguladores às instituições financeiras.

#### Campos
- `id_penalidade` (PK)
- `id_orgao_regulador` (FK -> ORGAO_REGULADOR)
- `tipo_instituicao` (BANCO, CORRETORA, SECURITIZADORA, GESTORA, ADMINISTRADORA)
- `id_instituicao` (ID da instituição - genérico)
- `numero_processo`
- `tipo_penalidade` (MULTA, ADVERTÊNCIA, SUSPENSÃO, INABILITAÇÃO, INTERVENÇÃO)
- `data_autuacao`
- `data_julgamento`
- `descricao` (texto descritivo da infração)
- `valor_multa`
- `status` (EM_ANDAMENTO, JULGADO, RECURSO, ARQUIVADO)
- `gravidade` (LEVE, MÉDIA, GRAVE, GRAVÍSSIMA)
- `link_documento` (URL para documento público)
- `observacoes`
- `data_cadastro`

---

### 3.11 Entidade: CERTIFICACAO

#### Descrição
Certificações, autorizações e registros concedidos por órgãos reguladores às instituições.

#### Campos
- `id_certificacao` (PK)
- `id_orgao_regulador` (FK -> ORGAO_REGULADOR)
- `tipo_instituicao` (BANCO, CORRETORA, SECURITIZADORA, GESTORA, ADMINISTRADORA)
- `id_instituicao` (ID da instituição - genérico)
- `tipo_certificacao` (REGISTRO_CVM, AUTORIZAÇÃO_BACEN, CERTIFICAÇÃO_ANBIMA, QUALIFICAÇÃO_PROFISSIONAL, etc)
- `numero_registro`
- `descricao`
- `data_concessao`
- `data_validade`
- `status` (ATIVO, SUSPENSO, CANCELADO, VENCIDO)
- `observacoes`
- `data_cadastro`

---

### 3.12 Entidade: INTERVENCAO_REGULATORIA

#### Descrição
Intervenções, regimes especiais e liquidações aplicadas pelo Banco Central em instituições financeiras.

#### Campos
- `id_intervencao` (PK)
- `id_banco` (FK -> BANCO)
- `id_orgao_regulador` (FK -> ORGAO_REGULADOR)
- `tipo_intervencao` (INTERVENÇÃO, LIQUIDAÇÃO_EXTRAJUDICIAL, RAET, REGIME_ESPECIAL, ADMINISTRAÇÃO_TEMPORÁRIA)
- `data_inicio`
- `data_fim`
- `motivo` (texto descritivo)
- `interventor_responsavel`
- `status` (EM_ANDAMENTO, CONCLUÍDO, TRANSFERIDO)
- `impacto_investidores` (texto descritivo)
- `link_documento`
- `observacoes`
- `data_cadastro`

---

### 3.13 Entidade: HISTORICO_IPCA

#### Descrição
Histórico e projeções mensais do IPCA. Permite trabalhar com valores reais divulgados pelo IBGE e projeções para meses futuros. Quando o valor real é publicado, o registro é atualizado de projetado (P) para real (R).

#### Campos
- `id` (PK)
- `ano` (YYYY)
- `mes` (1-12)
- `ipca` (valor percentual mensal)
- `tipo` (R = Real, P = Projetado) - valor padrão: P
- `data_cadastro`
- `data_ultima_atualizacao`

**Índices Únicos:**
- UNIQUE (ano, mes)

**Observações:**
- Valores projetados são inseridos inicialmente com `tipo = 'P'`
- Quando o IBGE divulga o valor oficial, o registro é atualizado para `tipo = 'R'` com o valor real
- Permite calcular rentabilidade futura com projeções e ajustar quando valores reais são publicados

---

### 3.14 Entidade: HISTORICO_SELIC

#### Descrição
Histórico e projeções mensais da Taxa SELIC. Permite trabalhar com valores reais divulgados pelo Banco Central e projeções para meses futuros. Quando o valor real é publicado, o registro é atualizado de projetado (P) para real (R).

#### Campos
- `id` (PK)
- `ano` (YYYY)
- `mes` (1-12)
- `selic` (taxa percentual mensal)
- `tipo` (R = Real, P = Projetado) - valor padrão: P
- `data_cadastro`
- `data_ultima_atualizacao`

**Índices Únicos:**
- UNIQUE (ano, mes)

**Observações:**
- Valores projetados são inseridos inicialmente com `tipo = 'P'`
- Quando o mês fecha e a SELIC consolidada é divulgada, o registro é atualizado para `tipo = 'R'` com o valor real
- Permite simular rentabilidade de investimentos indexados à SELIC (Tesouro Selic, fundos referenciados)

---

### 3.15 Entidade: FUNDO

#### Descrição
Fundos de investimento de diversos tipos (Renda Fixa, Multimercado, Ações, Cambial, ETF, Previdência, etc). Contém informações cadastrais e características do fundo.

**Observação:** Esta tabela não inclui FII (Fundos Imobiliários), FI-Infra (Fundos de Infraestrutura) e FIAGRO, que possuem estrutura e controle próprios.

#### Campos

**Identificação:**
- `id_fundo` (PK)
- `cnpj`
- `codigo_cvm`
- `nome_completo`
- `nome_abreviado`

**Classificação:**
- `tipo_fundo` (RENDA_FIXA, MULTIMERCADO, ACOES, CAMBIAL, ETF, PREVIDENCIA, etc)
- `classificacao_anbima` (RF Curto Prazo, RF Longo Prazo, Multimercado Livre, Ações Livre, etc)
- `publico_alvo` (VAREJO, QUALIFICADO, PROFISSIONAL)
- `condominio` (ABERTO, FECHADO)

**Gestão:**
- `id_gestora` (FK -> GESTORA)
- `id_administradora` (FK -> ADMINISTRADORA)
- `id_custodiante` (FK -> BANCO)

**Rentabilidade e Benchmark:**
- `benchmark` (CDI, IPCA+, IBOVESPA, IMA-B, etc)
- `objetivo_investimento` (texto descritivo)
- `estrategia` (texto descritivo)

**Taxas:**
- `taxa_administracao` (% a.a.)
- `taxa_performance` (% sobre o que exceder)
- `taxa_entrada` (% ou valor fixo)
- `taxa_saida` (% ou valor fixo)
- `possui_come_cotas` (S/N) - IR semestral

**Aplicação e Resgate:**
- `aplicacao_minima_inicial`
- `aplicacao_minima_adicional`
- `saldo_minimo_permanencia`
- `prazo_liquidacao_resgate` (D+n)
- `prazo_cotizacao_aplicacao` (D+n)
- `prazo_cotizacao_resgate` (D+n)
- `carencia_resgate_dias`

**Indicadores:**
- `patrimonio_liquido`
- `data_atualizacao_pl`
- `numero_cotistas`
- `cotacao_atual`
- `data_cotacao_atual`

**Datas:**
- `data_inicio`
- `data_encerramento`
- `status` (ATIVO, ENCERRADO, LIQUIDACAO, SUSPENSO)

**Auditoria:**
- `observacoes`
- `data_cadastro`
- `data_ultima_atualizacao`

---

### 3.16 Entidade: TIPO_FUNDO

#### Descrição
Domínio dos tipos de fundos de investimento existentes no mercado brasileiro. Permite classificação e acompanhamento específico por tipo, facilitando análises de adequação e performance por categoria.

**Observação:** Fundos Imobiliários (FII), Fundos de Infraestrutura (FI-Infra) e FIAGRO possuirão controle separado com estrutura própria, não sendo incluídos nesta categoria.

#### Campos
- `id_tipo_fundo` (PK)
- `codigo` (RF_CP, RF_LP, RF_REF_DI, MM_MACRO, MM_LIVRE, AC_LIVRE, AC_DIVIDENDOS, CAMBIAL, ETF_RENDA_FIXA, ETF_ACOES, PREVIDENCIA, etc)
- `descricao`
- `classe_principal` (RENDA_FIXA, MULTIMERCADO, ACOES, CAMBIAL, PREVIDENCIA, ETF)
- `subclasse` (texto descritivo da subcategoria ANBIMA)
- `permite_alavancagem` (S/N)
- `tem_tributacao_especial` (S/N) - ex: fundos de longo prazo, previdência
- `descricao_estrategia` (texto explicativo da estratégia típica)
- `publico_alvo_padrao` (VAREJO, QUALIFICADO, PROFISSIONAL)
- `benchmark_comum` (índice de referência mais comum para este tipo)
- `perfil_risco` (CONSERVADOR, MODERADO, AGRESSIVO)
- `ativo` (S/N)
- `observacoes`
- `data_cadastro`

**Exemplos de Tipos:**
- **RF_CP** - Renda Fixa Curto Prazo
- **RF_LP** - Renda Fixa Longo Prazo
- **RF_REF_DI** - Renda Fixa Referenciado DI
- **RF_DURACAO_ALTA** - Renda Fixa Duração Alta Grau de Investimento
- **MM_MACRO** - Multimercado Macro
- **MM_LIVRE** - Multimercado Livre
- **MM_JUROS_MOEDAS** - Multimercado Juros e Moedas
- **MM_LONG_SHORT** - Multimercado Long and Short
- **MM_BALANCEADO** - Multimercado Balanceado
- **AC_LIVRE** - Ações Livre
- **AC_IBOVESPA_ATIVO** - Ações Ibovespa Ativo
- **AC_DIVIDENDOS** - Ações Dividendos
- **AC_SMALL_CAPS** - Ações Small Caps
- **CAMBIAL** - Cambial
- **ETF_RENDA_FIXA** - ETF de Renda Fixa
- **ETF_ACOES** - ETF de Ações
- **PREVIDENCIA** - Fundo de Previdência (PGBL/VGBL)

---

## 4. Decisões de Modelagem – Renda Fixa

Os seguintes investimentos de renda fixa serão representados inicialmente por uma única tabela:

CDB, LCI, LCA, LC, CRI, CRA.

### 4.1 Uso dos Índices Históricos

As tabelas de histórico de índices (IPCA, SELIC) são fundamentais para:

**Cálculos de Rentabilidade:**
- Calcular rentabilidade real (descontando IPCA)
- Projetar valores futuros com base em histórico
- Simular cenários de rentabilidade

**Análises Comparativas:**
- Comparar performance de investimentos vs benchmarks
- Avaliar se investimento bateu inflação
- Ranking de investimentos por rentabilidade real

**Relatórios e Dashboards:**
- Gráficos de evolução patrimonial ajustada pela inflação
- Análise de ganho real acumulado
- Projeções de aposentadoria

**Seleção de Investimentos:**
- Calcular taxa real necessária para atingir objetivos
- Avaliar atratividade de taxas oferecidas
- Comparar diferentes indexadores

---

## 5. Entidade: INV_RF

### Descrição
Tabela unificada para investimentos de renda fixa adquiridos por usuários.

### Campos

**Identificação:**
- `id_inv_rf` (PK)
- `id_usuario` (FK -> USUARIO)
- `id_tipo_investimento` (FK -> TIPO_INVESTIMENTO)
- `id_banco_emissor` (FK -> BANCO) - para CDB, LCI, LCA, LC
- `id_securitizadora` (FK -> SECURITIZADORA) - para CRI, CRA
- `id_corretora` (FK -> CORRETORA)
- `codigo_ativo` (código interno do emissor/corretora)

**Datas:**
- `data_aplicacao`
- `data_vencimento`
- `data_liquidacao` (quando o valor entra na conta)

**Valores:**
- `valor_aplicado`
- `valor_liquido_aplicado` (após taxas)

**Rentabilidade:**
- `id_indexador` (FK -> INDEXADOR)
- `percentual_indexador` (ex: 100% do CDI = 100.00)
- `taxa_prefixada` (para investimentos pré ou híbridos)
- `tipo_rentabilidade` (POS_FIXADO, PRE_FIXADO, HIBRIDO)

**Liquidez e Garantias:**
- `liquidez` (VENCIMENTO, DIARIA, D+n)
- `dias_carencia`
- `possui_garantia_fgc` (S/N)
- `valor_garantido_fgc` (calculado)

**Cupons:**
- `possui_cupom` (S/N)
- `periodicidade_cupom` (MENSAL, TRIMESTRAL, SEMESTRAL, ANUAL)

**Taxas e Custos:**
- `taxa_administracao` (% a.a.)
- `taxa_custodia` (% a.a. ou valor fixo)
- `iof_aplicavel` (S/N)

**Status:**
- `status` (ATIVO, RESGATADO, VENCIDO)
- `data_resgate`
- `valor_resgate_bruto`
- `valor_resgate_liquido`

**Auditoria:**
- `data_cadastro`
- `data_ultima_atualizacao`
- `observacoes`

---

## 6. Entidade: INV_RF_CUPOM

### Descrição
Tabela de cupons (pagamentos periódicos) de investimentos de renda fixa.

### Campos
- `id_inv_rf_cupom` (PK)
- `id_inv_rf` (FK -> INV_RF)
- `numero_cupom` (sequencial)
- `data_prevista_pagamento`
- `data_efetiva_pagamento`
- `valor_bruto`
- `valor_ir` (Imposto de Renda retido)
- `valor_liquido`
- `periodo_referencia_inicio`
- `periodo_referencia_fim`
- `status` (PREVISTO, PAGO, CANCELADO)
- `data_cadastro`

---

## 7. Entidade: INV_FUNDO

### Descrição
Tabela para controle de investimentos dos usuários em fundos. Registra aplicações, resgates e permite acompanhamento da posição atual, rentabilidade e aderência aos fundamentos que motivaram o investimento inicial.

### Campos

**Identificação:**
- `id_inv_fundo` (PK)
- `id_usuario` (FK -> USUARIO)
- `id_fundo` (FK -> FUNDO)
- `id_tipo_fundo` (FK -> TIPO_FUNDO) - redundante com FUNDO, mas facilita consultas
- `id_corretora` (FK -> CORRETORA) - onde o investimento foi realizado

**Aplicação Inicial:**
- `data_aplicacao_inicial`
- `valor_aplicacao_inicial`
- `quantidade_cotas_inicial`
- `valor_cota_aplicacao_inicial`

**Posição Atual:**
- `quantidade_cotas_atual`
- `valor_aplicado_total` (soma de todas as aplicações)
- `valor_resgatado_total` (soma de todos os resgates)
- `saldo_investido` (aplicado - resgatado)

**Acompanhamento de Fundamentos:**
- `rentabilidade_objetivo` (% esperada ao aplicar)
- `benchmark_objetivo` (qual índice deveria superar)
- `motivo_investimento` (texto descritivo: "baixa volatilidade", "dividend yield", "exposição small caps", etc)
- `thesis_investimento` (texto descritivo da tese: por que esse fundo?)
- `indicadores_entrada` (JSON ou texto: PL, número cotistas, sharpe, volatilidade no momento da entrada)

**Monitoramento de Performance:**
- `alerta_performance` (S/N) - se fundo está abaixo do esperado
- `alerta_gestao` (S/N) - se gestora mudou ou há problemas
- `alerta_taxas` (S/N) - se taxas aumentaram
- `alerta_estrategia` (S/N) - se fundo mudou estratégia (drift)
- `data_ultimo_review` (data da última análise de adequação)
- `avaliacao_atual` (MANTER, OBSERVAR, RESGATAR)

**Taxas e Custos Efetivos:**
- `taxa_administracao_efetiva` (pode mudar ao longo do tempo)
- `taxa_performance_efetiva`
- `taxa_entrada_paga`
- `taxa_saida_estimada`

**Status:**
- `status` (ATIVO, RESGATADO, PARCIALMENTE_RESGATADO)
- `data_resgate_total` (se aplicável)
- `motivo_saida` (texto: "mudança de estratégia", "necessidade de liquidez", "perda de fundamento", etc)

**Rentabilidade e IR:**
- `rentabilidade_acumulada` (%)
- `valor_ir_retido_total` (come-cotas + IR no resgate)
- `valor_taxa_performance_paga` (acumulado)

**Auditoria:**
- `observacoes`
- `data_cadastro`
- `data_ultima_atualizacao`

---

## 8. Entidade: INV_FUNDO_MOVIMENTACAO

### Descrição
Histórico detalhado de todas as movimentações (aplicações e resgates) em fundos. Permite rastreamento completo do fluxo de caixa e cálculo preciso de rentabilidade.

### Campos
- `id_movimentacao` (PK)
- `id_inv_fundo` (FK -> INV_FUNDO)
- `tipo_movimentacao` (APLICACAO, RESGATE, AMORTIZACAO)
- `data_solicitacao`
- `data_cotizacao` (data da cota usada)
- `data_liquidacao` (quando o dinheiro entra/sai da conta)
- `valor_financeiro` (valor em R$)
- `quantidade_cotas`
- `valor_cota`
- `taxa_saida` (se aplicável)
- `ir_retido` (se aplicável no resgate)
- `taxa_performance_retida` (se aplicável)
- `valor_liquido` (valor final após taxas e IR)
- `observacoes`
- `data_cadastro`

---

## 9. Entidade: INV_FUNDO_REVIEW

### Descrição
Tabela para registrar análises periódicas dos fundos investidos. Permite acompanhar se o fundo mantém os fundamentos que motivaram o investimento e se continua adequado à estratégia do investidor.

### Campos
- `id_review` (PK)
- `id_inv_fundo` (FK -> INV_FUNDO)
- `data_review`
- `id_usuario` (FK -> USUARIO) - quem fez a análise

**Indicadores no Momento do Review:**
- `patrimonio_liquido_fundo`
- `numero_cotistas`
- `rentabilidade_12m` (%)
- `rentabilidade_24m` (%)
- `rentabilidade_36m` (%)
- `volatilidade_12m` (%)
- `sharpe_ratio` (se aplicável)
- `percentual_cdi_12m` (% do CDI - para fundos RF)
- `percentual_ibovespa_12m` (% do Ibovespa - para fundos de ações)

**Análise de Aderência:**
- `manteve_estrategia` (S/N)
- `gestora_mudou` (S/N)
- `taxas_aumentaram` (S/N)
- `performance_vs_benchmark` (ACIMA, IGUAL, ABAIXO)
- `performance_vs_pares` (ACIMA_MEDIA, MEDIA, ABAIXO_MEDIA) - comparado com fundos similares
- `liquidez_adequada` (S/N)

**Pontos de Atenção:**
- `pontos_positivos` (texto descritivo)
- `pontos_negativos` (texto descritivo)
- `riscos_identificados` (texto descritivo)
- `mudancas_relevantes` (texto descritivo de mudanças desde último review)

**Decisão:**
- `decisao` (MANTER, AUMENTAR_POSICAO, REDUZIR_POSICAO, RESGATAR_TOTAL)
- `justificativa_decisao` (texto explicativo)
- `prazo_proximo_review` (data sugerida para próxima análise)

**Auditoria:**
- `observacoes`
- `data_cadastro`

**Observações:**
- Esta tabela permite manter histórico de avaliações ao longo do tempo
- Facilita identificar quando e por que um fundo deixou de ser adequado
- Ajuda a evitar viés de confirmação ao documentar análises periódicas

---

## 10. Próximos Passos na Modelagem

### 10.1 Renda Variável
- Tabela de ACAO (ações)
- Tabela de TRANSACAO_RV (compras e vendas)
- Tabela de PROVENTOS (dividendos, JCP, etc)
- Tabela de COTACOES (histórico de preços)

### 10.2 Fundos Imobiliários, Infraestrutura e FIAGRO
- Tabela de FII_FIAGRO_INFRA (fundos imobiliários, FIAGRO e infraestrutura)
- Tabela de INV_FII_FIAGRO_INFRA (investimentos do usuário)
- Tabela de FII_FIAGRO_INFRA_PROVENTO (distribuições)
- Tabela de FII_FIAGRO_INFRA_TRANSACAO (compras e vendas)

### 10.3 Tesouro Direto
- Pode utilizar INV_RF ou tabela específica

### 10.4 Visões e Relatórios
- View de posição consolidada por usuário
- View de rentabilidade acumulada
- View de vencimentos futuros
- View de exposição por emissor
- View de fundos que exigem review (baseado em alertas e data_ultimo_review)
- View de performance de fundos vs benchmark

---

## 11. Histórico
**v1.0** – Documento inicial  
**v1.1** – Expansão da entidade BANCO com indicadores de solidez e risco; Adição de entidades fundamentais (CORRETORA, USUARIO, TIPO_INVESTIMENTO, INDEXADOR); Refinamento de INV_RF com campos de rentabilidade, liquidez e custos  
**v1.2** – Adição de entidades SECURITIZADORA, GESTORA e ADMINISTRADORA com indicadores de qualidade e confiabilidade; Diferenciação entre emissores (banco vs securitizadora) em INV_RF  
**v1.3** – Adição de estrutura regulatória: ORGAO_REGULADOR, PENALIDADE, CERTIFICACAO e INTERVENCAO_REGULATORIA para rastreabilidade de supervisão e compliance  
**v1.4** – Adição de tabelas de histórico de índices econômicos: HISTORICO_IPCA e HISTORICO_SELIC simplificadas com campo tipo (Real/Projetado) para cálculos de rentabilidade real, projeções e análises comparativas  
**v1.5** – Adição da entidade FUNDO para controle de fundos de investimento (RF, Multimercado, Ações, etc) com relacionamento com Gestora e Administradora  
**v1.6** – Adição de entidades para investimentos em fundos: TIPO_FUNDO (domínio de tipos de fundos brasileiros), INV_FUNDO (investimentos do usuário em fundos), INV_FUNDO_MOVIMENTACAO (histórico de aplicações/resgates) e INV_FUNDO_REVIEW (análises periódicas para monitoramento de fundamentos e aderência à estratégia)
