# ESTRUTURA DA TABELA CORRETORAS - DADOS PARA BUSCA

## Estrutura dos Campos

```
id_corretora          - SERIAL (auto-incremento, não informar)
cnpj                  - VARCHAR(18) - Formato: 14 dígitos sem formatação
nome_completo         - VARCHAR(255) - Razão social completa
nome_fantasia         - VARCHAR(100) - Nome comercial
codigo_cvm            - VARCHAR(20) - Código CVM (pode ser NULL)
status                - VARCHAR(20) - Valores: 'Ativa', 'Inativa', 'Suspensa'
email_insitucional    - VARCHAR(100) - E-mail institucional
telefone_institucional - VARCHAR(30) - Telefone de contato
website               - VARCHAR(255) - Site oficial (pode ser NULL)
observacoes           - TEXT - Observações gerais (pode ser NULL)
data_cadastro         - TIMESTAMP - Auto-preenchido (não informar)
data_ultima_atualizacao - TIMESTAMP - Pode ser NULL
```

## Corretoras JÁ CADASTRADAS (NÃO REPETIR)

1. **XP Investimentos** - CNPJ: 02332886000104
2. **Toro Investimentos** - CNPJ: 29162769000198
3. **Avenue** - CNPJ: 29480786000173
4. **Nomad** - CNPJ: 34662852000166
5. **BTG Pactual** - CNPJ: 30306294000145

## SOLICITAR PARA IA

"Liste 10 corretoras de valores importantes do Brasil (diferentes das já cadastradas acima) com os seguintes dados REAIS e VERIFICADOS:

- CNPJ (14 dígitos, sem formatação)
- Nome Completo (razão social oficial registrada na CVM)
- Nome Fantasia (nome comercial)
- Código CVM (se disponível na CVM)
- Status (Ativa/Inativa/Suspensa - verificar situação atual)
- E-mail institucional de contato
- Telefone institucional (com DDD)
- Website oficial
- Observações relevantes

Priorizar corretoras conhecidas como: Rico, Clear, Modal, Inter, Nubank, Ágora, Easynvest, Genial, Guide, Órama, etc."

## Formato de Resposta Esperado

Para cada corretora, fornecer:
```
Corretora 1:
- CNPJ: XXXXX
- Nome Completo: XXXXX
- Nome Fantasia: XXXXX
- Código CVM: XXXXX
- Status: Ativa
- E-mail: XXXXX
- Telefone: XXXXX
- Website: XXXXX
- Observações: XXXXX
```
