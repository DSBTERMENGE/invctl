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


/*
************************************************************
        FORMULÁRIO DE CORRETORAS - INVCTL
************************************************************

Este arquivo implementa o formulário para cadastro de corretoras
seguindo o novo padrão property-based configuration do framework DSB.

*/

// ============= 1. CONSTRUÇÃO DO FORMULÁRIO =============

/**
 * 🏗️ CONSTRUTOR PRINCIPAL: Formulário de corretoras
 */
export function construirFormularioCorretoras() {
    console.log('🏗️ Construindo formulário Corretoras...');
    
    const formCorretoras = new FormComum();
    
    // ✅ CONFIGURAÇÃO POR PROPRIEDADES (novo padrão)
    formCorretoras.titulo = 'Corretoras';
    formCorretoras.descricao = ' - Cadastro de corretoras e distribuidoras';
    formCorretoras.tipo = ['input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'textarea']; 
    formCorretoras.label = ['CNPJ', 'Nome Completo', 'Nome Fantasia', 'Código CVM', 'Tipo', 'Status', 'Taxa Custódia RV', 'Taxa Corretagem', 'Observações'];
    formCorretoras.nomeCampo = ['cnpj', 'nome_completo', 'nome_fantasia', 'codigo_cvm', 'tipo', 'status_operacional', 'taxa_custodia_renda_variavel', 'taxa_corretagem_padrao', 'observacoes'];
    formCorretoras.format = ['texto', 'texto', 'texto', 'texto', 'texto', 'texto', 'numero', 'numero', 'texto'];
    formCorretoras.pos = [
        {linha: 0, coluna: 0}, // CNPJ
        {linha: 0, coluna: 1}, // Nome Completo
        {linha: 1, coluna: 0}, // Nome Fantasia
        {linha: 1, coluna: 1}, // Código CVM
        {linha: 2, coluna: 0}, // Tipo
        {linha: 2, coluna: 1}, // Status
        {linha: 3, coluna: 0}, // Taxa Custódia RV
        {linha: 3, coluna: 1}, // Taxa Corretagem
        {linha: 4, coluna: 0}  // Observações
    ];
    formCorretoras.alinhamento = ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'V']; 
    formCorretoras.largCampos = [15, 30, 25, 15, 15, 15, 12, 12, 50]; 
    formCorretoras.posicaoCanvas = {x: 3, y: 5}; 
    formCorretoras.grupoBotoes = ['S', 'S', 'S']; // Encerrar + Navegação + CRUD
    
    window.api_info.tabela_alvo = 'corretoras'; 
    window.api_info.campos_obrigatorios = ['cnpj', 'nome_completo']; 
    window.api_info.view = "corretoras_view"; 
    window.api_info.campos = ['Todos']; 
    
    window.api_info.pk = 'id_corretora'; 
    window.api_info.campos_relacionados = []; 

    // Configuração dos selects
    formCorretoras.configSelects = {
        labels: ['Nome Completo'],
        campos: ['nome_completo'],
        larguras: ['250px'],
        campo_exibir: ['nome_completo'],
        campo_value: ['id_corretora'],
        arranjo: 'linha'
    };

    // ✅ RENDERIZAÇÃO MANUAL (novo padrão)
    formCorretoras.render();
    
    // TRATAMENTO DE SELECTS
    if (formCorretoras.configSelects && formCorretoras.configSelects.campos) {
        console.log('🔍 ConfigSelects encontrada - iniciando tratamento...', formCorretoras.configSelects);
        
        if (formCorretoras.configSelects.campos.length > 1) {
            console.log('📌 Sistema de filtros detectado - carregando módulo...');
            const filtrosConfig = {
                labels: formCorretoras.configSelects.labels.slice(0, -1),
                campos: formCorretoras.configSelects.campos.slice(0, -1),
                larguras: formCorretoras.configSelects.larguras.slice(0, -1),
                campo_exibir: formCorretoras.configSelects.campo_exibir.slice(0, -1),
                campo_value: formCorretoras.configSelects.campo_value.slice(0, -1)
            };
            
            // Construir filtro inicial
            const filtroInicial = construirFiltroInicial(filtrosConfig);
            console.log('🎯 Filtro inicial construído:', filtroInicial);
            
            // Popular selects de filtro
            filtrosConfig.campos.forEach((campo, index) => {
                const selectId = `filtroSelect_${campo}`;
                popularSelectPorConfiguracao(
                    selectId,
                    filtrosConfig.campo_exibir[index],
                    filtrosConfig.campo_value[index],
                    filtroInicial
                );
            });
            
            // Configurar listeners para filtros em cascata
            filtrosConfig.campos.forEach((campo, index) => {
                const selectId = `filtroSelect_${campo}`;
                const selectElement = document.getElementById(selectId);
                
                if (selectElement) {
                    selectElement.addEventListener('change', async (e) => {
                        console.log(`🔄 Filtro ${campo} alterado:`, e.target.value);
                        
                        const novoFiltro = {
                            ...filtroInicial,
                            [campo]: e.target.value
                        };
                        
                        // Atualizar selects seguintes
                        for (let i = index + 1; i < filtrosConfig.campos.length; i++) {
                            const nextSelectId = `filtroSelect_${filtrosConfig.campos[i]}`;
                            await popularSelectPorConfiguracao(
                                nextSelectId,
                                filtrosConfig.campo_exibir[i],
                                filtrosConfig.campo_value[i],
                                novoFiltro
                            );
                        }
                        
                        // Atualizar select de pesquisa
                        const pesquisaConfig = {
                            campo_exibir: formCorretoras.configSelects.campo_exibir[formCorretoras.configSelects.campo_exibir.length - 1],
                            campo_value: formCorretoras.configSelects.campo_value[formCorretoras.configSelects.campo_value.length - 1]
                        };
                        
                        await popularSelectPorConfiguracao(
                            'idSelectPesquisa',
                            pesquisaConfig.campo_exibir,
                            pesquisaConfig.campo_value,
                            novoFiltro
                        );
                    });
                }
            });
        }
        
        // Popular select de pesquisa
        const pesquisaConfig = {
            campo_exibir: formCorretoras.configSelects.campo_exibir[formCorretoras.configSelects.campo_exibir.length - 1],
            campo_value: formCorretoras.configSelects.campo_value[formCorretoras.configSelects.campo_value.length - 1]
        };
        
        popularSelectPorConfiguracao(
            'idSelectPesquisa',
            pesquisaConfig.campo_exibir,
            pesquisaConfig.campo_value
        );
        
        // Configurar listener para navegação
        criarListener('idSelectPesquisa', 'change', async function(e) {
            const idSelecionado = e.target.value;
            console.log('🔍 Navegação - ID selecionado:', idSelecionado);
            
            if (idSelecionado) {
                await popularFormulario(idSelecionado);
            }
        });
    }

    // ✅ CONFIGURAÇÃO DOS EVENT LISTENERS
    configurarEventListeners();
    
    console.log('✅ Formulário Corretoras construído com sucesso!');
    return formCorretoras;
}

