import { CONSERVATION_STRINGS } from '../i18n/conservationStrings';
import {
  getDirectionLabel,
  getLocalizedDirections,
  PRESET_METADATA,
} from '../i18n/domainTranslations';
import { UI_STRINGS } from '../i18n/uiStrings';
import { evaluateEnvironmentalProfile } from './conservationEngine';
import { getCountryDisplayName } from './worldCountries';
import {
  CaptureDirection,
  CapturedAngleImage,
  DocumentedArtifact,
  LocaleCode,
  SurfaceMetrics,
} from '../types/artifact';

const ANALYSIS_SIZE = 160;

export function analyzeCanvasOrMediaFrame(
  source: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  sourceWidth: number,
  sourceHeight: number
): { sharpnessScore: number; brightnessPct: number; edgeReliefDensityPct: number } {
  const canvas = document.createElement('canvas');
  canvas.width = ANALYSIS_SIZE;
  canvas.height = ANALYSIS_SIZE;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx || sourceWidth === 0 || sourceHeight === 0) {
    return { sharpnessScore: 72, brightnessPct: 58, edgeReliefDensityPct: 34 };
  }

  const side = Math.min(sourceWidth, sourceHeight);
  const sx = Math.max(0, (sourceWidth - side) / 2);
  const sy = Math.max(0, (sourceHeight - side) / 2);
  ctx.drawImage(source, sx, sy, side, side, 0, 0, ANALYSIS_SIZE, ANALYSIS_SIZE);

  const { data } = ctx.getImageData(0, 0, ANALYSIS_SIZE, ANALYSIS_SIZE);
  const gray = new Float32Array(ANALYSIS_SIZE * ANALYSIS_SIZE);
  let totalLuma = 0;

  for (let i = 0; i < ANALYSIS_SIZE * ANALYSIS_SIZE; i++) {
    const idx = i * 4;
    const luma = 0.2126 * data[idx] + 0.7152 * data[idx + 1] + 0.0722 * data[idx + 2];
    gray[i] = luma;
    totalLuma += luma;
  }

  const meanBrightness = (totalLuma / (ANALYSIS_SIZE * ANALYSIS_SIZE * 255)) * 100;

  let gradSum = 0;
  let strongEdgeCount = 0;
  let sampleCount = 0;

  for (let y = 16; y < ANALYSIS_SIZE - 16; y++) {
    for (let x = 16; x < ANALYSIS_SIZE - 16; x++) {
      const tl = gray[(y - 1) * ANALYSIS_SIZE + (x - 1)];
      const tc = gray[(y - 1) * ANALYSIS_SIZE + x];
      const tr = gray[(y - 1) * ANALYSIS_SIZE + (x + 1)];
      const ml = gray[y * ANALYSIS_SIZE + (x - 1)];
      const mr = gray[y * ANALYSIS_SIZE + (x + 1)];
      const bl = gray[(y + 1) * ANALYSIS_SIZE + (x - 1)];
      const bc = gray[(y + 1) * ANALYSIS_SIZE + x];
      const br = gray[(y + 1) * ANALYSIS_SIZE + (x + 1)];

      const gx = -tl + tr - 2 * ml + 2 * mr - bl + br;
      const gy = -tl - 2 * tc - tr + bl + 2 * bc + br;
      const mag = Math.sqrt(gx * gx + gy * gy);

      gradSum += mag;
      if (mag > 85) {
        strongEdgeCount++;
      }
      sampleCount++;
    }
  }

  const avgGrad = sampleCount > 0 ? gradSum / sampleCount : 0;
  const sharpnessScore = Math.round(Math.min(99, Math.max(18, (avgGrad / 95) * 100)));
  const edgeReliefDensityPct = Math.round(
    Math.min(96, Math.max(8, (strongEdgeCount / Math.max(1, sampleCount)) * 100 * 1.45))
  );

  return {
    sharpnessScore,
    brightnessPct: Math.round(Math.min(98, Math.max(5, meanBrightness))),
    edgeReliefDensityPct,
  };
}

export async function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

