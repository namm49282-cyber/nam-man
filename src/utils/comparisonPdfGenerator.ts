import { jsPDF } from 'jspdf';
import { TEAM_CREDITS_I18N } from '../components/TeamCreditsModal';
import { COMPARISON_STRINGS } from '../i18n/comparisonStrings';
import { CONSERVATION_STRINGS } from '../i18n/conservationStrings';
import { PRESET_METADATA } from '../i18n/domainTranslations';
import { UI_STRINGS } from '../i18n/uiStrings';
import {
  ArtifactComparisonReport,
  ArtifactInspectionInput,
  DocumentedArtifact,
  LocaleCode,
  RiskSeverity,
} from '../types/artifact';
import {
  getBaselineProfileForArtifact,
  getRegisteredInventoryCode,
} from './conditionComparisonEngine';
import { getCountryDisplayName } from './worldCountries';

const PAGE_W = 1654; // A4 width at ~200 DPI
const PAGE_H = 2339; // A4 height at ~200 DPI
const MARGIN_X = 76;
const CONTENT_W = PAGE_W - MARGIN_X * 2;

function tokenizeForWrap(text: string): string[] {
  const rawParts = text.trim().split(/(\s+)/);
  const tokens: string[] = [];
  const cjkRegex = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/;

  for (const part of rawParts) {
    if (!part) continue;
    if (/^\s+$/.test(part)) {
      tokens.push(' ');
    } else if (cjkRegex.test(part) && part.length > 1) {
      for (const ch of Array.from(part)) {
        tokens.push(ch);
      }
    } else {
      tokens.push(part);
    }
  }
  return tokens;
}

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const clean = (text || '—').replace(/\s+/g, ' ').trim();
  if (!clean) return ['—'];

  const tokens = tokenizeForWrap(clean);
  const lines: string[] = [];
  let current = '';

  for (const tk of tokens) {
    if (tk === ' ' && !current) continue;
    const candidate = current + tk;
    if (
      ctx.measureText(candidate).width > maxWidth &&
      current.trim().length > 0
    ) {
      lines.push(current.trim());
      if (lines.length >= maxLines) {
        lines[maxLines - 1] = `${lines[maxLines - 1].replace(
          /[.,،؛\s]+$/,
          ''
        )}…`;
        return lines;
      }
      current = tk === ' ' ? '' : tk;
    } else {
      current = candidate;
    }
  }

  if (current.trim().length > 0 && lines.length < maxLines) {
    lines.push(current.trim());
  }
  return lines.length > 0 ? lines : ['—'];
}

function drawLines(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  anchorX: number,
  startY: number,
  lineHeight: number
): number {
  let y = startY;
  for (const ln of lines) {
    ctx.fillText(ln, anchorX, y);
    y += lineHeight;
  }
  return y;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawPageFrame(
  ctx: CanvasRenderingContext2D,
  isRtl: boolean,
  hasHazards: boolean,
  footerLeft: string,
  footerRight: string
) {
  ctx.fillStyle = '#FBF9F5';
  ctx.fillRect(0, 0, PAGE_W, PAGE_H);

  ctx.strokeStyle = hasHazards ? '#DC2626' : '#C89E54';
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, PAGE_W - 72, PAGE_H - 72);

  ctx.strokeStyle = hasHazards ? '#991B1B' : '#0F4C45';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(48, 48, PAGE_W - 96, PAGE_H - 96);

  ctx.strokeStyle = '#DED4C3';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(MARGIN_X, PAGE_H - 104);
  ctx.lineTo(PAGE_W - MARGIN_X, PAGE_H - 104);
  ctx.stroke();

  ctx.save();
  ctx.font = '500 15.5px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
  ctx.fillStyle = hasHazards ? '#991B1B' : '#5C5247';
  ctx.direction = isRtl ? 'rtl' : 'ltr';
  ctx.textAlign = isRtl ? 'right' : 'left';
  ctx.fillText(
    footerLeft,
    isRtl ? PAGE_W - MARGIN_X : MARGIN_X,
    PAGE_H - 70
  );

  ctx.font = '700 17px "IBM Plex Mono", "Manrope", "Readex Pro", sans-serif';
  ctx.fillStyle = hasHazards ? '#B91C1C' : '#0F4C45';
  ctx.textAlign = isRtl ? 'left' : 'right';
  ctx.fillText(
    footerRight,
    isRtl ? MARGIN_X : PAGE_W - MARGIN_X,
    PAGE_H - 70
  );
  ctx.restore();
}

function drawSectionHeading(
  ctx: CanvasRenderingContext2D,
  y: number,
  title: string,
  isRtl: boolean,
  redAccent = false
): number {
  drawRoundedRect(ctx, MARGIN_X, y, CONTENT_W, 44, 10);
  ctx.fillStyle = redAccent ? '#FEE2E2' : '#EFE8DA';
  ctx.fill();
  ctx.strokeStyle = redAccent ? '#DC2626' : '#D5C7AE';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.save();
  ctx.direction = isRtl ? 'rtl' : 'ltr';
  ctx.textAlign = isRtl ? 'right' : 'left';
  ctx.fillStyle = redAccent ? '#991B1B' : '#0F4C45';
  ctx.font = '700 20px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
  ctx.fillText(
    title,
    isRtl ? PAGE_W - MARGIN_X - 20 : MARGIN_X + 20,
    y + 29
  );
  ctx.restore();

  return y + 58;
}

