// ===== DADOS DO SISTEMA =====
const documentosPeriodos = {
    'aso': 365,
    'ficha-epi': 90,
    'nr6': 730,
    'nr10': 730,
    'nr18': 730,
    'nr33': 365,
    'nr35': 730
};

const unidades = [
    { id: 'silvio-santos', nome: 'CEU SILVIO SANTOS' },
    { id: 'rei-pele', nome: 'CEU REI PELÉ' },
    { id: 'padre-ticao', nome: 'CEU PADRE TICÃO' },
    { id: 'padre-chicao', nome: 'CEU PADRE CHICÃO' },
    { id: 'papa-francisco', nome: 'CEU PAPA FRANCISCO' }
];

let documentos = [];
let charts = {};

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    inicializarSistema();
    carregarDadosLocais();
    atualizarDashboard();
});

function inicializarSistema() {
    // Navegação
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            mudarSecao(item.dataset.section);
        });
    });

    // Menu toggle responsivo
    document.getElementById('menuToggle').addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('active');
    });

    // Modais
    document.getElementById('addDocBtn').addEventListener('click', abrirModalDocumento);
    document.getElementById('documentoForm').addEventListener('submit', salvarDocumento);
    
    // Fechar modais
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });

    document.getElementById('cancelBtn').addEventListener('click', function() {
        document.getElementById('documentoModal').classList.remove('active');
    });

    // Filtros
    document.getElementById('dataEmissao').addEventListener('change', calcularVencimento);
    document.getElementById('tipoDoc').addEventListener('change', calcularVencimento);
    
    document.getElementById('unidadeFiltro').addEventListener('change', atualizarTabelaDocumentos);
    document.getElementById('tipoDocumento').addEventListener('change', atualizarTabelaDocumentos);
    document.getElementById('statusFiltro').addEventListener('change', atualizarTabelaDocumentos);

    document.getElementById('unidadeFilter').addEventListener('change', atualizarDashboard);
    document.getElementById('unidadeAcomp').addEventListener('change', atualizarAcompanhamento);

    // Exportar
    document.getElementById('exportPDF').addEventListener('click', exportarPDF);
    document.getElementById('exportExcel').addEventListener('click', exportarExcel);

    // Configurações
    document.getElementById('manageDocTypes').addEventListener('click', () => alert('Funcionalidade em desenvolvimento'));
    document.getElementById('manageUnidades').addEventListener('click', () => alert('Funcionalidade em desenvolvimento'));
    document.getElementById('manageNotificacoes').addEventListener('click', () => alert('Funcionalidade em desenvolvimento'));

    // Fechar sidebar ao clicar fora
    document.addEventListener('click', function(e) {
        const sidebar = document.querySelector('.sidebar');
        const menuToggle = document.getElementById('menuToggle');
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
}

// ===== NAVEGAÇÃO =====
function mudarSecao(secao) {
    // Remover ativo de todos os itens
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));

    // Ativar selecionado
    document.querySelector(`[data-section="${secao}"]`).classList.add('active');
    document.getElementById(secao).classList.add('active');

    // Fechar sidebar
    document.querySelector('.sidebar').classList.remove('active');

    // Atualizar conteúdo específico
    if (secao === 'documentos') {
        atualizarTabelaDocumentos();
    } else if (secao === 'acompanhamento') {
        atualizarAcompanhamento();
    } else if (secao === 'relatorios') {
        gerarRelatorios();
    } else if (secao === 'dashboard') {
        atualizarDashboard();
    }
}

// ===== GERENCIAMENTO DE DOCUMENTOS =====
function abrirModalDocumento() {
    document.getElementById('documentoModal').classList.add('active');
    document.getElementById('documentoForm').reset();
}

function calcularVencimento() {
    const dataEmissao = document.getElementById('dataEmissao').value;
    const tipoDoc = document.getElementById('tipoDoc').value;

    if (dataEmissao && tipoDoc) {
        const data = new Date(dataEmissao);
        const dias = documentosPeriodos[tipoDoc];
        data.setDate(data.getDate() + dias);
        
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        
        document.getElementById('dataVencimento').value = `${ano}-${mes}-${dia}`;
    }
}

