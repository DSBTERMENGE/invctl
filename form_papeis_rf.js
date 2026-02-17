// Importações do sistema de debug (sempre primeiro)
import { flow_marker, error_catcher } from '../framework_dsb/frontend/General_Classes/Debugger.js';
// Importações de gerenciamento de eventos
import { criarListener, desabilitarControlesDeFrm, popularSelectPorConfiguracao, form_listener } from '../framework_dsb/frontend/General_Classes/FuncoesAuxilares.js';

import FormComum from "../framework_dsb/frontend/General_Classes/ConstrutorDeForms.js";
import { abrirModalNovo, abrirModalComValores } from './modal_selecoes_rf.js';
import { 
    popularFormulario,
    processarFiltroSelect,
    construirFiltroInicial,
} from '../framework_dsb/frontend/General_Classes/OperacoesCRUD.js';


/*
************************************************************
        FORMULÁRIO DE PAPEIS RF - INVCTL
        📋 PADRÃO REFERÊNCIA PARA GRUPO PAPÉIS
************************************************************

Este arquivo implementa o formulário para cadastro de papéis
de renda fixa disponíveis no mercado (produtos).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 PADRÃO ARQUITETURAL - GRUPO PAPÉIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 ESTE FORMULÁRIO DEFINE O PADRÃO PARA TODOS OS FORMS DO GRUPO PAPÉIS
   (form_papeis_rf.js, form_acoes.js, form_fundos_imobiliarios.js, etc)

1️⃣ CAMPOS READONLY COM MODAL DE SELEÇÃO:
   ✅ Campos preenchidos via modal (tipo_investimento_nome, banco_emissor_nome, indexador_nome)
   ✅ Usar readOnly (NÃO disabled) com backgroundColor: '#f0f0f0'
   ✅ IDs ocultos (id_tipo_investimento, id_banco_emissor, id_indexador) como type: 'hidden'
   ❌ NUNCA usar disabled nos campos readonly (quebra envio de dados)

2️⃣ MODAL DE SELEÇÃO - PADRÃO DE RETORNO:
   ✅ Modal dispara CustomEvent 'modal-selecoes-confirmadas'
   ✅ Retorna { valores: {...}, textos: {...} }
   ✅ CHAVES DO OBJETO textos devem usar SUFIXO '_nome':
      - 'tipo_investimento_nome' (não 'id_tipo_investimento')
      - 'banco_emissor_nome' (não 'id_banco_emissor')
      - 'indexador_nome' (não 'id_indexador')
   ✅ Função obterTextosCombo() faz mapeamento ID → nome do campo readonly

3️⃣ LISTENER DO FORMULÁRIO:
   ✅ Escuta evento do modal: addEventListener('modal-selecoes-confirmadas')
   ✅ Extrai { valores, textos } de e.detail
   ✅ Atribui valores DIRETAMENTE: document.getElementById('campo').value = valores.campo
   ❌ NUNCA usar setTimeout para atribuir valores
   ❌ NUNCA manipular disabled após atribuição

4️⃣ CAMPOS MONETÁRIOS COM CARACTERES ESPECIAIS:
   ✅ Usar format: 'texto' (não 'moeda') no FieldConfig
   ✅ Adicionar formatação manual no HTML: data-format="valor"
   ✅ Implementar listeners de formatação (formatarCampoValor, removerFormatacao)
   ✅ Padrão: R$ 1.234,56 (ponto milhar, vírgula decimal)

5️⃣ VIEWS E BACKEND:
   ✅ Views devem usar SUFIXO '_nome' para campos texto (tipo_investimento_nome)
   ❌ Backend rejeita campos com sufixos não padronizados
   ✅ OperacoesCRUD.js filtra campos VIEW antes de enviar ao backend
   ✅ Backend usa information_schema.columns para validar campos da tabela
   ✅ PK descoberta automática via information_schema.table_constraints

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 REGRAS DE NEGÓCIO - PAPÉIS RF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 PREENCHIMENTO DAS TAXAS:

1. TIPO_RENTABILIDADE = 'PRE_FIXADO':
   - taxa_prefixada: Informar taxa fixa (ex: 12.5 para 12,5% a.a.)
   - percentual_indexador: DEIXAR VAZIO
   - Exemplo: CDB prefixado 13% → taxa_prefixada=13, percentual_indexador=null

2. TIPO_RENTABILIDADE = 'POS_FIXADO':
   - taxa_prefixada: DEIXAR VAZIO
   - percentual_indexador: Informar % do indexador (ex: 110 para 110% do CDI)
   - Exemplo: CDB 105% CDI → taxa_prefixada=null, percentual_indexador=105

3. TIPO_RENTABILIDADE = 'HIBRIDO':
   - taxa_prefixada: Informar APENAS a parte fixa/prêmio (ex: 5 para IPCA+5%)
   - percentual_indexador: DEIXAR VAZIO (o indexador já é 100% por definição)
   - Exemplo: CDB IPCA+6% → taxa_prefixada=6, percentual_indexador=null

NOTA: IPCA, CDI, SELIC já são indexadores percentuais. No híbrido, 
      somamos TAXA FIXA + INDEXADOR (ex: 5% + IPCA = IPCA+5%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  ERROS COMUNS A EVITAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ Usar disabled em campos readonly → Dados não são enviados no POST
❌ Modal retornar textos[id_campo] → Form espera textos[campo_nome]
❌ Usar format: 'moeda' com R$ → Backend rejeita caracteres inválidos
❌ Comparar com form_inv_rf.js → É do grupo INVESTIMENTOS, não PAPÉIS
✅ Referência correta: form_acoes.js (grupo papéis)

*/

