// Importações do sistema de debug (sempre primeiro)
import { flow_marker, error_catcher } from '../framework_dsb/frontend/General_Classes/Debugger.js';
// Importações de gerenciamento de eventos
import { criarListener, desabilitarControlesDeFrm, popularSelectPorConfiguracao, form_listener } from '../framework_dsb/frontend/General_Classes/FuncoesAuxilares.js';

import FormComum from "../framework_dsb/frontend/General_Classes/ConstrutorDeForms.js";
import { abrirModalNovo, abrirModalComValores } from './modal_selecoes_fundos_estruturados.js';
import { 
    popularFormulario,
    processarFiltroSelect,
    construirFiltroInicial,
} from '../framework_dsb/frontend/General_Classes/OperacoesCRUD.js';


/*
************************************************************
        FORMULÁRIO DE FUNDOS ESTRUTURADOS - INVCTL
************************************************************

Este arquivo implementa o formulário para cadastro de fundos
estruturados: FII, FIAGRO, FI-Infra.

IMPORTANTE: Usa modal para selecionar FKs e tipos
- id_gestora → via modal
- id_administradora → via modal  
- id_custodiante → via modal (banco)
- id_corretora → via modal
- tipo_fundo → via modal (select fixo)
- segmento → via modal (select fixo)

*/

// ============= 1. CONSTRUÇÃO DO FORMULÁRIO =============

/**
 * 🏗️ CONSTRUTOR PRINCIPAL: Formulário de Fundos Estruturados
 */