function getSeverityColors(sev: RiskSeverity) {
  if (sev === 'hazard') {
    return {
      rowBg: '#FEF2F2',
      badgeBg: '#DC2626',
      badgeBorder: '#991B1B',
      badgeText: '#FFFFFF',
      deltaText: '#B91C1C',
      cardBg: '#FFF8F8',
      cardBorder: '#DC2626',
      headerBg: '#FEE2E2',
      headerText: '#991B1B',
      barFill: '#DC2626',
    };
  }
  if (sev === 'caution') {
    return {
      rowBg: '#FFFBEB',
      badgeBg: '#FEF3C7',
      badgeBorder: '#D97706',
      badgeText: '#92400E',
      deltaText: '#B45309',
      cardBg: '#FFFDF7',
      cardBorder: '#D97706',
      headerBg: '#FEF3C7',
      headerText: '#92400E',
      barFill: '#D97706',
    };
  }
  return {
    rowBg: '#FFFFFF',
    badgeBg: '#E6F4EF',
    badgeBorder: '#0F4C45',
    badgeText: '#0A3E38',
    deltaText: '#0F4C45',
    cardBg: '#F7FCFA',
    cardBorder: '#0F4C45',
    headerBg: '#E6F4EF',
    headerText: '#0F4C45',
    barFill: '#0F4C45',
  };
}