// ============= 1. CONSTRUÇÃO DO FORMULÁRIO =============

/**
 * 🏗️ CONSTRUTOR PRINCIPAL: Formulário de Papéis RF
 */
export function construirFormularioPapeisRF() {
    console.log('🏗️ [v2.1] Construindo formulário Papéis RF - SELECT: Papel + Descrição');
    
    const formPapeisRF = new FormComum();
    
    // ✅ CONFIGURAÇÃO POR PROPRIEDADES
    formPapeisRF.titulo = 'Papéis de Renda Fixa';
    formPapeisRF.descricao = ' - Cadastro de papéis disponíveis no mercado';
    formPapeisRF.tipo = [
        'input',    // id_tipo_investimento (HIDDEN - ID para salvar)
        'input',    // id_banco_emissor (HIDDEN - ID para salvar)
        'input',    // id_indexador (HIDDEN - ID para salvar)
        'input',    // tipo_investimento_nome (READONLY - mostra CDB, LCI, etc)
        'input',    // banco_emissor_nome (READONLY - mostra nome do banco)
        'input',    // indexador_nome (READONLY - mostra CDI, IPCA, etc)
        'input',    // tipo_rentabilidade (READONLY - já é texto)
        'input',    // liquidez (READONLY - já é texto)
        'input',    // garantia_fgc (READONLY - já é texto)
        'input',    // iof_aplicavel (READONLY - já é texto)
        'input',    // ativo (READONLY - já é texto)
        'input',    // codigo_ativo
        'input',    // descricao
        'data',     // data_emissao
        'data',     // data_vencimento
        'input',    // valor_nominal
        'input',    // taxa_prefixada
        'input',    // percentual_indexador
        'input',    // taxa_administracao
        'input',    // taxa_custodia
        'textarea'  // observacoes
    ]; 
    formPapeisRF.label = [
        '',                      // id_tipo_investimento (hidden, sem label)
        '',                      // id_banco_emissor (hidden, sem label)
        '',                      // id_indexador (hidden, sem label)
        'Papel',                 // tipo_investimento_nome (readonly - mostra CDB, LCI)
        'Banco Emissor',         // banco_emissor_nome (readonly - mostra nome do banco)
        'Indexador',             // indexador_nome (readonly - mostra CDI, IPCA, etc)
        'Tipo Rent.',            // tipo_rentabilidade (readonly)
        'Liquidez',              // liquidez (readonly)
        'FGC',                   // garantia_fgc (readonly)
        'IOF',                   // iof_aplicavel (readonly)
        'Ativo',                 // ativo (readonly)
        'Código',
        'Descrição',
        'Dt Emissão',
        'Dt Vencimento',
        'Vlr Nominal',
        'Taxa Pré (%)',          // REGRA: PRÉ-FIXADO: taxa fixa (ex: 12%). HÍBRIDO: parte fixa (ex: IPCA+5%, informar 5)
        'Taxa Pré Parcial (%)', // REGRA: PÓS-FIXADO: % do indexador (ex: 110% CDI, informar 110). HÍBRIDO: não usar
        'Taxa Adm (%)',
        'Taxa Cust (%)',
        'Obs'
    ];
    formPapeisRF.nomeCampo = [
        'id_tipo_investimento',       // 1 (hidden - ID)
        'id_banco_emissor',           // 2 (hidden - ID)
        'id_indexador',               // 3 (hidden - ID)
        'tipo_investimento_nome',     // 4 (readonly - será filtrado pelo framework)
        'banco_emissor_nome',         // 5 (readonly - será filtrado pelo framework)
        'indexador_nome',             // 6 (readonly - será filtrado pelo framework)
        'tipo_rentabilidade',         // 7 (readonly - mostra PRE_FIXADO, POS_FIXADO, HIBRIDO)
        'liquidez',                   // 8 (readonly - mostra DIARIA, VENCIMENTO, PARCIAL)
        'garantia_fgc',               // 9 (readonly - mostra S ou N)
        'iof_aplicavel',              // 10 (readonly - mostra S ou N)
        'ativo',                      // 11 (readonly - mostra S ou N)
        'codigo_ativo',               // 12
        'descricao',                  // 13
        'data_emissao',               // 14
        'data_vencimento',            // 15
        'valor_nominal',              // 16
        'taxa_prefixada',             // 17
        'percentual_indexador',       // 18
        'taxa_administracao',         // 19
        'taxa_custodia',              // 20
        'observacoes'                 // 21
    ];
    formPapeisRF.format = [
        null,        // id_tipo_investimento (hidden)
        null,        // id_banco_emissor (hidden)
        null,        // id_indexador (hidden)
        'texto',     // tipo_investimento_nome (readonly)
        'texto',     // banco_emissor_nome (readonly)
        'texto',     // indexador_nome (readonly)
        'texto',     // tipo_rentabilidade (readonly)
        'texto',     // liquidez (readonly)
        'texto',     // garantia_fgc (readonly)
        'texto',     // iof_aplicavel (readonly)
        'texto',     // ativo (readonly)
        'texto',     // codigo_ativo
        'texto',     // descricao
        'data',      // data_emissao
        'data',      // data_vencimento
        'texto',     // valor_nominal (formatação manual)
        'pct',       // taxa_prefixada
        'pct',       // percentual_indexador
        'pct',       // taxa_administracao
        'pct',       // taxa_custodia
        'texto'      // observacoes
    ];
    formPapeisRF.pos = [
        {linha: 0, coluna: 0}, // id_tipo_investimento (hidden)
        {linha: 0, coluna: 1}, // id_banco_emissor (hidden)
        {linha: 0, coluna: 2}, // id_indexador (hidden)
        {linha: 1, coluna: 0}, // tipo_investimento_nome (readonly - Papel)
        {linha: 1, coluna: 1}, // banco_emissor_nome (readonly)
        {linha: 1, coluna: 2}, // indexador_nome (readonly)
        {linha: 1, coluna: 3}, // tipo_rentabilidade (readonly)
        {linha: 2, coluna: 0}, // liquidez
        {linha: 2, coluna: 1}, // garantia_fgc
        {linha: 2, coluna: 2}, // iof_aplicavel
        {linha: 2, coluna: 3}, // ativo
        {linha: 2, coluna: 4}, // codigo_ativo
        {linha: 2, coluna: 5}, // descricao
        {linha: 3, coluna: 0}, // data_emissao
        {linha: 3, coluna: 1}, // data_vencimento
        {linha: 3, coluna: 2}, // valor_nominal
        {linha: 4, coluna: 0}, // taxa_prefixada
        {linha: 4, coluna: 1}, // percentual_indexador
        {linha: 4, coluna: 2}, // taxa_administracao
        {linha: 4, coluna: 3}, // taxa_custodia
        {linha: 5, coluna: 0}  // observacoes
    ];
    formPapeisRF.alinhamento = [
        'H', 'H', 'H',                   // linha 0: 3 IDs hidden
        'H', 'H', 'H', 'H',              // linha 1: 4 campos readonly (papel, banco, indexador, tipo_rent)
        'H', 'H', 'H', 'H', 'H', 'H',    // linha 2: liquidez, fgc, iof, ativo, codigo, descricao
        'H', 'H', 'H',                   // linha 3: datas, valor
        'H', 'H', 'H', 'H',              // linha 4: taxas
        'V'                              // linha 5: observacoes
    ]; 
    formPapeisRF.largCampos = [
        0, 0, 0,                // 3 IDs hidden
        8, 15, 8, 12,           // Papel, Banco, Indexador, tipo_rent (readonly linha 1)
        7, 3, 3, 5, 5, 21,      // Liquidez, FGC, IOF, Ativo, Código, Descrição (linha 2)
        8, 8, 10,               // Datas, Valor Nominal
        6, 6, 6, 6,             // Taxas
        50                      // Observações
    ]; 
    formPapeisRF.posicaoCanvas = {x: 3, y: 5}; 
    formPapeisRF.grupoBotoes = ['S', 'S', 'S']; // Encerrar + Navegação + CRUD
    
    window.api_info.tabela_alvo = 'papeis_rf'; 
    window.api_info.campos_obrigatorios = ['id_tipo_investimento', 'id_banco_emissor', 'id_indexador', 'codigo_ativo']; 
    window.api_info.view = "papeis_rf_view"; 
    window.api_info.campos = ['Todos']; 
    
    window.api_info.pk = 'id_papel_rf'; 
    window.api_info.campos_relacionados = ['id_tipo_investimento', 'id_banco_emissor', 'id_indexador'];
    
    // Configuração da select de pesquisa
    formPapeisRF.configSelects = {
        labels: ['Papel'],
        campos: ['papel_descricao'],
        larguras: ['400px'],
        campo_exibir: ['papel_descricao'],
        campo_value: ['id_papel_rf'],
        arranjo: 'linha'
    };

    // ✅ RENDERIZAÇÃO MANUAL
    formPapeisRF.render();
    
    // ============= INTEGRAÇÃO COM MODAL DE SELEÇÕES =============
    
    // Ocultar campos hidden e tornar campos texto readonly
    setTimeout(() => {
        // Campos hidden (IDs)
        const camposHidden = ['id_tipo_investimento', 'id_banco_emissor', 'id_indexador'];
        camposHidden.forEach(campo => {
            const input = document.getElementById(campo);
            if (input) {
                input.type = 'hidden';
            }
        });
        
        // Campos readonly (textos)
        const camposTexto = [
            'tipo_investimento_nome', 'banco_emissor_nome', 'indexador_nome', 'tipo_rentabilidade', 'liquidez', 
            'garantia_fgc', 'iof_aplicavel', 'ativo'
        ];
        
        camposTexto.forEach(campo => {
            const input = document.getElementById(campo);
            if (input) {
                input.readOnly = true;
                input.style.backgroundColor = '#f0f0f0';
                input.style.cursor = 'not-allowed';
                input.placeholder = '(Configurar via modal)';
            }
        });
        
        console.log('✅ Campos hidden e readonly configurados');
        
        // ============= FORMATAÇÃO MANUAL DE CAMPOS MONETÁRIOS =============
        // Adicionar formatação automática no campo de valor (padrão usado em form_inv_rf.js)
        const campoValor = document.getElementById('valor_nominal');
        if (campoValor) {
            // Marca como campo monetário para conversão ao salvar
            campoValor.setAttribute('data-format', 'valor');
            
            // Formatar valor inicial se vier do banco (número puro)
            const valorInicial = campoValor.value;
            if (valorInicial && !isNaN(valorInicial) && valorInicial.trim() !== '') {
                const numero = parseFloat(valorInicial);
                if (!isNaN(numero)) {
                    campoValor.value = numero.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                }
            }
            
            // Formatação ao sair do campo
            campoValor.addEventListener('blur', function() {
                let valor = this.value.trim();
                if (!valor || valor === '') return; // Se vazio, não faz nada
                
                // Remove tudo exceto números, vírgula e ponto
                valor = valor.replace(/[^\d.,]/g, '');
                if (!valor) return; // Se ficou vazio após limpeza, não faz nada
                
                // Converte para número (aceita tanto 1234.56 quanto 1.234,56)
                let numero;
                if (valor.includes(',')) {
                    // Formato brasileiro: remove pontos e troca vírgula por ponto
                    numero = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
                } else {
                    // Formato americano ou número puro
                    numero = parseFloat(valor);
                }
                
                if (!isNaN(numero) && numero >= 0) {
                    // Formata com 2 casas decimais e separador de milhares
                    this.value = numero.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                }
            });
        }
    }, 300);
    
    // Listener para receber valores do modal
    document.addEventListener('modal-selecoes-confirmadas', (e) => {
        console.log('📥 Valores recebidos do modal:', e.detail);
        
        const { valores, textos } = e.detail;
        
        // Preenche campos HIDDEN com IDs
        document.getElementById('id_tipo_investimento').value = valores.id_tipo_investimento || '';
        document.getElementById('id_banco_emissor').value = valores.id_banco_emissor || '';
        document.getElementById('id_indexador').value = valores.id_indexador || '';
        
        // Preenche campos READONLY com textos
        document.getElementById('tipo_investimento_nome').value = textos.tipo_investimento_nome || '';
        document.getElementById('banco_emissor_nome').value = textos.banco_emissor_nome || '';
        document.getElementById('indexador_nome').value = textos.indexador_nome || '';
        
        // Preenche campos READONLY com valores S/N ou textos
        document.getElementById('tipo_rentabilidade').value = valores.tipo_rentabilidade || '';
        document.getElementById('liquidez').value = valores.liquidez || '';
        document.getElementById('garantia_fgc').value = valores.garantia_fgc || '';
        document.getElementById('iof_aplicavel').value = valores.iof_aplicavel || '';
        document.getElementById('ativo').value = valores.ativo || '';
        
        console.log('✅ Valores transferidos: IDs nos hidden, textos nos readonly');
        alert('✅ Parâmetros configurados com sucesso!\n\nAgora preencha os demais campos e salve o registro.');
    });
    
    // Listener para interceptar ações do formulário (INCLUIR e EDITAR)
    // Registra apenas UMA VEZ para evitar duplicação
    if (!window._listenerPapeisRfRegistrado) {
        document.addEventListener('formulario-acao', (e) => {
            console.log('🎯 Evento formulario-acao:', e.detail);
            
            // Verifica se o evento é para a tabela 'papeis_rf'
            if (window.api_info?.tabela_alvo !== 'papeis_rf') {
                console.log('⏭️ Ignorando evento - tabela atual:', window.api_info?.tabela_alvo);
                return; // Ignora evento de outras tabelas
            }
            
            if (e.detail.acao === 'incluir') {
                console.log('🆕 Ação INCLUIR detectada - abrindo modal...');
                setTimeout(() => abrirModalNovo(), 300);
            } else if (e.detail.acao === 'editar') {
                console.log('✏️ Ação EDITAR detectada - abrindo modal com valores atuais...');
                const valoresAtuais = {
                    id_tipo_investimento: document.getElementById('id_tipo_investimento')?.value,
                    id_banco_emissor: document.getElementById('id_banco_emissor')?.value,
                    id_indexador: document.getElementById('id_indexador')?.value,
                    tipo_rentabilidade: document.getElementById('tipo_rentabilidade')?.value,
                    liquidez: document.getElementById('liquidez')?.value,
                    garantia_fgc: document.getElementById('garantia_fgc')?.value,
                    iof_aplicavel: document.getElementById('iof_aplicavel')?.value,
                    ativo: document.getElementById('ativo')?.value
                };
                setTimeout(() => abrirModalComValores(valoresAtuais), 300);
            }
        }, true); // Captura na fase de capture para interceptar ANTES do framework processar
        
        window._listenerPapeisRfRegistrado = true;
        console.log('✅ Listener papeis_rf registrado (UNICO)');
    }
    
    // Popula select de pesquisa
    if (formPapeisRF.configSelects && formPapeisRF.configSelects.campos) {
        console.log('⏰ Agendando população de selects...');
        setTimeout(() => {
            console.log('🚀 Executando população de selects...');
            popularSelectPorConfiguracao(formPapeisRF);
        }, 100);
    }
    
    // Configurar listener para eventos de select
    criarListener(document, 'select-alterada', async (event) => {
        console.log('🔄 Select alterado:', event.detail);
        const { campo, valor } = event.detail;
        await form_listener(formPapeisRF, campo, valor, event);
    });

    // Desabilitar campos de dados inicialmente
    setTimeout(() => {
        desabilitarControlesDeFrm();
        console.log('🔒 Estado inicial: Campos de dados desabilitados');
    }, 150);
    
    return formPapeisRF;
}

// ============= 2. EXPORTAÇÃO DA FUNÇÃO DE INICIALIZAÇÃO =============

/**
 * 🚀 Função de inicialização pública (chamada pelo canvas.js)
 */
export async function iniciarPopulacaoPapeisRF() {
    const resultado = await popularFormulario();
    
    // 🔄 SINCRONIZAR SELECT COM REGISTRO EXIBIDO
    setTimeout(async () => {
        const { _repopularSelectDePesquisa } = await import('../framework_dsb/frontend/General_Classes/OperacoesCRUD.js');
        _repopularSelectDePesquisa();
        console.log('✅ Select sincronizada com registro atual');
    }, 200);
    
    return resultado;
}
