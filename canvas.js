// canvas.js
// Responsável apenas pela exibição da interface usando o frontend

// Importando funções de debugging (primeiro para seguir critério)
import { flow_marker, error_catcher } from '../framework_dsb/frontend/General_Classes/Debugger.js';

import api_fe from '../framework_dsb/frontend/General_Classes/frontend_api.js';
import { ConstrutorDeInterfaceAplicacao } from '../framework_dsb/frontend/General_Classes/ConstrutorDeInterfaceAplicacao.js';
import { CriarMenuAplicacao } from '../framework_dsb/frontend/General_Classes/ConstrutorMenuAplicacao.js';
import { encerrarAplicativo } from '../framework_dsb/frontend/General_Classes/FuncoesAuxilares.js';

// Importar formulários específicos do InvCtl
import { construirFormularioTipoInvestimento, iniciarPopulacaoForm as iniciarPopulacaoTipoInv } from './form_tipo_investimento.js';
import { construirFormularioCorretoras, iniciarPopulacaoCorretoras } from './form_corretoras.js';
import { construirFormularioContatos, iniciarPopulacaoContatos } from './form_contatos_instituicao.js';
import { construirFormularioTiposInstituicao, iniciarPopulacaoTiposInstituicao } from './form_tipos_instituicao.js';
import { construirFormularioBancos, iniciarPopulacaoBancos } from './form_bancos.js';
import { construirFormularioSecuritizadoras, iniciarPopulacaoSecuritizadoras } from './form_securitizadoras.js';
import { construirFormularioGestoras, iniciarPopulacaoGestoras } from './form_gestoras.js';
import { construirFormularioAdministradoras, iniciarPopulacaoAdministradoras } from './form_administradoras.js';
import { construirFormularioInvRF, iniciarPopulacaoInvRF } from './form_inv_rf.js';
import { construirFormularioPapeisRF, iniciarPopulacaoPapeisRF } from './form_papeis_rf.js';
import { construirFormularioFundos, iniciarPopulacaoFundos } from './form_fundos.js';
import { construirFormularioFundosEstruturados, iniciarPopulacaoFundosEstruturados } from './form_fundos_estruturados.js';
import { construirFormularioAcoes, iniciarPopulacaoAcoes } from './form_acoes.js';
import { construirFormularioInvFundos, iniciarPopulacaoInvFundos } from './form_inv_fundos.js';
import { construirFormularioInvFundosEstruturados, iniciarPopulacaoInvFundosEstruturados } from './form_inv_fundos_estruturados.js';
import { construirFormularioInvAcoes, iniciarPopulacaoInvAcoes } from './form_inv_acoes.js';
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
        { id: 'id_menu_detalhes_inv', handler: handlerMenuDetalhesInv },
        { id: 'id_menu_instit_finan', handler: handlerMenuInstitFinan },
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
async function handlerMenuInvestimentos(e) {
    console.log('💰 Menu Investimentos - Botão clicado:', e.detail.label);

    switch (e.detail.label) {
        case "Retornar":
            console.log('↩️ Retornando ao submenu Cadastro...');
            alternarMenu('id_menu_investimentos', 'id_menu_cadastro');
            break;

        case "Inv. RF":
            console.log('📊 Abrindo formulário Inv. RF...');
            try {
                window.api_info.form_ativo = construirFormularioInvRF();
                console.log('✅ Formulário construído, iniciando população...');
                iniciarPopulacaoInvRF();
                console.log('✅ População iniciada com sucesso');
            } catch (error) {
                console.error('❌ Erro ao abrir formulário Inv. RF:', error);
            }
            break;

        case "Inv. Fundos":
            console.log('📈 Abrindo formulário Inv. Fundos...');
            window.api_info.form_ativo = construirFormularioInvFundos();
            await iniciarPopulacaoInvFundos();
            break;

        case "Inv. FII":
            console.log('🏢 Abrindo formulário Inv. Fundos Estruturados...');
            window.api_info.form_ativo = construirFormularioInvFundosEstruturados();
            await iniciarPopulacaoInvFundosEstruturados();
            break;

        case "Inv. Ações":
            console.log('📊 Abrindo formulário Inv. Ações...');
            window.api_info.form_ativo = construirFormularioInvAcoes();
            await iniciarPopulacaoInvAcoes();
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
            
        case "Papéis":
            console.log('📋 Abrindo submenu Papéis...');
            alternarMenu('id_menu_cadastro', 'id_menu_detalhes_inv');
            break;
            
        case "Instit. Finan":
            console.log('🏦 Abrindo submenu Instituições Financeiras...');
            alternarMenu('id_menu_cadastro', 'id_menu_instit_finan');
            break;
            
        case "Índices":
            console.log('📊 Abrindo formulário Índices...');
            alert('Formulário "Índices" em desenvolvimento');
            break;

        default:
            console.warn('⚠️ Opção não reconhecida:', e.detail.label);
    }
}

