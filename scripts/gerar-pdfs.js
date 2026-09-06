import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'pdfs');
const DIST_OUTPUT_DIR = path.join(ROOT_DIR, 'dist', 'pdfs');

// Lista completa dos módulos do ecossistema
const MODULOS_PDF = [
  {
    id: 'protocolo-1',
    nomeArquivo: 'Protocolo-01-Preparacao.pdf',
    titulo: 'Protocolo 1: Preparação (A Estrutura Mínima)',
    path: '/protocolo-1'
  },
  {
    id: 'protocolo-2',
    nomeArquivo: 'Protocolo-02-Producao.pdf',
    titulo: 'Protocolo 2: Produção (Matéria-Prima ao Espeto)',
    path: '/protocolo-2'
  },
  {
    id: 'protocolo-3',
    nomeArquivo: 'Protocolo-03-Padronizacao.pdf',
    titulo: 'Protocolo 3: Padronização (O DNA do Espetinho)',
    path: '/protocolo-3'
  },
  {
    id: 'protocolo-4',
    nomeArquivo: 'Protocolo-04-Congelamento.pdf',
    titulo: 'Protocolo 4: Congelamento (Estoque Vendável)',
    path: '/protocolo-4'
  },
  {
    id: 'protocolo-5',
    nomeArquivo: 'Protocolo-05-Precificacao.pdf',
    titulo: 'Protocolo 5: Precificação (Custo Real e Lucro)',
    path: '/protocolo-5'
  },
  {
    id: 'protocolo-6',
    nomeArquivo: 'Protocolo-06-Oferta.pdf',
    titulo: 'Protocolo 6: Oferta (Kits e Combos Lucrativos)',
    path: '/protocolo-6'
  },
  {
    id: 'protocolo-7',
    nomeArquivo: 'Protocolo-07-Venda.pdf',
    titulo: 'Protocolo 7: Venda (Divulgação Local e Atendimento)',
    path: '/protocolo-7'
  },
  {
    id: 'bonus-1',
    nomeArquivo: 'Bonus-01-Operacao-Delivery.pdf',
    titulo: 'Bônus 1: Operação de Pedidos & Delivery',
    path: '/bonus-1'
  },
  {
    id: 'bonus-2',
    nomeArquivo: 'Bonus-02-Protocolo-Recompra.pdf',
    titulo: 'Bônus 2: Protocolo da Recompra e Recorrência',
    path: '/bonus-2'
  },
  {
    id: 'bonus-3',
    nomeArquivo: 'Bonus-03-Crescimento-Expansao.pdf',
    titulo: 'Bônus 3: Crescimento e Expansão Consciente',
    path: '/bonus-3'
  },
  {
    id: 'bonus-4',
    nomeArquivo: 'Bonus-04-Plano-7-Dias.pdf',
    titulo: 'Bônus 4: Plano Prático Primeiros 7 Dias',
    path: '/bonus-4'
  },
  {
    id: 'modulo-whatsapp-vendas',
    nomeArquivo: 'Modulo-Liberado-01-Kit-WhatsApp.pdf',
    titulo: 'Módulo Liberado 1: Kit WhatsApp Que Vende',
    path: '/modulo-whatsapp-vendas'
  },
  {
    id: 'modulo-cardapio-visual',
    nomeArquivo: 'Modulo-Liberado-02-Kit-Cardapio-Visual.pdf',
    titulo: 'Módulo Liberado 2: Kit Cardápio & Comunicação Visual',
    path: '/modulo-cardapio-visual'
  }
];

// Porta padrão do Astro
const BASE_URL = process.env.BASE_URL || 'http://localhost:4321';

/**
 * Prepara o HTML estático do Astro para renderização perfeita no Puppeteer:
 * 1. Injeta os arquivos CSS do Tailwind diretamente inline no <head>
 * 2. Converte todas as imagens PNG para Base64 Data URI (zero falhas ou placeholders)
 * 3. Aplica estilos forçados de Dark Theme (#0f1117 / #f1f5f9)
 * 4. Configura a Capa Modular na Página 1 com page-break-after: always
 * 5. Oculta cabeçalhos web, menus drawers e botões interativos
 */
