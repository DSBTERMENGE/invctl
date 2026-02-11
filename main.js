// main.js
// Ponto de entrada principal do InvCtl

// Importando funções de debugging (PRIMEIRA LINHA para capturar erros desde o início)
import { unexpected_error_catcher, flow_marker, error_catcher } from '../framework_dsb/frontend/General_Classes/Debugger.js';

// Ativando captura de erros inesperados
unexpected_error_catcher();

import {criarTitulos} from './canvas.js';
import {constroiMenus} from './canvas.js';
import {registrarListeners} from './canvas.js';
import api_fe from '../framework_dsb/frontend/General_Classes/frontend_api.js';
import { encerrarAplicativo } from '../framework_dsb/frontend/General_Classes/FuncoesAuxilares.js';

// Declaração de tipo global para melhor IntelliSense
/** @type {api_fe} */
// @ts-ignore
var api_info;
/** @type {api_fe} */
// @ts-ignore
var api_rel_info;

// =====================================
// 🌍 INSTÂNCIA GLOBAL DA API INVCTL
// =====================================

// Detecção automática de ambiente: localhost (dev) ou PythonAnywhere (prod)
const isPythonAnywhere = window.location.hostname === "davidbit.pythonanywhere.com";
const backendUrl = isPythonAnywhere
    ? "https://davidbit.pythonanywhere.com" 
    : "http://localhost:5001";  // ⚠️ PORTA DIFERENTE DO FINCTL (5001)

// Criando instância global da API para toda a aplicação InvCtl
// ⚠️ IMPORTANTE: Passar backend_url no construtor (não usar valor padrão)
window.api_info = new api_fe("InvCtl", backendUrl);

// Declaração global do tipo para IntelliSense
/** @type {api_fe} */
window.api_info;

// Configurando propriedades globais da aplicação (fixas)
window.api_info.const_aplicacao = "InvCtl";
window.api_info.const_application_path = "c:\\Applications_DSB\\InvCtl";
window.api_info.const_versao = "1.0.0";
window.api_info.const_debug = false;
window.api_info.const_timeout = 10000;

// Configuração do banco de dados PostgreSQL
// ⚠️ IMPORTANTE: PostgreSQL não usa path de arquivo local como SQLite
// A conexão é configurada no backend (db_config.py) com host/port/database/user/password
// Deixar const_database_path VAZIO para PostgreSQL (compatibilidade com API)
window.api_info.const_database_name = "invctl_db";  // ⚠️ DATABASE SEPARADO
window.api_info.const_database_path = "";  // Vazio para PostgreSQL
window.api_info.const_database_host = "";  // Configurado no backend

// Configuração de headers HTTP (fixa para esta aplicação)
window.api_info.const_headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

// =====================================
// 📊 INSTÂNCIA GLOBAL API RELATÓRIOS
// =====================================

// Criando instância global da API específica para relatórios
// ⚠️ IMPORTANTE: Usar mesma detecção de ambiente para garantir consistência
window.api_rel_info = new api_fe("InvCtl", backendUrl);

// Configurações específicas para relatórios (herdadas da API principal)
window.api_rel_info.const_aplicacao = window.api_info.const_aplicacao;
window.api_rel_info.const_database_name = window.api_info.const_database_name;
window.api_rel_info.const_database_path = window.api_info.const_database_path;
window.api_rel_info.const_timeout = window.api_info.const_timeout;
window.api_rel_info.const_debug = window.api_info.const_debug;
window.api_rel_info.const_headers = window.api_info.const_headers;

// Log para debug (verificar se ambas as instâncias apontam para o mesmo backend)
console.log('✅ api_info.const_backend_url:', window.api_info.const_backend_url);
console.log('✅ api_rel_info.const_backend_url:', window.api_rel_info.const_backend_url);

/*
************************************************************
       FUNÇÃO PARA CARREGAR INTERFACE PRINCIPAL
************************************************************
 */

function carregarInterfacePrincipal() {
  
  // Criando o box de títulos
  criarTitulos();

  // Criando o sistema de Menus
  constroiMenus();

  // Registrando os listeners de botões
  registrarListeners();
}

/*
************************************************************
       SISTEMA DE LOGIN
************************************************************
 */

// Função global para bloquear interação (REMOVIDA)
let bloquearInteracao = null;

window.addEventListener('DOMContentLoaded', () => {
  
  // NOVO FLUXO: Primeiro exibe login, depois carrega interface
  exibirFormularioLogin();
  configurarEventosLogin();
});

/*
************************************************************
       FUNÇÕES DE LOGIN
************************************************************
 */

function exibirFormularioLogin() {
  
  // Mostra apenas o formulário de login
  const loginForm = document.getElementById('divFormLogin');
  if (loginForm) {
    loginForm.classList.remove('hidden');
  }
}

function configurarEventosLogin() {
  // Configura evento de submit do formulário de login
  const formLogin = document.getElementById('formLogin');
  if (formLogin) {
    formLogin.addEventListener('submit', function(e) {
      e.preventDefault();
      validarLogin();
    });
  }

  // Permitindo login com Enter nos campos
  const inputs = document.querySelectorAll('#divFormLogin input');
  inputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        validarLogin();
      }
    });
  });
}

// Função de validação de login
async function validarLogin() {
  
  const usuario = document.getElementById('usuario').value;
  const senha = document.getElementById('senha').value;
  
  // Validação simples de campos vazios
  if (!usuario.trim() || !senha.trim()) {
    alert('Por favor, preencha usuário e senha');
    return;
  }
  
  try {
    // Chama função de login do frontend_api
    const resultado = await window.api_info.login(usuario, senha);
    
    if (resultado.success) {
      // ✅ ARMAZENAR ID DO USUÁRIO LOGADO
      if (resultado.id_usuario) {
        window.api_info.id_usuario_logado = resultado.id_usuario;
        console.log('✅ Usuário logado - ID:', resultado.id_usuario);
      }
      
      alert(resultado.message);
      document.getElementById('divFormLogin').classList.add('hidden');
      carregarInterfacePrincipal();
    } else {
      alert(resultado.message);
      document.getElementById('senha').value = '';
      document.getElementById('senha').focus();
    }
    
  } catch (error) {
    console.error('Erro ao validar login:', error);
    alert('Erro ao conectar com o servidor');
  }
}

// Disponibiliza a função globalmente para o HTML
window.validarLogin = validarLogin;
window.encerrarAplicativo = encerrarAplicativo;
