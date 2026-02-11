// Importações do sistema de debug (sempre primeiro)
import { flow_marker, error_catcher } from '../framework_dsb/frontend/General_Classes/Debugger.js';
// Importações de gerenciamento de eventos
import { criarListener, desabilitarControlesDeFrm, popularSelectPorConfiguracao, form_listener } from '../framework_dsb/frontend/General_Classes/FuncoesAuxilares.js';

import FormComum from "../framework_dsb/frontend/General_Classes/ConstrutorDeForms.js";
import { abrirModalNovo, abrirModalComValores } from './modal_selecoes_fundos.js';
import { 
    popularFormulario,
    processarFiltroSelect,
    construirFiltroInicial,
} from '../framework_dsb/frontend/General_Classes/OperacoesCRUD.js';


/*
************************************************************
        FORMULÁRIO DE FUNDOS - INVCTL
************************************************************

Este arquivo implementa o formulário para cadastro de fundos
de investimento disponíveis no mercado.

IMPORTANTE: Usa modal para selecionar FKs
- id_gestora → via modal
- id_administradora → via modal  
- id_custodiante → via modal (banco)

*/

// ============= 1. CONSTRUÇÃO DO FORMULÁRIO =============

/**
 * 🏗️ CONSTRUTOR PRINCIPAL: Formulário de Fundos
 */