export function prepararHtmlParaPdf(caminhoHtml) {
  let html = fs.readFileSync(caminhoHtml, 'utf-8');

  // 1. Injetar todos os arquivos CSS de /_astro/ inline no HTML
  html = html.replace(/<link[^>]+rel="stylesheet"[^>]+href="\/_astro\/([^"]+)"[^>]*>/g, (match, cssFile) => {
    const cssPath = path.join(ROOT_DIR, 'dist', '_astro', cssFile);
    if (fs.existsSync(cssPath)) {
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      return `<style data-inlined="${cssFile}">\n${cssContent}\n</style>`;
    }
    return match;
  });

  html = html.replace(/<link[^>]+href="([^"]+\.css)"[^>]*>/g, (match, href) => {
    const cleanHref = href.replace(/^\/_astro\//, '');
    const cssPath = path.join(ROOT_DIR, 'dist', '_astro', cleanHref);
    if (fs.existsSync(cssPath)) {
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      return `<style data-inlined="${cleanHref}">\n${cssContent}\n</style>`;
    }
    return match;
  });

  // 2. Converter todas as imagens (/... ou /_astro/...) para Base64 Data URI
  html = html.replace(/src="\/([^"]+\.(png|jpg|jpeg|svg|webp))"/gi, (match, imgRelative) => {
    let imgPath = path.join(ROOT_DIR, 'dist', imgRelative);
    if (!fs.existsSync(imgPath)) {
      imgPath = path.join(ROOT_DIR, 'dist', '_astro', path.basename(imgRelative));
    }
    if (!fs.existsSync(imgPath)) {
      imgPath = path.join(ROOT_DIR, 'public', imgRelative);
    }
    if (fs.existsSync(imgPath)) {
      const ext = path.extname(imgPath).toLowerCase().replace('.', '');
      const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'svg' ? 'image/svg+xml' : ext === 'webp' ? 'image/webp' : 'image/png';
      const base64 = fs.readFileSync(imgPath).toString('base64');
      return `src="data:${mime};base64,${base64}"`;
    }
    return match;
  });

  // Também cobrir imagens em url('/_astro/...') ou url('/...') nos estilos
  html = html.replace(/url\(['"]?\/([^'")]+\.(png|jpg|jpeg|svg|webp))['"]?\)/gi, (match, imgRelative) => {
    let imgPath = path.join(ROOT_DIR, 'dist', imgRelative);
    if (!fs.existsSync(imgPath)) {
      imgPath = path.join(ROOT_DIR, 'dist', '_astro', path.basename(imgRelative));
    }
    if (!fs.existsSync(imgPath)) {
      imgPath = path.join(ROOT_DIR, 'public', imgRelative);
    }
    if (fs.existsSync(imgPath)) {
      const ext = path.extname(imgPath).toLowerCase().replace('.', '');
      const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'svg' ? 'image/svg+xml' : ext === 'webp' ? 'image/webp' : 'image/png';
      const base64 = fs.readFileSync(imgPath).toString('base64');
      return `url("data:${mime};base64,${base64}")`;
    }
    return match;
  });

  // 3. Injeção de Estilo Forçada (Dark Theme + Ocultação de Tela + Quebras de Página)
  const estiloInjetado = `
<style id="pdf-custom-styles">
  /* ====================================================================
     1. RESET GERAL & CONFIGURAÇÃO A4 PAISAGEM (HORIZONTAL)
     ==================================================================== */
  @page {
    size: 297mm 210mm;
    margin: 0;
  }

  header.top-nav-header,
  #open-menu-btn,
  #close-menu-btn,
  #menu-drawer,
  #menu-overlay,
  .navigation-footer,
  nav,
  button,
  footer,
  .btn-navegacao,
  .no-print {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }

  html, body {
    background-color: #09090b !important;
    color: #f4f4f5 !important;
    font-size: 14px !important;
    line-height: 1.55 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 297mm !important;
    height: 210mm !important;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  }

  *, *::before, *::after {
    box-sizing: border-box !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  p, li, dd, blockquote {
    orphans: 3 !important;
    widows: 3 !important;
    font-size: 14px !important;
    line-height: 1.55 !important;
    color: #d4d4d8 !important;
  }

  p {
    margin-top: 0 !important;
    margin-bottom: 8px !important;
  }

  /* Tipografia Proporcional Editorial */
  .text-xs { font-size: 11.5px !important; line-height: 1.4 !important; }
  .text-sm { font-size: 13px !important; line-height: 1.45 !important; }
  .text-base { font-size: 14px !important; line-height: 1.55 !important; }
  .text-lg { font-size: 16px !important; line-height: 1.4 !important; }
  .text-xl { font-size: 18px !important; line-height: 1.35 !important; }
  .text-2xl { font-size: 22px !important; line-height: 1.3 !important; }

  /* Títulos Firmes com Hierarquia Visual */
  h1, h2, h3, h4, h5, h6 {
    page-break-after: avoid !important;
    break-after: avoid !important;
    color: #ffffff !important;
    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif !important;
  }

  h1 {
    font-size: 1.85rem !important;
    line-height: 1.15 !important;
    margin-top: 0 !important;
    margin-bottom: 10px !important;
    font-weight: 800 !important;
  }

  h2 {
    font-size: 1.35rem !important;
    line-height: 1.25 !important;
    margin-top: 0 !important;
    margin-bottom: 8px !important;
    font-weight: 700 !important;
  }

  h3 {
    font-size: 1.1rem !important;
    line-height: 1.3 !important;
    margin-top: 0 !important;
    margin-bottom: 6px !important;
    font-weight: 600 !important;
  }

  h4 {
    font-size: 0.95rem !important;
    line-height: 1.3 !important;
    margin-top: 0 !important;
    margin-bottom: 4px !important;
    font-weight: 600 !important;
  }

  /* Capa Modular (Página 1 — Ocupação Total A4 Paisagem) */
  .capa-modulo {
    page-break-before: avoid !important;
    break-before: avoid !important;
    page-break-after: always !important;
    break-after: page !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    height: 210mm !important;
    min-height: 210mm !important;
    max-height: 210mm !important;
    width: 297mm !important;
    max-width: 297mm !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    box-sizing: border-box !important;
    padding: 32px 44px !important;
    border-radius: 0 !important;
    border: none !important;
    background-color: #09090b !important;
    position: relative !important;
    overflow: hidden !important;
  }

  .capa-modulo .my-auto {
    margin-top: auto !important;
    margin-bottom: auto !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }

  .capa-modulo h1 {
    font-size: 2.6rem !important;
    line-height: 1.1 !important;
  }

  /* Estrutura de Conteúdo Principal (Main) */
  main,
  .main-content,
  .container {
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box !important;
    background: transparent !important;
    display: block !important;
  }

  /* O primeiro elemento dentro do main NUNCA quebra página (elimina folha em branco!) */
  main > :first-child,
  .visual-block:first-of-type,
  .prancha:first-of-type {
    page-break-before: avoid !important;
    break-before: avoid !important;
    margin-top: 0 !important;
  }

  main > *,
  main > :not([hidden]) ~ :not([hidden]),
  .prancha {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }

  /* ====================================================================
     PRANCHAS EDITORIAIS AUTOCONTIDAS (Ocupação Nobre de 90% da Página A4)
     ==================================================================== */
  .prancha {
    page-break-before: always !important;
    break-before: page !important;
    page-break-after: avoid !important;
    break-after: avoid !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    height: 210mm !important;
    min-height: 210mm !important;
    max-height: 210mm !important;
    width: 297mm !important;
    max-width: 297mm !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    box-sizing: border-box !important;
    padding: 10mm 13mm !important;
    overflow: hidden !important;
    background-color: #09090b !important;
  }

  .prancha:first-of-type {
    page-break-before: avoid !important;
    break-before: avoid !important;
  }

  .prancha > section,
  .prancha > .visual-block,
  .prancha > div,
  .prancha > .card-prancha {
    width: 100% !important;
    max-width: none !important;
    height: 100% !important;
    max-height: 100% !important;
    margin: 0 !important;
    box-sizing: border-box !important;
  }

  /* Card de Prancha Editorial (Preenche 100% da área útil = 90% da folha) */
  .card-prancha {
    background-color: #18181b !important;
    border: 1px solid #27272a !important;
    border-radius: 16px !important;
    padding: 20px 26px !important;
    height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    box-sizing: border-box !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4) !important;
    overflow: hidden !important;
  }

  /* Bloco Visual (Página 2 — Slide Hero Ocupando 90% da Página) */
  .visual-block {
    page-break-before: avoid !important;
    break-before: avoid !important;
    page-break-after: avoid !important;
    break-after: avoid !important;
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    background: #18181b !important;
    border: 1px solid #27272a !important;
    border-radius: 20px !important;
    padding: 24px 30px !important;
    margin: 0 !important;
    display: grid !important;
    grid-template-columns: 1.15fr 1fr !important;
    gap: 36px !important;
    align-items: stretch !important;
    box-sizing: border-box !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
    width: 100% !important;
    height: 100% !important;
    min-height: 100% !important;
    max-height: 100% !important;
    overflow: hidden !important;
  }

  .visual-media {
    width: 100% !important;
    height: 100% !important;
    min-height: 100% !important;
    max-height: none !important;
    border-radius: 16px !important;
    overflow: hidden !important;
    background: #09090b !important;
    border: 1px solid #27272a !important;
    display: flex !important;
  }

  .visual-media img,
  .visual-image {
    width: 100% !important;
    height: 100% !important;
    min-height: 100% !important;
    max-height: none !important;
    object-fit: cover !important;
    object-position: center !important;
    display: block !important;
    border-radius: 14px !important;
  }

  .visual-content {
    display: flex !important;
    flex-direction: column !important;
    height: 100% !important;
    padding: 0 !important;
    box-sizing: border-box !important;
  }

  .visual-content .meta-header {
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
    margin-bottom: 14px !important;
    flex-shrink: 0 !important;
  }

  .visual-content .step-pill {
    background: #be123c !important;
    color: #ffffff !important;
    font-size: 13px !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    padding: 5px 14px !important;
    border-radius: 9999px !important;
  }

  .visual-content .tag-badge {
    background: rgba(245, 158, 11, 0.15) !important;
    color: #fcd34d !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    padding: 5px 12px !important;
    border-radius: 8px !important;
    border: 1px solid rgba(245, 158, 11, 0.35) !important;
  }

  .visual-content .visual-title {
    font-family: 'Outfit', sans-serif !important;
    font-size: 28px !important;
    line-height: 1.2 !important;
    font-weight: 800 !important;
    color: #ffffff !important;
    margin: 0 0 12px 0 !important;
    flex-shrink: 0 !important;
  }

  .visual-content .visual-subtitle {
    font-size: 17.5px !important;
    line-height: 1.35 !important;
    font-weight: 600 !important;
    color: #fbbf24 !important;
    margin: 0 0 16px 0 !important;
    flex-shrink: 0 !important;
  }

  .visual-content .visual-desc {
    font-size: 15.5px !important;
    line-height: 1.6 !important;
    color: #d4d4d8 !important;
    margin: 0 !important;
    flex-shrink: 0 !important;
  }

  .visual-content .pro-tip {
    display: flex !important;
    align-items: flex-start !important;
    gap: 14px !important;
    background: rgba(245, 158, 11, 0.09) !important;
    border: 1px solid rgba(245, 158, 11, 0.3) !important;
    border-radius: 12px !important;
    padding: 16px 20px !important;
    margin-top: auto !important; /* Pushes to exact bottom of column */
    box-sizing: border-box !important;
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    flex-shrink: 0 !important;
  }

  .visual-content .tip-icon {
    font-size: 1.5rem !important;
    line-height: 1 !important;
    flex-shrink: 0 !important;
  }

  .visual-content .tip-content {
    font-size: 13.5px !important;
    color: #fef08a !important;
    line-height: 1.5 !important;
  }

  .visual-content .tip-content strong {
    color: #f59e0b !important;
    font-weight: 700 !important;
  }

  /* Cards de Seção */
  section:not(.capa-modulo) {
    background-color: #18181b !important;
    border: 1px solid #27272a !important;
    border-radius: 16px !important;
    padding: 20px 26px !important;
    margin: 0 !important;
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    box-sizing: border-box !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4) !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    width: 100% !important;
    height: 100% !important;
    overflow: hidden !important;
  }

  /* Sub-cards dentro das seções */
  .step-block {
    background-color: #121215 !important;
    border: 1px solid #27272a !important;
    border-radius: 12px !important;
    padding: 12px 16px !important;
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    box-sizing: border-box !important;
  }

  /* Layout Editorial Split (Duas colunas reais em paisagem: 58% texto / 42% mídia) */
  .editorial-split {
    display: flex !important;
    flex-direction: row !important;
    align-items: stretch !important;
    gap: 24px !important;
    width: 100% !important;
    height: 100% !important;
    flex: 1 1 auto !important;
    min-height: 0 !important;
    box-sizing: border-box !important;
  }

  .editorial-split.items-start {
    align-items: stretch !important;
  }

  .editorial-split.reverse {
    flex-direction: row-reverse !important;
  }

  .editorial-col-text {
    flex: 0 0 58% !important;
    width: 58% !important;
    max-width: 58% !important;
    min-width: 0 !important;
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    box-shadow: none !important;
    box-sizing: border-box !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: flex-start !important;
    gap: 12px !important;
    height: 100% !important;
    min-height: 0 !important;
  }

  .editorial-col-media {
    flex: 0 0 calc(42% - 24px) !important;
    width: calc(42% - 24px) !important;
    max-width: calc(42% - 24px) !important;
    min-width: 0 !important;
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    box-shadow: none !important;
    box-sizing: border-box !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    height: 100% !important;
    min-height: 0 !important;
  }

  /* Grid Simétrico de Equipamentos (Seção 3) */
  .secao-equipamentos {
    display: flex !important;
    flex-direction: column !important;
    justify-content: flex-start !important;
    gap: 10px !important;
    height: 100% !important;
  }

  .equipamentos-grid {
    display: flex !important;
    flex-direction: row !important;
    gap: 18px !important;
    align-items: stretch !important;
    width: 100% !important;
    flex: 1 1 auto !important;
    min-height: 0 !important;
  }

  .equipamentos-cards {
    flex: 0 0 58% !important;
    width: 58% !important;
    max-width: 58% !important;
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 10px !important;
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    box-shadow: none !important;
    height: 100% !important;
  }

  .equipamentos-media {
    flex: 0 0 calc(42% - 18px) !important;
    width: calc(42% - 18px) !important;
    max-width: calc(42% - 18px) !important;
    display: flex !important;
    flex-direction: column !important;
    height: 100% !important;
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    box-shadow: none !important;
  }

  .equipamentos-media .editorial-image-card {
    height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
  }

  .equipamentos-media .editorial-image-card img {
    height: 100% !important;
    flex: 1 1 auto !important;
    min-height: 0 !important;
    max-height: none !important;
    width: 100% !important;
    object-fit: cover !important;
  }

  .editorial-image-card {
    border-radius: 12px !important;
    overflow: hidden !important;
    border: 1px solid #27272a !important;
    background: #09090b !important;
    width: 100% !important;
    height: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
  }

  .editorial-image-card img {
    width: 100% !important;
    height: 100% !important;
    flex: 1 1 auto !important;
    min-height: 0 !important;
    max-height: none !important;
    object-fit: cover !important;
    display: block !important;
  }

  .editorial-image-caption {
    padding: 7px 12px !important;
    font-size: 11px !important;
    color: #a1a1aa !important;
    text-align: center !important;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
    background-color: #121215 !important;
    border-top: 1px solid #27272a !important;
    flex-shrink: 0 !important;
  }

  /* Componentes Semânticos Ricos das Pranchas (Tipografia A4 Robusta) */
  .secao-titulo {
    font-family: 'Outfit', sans-serif !important;
    font-size: 25px !important;
    line-height: 1.2 !important;
    font-weight: 800 !important;
    color: #ffffff !important;
    margin-bottom: 4px !important;
  }

  .secao-intro {
    font-size: 14.5px !important;
    line-height: 1.55 !important;
    color: #d4d4d8 !important;
    margin-bottom: 4px !important;
  }

  .subtitulo-destaque {
    font-size: 13px !important;
    font-weight: 700 !important;
    letter-spacing: 0.05em !important;
    text-transform: uppercase !important;
    color: #fbbf24 !important;
    margin-bottom: 6px !important;
  }

  .destaque-tag {
    font-size: 12px !important;
    font-weight: 700 !important;
    letter-spacing: 0.05em !important;
    text-transform: uppercase !important;
    color: #fbbf24 !important;
    margin-bottom: 6px !important;
  }

  .lista-topicos {
    list-style: none !important;
    padding: 0 !important;
    margin: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-evenly !important;
    flex: 1 1 auto !important;
    gap: 8px !important;
  }

  .lista-topicos li {
    display: flex !important;
    align-items: flex-start !important;
    gap: 8px !important;
    font-size: 14px !important;
    line-height: 1.45 !important;
    color: #e4e4e7 !important;
  }

  .marcador-amber {
    color: #f59e0b !important;
    font-weight: 900 !important;
    font-size: 16px !important;
    flex-shrink: 0 !important;
  }

  .secao-fechamento {
    font-size: 13.5px !important;
    line-height: 1.5 !important;
    color: #a1a1aa !important;
    margin-top: 14px !important;
    padding-top: 0 !important;
  }

  /* Expansão vertical para Seção 1 (Lógica Inversa) */
  .destaque-logica {
    flex: 1 1 auto !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-evenly !important;
    margin: 8px 0 !important;
  }

  /* Expansão vertical inteligente para Seção 2 (Quadrantes) */
  .quadrantes-grid {
    flex: 1 1 auto !important;
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 14px !important;
    margin-top: 8px !important;
  }

  .quadrantes-grid .subcard-item {
    height: 100% !important;
    padding: 16px 20px !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
  }

  /* Ajustes específicos de alta densidade: Seção 5 (Sabores) */
  .secao-sabores .cards-sabores {
    gap: 8px !important;
    margin: 6px 0 !important;
  }
  .secao-sabores .subcard-item {
    padding: 10px 14px !important;
  }
  .secao-sabores .secao-intro {
    font-size: 13.5px !important;
    margin-bottom: 3px !important;
  }
  .secao-sabores .subtitulo-destaque {
    font-size: 12px !important;
    margin-bottom: 4px !important;
  }
  .secao-sabores .secao-fechamento {
    font-size: 12px !important;
    line-height: 1.4 !important;
    margin-top: 6px !important;
  }

  /* Ajustes específicos de alta densidade: Seção 4 (Embalagens) */
  .secao-embalagem .subcard-item {
    padding: 8px 14px !important;
  }
  .secao-embalagem .subcard-titulo {
    font-size: 12.5px !important;
    margin-bottom: 2px !important;
  }
  .secao-embalagem .subcard-texto {
    font-size: 11.5px !important;
    line-height: 1.35 !important;
  }
  .secao-embalagem .subcard-mini {
    padding: 6px 10px !important;
  }

  /* Ajustes específicos de alta densidade: Seção 6 (Higiene) */
  .secao-higiene .secao-intro {
    font-size: 13px !important;
    margin-bottom: 4px !important;
  }
  .secao-higiene .subcard-item {
    padding: 8px 12px !important;
  }
  .secao-higiene .subcard-titulo {
    font-size: 12px !important;
    margin-bottom: 2px !important;
  }
  .secao-higiene .subcard-texto {
    font-size: 11px !important;
    line-height: 1.35 !important;
  }
  .secao-higiene .manutencao-card {
    padding: 8px 12px !important;
  }
  .secao-higiene .manutencao-titulo {
    font-size: 11.5px !important;
  }
  .secao-higiene .manutencao-intro {
    font-size: 10.5px !important;
  }
  .secao-higiene .manutencao-lista {
    font-size: 10px !important;
    line-height: 1.35 !important;
  }
  .secao-higiene .callout-alerta {
    padding: 8px 14px !important;
    margin: 0 !important;
  }

  .subcard-item {
    background-color: #121215 !important;
    border: 1px solid #27272a !important;
    border-radius: 12px !important;
    padding: 14px 18px !important;
    box-sizing: border-box !important;
    flex: 1 1 auto !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
  }

  .subcard-titulo {
    font-size: 13.5px !important;
    font-weight: 700 !important;
    color: #f4f4f5 !important;
    margin-bottom: 4px !important;
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
  }

  .subcard-texto {
    font-size: 12.5px !important;
    line-height: 1.45 !important;
    color: #a1a1aa !important;
    margin: 0 !important;
  }

  .subcard-mini {
    background-color: #18181b !important;
    border: 1px solid #27272a !important;
    border-radius: 10px !important;
    padding: 8px 12px !important;
    box-sizing: border-box !important;
  }

  .badge-tag {
    font-family: ui-monospace, monospace !important;
    font-size: 10.5px !important;
    padding: 3px 8px !important;
    border-radius: 5px !important;
    font-weight: 700 !important;
  }

  .badge-tag.amber {
    color: #fbbf24 !important;
    background: rgba(245, 158, 11, 0.15) !important;
    border: 1px solid rgba(245, 158, 11, 0.35) !important;
  }

  .badge-tag.emerald {
    color: #34d399 !important;
    background: rgba(16, 185, 129, 0.15) !important;
    border: 1px solid rgba(16, 185, 129, 0.35) !important;
  }

  .badge-tag.zinc {
    color: #d4d4d8 !important;
    background: #18181b !important;
    border: 1px solid #3f3f46 !important;
  }

  .flavor-badge {
    height: 28px !important;
    width: 28px !important;
    border-radius: 50% !important;
    background: rgba(245, 158, 11, 0.2) !important;
    color: #fbbf24 !important;
    font-weight: 800 !important;
    font-size: 13px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
    border: 1px solid rgba(245, 158, 11, 0.4) !important;
  }

  .alerta-nao-comprar {
    border: 1px solid rgba(244, 63, 94, 0.3) !important;
    background: rgba(244, 63, 94, 0.08) !important;
    border-radius: 12px !important;
    padding: 10px 16px !important;
    box-sizing: border-box !important;
  }

  .alerta-titulo {
    font-size: 12.5px !important;
    font-weight: 700 !important;
    color: #fda4af !important;
    margin-bottom: 4px !important;
    display: flex !important;
    align-items: center !important;
    gap: 6px !important;
  }

  .alerta-itens-grid {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 12px !important;
    font-size: 11px !important;
    color: #f4f4f5 !important;
    line-height: 1.4 !important;
  }

  .manutencao-card {
    background-color: #121215 !important;
    border: 1px solid #27272a !important;
    border-radius: 12px !important;
    padding: 10px 14px !important;
    box-sizing: border-box !important;
  }

  .manutencao-titulo {
    font-size: 12px !important;
    font-weight: 700 !important;
    color: #fbbf24 !important;
    margin-bottom: 3px !important;
    display: flex !important;
    align-items: center !important;
    gap: 5px !important;
  }

  .manutencao-intro {
    font-size: 11px !important;
    line-height: 1.4 !important;
    color: #d4d4d8 !important;
    margin-bottom: 4px !important;
  }

  .manutencao-lista {
    list-style: disc !important;
    padding-left: 14px !important;
    margin: 0 0 4px 0 !important;
    font-size: 11px !important;
    line-height: 1.4 !important;
    color: #a1a1aa !important;
  }

  .manutencao-beneficio {
    font-size: 10.5px !important;
    line-height: 1.35 !important;
    color: #fbbf24 !important;
    margin: 0 !important;
  }

  section:not(.capa-modulo) ul {
    margin-bottom: 6px !important;
  }

  section:not(.capa-modulo) li {
    font-size: 14px !important;
    line-height: 1.5 !important;
  }

  /* Checklist Operacional (Página Dedicada 2 Colunas) */
  .checklist-operacional {
    page-break-before: avoid !important;
    break-before: avoid !important;
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    background-color: #18181b !important;
    border: 1px solid #27272a !important;
    border-radius: 16px !important;
    padding: 24px 28px !important;
    margin: 0 !important;
    width: 100% !important;
    box-sizing: border-box !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4) !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: flex-start !important;
    gap: 16px !important;
  }

  .checklist-operacional .checklist-header {
    margin-bottom: 8px !important;
  }

  .checklist-operacional ul {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 10px 16px !important;
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    margin: 0 !important;
    padding: 0 !important;
    flex: 1 1 auto !important;
    align-content: space-evenly !important;
  }

  .checklist-operacional li {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    padding: 12px 15px !important;
    margin: 0 !important;
    font-size: 13.5px !important;
    line-height: 1.35 !important;
    border-radius: 10px !important;
    background: #121215 !important;
    border: 1px solid #27272a !important;
    display: flex !important;
    align-items: center !important;
  }

  .checklist-operacional li .item-text {
    font-size: 13.5px !important;
    line-height: 1.3 !important;
    font-weight: 600 !important;
  }

  .checklist-operacional li p {
    font-size: 12px !important;
    line-height: 1.3 !important;
    margin-top: 3px !important;
    color: #a1a1aa !important;
  }

  /* Tabelas Técnicas */
  .tabela-tecnica {
    background-color: #18181b !important;
    border: 1px solid #27272a !important;
    border-radius: 16px !important;
    padding: 16px 22px !important;
    margin: 0 !important;
    width: 100% !important;
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    box-sizing: border-box !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: flex-start !important;
    gap: 8px !important;
  }

  .tabela-tecnica table {
    width: 100% !important;
    border-collapse: collapse !important;
    flex: 1 1 auto !important;
  }

  .tabela-tecnica tbody tr {
    height: auto !important;
  }

  .tabela-tecnica th {
    padding: 8px 14px !important;
    font-size: 12px !important;
    font-weight: 700 !important;
  }

  .tabela-tecnica td {
    padding: 7px 14px !important;
    font-size: 12px !important;
    line-height: 1.35 !important;
  }

  table {
    width: 100% !important;
    border-collapse: collapse !important;
  }

  thead {
    display: table-header-group !important;
  }

  tr {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  th, td {
    padding: 10px 14px !important;
    font-size: 13.5px !important;
    line-height: 1.4 !important;
  }

  .callout-alerta {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    border-radius: 12px !important;
    padding: 14px 18px !important;
    margin: 14px 0 !important;
    box-sizing: border-box !important;
  }

  .card-elegant {
    break-inside: avoid !important;
    page-break-inside: avoid !important;
  }

  /* Cores de Destaque */
  .bg-charcoal-950 { background-color: #09090b !important; }
  .bg-charcoal-900 { background-color: #18181b !important; }
  .bg-charcoal-800 { background-color: #27272a !important; }
  .border-charcoal-800 { border-color: #27272a !important; }
  .text-zinc-100 { color: #f4f4f5 !important; }
  .text-zinc-300 { color: #d4d4d8 !important; }
  .text-zinc-400 { color: #a1a1aa !important; }
  .text-amber-400 { color: #fbbf24 !important; }
  .text-amber-500 { color: #f59e0b !important; }
</style>
`;

  if (html.includes('</head>')) {
    html = html.replace('</head>', `${estiloInjetado}\n</head>`);
  } else {
    html = estiloInjetado + html;
  }

  return html;
}

