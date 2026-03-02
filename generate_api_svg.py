#!/usr/bin/env python3
"""
Generate API Development hero SVG for pricing-api-development.html.

Design: Hub-and-spoke API gateway diagram.
  - Central white card: API endpoint display (method badge + URL + status)
  - Left node: CLIENT card (white)
  - Top-right node: DATABASE card (orange gradient)
  - Bottom-right node: SERVICE card (navy header)
  - Animated dashed connection lines
  - Floating HTTP method pills and particles
  - Layer classes for CSS animation
"""


def generate():
    # ── Layout constants ─────────────────────────────────────────────────────
    # Hub card (central API endpoint card)
    HX, HY, HW, HH = 120, 90, 160, 115
    H_HEADER = 36   # navy header height
    H_R = 12        # corner radius

    # Left CLIENT node
    CX, CY, CW, CH = 5, 108, 72, 68

    # Top-right DATABASE node
    DX, DY, DW, DH = 322, 48, 72, 60

    # Bottom-right SERVICE node
    SX, SY, SW, SH = 322, 192, 72, 60

    # Derived connection points
    c_rx = CX + CW                   # client right edge  → 77
    c_my = round(CY + CH / 2, 1)    # client mid y       → 142.0
    h_lx = HX                        # hub left edge      → 120
    h_rx = HX + HW                   # hub right edge     → 280
    h_my = round(HY + HH / 2, 1)    # hub mid y          → 147.5
    h_ty = HY                        # hub top y          → 90
    h_by = HY + HH                   # hub bottom y       → 205
    d_cy = DY + DH // 2             # db center y        → 78
    s_cy = SY + SH // 2             # svc center y       → 222

    # ── Helper: rounded-top-only path ────────────────────────────────────────
    def top_rounded_rect(x, y, w, h, r):
        return (
            f"M{x+r},{y} L{x+w-r},{y} Q{x+w},{y} {x+w},{y+r} "
            f"L{x+w},{y+h} L{x},{y+h} L{x},{y+r} Q{x},{y} {x+r},{y} Z"
        )

    L = []  # output lines

    # ── Open SVG ─────────────────────────────────────────────────────────────
    L.append('<svg class="page-hero__svg" viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg">')
    L.append('    <defs>')
    L.append('        <linearGradient id="apiGrad1" x1="0%" y1="0%" x2="100%" y2="100%">')
    L.append('            <stop offset="0%" style="stop-color:#f97316" />')
    L.append('            <stop offset="100%" style="stop-color:#fb923c" />')
    L.append('        </linearGradient>')
    L.append('        <linearGradient id="apiGradNav" x1="0%" y1="0%" x2="100%" y2="100%">')
    L.append('            <stop offset="0%" style="stop-color:#1e3a5f" />')
    L.append('            <stop offset="100%" style="stop-color:#0f2340" />')
    L.append('        </linearGradient>')
    L.append('        <filter id="apiShadow" x="-20%" y="-20%" width="140%" height="140%">')
    L.append('            <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.12"/>')
    L.append('        </filter>')
    L.append('    </defs>')

    # ── Background ────────────────────────────────────────────────────────────
    L.append('')
    L.append('    <!-- Background decorative circles -->')
    L.append('    <g class="page-svg__layer page-svg__layer--bg">')
    L.append('        <circle cx="348" cy="38" r="32" fill="rgba(249,115,22,0.08)" />')
    L.append('        <circle cx="30" cy="278" r="40" fill="rgba(249,115,22,0.06)" />')
    L.append('        <circle cx="374" cy="262" r="18" fill="rgba(249,115,22,0.1)" />')
    L.append('    </g>')

    # ── Connection lines ──────────────────────────────────────────────────────
    L.append('')
    L.append('    <!-- Animated connection lines -->')
    L.append('    <g class="page-svg__layer page-svg__layer--lines">')
    # Client → Hub (horizontal)
    L.append(
        f'        <path d="M{c_rx},{c_my} L{h_lx},{h_my}"'
        f' stroke="url(#apiGrad1)" stroke-width="1.5" fill="none"'
        f' stroke-dasharray="5,4" opacity="0.5"/>'
    )
    # Hub → Database (curve up-right)
    L.append(
        f'        <path d="M{h_rx},{h_ty + 22} Q{h_rx + 22},{d_cy} {DX},{d_cy}"'
        f' stroke="url(#apiGrad1)" stroke-width="1.5" fill="none"'
        f' stroke-dasharray="5,4" opacity="0.5"/>'
    )
    # Hub → Service (curve down-right)
    L.append(
        f'        <path d="M{h_rx},{h_by - 22} Q{h_rx + 22},{s_cy} {SX},{s_cy}"'
        f' stroke="url(#apiGrad1)" stroke-width="1.5" fill="none"'
        f' stroke-dasharray="5,4" opacity="0.5"/>'
    )
    L.append('    </g>')

    # ── Main hub card ─────────────────────────────────────────────────────────
    L.append('')
    L.append('    <!-- Central API endpoint card -->')
    L.append(f'    <g class="page-svg__layer page-svg__layer--main" filter="url(#apiShadow)">')

    # Card body (white)
    L.append(f'        <rect x="{HX}" y="{HY}" width="{HW}" height="{HH}" rx="{H_R}" fill="#ffffff"/>')

    # Navy header (rounded top corners only)
    header_path = top_rounded_rect(HX, HY, HW, H_HEADER, H_R)
    L.append(f'        <path d="{header_path}" fill="url(#apiGradNav)"/>')

    # "API" text in header
    hdr_text_x = round(HX + HW / 2, 1)
    hdr_text_y = round(HY + H_HEADER / 2 + 5, 1)
    L.append(
        f'        <text x="{hdr_text_x}" y="{hdr_text_y}" text-anchor="middle"'
        f' font-size="13" font-weight="700" font-family="sans-serif"'
        f' letter-spacing="2" fill="#ffffff">API</text>'
    )

    # GET method badge
    badge_y = HY + H_HEADER + 10
    L.append(f'        <rect x="{HX + 10}" y="{badge_y}" width="36" height="14" rx="7" fill="#f97316"/>')
    L.append(
        f'        <text x="{HX + 28}" y="{badge_y + 10}" text-anchor="middle"'
        f' font-size="8" font-weight="700" font-family="monospace" fill="#ffffff">GET</text>'
    )

    # URL bar next to badge
    L.append(f'        <rect x="{HX + 52}" y="{badge_y + 3}" width="98" height="8" rx="4" fill="#e2e8f0"/>')

    # Response preview lines
    r1y = badge_y + 24
    L.append(f'        <rect x="{HX + 10}" y="{r1y}" width="{HW - 20}" height="6" rx="3" fill="#e2e8f0"/>')
    L.append(f'        <rect x="{HX + 10}" y="{r1y + 12}" width="{int((HW - 20) * 0.72)}" height="6" rx="3" fill="#e2e8f0"/>')

    # 200 OK status badge
    ok_y = r1y + 26
    L.append(f'        <rect x="{HX + 10}" y="{ok_y}" width="52" height="14" rx="7" fill="#34d399"/>')
    L.append(
        f'        <text x="{HX + 36}" y="{ok_y + 10}" text-anchor="middle"'
        f' font-size="8" font-weight="700" font-family="monospace" fill="#ffffff">200 OK</text>'
    )
    L.append('    </g>')

    # ── Client node ───────────────────────────────────────────────────────────
    L.append('')
    L.append('    <!-- Client node -->')
    L.append(f'    <g class="page-svg__layer page-svg__layer--bubble1" filter="url(#apiShadow)">')
    L.append(f'        <rect x="{CX}" y="{CY}" width="{CW}" height="{CH}" rx="10" fill="#ffffff"/>')

    # Small coloured dot + label
    L.append(f'        <circle cx="{CX + 14}" cy="{CY + 14}" r="8" fill="rgba(249,115,22,0.12)"/>')
    L.append(f'        <circle cx="{CX + 14}" cy="{CY + 14}" r="4" fill="#f97316"/>')
    label_x = CX + 26
    label_w = CW - 34
    L.append(f'        <rect x="{label_x}" y="{CY + 8}" width="{label_w}" height="11" rx="4" fill="#1e3a5f" opacity="0.9"/>')
    L.append(
        f'        <text x="{round(label_x + label_w / 2, 1)}" y="{CY + 17}" text-anchor="middle"'
        f' font-size="7" font-weight="700" font-family="sans-serif" fill="#ffffff">CLIENT</text>'
    )

    # Text lines (content placeholder)
    for i, frac in enumerate([1.0, 0.70, 0.85]):
        L.append(
            f'        <rect x="{CX + 8}" y="{CY + 34 + i * 10}" width="{int((CW - 16) * frac)}"'
            f' height="5" rx="2" fill="#e2e8f0"/>'
        )
    L.append('    </g>')

    # ── Database node ─────────────────────────────────────────────────────────
    L.append('')
    L.append('    <!-- Database node -->')
    L.append(f'    <g class="page-svg__layer page-svg__layer--bubble2" filter="url(#apiShadow)">')
    L.append(f'        <rect x="{DX}" y="{DY}" width="{DW}" height="{DH}" rx="10" fill="url(#apiGrad1)"/>')
    L.append(
        f'        <text x="{round(DX + DW / 2, 1)}" y="{DY + 16}" text-anchor="middle"'
        f' font-size="7.5" font-weight="700" font-family="sans-serif"'
        f' fill="rgba(255,255,255,0.95)" letter-spacing="0.5">DATABASE</text>'
    )
    for i, frac in enumerate([1.0, 0.72, 0.88]):
        opacity = 0.45 if i == 0 else 0.30
        L.append(
            f'        <rect x="{DX + 10}" y="{DY + 26 + i * 10}" width="{int((DW - 20) * frac)}"'
            f' height="5" rx="2" fill="rgba(255,255,255,{opacity})"/>'
        )
    L.append('    </g>')

    # ── Service node ──────────────────────────────────────────────────────────
    L.append('')
    L.append('    <!-- Service node -->')
    L.append(f'    <g class="page-svg__layer page-svg__layer--node3" filter="url(#apiShadow)">')
    L.append(f'        <rect x="{SX}" y="{SY}" width="{SW}" height="{SH}" rx="10" fill="#ffffff"/>')

    # Navy header (rounded top only)
    svc_hdr = top_rounded_rect(SX, SY, SW, 20, 8)
    L.append(f'        <path d="{svc_hdr}" fill="url(#apiGradNav)"/>')
    L.append(
        f'        <text x="{round(SX + SW / 2, 1)}" y="{SY + 13}" text-anchor="middle"'
        f' font-size="7.5" font-weight="700" font-family="sans-serif" fill="#ffffff">SERVICE</text>'
    )
    for i, frac in enumerate([1.0, 0.75, 0.90]):
        L.append(
            f'        <rect x="{SX + 8}" y="{SY + 28 + i * 10}" width="{int((SW - 16) * frac)}"'
            f' height="5" rx="2" fill="#e2e8f0"/>'
        )
    L.append('    </g>')

    # ── Floating HTTP method badges ───────────────────────────────────────────
    L.append('')
    L.append('    <!-- HTTP method pill badges -->')
    L.append('    <g class="page-svg__layer page-svg__layer--icons">')

    # POST (blue) — floats above the client→hub line
    L.append('        <rect x="63" y="82" width="38" height="14" rx="7" fill="#3b82f6"/>')
    L.append(
        '        <text x="82" y="92" text-anchor="middle"'
        ' font-size="7.5" font-weight="700" font-family="monospace" fill="#ffffff">POST</text>'
    )

    # PUT (violet) — floats between hub right and service node
    L.append('        <rect x="290" y="162" width="32" height="14" rx="7" fill="#a78bfa"/>')
    L.append(
        '        <text x="306" y="172" text-anchor="middle"'
        ' font-size="7.5" font-weight="700" font-family="monospace" fill="#ffffff">PUT</text>'
    )
    L.append('    </g>')

    # ── Floating dots ─────────────────────────────────────────────────────────
    L.append('')
    L.append('    <!-- Floating accent dots -->')
    L.append('    <g class="page-svg__layer page-svg__layer--dots">')
    L.append('        <circle cx="190" cy="52" r="4" fill="#f97316" opacity="0.6"/>')
    L.append('        <circle cx="338" cy="152" r="3" fill="#ffffff" opacity="0.5"/>')
    L.append('        <circle cx="26" cy="172" r="4" fill="#f97316" opacity="0.4"/>')
    L.append('        <circle cx="224" cy="285" r="3" fill="#ffffff" opacity="0.4"/>')
    L.append('    </g>')

    L.append('')
    L.append('</svg>')

    return '\n'.join(L)


if __name__ == '__main__':
    print(generate())
