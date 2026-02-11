// Importações do sistema de debug (sempre primeiro)
import { flow_marker, error_catcher } from '../framework_dsb/frontend/General_Classes/Debugger.js';
// Importações de gerenciamento de eventos
import { criarListener, desabilitarControlesDeFrm, popularSelectPorConfiguracao, form_listener } from '../framework_dsb/frontend/General_Classes/FuncoesAuxilares.js';

import FormComum from "../framework_dsb/frontend/General_Classes/ConstrutorDeForms.js";
import { abrirModalNovo, abrirModalComValores } from './modal_selecoes_acoes.js';
import { 
    popularFormulario,
    processarFiltroSelect,
    construirFiltroInicial,
} from '../framework_dsb/frontend/General_Classes/OperacoesCRUD.js';


/*
************************************************************
        FORMULÁRIO DE AÇÕES - INVCTL
************************************************************

Este arquivo implementa o formulário para cadastro de ações
negociadas na B3 (identificação do papel).

IMPORTANTE: Usa modal para selecionar características
- nome_pregao → via modal
- setor → via modal (select fixo)
- segmento → via modal (select fixo)
- tipo_acao → via modal (select fixo)
- status → via modal (select fixo)

*/

// ============= 1. CONSTRUÇÃO DO FORMULÁRIO =============

/**
 * 🏗️ CONSTRUTOR PRINCIPAL: Formulário de Ações
 */
