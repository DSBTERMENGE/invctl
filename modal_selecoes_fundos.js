// Importações
import { FormModal } from '../framework_dsb/frontend/General_Classes/ConstrutorDeFormModal.js';

/*
************************************************************
        MODAL DE SELEÇÃO - FUNDOS
************************************************************

Modal com 6 combos para seleção de entidades e características do fundo.
Transfere valores selecionados para o form_fundos.js principal.

CAMPOS OBRIGATÓRIOS (*):
- id_gestora *
- id_administradora *
- id_custodiante * (banco)
- id_corretora *
- tipo_fundo * (select fixo)
- benchmark * (select fixo)

FLUXO:
1. Modal abre ao clicar "Incluir" ou "Editar"
2. Usuário seleciona valores nos combos (4 da base + 2 fixos)
3. Clica "OK" → valida obrigatórios → transfere valores
4. Modal fecha → form principal recebe valores
*/

// ============= VARIÁVEL GLOBAL DO MODAL =============
let modalSelecoesFundos = null;

/**
 * 🏗️ Construtor do Modal de Seleções Fundos
 */
export function construirModalSelecoesFundos() {
    console.log('🏗️ Construindo Modal de Seleções Fundos...');
    
    // Criar HTML do modal no DOM
    criarModalHTML();
    
    console.log('✅ Modal de Seleções Fundos criado');
}

/**
 * 🚪 Fecha o modal de seleções
 */
