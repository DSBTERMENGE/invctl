// Importações
import { FormModal } from '../framework_dsb/frontend/General_Classes/ConstrutorDeFormModal.js';

/*
************************************************************
        MODAL DE SELEÇÃO - AÇÕES
************************************************************

Modal com 5 campos para configurar características da ação.
Transfere valores selecionados para o form_acoes.js principal.

CAMPOS OBRIGATÓRIOS (*):
- nome_pregao *
- setor
- segmento
- tipo_acao * (ON, PN, UNIT)
- status

FLUXO:
1. Modal abre ao clicar "Incluir" ou "Editar"
2. Usuário preenche/seleciona valores
3. Clica "OK" → valida obrigatórios → transfere valores
4. Modal fecha → form principal recebe valores
*/

// ============= VARIÁVEL GLOBAL DO MODAL =============
let modalSelecoesAcoes = null;

/**
 * 🏗️ Construtor do Modal de Seleções Ações
 */
export function construirModalSelecoesAcoes() {
    console.log('🏗️ Construindo Modal de Seleções Ações...');
    
    // Criar HTML do modal no DOM
    criarModalHTML();
    
    console.log('✅ Modal de Seleções Ações criado');
}

/**
 * 🚪 Fecha o modal de seleções
 */
function fecharModal() {
    const modal = document.getElementById('modal-selecoes-acoes');
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
    if (document.getElementById('modal-selecoes-acoes')) {
        return;
    }
    
    const modalHTML = `
        <div id="modal-selecoes-acoes" style="display: none; position: fixed; z-index: 10000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5);">
            <div id="modal-selecoes-acoes-content" style="position: absolute; top: 20%; left: 50%; transform: translateX(-50%); background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); min-width: 600px; max-height: 70vh; overflow-y: auto; cursor: move;">
                <h2 id="modal-selecoes-acoes-header" style="margin: 0 0 20px 0; color: #333; cursor: move; user-select: none;">Configurar Características da Ação</h2>
                <form id="form-selecoes-acoes">
                    <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Nome Pregão *</label>
                            <input type="text" id="modal_nome_pregao" placeholder="Ex: Petrobras PN" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Setor</label>
                                <select id="modal_setor" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                    <option value="">Selecione...</option>
                                    <option value="Petróleo e Gás">Petróleo e Gás</option>
                                    <option value="Mineração">Mineração</option>
                                    <option value="Bancos">Bancos</option>
                                    <option value="Seguros">Seguros</option>
                                    <option value="Energia Elétrica">Energia Elétrica</option>
                                    <option value="Telecomunicações">Telecomunicações</option>
                                    <option value="Varejo">Varejo</option>
                                    <option value="Alimentos e Bebidas">Alimentos e Bebidas</option>
                                    <option value="Construção Civil">Construção Civil</option>
                                    <option value="Saúde">Saúde</option>
                                    <option value="Tecnologia">Tecnologia</option>
                                    <option value="Transporte">Transporte</option>
                                    <option value="Papel e Celulose">Papel e Celulose</option>
                                    <option value="Siderurgia">Siderurgia</option>
                                    <option value="Educação">Educação</option>
                                    <option value="Outros">Outros</option>
                                </select>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Segmento</label>
                                <input type="text" id="modal_segmento" placeholder="Ex: Exploração e Refino" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Tipo Ação *</label>
                                <select id="modal_tipo_acao" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                    <option value="">Selecione...</option>
                                    <option value="ON">ON - Ordinária</option>
                                    <option value="PN">PN - Preferencial</option>
                                    <option value="UNIT">UNIT</option>
                                </select>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 5px; font-weight: bold;">Status</label>
                                <select id="modal_status" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                    <option value="Ativa" selected>Ativa</option>
                                    <option value="Suspensa">Suspensa</option>
                                    <option value="Cancelada">Cancelada</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
                        <button type="button" id="btn-modal-acoes-cancelar" style="padding: 10px 20px; border: 1px solid #ccc; background: #f5f5f5; border-radius: 4px; cursor: pointer;">Cancelar</button>
                        <button type="button" id="btn-modal-acoes-ok" style="padding: 10px 20px; border: none; background: #007bff; color: white; border-radius: 4px; cursor: pointer;">OK</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Configura eventos dos botões
    document.getElementById('btn-modal-acoes-cancelar').addEventListener('click', fecharModal);
    document.getElementById('btn-modal-acoes-ok').addEventListener('click', confirmarSelecao);
    
    // Clique no backdrop fecha modal
    document.getElementById('modal-selecoes-acoes').addEventListener('click', (e) => {
        if (e.target.id === 'modal-selecoes-acoes') {
            fecharModal();
        }
    });
    
    // ============= TORNAR MODAL ARRASTÁVEL =============
    const modalContent = document.getElementById('modal-selecoes-acoes-content');
    const modalHeader = document.getElementById('modal-selecoes-acoes-header');
    
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
    const nomePregao = document.getElementById('modal_nome_pregao').value.trim();
    const tipoAcao = document.getElementById('modal_tipo_acao').value;
    
    const camposFaltando = [];
    if (!nomePregao) camposFaltando.push('Nome Pregão');
    if (!tipoAcao) camposFaltando.push('Tipo Ação');
    
    if (camposFaltando.length > 0) {
        alert(`⚠️ Campos obrigatórios não preenchidos:\n\n${camposFaltando.join('\n')}`);
        return false;
    }
    
    return true;
}

/**
 * 📤 Transferir valores para formulário principal
 */
function transferirValoresParaFormPrincipal() {
    const nomePregao = document.getElementById('modal_nome_pregao').value.trim();
    const setor = document.getElementById('modal_setor').value;
    const segmento = document.getElementById('modal_segmento').value.trim();
    const tipoAcao = document.getElementById('modal_tipo_acao').value;
    const status = document.getElementById('modal_status').value;
    
    // Coleta valores
    const valores = {
        nome_pregao: nomePregao,
        setor: setor,
        segmento: segmento,
        tipo_acao: tipoAcao,
        status: status
    };
    
    console.log('📤 Transferindo para formulário:', valores);
    
    // Dispara evento customizado
    const evento = new CustomEvent('modal-acoes-confirmado', {
        detail: { valores }
    });
    document.dispatchEvent(evento);
    
    console.log('✅ Evento modal-acoes-confirmado disparado');
}

/**
 * 🚪 Abrir modal NOVO (limpa campos)
 */
export async function abrirModalNovo() {
    console.log('🚺 Abrindo modal NOVO...');
    
    // Limpa campos
    document.getElementById('modal_nome_pregao').value = '';
    document.getElementById('modal_setor').value = '';
    document.getElementById('modal_segmento').value = '';
    document.getElementById('modal_tipo_acao').value = '';
    document.getElementById('modal_status').value = 'Ativa';
    
    // Abre modal
    const modal = document.getElementById('modal-selecoes-acoes');
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
    
    // Preenche campos com valores atuais
    if (valoresAtuais.nome_pregao) {
        document.getElementById('modal_nome_pregao').value = valoresAtuais.nome_pregao;
    }
    if (valoresAtuais.setor) {
        document.getElementById('modal_setor').value = valoresAtuais.setor;
    }
    if (valoresAtuais.segmento) {
        document.getElementById('modal_segmento').value = valoresAtuais.segmento;
    }
    if (valoresAtuais.tipo_acao) {
        document.getElementById('modal_tipo_acao').value = valoresAtuais.tipo_acao;
    }
    if (valoresAtuais.status) {
        document.getElementById('modal_status').value = valoresAtuais.status;
    }
    
    // Abre modal
    const modal = document.getElementById('modal-selecoes-acoes');
    if (modal) {
        modal.style.display = 'block';
        console.log('✅ Modal aberto (modo EDIÇÃO)');
    }
}
