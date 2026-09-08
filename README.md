# 📋 Sistema de Gerenciamento de Documentos - CEU

Um sistema web moderno e completo para gerenciar documentos de saúde e segurança das unidades CEU, com rastreamento de validade, alertas automáticos e controle por unidade.

## 🎯 Funcionalidades Principais

### ✅ Dashboard Inteligente
- **Visão Geral**: Cards com contagem de documentos (Em Dia, Pendente, Vencido, Próximo a Vencer)
- **Gráficos Dinâmicos**: Visualização do status dos documentos e distribuição por unidade
- **Filtros por Unidade**: Acompanhamento específico de cada CEU
- **Atualização Automática**: Dados atualizados em tempo real

### 📑 Gerenciamento de Documentos
- **Cadastro de Documentos**: Formulário intuitivo com auto-preenchimento
- **Cálculo Automático**: Data de vencimento calculada automaticamente baseada no tipo de documento
- **Anexação de Arquivos**: Suporte para upload de documentos PDF, imagens e office
- **Status N/A**: Marcação de documentos que não se aplicam à função
- **Edição e Exclusão**: Modificar ou remover documentos conforme necessário

### 📊 Acompanhamento Visual
- **Visualização por Status**: Organização dos documentos em 3 colunas (Em Dia, Pendente, Vencido)
- **Cartões Detalhados**: Informações completas de cada documento
- **Ações Rápidas**: Botões para visualizar e reenviar documentos
- **Filtro por Unidade**: Acompanhamento específico por CEU

### 📧 Reenvio de Documentos
- **Notificação Automática**: Envio de avisos quando documento está vencido ou pendente
- **Rastreamento**: Registro de todos os reenvios realizados
- **Lembretes**: Alertas para documentos próximos ao vencimento

### 📈 Relatórios e Exportação
- **Resumo por Unidade**: Tabela com estatísticas de cada CEU
- **Exportar Excel**: Download dos dados em formato CSV
- **Exportar PDF**: Geração de relatórios em PDF (em desenvolvimento)
- **Dados Históricos**: Consulta de informações anteriores

## 📋 Documentos Suportados

| Tipo | Validade | Aplicação |
|------|----------|-----------|
| **ASO** | 1 ano | Avaliação de Saúde Ocupacional |
| **Ficha de EPI** | 3 meses | Equipamento de Proteção Individual |
| **NR6** | 2 anos | Equipamento de Proteção Individual |
| **NR10** | 2 anos | Segurança em Instalações Elétricas |
| **NR18** | 2 anos | Segurança em Canteiros de Obra |
| **NR33** | 1 ano | Segurança em Espaços Confinados |
| **NR35** | 2 anos | Trabalho em Altura |

## 🏢 Unidades CEU

- CEU SILVIO SANTOS
- CEU REI PELÉ
- CEU PADRE TICÃO
- CEU PADRE CHICÃO
- CEU PAPA FRANCISCO

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Design responsivo e moderno
- **JavaScript (ES6+)**: Lógica e interatividade
- **Chart.js**: Gráficos dinâmicos
- **Font Awesome**: Ícones profissionais
- **LocalStorage**: Armazenamento de dados local

## 📱 Responsividade

Sistema totalmente responsivo para:
- ✅ Desktop (1920px+)
- ✅ Laptop (1366px - 1920px)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 768px)

## 🎨 Design

### Cores Principais
- **Primária**: #2563eb (Azul)
- **Sucesso**: #10b981 (Verde)
- **Aviso**: #f59e0b (Amarelo)
- **Perigo**: #ef4444 (Vermelho)

### Componentes UI
- Sidebar navegável com menu mobile
- Cards com status em cores visuais
- Tabelas responsivas com scroll
- Modais para operações
- Badges de status
- Botões com ícones

## 🚀 Como Usar

### 1. **Acessar o Sistema**
```
Abra o arquivo index.html em um navegador moderno
```

### 2. **Dashboard**
- Visualize o resumo de todos os documentos
- Acompanhe quantos estão em dia, pendentes ou vencidos
- Use o filtro para visualizar dados de uma unidade específica

### 3. **Cadastrar Documento**
```
1. Clique em "Novo Documento"
2. Selecione a unidade CEU
3. Escolha o tipo de documento
4. Insira a data de emissão
5. Data de vencimento será calculada automaticamente
6. Adicione observações (opcional)
7. Anexe o documento (opcional)
8. Clique em "Salvar Documento"
```

### 4. **Visualizar Documentos**
```
1. Acesse a seção "Documentos"
2. Use os filtros para encontrar específicos
3. Visualize a tabela com todos os dados
4. Clique no ícone de "Olho" para detalhes
```

### 5. **Acompanhamento**
```
1. Acesse "Acompanhamento"
2. Veja os documentos organizados por status
3. Em Dia: documentos válidos
4. Pendente: aguardando envio
5. Vencido: requer ação imediata
```

### 6. **Reenviar Documento**
```
1. Encontre o documento na tabela ou acompanhamento
2. Clique no ícone de "Papel Aviador" (Reenviar)
3. Uma notificação será enviada aos responsáveis
```