// ============= HANDLER: Menu Papéis (3º nível) =============
async function handlerMenuDetalhesInv(e) {
    console.log('📋 Menu Papéis - Botão clicado:', e.detail.label);

    switch (e.detail.label) {
        case "Retornar":
            console.log('↩️ Retornando ao menu Cadastro...');
            alternarMenu('id_menu_detalhes_inv', 'id_menu_cadastro');
            break;
            
        case "Tipo Investimento":
            console.log('📋 Abrindo formulário Tipo Investimento...');
            try {
                window.api_info.form_ativo = construirFormularioTipoInvestimento();
                console.log('✅ Formulário construído, iniciando população...');
                iniciarPopulacaoTipoInv();
                console.log('✅ População iniciada com sucesso');
            } catch (error) {
                console.error('❌ Erro ao abrir formulário Tipo Investimento:', error);
            }
            break;
            
        case "Papéis RF":
            console.log('📊 Abrindo formulário Papéis RF...');
            window.api_info.form_ativo = construirFormularioPapeisRF();
            await iniciarPopulacaoPapeisRF();
            break;

        case "Fundos":
            console.log('🏦 Abrindo formulário Fundos...');
            window.api_info.form_ativo = construirFormularioFundos();
            await iniciarPopulacaoFundos();
            break;

        case "Fundos Estruturados":
            console.log('🏗️ Abrindo formulário Fundos Estruturados...');
            window.api_info.form_ativo = construirFormularioFundosEstruturados();
            await iniciarPopulacaoFundosEstruturados();
            break;
            
        case "Ações":
            console.log('📈 Abrindo formulário Ações...');
            window.api_info.form_ativo = construirFormularioAcoes();
            await iniciarPopulacaoAcoes();
            break;

        default:
            console.warn('⚠️ Opção não reconhecida:', e.detail.label);
    }
}

