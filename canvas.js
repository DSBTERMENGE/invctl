// canvas.js
// Responsável apenas pela exibição da interface usando o frontend

// Importando funções de debugging (primeiro para seguir critério)
import { flow_marker, error_catcher } from '../framework_dsb/frontend/General_Classes/Debugger.js';

import api_fe from '../framework_dsb/frontend/General_Classes/frontend_api.js';
import { ConstrutorDeInterfaceAplicacao } from '../framework_dsb/frontend/General_Classes/ConstrutorDeInterfaceAplicacao.js';
import { CriarMenuAplicacao } from '../framework_dsb/frontend/General_Classes/ConstrutorMenuAplicacao.js';
import { encerrarAplicativo } from '../framework_dsb/frontend/General_Classes/FuncoesAuxilares.js';

// TODO: Importar formulários específicos do InvCtl quando criados
import { construirFormularioTipoInvestimento, iniciarPopulacaoForm as iniciarPopulacaoTipoInv } from './form_tipo_investimento.js';
// import { construirFormularioBancos } from './form_bancos.js';
// import { construirFormularioRendaFixa } from './form_renda_fixa.js';

// Importar relatórios
import { CriarRelatorioTipoInvestimento } from './relatorioTipoInvestimento.js';


// Função para criar títulos (equivalente ao que ui_menu.js fazia)
export function criarTitulos() {
    const config = {
        titulo: 'InvCtl',
        descricao: 'Controle de Investimentos',
        icone: './Assets/icon_invctl.svg'
    };
    
    const interfaceApp = new ConstrutorDeInterfaceAplicacao(config);
    interfaceApp.criarTitulosIntegrado();
}

// Função para registrar listeners (implementação dos eventos de navegação)
export function registrarListeners() {
  
    // Array com os menus e seus handlers
    const menusComListeners = [
        { id: 'id_menu_principal', handler: handlerMenuPrincipal },
        { id: 'id_menu_cadastro', handler: handlerMenuCadastro },
        { id: 'id_menu_investimentos', handler: handlerMenuInvestimentos },
        { id: 'id_menu_relatorios', handler: handlerMenuRelatorios },
        { id: 'id_menu_rel_investimentos', handler: handlerMenuRelInvestimentos },
        { id: 'id_menu_rel_detalhes', handler: handlerMenuRelDetalhes }
    ];
    
    // Registra os event listeners para cada menu
    menusComListeners.forEach(({ id, handler }) => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.addEventListener('botao-clicado', handler);
            console.log(`✅ Listener registrado para menu: ${id}`);
        } else {
            console.warn(`⚠️ Menu não encontrado: ${id}`);
        }
    });
}

// ============= HANDLERS DE EVENTOS DOS MENUS =============

/**
 * Handler do Menu Principal
 */
async function handlerMenuPrincipal(e) {
    console.log('🎯 Menu Principal - Botão clicado:', e.detail.label);

    switch (e.detail.label) {
        case "Sair":
            encerrarAplicativo('InvCtl');
            break;
            
        case "Cadastro":
            console.log('📂 Abrindo submenu de Cadastro...');
            alternarMenu('id_menu_principal', 'id_menu_cadastro');
            break;

        case "Extração de Dados":
            console.log('📤 Extração de Dados');
            alert('Funcionalidade "Extração de Dados" em desenvolvimento');
            break;

        case "Ferramentas":
            console.log('🔧 Ferramentas');
            alert('Funcionalidade "Ferramentas" em desenvolvimento');
            break;

        case "Relatórios":
            console.log('📊 Abrindo submenu de Relatórios...');
            alternarMenu('id_menu_principal', 'id_menu_relatorios');
            break;
            
        default:
            console.log('⚠️ Opção não implementada:', e.detail.label);
            alert(`Funcionalidade "${e.detail.label}" em desenvolvimento`);
            break;
    }
}

/**
 * Handler do Menu Investimentos (3º nível)
 */
function handlerMenuInvestimentos(e) {
    console.log('💰 Menu Investimentos - Botão clicado:', e.detail.label);

    switch (e.detail.label) {
        case "Retornar":
            console.log('↩️ Retornando ao submenu Cadastro...');
            alternarMenu('id_menu_investimentos', 'id_menu_cadastro');
            break;

        case "Inv. RF":
            console.log('📊 Abrindo formulário Inv. RF...');
            alert('Formulário "Inv. RF" em desenvolvimento');
            // TODO: window.api_info.form_ativo = construirFormInvRF();
            break;

        case "Inv. Fundos":
            console.log('📈 Abrindo formulário Inv. Fundos...');
            alert('Formulário "Inv. Fundos" em desenvolvimento');
            // TODO: window.api_info.form_ativo = construirFormInvFundos();
            break;

        case "Inv. FII":
            console.log('🏢 Abrindo formulário Inv. FII...');
            alert('Formulário "Inv. FII" em desenvolvimento');
            // TODO: window.api_info.form_ativo = construirFormInvFII();
            break;

        case "Inv. Ações":
            console.log('📊 Abrindo formulário Inv. Ações...');
            alert('Formulário "Inv. Ações" em desenvolvimento');
            // TODO: window.api_info.form_ativo = construirFormInvAcoes();
            break;

        default:
            console.log('⚠️ Opção não implementada:', e.detail.label);
            alert(`Funcionalidade "${e.detail.label}" em desenvolvimento`);
            break;
    }
}

