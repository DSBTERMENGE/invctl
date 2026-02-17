// Importações do sistema de debug (sempre primeiro)
import { flow_marker, error_catcher } from '../framework_dsb/frontend/General_Classes/Debugger.js';
// Importações de gerenciamento de eventos
import { criarListener, desabilitarControlesDeFrm, popularSelectPorConfiguracao, form_listener } from '../framework_dsb/frontend/General_Classes/FuncoesAuxilares.js';

import FormComum from "../framework_dsb/frontend/General_Classes/ConstrutorDeForms.js";
import { 
    popularFormulario,
    processarFiltroSelect,
    construirFiltroInicial,
} from '../framework_dsb/frontend/General_Classes/OperacoesCRUD.js';

// Importação do Modal de Tipo de Operação
import { 
    construirModalTipoOperacaoFundo,
    abrirModalNovo,
    abrirModalComValores
} from './modal_tipo_operacao_fundo.js';


/*
************************************************************
        FORMULÁRIO DE INVESTIMENTOS EM FUNDOS - INVCTL
************************************************************

Este arquivo implementa o formulário para registro de aportes
e resgates em fundos de investimento.

Campos principais:
- id_fundo (select populado da tabela fundo)
- id_corretora (select populado da tabela corretoras)
- data_operacao
- tipo_operacao (selecionado via modal, exibe descrição completa)
- valor
- observacoes

*/

// ============= 1. CONSTRUÇÃO DO FORMULÁRIO =============

/**
 * 🏗️ CONSTRUTOR PRINCIPAL: Formulário de Investimentos em Fundos
 */