export async function computeMultiAngleMetrics(
  angles: CapturedAngleImage[]
): Promise<SurfaceMetrics> {
  if (angles.length === 0) {
    return {
      totalAngles: 0,
      uniqueDirections: 0,
      angularCoveragePct: 0,
      meanSharpness: 0,
      illuminationConsistencyPct: 0,
      edgeReliefDensityPct: 0,
    };
  }

  const uniqueDirs = new Set(angles.map((a) => a.direction)).size;
  const angularCoveragePct = Math.min(
    100,
    Math.round((uniqueDirs / 4) * 80 + Math.min(20, Math.max(0, angles.length - 3) * 10))
  );

  const meanSharpness = Math.round(
    angles.reduce((acc, a) => acc + a.sharpnessScore, 0) / angles.length
  );

  const meanBright =
    angles.reduce((acc, a) => acc + a.brightnessPct, 0) / angles.length;
  const variance =
    angles.reduce((acc, a) => acc + Math.pow(a.brightnessPct - meanBright, 2), 0) /
    angles.length;
  const stdDev = Math.sqrt(variance);
  const illuminationConsistencyPct = Math.round(
    Math.max(40, Math.min(99, 100 - stdDev * 1.6))
  );

  let reliefSum = 0;
  let loadedCount = 0;

  for (const item of angles.slice(0, 5)) {
    try {
      const img = await loadImageElement(item.dataUrl);
      const frameStats = analyzeCanvasOrMediaFrame(
        img,
        img.naturalWidth || 512,
        img.naturalHeight || 512
      );
      reliefSum += frameStats.edgeReliefDensityPct;
      loadedCount++;
    } catch {
      // Resilient fallback
    }
  }

  return {
    totalAngles: angles.length,
    uniqueDirections: uniqueDirs,
    angularCoveragePct,
    meanSharpness,
    illuminationConsistencyPct,
    edgeReliefDensityPct:
      loadedCount > 0 ? Math.round(reliefSum / loadedCount) : 42,
  };
}