export function construirFormularioFundosEstruturados() {
    console.log('🏗️ Construindo formulário Fundos Estruturados...');
    
    const formFundosEst = new FormComum();
    
    // ✅ CONFIGURAÇÃO POR PROPRIEDADES
    formFundosEst.titulo = 'Fundos Estruturados';
    formFundosEst.descricao = ' - Cadastro de FII, FIAGRO e FI-Infra';
    formFundosEst.tipo = [
        'input',    // 1. id_gestora (HIDDEN - ID)
        'input',    // 2. id_administradora (HIDDEN - ID)
        'input',    // 3. id_custodiante (HIDDEN - ID)
        'input',    // 4. id_corretora (HIDDEN - ID)
        'input',    // 5. gestora_nome (READONLY - vem da VIEW)
        'input',    // 6. administradora_nome (READONLY - vem da VIEW)
        'input',    // 7. banco_custodiante_nome (READONLY - vem da VIEW)
        'input',    // 8. corretora_nome (READONLY - vem da VIEW)
        'input',    // 9. tipo_fundo (READONLY - vem do modal)
        'input',    // 10. segmento (READONLY - vem do modal)
        'input',    // 11. cnpj
        'input',    // 12. codigo_negociacao (ticker)
        'input',    // 13. nome_completo
        'input',    // 14. nome_abreviado
        'input',    // 15. taxa_administracao
        'input',    // 16. taxa_performance
        'input',    // 17. data_inicio
        'input',    // 18. prazo_duracao
        'input',    // 19. status
        'textarea'  // 20. observacoes
    ]; 
    formFundosEst.label = [
        '',                          // 1. id_gestora (hidden)
        '',                          // 2. id_administradora (hidden)
        '',                          // 3. id_custodiante (hidden)
        '',                          // 4. id_corretora (hidden)
        'Gestora',                   // 5. gestora_nome (readonly)
        'Administradora',            // 6. administradora_nome (readonly)
        'Banco Custodiante',         // 7. banco_custodiante_nome (readonly)
        'Corretora',                 // 8. corretora_nome (readonly)
        'Tipo Fundo',                // 9. tipo_fundo (readonly)
        'Segmento',                  // 10. segmento (readonly)
        'CNPJ',                      // 11. cnpj
        'Código Negociação',         // 12. codigo_negociacao (ticker)
        'Nome Completo',             // 13. nome_completo
        'Nome Abreviado',            // 14. nome_abreviado
        'Taxa Adm (%)',              // 15. taxa_administracao
        'Taxa Perf (%)',             // 16. taxa_performance
        'Dt Início',                 // 17. data_inicio
        'Prazo Duração',             // 18. prazo_duracao
        'Status',                    // 19. status
        'Observações'                // 20. observacoes
    ];
    formFundosEst.nomeCampo = [
        'id_gestora',                    // 1 (hidden)
        'id_administradora',             // 2 (hidden)
        'id_custodiante',                // 3 (hidden)
        'id_corretora',                  // 4 (hidden)
        'gestora_nome',                  // 5 (readonly - VIEW)
        'administradora_nome',           // 6 (readonly - VIEW)
        'banco_custodiante_nome',        // 7 (readonly - VIEW)
        'corretora_nome',                // 8 (readonly - VIEW)
        'tipo_fundo',                    // 9 (readonly - modal)
        'segmento',                      // 10 (readonly - modal)
        'cnpj',                          // 11
        'codigo_negociacao',             // 12
        'nome_completo',                 // 13
        'nome_abreviado',                // 14
        'taxa_administracao',            // 15
        'taxa_performance',              // 16
        'data_inicio',                   // 17
        'prazo_duracao',                 // 18
        'status',                        // 19
        'observacoes'                    // 20
    ];
    
    formFundosEst.format = [
        null,        // 1. id_gestora (hidden)
        null,        // 2. id_administradora (hidden)
        null,        // 3. id_custodiante (hidden)
        null,        // 4. id_corretora (hidden)
        'texto',     // 5. gestora_nome (readonly)
        'texto',     // 6. administradora_nome (readonly)
        'texto',     // 7. banco_custodiante_nome (readonly)
        'texto',     // 8. corretora_nome (readonly)
        'texto',     // 9. tipo_fundo (readonly)
        'texto',     // 10. segmento (readonly)
        'texto',     // 11. cnpj
        'texto',     // 12. codigo_negociacao
        'texto',     // 13. nome_completo
        'texto',     // 14. nome_abreviado
        'pct',       // 15. taxa_administracao
        'pct',       // 16. taxa_performance
        'texto',     // 17. data_inicio
        'texto',     // 18. prazo_duracao
        'texto',     // 19. status
        'texto'      // 20. observacoes
    ];
    
    formFundosEst.pos = [
        {linha: 0, coluna: 0}, {linha: 0, coluna: 1}, {linha: 0, coluna: 2}, {linha: 0, coluna: 3},  // hidden
        {linha: 1, coluna: 0}, {linha: 1, coluna: 1}, {linha: 1, coluna: 2}, {linha: 1, coluna: 3},  // readonly entidades
        {linha: 2, coluna: 0}, {linha: 2, coluna: 1},                                                // readonly tipo/segmento
        {linha: 3, coluna: 0}, {linha: 3, coluna: 1},                                                // cnpj, codigo
        {linha: 4, coluna: 0}, {linha: 4, coluna: 1},                                                // nomes
        {linha: 5, coluna: 0}, {linha: 5, coluna: 1},                                                // taxas
        {linha: 6, coluna: 0}, {linha: 6, coluna: 1}, {linha: 6, coluna: 2},                         // data, prazo, status
        {linha: 7, coluna: 0}                                                                        // observacoes
    ];
    
    formFundosEst.alinhamento = [
        null, null, null, null,       // hidden
        'H', 'H', 'H', 'H',           // readonly linha 1
        'H', 'H',                     // readonly linha 2
        'H', 'H',                     // linha 3
        'H', 'H',                     // linha 4
        'H', 'H',                     // linha 5
        'H', 'H', 'H',                // linha 6
        'V'                           // observacoes vertical
    ];
    
    formFundosEst.largCampos = [
        0, 0, 0, 0,                   // hidden
        15, 15, 15, 15,               // readonly linha 1
        12, 20,                       // readonly linha 2
        12, 10,                       // cnpj, codigo
        30, 20,                       // nomes
        8, 8,                         // taxas
        10, 15, 10,                   // data, prazo, status
        60                            // observacoes
    ]; 
    formFundosEst.posicaoCanvas = {x: 3, y: 5}; 
    formFundosEst.grupoBotoes = ['S', 'S', 'S']; // Encerrar + Navegação + CRUD
    
    window.api_info.tabela_alvo = 'fundo_estruturado'; 
    window.api_info.campos_obrigatorios = ['id_gestora', 'id_administradora', 'id_custodiante', 'id_corretora', 'tipo_fundo', 'cnpj', 'codigo_negociacao', 'nome_completo']; 
    window.api_info.view = "fundo_estruturado_view"; 
    window.api_info.campos = ['Todos']; 
    
    window.api_info.pk = 'id_fundo_estruturado'; 
    window.api_info.campos_relacionados = [];

    // Configuração da select de pesquisa (Código e Nome)
    formFundosEst.configSelects = {
        labels: ['Código', 'Nome'],
        campos: ['codigo_negociacao', 'nome_abreviado'],
        larguras: ['100px', '300px'],
        campo_exibir: ['codigo_negociacao', 'nome_abreviado'],
        campo_value: ['id_fundo_estruturado', 'id_fundo_estruturado'],
        arranjo: 'linha'
    };

    // ✅ RENDERIZAÇÃO MANUAL
    formFundosEst.render();
    
    // ============= CONSTRUIR MODAL =============
    import('./modal_selecoes_fundos_estruturados.js').then(module => {
        module.construirModalSelecoesFundosEstruturados();
        console.log('✅ Modal de seleções fundos estruturados construído');
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
        
        // Campos readonly (nomes das entidades + tipo_fundo + segmento)
        const camposReadonly = [
            'gestora_nome', 'administradora_nome', 'banco_custodiante_nome', 'corretora_nome',
            'tipo_fundo', 'segmento'
        ];
        
        camposReadonly.forEach(campo => {
            const input = document.getElementById(campo);
            if (input) {
                input.readOnly = true;
                input.style.backgroundColor = '#f0f0f0';
                input.style.cursor = 'not-allowed';
            }
        });
        
        console.log('✅ Campos hidden e readonly configurados');
    }, 300);
    
    // Listener para receber valores do modal
    document.addEventListener('modal-fundos-estruturados-confirmado', (e) => {
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
        
        // Preenche campos READONLY de tipo_fundo e segmento
        document.getElementById('tipo_fundo').value = valores.tipo_fundo || '';
        document.getElementById('segmento').value = valores.segmento || '';
        
        console.log('✅ Valores transferidos: IDs nos hidden, nomes nos readonly, tipo e segmento');
        alert('✅ Entidades e características configuradas!\n\nAgora preencha os demais campos e salve o registro.');
    });
    
    // Listener para interceptar ações do formulário (INCLUIR e EDITAR)
    // Registra apenas UMA VEZ para evitar duplicação
    if (!window._listenerFundosEstruturadosRegistrado) {
        document.addEventListener('formulario-acao', (e) => {
            console.log('🎯 Evento formulario-acao:', e.detail);
            
            // Verifica se o evento é para a tabela 'fundo_estruturado'
            if (window.api_info?.tabela_alvo !== 'fundo_estruturado') {
                console.log('⏭️ Ignorando evento - tabela atual:', window.api_info?.tabela_alvo);
                return; // Ignora evento de outras tabelas
            }
            
            if (e.detail.acao === 'incluir') {
                console.log('🆕 Ação INCLUIR detectada - abrindo modal...');
                abrirModalNovo();
            } else if (e.detail.acao === 'editar' && e.detail.dados) {
                console.log('✏️ Ação EDITAR detectada - abrindo modal com valores...', e.detail.dados);
                const valoresAtuais = {
                    id_gestora: e.detail.dados.id_gestora,
                    id_administradora: e.detail.dados.id_administradora,
                    id_custodiante: e.detail.dados.id_custodiante,
                    id_corretora: e.detail.dados.id_corretora,
                    tipo_fundo: e.detail.dados.tipo_fundo,
                    segmento: e.detail.dados.segmento
                };
                abrirModalComValores(valoresAtuais);
            }
        });
        
        window._listenerFundosEstruturadosRegistrado = true;
        console.log('✅ Listener formulario-acao registrado (fundos estruturados)');
    }
    
    return formFundosEst;
}

// ============= 2. INICIALIZAÇÃO E POPULAÇÃO =============

/**
 * 🚀 INICIAR: População inicial do formulário
 */
export async function iniciarPopulacaoFundosEstruturados() {
    console.log('🚀 Iniciando população Fundos Estruturados...');
    
    try {
        await popularFormulario();
        console.log('✅ População inicial Fundos Estruturados concluída');
    } catch (erro) {
        console.error('❌ Erro na população inicial Fundos Estruturados:', erro);
    }
}
