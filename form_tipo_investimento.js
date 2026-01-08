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
        FORMULÁRIO DE TIPOS DE INVESTIMENTO - INVCTL
************************************************************

Este arquivo implementa o formulário para cadastro de tipos de investimentos
seguindo o novo padrão property-based configuration do framework DSB.

PADRÃO UTILIZADO:
1. Configuração de propriedades do FormComum
2. Chamada manual do render()
3. Configuração de eventos específicos
4. Integração com API backend

ARQUITETURA:
- construirFormularioTipoInvestimento(): Cria e configura o formulário
- Handlers específicos para cada ação (encerrar, navegar, CRUD)
- Integração com API backend para persistência

*/

// ============= 1. CONSTRUÇÃO DO FORMULÁRIO =============

/**
 * 🏗️ CONSTRUTOR PRINCIPAL: Formulário de tipos de investimento
 * Segue o novo padrão property-based configuration do framework
 * 
 * @returns {FormComum} Instância do formulário configurado e renderizado
 */
export function construirFormularioTipoInvestimento() {
    console.log('🏗️ Construindo formulário Tipos de Investimento...');
    
    const formTipoInv = new FormComum();
    
    // ✅ CONFIGURAÇÃO POR PROPRIEDADES (novo padrão)
    formTipoInv.titulo = 'Tipos de Investimentos';
    formTipoInv.descricao = ' - Manutenção de dados';
    formTipoInv.tipo = ['input', 'input', 'input', 'input', 'input', 'textarea']; // tipo de campo
    formTipoInv.label =  ['Código', 'Descrição', 'Classe', 'Garantia FGC', 'Ativo', 'Observações'];
    formTipoInv.nomeCampo = ['codigo', 'descricao', 'classe', 'garantia_fgc', 'ativo', 'obs'];
    formTipoInv.format = ['texto', 'texto', 'texto', 'texto', 'texto', 'texto'];
    formTipoInv.pos = [
        {linha: 0, coluna: 0}, // Código (input)
        {linha: 0, coluna: 1}, // Descrição (input)
        {linha: 1, coluna: 0}, // Classe (input)
        {linha: 1, coluna: 1}, // Garantia FGC (input)
        {linha: 1, coluna: 2}, // Ativo (input)
        {linha: 2, coluna: 0}  // Observações (textarea)
    ];
    formTipoInv.alinhamento = ['H', 'H', 'H', 'H', 'H', 'V']; // Orientação
    formTipoInv.largCampos = [10, 30, 15, 10, 5, 50]; // Larguras em rem
    formTipoInv.posicaoCanvas = {x: 3, y: 5}; // Posição no canvas
    formTipoInv.grupoBotoes = ['S', 'S', 'S']; // Encerrar + Navegação + CRUD
    
    window.api_info.tabela_alvo = 'tipo_investimento'; // Tabela para operações CRUD
    window.api_info.campos_obrigatorios = ['codigo', 'descricao', 'classe']; // Campo obrigatórios para salvar registro
    window.api_info.view = "tipo_investimento_view"; // View para operações CRUD
    window.api_info.campos = ['Todos']; // Campos da view a serem retornados.
    
    // ✅ NOVAS PROPRIEDADES DA ABORDAGEM HÍBRIDA
    window.api_info.pk = 'id_tipo_investimento'; // Chave primária explícita (opcional - fallback: descoberta automática)
    window.api_info.campos_relacionados = []; // Array vazio - tipo_investimento não têm campos relacionados

    // Configuração dos selects (se houver)
    // Dicionário de dados para criação de Selects em ConstrutorDeForms
    // Cria tantas Selects quanto o num. de objeto de dados em configSelects
    // O último campo a direita é o de pesquisa/navegação (popula formulário)
    formTipoInv.configSelects = {
        labels: [ 'Descrição'],
        campos: [ 'descricao'],
        larguras: ['180px'],
        campo_exibir: [ 'descricao'],
        campo_value: [ 'id_tipo_investimento'],
        arranjo: 'linha'
    };

    // ✅ RENDERIZAÇÃO MANUAL (novo padrão)
    formTipoInv.render();
    
    // TRATAMENTO DE SELECTS
    // Verifica se existe configuração de selects
    if (formTipoInv.configSelects && formTipoInv.configSelects.campos) {
        console.log('🔍 ConfigSelects encontrada - iniciando tratamento...', formTipoInv.configSelects);
        
        // Se há mais de um campo (indicando filtros)
        if (formTipoInv.configSelects.campos.length > 1) {
            // ✅ INICIALIZAÇÃO DO SISTEMA DE FILTROS INTELIGENTE
            // Constroi uma string cpo1=`*`, cpo2=`*`, ..., cpoN=`*` sendo a
            // string alterada dinamicamente a cada select alterada
            // Exemplo inicial: "cpo1=val1, cpo2=val2, ..., cpoN=valN"
            window.api_info.filtros = construirFiltroInicial(formTipoInv.configSelects);
            console.log(`🔧 Filtro inicial configurado: "${window.api_info.filtros}"`);
        }

        // Popula select usando método inteligente (sempre executa se há selects)
        console.log('⏰ Agendando população de selects...');
        setTimeout(() => {
            console.log('🚀 Executando população de selects...');
            popularSelectPorConfiguracao(formTipoInv);
        }, 100);
    } else {
        console.log('⚠️ ConfigSelects não encontrada ou sem campos');
    }
    // Configurar listener para eventos de select - SISTEMA DE FILTROS INTELIGENTE
    // Este listener so será disparado se uma select for alterada
    criarListener(document, 'select-alterada', async (event) => {
        console.log('🔄 Select alterado:', event.detail);
        const { campo, valor } = event.detail;

        // ✅ CÓDIGO ANTIGO ISOLADO PARA TESTE
        if (1 == 2) {
            // ✅ RECONSTRUÇÃO INTELIGENTE DE FILTROS
            if (window.api_info.filtros) {
                prepararStrFiltro(campo, valor, formTipoInv.configSelects);
                console.log(`✅ Filtro reconstruído: "${window.api_info.filtros}"`);
            }

            // ✅ DETECÇÃO INTELIGENTE DA ÚLTIMA SELECT DE FILTRO
            const campos = formTipoInv.configSelects.campos;
            const indiceAtual = campos.indexOf(campo);
            const ultimaFiltroIndex = campos.length - 2;  // Penúltima posição (última de filtro)
            
            console.log(`📊 Campo: ${campo}, Índice: ${indiceAtual}, Última filtro: ${ultimaFiltroIndex}`);

            // ✅ SE É A ÚLTIMA SELECT DE FILTRO → DISPARA CONSULTA
            if (indiceAtual === ultimaFiltroIndex && indiceAtual >= 0) {
                console.log(`🎯 ÚLTIMA SELECT DE FILTRO (${campo}) alterada - Disparando consulta ao BD!`);
                
                // Popula select de pesquisa (usando lógica existente)
                await processarFiltroSelect({
                    selectOrigem: campo,
                    selectDestino: campos[campos.length - 1], // Última select (pesquisa)
                    nomeFiltro: `id${campo}`, // Converte campo para nome do ID
                    valor: valor
                });
            }
            // ✅ SE É UMA SELECT DE FILTRO INTERMEDIÁRIA → SÓ ATUALIZA FILTRO
            else if (indiceAtual < ultimaFiltroIndex) {
                console.log(`📋 Select de filtro intermediária (${campo}) - Apenas atualizando filtro`);
                // Filtro já foi atualizado acima, não faz mais nada
            }
            // ✅ SE É A SELECT DE PESQUISA → POPULA FORMULÁRIO
            else if (indiceAtual === campos.length - 1 && valor) {
                console.log(`🎯 Select de pesquisa (${campo}) selecionada - Populando formulário`);
                
                // Usar função pública para popular formulário com registro específico
                // (vamos implementar uma solução simples usando a API)
                try {
                    // Configurar filtro específico para o registro selecionado
                    const filtroOriginal = window.api_info.filtros;
                    window.api_info.filtros = `${formTipoInv.configSelects.campo_value[indiceAtual]} = ${valor}`;
                    
                    // Popular formulário com o registro específico
                    await popularFormulario();
                    
                    // Restaurar filtro original
                    window.api_info.filtros = filtroOriginal;
                    
                    console.log('✅ Formulário populado via select de pesquisa');
                } catch (error) {
                    console.error('❌ Erro ao popular formulário:', error);
                }
            }
        }

        // ✅ CHAMADA PARA LISTENER GENÉRICO (TESTE)
        await form_listener(formTipoInv, campo, valor, event);
    });

    // ✅ DEFINIR ESTADO INICIAL DOS CAMPOS
    // Após renderização e configuração de selects, desabilitar campos de dados
    // Campos de filtro (select_*) permanecerão habilitados automaticamente
    setTimeout(() => {
        desabilitarControlesDeFrm();
        console.log('🔒 Estado inicial: Campos de dados desabilitados, selects de filtro ativos');
    }, 150);

    console.log('✅ construirFormularioTipoInvestimento(): Formulário criado com novo padrão property-based');
    return formTipoInv;
}