export function renderProceduralArtifactAngle(
  canvas: HTMLCanvasElement,
  direction: CaptureDirection,
  variant: 'astrolabe' | 'silk_ewer',
  wobblePhase = 0
): void {
  const w = canvas.width;
  const h = canvas.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dirs = getLocalizedDirections('ar');
  const spec = dirs.find((d) => d.id === direction) ?? dirs[0];
  const azRad = ((spec.azimuthDeg + wobblePhase) * Math.PI) / 180;
  const isTop = direction === CaptureDirection.Top;

  const bgGrad = ctx.createRadialGradient(
    w * 0.5,
    h * 0.42,
    w * 0.08,
    w * 0.5,
    h * 0.5,
    w * 0.72
  );
  bgGrad.addColorStop(0, '#F5F0E6');
  bgGrad.addColorStop(0.65, '#E5DDD0');
  bgGrad.addColorStop(1, '#CFC5B4');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  if (!isTop) {
    ctx.save();
    ctx.fillStyle = 'rgba(28, 25, 23, 0.16)';
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.81, w * 0.27, h * 0.045, 0, 0, Math.PI * 2);
    ctx.fill();

    const plinthGrad = ctx.createLinearGradient(w * 0.2, 0, w * 0.8, 0);
    plinthGrad.addColorStop(0, '#D6CEC0');
    plinthGrad.addColorStop(0.45, '#EFEAE0');
    plinthGrad.addColorStop(1, '#BFB5A4');
    ctx.fillStyle = plinthGrad;
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.84, w * 0.32, h * 0.055, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(w * 0.18, h * 0.84, w * 0.64, h * 0.16);
    ctx.restore();
  }

  ctx.save();
  ctx.translate(w * 0.5, isTop ? h * 0.5 : h * 0.47);

  if (variant === 'astrolabe') {
    const foreshorten = isTop
      ? 0.18
      : Math.max(0.22, Math.abs(Math.cos(azRad)));
    const radius = w * 0.28;

    if (!isTop) {
      ctx.fillStyle = '#4A433B';
      ctx.fillRect(-w * 0.025, radius * 0.92, w * 0.05, h * 0.34 - radius * 0.92);
      ctx.beginPath();
      ctx.ellipse(0, h * 0.33, w * 0.13, h * 0.024, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#5C5349';
      ctx.fill();
    }

    const edgeShift = Math.sin(azRad) * w * 0.028;
    ctx.fillStyle = '#7A5821';
    ctx.beginPath();
    ctx.ellipse(
      edgeShift,
      0,
      radius * foreshorten,
      isTop ? radius * 0.22 : radius,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    const brassGrad = ctx.createLinearGradient(-radius, -radius, radius, radius);
    brassGrad.addColorStop(0, '#DFBE73');
    brassGrad.addColorStop(0.45, '#B68938');
    brassGrad.addColorStop(0.8, '#8B6523');
    brassGrad.addColorStop(1, '#CCA656');

    ctx.fillStyle = brassGrad;
    ctx.beginPath();
    ctx.ellipse(
      0,
      0,
      radius * foreshorten,
      isTop ? radius * 0.22 : radius,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#5E4214';
    ctx.stroke();

    if (!isTop) {
      ctx.beginPath();
      ctx.moveTo(-radius * 0.28 * foreshorten, -radius * 0.94);
      ctx.quadraticCurveTo(0, -radius * 1.26, radius * 0.28 * foreshorten, -radius * 0.94);
      ctx.closePath();
      ctx.fillStyle = '#A67B2E';
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, -radius * 1.24, radius * 0.14, radius * 0.14, 0, 0, Math.PI * 2);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#8F6822';
      ctx.stroke();
    }

    ctx.save();
    ctx.scale(foreshorten, isTop ? 0.22 : 1);
    const showingBack = Math.cos(azRad) < 0;

    for (let r = 0.85; r >= 0.25; r -= 0.2) {
      ctx.beginPath();
      ctx.arc(0, 0, radius * r, 0, Math.PI * 2);
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = showingBack ? '#4A3512' : '#2C4A63';
      ctx.stroke();
    }

    for (let deg = 0; deg < 360; deg += 15) {
      const a = (deg * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * radius * 0.86, Math.sin(a) * radius * 0.86);
      ctx.lineTo(Math.cos(a) * radius * 0.96, Math.sin(a) * radius * 0.96);
      ctx.strokeStyle = '#3E2B0D';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    if (!showingBack) {
      ctx.beginPath();
      ctx.arc(0, -radius * 0.16, radius * 0.56, 0, Math.PI * 2);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#1E3A8A';
      ctx.stroke();

      for (let k = 0; k < 8; k++) {
        const ka = (k * Math.PI) / 4 + 0.3;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ka) * radius * 0.25, Math.sin(ka) * radius * 0.25);
        ctx.lineTo(Math.cos(ka + 0.14) * radius * 0.72, Math.sin(ka + 0.14) * radius * 0.72);
        ctx.strokeStyle = '#523910';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
    } else {
      ctx.strokeRect(-radius * 0.42, 0, radius * 0.84, radius * 0.42);
      ctx.save();
      ctx.rotate(0.58);
      ctx.fillStyle = '#6A4C19';
      ctx.fillRect(-radius * 0.92, -radius * 0.055, radius * 1.84, radius * 0.11);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.08, 0, Math.PI * 2);
    ctx.fillStyle = '#244A5E';
    ctx.fill();
    ctx.restore();
  } else {
    if (isTop) {
      const r = w * 0.27;
      const glaze = ctx.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.1, 0, 0, r);
      glaze.addColorStop(0, '#2B59B5');
      glaze.addColorStop(0.65, '#1B3678');
      glaze.addColorStop(1, '#0F1F47');
      ctx.fillStyle = glaze;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#D4AF5A';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.78, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#141B29';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.38, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const bodyW = w * 0.22;
      const bodyH = h * 0.26;
      const spoutSide = Math.cos(azRad);
      const spoutVisible = Math.sin(azRad + 0.6);

      ctx.lineWidth = w * 0.026;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#1A3473';
      ctx.beginPath();
      ctx.moveTo(spoutSide * bodyW * 0.65, 0);
      ctx.quadraticCurveTo(
        spoutSide * bodyW * 1.35,
        -bodyH * 0.55,
        spoutSide * bodyW * 1.15,
        -bodyH * 1.05
      );
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-spoutSide * bodyW * 0.45, -bodyH * 0.95);
      ctx.quadraticCurveTo(
        -spoutSide * bodyW * 1.25,
        -bodyH * 0.45,
        -spoutSide * bodyW * 0.75,
        bodyH * 0.22
      );
      ctx.strokeStyle = '#23458F';
      ctx.stroke();

      const bodyGrad = ctx.createRadialGradient(
        -bodyW * 0.3,
        -bodyH * 0.2,
        bodyW * 0.1,
        0,
        bodyH * 0.1,
        bodyW * 1.25
      );
      bodyGrad.addColorStop(0, '#3C72CC');
      bodyGrad.addColorStop(0.5, '#1D3C82');
      bodyGrad.addColorStop(1, '#10214A');

      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.ellipse(0, bodyH * 0.22, bodyW, bodyH * 0.85, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillRect(-bodyW * 0.34, -bodyH * 1.05, bodyW * 0.68, bodyH * 0.62);
      ctx.fillStyle = '#C9A453';
      ctx.fillRect(-bodyW * 0.42, -bodyH * 1.1, bodyW * 0.84, bodyH * 0.08);
      ctx.fillRect(-bodyW * 0.52, bodyH * 0.98, bodyW * 1.04, bodyH * 0.12);

      ctx.strokeStyle = '#DFBE73';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(0, bodyH * 0.2, bodyW * 0.96, bodyH * 0.22, 0, 0, Math.PI * 2);
      ctx.stroke();

      for (let m = -3; m <= 3; m++) {
        const mx = ((m * 0.28 + spoutVisible * 0.22) % 0.85) * bodyW;
        ctx.beginPath();
        ctx.arc(mx, bodyH * 0.22, w * 0.022, 0, Math.PI * 2);
        ctx.strokeStyle = '#9CE0DC';
        ctx.stroke();
      }
    }
  }

  ctx.restore();
}

