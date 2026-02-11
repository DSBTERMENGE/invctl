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
************************************************************

Este arquivo implementa o formulário para cadastro de papéis
de renda fixa disponíveis no mercado (produtos).

IMPORTANTE: Usa campos tipo 'combo' para FKs
- id_tipo_investimento → combo
- id_banco_emissor → combo
- id_indexador → combo

*/

// ============= 1. CONSTRUÇÃO DO FORMULÁRIO =============

/**
 * 🏗️ CONSTRUTOR PRINCIPAL: Formulário de Papéis RF
 */
export function construirFormularioPapeisRF() {
    console.log('🏗️ Construindo formulário Papéis RF...');
    
    const formPapeisRF = new FormComum();
    
    // ✅ CONFIGURAÇÃO POR PROPRIEDADES
    formPapeisRF.titulo = 'Papéis de Renda Fixa';
    formPapeisRF.descricao = ' - Cadastro de papéis disponíveis no mercado';
    formPapeisRF.tipo = [
        'input',    // id_tipo_investimento (HIDDEN - ID para salvar)
        'input',    // id_banco_emissor (HIDDEN - ID para salvar)
        'input',    // id_indexador (HIDDEN - ID para salvar)
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
        'input',    // dias_carencia
        'input',    // valor_garantido_fgc
        'input',    // periodicidade_cupom
        'input',    // taxa_administracao
        'input',    // taxa_custodia
        'textarea'  // observacoes
    ]; 
    formPapeisRF.label = [
        '',                      // id_tipo_investimento (hidden, sem label)
        '',                      // id_banco_emissor (hidden, sem label)
        '',                      // id_indexador (hidden, sem label)
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
        'Taxa Pré (%)',
        '% Index',
        'Dias Carênc.',
        'Vlr FGC',
        'Period. Cupom',
        'Taxa Adm (%)',
        'Taxa Cust (%)',
        'Obs'
    ];
    formPapeisRF.nomeCampo = [
        'id_tipo_investimento',       // 1 (hidden - ID)
        'id_banco_emissor',           // 2 (hidden - ID)
        'id_indexador',               // 3 (hidden - ID)
        'tipo_rentabilidade',         // 4 (readonly - mostra PRE_FIXADO, POS_FIXADO, HIBRIDO)
        'liquidez',                   // 5 (readonly - mostra DIARIA, VENCIMENTO, PARCIAL)
        'garantia_fgc',               // 6 (readonly - mostra S ou N)
        'iof_aplicavel',              // 7 (readonly - mostra S ou N)
        'ativo',                      // 8 (readonly - mostra S ou N)
        'codigo_ativo',               // 9
        'descricao',                  // 10
        'data_emissao',               // 11
        'data_vencimento',            // 12
        'valor_nominal',              // 13
        'taxa_prefixada',             // 14
        'percentual_indexador',       // 15
        'dias_carencia',              // 16
        'valor_garantido_fgc',        // 17
        'periodicidade_cupom',        // 18
        'taxa_administracao',         // 19
        'taxa_custodia',              // 20
        'observacoes'                 // 21
    ];
    
    formPapeisRF.format = [
        null,        // id_tipo_investimento (hidden)
        null,        // id_banco_emissor (hidden)
        null,        // id_indexador (hidden)
        'texto',     // tipo_rentabilidade (readonly)
        'texto',     // liquidez (readonly)
        'texto',     // garantia_fgc (readonly)
        'texto',     // iof_aplicavel (readonly)
        'texto',     // ativo (readonly)
        'texto',     // codigo_ativo
        'texto',     // descricao
        'data',      // data_emissao
        'data',      // data_vencimento
        'moeda',     // valor_nominal
        'pct',       // taxa_prefixada
        'pct',       // percentual_indexador
        'texto',     // dias_carencia
        'moeda',     // valor_garantido_fgc
        'texto',     // periodicidade_cupom
        'pct',       // taxa_administracao
        'pct',       // taxa_custodia
        'texto'      // observacoes
    ];
    formPapeisRF.pos = [
        {linha: 0, coluna: 0}, // id_tipo_investimento (hidden)
        {linha: 0, coluna: 1}, // id_banco_emissor (hidden)
        {linha: 0, coluna: 2}, // id_indexador (hidden)
        {linha: 1, coluna: 0}, // tipo_rentabilidade (readonly)
        {linha: 1, coluna: 1}, // liquidez
        {linha: 1, coluna: 2}, // garantia_fgc
        {linha: 1, coluna: 3}, // iof_aplicavel
        {linha: 1, coluna: 4}, // ativo
        {linha: 2, coluna: 0}, // codigo_ativo
        {linha: 2, coluna: 1}, // descricao
        {linha: 3, coluna: 0}, // data_emissao
        {linha: 3, coluna: 1}, // data_vencimento
        {linha: 3, coluna: 2}, // valor_nominal
        {linha: 4, coluna: 0}, // taxa_prefixada
        {linha: 4, coluna: 1}, // percentual_indexador
        {linha: 4, coluna: 2}, // dias_carencia
        {linha: 5, coluna: 0}, // valor_garantido_fgc
        {linha: 5, coluna: 1}, // periodicidade_cupom
        {linha: 5, coluna: 2}, // taxa_administracao
        {linha: 5, coluna: 3}, // taxa_custodia
        {linha: 6, coluna: 0}  // observacoes
    ];
    formPapeisRF.alinhamento = [
        'H', 'H', 'H',                   // linha 0: 3 IDs hidden
        'H', 'H', 'H', 'H', 'H',         // linha 1: 5 campos readonly
        'H', 'H',                        // linha 2: codigo, descricao
        'H', 'H', 'H',                   // linha 3: datas, valor
        'H', 'H', 'H',                   // linha 4: taxas
        'H', 'H', 'H', 'H',              // linha 5: valores e taxas
        'V'                              // linha 6: observacoes
    ]; 
    formPapeisRF.largCampos = [
        0, 0, 0,          // 3 IDs hidden
        12, 10, 5, 5, 5,  // tipo_rent, liquidez, fgc, iof, ativo (readonly)
        15, 30,           // Código, Descrição
        8, 8, 10,         // Datas, Valor Nominal
        6, 6, 6,          // Taxas
        10, 8, 6, 6,      // Valores e Taxas
        50                 // Observações
    ]; 
    formPapeisRF.posicaoCanvas = {x: 3, y: 5}; 
    formPapeisRF.grupoBotoes = ['S', 'S', 'S']; // Encerrar + Navegação + CRUD
    
    window.api_info.tabela_alvo = 'papeis_rf'; 
    window.api_info.campos_obrigatorios = ['id_tipo_investimento', 'id_banco_emissor', 'id_indexador', 'codigo_ativo']; 
    window.api_info.view = "papeis_rf_view"; 
    window.api_info.campos = ['Todos']; 
    
    window.api_info.pk = 'id_papel_rf'; 
    window.api_info.campos_relacionados = [];

    // Configuração da select de pesquisa (apenas código)
    formPapeisRF.configSelects = {
        labels: ['Código'],
        campos: ['codigo_ativo'],
        larguras: ['200px'],
        campo_exibir: ['codigo_ativo'],
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
            'tipo_rentabilidade', 'liquidez', 'garantia_fgc', 
            'iof_aplicavel', 'ativo'
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
    }, 300);
    
    // Listener para receber valores do modal
    document.addEventListener('modal-selecoes-confirmadas', (e) => {
        console.log('📥 Valores recebidos do modal:', e.detail);
        
        const { valores, textos } = e.detail;
        
        // Preenche campos HIDDEN com IDs
        document.getElementById('id_tipo_investimento').value = valores.id_tipo_investimento || '';
        document.getElementById('id_banco_emissor').value = valores.id_banco_emissor || '';
        document.getElementById('id_indexador').value = valores.id_indexador || '';
        
        // Preenche campos READONLY (tipo e liquidez podem usar textos, mas FGC/IOF/Ativo precisam dos valores S/N)
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
