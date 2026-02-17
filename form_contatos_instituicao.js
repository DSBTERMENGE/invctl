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
        FORMULÁRIO DE CONTATOS - INVCTL
************************************************************

Este arquivo implementa o formulário para cadastro de contatos
de instituições financeiras (assessores, gerentes, diretores, etc).

PADRÃO UTILIZADO:
- 2 SELECTS DE FILTRO: tipo_instituicao → id_instituicao
- 1 SELECT DE PESQUISA: nome_completo (contato)
- Sistema de filtros em cascata com onChange

NOVA ESTRUTURA DE BANCO:
- tipo_instituicao: VARCHAR(20) - 'corretora', 'banco', 'gestora', etc
- id_instituicao: INTEGER - ID genérico que aponta para a tabela do tipo

*/

// ============= 1. CONSTRUÇÃO DO FORMULÁRIO =============

/**
 * 🏗️ CONSTRUTOR PRINCIPAL: Formulário de contatos
 */
export function construirFormularioContatos() {
    console.log('🏗️ Construindo formulário Contatos...');
    
    const formContatos = new FormComum();
    
    // ✅ CONFIGURAÇÃO POR PROPRIEDADES
    formContatos.titulo = 'Contatos - Instituições Financeiras';
    formContatos.descricao = ' - Cadastro de assessores, gerentes e diretores';
    formContatos.tipo = ['input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'textarea']; 
    formContatos.label = ['Nome Completo', 'Instituição', 'Função', 'Setor', 'Email', 'Telefone', 'Celular', 'Ramal', 'Observações'];
    formContatos.nomeCampo = ['nome_completo', 'instituicao', 'funcao', 'setor', 'email', 'telefone', 'celular', 'ramal', 'observacoes'];
    formContatos.format = ['texto', 'texto', 'texto', 'texto', 'texto', 'texto', 'texto', 'texto', 'texto'];
    formContatos.pos = [
        {linha: 0, coluna: 0}, // Nome Completo
        {linha: 0, coluna: 1}, // Instituição
        {linha: 1, coluna: 0}, // Função
        {linha: 1, coluna: 1}, // Setor
        {linha: 2, coluna: 0}, // Email
        {linha: 2, coluna: 1}, // Telefone
        {linha: 3, coluna: 0}, // Celular
        {linha: 3, coluna: 1}, // Ramal
        {linha: 4, coluna: 0}  // Observações
    ];
    formContatos.alinhamento = ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'V']; 
    formContatos.largCampos = [25, 20, 15, 12, 25, 12, 12, 8, 50]; 
    formContatos.posicaoCanvas = {x: 3, y: 5}; 
    formContatos.grupoBotoes = ['S', 'S', 'S']; // Encerrar + Navegação + CRUD
    
    window.api_info.tabela_alvo = 'contatos_instituicao'; 
    window.api_info.campos_obrigatorios = ['nome_completo']; 
    window.api_info.view = "contatos_instituicao_view"; 
    window.api_info.campos = ['Todos']; 
    window.api_info.pk = 'id_contato'; 
    window.api_info.campos_relacionados = [];

    // Configuração dos selects (PADRÃO 0F+1P)
    formContatos.configSelects = {
        labels: ['Nome Contato'],
        campos: ['nome_completo'],
        larguras: ['250px'],
        campo_exibir: ['nome_completo'],
        campo_value: ['id_contato'],
        arranjo: 'linha'
    };

    // ✅ RENDERIZAÇÃO MANUAL (novo padrão)
    formContatos.render();
    
    // Popula select de pesquisa usando método padrão do framework
    if (formContatos.configSelects && formContatos.configSelects.campos) {
        console.log('⏰ Agendando população de selects...');
        setTimeout(() => {
            console.log('🚀 Executando população de selects...');
            popularSelectPorConfiguracao(formContatos);
        }, 100);
    }
    
    // Configurar listener para eventos de select
    criarListener(document, 'select-alterada', async (event) => {
        console.log('🔄 Select alterado:', event.detail);
        const { campo, valor } = event.detail;
        await form_listener(formContatos, campo, valor, event);
    });
    // ✅ DEFINIR ESTADO INICIAL DOS CAMPOS
    // Após renderização e configuração de selects, desabilitar campos de dados
    // Campos de filtro (select_*) permanecerão habilitados automaticamente
    setTimeout(() => {
        desabilitarControlesDeFrm();
        console.log('🔒 Estado inicial: Campos de dados desabilitados');
    }, 150);

    console.log('✅ Formulário Contatos criado com sucesso');
    return formContatos;
}

// ============= 2. POPULAÇÃO DO FORMULÁRIO =============

/**
 * 🔄 INICIADOR DE POPULAÇÃO: Popula o formulário com dados
 */
export async function iniciarPopulacaoContatos() {
    console.log('🔄 Iniciando população do formulário de contatos...');
    
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
