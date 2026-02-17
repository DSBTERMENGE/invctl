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
    construirModalTipoOperacaoAcao,
    abrirModalNovo,
    abrirModalComValores
} from './modal_tipo_operacao_acao.js';

/*
************************************************************
        FORMULÁRIO DE INVESTIMENTOS EM AÇÕES
************************************************************

Este arquivo implementa o formulário para registro de compras,
vendas e dividendos em ações.

Campos principais:
- id_acao (select)
- id_corretora (select)
- data_operacao
- tipo_operacao (readonly - selecionado via modal)
- quantidade (para compra/venda)
- preco_unitario (para compra/venda)
- valor_total (calculado automaticamente)
- observacoes
*/

// ============= 1. CONSTRUÇÃO DO FORMULÁRIO =============

/**
 * 🏗️ CONSTRUTOR PRINCIPAL: Formulário de Investimentos em Ações
 */
export function construirFormularioInvAcoes() {
    console.log('🏗️ Construindo formulário Investimentos em Ações...');
    
    const formInvAcoes = new FormComum();
    
    // ✅ CONFIGURAÇÃO POR PROPRIEDADES
    formInvAcoes.titulo = 'Investimentos em Ações';
    formInvAcoes.descricao = ' - Compra, venda e dividendos';
    formInvAcoes.tipo = [
        'select',   // 1. id_acao
        'select',   // 2. id_corretora
        'input',    // 3. data_operacao
        'input',    // 4. tipo_operacao (readonly, selecionado via modal)
        'input',    // 5. quantidade
        'input',    // 6. preco_unitario
        'input',    // 7. valor_total (readonly calculado)
        'textarea'  // 8. observacoes
    ]; 
    formInvAcoes.label = [
        'Ação',                      // 1. id_acao
        'Corretora',                 // 2. id_corretora
        'Data Operação',             // 3. data_operacao
        'Tipo de Operação',          // 4. tipo_operacao
        'Quantidade',                // 5. quantidade
        'Preço Unitário',            // 6. preco_unitario
        'Valor Total',               // 7. valor_total
        'Observações'                // 8. observacoes
    ];
    formInvAcoes.nomeCampo = [
        'id_acao',                   // 1
        'id_corretora',              // 2
        'data_operacao',             // 3
        'tipo_operacao',             // 4
        'quantidade',                // 5
        'preco_unitario',            // 6
        'valor_total',               // 7
        'observacoes'                // 8
    ];
    
    formInvAcoes.format = [
        null,        // 1. id_acao (select)
        null,        // 2. id_corretora (select)
        'texto',     // 3. data_operacao
        'texto',     // 4. tipo_operacao
        'numero',    // 5. quantidade
        'moeda',     // 6. preco_unitario
        'moeda',     // 7. valor_total
        'texto'      // 8. observacoes
    ];
    
    formInvAcoes.pos = [
        {linha: 1, coluna: 0}, {linha: 1, coluna: 1},    // acao, corretora
        {linha: 2, coluna: 0}, {linha: 2, coluna: 1},    // data, tipo_operacao
        {linha: 3, coluna: 0}, {linha: 3, coluna: 1},    // quantidade, preco
        {linha: 4, coluna: 0},                           // valor_total
        {linha: 5, coluna: 0}                            // observacoes
    ];
    
    formInvAcoes.alinhamento = [
        'H', 'H',                    // linha 1
        'H', 'H',                    // linha 2
        'H', 'H',                    // linha 3
        'H',                         // linha 4
        'V'                          // observacoes vertical
    ];
    
    formInvAcoes.largCampos = [
        30, 20,                      // acao, corretora
        12, 25,                      // data, tipo_operacao
        12, 12,                      // quantidade, preco
        15,                          // valor_total
        60                           // observacoes
    ]; 
    formInvAcoes.posicaoCanvas = {x: 3, y: 5}; 
    formInvAcoes.grupoBotoes = ['S', 'S', 'S']; // Encerrar + Navegação + CRUD
    
    window.api_info.tabela_alvo = 'investimento_acao'; 
    window.api_info.campos_obrigatorios = ['id_acao', 'id_corretora', 'data_operacao', 'tipo_operacao', 'valor_total']; 
    window.api_info.view = "investimento_acao_view"; 
    window.api_info.campos = ['Todos']; 
    
    window.api_info.pk = 'id_investimento_acao'; 
    window.api_info.campos_relacionados = [];

    // Configuração da select de pesquisa (Ação e Data)
    formInvAcoes.configSelects = {
        labels: ['Ação', 'Data'],
        campos: ['acao_ticker', 'data_operacao'],
        larguras: ['150px', '120px'],
        campo_exibir: ['acao_ticker', 'data_operacao'],
        campo_value: ['id_investimento_acao', 'id_investimento_acao'],
        arranjo: 'linha'
    };

    // ✅ RENDERIZAÇÃO MANUAL
    formInvAcoes.render();
    
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
        
        // Campo valor_total readonly (calculado)
        const inputValorTotal = document.getElementById('valor_total');
        if (inputValorTotal) {
            inputValorTotal.readOnly = true;
            inputValorTotal.style.backgroundColor = '#e8f5e9';
            inputValorTotal.style.cursor = 'not-allowed';
            inputValorTotal.placeholder = '(Calculado automaticamente)';
        }
        
        // ============= CALCULAR VALOR TOTAL AUTOMATICAMENTE =============
        const inputQuantidade = document.getElementById('quantidade');
        const inputPreco = document.getElementById('preco_unitario');
        
        function calcularValorTotal() {
            const quantidade = parseInt(inputQuantidade?.value) || 0;
            const preco = parseFloat(inputPreco?.value?.replace(/\./g, '').replace(',', '.')) || 0;
            const total = quantidade * preco;
            
            if (inputValorTotal && total > 0) {
                inputValorTotal.value = total.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
                console.log(`💰 Valor total calculado: ${total.toFixed(2)}`);
            }
        }
        
        if (inputQuantidade) {
            inputQuantidade.addEventListener('input', calcularValorTotal);
            inputQuantidade.addEventListener('blur', calcularValorTotal);
        }
        
        if (inputPreco) {
            inputPreco.addEventListener('input', calcularValorTotal);
            inputPreco.addEventListener('blur', calcularValorTotal);
        }
        
    }, 100);
    
    // ============= POPULAR SELECTS APÓS RENDERIZAÇÃO =============
    setTimeout(async () => {
        console.log('🔄 Populando selects de Ação e Corretora...');
        
        try {
            // Popular select de Ações
            const selectAcao = document.getElementById('id_acao');
            if (selectAcao) {
                const acoes = await window.api_info.consulta_dados_form('acao_view');
                if (acoes?.dados?.dados) {
                    let html = '<option value="">Selecione uma ação...</option>';
                    acoes.dados.dados.forEach(item => {
                        html += `<option value="${item.id_acao}">${item.ticker} - ${item.nome_pregao}</option>`;
                    });
                    selectAcao.innerHTML = html;
                    console.log(`✅ Select Ação populado: ${acoes.dados.dados.length} opções`);
                } else {
                    console.warn('⚠️ Nenhuma ação encontrada');
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
    construirModalTipoOperacaoAcao();
    
    // Listener para capturar valores do modal
    document.addEventListener('modal-tipo-operacao-acao-confirmado', (e) => {
        console.log('📥 Evento modal-tipo-operacao-acao-confirmado recebido:', e.detail);
        
        const valores = e.detail.valores;
        
        // Preencher campo tipo_operacao com a descrição completa
        const inputTipo = document.getElementById('tipo_operacao');
        
        if (inputTipo) {
            inputTipo.value = valores.tipo_operacao_descricao;
            console.log(`✅ tipo_operacao = ${valores.tipo_operacao_descricao}`);
        }
    });
    
    // Listener para abrir modal ao clicar Incluir ou Editar
    if (!window._listenerInvAcoesRegistrado) {
        document.addEventListener('formulario-acao', async (e) => {
            // Verifica se o evento é para a tabela 'investimento_acao'
            if (window.api_info?.tabela_alvo !== 'investimento_acao') {
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
                
                // Mapear descrição para código
                let codigo = '';
                if (descricaoCompleta.startsWith('Compra')) codigo = 'D';
                else if (descricaoCompleta.startsWith('Venda')) codigo = 'C';
                else if (descricaoCompleta.startsWith('Dividendo')) codigo = 'R';
                else if (descricaoCompleta.startsWith('Outros')) codigo = 'O';
                
                const valoresAtuais = {
                    tipo_operacao: codigo
                };
                
                setTimeout(() => abrirModalComValores(valoresAtuais), 300);
            }
        });
        
        window._listenerInvAcoesRegistrado = true;
        console.log('✅ Listener formulario-acao registrado para investimento_acao');
    }
    
    return formInvAcoes;
}

// ============= 2. INICIALIZAÇÃO E POPULAÇÃO =============

/**
 * 🚀 INICIAR: População inicial do formulário
 */
export async function iniciarPopulacaoInvAcoes() {
    console.log('🚀 Iniciando população Investimentos em Ações...');
    
    try {
        await popularFormulario();
        console.log('✅ População inicial Investimentos em Ações concluída');
    } catch (erro) {
        console.error('❌ Erro na população inicial Investimentos em Ações:', erro);
    }
}
