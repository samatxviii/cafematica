from __future__ import annotations

import os
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from reportlab.lib.colors import Color
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


POSITIONS = [
    ("right_top", 470, 790),
    ("left_top", 35, 790),
    ("left_middle", 35, 430),
    ("right_middle", 470, 430),
    ("bottom_center", 230, 35),
]


def _make_watermark_pdf(text: str, page_size, position_index: int, temp_path: str):
    width = float(page_size.width)
    height = float(page_size.height)
    _, x, y = POSITIONS[position_index % len(POSITIONS)]
    x = min(x, width - 180)
    y = min(y, height - 35)

    c = canvas.Canvas(temp_path, pagesize=(width, height))
    c.setFillColor(Color(0, 0, 0, alpha=0.20))
    c.setFont("Helvetica", 7)
    c.drawString(x, y, text)
    c.save()


def personalize_pdf(source_pdf: str, output_pdf: str, full_name: str, cpf: str) -> str:
    os.makedirs(os.path.dirname(output_pdf), exist_ok=True)
    watermark_text = f"Uso individual: {full_name} — CPF: {cpf or 'não informado'}"

    reader = PdfReader(source_pdf)
    writer = PdfWriter()
    temp_dir = Path(output_pdf).parent / "_tmp_watermarks"
    temp_dir.mkdir(exist_ok=True)

    for i, page in enumerate(reader.pages):
        temp_wm = temp_dir / f"wm_{i}.pdf"
        _make_watermark_pdf(watermark_text, page.mediabox, i, str(temp_wm))
        wm_reader = PdfReader(str(temp_wm))
        page.merge_page(wm_reader.pages[0])
        writer.add_page(page)

    with open(output_pdf, "wb") as f:
        writer.write(f)

    for p in temp_dir.glob("wm_*.pdf"):
        p.unlink(missing_ok=True)
    temp_dir.rmdir()
    return output_pdf


def make_sample_pdf(path: str, title: str):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    c = canvas.Canvas(path, pagesize=A4)
    w, h = A4
    for page in range(1, 6):
        c.setFont("Helvetica-Bold", 20)
        c.drawString(50, h - 80, title)
        c.setFont("Helvetica", 12)
        c.drawString(50, h - 120, f"Página {page} de exemplo para visualização pelo site.")
        c.drawString(50, h - 150, "Substitua este arquivo pelo PDF real do seu e-book.")
        c.showPage()
    c.save()