function fecharModal() {
    const modal = document.getElementById('modal-selecoes-fundos');
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
    if (document.getElementById('modal-selecoes-fundos')) {
        return;
    }
    
    const modalHTML = `
        <div id="modal-selecoes-fundos" style="display: none; position: fixed; z-index: 10000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5);">
            <div id="modal-selecoes-fundos-content" style="position: absolute; top: 20%; left: 50%; transform: translateX(-50%); background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); min-width: 600px; max-height: 70vh; overflow-y: auto; cursor: move;">
                <h2 id="modal-selecoes-fundos-header" style="margin: 0 0 20px 0; color: #333; cursor: move; user-select: none;">Selecionar Entidades do Fundo</h2>
                <form id="form-selecoes-fundos">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Gestora *</label>
                            <select id="modal_id_gestora" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">Selecione...</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Administradora *</label>
                            <select id="modal_id_administradora" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">Selecione...</option>
                            </select>
                        </div>
                        <div style="grid-column: 1 / -1;">
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Banco Custodiante *</label>
                            <select id="modal_id_custodiante" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">Selecione...</option>
                            </select>
                        </div>
                        <div style="grid-column: 1 / -1;">
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Corretora *</label>
                            <select id="modal_id_corretora" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">Selecione...</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Tipo de Fundo *</label>
                            <select id="modal_tipo_fundo" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">Selecione...</option>
                                <option value="Fundo de Ações">Fundo de Ações</option>
                                <option value="FIRF">FIRF - Fundo de Renda Fixa</option>
                                <option value="Fundo Multimercado">Fundo Multimercado</option>
                                <option value="Fundo Cambial">Fundo Cambial</option>
                                <option value="FII">FII - Fundo Imobiliário</option>
                                <option value="FIDC">FIDC - Fundo de Direitos Creditórios</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Benchmark *</label>
                            <select id="modal_benchmark" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">Selecione...</option>
                                <option value="CDI">CDI</option>
                                <option value="IPCA">IPCA</option>
                                <option value="Ibovespa">Ibovespa</option>
                                <option value="IBRX-100">IBRX-100</option>
                                <option value="IMA-B">IMA-B</option>
                                <option value="IRF-M">IRF-M</option>
                                <option value="IFIX">IFIX</option>
                                <option value="Dólar">Dólar</option>
                            </select>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
                        <button type="button" id="btn-modal-fundos-cancelar" style="padding: 10px 20px; border: 1px solid #ccc; background: #f5f5f5; border-radius: 4px; cursor: pointer;">Cancelar</button>
                        <button type="button" id="btn-modal-fundos-ok" style="padding: 10px 20px; border: none; background: #007bff; color: white; border-radius: 4px; cursor: pointer;">OK</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Configura eventos dos botões
    document.getElementById('btn-modal-fundos-cancelar').addEventListener('click', fecharModal);
    document.getElementById('btn-modal-fundos-ok').addEventListener('click', confirmarSelecao);
    
    // Clique no backdrop fecha modal
    document.getElementById('modal-selecoes-fundos').addEventListener('click', (e) => {
        if (e.target.id === 'modal-selecoes-fundos') {
            fecharModal();
        }
    });
    
    // ============= TORNAR MODAL ARRASTÁVEL =============
    const modalContent = document.getElementById('modal-selecoes-fundos-content');
    const modalHeader = document.getElementById('modal-selecoes-fundos-header');
    
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
 * 🔄 Popular combos do modal com dados do banco
 */
async function popularCombosModal() {
    console.log('🔄 Populando combos do modal...');
    
    try {
        // Busca elementos
        const comboGestora = document.getElementById('modal_id_gestora');
        const comboAdministradora = document.getElementById('modal_id_administradora');
        const comboCustodiante = document.getElementById('modal_id_custodiante');
        const comboCorretora = document.getElementById('modal_id_corretora');
        
        console.log('🔍 DEBUG - Elementos encontrados:', {
            comboGestora: !!comboGestora,
            comboAdministradora: !!comboAdministradora,
            comboCustodiante: !!comboCustodiante,
            comboCorretora: !!comboCorretora
        });
        
        console.log('🔍 DEBUG - window.api_info existe?', !!window.api_info);
        
        // ============= POPULAR GESTORAS =============
        console.log('📡 Buscando gestoras...');
        const gestoras = await window.api_info.consulta_dados_form('gestora_view');
        console.log('📦 Resposta gestoras:', gestoras);
        
        if (comboGestora && gestoras?.dados?.dados) {
            let html = '<option value="">Selecione...</option>';
            gestoras.dados.dados.forEach(item => {
                html += `<option value="${item.id_gestora}">${item.nome_completo}</option>`;
            });
            comboGestora.innerHTML = html;
            console.log(`✅ Gestora populado: ${gestoras.dados.dados.length} opções`);
        } else {
            console.warn('⚠️ Gestora NÃO populado - comboGestora:', !!comboGestora, 'dados:', !!gestoras?.dados?.dados);
        }
        
        // ============= POPULAR ADMINISTRADORAS =============
        console.log('📡 Buscando administradoras...');
        const administradoras = await window.api_info.consulta_dados_form('administradoras_view');
        console.log('📦 Resposta administradoras:', administradoras);
        
        if (comboAdministradora && administradoras?.dados?.dados) {
            let html = '<option value="">Selecione...</option>';
            administradoras.dados.dados.forEach(item => {
                html += `<option value="${item.id_administradora}">${item.nome_completo}</option>`;
            });
            comboAdministradora.innerHTML = html;
            console.log(`✅ Administradora populado: ${administradoras.dados.dados.length} opções`);
        } else {
            console.warn('⚠️ Administradora NÃO populado');
        }
        
        // ============= POPULAR BANCOS (CUSTODIANTE) =============
        console.log('📡 Buscando bancos...');
        const bancos = await window.api_info.consulta_dados_form('bancos_view');
        console.log('📦 Resposta bancos:', bancos);
        
        if (comboCustodiante && bancos?.dados?.dados) {
            let html = '<option value="">Selecione...</option>';
            bancos.dados.dados.forEach(item => {
                html += `<option value="${item.id_banco}">${item.nome_completo}</option>`;
            });
            comboCustodiante.innerHTML = html;
            console.log(`✅ Banco Custodiante populado: ${bancos.dados.dados.length} opções`);
        } else {
            console.warn('⚠️ Banco NÃO populado');
        }
        
        // ============= POPULAR CORRETORAS =============
        console.log('📡 Buscando corretoras...');
        const corretoras = await window.api_info.consulta_dados_form('corretoras_view');
        console.log('📦 Resposta corretoras:', corretoras);
        
        if (comboCorretora && corretoras?.dados?.dados) {
            let html = '<option value="">Selecione...</option>';
            corretoras.dados.dados.forEach(item => {
                html += `<option value="${item.id_corretora}">${item.nome_fantasia}</option>`;
            });
            comboCorretora.innerHTML = html;
            console.log(`✅ Corretora populado: ${corretoras.dados.dados.length} opções`);
        } else {
            console.warn('⚠️ Corretora NÃO populado');
        }
        
        console.log('✅ Todos os combos do modal populados');
    } catch (erro) {
        console.error('❌ Erro ao popular combos do modal:', erro);
    }
}

/**
 * ✅ Validar campos obrigatórios
 */
function validarCamposObrigatorios() {
    const gestora = document.getElementById('modal_id_gestora').value;
    const administradora = document.getElementById('modal_id_administradora').value;
    const custodiante = document.getElementById('modal_id_custodiante').value;
    const corretora = document.getElementById('modal_id_corretora').value;
    const tipoFundo = document.getElementById('modal_tipo_fundo').value;
    const benchmark = document.getElementById('modal_benchmark').value;
    
    const camposFaltando = [];
    if (!gestora) camposFaltando.push('Gestora');
    if (!administradora) camposFaltando.push('Administradora');
    if (!custodiante) camposFaltando.push('Banco Custodiante');
    if (!corretora) camposFaltando.push('Corretora');
    if (!tipoFundo) camposFaltando.push('Tipo de Fundo');
    if (!benchmark) camposFaltando.push('Benchmark');
    
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
    const gestora = document.getElementById('modal_id_gestora');
    const administradora = document.getElementById('modal_id_administradora');
    const custodiante = document.getElementById('modal_id_custodiante');
    const corretora = document.getElementById('modal_id_corretora');
    
    const tipoFundo = document.getElementById('modal_tipo_fundo');
    const benchmark = document.getElementById('modal_benchmark');
    
    // Coleta valores (IDs)
    const valores = {
        id_gestora: gestora.value,
        id_administradora: administradora.value,
        id_custodiante: custodiante.value,
        id_corretora: corretora.value,
        tipo_fundo: tipoFundo.value,
        benchmark: benchmark.value
    };
    
    // Coleta textos (descrições para campos readonly)
    const textos = {
        gestora_nome: gestora.options[gestora.selectedIndex]?.text || '',
        administradora_nome: administradora.options[administradora.selectedIndex]?.text || '',
        banco_custodiante_nome: custodiante.options[custodiante.selectedIndex]?.text || '',
        corretora_nome: corretora.options[corretora.selectedIndex]?.text || ''
    };
    
    console.log('📤 Transferindo para formulário:', { valores, textos });
    
    // Dispara evento customizado
    const evento = new CustomEvent('modal-fundos-confirmado', {
        detail: { valores, textos }
    });
    document.dispatchEvent(evento);
    
    console.log('✅ Evento modal-fundos-confirmado disparado');
}

/**
 * 🚪 Abrir modal NOVO (limpa campos)
 */
export async function abrirModalNovo() {
    console.log('🚺 Abrindo modal NOVO...');
    
    // Limpa campos
    document.getElementById('modal_id_gestora').value = '';
    document.getElementById('modal_id_administradora').value = '';
    document.getElementById('modal_id_custodiante').value = '';
    document.getElementById('modal_id_corretora').value = '';
    document.getElementById('modal_tipo_fundo').value = '';
    document.getElementById('modal_benchmark').value = '';
    
    // Popula combos
    await popularCombosModal();
    
    // Abre modal
    const modal = document.getElementById('modal-selecoes-fundos');
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
    
    // Popula combos primeiro
    await popularCombosModal();
    
    // Aguarda DOM atualizar
    setTimeout(() => {
        // Preenche campos com valores atuais
        if (valoresAtuais.id_gestora) {
            document.getElementById('modal_id_gestora').value = valoresAtuais.id_gestora;
        }
        if (valoresAtuais.id_administradora) {
            document.getElementById('modal_id_administradora').value = valoresAtuais.id_administradora;
        }
        if (valoresAtuais.id_custodiante) {
            document.getElementById('modal_id_custodiante').value = valoresAtuais.id_custodiante;
        }
        if (valoresAtuais.id_corretora) {
            document.getElementById('modal_id_corretora').value = valoresAtuais.id_corretora;
        }
        if (valoresAtuais.tipo_fundo) {
            document.getElementById('modal_tipo_fundo').value = valoresAtuais.tipo_fundo;
        }
        if (valoresAtuais.benchmark) {
            document.getElementById('modal_benchmark').value = valoresAtuais.benchmark;
        }
        
        // Abre modal
        const modal = document.getElementById('modal-selecoes-fundos');
        if (modal) {
            modal.style.display = 'block';
            console.log('✅ Modal aberto (modo EDIÇÃO)');
        }
    }, 100);
}
