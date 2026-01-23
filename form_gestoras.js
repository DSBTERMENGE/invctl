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
        FORMULÁRIO DE GESTORAS - INVCTL
************************************************************

Este arquivo implementa o formulário para cadastro de gestoras de investimentos
seguindo o novo padrão property-based configuration do framework DSB.

PADRÃO: 0 FILTROS + 1 PESQUISA (0F+1P)
- Uma única select de pesquisa que lista todas as gestoras pelo nome completo
- Ao selecionar uma gestora na select, o formulário é populado automaticamente

*/

// ============= 1. CONSTRUÇÃO DO FORMULÁRIO =============

/**
 * 🏗️ CONSTRUTOR PRINCIPAL: Formulário de gestoras
 */
export function construirFormularioGestoras() {
    console.log('🏗️ Construindo formulário Gestoras...');
    
    const formGestoras = new FormComum();
    
    // ✅ CONFIGURAÇÃO POR PROPRIEDADES (novo padrão)
    formGestoras.titulo = 'Gestoras de Investimentos';
    formGestoras.descricao = ' - Cadastro de gestoras';
    formGestoras.tipo = ['input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'textarea']; 
    formGestoras.label = [
        'CNPJ', 
        'Nome Completo', 
        'Nome Fantasia', 
        'Código CVM', 
        'Status', 
        'Patrimônio sob Gestão (R$)', 
        'Data Atualização AUM',
        'Nº Fundos Geridos', 
        'Data Início Operação', 
        'Anos Experiência Mercado',
        'Rentabilidade Média Fundos (%)', 
        'Nº Gestores', 
        'Gestor Principal', 
        'Rating Governança',
        'Data Cadastro',
        'Observações'
    ];
    formGestoras.nomeCampo = [
        'cnpj', 
        'nome_completo', 
        'nome_fantasia', 
        'codigo_cvm', 
        'status_operacional', 
        'patrimonio_sob_gestao', 
        'data_atualizacao_aum',
        'numero_fundos_geridos', 
        'data_inicio_operacao', 
        'anos_experiencia_mercado',
        'rentabilidade_media_fundos', 
        'numero_gestores', 
        'gestor_principal', 
        'rating_governanca',
        'data_cadastro',
        'observacoes'
    ];
    formGestoras.format = [
        'texto', 
        'texto', 
        'texto', 
        'texto', 
        'texto', 
        'moeda', 
        'data',
        'texto', 
        'data', 
        'texto',
        'pct', 
        'texto', 
        'texto', 
        'texto',
        'data',
        'texto'
    ];
    formGestoras.pos = [
        {linha: 0, coluna: 0}, // CNPJ
        {linha: 0, coluna: 1}, // Nome Completo
        {linha: 1, coluna: 0}, // Nome Fantasia
        {linha: 1, coluna: 1}, // Código CVM
        {linha: 2, coluna: 0}, // Status
        {linha: 2, coluna: 1}, // Patrimônio sob Gestão
        {linha: 2, coluna: 2}, // Data Atualização AUM
        {linha: 3, coluna: 0}, // Nº Fundos Geridos
        {linha: 3, coluna: 1}, // Data Início Operação
        {linha: 3, coluna: 2}, // Anos Experiência
        {linha: 4, coluna: 0}, // Rentabilidade Média
        {linha: 4, coluna: 1}, // Nº Gestores
        {linha: 4, coluna: 2}, // Gestor Principal
        {linha: 5, coluna: 0}, // Rating Governança
        {linha: 5, coluna: 1}, // Data Cadastro
        {linha: 6, coluna: 0}  // Observações
    ];
    formGestoras.alinhamento = [
        'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 
        'H', 'H', 'H', 'H', 'H', 'H', 'H', 'V'
    ]; 
    formGestoras.largCampos = [
        8,  // CNPJ
        25, // Nome Completo
        20, // Nome Fantasia
        7,  // Código CVM
        8,  // Status
        10, // Patrimônio
        10, // Data AUM
        5,  // Nº Fundos
        10, // Data Início
        5,  // Anos Exp
        8,  // Rentabilidade
        5,  // Nº Gestores
        15, // Gestor Principal
        8,  // Rating
        10, // Data Cadastro
        50  // Observações
    ]; 
    formGestoras.posicaoCanvas = {x: 3, y: 5}; 
    formGestoras.grupoBotoes = ['S', 'S', 'S']; // Encerrar + Navegação + CRUD
    
    window.api_info.tabela_alvo = 'gestoras'; 
    window.api_info.campos_obrigatorios = ['cnpj', 'nome_completo']; 
    window.api_info.view = "gestoras_view"; 
    window.api_info.campos = ['Todos']; 
    
    window.api_info.pk = 'id_gestora'; 
    window.api_info.campos_relacionados = []; 

    // Configuração dos selects (PADRÃO 0F+1P)
    formGestoras.configSelects = {
        labels: ['Nome Completo'],
        campos: ['nome_completo'],
        larguras: ['250px'],
        campo_exibir: ['nome_completo'],
        campo_value: ['id_gestora'],
        arranjo: 'linha'
    };

    // ✅ RENDERIZAÇÃO MANUAL
    formGestoras.render();
    
    // Popula select usando método padrão do framework
    if (formGestoras.configSelects && formGestoras.configSelects.campos) {
        console.log('⏰ Agendando população de selects...');
        setTimeout(() => {
            console.log('🚀 Executando população de selects...');
            popularSelectPorConfiguracao(formGestoras);
        }, 100);
    }
    
    // Configurar listener para eventos de select
    criarListener(document, 'select-alterada', async (event) => {
        console.log('🔄 Select alterado:', event.detail);
        const { campo, valor } = event.detail;
        await form_listener(formGestoras, campo, valor, event);
    });

    // Desabilitar campos de dados inicialmente
    setTimeout(() => {
        desabilitarControlesDeFrm();
        console.log('🔒 Estado inicial: Campos de dados desabilitados');
    }, 150);
    
    return formGestoras;
}

// ============= 2. EXPORTAÇÃO DA FUNÇÃO DE INICIALIZAÇÃO =============

/**
 * 🚀 Função de inicialização pública (chamada pelo canvas.js)
 */
export async function iniciarPopulacaoGestoras() {
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
