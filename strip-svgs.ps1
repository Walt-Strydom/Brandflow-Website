$dir = "c:\Users\Walt Strydom\Documents\Brandflow Website"
$nl  = "`n"  # actual newline

$allHtml = Get-ChildItem "$dir\*.html" | Select-Object -ExpandProperty FullName

foreach ($file in $allHtml) {
    $content = [System.IO.File]::ReadAllText($file)

    # ── 1. Fix any literal backtick-n left from previous run
    $content = $content -replace '`n', $nl

    # ── 2. Strip SVG child content — index.html hero svg
    $content = [System.Text.RegularExpressions.Regex]::Replace(
        $content,
        '(<svg class="hero__svg"[^>]*>)\s*([\s\S]*?)\s*(</svg>)',
        { param($m) $m.Groups[1].Value + $nl + "                        " + $m.Groups[3].Value },
        [System.Text.RegularExpressions.RegexOptions]::Multiline
    )

    # ── 3. Strip SVG child content — page hero svg
    $content = [System.Text.RegularExpressions.Regex]::Replace(
        $content,
        '(<svg class="page-hero__svg"[^>]*>)\s*([\s\S]*?)\s*(</svg>)',
        { param($m) $m.Groups[1].Value + $nl + "                        " + $m.Groups[3].Value },
        [System.Text.RegularExpressions.RegexOptions]::Multiline
    )

    [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Done: $([System.IO.Path]::GetFileName($file))"
}

Write-Host "All SVGs cleaned."