async function main() {
  console.log('='.repeat(70));
  console.log('📑 GERADOR DE FASCÍCULOS MODULARES EM PDF (PUPPETEER)');
  console.log(`📁 Pasta Principal: ${OUTPUT_DIR}`);
  console.log(`📁 Pasta Secundária: ${DIST_OUTPUT_DIR}`);
  console.log('='.repeat(70));

  // Garantir diretórios de saída
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(DIST_OUTPUT_DIR)) {
    fs.mkdirSync(DIST_OUTPUT_DIR, { recursive: true });
  }

  // Filtrar se o usuário passou id específico via CLI: node scripts/gerar-pdfs.js protocolo-1
  const argFiltro = process.argv[2]?.toLowerCase();
  const listaParaGerar = (argFiltro && argFiltro !== 'all')
    ? MODULOS_PDF.filter(m => m.id.includes(argFiltro) || m.nomeArquivo.toLowerCase().includes(argFiltro))
    : MODULOS_PDF;

  if (listaParaGerar.length === 0) {
    console.warn(`⚠️ Nenhum módulo encontrado com o filtro: "${argFiltro}".`);
    console.log(`Módulos disponíveis: ${MODULOS_PDF.map(m => m.id).join(', ')}`);
    return;
  }

  console.log(`\nIniciando geração de ${listaParaGerar.length} fascículo(s) em PDF com Dark Theme forçado e imagens embutidas...\n`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });
  } catch (err) {
    console.error('❌ Falha ao iniciar o navegador Chromium via Puppeteer:', err.message);
    process.exit(1);
  }

  let sucessos = 0;
  let falhas = 0;

  for (let i = 0; i < listaParaGerar.length; i++) {
    const item = listaParaGerar[i];
    const relativePath = item.path.replace(/^\//, '');
    const arquivoDist = path.join(ROOT_DIR, 'dist', relativePath, 'index.html');

    if (!fs.existsSync(arquivoDist)) {
      console.warn(`⚠️ Arquivo HTML estático não encontrado em dist/${relativePath}/index.html. Execute 'npm run build' primeiro.`);
      falhas++;
      continue;
    }

    const caminhoDestino = path.join(OUTPUT_DIR, item.nomeArquivo);
    const progresso = `[${i + 1}/${listaParaGerar.length}]`;

    console.log(`----------------------------------------------------------------------`);
    console.log(`${progresso} 📄 Gerando PDF: ${item.titulo}`);
    console.log(`     Origem: dist/${relativePath}/index.html (HTML + CSS inlined + Base64 PNGs)`);
    console.log(`     Arquivo: pdfs/${item.nomeArquivo}`);

    const tempoInicio = Date.now();

    try {
      console.log('     ⏱️ [1/6] Criando nova página no navegador...');
      const page = await browser.newPage();

      // Ajustar viewport padrão A4 Paisagem (Horizontal Widescreen)
      await page.setViewport({ width: 1754, height: 1240, deviceScaleFactor: 2 });

      // Preparar HTML com injeção forçada de Dark Theme, CSS Tailwind e Imagens Base64
      console.log('     ⏱️ [2/6] Injetando CSS e convertendo imagens para Base64...');
      const htmlProcessado = prepararHtmlParaPdf(arquivoDist);

      // Carregar o HTML totalmente embutido
      console.log('     ⏱️ [3/6] Carregando HTML no Puppeteer...');
      await page.setContent(htmlProcessado, {
        waitUntil: 'domcontentloaded',
        timeout: 25000
      });

      // Forçar tema escuro no documento e classes Tailwind
      console.log('     ⏱️ [4/6] Aplicando dark theme forçado...');
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
        document.body.classList.add('bg-[#0f1117]', 'text-slate-100');
        document.body.style.backgroundColor = '#0f1117';
        document.body.style.color = '#f1f5f9';
      });

      // Aguardar renderização de fontes com timeout de segurança
      console.log('     ⏱️ [5/6] Aguardando fontes...');
      await page.evaluate(() => Promise.race([
        document.fonts.ready,
        new Promise(resolve => setTimeout(resolve, 2000))
      ])).catch(() => {});

      // Gerar PDF no formato A4 Paisagem (Horizontal) com margem zero no motor (adeus bordas brancas)
      console.log('     ⏱️ [6/6] Renderizando PDF final via Chromium printToPDF...');
      await page.pdf({
        path: caminhoDestino,
        format: 'A4',
        landscape: true,
        printBackground: true,
        preferCSSPageSize: true,
        timeout: 60000,
        margin: {
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px'
        }
      });

      // Espelhar também para dist/pdfs/ por conveniência
      try {
        fs.copyFileSync(caminhoDestino, path.join(DIST_OUTPUT_DIR, item.nomeArquivo));
      } catch (e) {}

      await page.close();

      const stats = fs.statSync(caminhoDestino);
      const tamanhoMB = (stats.size / (1024 * 1024)).toFixed(2);
      const duracao = ((Date.now() - tempoInicio) / 1000).toFixed(1);

      console.log(`     ✅ PDF gerado com sucesso! (${tamanhoMB} MB | ${duracao}s)`);
      console.log(`     ✨ Capa na Página 1 + Quebra limpa para conteúdo técnico + Dark Theme forçado`);
      sucessos++;
    } catch (erro) {
      falhas++;
      console.error(`     ❌ Erro ao exportar ${item.nomeArquivo}:`, erro.stack || erro.message);
    }
  }

  await browser.close();

  console.log('\n' + '='.repeat(70));
  console.log(`🏁 Concluído! Sucessos: ${sucessos} | Falhas: ${falhas}`);
  console.log(`📁 PDFs salvos em: pdfs/ e dist/pdfs/`);
  console.log('='.repeat(70) + '\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error('❌ Erro fatal no script:', err);
    process.exit(1);
  });
}