export function construirFormularioFundos() {
    console.log('🏗️ Construindo formulário Fundos...');
    
    const formFundos = new FormComum();
    
    // ✅ CONFIGURAÇÃO POR PROPRIEDADES
    formFundos.titulo = 'Fundos de Investimento';
    formFundos.descricao = ' - Cadastro de fundos disponíveis no mercado';
    formFundos.tipo = [
        'input',    // 1. id_gestora (HIDDEN - ID)
        'input',    // 2. id_administradora (HIDDEN - ID)
        'input',    // 3. id_custodiante (HIDDEN - ID)
        'input',    // 4. id_corretora (HIDDEN - ID)
        'input',    // 5. gestora_nome (READONLY - vem da VIEW)
        'input',    // 6. administradora_nome (READONLY - vem da VIEW)
        'input',    // 7. banco_custodiante_nome (READONLY - vem da VIEW)
        'input',    // 8. corretora_nome (READONLY - vem da VIEW)
        'input',    // 9. cnpj
        'input',    // 10. codigo_cvm
        'input',    // 11. nome_completo
        'input',    // 12. nome_abreviado
        'input',    // 13. tipo_fundo
        'input',    // 14. classificacao_anbima
        'input',    // 15. benchmark
        'input',    // 16. taxa_administracao
        'input',    // 17. taxa_performance
        'input',    // 18. taxa_entrada
        'input',    // 19. taxa_saida
        'input',    // 20. possui_come_cotas
        'input',    // 21. patrimonio_liquido
        'input',    // 22. numero_cotistas
        'data',     // 23. data_inicio
        'input',    // 24. status
        'textarea'  // 25. observacoes
    ]; 
    formFundos.label = [
        '',                          // 1. id_gestora (hidden)
        '',                          // 2. id_administradora (hidden)
        '',                          // 3. id_custodiante (hidden)
        '',                          // 4. id_corretora (hidden)
        'Gestora',                   // 5. gestora_nome (readonly)
        'Administradora',            // 6. administradora_nome (readonly)
        'Banco Custodiante',         // 7. banco_custodiante_nome (readonly)
        'Corretora',                 // 8. corretora_nome (readonly)
        'CNPJ',                      // 9. cnpj
        'Código CVM',                // 8. codigo_cvm
        'Nome Completo',             // 9. nome_completo
        'Nome Abreviado',            // 10. nome_abreviado
        'Tipo Fundo',                // 11. tipo_fundo
        'Classificação ANBIMA',      // 12. classificacao_anbima
        'Benchmark',                 // 13. benchmark
        'Taxa Adm (%)',              // 14. taxa_administracao
        'Taxa Perf (%)',             // 15. taxa_performance
        'Taxa Entrada (R$)',         // 16. taxa_entrada
        'Taxa Saída (R$)',           // 17. taxa_saida
        'Come-Cotas',                // 18. possui_come_cotas
        'Patrimônio Líquido',        // 19. patrimonio_liquido
        'Nº Cotistas',               // 20. numero_cotistas
        'Dt Início',                 // 21. data_inicio
        'Status',                    // 22. status
        'Observações'                // 23. observacoes
    ];
    formFundos.nomeCampo = [
        'id_gestora',                    // 1 (hidden)
        'id_administradora',             // 2 (hidden)
        'id_custodiante',                // 3 (hidden)
        'id_corretora',                  // 4 (hidden)
        'gestora_nome',                  // 5 (readonly - VIEW)
        'administradora_nome',           // 6 (readonly - VIEW)
        'banco_custodiante_nome',        // 7 (readonly - VIEW)
        'corretora_nome',                // 8 (readonly - VIEW)
        'cnpj',                          // 9
        'codigo_cvm',                    // 8
        'nome_completo',                 // 9
        'nome_abreviado',                // 10
        'tipo_fundo',                    // 11
        'classificacao_anbima',          // 12
        'benchmark',                     // 13
        'taxa_administracao',            // 14
        'taxa_performance',              // 15
        'taxa_entrada',                  // 16
        'taxa_saida',                    // 17
        'possui_come_cotas',             // 18
        'patrimonio_liquido',            // 19
        'numero_cotistas',               // 20
        'data_inicio',                   // 21
        'status',                        // 22
        'observacoes'                    // 23
    ];
    
    formFundos.format = [
        null,        // 1. id_gestora (hidden)
        null,        // 2. id_administradora (hidden)
        null,        // 3. id_custodiante (hidden)
        null,        // 4. id_corretora (hidden)
        'texto',     // 5. gestora_nome (readonly)
        'texto',     // 6. administradora_nome (readonly)
        'texto',     // 7. banco_custodiante_nome (readonly)
        'texto',     // 8. corretora_nome (readonly)
        'texto',     // 9. cnpj
        'texto',     // 8. codigo_cvm
        'texto',     // 9. nome_completo
        'texto',     // 10. nome_abreviado
        'texto',     // 11. tipo_fundo
        'texto',     // 12. classificacao_anbima
        'texto',     // 13. benchmark
        'pct',       // 14. taxa_administracao
        'pct',       // 15. taxa_performance
        'moeda',     // 16. taxa_entrada
        'moeda',     // 17. taxa_saida
        'texto',     // 18. possui_come_cotas
        'moeda',     // 19. patrimonio_liquido
        'texto',     // 20. numero_cotistas
        'data',      // 21. data_inicio
        'texto',     // 22. status
        'texto'      // 23. observacoes
    ];
    formFundos.pos = [
        {linha: 0, coluna: 0}, // 1. id_gestora (hidden)
        {linha: 0, coluna: 1}, // 2. id_administradora (hidden)
        {linha: 0, coluna: 2}, // 3. id_custodiante (hidden)
        {linha: 0, coluna: 3}, // 4. id_corretora (hidden)
        {linha: 1, coluna: 0}, // 5. gestora_nome (readonly)
        {linha: 1, coluna: 1}, // 6. administradora_nome (readonly)
        {linha: 1, coluna: 2}, // 7. banco_custodiante_nome (readonly)
        {linha: 1, coluna: 3}, // 8. corretora_nome (readonly)
        {linha: 2, coluna: 0}, // 9. cnpj
        {linha: 2, coluna: 1}, // 8. codigo_cvm
        {linha: 3, coluna: 0}, // 9. nome_completo
        {linha: 4, coluna: 0}, // 10. nome_abreviado
        {linha: 4, coluna: 1}, // 11. tipo_fundo
        {linha: 5, coluna: 0}, // 12. classificacao_anbima
        {linha: 5, coluna: 1}, // 13. benchmark
        {linha: 6, coluna: 0}, // 14. taxa_administracao
        {linha: 6, coluna: 1}, // 15. taxa_performance
        {linha: 6, coluna: 2}, // 16. taxa_entrada
        {linha: 6, coluna: 3}, // 17. taxa_saida
        {linha: 6, coluna: 4}, // 18. possui_come_cotas
        {linha: 7, coluna: 0}, // 19. patrimonio_liquido
        {linha: 7, coluna: 1}, // 20. numero_cotistas
        {linha: 8, coluna: 0}, // 21. data_inicio
        {linha: 8, coluna: 1}, // 22. status
        {linha: 9, coluna: 0}  // 23. observacoes
    ];
    formFundos.alinhamento = [
        'H', 'H', 'H', 'H',                   // linha 0: 4 IDs hidden
        'H', 'H', 'H', 'H',                   // linha 1: 4 readonly (gestora, admin, banco, corretora)
        'H', 'H',                             // linha 2: cnpj, codigo_cvm
        'H',                                  // linha 3: nome_completo
        'H', 'H',                             // linha 4: nome_abreviado, tipo_fundo
        'H', 'H',                             // linha 5: classificacao, benchmark
        'H', 'H', 'H', 'H', 'H',              // linha 6: 5 taxas + come-cotas
        'H', 'H',                             // linha 7: PL, cotistas
        'H', 'H',                             // linha 8: data_inicio, status
        'V'                                   // linha 9: observacoes
    ]; 
    formFundos.largCampos = [
        0, 0, 0, 0,                   // 4 IDs hidden
        12, 12, 12, 12,               // gestora, admin, banco, corretora (readonly)
        8, 6,                       // cnpj, codigo_cvm
        30,                           // nome_completo
        30, 20,                       // nome_abreviado, tipo_fundo
        30, 25,                       // classificacao, benchmark
        6, 6, 8, 8, 3,                // taxas (adm, perf, entrada, saida, come-cotas)
        15, 8,                        // PL, cotistas
        8, 15,                        // data_inicio, status
        60                            // observacoes
    ]; 
    formFundos.posicaoCanvas = {x: 3, y: 5}; 
    formFundos.grupoBotoes = ['S', 'S', 'S']; // Encerrar + Navegação + CRUD
    
    window.api_info.tabela_alvo = 'fundo'; 
    window.api_info.campos_obrigatorios = ['id_gestora', 'id_administradora', 'id_custodiante', 'id_corretora', 'tipo_fundo', 'benchmark', 'cnpj', 'nome_completo']; 
    window.api_info.view = "fundo_view"; 
    window.api_info.campos = ['Todos']; 
    
    window.api_info.pk = 'id_fundo'; 
    window.api_info.campos_relacionados = [];

    // Configuração da select de pesquisa (CNPJ e Nome Abreviado)
    formFundos.configSelects = {
        labels: ['CNPJ', 'Nome'],
        campos: ['cnpj', 'nome_abreviado'],
        larguras: ['150px', '300px'],
        campo_exibir: ['cnpj', 'nome_abreviado'],
        campo_value: ['id_fundo', 'id_fundo'],
        arranjo: 'linha'
    };

    // ✅ RENDERIZAÇÃO MANUAL
    formFundos.render();
    
    // ============= CONSTRUIR MODAL =============
    import('./modal_selecoes_fundos.js').then(module => {
        module.construirModalSelecoesFundos();
        console.log('✅ Modal de seleções fundos construído');
    });
    
    // ============= INTEGRAÇÃO COM MODAL DE SELEÇÕES =============
    
    // Ocultar campos hidden e tornar campos readonly
    setTimeout(() => {
        // Campos hidden (IDs das FKs)
        const camposHidden = ['id_gestora', 'id_administradora', 'id_custodiante', 'id_corretora'];
        camposHidden.forEach(campo => {
            const input = document.getElementById(campo);
            if (input) {
                input.type = 'hidden';
            }
        });
        
        // Campos readonly (nomes das entidades + tipo_fundo + benchmark)
        const camposReadonly = [
            'gestora_nome', 'administradora_nome', 'banco_custodiante_nome', 'corretora_nome',
            'tipo_fundo', 'benchmark'
        ];
        
        camposReadonly.forEach(campo => {
            const input = document.getElementById(campo);
            if (input) {
                input.readOnly = true;
                input.style.backgroundColor = '#f0f0f0';
                input.style.cursor = 'not-allowed';
                input.placeholder = '(Configurar via modal)';
            }
        });
        
        console.log('✅ Campos hidden e readonly configurados');
    }, 300);
    
    // Listener para receber valores do modal
    document.addEventListener('modal-fundos-confirmado', (e) => {
        console.log('📥 Valores recebidos do modal:', e.detail);
        
        const { valores, textos } = e.detail;
        
        // Preenche campos HIDDEN com IDs
        document.getElementById('id_gestora').value = valores.id_gestora || '';
        document.getElementById('id_administradora').value = valores.id_administradora || '';
        document.getElementById('id_custodiante').value = valores.id_custodiante || '';
        document.getElementById('id_corretora').value = valores.id_corretora || '';
        
        // Preenche campos READONLY com nomes
        document.getElementById('gestora_nome').value = textos.gestora_nome || '';
        document.getElementById('administradora_nome').value = textos.administradora_nome || '';
        document.getElementById('banco_custodiante_nome').value = textos.banco_custodiante_nome || '';
        document.getElementById('corretora_nome').value = textos.corretora_nome || '';
        
        // Preenche campos READONLY de tipo_fundo e benchmark
        document.getElementById('tipo_fundo').value = valores.tipo_fundo || '';
        document.getElementById('benchmark').value = valores.benchmark || '';
        
        console.log('✅ Valores transferidos: IDs nos hidden, nomes nos readonly, tipo e benchmark');
        alert('✅ Entidades configuradas com sucesso!\n\nAgora preencha os demais campos e salve o registro.');
    });
    
    // Listener para interceptar ações do formulário (INCLUIR e EDITAR)
    // Registra apenas UMA VEZ para evitar duplicação
    if (!window._listenerFundosRegistrado) {
        document.addEventListener('formulario-acao', (e) => {
            console.log('🎯 Evento formulario-acao:', e.detail);
            
            // Verifica se o evento é para a tabela 'fundo'
            if (window.api_info?.tabela_alvo !== 'fundo') {
                console.log('⏭️ Ignorando evento - tabela atual:', window.api_info?.tabela_alvo);
                return; // Ignora evento de outras tabelas
            }
            
            if (e.detail.acao === 'incluir') {
                console.log('🆕 Ação INCLUIR detectada - abrindo modal...');
                setTimeout(() => abrirModalNovo(), 300);
            } else if (e.detail.acao === 'editar') {
                console.log('✏️ Ação EDITAR detectada - abrindo modal com valores atuais...');
                const valoresAtuais = {
                    id_gestora: document.getElementById('id_gestora')?.value,
                    id_administradora: document.getElementById('id_administradora')?.value,
                    id_custodiante: document.getElementById('id_custodiante')?.value,
                    id_corretora: document.getElementById('id_corretora')?.value
                };
                setTimeout(() => abrirModalComValores(valoresAtuais), 300);
            }
        }, true); // Captura na fase de capture para interceptar ANTES do framework processar
        
        window._listenerFundosRegistrado = true;
        console.log('✅ Listener fundos registrado (UNICO)');
    }
    
    // Popula select de pesquisa
    if (formFundos.configSelects && formFundos.configSelects.campos) {
        console.log('⏰ Agendando população de selects...');
        setTimeout(() => {
            console.log('🚀 Executando população de selects...');
            popularSelectPorConfiguracao(formFundos);
        }, 100);
    }
    
    // Configurar listener para eventos de select
    criarListener(document, 'select-alterada', async (event) => {
        console.log('🔄 Select alterado:', event.detail);
        const { campo, valor } = event.detail;
        await form_listener(formFundos, campo, valor, event);
    });

    // Desabilitar campos de dados inicialmente
    setTimeout(() => {
        desabilitarControlesDeFrm();
        console.log('🔒 Estado inicial: Campos de dados desabilitados');
    }, 150);
    
    return formFundos;
}

// ============= 2. EXPORTAÇÃO DA FUNÇÃO DE INICIALIZAÇÃO =============

/**
 * 🚀 Função de inicialização pública (chamada pelo canvas.js)
 */
export async function iniciarPopulacaoFundos() {
    const resultado = await popularFormulario();
    
    // 🔄 SINCRONIZAR SELECT COM REGISTRO EXIBIDO
    setTimeout(async () => {
        const { _repopularSelectDePesquisa } = await import('../framework_dsb/frontend/General_Classes/OperacoesCRUD.js');
        _repopularSelectDePesquisa();
        console.log('✅ Select sincronizada com registro atual');
    }, 200);
    
    return resultado;
}
