# Protocolo Espetinho Congelado
## Documento Técnico de Funcionalidades, Arquitetura e Checklist Consolidado de Entregas

---

### 1. Visão Geral do Sistema e Arquitetura

O projeto **Protocolo Espetinho Congelado** é um ecossistema educacional e operacional de alta conversão para charcutaria e espetinhos artesanais congelados. Ele opera sob o conceito de **Dual-Mode**:

1. **Modo Web Interativo (Mobile-First)**:
   - Desenvolvido com **Astro 5 + TailwindCSS**.
   - Layout fluido, drawer de navegação lateral retrátil com índice dinâmico, checklists com contagem e persistência em tempo real, tabelas com suporte a rolagem responsiva e visualização dark theme rica.
2. **Modo Editorial Impresso / PDF (A4 Paisagem Widescreen)**:
   - Renderização automatizada via **Chromium / Puppeteer**.
   - Diagramação de pranchas independentes na proporção **297mm x 210mm** (A4 horizontal widescreen, com ocupação nobre visual a 90%).
   - Injeção em tempo de compilação de CSS inlined e conversão de todos os assets visuais para **Base64 Data URIs** (garantia de zero falhas de carregamento em modo offline ou impressão).
   - **Dark Theme forçado nativo** (`#09090b` / `#18181b` / acentos âmbar `#f59e0b`, laranja fogo `#ea580c` e vermelho brasa `#be123c`).

---

### 2. Catálogo Detalhado de Funcionalidades do Sistema

Abaixo está o detalhamento de cada funcionalidade desenvolvida no ecossistema, descrevendo **o que é**, **para que serve** e **qual é a sua ação prática**.

#### 2.1. Componentes Visuais e de Interatividade (`src/components/`)

| Componente | Para que serve | Ação / Comportamento Técnico |
| :--- | :--- | :--- |
| **`CapaModulo.astro`** | Capa oficial de cada módulo/fascículo para modo PDF e web. | - Ocupa exatamente a Página 1 do documento (297mm x 210mm).<br/>- Força quebra de página limpa (`page-break-after: always`).<br/>- Exibe metadados oficiais: subtítulo, autor, versão, tag de segurança e lockup da marca com mascote oficial. |
| **`VisualBlock.astro`** | Apresentação visual "Hero" de cada módulo com impacto gastronômico. | - Ocupa 90% da prancha em grid bipartido (1.45fr para texto / 1fr para imagem).<br/>- Renderiza imagens com aspect-ratio 4:3 e molduras iluminadas em ardósia.<br/>- Incorpora badge de etapa ("Passo 01", "KV"), títulos Outfit e box "Pro-Tip" (Dica de Mestre de alta conversão). |
| **`TabelaTecnica.astro`** | Estruturação de dados técnicos, gramaturas, custos, tempos e rotinas. | - No Modo Web: Permite rolagem horizontal suave com overflow controlado.<br/>- No Modo PDF: Aplica larguras proporcionais milimétricas (`largurasColunas`), forçando quebras inteligentes (`break-words`) sem nunca empurrar colunas para fora da folha A4.<br/>- Suporta destaque cromático de coluna (`destaqueIndice`), cabeçalhos estilizados em âmbar e notas de rodapé operacionais. |
| **`CalloutAlerta.astro`** | Destacar pontos de atenção crítica, normas sanitárias e dicas de venda. | - Suporta 5 variantes cromáticas semânticas:<br/>  • `temperatura`: Ciano (`#06b6d4`) para cadeia de frio e -18°C.<br/>  • `perigo`: Carmesim (`#e11d48`) para perigos sanitários e contaminação.<br/>  • `alerta`: Laranja fogo (`#f97316`) para cuidados de processo e toalete.<br/>  • `norma`: Dourado âmbar (`#f59e0b`) para regras de vácuo e normas ANVISA.<br/>  • `dica`: Verde esmeralda (`#10b981`) para sacadas de conversão comercial.<br/>- Possui prop `compacto?: boolean` e margens verticais controladas para evitar estufamento ou corte em pranchas densas. Suporta tanto a prop `mensagem` quanto `texto`. |
| **`ChecklistOperacional.astro`** | Condução passo a passo do aluno pelas rotinas da cozinha e vendas. | - No Modo Web: Checkboxes interativos com cálculo em tempo real de progresso (ex: "3/5"), barra de progresso animada e gravação de estado.<br/>- No Modo PDF: Renderiza caixas limpas e legíveis, com tags de passos "Crítico". Conta com ativação automática de **grid em 2 colunas** (`duasColunas`) sempre que a lista possui mais de 6 itens, impedindo compressão vertical. |
| **`EbookLayout.astro`** | Casca mestra de todas as páginas de conteúdo do e-book. | - Fornece Header de navegação superior com logo e título dinâmico.<br/>- Drawer lateral retrátil com índice completo de todos os módulos, protocolos e bônus.<br/>- Barra de leitura com porcentagem de scroll.<br/>- Injeção das fontes 'Outfit' e 'Inter' via Google Fonts e tags SEO completas. |

---

#### 2.2. Automação, Compilação e Geração de Artefatos (`scripts/`)