function salvarDocumento(e) {
    e.preventDefault();

    const documento = {
        id: Date.now(),
        unidade: document.getElementById('unidade').value,
        tipo: document.getElementById('tipoDoc').value,
        dataEmissao: document.getElementById('dataEmissao').value,
        dataVencimento: document.getElementById('dataVencimento').value,
        observacoes: document.getElementById('observacoes').value,
        naoAplica: document.getElementById('naoAplica').checked,
        status: 'pendente',
        arquivo: document.getElementById('arquivo').files[0]?.name || 'Sem anexo',
        dataCriacao: new Date().toISOString()
    };

    documentos.push(documento);
    salvarDadosLocais();
    
    document.getElementById('documentoModal').classList.remove('active');
    document.getElementById('documentoForm').reset();
    
    atualizarDashboard();
    atualizarTabelaDocumentos();
    
    alert('Documento salvo com sucesso!');
}

function atualizarStatusDocumentos() {
    const hoje = new Date();
    
    documentos.forEach(doc => {
        if (doc.naoAplica) {
            doc.status = 'nao-aplica';
        } else if (doc.status === 'pendente') {
            // Manter como pendente
        } else {
            const dataVencimento = new Date(doc.dataVencimento);
            const diferenca = dataVencimento.getTime() - hoje.getTime();
            const dias = Math.ceil(diferenca / (1000 * 60 * 60 * 24));

            if (dias < 0) {
                doc.status = 'vencido';
            } else if (dias <= 30) {
                doc.status = 'proximo-vencer';
            } else {
                doc.status = 'em-dia';
            }
        }
    });
}

