// Modal de seleção para Investimentos RF

/*
************************************************************
        MODAL DE SELEÇÃO - INVESTIMENTOS RF
************************************************************

Modal com 4 combos para seleção de parâmetros dos investimentos RF.
Transfere valores selecionados para o form_inv_rf.js principal.

CAMPOS OBRIGATÓRIOS (*):
- id_tipo_investimento *
- id_banco_emissor *
- id_corretora *
- id_indexador *

FLUXO:
1. Modal abre ao clicar "Incluir" ou "Editar"
2. Usuário seleciona valores nos combos
3. Clica "OK" → valida obrigatórios → transfere valores
4. Modal fecha → form principal recebe valores
*/

// ============= VARIÁVEL GLOBAL DO MODAL =============
let modalSelecoesInvRF = null;

/**
 * 🏗️ Construtor do Modal de Seleções Inv RF
 */
export function construirModalSelecoesInvRF() {
    console.log('🏗️ Construindo Modal de Seleções Inv RF...');
    criarModalHTML();
    console.log('✅ Modal de Seleções Inv RF criado');
}

/**
 * 🚪 Fecha o modal de seleções
 */
function fecharModal() {
    const modal = document.getElementById('modal-selecoes-inv-rf');
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
    if (document.getElementById('modal-selecoes-inv-rf')) {
        return;
    }
    
    const modalHTML = `
        <div id="modal-selecoes-inv-rf" style="display: none; position: fixed; z-index: 10000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5);">
            <div id="modal-inv-rf-content" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); min-width: 600px; max-height: 80vh; overflow-y: auto;">
                <h2 id="modal-inv-rf-header" style="margin: 0 0 20px 0; color: #333; cursor: move; user-select: none; padding: 10px; background: #f8f9fa; border-radius: 4px; margin: -20px -20px 20px -20px;">📋 Selecionar Parâmetros do Investimento RF</h2>
                <form id="form-selecoes-inv-rf">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Tipo Investimento *</label>
                            <select id="modal_inv_id_tipo_investimento" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">Selecione...</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Banco Emissor *</label>
                            <select id="modal_inv_id_banco_emissor" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">Selecione...</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Corretora *</label>
                            <select id="modal_inv_id_corretora" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">Selecione...</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Indexador *</label>
                            <select id="modal_inv_id_indexador" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">Selecione...</option>
                            </select>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
                        <button type="button" id="btn-modal-inv-cancelar" style="padding: 10px 20px; border: 1px solid #ccc; background: #f5f5f5; border-radius: 4px; cursor: pointer;">Cancelar</button>
                        <button type="button" id="btn-modal-inv-ok" style="padding: 10px 20px; border: none; background: #007bff; color: white; border-radius: 4px; cursor: pointer;">OK</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Configura eventos dos botões
    document.getElementById('btn-modal-inv-cancelar').addEventListener('click', fecharModal);
    document.getElementById('btn-modal-inv-ok').addEventListener('click', confirmarSelecao);
    
    // Clique no backdrop fecha modal
    document.getElementById('modal-selecoes-inv-rf').addEventListener('click', (e) => {
        if (e.target.id === 'modal-selecoes-inv-rf') {
            fecharModal();
        }
    });
    
    // ============= TORNAR MODAL ARRASTÁVEL =============
    tornarModalArrastavel();
    
    console.log('✅ HTML do modal inv_rf criado no DOM');
}

/**
 * 🖱️ Tornar o modal arrastável pelo header
 */
function tornarModalArrastavel() {
    const modalContent = document.getElementById('modal-inv-rf-content');
    const modalHeader = document.getElementById('modal-inv-rf-header');
    
    if (!modalContent || !modalHeader) return;
    
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    
    modalHeader.addEventListener('mousedown', (e) => {
        isDragging = true;
        
        // Calcular posição inicial
        const rect = modalContent.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        currentX = e.clientX;
        currentY = e.clientY;
        
        // Remover transform para usar left/top
        modalContent.style.transform = 'none';
        modalContent.style.left = initialX + 'px';
        modalContent.style.top = initialY + 'px';
        
        modalHeader.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        e.preventDefault();
        
        const deltaX = e.clientX - currentX;
        const deltaY = e.clientY - currentY;
        
        const newLeft = initialX + deltaX;
        const newTop = initialY + deltaY;
        
        modalContent.style.left = newLeft + 'px';
        modalContent.style.top = newTop + 'px';
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            modalHeader.style.cursor = 'move';
        }
    });
}

/**
 * 🔄 Popular combos do modal com dados do banco
 */
async function popularCombosModal() {
    console.log('🔄 Populando combos do modal inv_rf...');
    
    try {
        const comboTipo = document.getElementById('modal_inv_id_tipo_investimento');
        const comboBanco = document.getElementById('modal_inv_id_banco_emissor');
        const comboCorretora = document.getElementById('modal_inv_id_corretora');
        const comboIndexador = document.getElementById('modal_inv_id_indexador');
        
        // Popular Tipo Investimento
        const tiposResp = await window.api_info.consulta_dados_form('tipo_investimento_view');
        if (comboTipo && tiposResp?.dados?.dados) {
            let html = '<option value="">Selecione...</option>';
            tiposResp.dados.dados.forEach(item => {
                html += `<option value="${item.id_tipo_investimento}">${item.codigo}</option>`;
            });
            comboTipo.innerHTML = html;
            console.log(`✅ Tipo populado: ${tiposResp.dados.dados.length} opções`);
        }
        
        // Popular Banco
        const bancosResp = await window.api_info.consulta_dados_form('bancos_view');
        if (comboBanco && bancosResp?.dados?.dados) {
            let html = '<option value="">Selecione...</option>';
            bancosResp.dados.dados.forEach(item => {
                html += `<option value="${item.id_banco}">${item.nome_completo}</option>`;
            });
            comboBanco.innerHTML = html;
            console.log(`✅ Banco populado: ${bancosResp.dados.dados.length} opções`);
        }
        
        // Popular Corretora
        const corretorasResp = await window.api_info.consulta_dados_form('corretoras_view');
        if (comboCorretora && corretorasResp?.dados?.dados) {
            let html = '<option value="">Selecione...</option>';
            corretorasResp.dados.dados.forEach(item => {
                html += `<option value="${item.id_corretora}">${item.nome_completo}</option>`;
            });
            comboCorretora.innerHTML = html;
            console.log(`✅ Corretora populado: ${corretorasResp.dados.dados.length} opções`);
        }
        
        // Popular Indexador
        const indexadoresResp = await window.api_info.consulta_dados_form('indexador');
        if (comboIndexador && indexadoresResp?.dados?.dados) {
            let html = '<option value="">Selecione...</option>';
            indexadoresResp.dados.dados.forEach(item => {
                html += `<option value="${item.id_indexador}">${item.codigo}</option>`;
            });
            comboIndexador.innerHTML = html;
            console.log(`✅ Indexador populado: ${indexadoresResp.dados.dados.length} opções`);
        }
        
        console.log('✅ Todos os combos do modal inv_rf populados');
        
    } catch (error) {
        console.error('❌ Erro ao popular combos do modal inv_rf:', error);
    }
}

/**
 * 🛡️ Validar campos obrigatórios do modal
 */
function validarCamposObrigatorios() {
    console.log('🔍 Validando campos obrigatórios...');
    const erros = [];
    
    const tipo = document.getElementById('modal_inv_id_tipo_investimento')?.value;
    const banco = document.getElementById('modal_inv_id_banco_emissor')?.value;
    const corretora = document.getElementById('modal_inv_id_corretora')?.value;
    const indexador = document.getElementById('modal_inv_id_indexador')?.value;
    
    console.log('📋 Valores lidos:', { tipo, banco, corretora, indexador });
    
    const campos = [
        { id: 'modal_inv_id_tipo_investimento', valor: tipo, nome: 'Tipo de Investimento' },
        { id: 'modal_inv_id_banco_emissor', valor: banco, nome: 'Banco Emissor' },
        { id: 'modal_inv_id_corretora', valor: corretora, nome: 'Corretora' },
        { id: 'modal_inv_id_indexador', valor: indexador, nome: 'Indexador' }
    ];
    
    campos.forEach(campo => {
        const elem = document.getElementById(campo.id);
        if (!campo.valor || campo.valor === '') {
            erros.push(campo.nome);
            if (elem) {
                elem.style.borderColor = 'red';
                elem.style.borderWidth = '2px';
            }
        } else if (elem) {
            elem.style.borderColor = '';
            elem.style.borderWidth = '';
        }
    });
    
    if (erros.length > 0) {
        alert(`⚠️ Campos obrigatórios não preenchidos:\n\n• ${erros.join('\n• ')}\n\nPreencha os campos marcados com * (asterisco)`);
        return false;
    }
    
    console.log('✅ Validação passou - todos os campos obrigatórios preenchidos');
    return true;
}

/**
 * 📤 Transferir valores do modal para form principal
 */
function transferirValoresParaFormPrincipal() {
    console.log('📤 Transferindo valores para form principal inv_rf...');
    
    // Coletar valores dos combos do MODAL
    const dados = {
        id_tipo_investimento: document.getElementById('modal_inv_id_tipo_investimento')?.value || '',
        id_banco_emissor: document.getElementById('modal_inv_id_banco_emissor')?.value || '',
        id_corretora: document.getElementById('modal_inv_id_corretora')?.value || '',
        id_indexador: document.getElementById('modal_inv_id_indexador')?.value || ''
    };
    
    console.log('📦 Dados coletados:', dados);
    
    // Dispara evento customizado que o form principal irá escutar
    const evento = new CustomEvent('modal-inv-selecoes-confirmadas', {
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
    
    const mapeamento = {
        'id_tipo_investimento': 'modal_inv_id_tipo_investimento',
        'id_banco_emissor': 'modal_inv_id_banco_emissor',
        'id_corretora': 'modal_inv_id_corretora',
        'id_indexador': 'modal_inv_id_indexador'
    };
    
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
export async function abrirModalInvComValores(valoresAtuais) {
    if (!modalSelecoesInvRF) {
        construirModalSelecoesInvRF();
        modalSelecoesInvRF = true;
    }
    
    const modal = document.getElementById('modal-selecoes-inv-rf');
    if (modal) {
        modal.style.display = 'block';
    }
    
    await new Promise(resolve => setTimeout(resolve, 50));
    await popularCombosModal();
    
    const mapeamento = {
        'id_tipo_investimento': 'modal_inv_id_tipo_investimento',
        'id_banco_emissor': 'modal_inv_id_banco_emissor',
        'id_corretora': 'modal_inv_id_corretora',
        'id_indexador': 'modal_inv_id_indexador'
    };
    
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
export async function abrirModalInvNovo() {
    if (!modalSelecoesInvRF) {
        construirModalSelecoesInvRF();
        modalSelecoesInvRF = true;
    }
    
    const modal = document.getElementById('modal-selecoes-inv-rf');
    if (modal) {
        modal.style.display = 'block';
    }
    
    await new Promise(resolve => setTimeout(resolve, 50));
    await popularCombosModal();
    
    // Limpar campos
    const campos = ['modal_inv_id_tipo_investimento', 'modal_inv_id_banco_emissor', 
                    'modal_inv_id_corretora', 'modal_inv_id_indexador'];
    campos.forEach(id => {
        const combo = document.getElementById(id);
        if (combo) {
            combo.value = '';
            combo.style.border = '';
        }
    });
}
