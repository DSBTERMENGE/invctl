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
    formCorretoras.label = ['CNPJ', 'Nome Completo', 'Nome Fantasia', 'Código CVM', 'Status', 'Email', 'Telefone', 'Website', 'Observações'];
    formCorretoras.nomeCampo = ['cnpj', 'nome_completo', 'nome_fantasia', 'codigo_cvm', 'status', 'email_insitucional', 'telefone_institucional', 'website', 'observacoes'];
    formCorretoras.format = ['cnpj', 'texto', 'texto', 'texto', 'texto', 'texto', 'texto', 'texto', 'texto'];
    formCorretoras.pos = [
        {linha: 0, coluna: 0}, // CNPJ
        {linha: 0, coluna: 1}, // Nome Completo
        {linha: 1, coluna: 0}, // Nome Fantasia
        {linha: 1, coluna: 1}, // Código CVM
        {linha: 2, coluna: 0}, // Status
        {linha: 3, coluna: 0}, // Email
        {linha: 3, coluna: 1}, // Telefone
        {linha: 3, coluna: 2}, // Website
        {linha: 4, coluna: 0}  // Observações
    ];
    formCorretoras.alinhamento = ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'V']; 
    formCorretoras.largCampos = [8, 20, 20, 7, 6, 15, 9, 15, 50]; 
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

    // ✅ RENDERIZAÇÃO MANUAL
    formCorretoras.render();
    
    // Popula select usando método padrão do framework
    if (formCorretoras.configSelects && formCorretoras.configSelects.campos) {
        console.log('⏰ Agendando população de selects...');
        setTimeout(() => {
            console.log('🚀 Executando população de selects...');
            popularSelectPorConfiguracao(formCorretoras);
        }, 100);
    }
    
    // Configurar listener para eventos de select
    criarListener(document, 'select-alterada', async (event) => {
        console.log('🔄 Select alterado:', event.detail);
        const { campo, valor } = event.detail;
        await form_listener(formCorretoras, campo, valor, event);
    });

    // Desabilitar campos de dados inicialmente
    setTimeout(() => {
        desabilitarControlesDeFrm();
        console.log('🔒 Estado inicial: Campos de dados desabilitados');
    }, 150);
    
    return formCorretoras;
}

// ============= 2. EXPORTAÇÃO DA FUNÇÃO DE INICIALIZAÇÃO =============

/**
 * 🚀 Função de inicialização pública (chamada pelo canvas.js)
 */
export async function iniciarPopulacaoCorretoras() {
    const resultado = await popularFormulario();
    
    // 🔄 SINCRONIZAR SELECT COM REGISTRO EXIBIDO
    // Após popular o formulário, sincroniza a select de pesquisa com o registro atual
    setTimeout(async () => {
        const { _repopularSelectDePesquisa } = await import('../framework_dsb/frontend/General_Classes/OperacoesCRUD.js');
        _repopularSelectDePesquisa();
        console.log('✅ Select sincronizada com registro atual');
    }, 200);
    
    return resultado;
}
