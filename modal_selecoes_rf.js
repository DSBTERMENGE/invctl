// Importações
import { FormModal } from '../framework_dsb/frontend/General_Classes/ConstrutorDeFormModal.js';

/*
************************************************************
        MODAL DE SELEÇÃO - PAPÉIS RF
************************************************************

Modal com 8 combos para seleção de parâmetros dos papéis RF.
Transfere valores selecionados para o form_papeis_rf.js principal.

CAMPOS OBRIGATÓRIOS (*):
- id_tipo_investimento *
- id_banco_emissor *
- id_indexador *

FLUXO:
1. Modal abre ao clicar "Incluir" ou "Editar"
2. Usuário seleciona valores nos combos
3. Clica "OK" → valida obrigatórios → transfere valores
4. Modal fecha → form principal recebe valores
*/

// ============= VARIÁVEL GLOBAL DO MODAL =============
let modalSelecoesRF = null;

/**
 * 🏗️ Construtor do Modal de Seleções RF
 */
export function construirModalSelecoesRF() {
    console.log('🏗️ Construindo Modal de Seleções RF...');
    
    // Criar HTML do modal no DOM
    criarModalHTML();
    
    console.log('✅ Modal de Seleções RF criado');
}

/**
 * 🚪 Fecha o modal de seleções
 */
