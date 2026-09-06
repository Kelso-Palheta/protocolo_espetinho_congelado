import { fal } from '@fal-ai/client';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 1. Carregar variáveis de ambiente do .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'src', 'assets', 'illustrations');

// Validar chave FAL_KEY
const falKey = process.env.FAL_KEY;
if (!falKey || falKey === 'sua_chave_aqui') {
  console.error('\n❌ [ERRO DE CONFIGURAÇÃO] FAL_KEY não configurada.');
  console.error('Por favor, adicione sua chave válida no arquivo .env:');
  console.error('  FAL_KEY=f4l_...\n');
  console.error('Você pode obter sua chave em: https://fal.ai/dashboard/keys\n');
  process.exit(1);
}

// Configurar cliente fal.ai
fal.config({
  credentials: falKey
});

// 2. Definir estilo base e prompts fotográficos profissionais
const BASE_STYLE = [
  'masterclass barbecue food photography',
  'dark natural slate stone background',
  'dramatic warm side lighting from glowing charcoal embers',
  'extreme macro lens close-up',
  'crisp depth of field',
  'hyperrealistic texture',
  'gourmet culinary presentation',
  'photorealistic 4k resolution',
  'no text',
  'no watermark',
  'no logo',
  'no blur'
].join(', ');

const ILUSTRACOES = [
  {
    id: 'protocolo-1-preparacao',
    nomeArquivo: 'protocolo-1-preparacao.png',
    descricao: 'Protocolo 1: Estrutura Mínima de Produção (Bancada, Balança e Facas)',
    prompt: `Professional home prep station for artisanal skewers, clean dark granite and slate countertop, heavy sharp chef knife, precision digital scale displaying meat cubes, seasoned prime beef rump cubes, natural bamboo skewers, vacuum seal bags, warm side ember glow, dramatic shadows, ${BASE_STYLE}`
  },
  {
    id: 'protocolo-2-producao',
    nomeArquivo: 'protocolo-2-producao.png',
    descricao: 'Protocolo 2: Produção e Corte Perpendicular de Carne',
    prompt: `Butcher chef slicing raw prime flank steak strictly against the meat grain on dark slate board, 3cm uniform cubes, marbling visible, dry salt and herbs seasoning, warm lateral amber glow, ${BASE_STYLE}`
  },
  {
    id: 'protocolo-3-padronizacao',
    nomeArquivo: 'protocolo-3-padronizacao.png',
    descricao: 'Protocolo 3: Padronização Milimétrica (100g Padrão Ouro)',
    prompt: `Artisanal beef skewers neatly aligned side by side on dark stone board, identical geometric size, precision digital scale nearby, clean bamboo sticks with 7cm grip, amber rim lighting, ${BASE_STYLE}`
  },
  {
    id: 'protocolo-4-congelamento',
    nomeArquivo: 'protocolo-4-congelamento.png',
    descricao: 'Protocolo 4: Pré-Congelamento Aberto (IQF) e Vácuo',
    prompt: `Individual quick freezing process for beef skewers on chilled metal tray at -18C, delicate microscopic frost crystals on meat fibers, vacuum sealed packs with protective tip covers, slate background, ${BASE_STYLE}`
  },
  {
    id: 'protocolo-5-precificacao',
    nomeArquivo: 'protocolo-5-precificacao.png',
    descricao: 'Protocolo 5: Precificação e Ficha Técnica de Lucro',
    prompt: `Gastronomic culinary cost sheet and notebook on dark slate butcher table, fresh meat cubes on scale, bamboo skewers, vacuum bag, calculating real unit cost, warm ambient lighting, ${BASE_STYLE}`
  },
  {
    id: 'protocolo-6-oferta',
    nomeArquivo: 'protocolo-6-oferta.png',
    descricao: 'Protocolo 6: Kits e Combos de Churrasco em Família',
    prompt: `Gourmet barbecue family combo pack presentation, raw seasoned beef skewers, bacon-wrapped chicken medallions, and artisanal sausage, vacuum sealed, elegant slate background, ${BASE_STYLE}`
  },
  {
    id: 'protocolo-7-venda',
    nomeArquivo: 'protocolo-7-venda.png',
    descricao: 'Protocolo 7: Venda Direta e Entrega Local',
    prompt: `Smartphone displaying WhatsApp order next to packaged artisanal vacuum sealed frozen skewers ready for delivery, thermal delivery bag, dark rustic backdrop, warm lighting, ${BASE_STYLE}`
  },
  {
    id: 'bonus-1-delivery',
    nomeArquivo: 'bonus-1-delivery.png',
    descricao: 'Bônus 1: Logística de Delivery Frio e Caixas Isotérmicas',
    prompt: `Thermal insulated delivery cooler packed with vacuum-sealed frozen skewers and reusable ice packs at -18C, pristine presentation, dark slate board, amber side lighting, ${BASE_STYLE}`
  },
  {
    id: 'bonus-2-recompra',
    nomeArquivo: 'bonus-2-recompra.png',
    descricao: 'Bônus 2: Protocolo da Recompra e Clientes Recorrentes',
    prompt: `Happy customer unboxing premium artisanal vacuum-sealed beef skewers at home for family barbecue, grilled skewers sizzling in background, warm golden hour light, ${BASE_STYLE}`
  },
  {
    id: 'bonus-3-crescimento',
    nomeArquivo: 'bonus-3-crescimento.png',
    descricao: 'Bônus 3: Expansão Consciente e Segundo Freezer',
    prompt: `Organized professional home freezer chest stocked with labelled vacuum-sealed skewer packs sorted by type, clean hygienic setup, cool blue interior light with warm ambient contrast, ${BASE_STYLE}`
  },
  {
    id: 'bonus-4-plano-7-dias',
    nomeArquivo: 'bonus-4-plano-7-dias.png',
    descricao: 'Bônus 4: Plano Prático Primeiros 7 Dias',
    prompt: `Step-by-step culinary preparation roadmap, calendar and kitchen prep station, skewers on scale, knife and cutting board, warm ember lighting, ${BASE_STYLE}`
  },
  {
    id: 'modulo-whatsapp-vendas',
    nomeArquivo: 'modulo-whatsapp-vendas.png',
    descricao: 'Módulo Liberado 1: Kit WhatsApp Que Vende',
    prompt: `Smartphone resting on dark rustic wood counter with message showing confirmed barbecue kit order, fresh vacuum-sealed skewer packs nearby, glowing warm ambiance, ${BASE_STYLE}`
  },
  {
    id: 'modulo-cardapio-visual',
    nomeArquivo: 'modulo-cardapio-visual.png',
    descricao: 'Módulo Liberado 2: Kit Cardápio & Comunicação Visual',
    prompt: `Top-down view of culinary food photography setup, smartphone taking macro shot of sizzling glazed beef skewer on rustic slate board, professional composition, ${BASE_STYLE}`
  },
  {
    id: 'hero-banner',
    nomeArquivo: 'hero-banner.png',
    descricao: 'Banner Principal do E-book',
    prompt: `Epic hero shot of premium artisanal beef skewers (espetinho) sizzling over glowing red coals, delicate aromatic smoke wisps, dark slate textured board, warm ambient ember glow, ${BASE_STYLE}`
  },

  // ==========================================
  // CAPAS MODULARES EDITORIAIS (DARK STEAKHOUSE)
  // ==========================================
  {
    id: 'capa-protocolo-1',
    nomeArquivo: 'capa-protocolo-1.png',
    descricao: 'Capa Editorial: Protocolo 1 (Bancada Limpa e Faca Profissional)',
    prompt: `Editorial dark steakhouse book cover, pristine stainless steel and dark slate prep table, professional heavy Japanese chef knife with reflection, digital scale displaying prime meat cubes, bamboo skewers, glowing embers side light, cinematic atmosphere, 8k resolution, ${BASE_STYLE}`
  },
  {
    id: 'capa-protocolo-2',
    nomeArquivo: 'capa-protocolo-2.png',
    descricao: 'Capa Editorial: Protocolo 2 (Produção e Corte Perpendicular)',
    prompt: `Editorial dark steakhouse book cover, master butcher hands precision-cutting raw flank steak against the grain on charcoal stone block, uniform 3cm cubes, coarse sea salt flakes, artisan cleaver knife, warm ember rim light, 8k resolution, ${BASE_STYLE}`
  },
  {
    id: 'capa-protocolo-3',
    nomeArquivo: 'capa-protocolo-3.png',
    descricao: 'Capa Editorial: Protocolo 3 (Padronização e Balança)',
    prompt: `Editorial dark steakhouse book cover, array of perfectly standardized raw beef skewers aligned in military precision on slate, digital scale displaying 100g, glowing embers, high contrast luxury culinary aesthetic, 8k resolution, ${BASE_STYLE}`
  },
  {
    id: 'capa-protocolo-4',
    nomeArquivo: 'capa-protocolo-4.png',
    descricao: 'Capa Editorial: Protocolo 4 (Pré-Congelamento IQF e Vácuo)',
    prompt: `Editorial dark steakhouse book cover, chilled stainless steel tray with individual quick frozen skewers glistening with micro ice crystals at -18C, vacuum sealing machine and crystal-clear vacuum packs, cold blue and warm ember contrast, 8k resolution, ${BASE_STYLE}`
  },
  {
    id: 'capa-protocolo-5',
    nomeArquivo: 'capa-protocolo-5.png',
    descricao: 'Capa Editorial: Protocolo 5 (Precificação e Custo Real)',
    prompt: `Editorial dark steakhouse book cover, executive culinary financial ledger notebook and calculator next to prime marbled beef cuts and digital scale on dark granite, coins and butcher knife, warm ambient studio lighting, 8k resolution, ${BASE_STYLE}`
  },
  {
    id: 'capa-protocolo-6',
    nomeArquivo: 'capa-protocolo-6.png',
    descricao: 'Capa Editorial: Protocolo 6 (Kits e Combos de Família)',
    prompt: `Editorial dark steakhouse book cover, grand feast presentation of gourmet barbecue combos, vacuum-sealed packs of beef, bacon-wrapped chicken and artisanal sausage on rustic slate board with rosemary and salt, glowing embers, 8k resolution, ${BASE_STYLE}`
  },
  {
    id: 'capa-protocolo-7',
    nomeArquivo: 'capa-protocolo-7.png',
    descricao: 'Capa Editorial: Protocolo 7 (Venda e Divulgação Local)',
    prompt: `Editorial dark steakhouse book cover, smartphone on dark wood counter displaying WhatsApp conversation next to packaged frozen artisanal skewers ready for customer delivery, thermal delivery cooler in background, warm ambient light, 8k resolution, ${BASE_STYLE}`
  },
  {
    id: 'capa-bonus-1',
    nomeArquivo: 'capa-bonus-1.png',
    descricao: 'Capa Editorial: Bônus 1 (Operação e Delivery Frio)',
    prompt: `Editorial dark steakhouse book cover, professional thermal insulated delivery cooler bag opened to reveal vacuum-sealed frozen skewers arranged with reusable blue ice packs at -18C, dark atmospheric backdrop, 8k resolution, ${BASE_STYLE}`
  },
  {
    id: 'capa-bonus-2',
    nomeArquivo: 'capa-bonus-2.png',
    descricao: 'Capa Editorial: Bônus 2 (Protocolo da Recompra)',
    prompt: `Editorial dark steakhouse book cover, warm convivial family barbecue scene, wooden platter heaped with sizzling caramelized golden-brown skewers, juice glistening, ember smoke, celebratory mood, 8k resolution, ${BASE_STYLE}`
  },
  {
    id: 'capa-bonus-3',
    nomeArquivo: 'capa-bonus-3.png',
    descricao: 'Capa Editorial: Bônus 3 (Crescimento e Expansão)',
    prompt: `Editorial dark steakhouse book cover, pristine commercial chest freezer with organized baskets holding labeled vacuum-sealed skewer packages, clean interior lighting with warm charcoal ambient contrast, 8k resolution, ${BASE_STYLE}`
  },
  {
    id: 'capa-bonus-4',
    nomeArquivo: 'capa-bonus-4.png',
    descricao: 'Capa Editorial: Bônus 4 (Plano Primeiros 7 Dias)',
    prompt: `Editorial dark steakhouse book cover, a clean 7-day operational roadmap notebook and timer on dark kitchen butcher island, chef knife, skewers and scale, warm focus on immediate execution, 8k resolution, ${BASE_STYLE}`
  },
  {
    id: 'capa-modulo-whatsapp-vendas',
    nomeArquivo: 'capa-modulo-whatsapp-vendas.png',
    descricao: 'Capa Editorial: Módulo Liberado 1 (Kit WhatsApp Que Vende)',
    prompt: `Editorial dark steakhouse book cover, modern smartphone mockup resting on dark slate table displaying green WhatsApp sales chat and PIX payment confirmation screen, accompanied by vacuum-sealed gourmet skewers, golden ember glow, 8k resolution, ${BASE_STYLE}`
  },
  {
    id: 'capa-modulo-cardapio-visual',
    nomeArquivo: 'capa-modulo-cardapio-visual.png',
    descricao: 'Capa Editorial: Módulo Liberado 2 (Kit Cardápio & Comunicação Visual)',
    prompt: `Editorial dark steakhouse book cover, top-down editorial flatlay of smartphone camera capturing macro food shot of a succulent glistening grilled skewer on dark stone slab, color cards, gourmet menu templates on tablet screen, 8k resolution, ${BASE_STYLE}`
  }
];

