// Importações do sistema de debug (sempre primeiro)
import { flow_marker, error_catcher } from '../framework_dsb/frontend/General_Classes/Debugger.js';
// Importações de gerenciamento de eventos
import { criarListener, desabilitarControlesDeFrm, popularSelectPorConfiguracao, form_listener } from '../framework_dsb/frontend/General_Classes/FuncoesAuxilares.js';

import FormComum from "../framework_dsb/frontend/General_Classes/ConstrutorDeForms.js";
import { abrirModalInvNovo, abrirModalInvComValores } from './modal_selecoes_inv_rf.js';
import { 
    popularFormulario,
    processarFiltroSelect,
    construirFiltroInicial,
} from '../framework_dsb/frontend/General_Classes/OperacoesCRUD.js';


/*
************************************************************
        FORMULÁRIO DE INVESTIMENTOS EM RENDA FIXA
************************************************************

Este arquivo implementa o formulário para cadastro de investimentos em renda fixa
seguindo o padrão property-based configuration do framework DSB.

*/

// ============= 1. CONSTRUÇÃO DO FORMULÁRIO =============

/**
 * 🏗️ CONSTRUTOR PRINCIPAL: Formulário de Investimentos em Renda Fixa
 */
export function construirFormularioInvRF() {
    console.log('🏗️ Construindo formulário Investimentos RF...');
    
    const formInvRF = new FormComum();
    
    // ✅ CONFIGURAÇÃO POR PROPRIEDADES - 22 CAMPOS (3 hidden + 3 readonly VIEW + 2 readonly modal + 14 editáveis)
    formInvRF.titulo = 'Investimentos em Renda Fixa';
    formInvRF.descricao = ' - Cadastro de investimentos em renda fixa';
    formInvRF.tipo = [
        'input', 'input', 'input',                             // linha 0: 3 campos HIDDEN (IDs para salvar)
        'input', 'input', 'input', 'input', 'input',           // linha 1: 3 readonly + indexador + liquidez (via modal)
        'input', 'input', 'input', 'input',                    // linha 2: código, datas
        'input', 'input', 'input',                             // linha 3: valores e taxa
        'input', 'input', 'input',                             // linha 4: garantia, taxa_admin, taxa_custodia
        'input', 'input', 'input', 'textarea'                  // linha 5: iof, status, data_resgate, observações
    ];
    
    formInvRF.label = [
        '',                                         // 0 - id_tipo_investimento (hidden)
        '',                                         // 1 - id_banco_emissor (hidden)
        '',                                         // 2 - id_corretora (hidden)
        'Tipo Investimento',                        // 3 - tipo_investimento_descricao (readonly)
        'Banco Emissor',                            // 4 - banco_emissor_nome (readonly)
        'Corretora',                                // 5 - corretora_nome (readonly)
        'Indexador',                                // 6 - indexador (readonly, via modal)
        'Liquidez',                                 // 7 - liquidez (readonly, via modal)
        'Código do Ativo',                          // 8
        'Data Aplicação',                           // 9
        'Data Vencimento',                          // 10
        'Data Liquidação',                          // 11
        'Valor Aplicado (R$)',                      // 12
        'Valor Líquido Aplicado (R$)',             // 13
        'Taxa Prefixada (% a.a.)',                 // 14
        'Garantia FGC',                             // 15
        'Taxa Administração (% a.a.)',             // 16
        'Taxa Custódia (R$)',                      // 17
        'IOF Aplicável',                            // 18
        'Status',                                   // 19
        'Data Resgate',                             // 20
        'Observações'                               // 21
    ];
    
    formInvRF.nomeCampo = [
        'id_tipo_investimento',                     // 0 - FK hidden
        'id_banco_emissor',                         // 1 - FK hidden
        'id_corretora',                             // 2 - FK hidden
        'tipo_investimento_descricao',              // 3 - readonly (da VIEW)
        'banco_emissor_nome',                       // 4 - readonly (da VIEW)
        'corretora_nome',                           // 5 - readonly (da VIEW)
        'indexador',                                // 6 - readonly (via modal)
        'liquidez',                                 // 7 - readonly (via modal)
        'codigo_ativo',                             // 8
        'data_aplicacao',                           // 9
        'data_vencimento',                          // 10
        'data_liquidacao',                          // 11
        'valor_aplicado',                           // 12
        'valor_liquido_aplicado',                   // 13
        'taxa_prefixada',                           // 14
        'garantia_fgc',                             // 15
        'taxa_administracao',                       // 16
        'taxa_custodia',                            // 17
        'iof_aplicavel',                            // 18
        'status',                                   // 19
        'data_resgate',                             // 20
        'observacoes'                               // 21
    ];
    
    formInvRF.format = [
        'numero',       // 0 - id_tipo_investimento (FK hidden)
        'numero',       // 1 - id_banco_emissor (FK hidden)
        'numero',       // 2 - id_corretora (FK hidden)
        'texto',        // 3 - tipo_investimento_descricao (readonly)
        'texto',        // 4 - banco_emissor_nome (readonly)
        'texto',        // 5 - corretora_nome (readonly)
        'texto',        // 6 - indexador (readonly, via modal)
        'texto',        // 7 - liquidez (readonly, via modal)
        'texto',        // 8 - codigo_ativo
        'data',         // 9 - data_aplicacao
        'data',         // 10 - data_vencimento
        'data',         // 11 - data_liquidacao
        'texto',        // 12 - valor_aplicado (formatação manual)
        'texto',        // 13 - valor_liquido_aplicado (formatação manual)
        'pct',          // 14 - taxa_prefixada
        'texto',        // 15 - garantia_fgc
        'pct',          // 16 - taxa_administracao
        'texto',        // 17 - taxa_custodia (formatação manual)
        'texto',        // 18 - iof_aplicavel
        'texto',        // 19 - status
        'data',         // 20 - data_resgate
        'texto'         // 21 - observacoes
    ];
    
    formInvRF.pos = [
        {linha: 0, coluna: 0},  // 0 - id_tipo_investimento (hidden)
        {linha: 0, coluna: 1},  // 1 - id_banco_emissor (hidden)
        {linha: 0, coluna: 2},  // 2 - id_corretora (hidden)
        {linha: 1, coluna: 0},  // 3 - tipo_investimento_descricao (readonly)
        {linha: 1, coluna: 1},  // 4 - banco_emissor_nome (readonly)
        {linha: 1, coluna: 2},  // 5 - corretora_nome (readonly)
        {linha: 1, coluna: 3},  // 6 - indexador (readonly, via modal)
        {linha: 2, coluna: 0},  // 7 - liquidez (readonly, via modal)
        {linha: 2, coluna: 1},  // 8 - codigo_ativo
        {linha: 2, coluna: 2},  // 9 - data_aplicacao
        {linha: 2, coluna: 3},  // 10 - data_vencimento
        {linha: 3, coluna: 0},  // 11 - data_liquidacao
        {linha: 3, coluna: 1},  // 12 - valor_aplicado
        {linha: 3, coluna: 2},  // 13 - valor_liquido_aplicado
        {linha: 4, coluna: 0},  // 14 - taxa_prefixada
        {linha: 4, coluna: 1},  // 15 - garantia_fgc
        {linha: 4, coluna: 2},  // 16 - taxa_administracao
        {linha: 5, coluna: 0},  // 17 - taxa_custodia
        {linha: 5, coluna: 1},  // 18 - iof_aplicavel
        {linha: 5, coluna: 2},  // 19 - status
        {linha: 5, coluna: 3},  // 20 - data_resgate
        {linha: 6, coluna: 0}   // 21 - observacoes
    ];
    
    formInvRF.alinhamento = ['H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'V'];
    
    formInvRF.largCampos = [
        0,   // 0 - id_tipo_investimento (hidden)
        0,   // 1 - id_banco_emissor (hidden)
        0,   // 2 - id_corretora (hidden)
        14,  // 3 - tipo_investimento_descricao (readonly) - reduzido 30% (era 20)
        10,  // 4 - banco_emissor_nome (readonly) - reduzido 50% (era 20)
        10,  // 5 - corretora_nome (readonly) - reduzido 50% (era 20)
        8,   // 6 - indexador (readonly, via modal) - reduzido 50% (era 15)
        10,  // 7 - liquidez (readonly, via modal)
        15,  // 8 - codigo_ativo
        5,   // 9 - data_aplicacao - reduzido 50% (era 10)
        5,   // 10 - data_vencimento - reduzido 50% (era 10)
        10,  // 11 - data_liquidacao
        12,  // 12 - valor_aplicado
        12,  // 13 - valor_liquido_aplicado
        8,   // 14 - taxa_prefixada
        8,   // 15 - garantia_fgc
        10,  // 16 - taxa_administracao
        10,  // 17 - taxa_custodia
        8,   // 18 - iof_aplicavel
        10,  // 19 - status
        10,  // 20 - data_resgate
        50   // 21 - observacoes
    ];
    
    formInvRF.posicaoCanvas = {x: 3, y: 5};
    formInvRF.grupoBotoes = ['S', 'S', 'S']; // Encerrar + Navegação + CRUD
    
    // Configuração da API
    window.api_info.tabela_alvo = 'inv_rf';
    window.api_info.campos_obrigatorios = ['id_tipo_investimento', 'id_banco_emissor', 'id_corretora', 'codigo_ativo', 'data_aplicacao', 'data_vencimento', 'valor_aplicado'];
    window.api_info.view = "inv_rf_view";
    window.api_info.campos = ['Todos'];  // População: trazer TODOS os campos (incluindo VIEW)
    window.api_info.campos_para_update = [  // UPDATE: enviar APENAS campos da tabela
        'id_inv_rf',
        'id_tipo_investimento',
        'id_banco_emissor',
        'id_corretora',
        'indexador',
        'codigo_ativo',
        'data_aplicacao',
        'data_vencimento',
        'data_liquidacao',
        'valor_aplicado',
        'valor_liquido_aplicado',
        'taxa_prefixada',
        'tipo_rentabilidade',
        'liquidez',
        'dias_carencia',
        'garantia_fgc',
        'valor_garantido_fgc',
        'periodicidade_cupom',
        'taxa_administracao',
        'taxa_custodia',
        'iof_aplicavel',
        'status',
        'data_resgate',
        'valor_resgate_liquido',
        'data_ultima_atualizacao',
        'observacoes'
    ];
    window.api_info.pk = 'id_inv_rf';
    
    // Campos relacionados (FKs)
    window.api_info.campos_relacionados = ['id_tipo_investimento', 'id_banco_emissor', 'id_corretora'];

    // Configuração do select de pesquisa (apenas 1)
    formInvRF.configSelects = {
        labels: ['Código Ativo'],
        campos: ['codigo_ativo'],
        larguras: ['200px'],
        campo_exibir: ['codigo_ativo'],
        campo_value: ['id_inv_rf'],
        arranjo: 'linha'
    };

    // ✅ RENDERIZAÇÃO MANUAL
    formInvRF.render();
    
    // ============= INTEGRAÇÃO COM MODAL DE SELEÇÕES =============
    
    // Tornar campos hidden invisíveis e campos de nome readonly
    setTimeout(() => {
        // Esconder campos hidden (IDs)
        ['id_tipo_investimento', 'id_banco_emissor', 'id_corretora'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.type = 'hidden';
            }
        });
        
        // Tornar campos de nome readonly (dados da VIEW + indexador do modal)
        ['tipo_investimento_descricao', 'banco_emissor_nome', 'corretora_nome', 'indexador'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.readOnly = true;
                input.style.backgroundColor = '#f0f0f0';
                input.style.cursor = 'not-allowed';
            }
        });
        
        // Adicionar placeholder informativo no primeiro campo editável
        const codigoAtivo = document.getElementById('codigo_ativo');
        if (codigoAtivo) {
            codigoAtivo.placeholder = '(Configurar parâmetros via modal - botão Incluir/Editar)';
        }
        
        // ============= FORMATAÇÃO MANUAL DE CAMPOS MONETÁRIOS =============
        // Adicionar formatação automática nos campos de valor
        const camposMonetarios = ['valor_aplicado', 'valor_liquido_aplicado', 'taxa_custodia'];
        
        camposMonetarios.forEach(idCampo => {
            const campo = document.getElementById(idCampo);
            if (!campo) return;
            
            // Marca como campo monetário para conversão ao salvar
            campo.setAttribute('data-format', 'valor');
            
            // Formatar valor inicial se vier do banco (número puro)
            const valorInicial = campo.value;
            if (valorInicial && !isNaN(valorInicial) && valorInicial.trim() !== '') {
                const numero = parseFloat(valorInicial);
                if (!isNaN(numero)) {
                    campo.value = numero.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                }
            }
            
            // Formatação ao sair do campo
            campo.addEventListener('blur', function() {
                let valor = this.value.trim();
                if (!valor || valor === '') return; // Se vazio, não faz nada
                
                // Remove tudo exceto números, vírgula e ponto
                valor = valor.replace(/[^\d.,]/g, '');
                if (!valor) return; // Se ficou vazio após limpeza, não faz nada
                
                // Converte para número (aceita tanto 1234.56 quanto 1.234,56)
                let numero;
                if (valor.includes(',')) {
                    // Formato brasileiro: remove pontos e troca vírgula por ponto
                    numero = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
                } else {
                    // Formato americano ou número puro
                    numero = parseFloat(valor);
                }
                
                if (!isNaN(numero) && numero >= 0) {
                    // Formata com 2 casas decimais e separador de milhares
                    this.value = numero.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                } else if (valor) {
                    // Se o valor não é válido mas tem conteúdo, limpa o campo
                    console.warn(`⚠️ Valor inválido no campo ${idCampo}: "${valor}"`);
                }
            });
            
            // Permite apenas números, vírgula e ponto durante digitação
            campo.addEventListener('input', function() {
                this.value = this.value.replace(/[^\d.,]/g, '');
            });
        });
    }, 100);
    
    // Listener para receber valores do modal
    document.addEventListener('modal-inv-selecoes-confirmadas', (e) => {
        console.log('📥 Valores recebidos do modal inv_rf:', e.detail);
        const { valores, textos } = e.detail;
        
        // Transferir IDs para campos hidden (apenas os 3 FKs)
        document.getElementById('id_tipo_investimento').value = valores.id_tipo_investimento || '';
        document.getElementById('id_banco_emissor').value = valores.id_banco_emissor || '';
        document.getElementById('id_corretora').value = valores.id_corretora || '';
        
        // Transferir textos para campos readonly (descrições da VIEW)
        document.getElementById('tipo_investimento_descricao').value = textos.id_tipo_investimento || '';
        document.getElementById('banco_emissor_nome').value = textos.id_banco_emissor || '';
        document.getElementById('corretora_nome').value = textos.id_corretora || '';
        
        // Transferir valor string do modal (indexador)
        document.getElementById('indexador').value = valores.indexador || '';
        
        console.log('✅ Valores transferidos: 3 IDs hidden, 3 textos readonly VIEW, 1 valor modal (indexador)');
        alert('✅ Parâmetros configurados com sucesso!\n\nAgora preencha os demais campos e salve o registro.');
    });
    
    // Listener para interceptar ações do formulário (INCLUIR e EDITAR)
    // Registra apenas UMA VEZ para evitar duplicação
    if (!window._listenerInvRfRegistrado) {
        document.addEventListener('formulario-acao', (e) => {
            console.log('🎯 Evento formulario-acao:', e.detail);
            
            // Verifica se o evento é para a tabela 'inv_rf'
            if (window.api_info?.tabela_alvo !== 'inv_rf') {
                console.log('⏭️ Ignorando evento - tabela atual:', window.api_info?.tabela_alvo);
                return; // Ignora evento de outras tabelas
            }
            
            if (e.detail.acao === 'incluir') {
            console.log('🆕 Ação INCLUIR detectada - abrindo modal...');
            setTimeout(() => abrirModalInvNovo(), 300);
        } else if (e.detail.acao === 'editar') {
            console.log('✏️ Ação EDITAR detectada - abrindo modal com valores atuais...');
            const valoresAtuais = {
                id_tipo_investimento: document.getElementById('id_tipo_investimento')?.value,
                id_banco_emissor: document.getElementById('id_banco_emissor')?.value,
                id_corretora: document.getElementById('id_corretora')?.value,
                indexador: document.getElementById('indexador')?.value
            };
            setTimeout(() => abrirModalInvComValores(valoresAtuais), 300);
        }
    }, true); // Captura na fase de capture para interceptar ANTES do framework processar
        
        window._listenerInvRfRegistrado = true;
        console.log('✅ Listener inv_rf registrado (UNICO)');
    }
    
    // Popula select usando método padrão do framework
    if (formInvRF.configSelects && formInvRF.configSelects.campos) {
        console.log('⏰ Agendando população de selects...');
        setTimeout(() => {
            console.log('🚀 Executando população de selects...');
            popularSelectPorConfiguracao(formInvRF);
        }, 100);
    }
    
    // Configurar listener para eventos de select
    criarListener(document, 'select-alterada', async (event) => {
        console.log('🔄 Select alterado:', event.detail);
        const { campo, valor } = event.detail;
        await form_listener(formInvRF, campo, valor, event);
    });

    // Desabilitar campos de dados inicialmente
    setTimeout(() => {
        desabilitarControlesDeFrm();
        console.log('🔒 Estado inicial: Campos de dados desabilitados');
    }, 150);
    
    return formInvRF;
}

// ============= 2. EXPORTAÇÃO DA FUNÇÃO DE INICIALIZAÇÃO =============

/**
 * 🚀 Função de inicialização pública (chamada pelo canvas.js)
 */
export async function iniciarPopulacaoInvRF() {
    const resultado = await popularFormulario();
    
    // 🔄 SINCRONIZAR SELECT COM REGISTRO EXIBIDO
    setTimeout(async () => {
        const { _repopularSelectDePesquisa } = await import('../framework_dsb/frontend/General_Classes/OperacoesCRUD.js');
        _repopularSelectDePesquisa();
        console.log('✅ Select sincronizada com registro atual');
    }, 200);
    
    return resultado;
}
