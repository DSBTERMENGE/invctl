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
        FORMULÁRIO DE INVESTIMENTOS RF - INVCTL
************************************************************

Este arquivo implementa o formulário para cadastro de investimentos
em renda fixa (seus investimentos pessoais).

PADRÃO: 0 FILTROS + 1 PESQUISA (0F+1P)
- Uma única select de pesquisa que lista todos os investimentos
- Ao selecionar um investimento, o formulário é populado automaticamente

*/

// ============= 1. CONSTRUÇÃO DO FORMULÁRIO =============

/**
 * 🏗️ CONSTRUTOR PRINCIPAL: Formulário de investimentos RF
 */
export function construirFormularioInvRF() {
    console.log('🏗️ Construindo formulário Investimentos RF...');
    
    const formInvRF = new FormComum();
    
    // ✅ CONFIGURAÇÃO POR PROPRIEDADES (novo padrão)
    formInvRF.titulo = 'Investimentos em Renda Fixa';
    formInvRF.descricao = ' - Cadastro de aplicações em RF';
    formInvRF.tipo = ['input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'textarea']; 
    formInvRF.label = [
        'Código',
        'Dt Aplicação',
        'Dt Vencimento',
        'Dt Liquidação',
        'Vlr Aplicado',
        'Vlr Líquido',
        '% Index',
        'Taxa Pré (%)',
        'Tipo Rent.',
        'Liquidez',
        'Dias Carênc.',
        'FGC',
        'Vlr FGC',
        'Period. Cupom',
        'Taxa Adm (%)',
        'Taxa Cust (%)',
        'IOF',
        'Status',
        'Dt/Vlr Resgate',
        'Obs'
    ];
    formInvRF.nomeCampo = [
        'codigo_ativo',
        'data_aplicacao',
        'data_vencimento',
        'data_liquidacao',
        'valor_aplicado',
        'valor_liquido_aplicado',
        'percentual_indexador',
        'taxa_prefixada',
        'tipo_rentabilidade',
        'liquidez',
        'dias_carencia',
        'garantia_fgc',
        'valor_garantido_fgc',
        'periodicidade_cupom',
        'taxa_administracao',
        'taxa_custodia',
        'iof_aplicavel',
        'status',
        'data_resgate',
        'observacoes'
    ];
    formInvRF.format = [
        'texto',
        'data',
        'data',
        'data',
        'moeda',
        'moeda',
        'pct',
        'pct',
        'texto',
        'texto',
        'texto',
        'texto',
        'moeda',
        'texto',
        'pct',
        'pct',
        'texto',
        'texto',
        'data',
        'texto'
    ];
    formInvRF.pos = [
        {linha: 0, coluna: 0}, // Código
        {linha: 0, coluna: 1}, // Data Aplicação
        {linha: 0, coluna: 2}, // Data Vencimento
        {linha: 0, coluna: 3}, // Data Liquidação (MOVIDA PARA LINHA 0)
        {linha: 1, coluna: 0}, // Valor Aplicado
        {linha: 1, coluna: 1}, // Valor Líquido
        {linha: 1, coluna: 2}, // Percentual Indexador
        {linha: 1, coluna: 3}, // Taxa Prefixada
        {linha: 2, coluna: 0}, // Tipo Rentabilidade
        {linha: 2, coluna: 1}, // Liquidez
        {linha: 2, coluna: 2}, // Dias Carência
        {linha: 2, coluna: 3}, // Garantia FGC
        {linha: 3, coluna: 0}, // Valor Garantido FGC
        {linha: 3, coluna: 1}, // Periodicidade Cupom
        {linha: 3, coluna: 2}, // Taxa Administração
        {linha: 3, coluna: 3}, // Taxa Custódia
        {linha: 4, coluna: 0}, // IOF Aplicável
        {linha: 4, coluna: 1}, // Status
        {linha: 4, coluna: 2}, // Data Resgate
        {linha: 5, coluna: 0}  // Observações
    ];
    formInvRF.alinhamento = [
        'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H',
        'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'V'
    ]; 
    formInvRF.largCampos = [
        10, // Código
        10, // Data Aplicação
        10, // Data Vencimento
        10, // Data Liquidação
        10, // Valor Aplicado
        10, // Valor Líquido
        8,  // Percentual Indexador
        8,  // Taxa Prefixada
        10, // Tipo Rentabilidade
        8,  // Liquidez
        8,  // Dias Carência
        6,  // Garantia FGC
        10, // Valor Garantido FGC
        10, // Periodicidade Cupom
        8,  // Taxa Administração
        8,  // Taxa Custódia
        6,  // IOF Aplicável
        8,  // Status
        10, // Data Resgate
        50  // Observações
    ]; 
    formInvRF.posicaoCanvas = {x: 3, y: 5}; 
    formInvRF.grupoBotoes = ['S', 'S', 'S']; // Encerrar + Navegação + CRUD
    
    window.api_info.tabela_alvo = 'inv_rf'; 
    window.api_info.campos_obrigatorios = ['id_tipo_investimento', 'data_aplicacao', 'valor_aplicado']; 
    window.api_info.view = "inv_rf_view"; 
    window.api_info.campos = ['Todos']; 
    
    window.api_info.pk = 'id_inv_rf'; 
    window.api_info.campos_relacionados = ['id_usuario', 'id_tipo_investimento', 'id_banco_emissor', 'id_corretora', 'id_indexador']; 

    // Configuração dos selects (4 FILTROS + 1 PESQUISA) - SEM SECURITIZADORA
    // Cascata: Tipo → Banco → Corretora → Indexador → Código
    formInvRF.configSelects = {
        labels: ['Tipo', 'Banco', 'Corretora', 'Indexador', 'Código'],
        campos: ['id_tipo_investimento', 'id_banco_emissor', 'id_corretora', 'id_indexador', 'codigo_ativo'],
        larguras: ['120px', '150px', '120px', '120px', '150px'],
        campo_exibir: ['descricao', 'nome_completo', 'nome_completo', 'descricao', 'codigo_ativo'],
        campo_value: ['id_tipo_investimento', 'id_banco_emissor', 'id_corretora', 'id_indexador', 'id_inv_rf'],
        arranjo: 'linha'
    };

    // ✅ RENDERIZAÇÃO MANUAL
    formInvRF.render();
    
    // Popula select usando método padrão do framework
    if (formInvRF.configSelects && formInvRF.configSelects.campos) {
        console.log('⏰ Agendando população de selects...');
        setTimeout(() => {
            console.log('🚀 Executando população de selects...');
            popularSelectPorConfiguracao(formInvRF);
        }, 100);
    }
    
    // Configurar listener para eventos de select
    criarListener(document, 'select-alterada', async (event) => {
        console.log('🔄 Select alterado:', event.detail);
        const { campo, valor } = event.detail;
        await form_listener(formInvRF, campo, valor, event);
    });

    // Desabilitar campos de dados inicialmente
    setTimeout(() => {
        desabilitarControlesDeFrm();
        console.log('🔒 Estado inicial: Campos de dados desabilitados');
    }, 150);
    
    return formInvRF;
}

// ============= 2. EXPORTAÇÃO DA FUNÇÃO DE INICIALIZAÇÃO =============

/**
 * 🚀 Função de inicialização pública (chamada pelo canvas.js)
 */
export async function iniciarPopulacaoInvRF() {
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