export async function exportComparisonAndRecommendationsPdf(
  artifact: DocumentedArtifact,
  current: ArtifactInspectionInput,
  report: ArtifactComparisonReport,
  locale: LocaleCode
): Promise<void> {
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Continue safely
    }
  }

  const isRtl = locale === 'ar';
  const cs = COMPARISON_STRINGS[locale];
  const c = CONSERVATION_STRINGS[locale];
  const t = UI_STRINGS[locale];
  const teamCredits = TEAM_CREDITS_I18N[locale];

  const hasHazards = report.hazardCount > 0;
  const presetMeta = artifact.presetKey
    ? PRESET_METADATA[artifact.presetKey]?.[locale]
    : undefined;
  const displayTitle = presetMeta ? presetMeta.title : artifact.titleAr;
  const displayPeriod = presetMeta ? presetMeta.period : artifact.periodAr;
  const baseEnv = getBaselineProfileForArtifact(artifact, locale);
  const matLabel = c.materialClasses[baseEnv.materialClass];
  const regInvCode = getRegisteredInventoryCode(artifact);
  const countryName = getCountryDisplayName(
    current.countryCode || artifact.countryCode || 'BH',
    locale
  );

  const localeDateMap: Record<LocaleCode, string> = {
    ar: 'ar-SA',
    'en-US': 'en-US',
    fr: 'fr-FR',
    zh: 'zh-CN',
    ru: 'ru-RU',
  };
  const formattedDate = new Date().toLocaleDateString(localeDateMap[locale], {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  // Chunk recommendations by 4 per page so Page 2+ always has generous room for structured cards + Official Seal
  const recChunks: Array<typeof report.recommendations> = [];
  for (let i = 0; i < report.recommendations.length; i += 4) {
    recChunks.push(report.recommendations.slice(i, i + 4));
  }
  if (recChunks.length === 0) {
    recChunks.push([]);
  }
  const totalPages = 1 + recChunks.length;

  // =========================================================================
  // PAGE 1: BANNER, AUTHENTICITY + 3-HORIZON FORECAST & 11-ROW COMPARISON TABLE
  // =========================================================================
  const page1 = document.createElement('canvas');
  page1.width = PAGE_W;
  page1.height = PAGE_H;
  const ctx1 = page1.getContext('2d');
  if (!ctx1) return;

  drawPageFrame(
    ctx1,
    isRtl,
    hasHazards,
    cs.pdfFooterDisclaimer,
    cs.pdfPageOf(1, totalPages)
  );

  // 1. Header Banner (y=66, h=198 -> ends at 264)
  const bannerY = 66;
  const bannerH = 198;
  drawRoundedRect(ctx1, MARGIN_X, bannerY, CONTENT_W, bannerH, 16);
  const grad = ctx1.createLinearGradient(
    MARGIN_X,
    bannerY,
    MARGIN_X,
    bannerY + bannerH
  );
  if (hasHazards) {
    grad.addColorStop(0, '#8E1717');
    grad.addColorStop(1, '#580D0D');
  } else {
    grad.addColorStop(0, '#14554E');
    grad.addColorStop(1, '#0A3530');
  }
  ctx1.fillStyle = grad;
  ctx1.fill();
  ctx1.strokeStyle = hasHazards ? '#FCA5A5' : '#C89E54';
  ctx1.lineWidth = 2.4;
  ctx1.stroke();

  const headerAnchorX = isRtl ? PAGE_W - MARGIN_X - 30 : MARGIN_X + 30;
  ctx1.save();
  ctx1.direction = isRtl ? 'rtl' : 'ltr';
  ctx1.textAlign = isRtl ? 'right' : 'left';

  ctx1.fillStyle = hasHazards ? '#FECACA' : '#F3D28C';
  ctx1.font = '700 16px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
  ctx1.fillText(cs.pdfDocKicker, headerAnchorX, bannerY + 38);

  ctx1.fillStyle = '#FFFFFF';
  ctx1.font =
    '700 33px "Cormorant Garamond", "Amiri", "Noto Serif SC", Georgia, serif';
  const titleLines = wrapCanvasText(ctx1, cs.pdfDocTitle, CONTENT_W - 60, 1);
  drawLines(ctx1, titleLines, headerAnchorX, bannerY + 82, 38);

  ctx1.fillStyle = hasHazards ? '#FEE2E2' : '#DCEAE7';
  ctx1.font = '500 16px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
  const subLines = wrapCanvasText(ctx1, cs.pdfDocSubtitle, CONTENT_W - 60, 2);
  drawLines(ctx1, subLines, headerAnchorX, bannerY + 114, 22);

  ctx1.strokeStyle = 'rgba(255,255,255,0.26)';
  ctx1.beginPath();
  ctx1.moveTo(MARGIN_X + 26, bannerY + 150);
  ctx1.lineTo(PAGE_W - MARGIN_X - 26, bannerY + 150);
  ctx1.stroke();

  ctx1.fillStyle = '#FFFFFF';
  ctx1.font = '700 16px "IBM Plex Mono", "Manrope", "Readex Pro", sans-serif';
  const stripSummary = [
    `${artifact.accessionCode}`,
    `${cs.kpiAuthenticityScore}: ${report.authenticityScorePct}%`,
    `${cs.kpiCurrentScore}: ${report.currentStabilityPct}%`,
    `${cs.kpiPredictedRiskIndex}: ${report.predictedDegradationIndexPct}%`,
    `${cs.kpiRedHazardsCount}: ${report.hazardCount}`,
  ].join('   ·   ');
  ctx1.fillText(stripSummary, headerAnchorX, bannerY + 180);
  ctx1.restore();

  // 2. SECTION I: AUTHENTICITY VERDICT & 3-HORIZON PREDICTIVE RISK CHART
  let curY = bannerY + bannerH + 18; // 282
  curY = drawSectionHeading(ctx1, curY, cs.pdfSec1Title, isRtl, hasHazards); // 340

  const sec1BoxH = 308;
  drawRoundedRect(ctx1, MARGIN_X, curY, CONTENT_W, sec1BoxH, 12);
  ctx1.fillStyle = '#FFFFFF';
  ctx1.fill();
  ctx1.strokeStyle = hasHazards ? '#DC2626' : '#DED4C3';
  ctx1.lineWidth = 1.6;
  ctx1.stroke();

  const halfW = (CONTENT_W - 64) / 2;
  const infoPairs: Array<[string, string, boolean]> = [
    [cs.pdfLblArtifact, `${displayTitle} (${displayPeriod})`, false],
    [
      cs.pdfLblCodeAndCountry,
      `${artifact.accessionCode} · ${regInvCode} · ${countryName} · ${matLabel}`,
      false,
    ],
    [
      cs.pdfLblAuthenticity,
      `${report.authenticityScorePct}% — ${report.authenticityVerdictText}`,
      report.authenticityStatus === 'alert_mismatch',
    ],
    [
      cs.pdfLblScoresComparison,
      `${report.baselineStabilityPct}% → ${report.currentStabilityPct}% · ${cs.kpiPredictedRiskIndex}: ${report.predictedDegradationIndexPct}% (${formattedDate})`,
      hasHazards,
    ],
  ];

  ctx1.save();
  ctx1.direction = isRtl ? 'rtl' : 'ltr';
  ctx1.textAlign = isRtl ? 'right' : 'left';

  for (let i = 0; i < infoPairs.length; i++) {
    const r = Math.floor(i / 2);
    const cIdx = i % 2;
    const cellX = isRtl
      ? cIdx === 0
        ? MARGIN_X + 40 + halfW
        : MARGIN_X + 24
      : cIdx === 0
      ? MARGIN_X + 24
      : MARGIN_X + 40 + halfW;
    const anchorX = isRtl ? cellX + halfW : cellX;
    const cellY = curY + 18 + r * 66;

    ctx1.fillStyle = '#6E6357';
    ctx1.font = '600 14.5px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
    ctx1.fillText(infoPairs[i][0], anchorX, cellY + 15);

    ctx1.fillStyle = infoPairs[i][2] ? '#B91C1C' : '#1C1814';
    ctx1.font = '700 17.5px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
    const vLines = wrapCanvasText(ctx1, infoPairs[i][1], halfW - 10, 1);
    drawLines(ctx1, vLines, anchorX, cellY + 41, 22);
  }

  // Hairline divider above 3-Horizon Visual Risk Forecast Strip
  const forecastBaseY = curY + 154;
  ctx1.strokeStyle = '#EAE1D2';
  ctx1.lineWidth = 1.2;
  ctx1.beginPath();
  ctx1.moveTo(MARGIN_X + 22, forecastBaseY);
  ctx1.lineTo(PAGE_W - MARGIN_X - 22, forecastBaseY);
  ctx1.stroke();

  const fTitleAnchor = isRtl ? PAGE_W - MARGIN_X - 24 : MARGIN_X + 24;
  ctx1.fillStyle = '#0F4C45';
  ctx1.font = '700 15.5px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
  ctx1.fillText(cs.pdfForecastStripTitle, fTitleAnchor, forecastBaseY + 24);
  ctx1.restore();

  // Draw 3 Visual Risk Prediction Horizon Cards side-by-side
  const hzGap = 16;
  const hzCardW = (CONTENT_W - 48 - hzGap * 2) / 3;
  const hzCardH = 104;
  const hzCardY = forecastBaseY + 36;

  for (let hIdx = 0; hIdx < report.riskHorizons.length; hIdx++) {
    const hz = report.riskHorizons[hIdx];
    const pal = getSeverityColors(hz.severity);
    const orderedIdx = isRtl ? 2 - hIdx : hIdx;
    const hx = MARGIN_X + 24 + orderedIdx * (hzCardW + hzGap);

    drawRoundedRect(ctx1, hx, hzCardY, hzCardW, hzCardH, 10);
    ctx1.fillStyle = pal.cardBg;
    ctx1.fill();
    ctx1.strokeStyle = pal.cardBorder;
    ctx1.lineWidth = hz.severity === 'hazard' ? 2 : 1.3;
    ctx1.stroke();

    ctx1.save();
    ctx1.direction = isRtl ? 'rtl' : 'ltr';
    ctx1.textAlign = isRtl ? 'right' : 'left';
    const hAnchor = isRtl ? hx + hzCardW - 14 : hx + 14;
    const hOpp = isRtl ? hx + 14 : hx + hzCardW - 14;

    ctx1.fillStyle = hz.severity === 'hazard' ? '#991B1B' : '#1C1814';
    ctx1.font = '700 15.5px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
    ctx1.fillText(
      wrapCanvasText(ctx1, hz.horizonLabel, hzCardW - 110, 1)[0],
      hAnchor,
      hzCardY + 27
    );

    ctx1.textAlign = isRtl ? 'left' : 'right';
    ctx1.fillStyle = pal.deltaText;
    ctx1.font = '700 18px "IBM Plex Mono", monospace';
    ctx1.fillText(`${hz.riskProbabilityPct}%`, hOpp, hzCardY + 28);

    // Progress Bar inside Horizon Card
    const barX = hx + 14;
    const barY = hzCardY + 42;
    const barW = hzCardW - 28;
    drawRoundedRect(ctx1, barX, barY, barW, 12, 6);
    ctx1.fillStyle = '#E8DFCF';
    ctx1.fill();

    const fillW = Math.max(
      12,
      Math.round((barW * hz.riskProbabilityPct) / 100)
    );
    drawRoundedRect(ctx1, barX, barY, fillW, 12, 6);
    ctx1.fillStyle = pal.barFill;
    ctx1.fill();

    // Primary Driver summary line
    ctx1.textAlign = isRtl ? 'right' : 'left';
    ctx1.fillStyle = '#4A423A';
    ctx1.font = '600 13.5px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
    ctx1.fillText(
      wrapCanvasText(ctx1, hz.primaryDriver, hzCardW - 28, 1)[0],
      hAnchor,
      hzCardY + 82
    );
    ctx1.restore();
  }

  // 3. SECTION II: SIDE-BY-SIDE COMPARISON TABLE (RED HAZARDS HIGHLIGHTED)
  curY += sec1BoxH + 18; // 666
  curY = drawSectionHeading(ctx1, curY, cs.pdfSec2Title, isRtl, hasHazards); // 724

  const wP = 300;
  const wReg = 362;
  const wCur = 330;
  const wDel = 280;
  const wSt = 230;

  const cols = isRtl
    ? (() => {
        const right = PAGE_W - MARGIN_X;
        const c1 = { x: right - wP, w: wP };
        const c2 = { x: c1.x - wReg, w: wReg };
        const c3 = { x: c2.x - wCur, w: wCur };
        const c4 = { x: c3.x - wDel, w: wDel };
        const c5 = { x: c4.x - wSt, w: wSt };
        return { c1, c2, c3, c4, c5 };
      })()
    : (() => {
        const c1 = { x: MARGIN_X, w: wP };
        const c2 = { x: c1.x + wP, w: wReg };
        const c3 = { x: c2.x + wReg, w: wCur };
        const c4 = { x: c3.x + wCur, w: wDel };
        const c5 = { x: c4.x + wDel, w: wSt };
        return { c1, c2, c3, c4, c5 };
      })();

  const tblHeaderH = 52;
  const rowH = 144;
  const totalTblH = tblHeaderH + report.rows.length * rowH;

  drawRoundedRect(ctx1, MARGIN_X, curY, CONTENT_W, totalTblH, 12);
  ctx1.fillStyle = '#FFFFFF';
  ctx1.fill();

  ctx1.fillStyle = '#EDE4D3';
  ctx1.fillRect(MARGIN_X + 2, curY + 2, CONTENT_W - 4, tblHeaderH);

  const cellAnchor = (col: { x: number; w: number }) =>
    isRtl ? col.x + col.w - 14 : col.x + 14;

  ctx1.save();
  ctx1.direction = isRtl ? 'rtl' : 'ltr';
  ctx1.textAlign = isRtl ? 'right' : 'left';
  ctx1.fillStyle = '#2C2620';
  ctx1.font = '700 16px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';

  ctx1.fillText(cs.colParam, cellAnchor(cols.c1), curY + 33);
  ctx1.fillText(cs.colRegistered, cellAnchor(cols.c2), curY + 33);
  ctx1.fillText(cs.colCurrent, cellAnchor(cols.c3), curY + 33);
  ctx1.fillText(cs.colDelta, cellAnchor(cols.c4), curY + 33);
  ctx1.fillText(cs.colRiskStatus, cellAnchor(cols.c5), curY + 33);

  for (let idx = 0; idx < report.rows.length; idx++) {
    const row = report.rows[idx];
    const pal = getSeverityColors(row.severity);
    const ry = curY + tblHeaderH + idx * rowH;

    if (row.severity === 'hazard') {
      ctx1.fillStyle = pal.rowBg;
      ctx1.fillRect(MARGIN_X + 2, ry, CONTENT_W - 4, rowH);
    } else if (row.severity === 'caution') {
      ctx1.fillStyle = pal.rowBg;
      ctx1.fillRect(MARGIN_X + 2, ry, CONTENT_W - 4, rowH);
    } else if (idx % 2 === 1) {
      ctx1.fillStyle = '#FAF7F1';
      ctx1.fillRect(MARGIN_X + 2, ry, CONTENT_W - 4, rowH);
    }

    ctx1.strokeStyle = row.severity === 'hazard' ? '#FCA5A5' : '#E5DDD0';
    ctx1.lineWidth = 1.2;
    ctx1.beginPath();
    ctx1.moveTo(MARGIN_X, ry);
    ctx1.lineTo(PAGE_W - MARGIN_X, ry);
    ctx1.stroke();

    // Col 1: Parameter Title
    ctx1.fillStyle =
      row.severity === 'hazard'
        ? '#991B1B'
        : row.key === 'authenticity'
        ? '#0F4C45'
        : '#1C1814';
    ctx1.font = '700 17px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
    const pLines = wrapCanvasText(
      ctx1,
      `${row.numLabel}. ${row.parameterTitle}`,
      cols.c1.w - 28,
      2
    );
    drawLines(ctx1, pLines, cellAnchor(cols.c1), ry + 50, 26);

    // Col 2: Registered Baseline
    ctx1.fillStyle = '#4A423A';
    ctx1.font = '600 16px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
    const regLines = wrapCanvasText(
      ctx1,
      row.baselineValueText,
      cols.c2.w - 28,
      2
    );
    drawLines(ctx1, regLines, cellAnchor(cols.c2), ry + 50, 26);

    // Col 3: Current Verified Reading
    ctx1.fillStyle = row.severity === 'hazard' ? '#B91C1C' : '#1C1814';
    ctx1.font = '700 17px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
    const curLines = wrapCanvasText(
      ctx1,
      row.currentValueText,
      cols.c3.w - 28,
      2
    );
    drawLines(ctx1, curLines, cellAnchor(cols.c3), ry + 50, 26);

    // Col 4: Variance / Delta
    ctx1.fillStyle = pal.deltaText;
    ctx1.font = '700 16.5px "IBM Plex Mono", "Manrope", "Readex Pro", sans-serif';
    const delLines = wrapCanvasText(ctx1, row.deltaText, cols.c4.w - 28, 2);
    drawLines(ctx1, delLines, cellAnchor(cols.c4), ry + 50, 26);

    // Col 5: Risk Status Badge (Solid Crimson Red for Hazards)
    const bW = cols.c5.w - 28;
    const bX = cols.c5.x + 14;
    const bY = ry + 48;
    drawRoundedRect(ctx1, bX, bY, bW, 46, 8);
    ctx1.fillStyle = pal.badgeBg;
    ctx1.fill();
    ctx1.strokeStyle = pal.badgeBorder;
    ctx1.lineWidth = 1.6;
    ctx1.stroke();

    ctx1.save();
    ctx1.textAlign = 'center';
    ctx1.fillStyle = pal.badgeText;
    ctx1.font = '700 15.5px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
    const badgeLine = wrapCanvasText(ctx1, row.riskSummaryText, bW - 14, 1)[0];
    ctx1.fillText(badgeLine, bX + bW / 2, bY + 29);
    ctx1.restore();
  }

  // Vertical column dividers
  ctx1.strokeStyle = '#DED4C3';
  ctx1.lineWidth = 1.1;
  const vDivs = isRtl
    ? [cols.c1.x, cols.c2.x, cols.c3.x, cols.c4.x]
    : [cols.c2.x, cols.c3.x, cols.c4.x, cols.c5.x];
  for (const vx of vDivs) {
    ctx1.beginPath();
    ctx1.moveTo(vx, curY);
    ctx1.lineTo(vx, curY + totalTblH);
    ctx1.stroke();
  }

  drawRoundedRect(ctx1, MARGIN_X, curY, CONTENT_W, totalTblH, 12);
  ctx1.strokeStyle = hasHazards ? '#DC2626' : '#C89E54';
  ctx1.lineWidth = 2;
  ctx1.stroke();

  // Bottom Executive Red Alert / Certified Safe Callout Strip on Page 1
  const calloutY = curY + totalTblH + 18;
  drawRoundedRect(ctx1, MARGIN_X, calloutY, CONTENT_W, 74, 10);
  ctx1.fillStyle = hasHazards ? '#FEE2E2' : '#E6F4EF';
  ctx1.fill();
  ctx1.strokeStyle = hasHazards ? '#DC2626' : '#0F4C45';
  ctx1.lineWidth = 2;
  ctx1.stroke();

  const alertAnchor = isRtl ? PAGE_W - MARGIN_X - 24 : MARGIN_X + 24;
  ctx1.fillStyle = hasHazards ? '#991B1B' : '#0A3E38';
  ctx1.font = '700 18px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
  const bannerMsg = hasHazards
    ? cs.pdfRedAlertBanner(report.hazardCount)
    : cs.pdfSafeBanner;
  const alertLines = wrapCanvasText(ctx1, bannerMsg, CONTENT_W - 48, 2);
  drawLines(ctx1, alertLines, alertAnchor, calloutY + 30, 24);
  ctx1.restore();

  // =========================================================================
  // PAGE 2+: CREATIVE CONSERVATION RECOMMENDATIONS & OFFICIAL SEAL
  // =========================================================================
  const extraPages: HTMLCanvasElement[] = [];

  for (let pIdx = 0; pIdx < recChunks.length; pIdx++) {
    const chunk = recChunks[pIdx];
    const isLastPage = pIdx === recChunks.length - 1;
    const pageNum = 2 + pIdx;

    const pCanvas = document.createElement('canvas');
    pCanvas.width = PAGE_W;
    pCanvas.height = PAGE_H;
    const pCtx = pCanvas.getContext('2d');
    if (!pCtx) continue;

    drawPageFrame(
      pCtx,
      isRtl,
      hasHazards,
      `${teamCredits.prominentStatement} — ${t.brandName}`,
      cs.pdfPageOf(pageNum, totalPages)
    );

    // Running Header
    const runY = 68;
    drawRoundedRect(pCtx, MARGIN_X, runY, CONTENT_W, 84, 12);
    pCtx.fillStyle = hasHazards ? '#8E1717' : '#0F4C45';
    pCtx.fill();
    pCtx.strokeStyle = hasHazards ? '#FCA5A5' : '#C89E54';
    pCtx.lineWidth = 2;
    pCtx.stroke();

    pCtx.save();
    pCtx.direction = isRtl ? 'rtl' : 'ltr';
    pCtx.textAlign = isRtl ? 'right' : 'left';
    const rAnchor = isRtl ? PAGE_W - MARGIN_X - 26 : MARGIN_X + 26;

    pCtx.fillStyle = hasHazards ? '#FECACA' : '#F3D28C';
    pCtx.font = '700 15.5px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
    pCtx.fillText(
      `${cs.pdfDocTitle} · ${artifact.accessionCode} · ${countryName}`,
      rAnchor,
      runY + 32
    );

    pCtx.fillStyle = '#FFFFFF';
    pCtx.font =
      '700 23px "Cormorant Garamond", "Amiri", "Noto Serif SC", Georgia, serif';
    const rTitle = wrapCanvasText(pCtx, displayTitle, CONTENT_W - 52, 1)[0];
    pCtx.fillText(rTitle, rAnchor, runY + 66);
    pCtx.restore();

    let py = runY + 104; // 172
    py = drawSectionHeading(pCtx, py, cs.pdfSec3Title, isRtl, hasHazards); // 230

    // Render Structured Conservation Action Cards (max 4 per page -> generous spacing)
    const cardH = 312;
    for (let k = 0; k < chunk.length; k++) {
      const rec = chunk[k];
      const globalIdx = pIdx * 4 + k + 1;
      const pal = getSeverityColors(rec.severity);

      drawRoundedRect(pCtx, MARGIN_X, py, CONTENT_W, cardH, 12);
      pCtx.fillStyle = pal.cardBg;
      pCtx.fill();
      pCtx.strokeStyle = pal.cardBorder;
      pCtx.lineWidth = rec.severity === 'hazard' ? 2.4 : 1.5;
      pCtx.stroke();

      // Card Header Strip with Priority + Response Window
      drawRoundedRect(pCtx, MARGIN_X + 2, py + 2, CONTENT_W - 4, 54, 10);
      pCtx.fillStyle = pal.headerBg;
      pCtx.fill();

      pCtx.save();
      pCtx.direction = isRtl ? 'rtl' : 'ltr';
      pCtx.textAlign = isRtl ? 'right' : 'left';
      const cAnchor = isRtl ? PAGE_W - MARGIN_X - 22 : MARGIN_X + 22;
      const oppAnchor = isRtl ? MARGIN_X + 22 : PAGE_W - MARGIN_X - 22;

      pCtx.fillStyle = pal.headerText;
      pCtx.font = '700 19px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
      const recHead = wrapCanvasText(
        pCtx,
        `${String(globalIdx).padStart(2, '0')}. ${rec.indicatorTitle} — ${rec.deviationDetail}`,
        CONTENT_W - 500,
        1
      )[0];
      pCtx.fillText(recHead, cAnchor, py + 36);

      // Priority + Response Window on opposite edge
      pCtx.textAlign = isRtl ? 'left' : 'right';
      pCtx.fillStyle = rec.severity === 'hazard' ? '#DC2626' : pal.headerText;
      pCtx.font = '700 15.5px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
      pCtx.fillText(
        `${rec.priorityBadge}  ·  ${rec.responseWindow}`,
        oppAnchor,
        py + 36
      );

      // Sub-Box 1: Potential Damage (Highlighted in Crimson Red for Hazards)
      const dmgBoxY = py + 68;
      drawRoundedRect(pCtx, MARGIN_X + 18, dmgBoxY, CONTENT_W - 36, 102, 8);
      pCtx.fillStyle = rec.severity === 'hazard' ? '#FEE2E2' : '#FAF7F1';
      pCtx.fill();
      pCtx.strokeStyle = rec.severity === 'hazard' ? '#FCA5A5' : '#E5DDD0';
      pCtx.lineWidth = 1.2;
      pCtx.stroke();

      pCtx.textAlign = isRtl ? 'right' : 'left';
      pCtx.fillStyle = rec.severity === 'hazard' ? '#DC2626' : '#92400E';
      pCtx.font = '700 16px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
      pCtx.fillText(cs.lblPotentialDamage, cAnchor, dmgBoxY + 26);

      pCtx.fillStyle = rec.severity === 'hazard' ? '#991B1B' : '#4A423A';
      pCtx.font = '600 17px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
      const dmgLines = wrapCanvasText(
        pCtx,
        rec.potentialDamage,
        CONTENT_W - 68,
        2
      );
      drawLines(pCtx, dmgLines, cAnchor, dmgBoxY + 54, 24);

      // Sub-Box 2: Scientific Preventive Action Protocol
      const actBoxY = py + 180;
      drawRoundedRect(pCtx, MARGIN_X + 18, actBoxY, CONTENT_W - 36, 116, 8);
      pCtx.fillStyle = '#FFFFFF';
      pCtx.fill();
      pCtx.strokeStyle = '#D5E5E1';
      pCtx.lineWidth = 1.2;
      pCtx.stroke();

      pCtx.fillStyle = '#0F4C45';
      pCtx.font = '700 16px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
      pCtx.fillText(cs.lblImmediateAction, cAnchor, actBoxY + 26);

      pCtx.fillStyle = '#1C1814';
      pCtx.font = '600 17.5px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
      const actLines = wrapCanvasText(
        pCtx,
        rec.urgentAction,
        CONTENT_W - 68,
        3
      );
      drawLines(pCtx, actLines, cAnchor, actBoxY + 54, 24);
      pCtx.restore();

      py += cardH + 18;
    }

    // On final page, draw Section IV: Field Verification Notes & Official Conservation Sign-Off + Seal
    if (isLastPage && py < PAGE_H - 400) {
      py += 6;
      py = drawSectionHeading(pCtx, py, cs.pdfSec4Title, isRtl, false);

      const signH = Math.min(286, PAGE_H - 135 - py);
      const gap = 22;
      const boxW = (CONTENT_W - gap * 2) / 3;
      const xs = [MARGIN_X, MARGIN_X + boxW + gap, MARGIN_X + (boxW + gap) * 2];
      const inspX = isRtl ? xs[2] : xs[0];
      const consX = xs[1];
      const sealX = isRtl ? xs[0] : xs[2];

      const drawSignBox = (
        bx: number,
        title: string,
        sub: string,
        body: string,
        codeLine: string
      ) => {
        drawRoundedRect(pCtx, bx, py, boxW, signH, 12);
        pCtx.fillStyle = '#FFFFFF';
        pCtx.fill();
        pCtx.strokeStyle = '#DED4C3';
        pCtx.lineWidth = 1.5;
        pCtx.stroke();

        const ax = isRtl ? bx + boxW - 20 : bx + 20;
        pCtx.save();
        pCtx.direction = isRtl ? 'rtl' : 'ltr';
        pCtx.textAlign = isRtl ? 'right' : 'left';

        pCtx.fillStyle = '#0F4C45';
        pCtx.font = '700 17px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
        pCtx.fillText(
          wrapCanvasText(pCtx, title, boxW - 40, 1)[0],
          ax,
          py + 34
        );

        pCtx.fillStyle = '#6E6357';
        pCtx.font = '500 14px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
        drawLines(
          pCtx,
          wrapCanvasText(pCtx, sub, boxW - 40, 2),
          ax,
          py + 60,
          20
        );

        pCtx.fillStyle = '#1C1814';
        pCtx.font = '600 16px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
        drawLines(
          pCtx,
          wrapCanvasText(pCtx, body, boxW - 40, 3),
          ax,
          py + 116,
          22
        );

        pCtx.strokeStyle = '#C89E54';
        pCtx.setLineDash([6, 4]);
        pCtx.beginPath();
        pCtx.moveTo(bx + 20, py + signH - 56);
        pCtx.lineTo(bx + boxW - 20, py + signH - 56);
        pCtx.stroke();
        pCtx.setLineDash([]);

        pCtx.fillStyle = '#6E6357';
        pCtx.font = '600 13px "IBM Plex Mono", monospace';
        pCtx.fillText(codeLine, ax, py + signH - 25);
        pCtx.restore();
      };

      drawSignBox(
        inspX,
        cs.pdfSigInspectorTitle,
        cs.pdfSigInspectorSub,
        current.fieldNotes || cs.defaultFieldNoteSafe,
        `${artifact.accessionCode} · AUTH: ${report.authenticityScorePct}%`
      );

      drawSignBox(
        consX,
        cs.pdfSigConservatorTitle,
        cs.pdfSigConservatorSub,
        `${teamCredits.generalSupervisor.tag}: ${teamCredits.generalSupervisor.name}`,
        `RISK INDEX: ${report.predictedDegradationIndexPct}% · RED: ${report.hazardCount}`
      );

      // Official Circular Conservation Seal Box
      drawRoundedRect(pCtx, sealX, py, boxW, signH, 12);
      pCtx.fillStyle = '#FFFFFF';
      pCtx.fill();
      pCtx.strokeStyle = hasHazards ? '#DC2626' : '#C89E54';
      pCtx.lineWidth = 2;
      pCtx.stroke();

      const scx = sealX + boxW / 2;
      const scy = py + signH / 2 + 6;
      const sr = Math.min(82, signH / 2 - 24);
      const sealColor = hasHazards ? '#DC2626' : '#0F4C45';

      pCtx.save();
      pCtx.textAlign = 'center';
      pCtx.beginPath();
      pCtx.arc(scx, scy, sr, 0, Math.PI * 2);
      pCtx.fillStyle = hasHazards
        ? 'rgba(220, 38, 38, 0.08)'
        : 'rgba(15, 76, 69, 0.06)';
      pCtx.fill();
      pCtx.strokeStyle = sealColor;
      pCtx.lineWidth = 3;
      pCtx.stroke();

      pCtx.beginPath();
      pCtx.arc(scx, scy, sr - 10, 0, Math.PI * 2);
      pCtx.setLineDash([5, 4]);
      pCtx.strokeStyle = hasHazards ? '#991B1B' : '#C89E54';
      pCtx.lineWidth = 2;
      pCtx.stroke();
      pCtx.setLineDash([]);

      pCtx.fillStyle = sealColor;
      pCtx.font = '700 17.5px "Manrope", "Readex Pro", "Noto Sans SC", sans-serif';
      pCtx.fillText(
        hasHazards ? cs.pdfSealUrgentMain : cs.pdfSealSafeMain,
        scx,
        scy + 2
      );

      pCtx.fillStyle = '#5C5247';
      pCtx.font = '700 12px "IBM Plex Mono", monospace';
      pCtx.fillText(cs.pdfSealSub, scx, scy + 23);
      pCtx.fillText(
        `${artifact.accessionCode} · ${report.authenticityScorePct}%`,
        scx,
        scy + 41
      );
      pCtx.restore();
    }

    extraPages.push(pCanvas);
  }

  // Compile PDF Document
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  pdf.setProperties({
    title: `${cs.pdfDocTitle} — ${displayTitle} (${artifact.accessionCode})`,
    subject: cs.pdfDocSubtitle,
    author: teamCredits.prominentStatement,
    creator: 'Smart Guardian | الحارس الذكي',
  });

  pdf.addImage(
    page1.toDataURL('image/jpeg', 0.94),
    'JPEG',
    0,
    0,
    210,
    297,
    undefined,
    'FAST'
  );

  for (const cPage of extraPages) {
    pdf.addPage('a4', 'portrait');
    pdf.addImage(
      cPage.toDataURL('image/jpeg', 0.94),
      'JPEG',
      0,
      0,
      210,
      297,
      undefined,
      'FAST'
    );
  }

  const safeCode = artifact.accessionCode.replace(/[^a-zA-Z0-9-_]/g, '');
  pdf.save(
    `smart-guardian-authenticity-forecast-recommendations-${safeCode}-${locale}.pdf`
  );
}