// ============= HANDLER: Menu Instituições Financeiras (3º nível) =============
function handlerMenuInstitFinan(e) {
    console.log('🏦 Menu Instit. Finan - Botão clicado:', e.detail.label);

    switch (e.detail.label) {
        case "Retornar":
            console.log('↩️ Retornando ao menu Cadastro...');
            alternarMenu('id_menu_instit_finan', 'id_menu_cadastro');
            break;
            
        case "Corretoras":
            console.log('🏦 Abrindo formulário Corretoras...');
            try {
                window.api_info.form_ativo = construirFormularioCorretoras();
                console.log('✅ Formulário construído, iniciando população...');
                iniciarPopulacaoCorretoras();
                console.log('✅ População iniciada com sucesso');
            } catch (error) {
                console.error('❌ Erro ao abrir formulário Corretoras:', error);
            }
            break;
            
        case "Contatos":
            console.log('👤 Abrindo formulário Contatos...');
            try {
                window.api_info.form_ativo = construirFormularioContatos();
                console.log('✅ Formulário construído, iniciando população...');
                iniciarPopulacaoContatos();
                console.log('✅ População iniciada com sucesso');
            } catch (error) {
                console.error('❌ Erro ao abrir formulário Contatos:', error);
            }
            break;
            
        case "Tipo Instituição":
            console.log('🏢 Abrindo formulário Tipo Instituição...');
            try {
                window.api_info.form_ativo = construirFormularioTiposInstituicao();
                console.log('✅ Formulário construído, iniciando população...');
                iniciarPopulacaoTiposInstituicao();
                console.log('✅ População iniciada com sucesso');
            } catch (error) {
                console.error('❌ Erro ao abrir formulário Tipo Instituição:', error);
            }
            break;
            
        case "Bancos":
            console.log('🏦 Abrindo formulário Bancos...');
            try {
                window.api_info.form_ativo = construirFormularioBancos();
                console.log('✅ Formulário construído, iniciando população...');
                iniciarPopulacaoBancos();
                console.log('✅ População iniciada com sucesso');
            } catch (error) {
                console.error('❌ Erro ao abrir formulário Bancos:', error);
            }
            break;
            
        case "Securitizadoras":
            console.log('🏢 Abrindo formulário Securitizadoras...');
            try {
                window.api_info.form_ativo = construirFormularioSecuritizadoras();
                console.log('✅ Formulário construído, iniciando população...');
                iniciarPopulacaoSecuritizadoras();
                console.log('✅ População iniciada com sucesso');
            } catch (error) {
                console.error('❌ Erro ao abrir formulário Securitizadoras:', error);
            }
            break;
            
        case "Gestoras":
            console.log('💼 Abrindo formulário Gestoras...');
            try {
                window.api_info.form_ativo = construirFormularioGestoras();
                console.log('✅ Formulário construído, iniciando população...');
                iniciarPopulacaoGestoras();
                console.log('✅ População iniciada com sucesso');
            } catch (error) {
                console.error('❌ Erro ao abrir formulário Gestoras:', error);
            }
            break;
            
        case "Administradoras":
            console.log('📊 Abrindo formulário Administradoras...');
            try {
                window.api_info.form_ativo = construirFormularioAdministradoras();
                console.log('✅ Formulário construído, iniciando população...');
                iniciarPopulacaoAdministradoras();
                console.log('✅ População iniciada com sucesso');
            } catch (error) {
                console.error('❌ Erro ao abrir formulário Administradoras:', error);
            }
            break;

        default:
            console.warn('⚠️ Opção não reconhecida:', e.detail.label);
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
        ["Investimentos", "Papéis", "Instit. Finan", "Índices", "Retornar"],
        "horizontal",
        "id_menu_cadastro",
        "cmd"
    );
    menu_cadastro.renderizar();
    document.getElementById("id_menu_cadastro").style.display = "none";
    console.log('✅ Menu Cadastro criado (oculto)');

    // =============== Criando o sub menu Papéis (3º nível) ===============
    const menu_detalhes_inv = new CriarMenuAplicacao(
        ["Tipo Investimento", "Papéis RF", "Fundos", "Fundos Estruturados", "Ações", "Retornar"],
        "horizontal",
        "id_menu_detalhes_inv",
        "cmd"
    );
    menu_detalhes_inv.renderizar();
    document.getElementById("id_menu_detalhes_inv").style.display = "none";
    console.log('✅ Menu Papéis criado (oculto)');

    // =============== Criando o sub menu Instituições Financeiras (3º nível) ===============
    const menu_instit_finan = new CriarMenuAplicacao(
        ["Corretoras", "Bancos", "Securitizadoras", "Gestoras", "Administradoras", "Contatos", "Tipo Instituição", "Retornar"],
        "horizontal",
        "id_menu_instit_finan",
        "cmd"
    );
    menu_instit_finan.renderizar();
    document.getElementById("id_menu_instit_finan").style.display = "none";
    console.log('✅ Menu Instituições Financeiras criado (oculto)');

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