// 3. Função auxiliar para download e gravação do arquivo
async function baixarESalvarImagem(url, destino) {
  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error(`Falha no download da imagem: HTTP ${resposta.status} ${resposta.statusText}`);
  }
  const arrayBuffer = await resposta.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.promises.writeFile(destino, buffer);
}

// 4. Execução principal com logs detalhados e tratamento de erros
async function main() {
  console.log('='.repeat(65));
  console.log('🔥 GERADOR DE ILUSTRAÇÕES IA - PROTOCOLO ESPETINHO CONGELADO');
  console.log('🤖 Modelo: fal-ai/flux/schnell (Alta Velocidade)');
  console.log(`📁 Destino: ${OUTPUT_DIR}`);
  console.log('='.repeat(65));

  // Garantir existência da pasta de saída
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`✨ Diretório criado: ${OUTPUT_DIR}\n`);
  }

  // Filtrar se o usuário passou id específico via terminal ou flag --force
  const args = process.argv.slice(2);
  const forceRegen = args.includes('--force');
  const argFiltro = args.find((a) => !a.startsWith('--'))?.toLowerCase();

  const listaFiltrada = argFiltro
    ? ILUSTRACOES.filter((item) => item.id.includes(argFiltro) || item.nomeArquivo.includes(argFiltro))
    : ILUSTRACOES;

  if (listaFiltrada.length === 0) {
    console.warn(`⚠️ Nenhuma ilustração encontrada para o filtro: "${argFiltro}".`);
    console.log(`Opções disponíveis: ${ILUSTRACOES.map((i) => i.id).join(', ')}`);
    return;
  }

  console.log(`\nVerificando acervo de ${listaFiltrada.length} ilustração(ões)...\n`);

  let sucessos = 0;
  let falhas = 0;
  let reaproveitadas = 0;

  for (let i = 0; i < listaFiltrada.length; i++) {
    const item = listaFiltrada[i];
    const destinoArquivo = path.join(OUTPUT_DIR, item.nomeArquivo);
    const progresso = `[${i + 1}/${listaFiltrada.length}]`;

    // 1. Verificar se a imagem já existe no disco
    if (fs.existsSync(destinoArquivo) && !forceRegen) {
      console.log(`${progresso} ⏭️ [JÁ EXISTE EM DISCO] ${item.nomeArquivo} (${item.descricao})`);
      reaproveitadas++;
      sucessos++;
      continue;
    }

    console.log(`-----------------------------------------------------------------`);
    console.log(`${progresso} 📸 Gerando via Fal.ai: ${item.descricao}`);
    console.log(`     Arquivo de Destino: ${item.nomeArquivo}`);
    console.log(`     Prompt: "${item.prompt.substring(0, 80)}..."`);

    const inicioTempo = Date.now();

    try {
      // Chamada obrigatória para o modelo fal-ai/flux/schnell
      const resultado = await fal.subscribe('fal-ai/flux/schnell', {
        input: {
          prompt: item.prompt,
          image_size: 'landscape_4_3',
          num_inference_steps: 4,
          enable_safety_checker: true
        },
        logs: false
      });

      const imagemInfo = resultado?.data?.images?.[0];
      if (!imagemInfo?.url) {
        throw new Error('A API fal.ai não retornou URL da imagem.');
      }

      console.log(`     ⬇️ Baixando imagem de: ${imagemInfo.url.substring(0, 50)}...`);
      await baixarESalvarImagem(imagemInfo.url, destinoArquivo);

      const duracao = ((Date.now() - inicioTempo) / 1000).toFixed(1);
      console.log(`     ✅ Salvo com sucesso em: ${destinoArquivo} (${duracao}s)`);
      sucessos++;
    } catch (erro) {
      falhas++;
      console.error(`     ❌ [ERRO] Falha ao processar "${item.nomeArquivo}":`);
      if (erro?.message) {
        console.error(`        Detalhe: ${erro.message}`);
      } else {
        console.error(`        Detalhe:`, erro);
      }
    }
  }

  console.log('\n' + '='.repeat(65));
  console.log(`🏁 Concluído! Geradas/Existentes: ${sucessos} (Novas: ${sucessos - reaproveitadas}, Em Disco: ${reaproveitadas}) | Falhas: ${falhas}`);
  console.log(`📁 Imagens salvas em: src/assets/illustrations/`);
  console.log('='.repeat(65) + '\n');
}

main().catch((err) => {
  console.error('❌ Erro fatal na execução do script:', err);
  process.exit(1);
});