function fecharModal() {
    const modal = document.getElementById('modal-selecoes-rf');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * ✅ Confirma seleção e transfere valores
 */
function confirmarSelecao() {
    console.log('🔘 Botão OK clicado - iniciando confirmação...');
    
    if (validarCamposObrigatorios()) {
        console.log('✅ Validação OK - transferindo valores...');
        transferirValoresParaFormPrincipal();
        fecharModal();
    } else {
        console.log('❌ Validação falhou - campos obrigatórios não preenchidos');
    }
}

/**
 * Cria o HTML do modal diretamente no DOM
 */
function criarModalHTML() {
    // Verifica se já existe
    if (document.getElementById('modal-selecoes-rf')) {
        return;
    }
    
    const modalHTML = `
        <div id="modal-selecoes-rf" style="display: none; position: fixed; z-index: 10000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5);">
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); min-width: 600px; max-height: 80vh; overflow-y: auto;">
                <h2 style="margin: 0 0 20px 0; color: #333;">Selecionar Parâmetros do Papel RF</h2>
                <form id="form-selecoes-rf">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Tipo *</label>
                            <select id="modal_id_tipo_investimento" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">Selecione...</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Banco Emissor *</label>
                            <select id="modal_id_banco_emissor" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">Selecione...</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Corretora *</label>
                            <select id="modal_id_corretora" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">Selecione...</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Indexador *</label>
                            <select id="modal_indexador" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">Selecione...</option>
                            </select>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
                        <button type="button" id="btn-modal-cancelar" style="padding: 10px 20px; border: 1px solid #ccc; background: #f5f5f5; border-radius: 4px; cursor: pointer;">Cancelar</button>
                        <button type="button" id="btn-modal-ok" style="padding: 10px 20px; border: none; background: #007bff; color: white; border-radius: 4px; cursor: pointer;">OK</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Configura eventos dos botões
    document.getElementById('btn-modal-cancelar').addEventListener('click', fecharModal);
    document.getElementById('btn-modal-ok').addEventListener('click', confirmarSelecao);
    
    // Clique no backdrop fecha modal
    document.getElementById('modal-selecoes-rf').addEventListener('click', (e) => {
        if (e.target.id === 'modal-selecoes-rf') {
            fecharModal();
        }
    });
    
    console.log('✅ HTML do modal criado no DOM');
}

/**
 * 🔄 Popular combos do modal com dados do banco
 */
async function popularCombosModal() {
    console.log('🔄 Populando combos do modal...');
    
    try {
        // Busca elementos
        const comboTipo = document.getElementById('modal_id_tipo_investimento');
        const comboBanco = document.getElementById('modal_id_banco_emissor');
        const comboCorretora = document.getElementById('modal_id_corretora');
        const comboIndexador = document.getElementById('modal_indexador');
        
        console.log('🔍 DEBUG - Elementos encontrados:', {
            comboTipo: !!comboTipo,
            comboBanco: !!comboBanco,
            comboCorretora: !!comboCorretora,
            comboIndexador: !!comboIndexador
        });
        
        console.log('🔍 DEBUG - window.api_info existe?', !!window.api_info);
        
        // Popular Tipo Investimento
        console.log('📡 Buscando tipos de investimento...');
        const tiposResp = await window.api_info.consulta_dados_form('tipo_investimento_view');
        console.log('📦 Resposta tipos:', tiposResp);
        console.log('📦 Resposta tipos:', tiposResp);
        if (comboTipo && tiposResp?.dados?.dados) {
            let html = '<option value="">Selecione...</option>';
            tiposResp.dados.dados.forEach(item => {
                html += `<option value="${item.id_tipo_investimento}">${item.codigo}</option>`;
            });
            comboTipo.innerHTML = html;
            console.log(`✅ Tipo populado: ${tiposResp.dados.dados.length} opções`);
        } else {
            console.warn('⚠️ Tipo NÃO populado - comboTipo:', !!comboTipo, 'dados:', !!tiposResp?.dados?.dados);
        }
        
        // Popular Banco
        console.log('📡 Buscando bancos...');
        const bancosResp = await window.api_info.consulta_dados_form('bancos_view');
        console.log('📦 Resposta bancos:', bancosResp);
        if (comboBanco && bancosResp?.dados?.dados) {
            let html = '<option value="">Selecione...</option>';
            bancosResp.dados.dados.forEach(item => {
                html += `<option value="${item.id_banco}">${item.nome_completo}</option>`;
            });
            comboBanco.innerHTML = html;
            console.log(`✅ Banco populado: ${bancosResp.dados.dados.length} opções`);
        } else {
            console.warn('⚠️ Banco NÃO populado - comboBanco:', !!comboBanco, 'dados:', !!bancosResp?.dados?.dados);
        }
        
        // Popular Corretora
        console.log('📡 Buscando corretoras...');
        const corretorasResp = await window.api_info.consulta_dados_form('corretoras_view');
        console.log('📦 Resposta corretoras:', corretorasResp);
        if (comboCorretora && corretorasResp?.dados?.dados) {
            let html = '<option value="">Selecione...</option>';
            corretorasResp.dados.dados.forEach(item => {
                html += `<option value="${item.id_corretora}">${item.nome_completo}</option>`;
            });
            comboCorretora.innerHTML = html;
            console.log(`✅ Corretora populado: ${corretorasResp.dados.dados.length} opções`);
        } else {
            console.warn('⚠️ Corretora NÃO populado - comboCorretora:', !!comboCorretora, 'dados:', !!corretorasResp?.dados?.dados);
        }
        
        // Popular Indexador (valores fixos)
        if (comboIndexador) {
            comboIndexador.innerHTML = `
                <option value="">Selecione...</option>
                <option value="PRE_FIX">PRE_FIX</option>
                <option value="%IPCA">%IPCA</option>
                <option value="IPCA">IPCA</option>
                <option value="IPCA+">IPCA+</option>
                <option value="%CDI">%CDI</option>
                <option value="CDI">CDI</option>
                <option value="CDI+">CDI+</option>
                <option value="%SELIC">%SELIC</option>
                <option value="SELIC">SELIC</option>
                <option value="SELIC+">SELIC+</option>
            `;
            console.log('✅ Indexador populado com opções fixas');
        }
        
        console.log('✅ Todos os combos do modal populados');
        
    } catch (error) {
        console.error('❌ Erro ao popular combos do modal:', error);
    }
}

/**
 * 🛡️ Validar campos obrigatórios do modal
 */
function validarCamposObrigatorios() {
    console.log('🔍 Validando campos obrigatórios...');
    const erros = [];
    
    const tipo = document.getElementById('modal_id_tipo_investimento')?.value;
    const banco = document.getElementById('modal_id_banco_emissor')?.value;
    const corretora = document.getElementById('modal_id_corretora')?.value;
    const indexador = document.getElementById('modal_indexador')?.value;
    
    console.log('📋 Valores lidos:', { tipo, banco, corretora, indexador });
    
    if (!tipo || tipo === '') {
        erros.push('Tipo de Investimento');
        document.getElementById('modal_id_tipo_investimento').style.borderColor = 'red';
        document.getElementById('modal_id_tipo_investimento').style.borderWidth = '2px';
    }
    
    if (!banco || banco === '') {
        erros.push('Banco Emissor');
        document.getElementById('modal_id_banco_emissor').style.borderColor = 'red';
        document.getElementById('modal_id_banco_emissor').style.borderWidth = '2px';
    }
    
    if (!corretora || corretora === '') {
        erros.push('Corretora');
        document.getElementById('modal_id_corretora').style.borderColor = 'red';
        document.getElementById('modal_id_corretora').style.borderWidth = '2px';
    }
    
    if (!indexador || indexador === '') {
        erros.push('Indexador');
        document.getElementById('modal_indexador').style.borderColor = 'red';
        document.getElementById('modal_indexador').style.borderWidth = '2px';
    }
    
    if (erros.length > 0) {
        alert(`⚠️ Campos obrigatórios não preenchidos:\n\n• ${erros.join('\n• ')}\n\nPreencha os campos marcados com * (asterisco)`);
        return false;
    }
    
    // Remove destaque vermelho se estava presente
    ['modal_id_tipo_investimento', 'modal_id_banco_emissor', 'modal_id_corretora', 'modal_indexador'].forEach(id => {
        const elem = document.getElementById(id);
        if (elem) {
            elem.style.borderColor = '';
            elem.style.borderWidth = '';
        }
    });
    
    console.log('✅ Validação passou - todos os campos obrigatórios preenchidos');
    return true;
}

/**
 * 📤 Transferir valores do modal para form principal
 */
function transferirValoresParaFormPrincipal() {
    console.log('📤 Transferindo valores para form principal...');
    
    // Coletar valores dos combos do MODAL
    const dados = {
        id_tipo_investimento: document.getElementById('modal_id_tipo_investimento')?.value || '',
        id_banco_emissor: document.getElementById('modal_id_banco_emissor')?.value || '',
        id_corretora: document.getElementById('modal_id_corretora')?.value || '',
        indexador: document.getElementById('modal_indexador')?.value || ''
    };
    
    console.log('📦 Dados coletados:', dados);
    
    // Dispara evento customizado que o form principal irá escutar
    const evento = new CustomEvent('modal-selecoes-confirmadas', {
        detail: {
            valores: dados,
            textos: obterTextosCombo(dados)
        },
        bubbles: true
    });
    
    document.dispatchEvent(evento);
    
    console.log('✅ Valores transferidos com sucesso');
}

/**
 * 📝 Obter textos exibidos nos combos (não só os IDs)
 */
function obterTextosCombo(dados) {
    const textos = {};
    
    // Mapear de chave de dados para ID do modal
    const mapeamento = {
        'id_tipo_investimento': 'modal_id_tipo_investimento',
        'id_banco_emissor': 'modal_id_banco_emissor',
        'id_corretora': 'modal_id_corretora'
    };
    
    // Para cada campo, pega o texto da option selecionada
    Object.keys(dados).forEach(nomeCampo => {
        const idModal = mapeamento[nomeCampo];
        const combo = document.getElementById(idModal);
        if (combo && combo.selectedIndex >= 0) {
            textos[nomeCampo] = combo.options[combo.selectedIndex].text;
        }
    });
    
    return textos;
}

/**
 * 🔧 Abrir modal com valores pré-preenchidos (modo EDITAR)
 */
export async function abrirModalComValores(valoresAtuais) {
    if (!modalSelecoesRF) {
        construirModalSelecoesRF();
        modalSelecoesRF = true;
    }
    
    // Mostrar modal
    const modal = document.getElementById('modal-selecoes-rf');
    if (modal) {
        modal.style.display = 'block';
    }
    
    // Aguardar renderização
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Popular combos primeiro
    await popularCombosModal();
    
    // Mapear campos do form principal para IDs do modal
    const mapeamento = {
        'id_tipo_investimento': 'modal_id_tipo_investimento',
        'id_banco_emissor': 'modal_id_banco_emissor',
        'id_corretora': 'modal_id_corretora',
        'indexador': 'modal_indexador'
    };
    
    // Depois setar valores
    Object.keys(valoresAtuais).forEach(campo => {
        const idModal = mapeamento[campo] || campo;
        const combo = document.getElementById(idModal);
        if (combo && valoresAtuais[campo]) {
            combo.value = valoresAtuais[campo];
        }
    });
}

/**
 * 🚀 Abrir modal vazio (modo INCLUIR)
 */
export async function abrirModalNovo() {
    if (!modalSelecoesRF) {
        construirModalSelecoesRF();
        modalSelecoesRF = true;
    }
    
    // Mostrar modal
    const modal = document.getElementById('modal-selecoes-rf');
    if (modal) {
        modal.style.display = 'block';
    }
    
    // Aguardar um tick para garantir que DOM foi renderizado
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Popular combos (aguarda para garantir que dados sejam carregados)
    await popularCombosModal();
    
    // Limpar campos
    const campos = ['modal_id_tipo_investimento', 'modal_id_banco_emissor', 'modal_id_corretora',
                    'modal_indexador'];
    campos.forEach(id => {
        const combo = document.getElementById(id);
        if (combo) {
            combo.value = '';
            combo.style.border = '';
        }
    });
}