// ============= 1.1. POPULAÇÃO DO FORMULÁRIO =============

/**
 * 🔄 POPULAÇÃO: Popula formulário de grupos com dados do servidor
 * Chamada após a construção do formulário para carregar dados
 * 
 * FLUXO ESPECIALIZADO:
 * form_grupos.js → OperacoesCRUD.popularFormulario() → window.api_info.popular()
 * 
 * CONFIGURAÇÃO PARA LEITURA:
 * - view: Nome da view para consulta (obrigatório)
 * - tabela_alvo: NÃO usado em operações de leitura (só para CRUD)
 * - campos_obrigatorios: NÃO usado em operações de leitura (só para CRUD)
 */
export async function iniciarPopulacaoForm() {
    return await popularFormulario();
}

// ============= 2. FUNÇÕES DE APOIO =============

/**
 * Reconstrói string de filtros quando uma select é alterada
 * Mantém valores até a select alterada e coloca * nas posteriores
 * 
 * @param {string} campoAlterado - Campo que foi alterado (ex: "idgrupo")
 * @param {string} novoValor - Novo valor do campo (ex: "2")
 */
function prepararStrFiltro(campoAlterado, novoValor, configSelects) {
    try {
        if (!window.api_info.filtros || !campoAlterado) {
            return;
        }
        
        // Encontra índice do campo alterado
        const indice = configSelects.campos.indexOf(campoAlterado);
        if (indice === -1) {
            return; // Campo não encontrado
        }
        
        // Split da string por AND
        const pares = window.api_info.filtros.split(' AND ');
        
        // Altera valor na posição correspondente e * nas posteriores
        for (let i = 0; i < pares.length; i++) {
            const [campo, valor] = pares[i].split(' = ');
            if (i < indice) {
                // Mantém valores anteriores
                continue;
            } else if (i === indice) {
                // Novo valor na posição alterada
                pares[i] = `${campo} = ${novoValor}`;
            } else {
                // * nas posições posteriores
                pares[i] = `${campo} = *`;
            }
        }
        
        // Reconstrói string
        window.api_info.filtros = pares.join(' AND ');
    } catch (error) {
        console.error('❌ Erro em prepararStrFiltro:', error);
    }
}