export function construirFormularioAcoes() {
    console.log('🏗️ Construindo formulário Ações...');
    
    const formAcoes = new FormComum();
    
    // ✅ CONFIGURAÇÃO POR PROPRIEDADES
    formAcoes.titulo = 'Ações';
    formAcoes.descricao = ' - Cadastro de ações negociadas na B3';
    formAcoes.tipo = [
        'input',    // 1. ticker
        'input',    // 2. cnpj
        'input',    // 3. razao_social
        'input',    // 4. nome_pregao (READONLY - vem do modal)
        'input',    // 5. setor (READONLY - vem do modal)
        'input',    // 6. segmento (READONLY - vem do modal)
        'input',    // 7. tipo_acao (READONLY - vem do modal)
        'input',    // 8. status (READONLY - vem do modal)
        'textarea'  // 9. observacoes
    ]; 
    formAcoes.label = [
        'Ticker',                    // 1. ticker (ex: PETR4)
        'CNPJ',                      // 2. cnpj
        'Razão Social',              // 3. razao_social
        'Nome Pregão',               // 4. nome_pregao (readonly)
        'Setor',                     // 5. setor (readonly)
        'Segmento',                  // 6. segmento (readonly)
        'Tipo Ação',                 // 7. tipo_acao (readonly)
        'Status',                    // 8. status (readonly)
        'Observações'                // 9. observacoes
    ];
    formAcoes.nomeCampo = [
        'ticker',                    // 1
        'cnpj',                      // 2
        'razao_social',              // 3
        'nome_pregao',               // 4 (readonly - modal)
        'setor',                     // 5 (readonly - modal)
        'segmento',                  // 6 (readonly - modal)
        'tipo_acao',                 // 7 (readonly - modal)
        'status',                    // 8 (readonly - modal)
        'observacoes'                // 9
    ];
    
    formAcoes.format = [
        'texto',     // 1. ticker
        'texto',     // 2. cnpj
        'texto',     // 3. razao_social
        'texto',     // 4. nome_pregao
        'texto',     // 5. setor
        'texto',     // 6. segmento
        'texto',     // 7. tipo_acao
        'texto',     // 8. status
        'texto'      // 9. observacoes
    ];
    
    formAcoes.pos = [
        {linha: 1, coluna: 0}, {linha: 1, coluna: 1}, {linha: 1, coluna: 2},    // ticker, cnpj, razao_social
        {linha: 2, coluna: 0}, {linha: 2, coluna: 1},                           // nome_pregao, setor
        {linha: 3, coluna: 0}, {linha: 3, coluna: 1}, {linha: 3, coluna: 2},    // segmento, tipo_acao, status
        {linha: 4, coluna: 0}                                                   // observacoes
    ];
    
    formAcoes.alinhamento = [
        'H', 'H', 'H',               // linha 1
        'H', 'H',                    // linha 2
        'H', 'H', 'H',               // linha 3
        'V'                          // observacoes vertical
    ];
    
    formAcoes.largCampos = [
        8, 12, 30,                   // ticker, cnpj, razao_social
        25, 15,                      // nome_pregao, setor
        20, 8, 10,                   // segmento, tipo_acao, status
        60                           // observacoes
    ]; 
    formAcoes.posicaoCanvas = {x: 3, y: 5}; 
    formAcoes.grupoBotoes = ['S', 'S', 'S']; // Encerrar + Navegação + CRUD
    
    window.api_info.tabela_alvo = 'acao'; 
    window.api_info.campos_obrigatorios = ['ticker', 'cnpj', 'razao_social', 'nome_pregao', 'tipo_acao']; 
    window.api_info.view = "acao_view"; 
    window.api_info.campos = ['Todos']; 
    
    window.api_info.pk = 'id_acao'; 
    window.api_info.campos_relacionados = [];

    // Configuração da select de pesquisa (Ticker e Razão Social)
    formAcoes.configSelects = {
        labels: ['Ticker', 'Razão Social'],
        campos: ['ticker', 'razao_social'],
        larguras: ['100px', '300px'],
        campo_exibir: ['ticker', 'razao_social'],
        campo_value: ['id_acao', 'id_acao'],
        arranjo: 'linha'
    };

    // ✅ RENDERIZAÇÃO MANUAL
    formAcoes.render();
    
    // ============= CONSTRUIR MODAL =============
    import('./modal_selecoes_acoes.js').then(module => {
        module.construirModalSelecoesAcoes();
        console.log('✅ Modal de seleções ações construído');
    });
    
    // ============= INTEGRAÇÃO COM MODAL DE SELEÇÕES =============
    
    // Tornar campos readonly
    setTimeout(() => {
        // Campos readonly (nome_pregao, setor, segmento, tipo_acao, status)
        const camposReadonly = [
            'nome_pregao', 'setor', 'segmento', 'tipo_acao', 'status'
        ];
        
        camposReadonly.forEach(campo => {
            const input = document.getElementById(campo);
            if (input) {
                input.readOnly = true;
                input.style.backgroundColor = '#f0f0f0';
                input.style.cursor = 'not-allowed';
            }
        });
        
        console.log('✅ Campos readonly configurados');
    }, 300);
    
    // Listener para receber valores do modal
    document.addEventListener('modal-acoes-confirmado', (e) => {
        console.log('📥 Valores recebidos do modal:', e.detail);
        
        const { valores } = e.detail;
        
        // Preenche campos READONLY
        document.getElementById('nome_pregao').value = valores.nome_pregao || '';
        document.getElementById('setor').value = valores.setor || '';
        document.getElementById('segmento').value = valores.segmento || '';
        document.getElementById('tipo_acao').value = valores.tipo_acao || '';
        document.getElementById('status').value = valores.status || '';
        
        console.log('✅ Valores transferidos do modal');
        alert('✅ Características configuradas!\n\nAgora preencha Ticker, CNPJ, Razão Social e salve.');
    });
    
    // Listener para interceptar ações do formulário (INCLUIR e EDITAR)
    if (!window._listenerAcoesRegistrado) {
        document.addEventListener('formulario-acao', (e) => {
            console.log('🎯 Evento formulario-acao:', e.detail);
            
            // Verifica se o evento é para a tabela 'acao'
            if (window.api_info?.tabela_alvo !== 'acao') {
                console.log('⏭️ Ignorando evento - tabela atual:', window.api_info?.tabela_alvo);
                return;
            }
            
            if (e.detail.acao === 'incluir') {
                console.log('🆕 Ação INCLUIR detectada - abrindo modal...');
                abrirModalNovo();
            } else if (e.detail.acao === 'editar' && e.detail.dados) {
                console.log('✏️ Ação EDITAR detectada - abrindo modal com valores...', e.detail.dados);
                const valoresAtuais = {
                    nome_pregao: e.detail.dados.nome_pregao,
                    setor: e.detail.dados.setor,
                    segmento: e.detail.dados.segmento,
                    tipo_acao: e.detail.dados.tipo_acao,
                    status: e.detail.dados.status
                };
                abrirModalComValores(valoresAtuais);
            }
        });
        
        window._listenerAcoesRegistrado = true;
        console.log('✅ Listener formulario-acao registrado (ações)');
    }
    
    return formAcoes;
}

// ============= 2. INICIALIZAÇÃO E POPULAÇÃO =============

/**
 * 🚀 INICIAR: População inicial do formulário
 */
export async function iniciarPopulacaoAcoes() {
    console.log('🚀 Iniciando população Ações...');
    
    try {
        await popularFormulario();
        console.log('✅ População inicial Ações concluída');
    } catch (erro) {
        console.error('❌ Erro na população inicial Ações:', erro);
    }
}
