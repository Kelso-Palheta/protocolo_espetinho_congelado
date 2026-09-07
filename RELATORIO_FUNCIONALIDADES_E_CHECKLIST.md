# Protocolo Espetinho Congelado
## Documento Técnico de Funcionalidades, Arquitetura e Checklist de Entregas

---

### 1. Visão Geral do Sistema e Arquitetura

O projeto **Protocolo Espetinho Congelado** foi concebido como um ecossistema educacional e operacional de alta conversão. Ele opera sob o conceito de **Dual-Mode**:

1. **Modo Web Interativo (Mobile-First)**:
   - Construído com Astro 5 + TailwindCSS.
   - Layout fluido, navegação por drawer retrátil, checklists com persistência em tempo real, tabelas com suporte a rolagem responsiva e visualização dark theme rica.
2. **Modo Editorial Impresso / PDF (A4 Paisagem Widescreen)**:
   - Renderização automatizada via Chromium / Puppeteer.
   - Diagramação de pranchas independentes de proporção 297mm x 210mm (proporção nobre de ocupação visual a 90%).
   - Injeção em tempo de compilação de CSS inlined e conversão de todos os assets visuais para Base64 Data URIs (garantia de zero falhas de carregamento em offline ou impressão).
   - Dark Theme forçado nativo (#09090b / #18181b / acentos âmbar e brasa).

---

### 2. Catálogo de Funcionalidades do Sistema

Abaixo está o detalhamento de cada funcionalidade desenvolvida no ecossistema, descrevendo **o que é**, **para que serve** e **qual é a sua ação prática**.

#### 2.1. Componentes Visuais e de Interatividade (`src/components/`)

| Componente | Para que serve | Ação / Comportamento Técnico |
| :--- | :--- | :--- |
| **`CapaModulo.astro`** | Capa oficial de cada módulo/fascículo para o modo PDF e web. | - Ocupa exatamente a Página 1 do documento (297mm x 210mm).<br/>- Força quebra de página limpa (`page-break-after: always`).<br/>- Exibe metadados oficiais: subtítulo, autor, versão, tag de segurança e lockup da marca com o mascote oficial. |
| **`VisualBlock.astro`** | Apresentação visual "Hero" de cada módulo com impacto gastronômico. | - Ocupa 90% da prancha em grid bipartido (1.45fr para texto / 1fr para imagem).<br/>- Renderiza imagens com aspect-ratio 4:3 e molduras iluminadas em ardósia.<br/>- Incorpora badge de etapa ("Passo 01", "KV"), títulos Outfit e o box "Pro-Tip" (Dica de Mestre de alta conversão). |
| **`TabelaTecnica.astro`** | Estruturação de dados técnicos, gramaturas, custos, tempos e rotinas. | - No Modo Web: Permite rolagem horizontal suave com overflow controlado.<br/>- No Modo PDF: Aplica larguras proporcionais milimétricas (`largurasColunas`), forçando quebras inteligentes (`break-words`) sem nunca empurrar colunas para fora da folha A4.<br/>- Suporta destaque cromático de coluna (`destaqueIndice`), cabeçalhos estilizados em âmbar e notas de rodapé operacionais. |
| **`CalloutAlerta.astro`** | Destacar pontos de atenção crítica, normas sanitárias e dicas de venda. | - Suporta 5 variantes cromáticas semânticas:<br/>  • `temperatura`: Ciano (#06b6d4) para cadeia de frio e -18°C.<br/>  • `perigo`: Carmesim (#e11d48) para perigos sanitários e contaminação.<br/>  • `alerta`: Laranja fogo (#f97316) para cuidados de processo e toalete.<br/>  • `norma`: Dourado âmbar (#f59e0b) para regras de vácuo e normas ANVISA.<br/>  • `dica`: Verde esmeralda (#10b981) para sacadas de conversão comercial.<br/>- Fundo com efeito glow e ícones táteis. Suporta tanto a prop `mensagem` quanto `texto`. |
| **`ChecklistOperacional.astro`** | Condução passo a passo do aluno pelas rotinas da cozinha e vendas. | - No Modo Web: Checkboxes interativos com cálculo em tempo real de progresso (ex: "3/5"), barra de progresso animada e gravação de estado.<br/>- No Modo PDF: Renderiza caixas limpas e legíveis, com tags indicativas de passos "Crítico" e descrições detalhadas sem quebras anômalas de caracteres. |
| **`EbookLayout.astro`** | Casca mestra de todas as páginas de conteúdo do e-book. | - Fornece o Header de navegação superior com logo e título dinâmico.<br/>- Drawer lateral retrátil com índice completo de todos os módulos, protocolos e bônus.<br/>- Barra de leitura com porcentagem de scroll.<br/>- Injeção das fontes 'Outfit' e 'Inter' via Google Fonts e tags SEO completas. |

---

#### 2.2. Automação, Compilação e Geração de Artefatos (`scripts/`)

| Script / Funcionalidade | Para que serve | Ação / Comportamento Técnico |
| :--- | :--- | :--- |
| **`gerar-pdfs.js`** | Motor de impressão headless de fascículos A4 em PDF de alta qualidade. | - Inicia o Chromium via Puppeteer com configurações otimizadas de viewport paisagem (1754x1240).<br/>- Lê os HTMLs compilados em `dist/`, injeta os estilos Tailwind inline e converte imagens em Base64 Data URIs.<br/>- Força CSS específico de impressão (Dark Theme, eliminação de menus web, neutralização de sobreposições).<br/>- Salva simultaneamente na raiz `pdfs/` e espelha em `dist/pdfs/`. |
| **`gerar-ilustracoes.js`** | Geração e curadoria das imagens gastronômicas dos blocos heróis. | - Define prompts fotorrealistas e orientações visuais para as imagens de cada etapa (ex: bancada em inox, cortes contra a fibra, selagem a vácuo, embalagens congeladas e espetinhos dourando na brasa). |
| **Pipeline de Build (`npm run build`)** | Compilação estática do Astro com espelhamento automático. | - Executa `astro build` gerando todas as rotas estáticas em `dist/`.<br/>- O script `postbuild` cria automaticamente a pasta `dist/pdfs` e copia os PDFs gerados, garantindo que o servidor web estático sirva tanto as páginas quanto os downloads diretos dos PDFs. |

---

#### 2.3. Páginas e Plataformas Desenvolvidas (`src/pages/`)

| Página / Rota | Para que serve | Ação / Conteúdo |
| :--- | :--- | :--- |
| **`/` (`index.astro`)** | Portal e Central de Treinamento do Aluno. | - Hub de boas-vindas com cards de acesso rápido a todos os 7 protocolos, 4 bônus e 2 kits.<br/>- Destaque das métricas operacionais (-18°C, 100g, 45% margem, R$ 0 tráfego pago).<br/>- Botões diretos para leitura web e downloads dos arquivos PDF. |
| **`/vendas` (`vendas.astro`)** | Página de Vendas Oficial de Alta Conversão. | - Copywriting persuasivo completo baseado na metodologia do Protocolo.<br/>- Mockup profissional 3D com lockup oficial do produto e mascote.<br/>- Tabela comparativa de ancoragem de valor (Protocolo base vs Bônus vs Kits).<br/>- Quebra de objeções, FAQ interativo e botões de chamada para ação (CTA). |
| **`/protocolo-1` a `/protocolo-7`** | Manuais dos 7 Protocolos Fundamentais. | - Conteúdo técnico minucioso sem cortes: Infraestrutura, Produção, Padronização, Congelamento, Precificação, Oferta e Venda. |
| **`/bonus-1` a `/bonus-4`** | Fascículos dos 4 Bônus Exclusivos. | - Conteúdo de aceleração: Delivery, Recompra, Expansão e Plano Prático de 7 Dias. |
| **`/modulo-whatsapp-vendas`** | Kit WhatsApp Que Vende (Ex-Order Bump 1). | - CRM de 5 cores para WhatsApp Business, scripts prontos copia e cola, guia de texto vs áudio e respostas rápidas. |
| **`/modulo-cardapio-visual`** | Kit Cardápio & Comunicação Visual (Ex-Order Bump 2). | - Psicologia visual da carne congelada, fotografia de smartphone, Templates de Cardápio A e B na íntegra, cronograma semanal de status e 5 Prompts Mestres de IA culinária. |

---

### 3. O Que Já Foi Feito (Concluído com Sucesso)

- [x] **Setup Completo do Ecossistema Astro 5 + TailwindCSS**:
  - Configuração do design system dark mode (`#09090b`, `#18181b`, `#27272a`, tons quentes de âmbar, laranja e vermelho brasa).
  - Tipografia editorial integrada (Outfit para títulos e Inter para textos técnicos e operacionais).
- [x] **Construção dos 5 Componentes Mestres Reutilizáveis**:
  - `CapaModulo.astro`, `VisualBlock.astro`, `TabelaTecnica.astro`, `CalloutAlerta.astro` e `ChecklistOperacional.astro`.
- [x] **Layout Fluido com Drawer Lateral e Navegação Global (`EbookLayout.astro`)**.
- [x] **Desenvolvimento do Portal Central (`index.astro`) e da Página de Vendas Oficial (`vendas.astro`)**:
  - Inclusão do lockup oficial da marca, mascot branding, tabela de ancoragem e links de conversão.
- [x] **Conversão Semântica dos 13 Conteúdos do `conteudo_base/` em Páginas Web e Pranchas A4**:
  - [x] **Protocolo 1**: Preparação (A Estrutura Mínima) — 11 Pranchas
  - [x] **Protocolo 2**: Produção (Matéria-Prima ao Espeto) — 11 Pranchas
  - [x] **Protocolo 3**: Padronização (O DNA do Espetinho) — 9 Pranchas
  - [x] **Protocolo 4**: Congelamento (Estoque Vendável) — 12 Pranchas
  - [x] **Protocolo 5**: Precificação (Custo Real e Lucro) — 10 Pranchas
  - [x] **Protocolo 6**: Oferta (Kits e Combos Lucrativos) — 9 Pranchas
  - [x] **Protocolo 7**: Venda (Divulgação Local e Atendimento) — 10 Pranchas
  - [x] **Bônus 1**: Operação de Pedidos & Delivery — 9 Pranchas
  - [x] **Bônus 2**: Protocolo da Recompra e Recorrência — 9 Pranchas
  - [x] **Bônus 3**: Crescimento e Expansão Consciente — 9 Pranchas
  - [x] **Bônus 4**: Plano Prático Primeiros 7 Dias — 10 Pranchas
  - [x] **Kit WhatsApp Que Vende** — 14 Pranchas
  - [x] **Kit Cardápio & Comunicação Visual** — 16 Pranchas
- [x] **Eliminação Rigorosa dos Termos Proibidos**:
  - Removidas todas as menções a "Order Bump 1" e "Order Bump 2" de todas as capas, títulos, metadados, URLs e rodapés, passando a se chamar formalmente **Kit WhatsApp Que Vende** e **Kit Cardápio & Comunicação Visual**.
- [x] **Geração Inicial de Todos os 13 PDFs de Alta Resolução (`pdfs/`)**:
  - Todos os 13 fascículos compilados com Capa na Página 1, Dark Theme forçado e imagens embutidas em Base64.
- [x] **Correção Cirúrgica de Tabelas Técnicas**:
  - Removida a classe causadora de rolagem horizontal (`whitespace-nowrap`) em `TabelaTecnica.astro`.
  - Inserido suporte a larguras proporcionais fixas (`largurasColunas`), permitindo que tabelas largas (ex: 4 colunas) quebrem linhas de forma fluida sem estourar as bordas da folha A4.
- [x] **Revisão e Blindagem Completa do `Kit-Cardapio-Comunicacao-Visual.pdf`**:
  - Desdobramento da Seção 4 (Templates de Cardápio) em duas pranchas exclusivas (Página 06 para o Modelo A e Página 07 para o Modelo B).
  - Distribuição em 2 colunas nos inputs dos Prompts 1 e 2.
  - Ajuste do CSS de impressão para evitar que parágrafos (`<p>`) inflassem o layout e cortassem o rodapé das páginas.
  - Ajuste do componente `CalloutAlerta.astro` para renderizar o texto dos alertas e dicas práticas perfeitamente.
  - Auditoria com pypdf confirmando que 100% das 16 páginas terminam em suas sentenças finais completas.

---

### 4. Checklist do Que Já Tem vs. O Que Está Faltando / Pode Ser Refinado

| Categoria / Item | Status Atual | O Que Já Tem | O Que Falta / Oportunidade de Melhoria |
| :--- | :---: | :--- | :--- |
| **Protocolo 1 (Preparação)** | 🟢 Concluído | Página web + PDF (11 pranchas) gerados. | Auditoria fina do PDF para checar se algum card longo sofre de leve estufamento vertical. |
| **Protocolos 2 a 7** | 🟢 Concluído | Todas as 6 páginas web e PDFs gerados com pranchas A4. | Realizar a mesma auditoria preventiva página a página nos PDFs 2 a 7 que foi feita no Kit Cardápio. |
| **Bônus 1 a 4** | 🟢 Concluído | Todos os 4 bônus estruturados em pranchas editoriais e PDFs gerados. | Conferência de quebras de página dos PDFs para garantir margens nobres de 90% em todos. |
| **Kit WhatsApp Que Vende** | 🟢 Concluído | Página web + PDF gerados; tabela CRM corrigida com colunas fluidas. | Validar se o usuário deseja algum ajuste visual específico na tabela de CRM ou nos blocos de script. |
| **Kit Cardápio & Visual** | 🟢 Concluído | 16 páginas auditadas com 100% de integridade e zero cortes. | Nada pendente; arquivo 100% calibrado e finalizado. |
| **Ilustrações Gastronômicas** | 🟡 Parcial | Imagens principais integradas nos blocos hero (`hero-banner.png`, `cardapio.png`, etc.). | Gerar ilustrações adicionais ultrarrealistas caso se queira substituir imagens genéricas de apoio por fotos de estúdio personalizadas. |
| **Página de Vendas (`/vendas`)** | 🟢 Concluído | Copy completa, mockups, tabela de preços e FAQ responsivo. | Conectar links reais de checkout (Hotmart / Kiwify / Eduzz) nos botões de CTA quando o produtor definir os links. |
| **Portal Central (`/`)** | 🟢 Concluído | Hub moderno com listagem de módulos, cards com tags e badges. | Opcional: Adicionar busca dinâmica ou filtro por categorias caso o catálogo aumente. |

---

### 5. Resumo Executivo das Próximas Ações Recomendadas

1. **Auditoria Preventiva dos Demais PDFs (Protocolos 1 a 7 e Bônus 1 a 4)**:
   - Aplicar a mesma rotina de verificação automatizada via script para garantir que nenhum dos outros 11 PDFs tenha qualquer linha ou callout cortado pelo limite de altura da prancha.
2. **Definição de Links de Checkout**:
   - Assim que disponibilizados os links de pagamento da plataforma de infoprodutos, atualizar os botões de ação da [Página de Vendas](file:///Users/kelsopalheta/Developer/protocolo_espetinho_congelado/src/pages/vendas.astro).
3. **Entrega e Distribuição**:
   - Os arquivos finais em [pdfs/](file:///Users/kelsopalheta/Developer/protocolo_espetinho_congelado/pdfs/) já estão prontos para entrega direta na área de membros ou disparo via WhatsApp.