| Script / Funcionalidade | Para que serve | Ação / Comportamento Técnico |
| :--- | :--- | :--- |
| **`gerar-pdfs.js`** | Motor de impressão headless de fascículos A4 em PDF de alta qualidade. | - Inicia o Chromium via Puppeteer com configurações otimizadas de viewport paisagem (1754x1240).<br/>- Lê os HTMLs compilados em `dist/`, injeta os estilos Tailwind inline e converte imagens em Base64 Data URIs.<br/>- Força CSS específico de impressão (Dark Theme, eliminação de menus web, neutralização de sobreposições).<br/>- Salva simultaneamente na raiz `pdfs/` e espelha em `dist/pdfs/`. |
| **`auditar_todos_pdfs.py`** | Motor automatizado de auditoria preventiva de quebras e páginas. | - Inspeciona via `pypdf` todos os 13 arquivos PDF gerados na pasta `pdfs/`.<br/>- Verifica contagem exata de páginas, volume de caracteres por página, primeiras linhas de cada prancha e detecta automaticamente páginas vazias, desalinhamentos ou textos cortados. |
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

### 3. Painel Oficial da Auditoria Preventiva dos 13 PDFs

Todos os 13 arquivos PDF foram compilados, renderizados via Chromium e auditados página a página com o script `scripts/auditar_todos_pdfs.py`. O resultado atesta **100% de conformidade, zero cortes de texto, larguras de tabelas travadas e ausência de páginas em branco**.

| # | Arquivo PDF Gerado | Título Oficial do Módulo | Páginas | Auditoria Preventiva |
|---|---|---|:---:|:---:|
| **01** | `Protocolo-01-Preparacao.pdf` | Preparação da Estrutura e Equipamentos | **10** | ✅ Aprovado (Zero cortes) |
| **02** | `Protocolo-02-Producao.pdf` | Seleção de Carnes e Cortes Perfeitos | **10** | ✅ Aprovado (Zero cortes) |
| **03** | `Protocolo-03-Padronizacao.pdf` | Padronização e Montagem no Espeto | **9** | ✅ Aprovado (Zero cortes) |
| **04** | `Protocolo-04-Congelamento.pdf` | Congelamento e Armazenamento a Vácuo | **12** | ✅ Aprovado (Zero cortes) |
| **05** | `Protocolo-05-Precificacao.pdf` | Precificação e Engenharia de Custos | **10** | ✅ Aprovado (Zero cortes) |
| **06** | `Protocolo-06-Oferta.pdf` | Engenharia de Oferta e Combos | **9** | ✅ Aprovado (Zero cortes) |
| **07** | `Protocolo-07-Venda.pdf` | Divulgação Local e Atendimento Ativo | **10** | ✅ Aprovado (Zero cortes) |
| **B1** | `Bonus-01-Operacao-Delivery.pdf` | Operação de Pedidos & Delivery Local | **9** | ✅ Aprovado (Zero cortes) |
| **B2** | `Bonus-02-Protocolo-Recompra.pdf` | Protocolo da Recompra e Recorrência | **9** | ✅ Aprovado (Zero cortes) |
| **B3** | `Bonus-03-Crescimento-Expansao.pdf` | Crescimento e Expansão Consciente | **9** | ✅ Aprovado (Zero cortes) |
| **B4** | `Bonus-04-Plano-7-Dias.pdf` | Plano Prático dos Primeiros 7 Dias | **9** | ✅ Aprovado (Zero cortes) |
| **KW** | `Kit-WhatsApp-Que-Vende.pdf` | Guia Definitivo de Conversão WhatsApp | **14** | ✅ Aprovado (Zero cortes) |
| **KV** | `Kit-Cardapio-Comunicacao-Visual.pdf` | Design de Conversão & Prompts de IA | **16** | ✅ Aprovado (Zero cortes) |
| **TOTAL** | **13 Fascículos Concluídos** | **Coleção Completa** | **136** | **100% Auditado** |

---

### 4. O Que Já Foi Feito (Concluído com Sucesso)

- [x] **Setup Completo do Ecossistema Astro 5 + TailwindCSS**:
  - Configuração do design system dark mode (`#09090b`, `#18181b`, `#27272a`, tons quentes de âmbar, laranja e vermelho brasa).
  - Tipografia editorial integrada (Outfit para títulos e Inter para textos técnicos e operacionais).
- [x] **Construção e Aperfeiçoamento dos Componentes Mestres Reutilizáveis**:
  - `CapaModulo.astro`: Capas na Página 1 com quebra forçada limpa.
  - `VisualBlock.astro`: Grid bipartido e molduras gastronômicas 4:3.
  - `TabelaTecnica.astro`: Suporte nativo a `largurasColunas` fixas proporcionais e remoção do `whitespace-nowrap`.
  - `CalloutAlerta.astro`: Redução de margens verticais (`my-2.5 p-3.5`) e introdução da prop `compacto?: boolean` para eliminar estouro de altura de prancha.
  - `ChecklistOperacional.astro`: Auto-ativação de **grid em 2 colunas** (`duasColunas`) para listas com mais de 6 itens operacionais.