export async function generateProceduralPresetAngles(
  variant: 'astrolabe' | 'silk_ewer'
): Promise<CapturedAngleImage[]> {
  const dirs = [
    CaptureDirection.Front,
    CaptureDirection.Right,
    CaptureDirection.Back,
    CaptureDirection.Top,
  ];
  const specMap = getLocalizedDirections('ar');
  const results: CapturedAngleImage[] = [];

  for (const dir of dirs) {
    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 720;
    renderProceduralArtifactAngle(canvas, dir, variant, 0);
    const stats = analyzeCanvasOrMediaFrame(canvas, 720, 720);
    const spec = specMap.find((d) => d.id === dir) ?? specMap[0];

    results.push({
      id: `${variant}-${dir}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      direction: dir,
      labelAr: spec.label,
      azimuthDeg: spec.azimuthDeg,
      elevationDeg: spec.elevationDeg,
      dataUrl: canvas.toDataURL('image/jpeg', 0.92),
      source: 'preset',
      width: 720,
      height: 720,
      capturedAt: new Date().toISOString(),
      sharpnessScore: stats.sharpnessScore,
      brightnessPct: stats.brightnessPct,
    });
  }

  return results;
}

function drawWrappedCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  startY: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 2
): number {
  const isCJK = /[\u4e00-\u9fa5]/.test(text);
  const tokens = isCJK ? Array.from(text) : text.split(/\s+/);
  const joiner = isCJK ? '' : ' ';
  let line = '';
  let y = startY;
  let lineCount = 0;

  for (let i = 0; i < tokens.length; i++) {
    const testLine = line ? `${line}${joiner}${tokens[i]}` : tokens[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line) {
      lineCount++;
      if (lineCount >= maxLines) {
        ctx.fillText(`${line}…`, x, y);
        return y + lineHeight;
      }
      ctx.fillText(line, x, y);
      line = tokens[i];
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }
  return y;
}

export async function exportHeritagePassportPng(
  artifact: DocumentedArtifact,
  locale: LocaleCode
): Promise<void> {
  const t = UI_STRINGS[locale];
  const cStr = CONSERVATION_STRINGS[locale];
  const isRtl = locale === 'ar';

  const presetMeta = artifact.presetKey
    ? PRESET_METADATA[artifact.presetKey][locale]
    : null;

  const displayTitle = presetMeta ? presetMeta.title : artifact.titleAr;
  const displayPeriod = presetMeta ? presetMeta.period : artifact.periodAr;
  const rawRegion = presetMeta ? presetMeta.region : artifact.discoveryRegionAr;
  const countryLabel = artifact.countryCode
    ? getCountryDisplayName(artifact.countryCode, locale)
    : '';
  const displayRegion = countryLabel
    ? `${countryLabel} — ${rawRegion}`
    : rawRegion;
  const displayMaterial = presetMeta ? presetMeta.material : artifact.materialAr;
  const displayDims = presetMeta ? presetMeta.dimensions : artifact.dimensionsCm;
  const displayTeam = presetMeta ? presetMeta.defaultTeam : artifact.teamNameAr;

  const canvas = document.createElement('canvas');
  canvas.width = 1400;
  canvas.height = 990;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = '#FBF9F5';
  ctx.fillRect(0, 0, 1400, 990);

  ctx.strokeStyle = '#C89E54';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(32, 32, 1336, 926);
  ctx.strokeStyle = '#0F4C45';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(42, 42, 1316, 906);

  ctx.direction = isRtl ? 'rtl' : 'ltr';
  ctx.textAlign = isRtl ? 'right' : 'left';
  const headerAnchorX = isRtl ? 1316 : 84;

  ctx.fillStyle = '#0F4C45';
  ctx.font = '600 17px "Manrope", "Readex Pro", sans-serif';
  ctx.fillText(t.passportHeaderBanner(artifact.accessionCode), headerAnchorX, 92);

  ctx.fillStyle = '#1C1814';
  ctx.font = '700 36px "Cormorant Garamond", "Amiri", serif';
  drawWrappedCanvasText(ctx, displayTitle, headerAnchorX, 146, 1230, 44, 1);

  ctx.strokeStyle = '#DED4C3';
  ctx.beginPath();
  ctx.moveTo(84, 180);
  ctx.lineTo(1316, 180);
  ctx.stroke();

  // 2x2 Multi-Angle Grid on the left side
  const displayAngles = artifact.angles.slice(0, 4);
  const gridStartX = 84;
  const gridStartY = 212;
  const cellSize = 272;
  const gap = 22;

  for (let i = 0; i < displayAngles.length; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = gridStartX + col * (cellSize + gap);
    const y = gridStartY + row * (cellSize + 44);

    ctx.fillStyle = '#EFE9DC';
    ctx.fillRect(x, y, cellSize, cellSize);

    try {
      const img = await loadImageElement(displayAngles[i].dataUrl);
      const side = Math.min(img.naturalWidth || cellSize, img.naturalHeight || cellSize);
      const sx = ((img.naturalWidth || side) - side) / 2;
      const sy = ((img.naturalHeight || side) - side) / 2;
      ctx.drawImage(img, sx, sy, side, side, x, y, cellSize, cellSize);
    } catch {
      // Fallback block
    }

    ctx.strokeStyle = '#C89E54';
    ctx.strokeRect(x, y, cellSize, cellSize);

    ctx.fillStyle = '#4A423A';
    ctx.font = '500 14px "Manrope", "Readex Pro", sans-serif';
    const localizedAngleLabel = getDirectionLabel(locale, displayAngles[i].direction);
    ctx.fillText(
      localizedAngleLabel,
      isRtl ? x + cellSize : x,
      y + cellSize + 24
    );
  }

  // Metadata Column on the right side
  const metaAnchorX = isRtl ? 1316 : 696;
  const maxMetaWidth = 610;
  let cursorY = 228;

  const drawField = (label: string, value: string) => {
    ctx.fillStyle = '#6E6357';
    ctx.font = '600 14px "Manrope", "Readex Pro", sans-serif';
    ctx.fillText(label, metaAnchorX, cursorY);
    cursorY += 25;
    ctx.fillStyle = '#1C1814';
    ctx.font = '600 19px "Manrope", "Readex Pro", sans-serif';
    cursorY = drawWrappedCanvasText(
      ctx,
      value,
      metaAnchorX,
      cursorY,
      maxMetaWidth,
      26,
      2
    );
    cursorY += 14;
  };

  drawField(
    `${t.fieldPeriod} · ${t.fieldRegion}`,
    `${displayPeriod} · ${displayRegion}`
  );
  drawField(
    `${t.fieldMaterial} · ${t.fieldDimensions}`,
    `${displayMaterial} · ${displayDims}`
  );
  drawField(
    cStr.lblConditionGrade,
    cStr.conditionGrades[artifact.conditionGrade ?? 'stable_excellent']
  );
  drawField(
    t.kpi2Label,
    t.passportMetricsValue(
      artifact.metrics.totalAngles,
      artifact.metrics.angularCoveragePct,
      artifact.metrics.illuminationConsistencyPct
    )
  );
  if (artifact.environmentalProfile) {
    const evalRes = evaluateEnvironmentalProfile(artifact.environmentalProfile);
    drawField(
      cStr.passportSafeClimateLabel,
      cStr.passportSafeClimateValue(
        artifact.environmentalProfile.tempSafeMinC,
        artifact.environmentalProfile.tempSafeMaxC,
        artifact.environmentalProfile.rhSafeMinPct,
        artifact.environmentalProfile.rhSafeMaxPct,
        evalRes.nominalCount
      )
    );
  }
  drawField(t.fieldTeamName, displayTeam);

  ctx.fillStyle = '#6E6357';
  ctx.font = '400 14px "Manrope", "Readex Pro", sans-serif';
  const localeMap: Record<LocaleCode, string> = {
    ar: 'ar-SA',
    'en-US': 'en-US',
    fr: 'fr-FR',
    zh: 'zh-CN',
    ru: 'ru-RU',
  };
  const formattedDate = new Date(artifact.createdAtIso).toLocaleDateString(
    localeMap[locale]
  );
  ctx.fillText(t.passportIssuedDate(formattedDate), metaAnchorX, 924);

  const link = document.createElement('a');
  link.download = `smart-guardian-${artifact.accessionCode}-${locale}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
