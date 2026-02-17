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
        FORMULÁRIO DE BANCOS - INVCTL
************************************************************

Este arquivo implementa o formulário para cadastro de bancos
seguindo o novo padrão property-based configuration do framework DSB.

ESTRUTURA DA TABELA BANCO:
- id_banco (PK)
- codigo_bacen (código único do Banco Central)
- cnpj
- nome_completo
- nome_fantasia
- tipo_instituicao (Banco Comercial, Banco Múltiplo, Cooperativa, etc)
- status_operacional (Ativo, Liquidação, Intervenção, Regime Especial)
- data_inicio_operacao
- capital_social
- indice_basileia (percentual)
- data_atualizacao_basileia
- rating_fitch, rating_moodys, rating_sp, rating_nacional
- data_atualizacao_rating
- possui_garantia_fgc (S/N)
- historico_intervencoes (TEXT)
- observacoes (TEXT)

PADRÃO: 0 Filtros + 1 Pesquisa (0F+1P)
*/

// ============= 1. CONSTRUÇÃO DO FORMULÁRIO =============

/**
 * 🏗️ CONSTRUTOR PRINCIPAL: Formulário de bancos
 */
export function construirFormularioBancos() {
    console.log('🏗️ Construindo formulário Bancos...');
    
    const formBancos = new FormComum();
    
    // ✅ CONFIGURAÇÃO POR PROPRIEDADES (novo padrão)
    formBancos.titulo = 'Bancos';
    formBancos.descricao = ' - Cadastro de instituições bancárias';
    formBancos.tipo = [
        'input', 'input', 'input', 'input', 'input', 'input', 'date', 
        'input', 'input', 'date', 'input', 'input', 'input', 'date', 'textarea'
    ]; 
    formBancos.label = [
        'Código BACEN', 'CNPJ', 'Nome Completo', 'Nome Fantasia', 
        'Tipo Instituição', 'Status', 'Data Início', 
        'Capital Social (R$)', 'Índice Basileia (%)', 'Data Atualização Basileia',
        'Rating Fitch', 'Rating Moodys', 'Rating S&P', 'Data Atualização Rating',
        'Observações'
    ];
    formBancos.nomeCampo = [
        'codigo_bacen', 'cnpj', 'nome_completo', 'nome_fantasia',
        'tipo_instituicao', 'status', 'data_inicio_operacao',
        'capital_social', 'indice_basileia', 'data_atualizacao_basileia',
        'rating_fitch', 'rating_moodys', 'rating_sp', 'data_atualizacao_rating',
        'observacoes'
    ];
    formBancos.format = [
        'texto', 'cnpj', 'texto', 'texto',
        'texto', 'texto', 'data',
        'texto', 'pct', 'data',
        'texto', 'texto', 'texto', 'data',
        'texto'
    ];
    formBancos.pos = [
        {linha: 0, coluna: 0}, // Código BACEN
        {linha: 0, coluna: 1}, // CNPJ
        {linha: 1, coluna: 0}, // Nome Completo
        {linha: 1, coluna: 1}, // Nome Fantasia
        {linha: 2, coluna: 0}, // Tipo Instituição
        {linha: 2, coluna: 1}, // Status
        {linha: 2, coluna: 2}, // Data Início
        {linha: 3, coluna: 0}, // Capital Social
        {linha: 3, coluna: 1}, // Índice Basileia
        {linha: 3, coluna: 2}, // Data Atualização Basileia
        {linha: 4, coluna: 0}, // Rating Fitch
        {linha: 4, coluna: 1}, // Rating Moodys
        {linha: 4, coluna: 2}, // Rating S&P
        {linha: 5, coluna: 0}, // Data Atualização Rating
        {linha: 6, coluna: 0}  // Observações
    ];
    formBancos.alinhamento = [
        'H', 'H', 'H', 'H', 'H', 'H', 'H', 
        'H', 'H', 'H', 'H', 'H', 'H', 'H', 'V'
    ]; 
    formBancos.largCampos = [
        8, 10, 25, 25, 
        15, 12, 8, 
        12, 8, 8, 
        6, 6, 6, 8, 60
    ]; 
    formBancos.posicaoCanvas = {x: 3, y: 5}; 
    formBancos.grupoBotoes = ['S', 'S', 'S']; // Encerrar + Navegação + CRUD
    
    window.api_info.tabela_alvo = 'bancos'; 
    window.api_info.campos_obrigatorios = ['cnpj', 'nome_completo']; 
    window.api_info.view = "bancos_view"; 
    window.api_info.campos = ['Todos']; 
    
    window.api_info.pk = 'id_banco'; 
    window.api_info.campos_relacionados = []; 

    // Configuração dos selects (0 Filtros + 1 Pesquisa)
    formBancos.configSelects = {
        labels: ['Nome Completo'],
        campos: ['nome_completo'],
        larguras: ['250px'],
        campo_exibir: ['nome_completo'],
        campo_value: ['id_banco'],
        arranjo: 'linha'
    };

    // ✅ RENDERIZAÇÃO MANUAL
    formBancos.render();
    
    // ============= FORMATAÇÃO MANUAL CAMPO CAPITAL_SOCIAL =============
    setTimeout(() => {
        const campCapitalSocial = document.getElementById('capital_social');
        if (campCapitalSocial) {
            campCapitalSocial.setAttribute('data-format', 'valor');
            
            // Formatar valor inicial se vier do banco (número puro)
            const valorInicial = campCapitalSocial.value;
            if (valorInicial && !isNaN(valorInicial) && valorInicial.trim() !== '') {
                const numero = parseFloat(valorInicial);
                if (!isNaN(numero)) {
                    campCapitalSocial.value = numero.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                }
            }
            
            // Formatação ao sair do campo
            campCapitalSocial.addEventListener('blur', function() {
                let valor = this.value.trim();
                if (!valor || valor === '') return;
                
                // Remove tudo exceto números, vírgula e ponto
                valor = valor.replace(/[^\d.,]/g, '');
                if (!valor) return;
                
                // Converte para número (aceita tanto 1234.56 quanto 1.234,56)
                let numero;
                if (valor.includes(',')) {
                    numero = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
                } else {
                    numero = parseFloat(valor);
                }
                
                if (!isNaN(numero) && numero >= 0) {
                    // Formata com 2 casas decimais e separador de milhares
                    this.value = numero.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                }
            });
            
            console.log('✅ Formatação manual capital_social configurada');
        }
    }, 200);
    
    // Popula select usando método padrão do framework
    if (formBancos.configSelects && formBancos.configSelects.campos) {
        console.log('⏰ Agendando população de selects...');
        setTimeout(() => {
            console.log('🚀 Executando população de selects...');
            popularSelectPorConfiguracao(formBancos);
        }, 100);
    }
    
    // Configurar listener para eventos de select
    criarListener(document, 'select-alterada', async (event) => {
        console.log('🔄 Select alterado:', event.detail);
        const { campo, valor } = event.detail;
        await form_listener(formBancos, campo, valor, event);
    });

    // Desabilitar campos de dados inicialmente
    setTimeout(() => {
        desabilitarControlesDeFrm();
        console.log('🔒 Estado inicial: Campos de dados desabilitados');
    }, 150);
    
    return formBancos;
}

// ============= 2. EXPORTAÇÃO DA FUNÇÃO DE INICIALIZAÇÃO =============

/**
 * 🚀 Função de inicialização pública (chamada pelo canvas.js)
 */
export async function iniciarPopulacaoBancos() {
    const resultado = await popularFormulario();
    
    // 🔄 SINCRONIZAR SELECT COM REGISTRO EXIBIDO
    setTimeout(async () => {
        const { _repopularSelectDePesquisa } = await import('../framework_dsb/frontend/General_Classes/OperacoesCRUD.js');
        _repopularSelectDePesquisa();
        console.log('✅ Select sincronizada com registro atual');
    }, 200);
    
    return resultado;
}
