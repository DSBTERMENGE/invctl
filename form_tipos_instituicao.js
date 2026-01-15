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
        FORMULÁRIO DE TIPOS DE INSTITUIÇÃO - INVCTL
************************************************************

Este arquivo implementa o formulário para cadastro de tipos de instituição
financeira (corretora, banco, gestora, administradora, securitizadora, etc).

PADRÃO UTILIZADO:
- 1 SELECT DE PESQUISA: descricao
- Sem filtros (formulário simples)

*/

// ============= 1. CONSTRUÇÃO DO FORMULÁRIO =============

/**
 * 🏗️ CONSTRUTOR PRINCIPAL: Formulário de tipos de instituição
 */
export function construirFormularioTiposInstituicao() {
    console.log('🏗️ Construindo formulário Tipos de Instituição...');
    
    const formTipos = new FormComum();
    
    // ✅ CONFIGURAÇÃO POR PROPRIEDADES
    formTipos.titulo = 'Tipos de Instituição';
    formTipos.descricao = ' - Cadastro de tipos de instituições financeiras';
    formTipos.tipo = ['input', 'input', 'input', 'input']; 
    formTipos.label = ['Código', 'Descrição', 'Ordem Exibição', 'Ativo'];
    formTipos.nomeCampo = ['codigo', 'descricao', 'ordem_exibicao', 'ativo'];
    formTipos.format = ['texto', 'texto', 'texto', 'texto'];
    formTipos.pos = [
        {linha: 0, coluna: 0}, // Código
        {linha: 0, coluna: 1}, // Descrição
        {linha: 1, coluna: 0}, // Ordem Exibição
        {linha: 1, coluna: 1}  // Ativo
    ];
    formTipos.alinhamento = ['H', 'H', 'H', 'H']; 
    formTipos.largCampos = [8, 15, 6, 3]; 
    formTipos.posicaoCanvas = {x: 3, y: 5}; 
    formTipos.grupoBotoes = ['S', 'S', 'S']; // Encerrar + Navegação + CRUD
    
    window.api_info.tabela_alvo = 'tipos_instituicao'; 
    window.api_info.campos_obrigatorios = ['codigo', 'descricao']; 
    window.api_info.view = "tipos_instituicao_view"; 
    window.api_info.campos = ['Todos']; 
    
    window.api_info.pk = 'id_tipo_instituicao'; 
    window.api_info.campos_relacionados = []; 

    // 🎯 CONFIGURAÇÃO DOS SELECTS: 1 PESQUISA SIMPLES
    formTipos.configSelects = {
        labels: ['Tipo Instituição'],
        campos: ['descricao'],
        larguras: ['250px'],
        campo_exibir: ['descricao'],
        campo_value: ['id_tipo_instituicao'],
        arranjo: 'linha'
    };

    // ✅ RENDERIZAÇÃO MANUAL
    formTipos.render();
    
    // Popula select usando método padrão do framework
    if (formTipos.configSelects && formTipos.configSelects.campos) {
        console.log('⏰ Agendando população de selects...');
        setTimeout(() => {
            console.log('🚀 Executando população de selects...');
            popularSelectPorConfiguracao(formTipos);
        }, 100);
    }
    
    // Configurar listener para eventos de select
    criarListener(document, 'select-alterada', async (event) => {
        console.log('🔄 Select alterado:', event.detail);
        const { campo, valor } = event.detail;
        await form_listener(formTipos, campo, valor, event);
    });

    // Desabilitar campos de dados inicialmente
    setTimeout(() => {
        desabilitarControlesDeFrm();
        console.log('🔒 Estado inicial: Campos de dados desabilitados');
    }, 150);
    
    return formTipos;
}

// ============= 2. EXPORTAÇÃO DA FUNÇÃO DE INICIALIZAÇÃO =============

/**
 * 🚀 Função de inicialização pública (chamada pelo canvas.js)
 */
export async function iniciarPopulacaoTiposInstituicao() {
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
