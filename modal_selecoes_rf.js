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
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Indexador *</label>
                            <select id="modal_id_indexador" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">Selecione...</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px;">Tipo Rentabilidade</label>
                            <select id="modal_tipo_rentabilidade" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">Selecione...</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px;">Liquidez</label>
                            <select id="modal_liquidez" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">Selecione...</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px;">Garantia FGC</label>
                            <select id="modal_garantia_fgc" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">Selecione...</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px;">IOF Aplicável</label>
                            <select id="modal_iof_aplicavel" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">Selecione...</option>
                            </select>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 5px;">Ativo</label>
                            <select id="modal_ativo" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
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
        const comboIndexador = document.getElementById('modal_id_indexador');
        const comboTipoRent = document.getElementById('modal_tipo_rentabilidade');
        const comboLiquidez = document.getElementById('modal_liquidez');
        const comboFGC = document.getElementById('modal_garantia_fgc');
        const comboIOF = document.getElementById('modal_iof_aplicavel');
        const comboAtivo = document.getElementById('modal_ativo');
        
        console.log('🔍 DEBUG - Elementos encontrados:', {
            comboTipo: !!comboTipo,
            comboBanco: !!comboBanco,
            comboIndexador: !!comboIndexador,
            comboTipoRent: !!comboTipoRent,
            comboLiquidez: !!comboLiquidez,
            comboFGC: !!comboFGC,
            comboIOF: !!comboIOF,
            comboAtivo: !!comboAtivo
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
        
        // Popular Indexador
        console.log('📡 Buscando indexadores...');
        const indexadoresResp = await window.api_info.consulta_dados_form('indexador');
        console.log('📦 Resposta indexadores:', indexadoresResp);
        console.log('📦 Resposta indexadores:', indexadoresResp);
        if (comboIndexador && indexadoresResp?.dados?.dados) {
            let html = '<option value="">Selecione...</option>';
            indexadoresResp.dados.dados.forEach(item => {
                html += `<option value="${item.id_indexador}">${item.codigo}</option>`;
            });
            comboIndexador.innerHTML = html;
            console.log(`✅ Indexador populado: ${indexadoresResp.dados.dados.length} opções`);
        } else {
            console.warn('⚠️ Indexador NÃO populado - comboIndexador:', !!comboIndexador, 'dados:', !!indexadoresResp?.dados?.dados);
        }
        
        // Popular combos fixos (sem banco)
        if (comboTipoRent) {
            comboTipoRent.innerHTML = `
                <option value="">Selecione...</option>
                <option value="PRE_FIXADO">PRE_FIXADO</option>
                <option value="POS_FIXADO">POS_FIXADO</option>
                <option value="HIBRIDO">HIBRIDO</option>
            `;
        }
        
        if (comboLiquidez) {
            comboLiquidez.innerHTML = `
                <option value="">Selecione...</option>
                <option value="DIARIA">DIARIA</option>
                <option value="VENCIMENTO">VENCIMENTO</option>
                <option value="PARCIAL">PARCIAL</option>
            `;
        }
        
        if (comboFGC) {
            comboFGC.innerHTML = `
                <option value="">Selecione...</option>
                <option value="S">S</option>
                <option value="N">N</option>
            `;
        }
        
        if (comboIOF) {
            comboIOF.innerHTML = `
                <option value="">Selecione...</option>
                <option value="S">S</option>
                <option value="N">N</option>
            `;
        }
        
        if (comboAtivo) {
            comboAtivo.innerHTML = `
                <option value="">Selecione...</option>
                <option value="S">S</option>
                <option value="N">N</option>
            `;
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
    const indexador = document.getElementById('modal_id_indexador')?.value;
    
    console.log('📋 Valores lidos:', { tipo, banco, indexador });
    
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
    
    if (!indexador || indexador === '') {
        erros.push('Indexador');
        document.getElementById('modal_id_indexador').style.borderColor = 'red';
        document.getElementById('modal_id_indexador').style.borderWidth = '2px';
    }
    
    if (erros.length > 0) {
        alert(`⚠️ Campos obrigatórios não preenchidos:\n\n• ${erros.join('\n• ')}\n\nPreencha os campos marcados com * (asterisco)`);
        return false;
    }
    
    // Remove destaque vermelho se estava presente
    ['modal_id_tipo_investimento', 'modal_id_banco_emissor', 'modal_id_indexador'].forEach(id => {
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
        id_indexador: document.getElementById('modal_id_indexador')?.value || '',
        tipo_rentabilidade: document.getElementById('modal_tipo_rentabilidade')?.value || '',
        liquidez: document.getElementById('modal_liquidez')?.value || '',
        garantia_fgc: document.getElementById('modal_garantia_fgc')?.value || '',
        iof_aplicavel: document.getElementById('modal_iof_aplicavel')?.value || '',
        ativo: document.getElementById('modal_ativo')?.value || ''
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
        'id_indexador': 'modal_id_indexador',
        'tipo_rentabilidade': 'modal_tipo_rentabilidade',
        'liquidez': 'modal_liquidez',
        'garantia_fgc': 'modal_garantia_fgc',
        'iof_aplicavel': 'modal_iof_aplicavel',
        'ativo': 'modal_ativo'
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
        'id_indexador': 'modal_id_indexador',
        'tipo_rentabilidade': 'modal_tipo_rentabilidade',
        'liquidez': 'modal_liquidez',
        'garantia_fgc': 'modal_garantia_fgc',
        'iof_aplicavel': 'modal_iof_aplicavel',
        'ativo': 'modal_ativo'
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
    const campos = ['modal_id_tipo_investimento', 'modal_id_banco_emissor', 'modal_id_indexador', 
                    'modal_tipo_rentabilidade', 'modal_liquidez', 'modal_garantia_fgc', 'modal_iof_aplicavel', 'modal_ativo'];
    campos.forEach(id => {
        const combo = document.getElementById(id);
        if (combo) {
            combo.value = '';
            combo.style.border = '';
        }
    });
}
