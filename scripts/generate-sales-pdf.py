#!/usr/bin/env python3
"""
AgilePortal Enterprise — Sales Document PDF Generator
Creates a multi-page sales brochure with embedded screenshots.
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle,
    PageBreak, KeepTogether, Flowable, HRFlowable,
)
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

# ─── Paths ───
SCREENSHOTS_DIR = "/tmp/screenshots"
OUTPUT_PDF = "/home/z/my-project/download/AgilePortal-Enterprise-Sales-Document.pdf"

# ─── Colors ───
EMERALD = HexColor("#059669")
EMERALD_DARK = HexColor("#047857")
AMBER = HexColor("#D97706")
VIOLET = HexColor("#7C3AED")
SLATE_900 = HexColor("#0F172A")
SLATE_700 = HexColor("#334155")
SLATE_500 = HexColor("#64748B")
SLATE_200 = HexColor("#E2E8F0")
SLATE_100 = HexColor("#F1F5F9")
WHITE = HexColor("#FFFFFF")

# ─── Styles ───
styles = getSampleStyleSheet()

style_cover_title = ParagraphStyle(
    "CoverTitle", parent=styles["Title"],
    fontName="Helvetica-Bold", fontSize=28, leading=34,
    textColor=WHITE, alignment=TA_CENTER, spaceAfter=6,
)
style_cover_sub = ParagraphStyle(
    "CoverSub", parent=styles["Normal"],
    fontName="Helvetica", fontSize=14, leading=20,
    textColor=HexColor("#A7F3D0"), alignment=TA_CENTER, spaceAfter=12,
)
style_cover_tag = ParagraphStyle(
    "CoverTag", parent=styles["Normal"],
    fontName="Helvetica-Bold", fontSize=10, leading=14,
    textColor=AMBER, alignment=TA_CENTER,
)
style_h1 = ParagraphStyle(
    "H1", parent=styles["Heading1"],
    fontName="Helvetica-Bold", fontSize=18, leading=24,
    textColor=EMERALD_DARK, spaceBefore=20, spaceAfter=10,
)
style_h2 = ParagraphStyle(
    "H2", parent=styles["Heading2"],
    fontName="Helvetica-Bold", fontSize=14, leading=18,
    textColor=SLATE_900, spaceBefore=14, spaceAfter=6,
)
style_body = ParagraphStyle(
    "Body", parent=styles["Normal"],
    fontName="Helvetica", fontSize=10, leading=15,
    textColor=SLATE_700, alignment=TA_JUSTIFY, spaceAfter=6,
)
style_body_bold = ParagraphStyle(
    "BodyBold", parent=style_body,
    fontName="Helvetica-Bold", textColor=SLATE_900,
)
style_bullet = ParagraphStyle(
    "Bullet", parent=style_body,
    leftIndent=15, bulletIndent=5, spaceAfter=4,
)
style_caption = ParagraphStyle(
    "Caption", parent=styles["Normal"],
    fontName="Helvetica-Oblique", fontSize=8, leading=12,
    textColor=SLATE_500, alignment=TA_CENTER, spaceBefore=4, spaceAfter=12,
)
style_kpi_value = ParagraphStyle(
    "KPIValue", parent=styles["Normal"],
    fontName="Helvetica-Bold", fontSize=20, leading=24,
    textColor=EMERALD, alignment=TA_CENTER,
)
style_kpi_label = ParagraphStyle(
    "KPILabel", parent=styles["Normal"],
    fontName="Helvetica", fontSize=8, leading=12,
    textColor=SLATE_500, alignment=TA_CENTER,
)
style_price = ParagraphStyle(
    "Price", parent=styles["Normal"],
    fontName="Helvetica-Bold", fontSize=36, leading=40,
    textColor=EMERALD, alignment=TA_CENTER,
)

# ─── Helper: screenshot image flowable ───
def screenshot(path, caption_text, width=170*mm):
    """Embed a screenshot with a caption, scaled to fit page width."""
    if not os.path.exists(path):
        return Paragraph(f"<i>[Screenshot not found: {os.path.basename(path)}]</i>", style_caption)
    # Calculate height proportionally
    from PIL import Image as PILImage
    pil_img = PILImage.open(path)
    aspect = pil_img.height / pil_img.width
    height = width * aspect
    # Cap height at 200mm so it doesn't overflow
    if height > 200*mm:
        height = 200*mm
        width = height / aspect
    img = Image(path, width=width, height=height)
    cap = Paragraph(caption_text, style_caption)
    return KeepTogether([img, cap])

# ─── Cover page drawer (called via onFirstPage) ───
def draw_cover(c, doc):
    """Draw the cover page directly on the canvas."""
    page_width, page_height = A4
    # Background: dark slate
    c.setFillColor(SLATE_900)
    c.rect(0, 0, page_width, page_height, fill=1, stroke=0)
    # Top accent bar: emerald
    c.setFillColor(EMERALD)
    c.rect(0, page_height - 8*mm, page_width, 8*mm, fill=1, stroke=0)
    # Decorative circles
    c.setFillColor(HexColor("#1E293B"))
    c.circle(page_width * 0.85, page_height * 0.75, 60*mm, fill=1, stroke=0)
    c.setFillColor(HexColor("#134E4A"))
    c.circle(page_width * 0.15, page_height * 0.25, 40*mm, fill=1, stroke=0)
    # Logo box
    c.setFillColor(EMERALD)
    c.roundRect(page_width/2 - 20*mm, page_height * 0.65, 40*mm, 40*mm, 8*mm, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(page_width/2, page_height * 0.65 + 14*mm, "AP")
    # Title
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 32)
    c.drawCentredString(page_width/2, page_height * 0.52, "AgilePortal")
    c.setFillColor(AMBER)
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(page_width/2, page_height * 0.52 - 18, "ENTERPRISE")
    # Subtitle
    c.setFillColor(HexColor("#A7F3D0"))
    c.setFont("Helvetica", 13)
    c.drawCentredString(page_width/2, page_height * 0.42, "Industry-Grade Internship Platform")
    c.drawCentredString(page_width/2, page_height * 0.42 - 16, "for MBA · BBA · BSc Students + Enterprise L&D")
    # Feature tags
    tags = ["UGC-Aligned", "Mentor-Led", "AI-Powered", "Rs.1499 Registration"]
    tag_y = page_height * 0.33
    tag_x_start = page_width/2 - (len(tags) * 35*mm) / 2
    for i, tag in enumerate(tags):
        x = tag_x_start + i * 35*mm
        c.setFillColor(HexColor("#1E293B"))
        c.roundRect(x, tag_y, 32*mm, 7*mm, 3*mm, fill=1, stroke=0)
        c.setFillColor(HexColor("#94A3B8"))
        c.setFont("Helvetica", 8)
        c.drawCentredString(x + 16*mm, tag_y + 2*mm, tag)
    # Bottom section: key metrics
    metrics = [("800+", "Students"), ("80+", "Colleges"), ("60+", "Projects"), ("98%", "Completion")]
    m_y = page_height * 0.18
    m_spacing = page_width / len(metrics)
    for i, (val, label) in enumerate(metrics):
        x = m_spacing * (i + 0.5)
        c.setFillColor(EMERALD)
        c.setFont("Helvetica-Bold", 22)
        c.drawCentredString(x, m_y, val)
        c.setFillColor(HexColor("#94A3B8"))
        c.setFont("Helvetica", 9)
        c.drawCentredString(x, m_y - 14, label)
    # Footer
    c.setFillColor(HexColor("#475569"))
    c.setFont("Helvetica", 8)
    c.drawCentredString(page_width/2, 10*mm, "Sales Document · 2026 · agileportal.in")

# ─── Build PDF ───
def build_pdf():
    os.makedirs(os.path.dirname(OUTPUT_PDF), exist_ok=True)
    
    doc = SimpleDocTemplate(
        OUTPUT_PDF,
        pagesize=A4,
        leftMargin=20*mm, rightMargin=20*mm,
        topMargin=20*mm, bottomMargin=20*mm,
        title="AgilePortal Enterprise — Sales Document",
        author="AgilePortal Enterprise",
        subject="Product overview, features, and pricing for the AgilePortal Enterprise internship + L&D platform",
        creator="AgilePortal Enterprise",
    )
    
    page_width, page_height = A4
    content_width = page_width - 40*mm
    
    story = []
    
    # ─── Cover page (drawn via onFirstPage callback — skip a page break) ───
    story.append(Spacer(1, 1))  # placeholder; cover is drawn by callback
    story.append(PageBreak())
    
    # ─── Page 2: Executive Summary ───
    story.append(Paragraph("Executive Summary", style_h1))
    story.append(HRFlowable(width="100%", thickness=2, color=EMERALD, spaceAfter=10))
    
    story.append(Paragraph(
        "<b>AgilePortal Enterprise</b> is an industry-grade internship and learning & development "
        "platform serving MBA, BBA, and BSc students across India, plus enterprise organizations "
        "managing team training cohorts. The platform combines mentor-led weekly tasks, timed "
        "test papers, a business strategy simulation game, AI-powered guidance, and a full "
        "approval workflow — all in one unified portal.",
        style_body,
    ))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        "Students register with a simple Rs.1499 one-time fee, get approved by the admin team, "
        "and unlock a full 8-week internship program with verifiable certificates. Enterprise "
        "organizations (like TCS, ICICI Bank, Reliance Retail) use the Super Admin dashboard "
        "to create orgs, add teams, assign managers, and invite learners into cohorts — "
        "billed per seat.",
        style_body,
    ))
    story.append(Spacer(1, 12))
    
    # KPI table
    kpi_data = [
        [Paragraph("800+", style_kpi_value), Paragraph("80+", style_kpi_value),
         Paragraph("60+", style_kpi_value), Paragraph("98%", style_kpi_value)],
        [Paragraph("Students Enrolled", style_kpi_label), Paragraph("Partner Colleges", style_kpi_label),
         Paragraph("Industry Projects", style_kpi_label), Paragraph("Completion Rate", style_kpi_label)],
    ]
    kpi_table = Table(kpi_data, colWidths=[content_width/4]*4)
    kpi_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), SLATE_100),
        ("BOX", (0, 0), (-1, -1), 1, SLATE_200),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, SLATE_200),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    story.append(kpi_table)
    story.append(Spacer(1, 16))
    
    story.append(Paragraph("What's Inside This Document", style_h2))
    story.append(Paragraph("• Product overview with live screenshots of every major view", style_bullet))
    story.append(Paragraph("• The 3-view architecture: Marketing → Login → Dashboard", style_bullet))
    story.append(Paragraph("• Student features: weekly tasks, test papers, simulation, leaderboard", style_bullet))
    story.append(Paragraph("• Admin features: approval queue, student applications", style_bullet))
    story.append(Paragraph("• Enterprise features: org & team management", style_bullet))
    story.append(Paragraph("• AI mentor chatbot (role-aware: student / admin / super admin)", style_bullet))
    story.append(Paragraph("• Pricing: Rs.1499 registration + enterprise per-seat SaaS", style_bullet))
    
    story.append(PageBreak())
    
    # ─── Page 3: Product Overview ───
    story.append(Paragraph("Product Overview", style_h1))
    story.append(HRFlowable(width="100%", thickness=2, color=EMERALD, spaceAfter=10))
    
    story.append(Paragraph(
        "The portal is a single-page application with a smart 3-view router. Users see different "
        "content based on their authentication state and role — no long scrolling, no clutter.",
        style_body,
    ))
    story.append(Spacer(1, 8))
    
    story.append(Paragraph("Landing Page (Marketing View)", style_h2))
    story.append(Paragraph(
        "The default view for visitors. Shows the hero section with branding, program categories "
        "(MBA, BBA, BSc CS, BSc Biotech, BSc Statistics), internship programs, how-it-works flow, "
        "student testimonials, about section, and FAQ. Clear 'Login' and 'Register Free' CTAs.",
        style_body,
    ))
    story.append(screenshot(f"{SCREENSHOTS_DIR}/01-landing.png",
                            "Fig 1. Landing page — hero section with branding, trust stats, and CTAs."))
    
    story.append(PageBreak())
    
    # ─── Page 4: Registration + Payment ───
    story.append(Paragraph("Easy Registration + Rs.1499 Payment", style_h1))
    story.append(HRFlowable(width="100%", thickness=2, color=EMERALD, spaceAfter=10))
    
    story.append(Paragraph(
        "Students register via a clean 3-step wizard: personal details → payment → confirmation. "
        "The Rs.1499 one-time registration fee is collected via a mock payment gateway supporting "
        "card, UPI, and net banking. After payment, the student's registration enters the admin "
        "approval queue. Once approved, the full internship dashboard unlocks.",
        style_body,
    ))
    story.append(Spacer(1, 8))
    
    story.append(Paragraph("Step 1: Registration Form", style_h2))
    story.append(screenshot(f"{SCREENSHOTS_DIR}/02-register.png",
                            "Fig 2. Registration wizard — step 1: personal details (name, email, phone, stream)."))
    
    story.append(Paragraph("Step 2: Payment Gateway (Rs.1499)", style_h2))
    story.append(screenshot(f"{SCREENSHOTS_DIR}/03-payment.png",
                            "Fig 3. Mock payment gateway — card / UPI / net banking tabs, Rs.1499 total."))
    
    story.append(PageBreak())
    
    # ─── Page 5: Student Dashboard ───
    story.append(Paragraph("Student Dashboard", style_h1))
    story.append(HRFlowable(width="100%", thickness=2, color=EMERALD, spaceAfter=10))
    
    story.append(Paragraph(
        "After admin approval, students access a tabbed dashboard with 5 focused sections. "
        "The header shows personalized welcome, KPIs (program week, progress, sessions attended, "
        "certificate status), and quick-jump cards.",
        style_body,
    ))
    story.append(Spacer(1, 8))
    
    story.append(Paragraph("Overview Tab", style_h2))
    story.append(Paragraph(
        "Program track with progress bar, weekly deliverables list, submit-deliverable form, "
        "certificate preview, mentor card, and upcoming live sessions.",
        style_body,
    ))
    story.append(screenshot(f"{SCREENSHOTS_DIR}/04-student-dashboard.png",
                            "Fig 4. Student dashboard — Overview tab with KPIs + program track."))
    
    story.append(PageBreak())
    
    # ─── Page 6: Weekly Tasks ───
    story.append(Paragraph("Weekly Tasks + Market Scenarios", style_h1))
    story.append(HRFlowable(width="100%", thickness=2, color=EMERALD, spaceAfter=10))
    
    story.append(Paragraph(
        "8 weeks of mentor-led tasks covering the full MBA Marketing curriculum. Each week has: "
        "a task brief, a 4-question MCQ test (auto-graded), a real Indian D2C brand market "
        "scenario, and a solution submission box with word-count validation. Weeks unlock "
        "sequentially — pass the test + submit the solution to advance.",
        style_body,
    ))
    story.append(Spacer(1, 8))
    
    story.append(Paragraph("AI Guidance Panel", style_h2))
    story.append(Paragraph(
        "Each week includes an LLM-powered AI Guidance panel that generates a 5-step guide on "
        "how AI is used in that domain, real industry examples, ERP + AI integrations "
        "(Salesforce, HubSpot, SAP), a copy-paste LLM prompt, and a caution note.",
        style_body,
    ))
    story.append(screenshot(f"{SCREENSHOTS_DIR}/05-weekly-tasks.png",
                            "Fig 5. Weekly tasks panel — week selector + task brief + test + market scenario."))
    
    story.append(PageBreak())
    
    # ─── Page 7: Test Papers + Simulation ───
    story.append(Paragraph("Test Papers + D2C Brand Simulator", style_h1))
    story.append(HRFlowable(width="100%", thickness=2, color=EMERALD, spaceAfter=10))
    
    story.append(Paragraph(
        "Beyond weekly tasks, students get two additional learning modules:",
        style_body,
    ))
    story.append(Spacer(1, 6))
    
    story.append(Paragraph("6 Timed Test Papers", style_h2))
    story.append(Paragraph(
        "Formal exams across MBA (Brand Audit, GTM), BBA (Entrepreneurship, Digital Marketing), "
        "and BSc (Data Science, Statistics) tracks. Each paper: 10 MCQs, 15-minute timer, "
        "auto-graded, answer review with explanations, pass threshold 70%.",
        style_body,
    ))
    
    story.append(Paragraph("D2C Brand Simulator (MBA/BBA Strategy Game)", style_h2))
    story.append(Paragraph(
        "A CAPSIM-style business simulation where students run a fictional D2C brand across 8 "
        "quarters. They make pricing, marketing, R&D, production, and channel decisions each "
        "quarter. The engine computes demand, market share vs 3 AI competitors, profit, brand "
        "equity, and customer satisfaction. Final grade A/B/C/D based on cumulative metrics.",
        style_body,
    ))
    story.append(screenshot(f"{SCREENSHOTS_DIR}/06-simulation.png",
                            "Fig 6. D2C Brand Simulator — decision sliders + AI competitor preview."))
    
    story.append(PageBreak())
    
    # ─── Page 8: Leaderboard + Admin ───
    story.append(Paragraph("Cohort Leaderboard + Admin Dashboard", style_h1))
    story.append(HRFlowable(width="100%", thickness=2, color=EMERALD, spaceAfter=10))
    
    story.append(Paragraph("Leaderboard", style_h2))
    story.append(Paragraph(
        "After completing the simulation, students are ranked against the cohort. The leaderboard "
        "is sortable by grade, cash, market share, or profit. The student's entry is highlighted "
        "with a 'You' badge. Pre-seeded with 10 anonymized cohort entries.",
        style_body,
    ))
    story.append(screenshot(f"{SCREENSHOTS_DIR}/07-leaderboard.png",
                            "Fig 7. Cohort leaderboard — sortable rankings with 'You' highlight."))
    
    story.append(Paragraph("Admin Dashboard", style_h2))
    story.append(Paragraph(
        "Admins see a student applications table (6 demo applications with approve/reject buttons) "
        "and a full approval queue. The queue handles 4 approval types: registration, weekly "
        "solution, test paper, and certificate — each with review + comment + quick-approve.",
        style_body,
    ))
    story.append(screenshot(f"{SCREENSHOTS_DIR}/08-admin-dashboard.png",
                            "Fig 8. Admin dashboard — applications table + KPIs."))
    
    story.append(PageBreak())
    
    # ─── Page 9: Approval Queue + Enterprise ───
    story.append(Paragraph("Approval Queue + Enterprise Management", style_h1))
    story.append(HRFlowable(width="100%", thickness=2, color=EMERALD, spaceAfter=10))
    
    story.append(Paragraph("Approval Queue (Admin)", style_h2))
    story.append(Paragraph(
        "The approval queue shows all pending student registrations, weekly solutions, test "
        "papers, and certificate requests. Each item shows the student name, type badge, stage, "
        "detail, submission time, and mentor comment (if reviewed). Admins can approve/reject "
        "with optional comments that students see on their dashboard.",
        style_body,
    ))
    story.append(screenshot(f"{SCREENSHOTS_DIR}/09-approval-queue.png",
                            "Fig 9. Approval queue — pending registrations + solutions with review buttons."))
    
    story.append(Paragraph("Enterprise Org Management (Super Admin)", style_h2))
    story.append(Paragraph(
        "Super Admins manage the enterprise tier: create organizations, add teams under each org, "
        "assign team managers, and invite learners into cohorts. Pre-seeded with 3 demo "
        "enterprises (TCS, ICICI Bank, Reliance Retail). KPIs show org count, team count, "
        "manager count, and pending invites.",
        style_body,
    ))
    story.append(screenshot(f"{SCREENSHOTS_DIR}/10-org-management.png",
                            "Fig 10. Super Admin dashboard — org management with create-org/team/invite forms."))
    
    story.append(PageBreak())
    
    # ─── Page 10: AI Mentor + Pricing ───
    story.append(Paragraph("AI Mentor Chatbot + Pricing", style_h1))
    story.append(HRFlowable(width="100%", thickness=2, color=EMERALD, spaceAfter=10))
    
    story.append(Paragraph("Role-Aware AI Mentor", style_h2))
    story.append(Paragraph(
        "A floating chatbot widget (bottom-right, always visible) provides role-specific guidance. "
        "Students see 'AI Mentor' (violet), admins see 'Admin Assistant' (amber), super admins see "
        "'Enterprise Guide' (violet-dark), and guests see 'AI Guide' (emerald). The LLM knows the "
        "user's current progress, pending approvals, and context — giving personalized advice.",
        style_body,
    ))
    story.append(screenshot(f"{SCREENSHOTS_DIR}/11-chatbot.png",
                            "Fig 11. AI Mentor chatbot — floating widget with role-specific prompts."))
    
    story.append(Spacer(1, 12))
    story.append(Paragraph("Pricing", style_h2))
    
    # Pricing table
    pricing_data = [
        [Paragraph("Student Registration", style_body_bold), Paragraph("Rs.1,499", style_price)],
        [Paragraph("One-time fee · Includes full 8-week internship + certificate", style_caption),
         Paragraph("GST inclusive", style_caption)],
    ]
    pricing_table = Table(pricing_data, colWidths=[content_width*0.6, content_width*0.4])
    pricing_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), SLATE_100),
        ("BACKGROUND", (0, 1), (-1, 1), HexColor("#F0FDF4")),
        ("BOX", (0, 0), (-1, -1), 1, EMERALD),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(pricing_table)
    
    story.append(Spacer(1, 8))
    story.append(Paragraph(
        "<b>Enterprise tier:</b> Per-seat SaaS pricing for organizations. Contact sales for custom "
        "quotes based on team size and number of cohorts. Includes org management dashboard, "
        "team manager role, learner invites, and org-level analytics.",
        style_body,
    ))
    
    story.append(PageBreak())
    
    # ─── Page 11: Call to Action ───
    story.append(Paragraph("Get Started", style_h1))
    story.append(HRFlowable(width="100%", thickness=2, color=EMERALD, spaceAfter=10))
    
    story.append(Paragraph(
        "AgilePortal Enterprise is live and ready for students and enterprise organizations. "
        "Here's how to get started:",
        style_body,
    ))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("For Students", style_h2))
    story.append(Paragraph("1. Visit the portal and click <b>Register Free</b>", style_bullet))
    story.append(Paragraph("2. Fill the 4-field registration form (name, email, phone, stream)", style_bullet))
    story.append(Paragraph("3. Pay the Rs.1,499 registration fee via card / UPI / net banking", style_bullet))
    story.append(Paragraph("4. Wait for admin approval (typically under 24 hours)", style_bullet))
    story.append(Paragraph("5. Access your full dashboard — weekly tasks, tests, simulation, leaderboard", style_bullet))
    story.append(Paragraph("6. Use the AI Mentor chatbot for personalized guidance at every stage", style_bullet))
    
    story.append(Spacer(1, 10))
    story.append(Paragraph("For Enterprises", style_h2))
    story.append(Paragraph("1. Contact the AgilePortal Enterprise sales team", style_bullet))
    story.append(Paragraph("2. Sign a per-seat SaaS agreement based on team size", style_bullet))
    story.append(Paragraph("3. Super Admin creates your organization in the portal", style_bullet))
    story.append(Paragraph("4. Org Admin creates teams and assigns team managers", style_bullet))
    story.append(Paragraph("5. Managers invite learners into cohorts via email", style_bullet))
    story.append(Paragraph("6. Learners get the full student dashboard with org/team affiliation", style_bullet))
    
    story.append(Spacer(1, 16))
    story.append(HRFlowable(width="100%", thickness=1, color=SLATE_200, spaceAfter=10))
    
    # Contact box
    contact_data = [[
        Paragraph("<b>Contact</b><br/><br/>"
                  "<b>Email:</b> training@agileportal.in<br/>"
                  "<b>Phone:</b> +91 80955 57332<br/>"
                  "<b>WhatsApp:</b> +91 80955 57334<br/>"
                  "<b>Website:</b> agileportal.in",
                  style_body),
        Paragraph("<b>Demo Credentials</b><br/><br/>"
                  "<b>Admin:</b> admin@agileportal.in / admin123<br/>"
                  "<b>Super Admin:</b> superadmin@agileportal.in / super123<br/><br/>"
                  "<b>Student:</b> Sign up via the Registration Wizard (Rs.1499 mock payment)",
                  style_body),
    ]]
    contact_table = Table(contact_data, colWidths=[content_width/2]*2)
    contact_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), SLATE_100),
        ("BOX", (0, 0), (-1, -1), 1, SLATE_200),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
    ]))
    story.append(contact_table)
    
    story.append(Spacer(1, 16))
    story.append(Paragraph(
        "© 2026 AgilePortal Enterprise · All Rights Reserved.",
        ParagraphStyle("Footer", parent=style_caption, alignment=TA_CENTER),
    ))
    
    # Build — cover page drawn via onFirstPage callback
    doc.build(story, onFirstPage=draw_cover, onLaterPages=lambda c, d: None)
    print(f"✅ PDF generated: {OUTPUT_PDF}")
    print(f"   File size: {os.path.getsize(OUTPUT_PDF) / 1024:.1f} KB")

if __name__ == "__main__":
    build_pdf()
