//====================================================================
//           RELATÓRIO DE TIPOS DE INVESTIMENTO
//====================================================================

// Importações necessárias para o relatório
import { GridDados } from '/framework_dsb/frontend/General_Classes/ConstrutorDeRelatorios.js';
import { CriaTituloDeRelatorios, encerrarRelatorio } from '/framework_dsb/frontend/General_Classes/FuncoesAuxiliaresRelatorios.js';

/**
 * *************FUNÇÃO ORQUESTRADORA*************
 * Coordena a criação do relatório de Tipos de Investimento
 * *********************************************
 */
export async function CriarRelatorioTipoInvestimento() {
    console.log('🎯 Iniciando criação do relatório de Tipos de Investimento...');
    
    // ===== CRIAR TÍTULO GLOBAL DO RELATÓRIO =====
    CriaTituloDeRelatorios('Relatório de Tipos de Investimento', 'Cadastro completo de tipos de investimento', 'Relatorio');
    
    // ===== CONECTAR BOTÃO DE ENCERRAMENTO =====
    const btnEncerrar = document.getElementById('btnEncerrarRelatorio');
    if (btnEncerrar) {
        btnEncerrar.addEventListener('click', encerrarRelatorio);
    }
    
    try {
        // Criar relatório principal
        await CriarTabelaTipoInvestimento();
        
        // ===== TORNAR O RELATÓRIO VISÍVEL =====
        document.getElementById('divRelatorio').classList.remove('hidden');
        
        console.log('✅ Relatório criado com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro na criação do relatório:', error);
        alert('Erro ao criar relatório: ' + error.message);
    }
}

/**
 * *************CRIAÇÃO DA TABELA PRINCIPAL*************
 * Relatório de Tipos de Investimento
 * ********************************************************
 */
async function CriarTabelaTipoInvestimento() {
    
    console.log('📊 Iniciando criação da tabela...');
    
    // Configuração específica para acesso ao servidor e obtenção de dados
    window.api_rel_info.view = "tipo_investimento_view";
    window.api_rel_info.campos = ["Todos"];

    console.log('🔧 Configuração da API:', {
        view: window.api_rel_info.view,
        campos: window.api_rel_info.campos,
        database: window.api_rel_info.const_database_name
    });

    // ===== INSTÂNCIA DEDICADA DO GRIDDADOS =====
    const relatorioTipoInv = new GridDados();

    relatorioTipoInv.titulo = 'Tipos de Investimento Cadastrados';
    relatorioTipoInv.descricao = 'Lista completa de tipos de investimento';
    relatorioTipoInv.cabecalho = ['Código', 'Descrição', 'Classe', 'FGC', 'Ativo'];
    relatorioTipoInv.larguraColunas = [13, 27, 15, 8, 8]; // em vw - Código +1, Descrição -1
    relatorioTipoInv.formato = ['T', 'T', 'T', 'T', 'T']; // T=Texto
    relatorioTipoInv.alinhamento = ['E', 'E', 'C', 'C', 'C']; // E=Esquerda, C=Centro
    relatorioTipoInv.posicao = [5, 5]; // VW/VH - Responsivo
    relatorioTipoInv.configFooter = 'simples';
    
    // ✅ Aguarda a resposta da API e extrai os dados
    const resultadoAPI = await window.api_rel_info.consulta_dados_form(window.api_rel_info.view);
    
    console.log('📦 Resultado completo da API:', resultadoAPI);
    console.log('📦 resultadoAPI.dados:', resultadoAPI?.dados);
    
    // 📝 Extrai os dados da view
    const dadosView = resultadoAPI?.dados?.dados || resultadoAPI?.dados || [];
    
    console.log('🔍 Dados extraídos (dadosView):', dadosView);
    console.log('🔢 Quantidade de registros:', dadosView.length);
    
    if (dadosView.length > 0) {
        console.log('📋 Primeiro registro:', dadosView[0]);
    }
    
    // ✅ Define os dados na tabela (vai renderizar automaticamente)
    relatorioTipoInv.setDados(dadosView);
    
    console.log('✅ Relatório de Tipos de Investimento criado');
}
