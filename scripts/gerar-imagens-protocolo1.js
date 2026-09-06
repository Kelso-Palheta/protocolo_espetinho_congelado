import { fal } from '@fal-ai/client';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'src', 'assets', 'illustrations');

const falKey = process.env.FAL_KEY;
if (!falKey) {
  console.error('❌ FAL_KEY não configurada no .env');
  process.exit(1);
}

fal.config({ credentials: falKey });

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
  'no logo'
].join(', ');

const NOVAS_IMAGENS = [
  {
    nomeArquivo: 'protocolo-1-cozinha-organizacao.png',
    descricao: 'Diagnóstico da Cozinha: Estação de Trabalho e Freezer Organizado',
    prompt: `Clean organized modern domestic kitchen prep station for barbecue skewers, stainless steel sink with antibacterial soap and paper towels on left, clean dark granite countertop on center, refrigerator freezer drawer organized on right, dark slate background, warm ember lighting, dramatic cinematic culinary lighting, ${BASE_STYLE}`
  },
  {
    nomeArquivo: 'protocolo-1-seladora-vacuo.png',
    descricao: 'Máquina Seladora a Vácuo e Saco Gofrado 0,18mm',
    prompt: `Close-up macro of a compact domestic vacuum sealing machine hermetically packaging raw beef skewers inside a 0.18mm textured embossed vacuum bag, airtight heat seal line, clean suction chamber, bamboo skewer tips protected, dark slate countertop, warm amber side lighting, ${BASE_STYLE}`
  },
  {
    nomeArquivo: 'protocolo-1-trio-sabores.png',
    descricao: 'Mix Inicial dos 3 Sabores: Carne Bovina, Frango com Bacon e Linguiça Toscana',
    prompt: `Gourmet trio of raw artisanal skewers neatly presented side by side on dark slate board: prime beef rump skewer with coarse salt, chicken thigh wrapped in bacon skewer, and fine Tuscan pork sausage skewer, perfectly aligned, fresh rosemary sprig, warm ember glow, dramatic dark steakhouse photography, ${BASE_STYLE}`
  }
];

async function baixarESalvarImagem(url, destino) {
  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  const arrayBuffer = await resposta.arrayBuffer();
  await fs.promises.writeFile(destino, Buffer.from(arrayBuffer));
}

async function main() {
  console.log('🚀 Gerando 3 ilustrações específicas para o Protocolo 1...');

  for (const item of NOVAS_IMAGENS) {
    const destino = path.join(OUTPUT_DIR, item.nomeArquivo);
    console.log(`\n📸 Gerando: ${item.descricao}`);
    console.log(`     Arquivo: ${item.nomeArquivo}`);

    const inicio = Date.now();
    try {
      const resultado = await fal.subscribe('fal-ai/flux/schnell', {
        input: {
          prompt: item.prompt,
          image_size: 'landscape_16_9',
          num_inference_steps: 4,
          enable_safety_checker: true
        },
        logs: false
      });

      const url = resultado?.data?.images?.[0]?.url;
      if (!url) throw new Error('Nenhuma URL retornada');

      await baixarESalvarImagem(url, destino);
      const tempo = ((Date.now() - inicio) / 1000).toFixed(1);
      console.log(`     ✅ Salvo com sucesso (${tempo}s)!`);
    } catch (err) {
      console.error(`     ❌ Erro ao gerar ${item.nomeArquivo}:`, err.message);
    }
  }

  console.log('\n🏁 Concluído!');
}

main();
