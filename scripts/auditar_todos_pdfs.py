import os
import sys
from pypdf import PdfReader

PDF_DIR = "pdfs"

pdf_files = [
    ("Protocolo-01-Preparacao.pdf", "Protocolo 1"),
    ("Protocolo-02-Producao.pdf", "Protocolo 2"),
    ("Protocolo-03-Padronizacao.pdf", "Protocolo 3"),
    ("Protocolo-04-Congelamento.pdf", "Protocolo 4"),
    ("Protocolo-05-Precificacao.pdf", "Protocolo 5"),
    ("Protocolo-06-Oferta.pdf", "Protocolo 6"),
    ("Protocolo-07-Venda.pdf", "Protocolo 7"),
    ("Bonus-01-Operacao-Delivery.pdf", "Bônus 1"),
    ("Bonus-02-Protocolo-Recompra.pdf", "Bônus 2"),
    ("Bonus-03-Crescimento-Expansao.pdf", "Bônus 3"),
    ("Bonus-04-Plano-7-Dias.pdf", "Bônus 4"),
    ("Kit-WhatsApp-Que-Vende.pdf", "Kit WhatsApp"),
    ("Kit-Cardapio-Comunicacao-Visual.pdf", "Kit Cardápio"),
]

print("=" * 80)
print("🔍 RELATÓRIO DE AUDITORIA PREVENTIVA DE PÁGINAS E QUEBRAS (TODOS OS 13 PDFs)")
print("=" * 80)

total_pages_all = 0

for filename, label in pdf_files:
    path = os.path.join(PDF_DIR, filename)
    if not os.path.exists(path):
        print(f"❌ [NÃO ENCONTRADO] {filename}")
        continue
    
    reader = PdfReader(path)
    num_pages = len(reader.pages)
    total_pages_all += num_pages
    size_mb = os.path.getsize(path) / (1024 * 1024)
    
    print(f"\n📘 {label.upper()}: {filename} ({num_pages} páginas | {size_mb:.2f} MB)")
    
    empty_pages = []
    short_pages = []
    
    for i, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        char_count = len(text.strip())
        first_line = text.strip().split("\n")[0] if text.strip() else "[VAZIA]"
        
        # Pagina 1 e capa geralmente tem menos texto que paginas tecnicas
        if char_count == 0:
            empty_pages.append(i + 1)
        elif char_count < 60 and i > 0:
            short_pages.append((i + 1, char_count, first_line[:40]))
        
        # Verificando palavras-chave ou trechos que antes poderiam estar cortados
        print(f"   - Pág {i+1:02d}: {char_count:4d} chars | Início: {first_line[:55]}")

    if empty_pages:
        print(f"   ⚠️ ALERTA: Páginas sem texto: {empty_pages}")
    if short_pages:
        print(f"   ℹ️ Páginas curtas (<60 chars): {short_pages}")

print("\n" + "=" * 80)
print(f"📊 TOTAL CONSOLIDADO: 13 Módulos auditados | {total_pages_all} Páginas geradas")
print("=" * 80)
