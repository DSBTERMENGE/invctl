// Importações
import { FormModal } from '../framework_dsb/frontend/General_Classes/ConstrutorDeFormModal.js';

/*
************************************************************
        MODAL DE TIPO DE OPERAÇÃO - FUNDOS
************************************************************

Modal para selecionar tipo de operação em investimentos de fundos.
Transfere valores selecionados para o form_inv_fundos.js principal.

TIPOS DE OPERAÇÃO:
- D: Aporte (Aplicação)
- C: Resgate (Retirada)
- T: Come-Cotas (Tributação)
- O: Outros (Ajustes)

FLUXO:
1. Modal abre ao clicar "Incluir"
2. Usuário seleciona tipo de operação
3. Clica "OK" → transfere valores
4. Modal fecha → form principal recebe tipo
*/

// ============= VARIÁVEL GLOBAL DO MODAL =============
let modalTipoOperacaoFundo = null;

/**
 * 🏗️ Construtor do Modal de Tipo de Operação
 */
export function construirModalTipoOperacaoFundo() {
    console.log('🏗️ Construindo Modal de Tipo de Operação Fundo...');
    
    // Criar HTML do modal no DOM
    criarModalHTML();
    
    console.log('✅ Modal de Tipo de Operação Fundo criado');
}

/**
 * 🚪 Fecha o modal
 */
function fecharModal() {
    const modal = document.getElementById('modal-tipo-operacao-fundo');
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
        console.log('❌ Validação falhou - tipo de operação não selecionado');
    }
}

/**
 * Cria o HTML do modal diretamente no DOM
 */
function criarModalHTML() {
    // Verifica se já existe
    if (document.getElementById('modal-tipo-operacao-fundo')) {
        return;
    }
    
    const modalHTML = `
        <div id="modal-tipo-operacao-fundo" style="display: none; position: fixed; z-index: 10000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5);">
            <div id="modal-tipo-operacao-fundo-content" style="position: absolute; top: 30%; left: 50%; transform: translateX(-50%); background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); min-width: 500px; cursor: move;">
                <h2 id="modal-tipo-operacao-fundo-header" style="margin: 0 0 20px 0; color: #333; cursor: move; user-select: none;">Selecionar Tipo de Operação</h2>
                <form id="form-tipo-operacao-fundo">
                    <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Tipo de Operação *</label>
                            <select id="modal_tipo_operacao" style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;">
                                <option value="">Selecione o tipo de operação...</option>
                                <option value="D">Aporte (Aplicação)</option>
                                <option value="C">Resgate (Retirada)</option>
                                <option value="T">Come-Cotas (Tributação)</option>
                                <option value="O">Outros (Ajustes)</option>
                            </select>
                        </div>
                        <div id="div_descricao_tipo" style="display: none; padding: 10px; background: #f8f9fa; border-left: 3px solid #007bff; border-radius: 4px;">
                            <p id="texto_descricao_tipo" style="margin: 0; font-size: 13px; color: #495057;"></p>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
                        <button type="button" id="btn-modal-tipo-op-fundo-cancelar" style="padding: 10px 20px; border: 1px solid #ccc; background: #f5f5f5; border-radius: 4px; cursor: pointer;">Cancelar</button>
                        <button type="button" id="btn-modal-tipo-op-fundo-ok" style="padding: 10px 20px; border: none; background: #007bff; color: white; border-radius: 4px; cursor: pointer;">OK</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Configura eventos dos botões
    document.getElementById('btn-modal-tipo-op-fundo-cancelar').addEventListener('click', fecharModal);
    document.getElementById('btn-modal-tipo-op-fundo-ok').addEventListener('click', confirmarSelecao);
    
    // Clique no backdrop fecha modal
    document.getElementById('modal-tipo-operacao-fundo').addEventListener('click', (e) => {
        if (e.target.id === 'modal-tipo-operacao-fundo') {
            fecharModal();
        }
    });
    
    // Evento change do select para mostrar descrição
    document.getElementById('modal_tipo_operacao').addEventListener('change', (e) => {
        const descricoes = {
            'D': 'Aporte: Aplicação de recursos no fundo. Aumenta sua participação.',
            'C': 'Resgate: Retirada de recursos do fundo. Diminui sua participação.',
            'T': 'Come-Cotas: Tributação semestral automática sobre rendimentos (15% ou 20% conforme tipo do fundo).',
            'O': 'Outros: Ajustes diversos, correções ou operações especiais.'
        };
        
        const divDescricao = document.getElementById('div_descricao_tipo');
        const textoDescricao = document.getElementById('texto_descricao_tipo');
        
        if (e.target.value && descricoes[e.target.value]) {
            textoDescricao.textContent = descricoes[e.target.value];
            divDescricao.style.display = 'block';
        } else {
            divDescricao.style.display = 'none';
        }
    });
    
    // ============= TORNAR MODAL ARRASTÁVEL =============
    const modalContent = document.getElementById('modal-tipo-operacao-fundo-content');
    const modalHeader = document.getElementById('modal-tipo-operacao-fundo-header');
    
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    
    modalHeader.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    
    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        
        if (e.target === modalHeader) {
            isDragging = true;
        }
    }
    
    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            xOffset = currentX;
            yOffset = currentY;
            
            setTranslate(currentX, currentY, modalContent);
        }
    }
    
    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }
    
    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate(calc(-50% + ${xPos}px), ${yPos}px)`;
    }
    
    console.log('✅ HTML do modal criado no DOM (arrastável)');
}