export function construirFormularioInvFundos() {
    console.log('🏗️ Construindo formulário Investimentos em Fundos...');
    
    const formInvFundos = new FormComum();
    
    // ✅ CONFIGURAÇÃO POR PROPRIEDADES
    formInvFundos.titulo = 'Investimentos em Fundos';
    formInvFundos.descricao = ' - Registro de aportes e resgates';
    formInvFundos.tipo = [
        'select',   // 1. id_fundo
        'select',   // 2. id_corretora
        'input',    // 3. data_operacao
        'input',    // 4. tipo_operacao (readonly, selecionado via modal)
        'input',    // 5. valor
        'textarea'  // 6. observacoes
    ]; 
    formInvFundos.label = [
        'Fundo',                     // 1. id_fundo
        'Corretora',                 // 2. id_corretora
        'Data Operação',             // 3. data_operacao
        'Tipo de Operação',          // 4. tipo_operacao
        'Valor',                     // 5. valor
        'Observações'                // 6. observacoes
    ];
    formInvFundos.nomeCampo = [
        'id_fundo',                  // 1
        'id_corretora',              // 2
        'data_operacao',             // 3
        'tipo_operacao',             // 4
        'valor',                     // 5
        'observacoes'                // 6
    ];
    
    formInvFundos.format = [
        null,        // 1. id_fundo (select)
        null,        // 2. id_corretora (select)
        'texto',     // 3. data_operacao
        'texto',     // 4. tipo_operacao
        'moeda',     // 5. valor
        'texto'      // 6. observacoes
    ];
    
    formInvFundos.pos = [
        {linha: 1, coluna: 0}, {linha: 1, coluna: 1},    // fundo, corretora
        {linha: 2, coluna: 0}, {linha: 2, coluna: 1},    // data, tipo_operacao
        {linha: 3, coluna: 0},                           // valor
        {linha: 4, coluna: 0}                            // observacoes
    ];
    
    formInvFundos.alinhamento = [
        'H', 'H',                    // linha 1
        'H', 'H',                    // linha 2
        'H',                         // linha 3
        'V'                          // observacoes vertical
    ];
    
    formInvFundos.largCampos = [
        25, 20,                      // fundo, corretora
        12, 25,                      // data, tipo_operacao
        15,                          // valor
        60                           // observacoes
    ]; 
    formInvFundos.posicaoCanvas = {x: 3, y: 5}; 
    formInvFundos.grupoBotoes = ['S', 'S', 'S']; // Encerrar + Navegação + CRUD
    
    window.api_info.tabela_alvo = 'investimento_fundo'; 
    window.api_info.campos_obrigatorios = ['id_fundo', 'id_corretora', 'data_operacao', 'tipo_operacao', 'valor']; 
    window.api_info.view = "investimento_fundo_view"; 
    window.api_info.campos = ['Todos']; 
    
    window.api_info.pk = 'id_investimento_fundo'; 
    window.api_info.campos_relacionados = [];

    // Configuração da select de pesquisa (Fundo e Data)
    formInvFundos.configSelects = {
        labels: ['Fundo', 'Data'],
        campos: ['fundo_nome', 'data_operacao'],
        larguras: ['200px', '120px'],
        campo_exibir: ['fundo_nome', 'data_operacao'],
        campo_value: ['id_investimento_fundo', 'id_investimento_fundo'],
        arranjo: 'linha'
    };

    // ✅ RENDERIZAÇÃO MANUAL
    formInvFundos.render();
    
    // ============= CONFIGURAR CAMPOS ESPECIAIS =============
    setTimeout(() => {
        // Campo tipo_operacao readonly permanente
        const inputTipo = document.getElementById('tipo_operacao');
        if (inputTipo) {
            inputTipo.readOnly = true;
            inputTipo.style.backgroundColor = '#f0f0f0';
            inputTipo.style.cursor = 'not-allowed';
            inputTipo.placeholder = '(Configurar via modal)';
        }
    }, 100);
    
    // ============= POPULAR SELECTS APÓS RENDERIZAÇÃO =============
    setTimeout(async () => {
        console.log('🔄 Populando selects de Fundo e Corretora...');
        
        try {
            // Popular select de Fundos
            const selectFundo = document.getElementById('id_fundo');
            if (selectFundo) {
                const fundos = await window.api_info.consulta_dados_form('fundo_view');
                if (fundos?.dados?.dados) {
                    let html = '<option value="">Selecione um fundo...</option>';
                    fundos.dados.dados.forEach(item => {
                        html += `<option value="${item.id_fundo}">${item.nome_abreviado} (${item.codigo_cvm || ''})</option>`;
                    });
                    selectFundo.innerHTML = html;
                    console.log(`✅ Select Fundo populado: ${fundos.dados.dados.length} opções`);
                } else {
                    console.warn('⚠️ Nenhum fundo encontrado');
                }
            }
            
            // Popular select de Corretoras
            const selectCorretora = document.getElementById('id_corretora');
            if (selectCorretora) {
                const corretoras = await window.api_info.consulta_dados_form('corretoras_view');
                if (corretoras?.dados?.dados) {
                    let html = '<option value="">Selecione uma corretora...</option>';
                    corretoras.dados.dados.forEach(item => {
                        html += `<option value="${item.id_corretora}">${item.nome_fantasia}</option>`;
                    });
                    selectCorretora.innerHTML = html;
                    console.log(`✅ Select Corretora populado: ${corretoras.dados.dados.length} opções`);
                } else {
                    console.warn('⚠️ Nenhuma corretora encontrada');
                }
            }
            
        } catch (erro) {
            console.error('❌ Erro ao popular selects:', erro);
        }
    }, 300);
    
    // ============= CONSTRUIR MODAL E LISTENERS =============
    construirModalTipoOperacaoFundo();
    
    // Listener para capturar valores do modal
    document.addEventListener('modal-tipo-operacao-fundo-confirmado', (e) => {
        console.log('📥 Evento modal-tipo-operacao-fundo-confirmado recebido:', e.detail);
        
        const valores = e.detail.valores;
        
        // Preencher campo tipo_operacao com a descrição completa
        const inputTipo = document.getElementById('tipo_operacao');
        
        if (inputTipo) {
            inputTipo.value = valores.tipo_operacao_descricao;
            console.log(`✅ tipo_operacao = ${valores.tipo_operacao_descricao}`);
        }
    });
    
    // Listener para abrir modal ao clicar Incluir ou Editar
    if (!window._listenerInvFundosRegistrado) {
        document.addEventListener('formulario-acao', async (e) => {
            // Verifica se o evento é para a tabela 'investimento_fundo'
            if (window.api_info?.tabela_alvo !== 'investimento_fundo') {
                return; // Ignora evento de outras tabelas
            }
            
            if (e.detail.acao === 'incluir') {
                console.log('➕ Ação Incluir detectada - abrindo modal...');
                setTimeout(() => abrirModalNovo(), 300);
            }
            
            if (e.detail.acao === 'editar') {
                console.log('✏️ Ação Editar detectada - abrindo modal com valores atuais...');
                
                // Capturar valor atual - extrair a letra do início da descrição
                const inputTipo = document.getElementById('tipo_operacao');
                const descricaoCompleta = inputTipo?.value || '';
                
                // Mapear descrição para código (ex: "Aporte (Aplicação)" -> "D")
                let codigo = '';
                if (descricaoCompleta.startsWith('Aporte')) codigo = 'D';
                else if (descricaoCompleta.startsWith('Resgate')) codigo = 'C';
                else if (descricaoCompleta.startsWith('Come-Cotas')) codigo = 'T';
                else if (descricaoCompleta.startsWith('Outros')) codigo = 'O';
                
                const valoresAtuais = {
                    tipo_operacao: codigo
                };
                
                setTimeout(() => abrirModalComValores(valoresAtuais), 300);
            }
        });
        
        window._listenerInvFundosRegistrado = true;
        console.log('✅ Listener formulario-acao registrado para investimento_fundo');
    }
    
    return formInvFundos;
}

// ============= 2. INICIALIZAÇÃO E POPULAÇÃO =============

/**
 * 🚀 INICIAR: População inicial do formulário
 */
export async function iniciarPopulacaoInvFundos() {
    console.log('🚀 Iniciando população Investimentos em Fundos...');
    
    try {
        await popularFormulario();
        console.log('✅ População inicial Investimentos em Fundos concluída');
    } catch (erro) {
        console.error('❌ Erro na população inicial Investimentos em Fundos:', erro);
    }
}