/**
 * Handler do Menu Cadastro
 */
function handlerMenuCadastro(e) {
    console.log('📂 Menu Cadastro - Botão clicado:', e.detail.label);

    switch (e.detail.label) {
        case "Retornar":
            console.log('↩️ Retornando ao menu principal...');
            alternarMenu('id_menu_cadastro', 'id_menu_principal');
            break;

        case "Investimentos":
            console.log('💰 Abrindo submenu de Investimentos...');
            alternarMenu('id_menu_cadastro', 'id_menu_investimentos');
            break;
            
        case "Detalhes Inv RF":
            console.log('📊 Abrindo formulário Detalhes Inv RF...');
            window.api_info.form_ativo = construirFormularioTipoInvestimento();
            iniciarPopulacaoTipoInv();
            break;

        case "Detalhes Inv Fundos":
            console.log('📈 Abrindo formulário Detalhes Inv Fundos...');
            alert('Formulário "Detalhes Inv Fundos" em desenvolvimento');
            // TODO: window.api_info.form_ativo = construirFormDetalhesInvFundos();
            break;

        case "Detalhes Inv FII":
            console.log('🏢 Abrindo formulário Detalhes Inv FII...');
            alert('Formulário "Detalhes Inv FII" em desenvolvimento');
            // TODO: window.api_info.form_ativo = construirFormDetalhesInvFII();
            break;

        case "Detalhes Inv RV":
            console.log('📊 Abrindo formulário Detalhes Inv RV...');
            alert('Formulário "Detalhes Inv RV" em desenvolvimento');
            // TODO: window.api_info.form_ativo = construirFormDetalhesInvRV();
            break;

        case "Inst. financeiras":
            console.log('🏦 Abrindo formulário Inst. financeiras...');
            alert('Formulário "Inst. financeiras" em desenvolvimento');
            // TODO: window.api_info.form_ativo = construirFormInstFinanceiras();
            break;

        case "Índices":
            console.log('📉 Abrindo formulário Índices...');
            alert('Formulário "Índices" em desenvolvimento');
            // TODO: window.api_info.form_ativo = construirFormIndices();
            break;
             
        default:
            console.log('⚠️ Opção não implementada:', e.detail.label);
            alert(`Funcionalidade "${e.detail.label}" em desenvolvimento`);
            break;
    }
}

/**
 * Handler do Menu Relatórios (Nível 2)
 */
function handlerMenuRelatorios(e) {
    console.log('📊 Menu Relatórios - Botão clicado:', e.detail.label);

    switch (e.detail.label) {
        case "Retornar":
            console.log('↩️ Retornando ao menu principal...');
            alternarMenu('id_menu_relatorios', 'id_menu_principal');
            break;

        case "Investimentos":
            console.log('💼 Abrindo submenu Rel. Investimentos...');
            alternarMenu('id_menu_relatorios', 'id_menu_rel_investimentos');
            break;

        case "Detalhes INV":
            console.log('📋 Abrindo submenu Rel. Detalhes INV...');
            alternarMenu('id_menu_relatorios', 'id_menu_rel_detalhes');
            break;

        default:
            console.log('⚠️ Opção não implementada:', e.detail.label);
            alert(`Funcionalidade "${e.detail.label}" em desenvolvimento`);
            break;
    }
}

/**
 * Handler do Menu Rel. Investimentos (Nível 3)
 */
function handlerMenuRelInvestimentos(e) {
    console.log('💼 Menu Rel. Investimentos - Botão clicado:', e.detail.label);

    switch (e.detail.label) {
        case "Retornar":
            console.log('↩️ Retornando ao menu relatórios...');
            alternarMenu('id_menu_rel_investimentos', 'id_menu_relatorios');
            break;

        case "Inv RF":
            console.log('📊 Abrindo relatório Investimentos RF...');
            alert('Relatório "Investimentos RF" em desenvolvimento');
            break;

        case "Inv Fundos":
            console.log('📊 Abrindo relatório Investimentos Fundos...');
            alert('Relatório "Investimentos Fundos" em desenvolvimento');
            break;

        default:
            console.log('⚠️ Opção não implementada:', e.detail.label);
            alert(`Funcionalidade "${e.detail.label}" em desenvolvimento`);
            break;
    }
}

/**
 * Handler do Menu Rel. Detalhes INV (Nível 3)
 */