- [x] **Layout Fluido com Drawer Lateral e Navegação Global (`EbookLayout.astro`)**.
- [x] **Desenvolvimento do Portal Central (`index.astro`) e da Página de Vendas Oficial (`vendas.astro`)**:
  - Inclusão do lockup oficial da marca, mascot branding, tabela de ancoragem de valor e links de conversão.
- [x] **Conversão Semântica dos 13 Conteúdos do `conteudo_base/` em Páginas Web e Pranchas A4**:
  - Preservação de 100% das linhas, receitas, gramaturas, tabelas e checklists sem resumos ou omissões.
- [x] **Eliminação Rigorosa dos Termos Proibidos**:
  - Removidas todas as menções a "Order Bump 1" e "Order Bump 2" de todas as capas, títulos, metadados, URLs e rodapés, passando a se chamar formalmente **Kit WhatsApp Que Vende** e **Kit Cardápio & Comunicação Visual**.
- [x] **Auditoria Preventiva Automatizada em 100% dos 13 PDFs**:
  - Execução de script Python com `pypdf` inspecionando todas as 136 páginas da coleção.
  - Correção cirúrgica de callouts compactos nas páginas 4, 10 e 14 do Kit WhatsApp.
  - Travamento de colunas em todas as tabelas técnicas dos Protocolos 1 a 7 e Bônus 1 a 4.
  - Confirmação de que todas as sentenças e itens de checklist terminam de forma íntegra.
- [x] **Sincronização com Repositório Remoto (Git Push)**:
  - Todo o código-fonte, scripts de compilação, componentes e auditorias sincronizados na branch `main`.

---

### 5. Checklist do Que Já Tem vs. O Que Está Faltando / Oportunidades Futuras

| Categoria / Item | Status Atual | O Que Já Tem | O Que Falta / Oportunidade Futura |
| :--- | :---: | :--- | :--- |
| **Protocolo 1 (Preparação)** | 🟢 100% Concluído | Página web + PDF de 10 páginas auditado e sem cortes. | Nada pendente. |
| **Protocolo 2 (Produção)** | 🟢 100% Concluído | Página web + PDF de 10 páginas com tabela de cortes travada. | Nada pendente. |
| **Protocolo 3 (Padronização)** | 🟢 100% Concluído | Página web + PDF de 9 páginas com ficha técnica calibrada. | Nada pendente. |
| **Protocolo 4 (Congelamento)** | 🟢 100% Concluído | Página web + PDF de 12 páginas com controle de estoque e vácuo. | Nada pendente. |
| **Protocolo 5 (Precificação)** | 🟢 100% Concluído | Página web + PDF de 10 páginas com matriz de custos e calculadora. | Nada pendente. |
| **Protocolo 6 (Oferta)** | 🟢 100% Concluído | Página web + PDF de 9 páginas com engenharia de cardápio e kits. | Nada pendente. |
| **Protocolo 7 (Venda)** | 🟢 100% Concluído | Página web + PDF de 10 páginas com controle operacional de pedidos. | Nada pendente. |
| **Bônus 1 a 4** | 🟢 100% Concluído | 4 páginas web e 4 PDFs (9 páginas cada) auditados com checklists duplos. | Nada pendente. |
| **Kit WhatsApp Que Vende** | 🟢 100% Concluído | 14 páginas auditadas com callouts compactos e sem cortes de texto. | Nada pendente. |
| **Kit Cardápio & Visual** | 🟢 100% Concluído | 16 páginas auditadas, templates de cardápio bipartidos e prompts de IA. | Nada pendente. |
| **Página de Vendas (`/vendas`)** | 🟢 Concluído | Copy completa, mockups, tabela de preços e FAQ responsivo. | **Pendente de Decisão Externa**: Inserir links reais de checkout (Hotmart / Kiwify / Eduzz) nos botões de CTA quando o produtor definir a plataforma. |
| **Portal Central (`/`)** | 🟢 Concluído | Hub moderno com listagem de módulos, cards com tags e badges. | Opcional: Adicionar campo de busca dinâmica se o catálogo de receitas expandir futuramente. |
| **Imagens Gastronômicas** | 🟢 Concluído | Imagens gastronômicas integradas nos blocos hero de todos os módulos. | Opcional: Gerar fotos de estúdio personalizadas caso queira substituir alguma imagem de apoio. |

---

### 6. Conclusão e Prontidão de Entrega

O projeto encontra-se em **estado de prontidão total para distribuição comercial**:
1. Os arquivos finais em [pdfs/](file:///Users/kelsopalheta/Developer/protocolo_espetinho_congelado/pdfs/) somam **136 páginas de altíssimo padrão gráfico**, ideais para envio por WhatsApp, e-mail ou disponibilização na área de membros de qualquer plataforma de infoprodutos.
2. A aplicação web estática em [dist/](file:///Users/kelsopalheta/Developer/protocolo_espetinho_congelado/dist/) pode ser publicada imediatamente em qualquer serviço de hospedagem (Vercel, Cloudflare Pages, Netlify ou servidor próprio).