// ===== ATUALIZAR TABELA =====
function atualizarTabelaDocumentos() {
    atualizarStatusDocumentos();
    
    const unidade = document.getElementById('unidadeFiltro').value;
    const tipo = document.getElementById('tipoDocumento').value;
    const status = document.getElementById('statusFiltro').value;

    let filtrados = documentos.filter(doc => {
        return (!unidade || doc.unidade === unidade) &&
               (!tipo || doc.tipo === tipo) &&
               (!status || doc.status === status);
    });

    const tbody = document.getElementById('documentosTable');
    tbody.innerHTML = '';

    if (filtrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px;">Nenhum documento encontrado</td></tr>';
        return;
    }

    filtrados.forEach(doc => {
        const diasRestantes = calcularDiasRestantes(doc.dataVencimento);
        const nomeUnidade = unidades.find(u => u.id === doc.unidade)?.nome || doc.unidade;
        const tipoNome = getNomeTipoDocumento(doc.tipo);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${nomeUnidade}</td>
            <td>${tipoNome}</td>
            <td>${formatarData(doc.dataEmissao)}</td>
            <td>${doc.naoAplica ? 'N/A' : formatarData(doc.dataVencimento)}</td>
            <td>${doc.naoAplica ? 'N/A' : diasRestantes + ' dias'}</td>
            <td><span class="status-badge ${doc.status}">${getNomeStatus(doc.status)}</span></td>
            <td>
                <button class="btn btn-icon btn-primary" onclick="visualizarDocumento(${doc.id})" title="Visualizar">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-icon btn-secondary" onclick="reenviarDocumento(${doc.id})" title="Reenviar">
                    <i class="fas fa-paper-plane"></i>
                </button>
                <button class="btn btn-icon btn-danger" onclick="deletarDocumento(${doc.id})" title="Deletar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// ===== DASHBOARD =====
function atualizarDashboard() {
    atualizarStatusDocumentos();

    const unidade = document.getElementById('unidadeFilter').value;
    
    let filtrados = documentos;
    if (unidade) {
        filtrados = documentos.filter(doc => doc.unidade === unidade);
    }

    const emDia = filtrados.filter(d => d.status === 'em-dia').length;
    const pendente = filtrados.filter(d => d.status === 'pendente').length;
    const vencido = filtrados.filter(d => d.status === 'vencido').length;
    const proxVencer = filtrados.filter(d => d.status === 'proximo-vencer').length;

    document.getElementById('emDiaCount').textContent = emDia;
    document.getElementById('pendenteCount').textContent = pendente;
    document.getElementById('vencidoCount').textContent = vencido;
    document.getElementById('proxvencerCount').textContent = proxVencer;

    // Gráficos
    atualizarGraficos(filtrados);
}

function atualizarGraficos(dados) {
    // Status Chart
    if (charts.statusChart) {
        charts.statusChart.destroy();
    }

    const statusCounts = {
        'Em Dia': dados.filter(d => d.status === 'em-dia').length,
        'Pendente': dados.filter(d => d.status === 'pendente').length,
        'Vencido': dados.filter(d => d.status === 'vencido').length,
        'Próx. Vencer': dados.filter(d => d.status === 'proximo-vencer').length,
        'N/A': dados.filter(d => d.status === 'nao-aplica').length
    };

    const ctx1 = document.getElementById('statusChart');
    if (ctx1) {
        charts.statusChart = new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: Object.keys(statusCounts),
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: [
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#3b82f6',
                        '#9ca3af'
                    ],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Unidade Chart
    if (charts.unidadeChart) {
        charts.unidadeChart.destroy();
    }

    const unidadeCounts = {};
    unidades.forEach(u => {
        unidadeCounts[u.nome] = dados.filter(d => d.unidade === u.id).length;
    });

    const ctx2 = document.getElementById('unidadeChart');
    if (ctx2) {
        charts.unidadeChart = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: Object.keys(unidadeCounts),
                datasets: [{
                    label: 'Documentos',
                    data: Object.values(unidadeCounts),
                    backgroundColor: '#2563eb',
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    }
}

// ===== ACOMPANHAMENTO =====
function atualizarAcompanhamento() {
    atualizarStatusDocumentos();

    const unidade = document.getElementById('unidadeAcomp').value;
    
    let filtrados = documentos;
    if (unidade) {
        filtrados = documentos.filter(doc => doc.unidade === unidade);
    }

    const emDiaList = document.getElementById('emDiaList');
    const pendenteList = document.getElementById('pendenteList');
    const vencidoList = document.getElementById('vencidoList');

    emDiaList.innerHTML = '';
    pendenteList.innerHTML = '';
    vencidoList.innerHTML = '';

    filtrados.forEach(doc => {
        const item = criarItemAcompanhamento(doc);
        
        if (doc.status === 'em-dia') {
            emDiaList.appendChild(item);
        } else if (doc.status === 'pendente') {
            pendenteList.appendChild(item);
        } else if (doc.status === 'vencido') {
            vencidoList.appendChild(item);
        }
    });

    if (emDiaList.innerHTML === '') emDiaList.innerHTML = '<p style="color: #999; text-align: center;">Nenhum documento</p>';
    if (pendenteList.innerHTML === '') pendenteList.innerHTML = '<p style="color: #999; text-align: center;">Nenhum documento</p>';
    if (vencidoList.innerHTML === '') vencidoList.innerHTML = '<p style="color: #999; text-align: center;">Nenhum documento</p>';
}

function criarItemAcompanhamento(doc) {
    const diasRestantes = calcularDiasRestantes(doc.dataVencimento);
    const nomeUnidade = unidades.find(u => u.id === doc.unidade)?.nome || doc.unidade;
    const tipoNome = getNomeTipoDocumento(doc.tipo);

    const item = document.createElement('div');
    item.className = 'acomp-item';
    item.innerHTML = `
        <div class="acomp-item-content">
            <strong>${tipoNome}</strong>
            <small>${nomeUnidade}</small>
            <small style="display: block; margin-top: 5px;">Vencimento: ${doc.naoAplica ? 'N/A' : formatarData(doc.dataVencimento)}</small>
        </div>
        <div class="acomp-actions">
            <button class="btn btn-small btn-primary" onclick="visualizarDocumento(${doc.id})">
                <i class="fas fa-eye"></i>
            </button>
        </div>
    `;
    return item;
}

// ===== RELATÓRIOS =====
function gerarRelatorios() {
    atualizarStatusDocumentos();

    const relatorioContent = document.getElementById('relatorioContent');
    relatorioContent.innerHTML = '';

    let html = '<table class="documents-table"><thead><tr><th>Unidade</th><th>Total</th><th>Em Dia</th><th>Pendente</th><th>Vencido</th><th>Próx. Vencer</th></tr></thead><tbody>';

    unidades.forEach(unidade => {
        const docs = documentos.filter(d => d.unidade === unidade.id);
        const emDia = docs.filter(d => d.status === 'em-dia').length;
        const pendente = docs.filter(d => d.status === 'pendente').length;
        const vencido = docs.filter(d => d.status === 'vencido').length;
        const proxVencer = docs.filter(d => d.status === 'proximo-vencer').length;

        html += `
            <tr>
                <td>${unidade.nome}</td>
                <td>${docs.length}</td>
                <td><span class="status-badge em-dia">${emDia}</span></td>
                <td><span class="status-badge pendente">${pendente}</span></td>
                <td><span class="status-badge vencido">${vencido}</span></td>
                <td><span class="status-badge proximo-vencer">${proxVencer}</span></td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    relatorioContent.innerHTML = html;
}

// ===== AÇÕES DE DOCUMENTO =====
function visualizarDocumento(id) {
    const doc = documentos.find(d => d.id === id);
    if (!doc) return;

    const nomeUnidade = unidades.find(u => u.id === doc.unidade)?.nome || doc.unidade;
    const tipoNome = getNomeTipoDocumento(doc.tipo);
    const diasRestantes = calcularDiasRestantes(doc.dataVencimento);

    const modal = document.getElementById('viewDocumentModal');
    const detalhes = document.getElementById('documentoDetalhes');

    detalhes.innerHTML = `
        <div class="detalhe-row">
            <div class="detalhe-item">
                <span class="detalhe-label">Unidade</span>
                <span class="detalhe-value">${nomeUnidade}</span>
            </div>
            <div class="detalhe-item">
                <span class="detalhe-label">Tipo de Documento</span>
                <span class="detalhe-value">${tipoNome}</span>
            </div>
        </div>
        <div class="detalhe-row">
            <div class="detalhe-item">
                <span class="detalhe-label">Data de Emissão</span>
                <span class="detalhe-value">${formatarData(doc.dataEmissao)}</span>
            </div>
            <div class="detalhe-item">
                <span class="detalhe-label">Data de Vencimento</span>
                <span class="detalhe-value">${doc.naoAplica ? 'N/A' : formatarData(doc.dataVencimento)}</span>
            </div>
        </div>
        <div class="detalhe-row">
            <div class="detalhe-item">
                <span class="detalhe-label">Dias Restantes</span>
                <span class="detalhe-value">${doc.naoAplica ? 'N/A' : diasRestantes + ' dias'}</span>
            </div>
            <div class="detalhe-item">
                <span class="detalhe-label">Status</span>
                <span class="detalhe-value"><span class="status-badge ${doc.status}">${getNomeStatus(doc.status)}</span></span>
            </div>
        </div>
        <div class="detalhe-row full-width">
            <div class="detalhe-item">
                <span class="detalhe-label">Observações</span>
                <span class="detalhe-value">${doc.observacoes || 'Nenhuma observação'}</span>
            </div>
        </div>
        <div class="detalhe-row full-width">
            <div class="detalhe-item">
                <span class="detalhe-label">Arquivo Anexado</span>
                <span class="detalhe-value">${doc.arquivo}</span>
            </div>
        </div>
        <div class="documento-actions">
            <button class="btn btn-primary" onclick="reenviarDocumento(${id})">
                <i class="fas fa-paper-plane"></i> Reenviar Documento
            </button>
            <button class="btn btn-secondary" onclick="editarDocumento(${id})">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn btn-danger" onclick="deletarDocumento(${id})">
                <i class="fas fa-trash"></i> Deletar
            </button>
        </div>
    `;

    modal.classList.add('active');
}

function reenviarDocumento(id) {
    const doc = documentos.find(d => d.id === id);
    if (!doc) return;

    const tipoNome = getNomeTipoDocumento(doc.tipo);
    alert(`Documento "${tipoNome}" reenviado com sucesso!\n\nNotificação enviada aos responsáveis.`);
    
    // Registrar ação de reenvio
    console.log(`Documento reenviad: ${tipoNome}`);
}

function editarDocumento(id) {
    alert('Funcionalidade de edição em desenvolvimento');
}

function deletarDocumento(id) {
    if (confirm('Tem certeza que deseja deletar este documento?')) {
        documentos = documentos.filter(d => d.id !== id);
        salvarDadosLocais();
        
        document.getElementById('viewDocumentModal').classList.remove('active');
        atualizarDashboard();
        atualizarTabelaDocumentos();
        atualizarAcompanhamento();
        
        alert('Documento deletado com sucesso!');
    }
}

// ===== EXPORTAR DADOS =====
function exportarPDF() {
    alert('PDF gerado com sucesso! (Funcionalidade em desenvolvimento)');
}

function exportarExcel() {
    let csv = 'Unidade,Tipo,Data Emissão,Data Vencimento,Dias Restantes,Status\n';
    
    documentos.forEach(doc => {
        const diasRestantes = calcularDiasRestantes(doc.dataVencimento);
        csv += `${unidades.find(u => u.id === doc.unidade)?.nome},${getNomeTipoDocumento(doc.tipo)},${doc.dataEmissao},${doc.dataVencimento},${diasRestantes},${getNomeStatus(doc.status)}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio-documentos.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// ===== UTILITÁRIOS =====
function calcularDiasRestantes(dataVencimento) {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diferenca = vencimento.getTime() - hoje.getTime();
    return Math.ceil(diferenca / (1000 * 60 * 60 * 24));
}

function formatarData(data) {
    const d = new Date(data);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function getNomeTipoDocumento(tipo) {
    const tipos = {
        'aso': 'ASO',
        'ficha-epi': 'Ficha de EPI',
        'nr6': 'NR6',
        'nr10': 'NR10',
        'nr18': 'NR18',
        'nr33': 'NR33',
        'nr35': 'NR35'
    };
    return tipos[tipo] || tipo;
}

function getNomeStatus(status) {
    const statuses = {
        'em-dia': 'Em Dia',
        'pendente': 'Pendente',
        'vencido': 'Vencido',
        'proximo-vencer': 'Próx. Vencer',
        'nao-aplica': 'N/A'
    };
    return statuses[status] || status;
}

// ===== LOCAL STORAGE =====
function salvarDadosLocais() {
    localStorage.setItem('documentos-ceu', JSON.stringify(documentos));
}

function carregarDadosLocais() {
    const dados = localStorage.getItem('documentos-ceu');
    if (dados) {
        documentos = JSON.parse(dados);
    } else {
        // Dados de exemplo
        documentos = [
            {
                id: 1,
                unidade: 'silvio-santos',
                tipo: 'aso',
                dataEmissao: '2025-01-15',
                dataVencimento: '2026-01-15',
                observacoes: 'ASO anual do colaborador',
                naoAplica: false,
                status: 'em-dia',
                arquivo: 'aso-silvio-santos.pdf',
                dataCriacao: new Date().toISOString()
            },
            {
                id: 2,
                unidade: 'rei-pele',
                tipo: 'ficha-epi',
                dataEmissao: '2024-12-01',
                dataVencimento: '2025-03-01',
                observacoes: 'Ficha de EPI trimestral',
                naoAplica: false,
                status: 'proximo-vencer',
                arquivo: 'ficha-epi-rei-pele.pdf',
                dataCriacao: new Date().toISOString()
            },
            {
                id: 3,
                unidade: 'padre-ticao',
                tipo: 'nr6',
                dataEmissao: '2023-06-10',
                dataVencimento: '2025-06-10',
                observacoes: 'NR6 bienal',
                naoAplica: false,
                status: 'em-dia',
                arquivo: 'nr6-padre-ticao.pdf',
                dataCriacao: new Date().toISOString()
            },
            {
                id: 4,
                unidade: 'padre-chicao',
                tipo: 'nr33',
                dataEmissao: '2024-01-20',
                dataVencimento: '2024-12-20',
                observacoes: 'NR33 anual - VENCIDO',
                naoAplica: false,
                status: 'vencido',
                arquivo: 'nr33-padre-chicao.pdf',
                dataCriacao: new Date().toISOString()
            },
            {
                id: 5,
                unidade: 'papa-francisco',
                tipo: 'nr10',
                dataEmissao: '',
                dataVencimento: '',
                observacoes: 'Aguardando envio do colaborador',
                naoAplica: false,
                status: 'pendente',
                arquivo: 'Sem anexo',
                dataCriacao: new Date().toISOString()
            }
        ];
        salvarDadosLocais();
    }
}

// ===== AUTO-REFRESH =====
setInterval(() => {
    atualizarStatusDocumentos();
    if (document.getElementById('documentos').classList.contains('active')) {
        atualizarTabelaDocumentos();
    }
}, 60000); // A cada 1 minuto