/**
 * ✅ Validar campos obrigatórios
 */
function validarCamposObrigatorios() {
    const tipoOperacao = document.getElementById('modal_tipo_operacao').value;
    
    if (!tipoOperacao) {
        alert('⚠️ Por favor, selecione o tipo de operação.');
        return false;
    }
    
    return true;
}

/**
 * 📤 Transferir valores para formulário principal
 */
function transferirValoresParaFormPrincipal() {
    const selectTipo = document.getElementById('modal_tipo_operacao');
    const tipoOperacao = selectTipo.value;
    const tipoOperacaoDescricao = selectTipo.options[selectTipo.selectedIndex].text;
    
    const valores = {
        tipo_operacao: tipoOperacao,
        tipo_operacao_descricao: tipoOperacaoDescricao
    };
    
    console.log('📤 Transferindo para formulário:', valores);
    
    // Dispara evento customizado
    const evento = new CustomEvent('modal-tipo-operacao-fundo-confirmado', {
        detail: { valores }
    });
    document.dispatchEvent(evento);
    
    console.log('✅ Evento modal-tipo-operacao-fundo-confirmado disparado');
}

/**
 * 🚪 Abrir modal NOVO (limpa campos)
 */
export async function abrirModalNovo() {
    console.log('🚺 Abrindo modal NOVO...');
    
    // Limpa campos
    document.getElementById('modal_tipo_operacao').value = '';
    document.getElementById('div_descricao_tipo').style.display = 'none';
    
    // Abre modal
    const modal = document.getElementById('modal-tipo-operacao-fundo');
    if (modal) {
        modal.style.display = 'block';
        console.log('✅ Modal aberto (modo NOVO)');
    }
}

/**
 * ✏️ Abrir modal EDIÇÃO (com valores atuais)
 */
export async function abrirModalComValores(valoresAtuais) {
    console.log('✏️ Abrindo modal EDIÇÃO com valores:', valoresAtuais);
    
    // Preenche campo com valor atual
    if (valoresAtuais.tipo_operacao) {
        const select = document.getElementById('modal_tipo_operacao');
        select.value = valoresAtuais.tipo_operacao;
        
        // Dispara evento change para mostrar descrição
        select.dispatchEvent(new Event('change'));
    }
    
    // Abre modal
    const modal = document.getElementById('modal-tipo-operacao-fundo');
    if (modal) {
        modal.style.display = 'block';
        console.log('✅ Modal aberto (modo EDIÇÃO)');
    }
}
