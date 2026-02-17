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
        FORMULÁRIO DE ADMINISTRADORAS - INVCTL
************************************************************

Este arquivo implementa o formulário para cadastro de administradoras de fundos
seguindo o novo padrão property-based configuration do framework DSB.

PADRÃO: 0 FILTROS + 1 PESQUISA (0F+1P)
- Uma única select de pesquisa que lista todas as administradoras pelo nome completo
- Ao selecionar uma administradora na select, o formulário é populado automaticamente

*/

// ============= 1. CONSTRUÇÃO DO FORMULÁRIO =============

/**
 * 🏗️ CONSTRUTOR PRINCIPAL: Formulário de administradoras
 */
export function construirFormularioAdministradoras() {
    console.log('🏗️ Construindo formulário Administradoras...');
    
    const formAdministradoras = new FormComum();
    
    // ✅ CONFIGURAÇÃO POR PROPRIEDADES (novo padrão)
    formAdministradoras.titulo = 'Administradoras de Fundos';
    formAdministradoras.descricao = ' - Cadastro de administradoras';
    formAdministradoras.tipo = ['input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'textarea']; 
    formAdministradoras.label = [
        'CNPJ', 
        'Nome Completo', 
        'Nome Fantasia', 
        'Código CVM', 
        'Status', 
        'Patrimônio Administrado (R$)', 
        'Nº Fundos Administrados',
        'Data Início Operação', 
        'Certificação ANBIMA',
        'Rating Controles Internos', 
        'Data Cadastro',
        'Observações'
    ];
    formAdministradoras.nomeCampo = [
        'cnpj', 
        'nome_completo', 
        'nome_fantasia', 
        'codigo_cvm', 
        'status', 
        'patrimonio_administrado', 
        'numero_fundos_administrados',
        'data_inicio_operacao', 
        'possui_certificacao_anbima',
        'rating_controles_internos', 
        'data_cadastro',
        'observacoes'
    ];
    formAdministradoras.format = [
        'cnpj', 
        'texto', 
        'texto', 
        'texto', 
        'texto', 
        'moeda', 
        'int',
        'data', 
        'texto',
        'texto', 
        'data',
        'texto'
    ];
    formAdministradoras.pos = [
        {linha: 0, coluna: 0}, // CNPJ
        {linha: 0, coluna: 1}, // Nome Completo
        {linha: 1, coluna: 0}, // Nome Fantasia
        {linha: 1, coluna: 1}, // Código CVM
        {linha: 1, coluna: 2}, // Status
        {linha: 2, coluna: 0}, // Patrimônio Administrado
        {linha: 2, coluna: 1}, // Nº Fundos Administrados
        {linha: 2, coluna: 2}, // Data Início Operação
        {linha: 3, coluna: 0}, // Certificação ANBIMA
        {linha: 3, coluna: 1}, // Rating Controles
        {linha: 3, coluna: 2}, // Data Cadastro
        {linha: 4, coluna: 0}  // Observações
    ];
    formAdministradoras.alinhamento = [
        'H', 'H', 'H', 'H', 'H', 'H', 
        'H', 'H', 'H', 'H', 'H', 'V'
    ]; 
    formAdministradoras.largCampos = [
        8,  // CNPJ
        25, // Nome Completo
        20, // Nome Fantasia
        7,  // Código CVM
        8,  // Status
        12, // Patrimônio
        5,  // Nº Fundos
        10, // Data Início
        10, // Certificação
        10, // Rating
        10, // Data Cadastro
        50  // Observações
    ]; 
    formAdministradoras.posicaoCanvas = {x: 3, y: 5}; 
    formAdministradoras.grupoBotoes = ['S', 'S', 'S']; // Encerrar + Navegação + CRUD
    
    window.api_info.tabela_alvo = 'administradoras'; 
    window.api_info.campos_obrigatorios = ['cnpj', 'nome_completo']; 
    window.api_info.view = "administradoras_view"; 
    window.api_info.campos = ['Todos']; 
    
    window.api_info.pk = 'id_administradora'; 
    window.api_info.campos_relacionados = []; // Sem FKs

    // Configuração dos selects (PADRÃO 0F+1P)
    formAdministradoras.configSelects = {
        labels: ['Nome Completo'],
        campos: ['nome_completo'],
        larguras: ['250px'],
        campo_exibir: ['nome_completo'],
        campo_value: ['id_administradora'],
        arranjo: 'linha'
    };

    // ✅ RENDERIZAÇÃO MANUAL
    formAdministradoras.render();
    
    // Popula select usando método padrão do framework
    if (formAdministradoras.configSelects && formAdministradoras.configSelects.campos) {
        console.log('⏰ Agendando população de selects...');
        setTimeout(() => {
            console.log('🚀 Executando população de selects...');
            popularSelectPorConfiguracao(formAdministradoras);
        }, 100);
    }
    
    // Configurar listener para eventos de select
    criarListener(document, 'select-alterada', async (event) => {
        console.log('🔄 Select alterado:', event.detail);
        const { campo, valor } = event.detail;
        await form_listener(formAdministradoras, campo, valor, event);
    });

    // Desabilitar campos de dados inicialmente
    setTimeout(() => {
        desabilitarControlesDeFrm();
        console.log('🔒 Estado inicial: Campos de dados desabilitados');
    }, 150);
    
    return formAdministradoras;
}

// ============= 2. EXPORTAÇÃO DA FUNÇÃO DE INICIALIZAÇÃO =============

/**
 * 🚀 Função de inicialização pública (chamada pelo canvas.js)
 */
export async function iniciarPopulacaoAdministradoras() {
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