function handlerMenuRelDetalhes(e) {
    console.log('📋 Menu Rel. Detalhes INV - Botão clicado:', e.detail.label);

    switch (e.detail.label) {
        case "Retornar":
            console.log('↩️ Retornando ao menu relatórios...');
            alternarMenu('id_menu_rel_detalhes', 'id_menu_relatorios');
            break;

        case "Tipos de Investim.":
            console.log('📊 Abrindo relatório Tipos de Investimento...');
            CriarRelatorioTipoInvestimento();
            break;

        case "Corretoras":
            console.log('📊 Abrindo relatório Corretoras...');
            alert('Relatório "Corretoras" em desenvolvimento');
            break;

        default:
            console.log('⚠️ Opção não implementada:', e.detail.label);
            alert(`Funcionalidade "${e.detail.label}" em desenvolvimento`);
            break;
    }
}

// ============= FUNÇÃO AUXILIAR DE NAVEGAÇÃO =============

/**
 * Alterna entre menus (oculta um e exibe outro)
 * @param {string} menuParaOcultar - ID do menu a ser ocultado
 * @param {string} menuParaExibir - ID do menu a ser exibido
 */
function alternarMenu(menuParaOcultar, menuParaExibir) {
    const elementoOcultar = document.getElementById(menuParaOcultar);
    const elementoExibir = document.getElementById(menuParaExibir);

    if (elementoOcultar) {
        elementoOcultar.style.display = 'none';
        console.log(`🔒 Menu ocultado: ${menuParaOcultar}`);
    } else {
        console.warn(`⚠️ Elemento não encontrado para ocultar: ${menuParaOcultar}`);
    }

    if (elementoExibir) {
        elementoExibir.style.display = 'flex';
        console.log(`👁️ Menu exibido: ${menuParaExibir}`);
    } else {
        console.warn(`⚠️ Elemento não encontrado para exibir: ${menuParaExibir}`);
    }
}

// ============= CRIAÇÃO DOS MENUS =============

//Criando o menu principal e sub menus
export function constroiMenus() {
    // ====================== Menu principal =======================
    const menu_princ = new CriarMenuAplicacao(
        ["Extração de Dados", "Ferramentas", "Cadastro", "Relatórios", "Sair"],
        "horizontal",
        "id_menu_principal",
        "cmd"
    );
    menu_princ.renderizar();
    console.log('✅ Menu Principal criado');

    // =============== Criando o sub menu Cadastro ===============
    const menu_cadastro = new CriarMenuAplicacao(
        ["Investimentos", "Detalhes Inv RF", "Detalhes Inv Fundos", "Detalhes Inv FII", "Detalhes Inv RV", "Inst. financeiras", "Índices", "Retornar"],
        "horizontal",
        "id_menu_cadastro",
        "cmd"
    );
    menu_cadastro.renderizar();
    document.getElementById("id_menu_cadastro").style.display = "none";
    console.log('✅ Menu Cadastro criado (oculto)');

    // =============== Criando o sub menu Investimentos (3º nível) ===============
    const menu_investimentos = new CriarMenuAplicacao(
        ["Inv. RF", "Inv. Fundos", "Inv. FII", "Inv. Ações", "Retornar"],
        "horizontal",
        "id_menu_investimentos",
        "cmd"
    );
    menu_investimentos.renderizar();
    document.getElementById("id_menu_investimentos").style.display = "none";
    console.log('✅ Menu Investimentos criado (oculto)');

    // =============== Criando o sub menu Relatórios (2º nível) ===============
    const menu_relatorios = new CriarMenuAplicacao(
        ["Investimentos", "Detalhes INV", "Retornar"],
        "horizontal",
        "id_menu_relatorios",
        "cmd"
    );
    menu_relatorios.renderizar();
    document.getElementById("id_menu_relatorios").style.display = "none";
    console.log('✅ Menu Relatórios criado (oculto)');

    // =============== Criando o sub menu Rel. Investimentos (3º nível) ===============
    const menu_rel_investimentos = new CriarMenuAplicacao(
        ["Inv RF", "Inv Fundos", "Retornar"],
        "horizontal",
        "id_menu_rel_investimentos",
        "cmd"
    );
    menu_rel_investimentos.renderizar();
    document.getElementById("id_menu_rel_investimentos").style.display = "none";
    console.log('✅ Menu Rel. Investimentos criado (oculto)');

    // =============== Criando o sub menu Rel. Detalhes INV (3º nível) ===============
    const menu_rel_detalhes = new CriarMenuAplicacao(
        ["Tipos de Investim.", "Corretoras", "Retornar"],
        "horizontal",
        "id_menu_rel_detalhes",
        "cmd"
    );
    menu_rel_detalhes.renderizar();
    document.getElementById("id_menu_rel_detalhes").style.display = "none";
    console.log('✅ Menu Rel. Detalhes INV criado (oculto)');
}
