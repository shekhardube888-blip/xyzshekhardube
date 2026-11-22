#!/usr/bin/env python3
"""
Certificate + Participation Letter generator for AgilePortal Enterprise.
Generates PDF certificates and apology/participation letters via ReportLab.
"""
import json
import os
import sys
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.pdfgen import canvas
from reportlab.graphics.barcode import qr

OUTPUT_DIR = "/home/z/my-project/download/certificates"
os.makedirs(OUTPUT_DIR, exist_ok=True)

EMERALD = HexColor("#059669")
EMERALD_DARK = HexColor("#047857")
AMBER = HexColor("#D97706")
VIOLET = HexColor("#7C3AED")
SLATE_900 = HexColor("#0F172A")
SLATE_700 = HexColor("#334155")
SLATE_500 = HexColor("#64748B")
SLATE_200 = HexColor("#E2E8F0")
GOLD = HexColor("#D4AF37")

def generate_certificate(data: dict) -> str:
    """Generate a full completion certificate PDF."""
    cert_id = data.get("certificateId", "CERT_UNKNOWN")
    filename = f"Certificate-{cert_id}.pdf"
    filepath = os.path.join(OUTPUT_DIR, filename)

    page_size = landscape(A4)
    doc = SimpleDocTemplate(
        filepath, pagesize=page_size,
        leftMargin=20*mm, rightMargin=20*mm, topMargin=20*mm, bottomMargin=20*mm,
        title=f"Certificate — {data.get('studentName', '')}",
        author="AgilePortal Enterprise",
    )

    styles = getSampleStyleSheet()
    style_org = ParagraphStyle("Org", fontName="Helvetica-Bold", fontSize=14, textColor=EMERALD_DARK, alignment=TA_CENTER)
    style_title = ParagraphStyle("CertTitle", fontName="Helvetica-Bold", fontSize=36, textColor=SLATE_900, alignment=TA_CENTER, spaceAfter=4)
    style_sub = ParagraphStyle("CertSub", fontName="Helvetica", fontSize=14, textColor=SLATE_500, alignment=TA_CENTER, spaceAfter=20)
    style_body = ParagraphStyle("CertBody", fontName="Helvetica", fontSize=12, textColor=SLATE_700, alignment=TA_CENTER, spaceAfter=6)
    style_name = ParagraphStyle("CertName", fontName="Helvetica-Bold", fontSize=24, textColor=EMERALD_DARK, alignment=TA_CENTER, spaceAfter=4)
    style_meta = ParagraphStyle("CertMeta", fontName="Helvetica", fontSize=10, textColor=SLATE_500, alignment=TA_CENTER)
    style_footer = ParagraphStyle("CertFooter", fontName="Helvetica-Oblique", fontSize=8, textColor=SLATE_500, alignment=TA_CENTER)

    story = []

    # Border
    story.append(Spacer(1, 10*mm))
    story.append(Paragraph("AgilePortal Enterprise", style_org))
    story.append(Spacer(1, 6*mm))
    story.append(HRFlowable(width="80%", thickness=2, color=GOLD, spaceAfter=10))
    story.append(Paragraph("Certificate of Completion", style_title))
    story.append(Paragraph("This certifies that the following student has successfully completed the industry internship program", style_sub))

    # Student name
    story.append(Paragraph(data.get("studentName", "Student Name"), style_name))
    story.append(Spacer(1, 4*mm))

    # Details table
    details = [
        ["Category", data.get("category", "")],
        ["Subcategory", data.get("subcategory", "")],
        ["College", data.get("college", "")],
        ["City", data.get("city", "")],
        ["Stream", data.get("stream", "")],
        ["Start Date", data.get("startDate", "")],
        ["Completion Date", data.get("completionDate", "")],
    ]
    detail_data = [[Paragraph(f"<b>{k}</b>", style_meta), Paragraph(v, style_meta)] for k, v in details]
    detail_table = Table(detail_data, colWidths=[60*mm, 120*mm])
    detail_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    story.append(detail_table)
    story.append(Spacer(1, 6*mm))

    # Completion metrics
    metrics = data.get("metrics", {})
    metric_data = [
        [Paragraph(f"<b>{metrics.get('weeksCompleted', '0')}/8</b>", ParagraphStyle("M1", fontName="Helvetica-Bold", fontSize=16, textColor=EMERALD, alignment=TA_CENTER)),
         Paragraph(f"<b>{metrics.get('testsPassed', '0')}/6</b>", ParagraphStyle("M2", fontName="Helvetica-Bold", fontSize=16, textColor=EMERALD, alignment=TA_CENTER)),
         Paragraph(f"<b>{metrics.get('simGrade', '—')}</b>", ParagraphStyle("M3", fontName="Helvetica-Bold", fontSize=16, textColor=EMERALD, alignment=TA_CENTER))],
        [Paragraph("Weekly Tasks", style_meta), Paragraph("Test Papers", style_meta), Paragraph("Simulation", style_meta)],
    ]
    metric_table = Table(metric_data, colWidths=[60*mm]*3)
    metric_table.setStyle(TableStyle([
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(metric_table)
    story.append(Spacer(1, 8*mm))

    # Footer
    story.append(HRFlowable(width="80%", thickness=0.5, color=SLATE_200, spaceAfter=6))
    story.append(Paragraph(f"Certificate ID: {cert_id}", style_footer))
    story.append(Paragraph(f"Issued on {data.get('issueDate', '')} by AgilePortal Enterprise", style_footer))
    if data.get("override"):
        story.append(Paragraph("⚠ Issued via Super Admin Override", ParagraphStyle("Override", fontName="Helvetica-Bold", fontSize=8, textColor=AMBER, alignment=TA_CENTER)))
    story.append(Paragraph(f"Verify at: agileportal.in/verify/{cert_id}", style_footer))

    doc.build(story)
    return filepath

def generate_letter(data: dict) -> str:
    """Generate a participation/apology letter PDF."""
    cert_id = data.get("certificateId", "LTR_UNKNOWN")
    filename = f"Letter-{cert_id}.pdf"
    filepath = os.path.join(OUTPUT_DIR, filename)

    doc = SimpleDocTemplate(
        filepath, pagesize=A4,
        leftMargin=25*mm, rightMargin=25*mm, topMargin=25*mm, bottomMargin=25*mm,
        title=f"Letter — {data.get('studentName', '')}",
        author="AgilePortal Enterprise",
    )

    styles = getSampleStyleSheet()
    style_header = ParagraphStyle("Header", fontName="Helvetica-Bold", fontSize=16, textColor=SLATE_900, alignment=TA_LEFT)
    style_sub = ParagraphStyle("Sub", fontName="Helvetica", fontSize=10, textColor=SLATE_500, alignment=TA_LEFT, spaceAfter=20)
    style_title = ParagraphStyle("LetterTitle", fontName="Helvetica-Bold", fontSize=24, textColor=AMBER, alignment=TA_CENTER, spaceAfter=20)
    style_body = ParagraphStyle("Body", fontName="Helvetica", fontSize=11, textColor=SLATE_700, alignment=TA_LEFT, spaceAfter=10, leading=16)
    style_sign = ParagraphStyle("Sign", fontName="Helvetica-Bold", fontSize=11, textColor=SLATE_900, alignment=TA_LEFT, spaceBefore=30)
    style_footer = ParagraphStyle("Footer", fontName="Helvetica-Oblique", fontSize=8, textColor=SLATE_500, alignment=TA_CENTER)

    story = []
    # Header
    story.append(Paragraph("AgilePortal Enterprise", style_header))
    story.append(Paragraph("Industry Internship Program · Letter of Participation", style_sub))
    story.append(HRFlowable(width="100%", thickness=1, color=SLATE_200, spaceAfter=20))

    # Title
    story.append(Paragraph("Letter of Participation", style_title))

    # Body
    metrics = data.get("metrics", {})
    story.append(Paragraph(f"Date: {data.get('issueDate', '')}", style_body))
    story.append(Spacer(1, 6*mm))
    story.append(Paragraph(f"To Whom It May Concern,", style_body))
    story.append(Spacer(1, 4*mm))
    story.append(Paragraph(
        f"This is to acknowledge that <b>{data.get('studentName', '')}</b>, "
        f"a student at {data.get('college', '')}, {data.get('city', '')}, "
        f"was enrolled in the {data.get('category', '')} → {data.get('subcategory', '')} "
        f"internship program at AgilePortal Enterprise, starting on {data.get('startDate', '')}.",
        style_body,
    ))
    story.append(Spacer(1, 4*mm))

    # Completion status
    weeks = metrics.get("weeksCompleted", 0)
    tests = metrics.get("testsPassed", 0)
    sim = metrics.get("simGrade", "Not attempted")

    if weeks < 8 or tests < 4:
        story.append(Paragraph(
            f"While the student made progress in the program — completing {weeks} of 8 weekly tasks "
            f"and passing {tests} of 6 test papers — they did not meet the full completion criteria "
            f"required for the Certificate of Completion. The simulation grade was: {sim}.",
            style_body,
        ))
        story.append(Spacer(1, 4*mm))
        story.append(Paragraph(
            "We regret that the student did not complete all required modules within the program timeframe. "
            "This letter serves as official acknowledgment of their participation and partial progress in the "
            "AgilePortal Enterprise internship program.",
            style_body,
        ))
    else:
        story.append(Paragraph(
            f"The student successfully completed all required modules: {weeks}/8 weekly tasks, "
            f"{tests}/6 test papers passed, and simulation grade: {sim}.",
            style_body,
        ))

    story.append(Spacer(1, 6*mm))
    story.append(Paragraph(
        "For verification, please contact training@agileportal.in or visit agileportal.in.",
        style_body,
    ))

    # Signature
    story.append(Spacer(1, 15*mm))
    story.append(Paragraph("Sincerely,", style_sign))
    story.append(Spacer(1, 8*mm))
    story.append(Paragraph("AgilePortal Enterprise", style_sign))
    story.append(Paragraph("Academic Programs Office", style_sub))

    # Footer
    story.append(HRFlowable(width="100%", thickness=0.5, color=SLATE_200, spaceAfter=6))
    story.append(Paragraph(f"Letter ID: {cert_id} · Issued on {data.get('issueDate', '')} · Issued by Super Admin", style_footer))

    doc.build(story)
    return filepath

if __name__ == "__main__":
    input_data = json.loads(sys.stdin.read())
    data = input_data["data"]
    doc_type = input_data.get("type", "certificate")

    if doc_type == "letter":
        path = generate_letter(data)
    else:
        path = generate_certificate(data)

    print(json.dumps({"path": path, "filename": os.path.basename(path)}))