// ============= 2. CONFIGURAÇÃO DE LISTENERS =============

function configurarEventListeners() {
    // Listener para botão Encerrar
    criarListener('btnEncerrarForm', 'click', handlerEncerrarForm);
    
    // Listeners para navegação
    criarListener('btnPrimeiro', 'click', handlerNavPrimeiro);
    criarListener('btnAnterior', 'click', handlerNavAnterior);
    criarListener('btnProximo', 'click', handlerNavProximo);
    criarListener('btnUltimo', 'click', handlerNavUltimo);
    
    // Listeners para CRUD
    criarListener('btnIncluir', 'click', handlerIncluir);
    criarListener('btnEditar', 'click', handlerEditar);
    criarListener('btnSalvar', 'click', handlerSalvar);
    criarListener('btnDeletar', 'click', handlerDeletar);
}

// ============= 3. HANDLERS DE EVENTOS =============

function handlerEncerrarForm() {
    console.log('🚪 Encerrando formulário Corretoras...');
    document.getElementById('divForms').classList.add('hidden');
}

async function handlerNavPrimeiro() {
    console.log('⏮️ Navegando para primeiro registro...');
    await form_listener('primeiro');
}

async function handlerNavAnterior() {
    console.log('◀️ Navegando para registro anterior...');
    await form_listener('anterior');
}

async function handlerNavProximo() {
    console.log('▶️ Navegando para próximo registro...');
    await form_listener('proximo');
}

async function handlerNavUltimo() {
    console.log('⏭️ Navegando para último registro...');
    await form_listener('ultimo');
}

function handlerIncluir() {
    console.log('➕ Modo incluir ativado');
    form_listener('incluir');
}

function handlerEditar() {
    console.log('✏️ Modo editar ativado');
    form_listener('editar');
}

async function handlerSalvar() {
    console.log('💾 Salvando dados...');
    await form_listener('salvar');
}

async function handlerDeletar() {
    console.log('🗑️ Deletando registro...');
    await form_listener('deletar');
}
