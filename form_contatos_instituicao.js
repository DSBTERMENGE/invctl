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
    formContatos.tipo = ['input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'input', 'textarea']; 
    formContatos.label = ['Nome Completo', 'Cargo', 'Função', 'Setor', 'Email', 'Telefone', 'Celular', 'Ramal', 'Ativo', 'Observações'];
    formContatos.nomeCampo = ['nome_completo', 'cargo', 'funcao', 'setor', 'email', 'telefone', 'celular', 'ramal', 'ativo', 'observacoes'];
    formContatos.format = ['texto', 'texto', 'texto', 'texto', 'texto', 'texto', 'texto', 'texto', 'texto', 'texto'];
    formContatos.pos = [
        {linha: 0, coluna: 0}, // Nome Completo
        {linha: 0, coluna: 1}, // Cargo
        {linha: 1, coluna: 0}, // Função
        {linha: 1, coluna: 1}, // Setor
        {linha: 1, coluna: 2}, // Ativo
        {linha: 2, coluna: 0}, // Email
        {linha: 2, coluna: 1}, // Telefone
        {linha: 3, coluna: 0}, // Celular
        {linha: 3, coluna: 1}, // Ramal
        {linha: 4, coluna: 0}  // Observações
    ];
    formContatos.alinhamento = ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'V']; 
    formContatos.largCampos = [30, 15, 20, 15, 5, 30, 15, 15, 10, 50]; 
    formContatos.posicaoCanvas = {x: 3, y: 5}; 
    formContatos.grupoBotoes = ['S', 'S', 'S']; // Encerrar + Navegação + CRUD
    
    window.api_info.tabela_alvo = 'contatos_instituicao'; 
    window.api_info.campos_obrigatorios = ['id_tipo_instituicao', 'id_instituicao', 'nome_completo', 'cargo']; 
    window.api_info.view = "contatos_instituicao_view"; 
    window.api_info.view_Select = "tipos_instituicao_view"; // View para primeira select (framework faz múltiplas consultas)
    window.api_info.campos = ['Todos']; 

    // ✅ NOVAS PROPRIEDADES DA ABORDAGEM HÍBRIDA
    window.api_info.pk = 'id_contato'; 
    window.api_info.campos_relacionados = ['id_tipo_instituicao', 'id_instituicao']; // Campos relacionados obtidos das selects de filtro

    // 🎯 CONFIGURAÇÃO DOS SELECTS: 2 FILTROS + 1 PESQUISA
    // SELECT 1: Tipo de instituição (corretora, banco, gestora...)
    // SELECT 2: Instituição específica (filtra por tipo)
    // SELECT 3: Contato (filtra por tipo + instituição)
    formContatos.configSelects = {
        labels: ['Tipo Instituição', 'Instituição', 'Nome Contato'],
        campos: ['tipo_instituicao', 'id_instituicao', 'nome_completo'],
        larguras: ['150px', '250px', '250px'],
        campo_exibir: ['descricao', 'nome_fantasia', 'nome_completo'],
        campo_value: ['id_tipo_instituicao', 'id_instituicao', 'id_contato'],
        arranjo: 'linha'
    };

    // 🗺️ MAPEAMENTO CONDICIONAL DE VIEWS POR TIPO DE INSTITUIÇÃO
    // Define qual view usar para a segunda select baseado no tipo selecionado
    formContatos.viewsMap = {
        '1': 'corretoras_view',           // Corretora
        '2': 'bancos_view',                // Banco
        '3': 'gestoras_view',              // Gestora
        '4': 'administradoras_view',       // Administradora
        '5': 'securitizadoras_view',       // Securitizadora
        '6': 'custodiantes_view'           // Custodiante
    };

    // ✅ RENDERIZAÇÃO MANUAL (novo padrão)
    formContatos.render();
    
    // TRATAMENTO DE SELECTS
    // Verifica se existe configuração de selects e se há mais de um campo (indicando filtros)
    if (formContatos.configSelects && formContatos.configSelects.campos && formContatos.configSelects.campos.length > 1) {
        // ✅ INICIALIZAÇÃO DO SISTEMA DE FILTROS INTELIGENTE
        // Constroi uma string cpo1=`*`, cpo2=`*`, ..., cpoN=`*`
        // Exemplo inicial: "id_tipo_instituicao = *, id_instituicao = *"
        window.api_info.filtros = construirFiltroInicial(formContatos.configSelects);
        console.log(`🔧 Filtro inicial configurado: "${window.api_info.filtros}"`);
        
        // Popula primeira select de filtros
        setTimeout(() => {
            popularSelectPorConfiguracao(formContatos);
        }, 100);
    }
    
    // Configurar listener para eventos de select - SISTEMA DE FILTROS COM DESVIO CONDICIONAL
    criarListener(document, 'select-alterada', async (event) => {
        const { campo, valor } = event.detail;
        console.log(`🔄 Select '${campo}' alterado para: ${valor}`);

        // 🔀 PRIMEIRA SELECT (tipo_instituicao): Popula segunda select com view específica
        if (campo === 'tipo_instituicao' && valor) {
            // ✅ Atualiza filtros (framework usa isso no INSERT/UPDATE)
            window.api_info.filtros = `id_tipo_instituicao = ${valor} AND id_instituicao = *`;
            
            // Busca view do tipo selecionado
            const viewInstituicao = formContatos.viewsMap[valor];
            const selectInstituicao = document.getElementById('select_id_instituicao');
            
            if (viewInstituicao && selectInstituicao) {
                selectInstituicao.innerHTML = '<option value="">Selecione...</option>';
                
                const resultado = await window.api_info.consulta_dados_form(viewInstituicao);
                if (resultado.mensagem === "sucesso" && resultado.dados.dados.length > 0) {
                    // Popula segunda select - backend retorna id e nome_fantasia
                    resultado.dados.dados.forEach(inst => {
                        const option = document.createElement('option');
                        option.value = inst.id_corretora || inst.id_banco || inst.id_gestora || Object.values(inst)[0];
                        option.textContent = inst.nome_fantasia || inst.nome_completo;
                        selectInstituicao.appendChild(option);
                    });
                }
            }
        }
        // 🔀 SEGUNDA SELECT (id_instituicao): Atualiza filtro com valor selecionado
        else if (campo === 'id_instituicao' && valor) {
            // ✅ Atualiza filtros - substitui asterisco pelo ID real
            window.api_info.filtros = window.api_info.filtros.replace('id_instituicao = *', `id_instituicao = ${valor}`);
            
            // Continua fluxo normal (popular terceira select se houver)
            await form_listener(formContatos, campo, valor, event);
        }
        // ✅ DEMAIS SELECTS: Fluxo padrão do framework
        else {
            await form_listener(formContatos, campo, valor, event);
        }
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
export function iniciarPopulacaoContatos() {
    console.log('🔄 Iniciando população do formulário de contatos...');
    
    setTimeout(async () => {
        try {
            await popularFormulario();
            console.log('✅ População de contatos concluída');
        } catch (erro) {
            console.error('❌ Erro na população de contatos:', erro);
        }
    }, 200);
}