### 7. **Gerar Relatórios**
```
1. Acesse "Relatórios"
2. Visualize o resumo por unidade
3. Clique em "Exportar Excel" para download CSV
4. Clique em "Exportar PDF" para relatório em PDF
```

## 💾 Armazenamento de Dados

Os dados são armazenados localmente no navegador usando **LocalStorage**. Isso significa:

✅ Dados persistem mesmo após fechar o navegador
✅ Sem necessidade de servidor
✅ Privacidade total dos dados
❌ Dados específicos de cada navegador
❌ Limite de ~5-10MB por domínio

### Backup Manual
Para fazer backup dos dados:
1. Abra o console do navegador (F12)
2. Digite: `localStorage.getItem('documentos-ceu')`
3. Copie e guarde o resultado

## 📊 Status dos Documentos

### 🟢 Em Dia
- Documento válido e dentro do prazo
- Sem ação necessária

### 🟡 Pendente
- Documento não foi enviado
- Aguardando envio do colaborador
- Reenviar lembretes

### 🔴 Vencido
- Documento expirou
- **Ação imediata necessária**
- Requer renovação urgente

### 🔵 Próximo a Vencer
- Vence em até 30 dias
- Recomendado renovar antecipadamente

### ⚪ N/A
- Documento não se aplica à função
- Sem data de vencimento

## 🔔 Alertas e Notificações

O sistema verifica automaticamente a cada minuto:
- ✅ Documentos vencidos
- ✅ Documentos próximos ao vencimento
- ✅ Documentos pendentes
- ✅ Status geral da unidade

## 🎓 Exemplos de Uso

### Caso 1: Gestor de Unidade
```
1. Acesse Dashboard
2. Filtre pela sua unidade
3. Visualize o status de todos os documentos
4. Clique em "Acompanhamento" para detalhes
5. Exporte relatório para apresentação
```

### Caso 2: Departamento de RH
```
1. Acesse Relatórios
2. Revise o resumo por unidade
3. Identifique unidades com documentos vencidos
4. Exporte dados para Excel
5. Reenvie documentos vencidos
```

### Caso 3: Inspeção de Conformidade
```
1. Gere relatório em PDF
2. Verifique documentos por tipo (NR10, NR35, etc)
3. Valide a conformidade regulatória
4. Mantenha registro das verificações
```

## 🔐 Segurança

⚠️ **Importante**: Este sistema armazena dados localmente no navegador.

### Recomendações
- Use em ambiente seguro e confiável
- Não compartilhe a URL com pessoas não autorizadas
- Limpe cache do navegador se usar computador compartilhado
- Mantenha backups regularmente
- Não compartilhe dados sensíveis em email/chat

## 🐛 Troubleshooting

### Dados não aparecem
- Limpe o cache do navegador (Ctrl + Shift + Del)
- Verifique se a aba "DocumentoS" está ativa
- Recarregue a página (F5)

### Gráficos não funcionam
- Certifique-se que tem internet (Chart.js é carregado de CDN)
- Verifique console do navegador (F12)
- Tente outro navegador moderno

### Documentos desapareceram
- Verifique o LocalStorage: F12 → Application → Local Storage
- Se vazio, tente restaurar do backup

## 📈 Melhorias Futuras

- [ ] Backend com banco de dados
- [ ] Autenticação de usuários
- [ ] Integração com email para notificações
- [ ] Upload real de arquivos
- [ ] Relatórios em PDF funcional
- [ ] Sincronização entre dispositivos
- [ ] App mobile nativa
- [ ] API REST
- [ ] Notificações por SMS/WhatsApp
- [ ] Assinatura digital de documentos

## 👨‍💻 Desenvolvimento

### Estrutura do Projeto
```
documento-manager-ceu/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # JavaScript
└── README.md           # Documentação
```

### Modificar Períodos de Validade
Edite o objeto `documentosPeriodos` no `script.js`:
```javascript
const documentosPeriodos = {
    'aso': 365,           // 1 ano
    'ficha-epi': 90,      // 3 meses
    'nr6': 730,           // 2 anos
    // ... etc
};
```

### Adicionar Nova Unidade CEU
Edite o array `unidades` no `script.js`:
```javascript
const unidades = [
    { id: 'silvio-santos', nome: 'CEU SILVIO SANTOS' },
    { id: 'nova-unidade', nome: 'CEU NOVA UNIDADE' }, // Adicione aqui
];
```

## 📞 Suporte

Para sugestões, dúvidas ou reportar bugs:
1. Abra uma issue no GitHub
2. Descreva o problema detalhadamente
3. Inclua print de tela se possível

## 📄 Licença

Este projeto é desenvolvido para uso interno das unidades CEU.

## 👏 Créditos

Desenvolvido com ❤️ para melhorar a gestão de documentos nas unidades CEU.

---

**Última atualização**: Setembro 2026
**Versão**: 1.0.0

Aproveite o sistema! 🎉