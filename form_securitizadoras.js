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
        FORMULÁRIO DE SECURITIZADORAS - INVCTL
************************************************************

Este arquivo implementa o formulário para cadastro de securitizadoras
seguindo o novo padrão property-based configuration do framework DSB.

PADRÃO: 0 FILTROS + 1 PESQUISA (0F+1P)
- Uma única select de pesquisa que lista todos os registros
- Ao selecionar um registro na select, o formulário é populado automaticamente

ESTRUTURA DA TABELA SECURITIZADORA:
- id_securitizadora (PK)
- cnpj, nome_completo, nome_fantasia, codigo_cvm, status_operacional
- capital_social, patrimonio_liquido
- rating_fitch, rating_moodys, rating_sp, rating_nacional, data_atualizacao_rating
- data_inicio_operacao, total_emissoes_realizadas, volume_total_emitido, total_emissoes_ativas
- especialidade_setor, qualidade_originacao, observacoes
*/

// ============= 1. CONSTRUÇÃO DO FORMULÁRIO =============

/**
 * 🏗️ CONSTRUTOR PRINCIPAL: Formulário de Securitizadoras
 */
export function construirFormularioSecuritizadoras() {
    console.log('🏗️ Construindo formulário Securitizadoras...');
    
    const formSecuritizadoras = new FormComum();
    
    // ✅ CONFIGURAÇÃO POR PROPRIEDADES (novo padrão)
    formSecuritizadoras.titulo = 'Securitizadoras';
    formSecuritizadoras.descricao = ' - Cadastro de empresas securitizadoras';
    formSecuritizadoras.tipo = [
        'input', 'input', 'input', 'input', 'input', 'input', 'input', 
        'input', 'input', 'input', 'input', 'date', 'date', 'input', 
        'input', 'input', 'input', 'input', 'textarea'
    ]; 
    formSecuritizadoras.label = [
        'CNPJ', 'Nome Completo', 'Nome Fant.', 'Cód.CVM',
        'Status Operacional', 'Capital Social (R$)', 'Patrimônio Líquido (R$)',
        'Rating Fitch', 'Rating Moodys', 'Rating S&P', 'Rating Nacional',
        'Data Atualização Rating', 'Data Início Operação',
        'Tot. Emissões Realizadas', 'Vol. Total Emitido (R$)', 'Tot. Emissões Ativas',
        'Especialidade Setor', 'Qualidade Originação (A/B/C)',
        'Observações'
    ];
    formSecuritizadoras.nomeCampo = [
        'cnpj', 'nome_completo', 'nome_fantasia', 'codigo_cvm',
        'status_operacional', 'capital_social', 'patrimonio_liquido',
        'rating_fitch', 'rating_moodys', 'rating_sp', 'rating_nacional',
        'data_atualizacao_rating', 'data_inicio_operacao',
        'total_emissoes_realizadas', 'volume_total_emitido', 'total_emissoes_ativas',
        'especialidade_setor', 'qualidade_originacao',
        'observacoes'
    ];
    formSecuritizadoras.format = [
        'texto', 'texto', 'texto', 'texto',
        'texto', 'moeda', 'moeda',
        'texto', 'texto', 'texto', 'texto',
        'data', 'data',
        'int', 'moeda', 'int',
        'texto', 'texto',
        'texto'
    ];
    formSecuritizadoras.pos = [
        {linha: 0, coluna: 0}, // CNPJ
        {linha: 0, coluna: 1}, // Nome Completo
        {linha: 0, coluna: 2}, // Nome Fantasia
        {linha: 0, coluna: 3}, // Código CVM
        {linha: 1, coluna: 0}, // Status Operacional
        {linha: 1, coluna: 1}, // Capital Social
        {linha: 1, coluna: 2}, // Patrimônio Líquido
        {linha: 2, coluna: 0}, // Rating Fitch
        {linha: 2, coluna: 1}, // Rating Moodys
        {linha: 2, coluna: 2}, // Rating S&P
        {linha: 2, coluna: 3}, // Rating Nacional
        {linha: 3, coluna: 0}, // Data Atualização Rating
        {linha: 3, coluna: 1}, // Data Início Operação
        {linha: 4, coluna: 0}, // Total Emissões Realizadas
        {linha: 4, coluna: 1}, // Volume Total Emitido
        {linha: 4, coluna: 2}, // Total Emissões Ativas
        {linha: 5, coluna: 0}, // Especialidade Setor
        {linha: 5, coluna: 1}, // Qualidade Originação
        {linha: 6, coluna: 0}  // Observações
    ];
    formSecuritizadoras.alinhamento = [
        'H', 'H', 'H', 'H', 'H', 'H', 'H', 
        'H', 'H', 'H', 'H', 'H', 'H', 'H', 
        'H', 'H', 'H', 'H', 'V'
    ]; 
    formSecuritizadoras.largCampos = [
        5, 15, 10, 7, 
        8, 12, 12, 
        6, 6, 6, 8, 
        8, 8, 
        8, 12, 8, 
        20, 6, 
        60
    ]; 
    formSecuritizadoras.posicaoCanvas = {x: 3, y: 5}; 
    formSecuritizadoras.grupoBotoes = ['S', 'S', 'S']; // Encerrar + Navegação + CRUD
    
    window.api_info.tabela_alvo = 'securitizadora'; 
    window.api_info.campos_obrigatorios = ['cnpj', 'nome_completo']; 
    window.api_info.view = "securitizadora_view"; 
    window.api_info.campos = ['Todos']; 
    
    window.api_info.pk = 'id_securitizadora'; 
    window.api_info.campos_relacionados = []; 

    // Configuração dos selects (PADRÃO 0F+1P)
    formSecuritizadoras.configSelects = {
        labels: ['Nome Completo'], // Label da select
        campos: ['nome_completo'], // Campo usado na select
        larguras: ['250px'], // Largura da select
        campo_exibir: ['nome_completo'], // Campo exibido nas opções
        campo_value: ['id_securitizadora'], // Campo value (PK)
        arranjo: 'linha' // Arranjo horizontal
    };

    // ✅ RENDERIZAÇÃO MANUAL
    formSecuritizadoras.render();
    
    // Popula select usando método padrão do framework
    if (formSecuritizadoras.configSelects && formSecuritizadoras.configSelects.campos) {
        console.log('⏰ Agendando população de selects...');
        setTimeout(() => {
            console.log('🚀 Executando população de selects...');
            popularSelectPorConfiguracao(formSecuritizadoras);
        }, 100);
    }
    
    // Configurar listener para eventos de select
    criarListener(document, 'select-alterada', async (event) => {
        console.log('🔄 Select alterado:', event.detail);
        const { campo, valor } = event.detail;
        await form_listener(formSecuritizadoras, campo, valor, event);
    });

    // Desabilitar campos de dados inicialmente
    setTimeout(() => {
        desabilitarControlesDeFrm();
        console.log('🔒 Estado inicial: Campos de dados desabilitados');
    }, 150);
    
    return formSecuritizadoras;
}

// ============= 2. EXPORTAÇÃO DA FUNÇÃO DE INICIALIZAÇÃO =============

/**
 * 🚀 Função de inicialização pública (chamada pelo canvas.js)
 */
export async function iniciarPopulacaoSecuritizadoras() {
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
