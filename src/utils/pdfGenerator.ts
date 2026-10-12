/**
 * Generador de Dictamen Técnico Oficial en PDF para Mi Casa Segura.
 * Construido con jsPDF vectorial de alta fidelidad para formato A4.
 * Cumple estándares CENEPRED, RNE (E.030, E.070, E.080) e INDECI.
 */

import { jsPDF } from 'jspdf';
import { MultiHazardRiskResult } from '../lib/riskEngine';

interface GeneratePdfOptions {
  result: MultiHazardRiskResult;
  evaluacionId?: string;
  coordinates?: { lat: number; lng: number };
}

export const generateRiskReportPdf = ({
  result,
  evaluacionId,
  coordinates,
}: GeneratePdfOptions): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm
  let y = margin;

  // Paleta Luz Andina
  const colors = {
    marino: [18, 59, 93], // #0D3B66
    turquesa: [23, 107, 120], // #1E6FB5
    piedra: [95, 104, 109], // #4A6C8C
    arena: [242, 235, 221], // #D6ECFB
    fondo: [250, 250, 247], // #FFFFFF
    // Semáforo
    critical: [127, 29, 29], // #7F1D1D
    high: [179, 78, 54], // #B34E36
    medium: [200, 157, 60], // #C89D3C
    low: [61, 109, 76], // #3D6D4C
  };

  const getRiskColor = (level: string): [number, number, number] => {
    switch (level) {
      case 'Muy Alto':
        return colors.critical as [number, number, number];
      case 'Alto':
        return colors.high as [number, number, number];
      case 'Medio':
        return colors.medium as [number, number, number];
      case 'Datos Insuficientes':
        return colors.piedra as [number, number, number];
      case 'Bajo':
      case 'Sin Afectación':
      default:
        return colors.low as [number, number, number];
    }
  };

  // --------------------------------------------------------------------------
  // 1. ENCABEZADO INSTITUCIONAL
  // --------------------------------------------------------------------------
  doc.setFillColor(colors.marino[0], colors.marino[1], colors.marino[2]);
  doc.rect(margin, y, contentWidth, 18, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('SENDA · PLATAFORMA CÍVICA DE EVALUACIÓN DE RIESGO ANTE DESASTRES', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(
    'Metodología AHP Saaty (CENEPRED) · RNE (E.030 / E.070 / E.080) · CISMID - INAIGEM - INDECI',
    margin + 4,
    y + 12
  );

  y += 22;

  // --------------------------------------------------------------------------
  // 2. FOLIO Y DATOS DE LA EVALUACIÓN
  // --------------------------------------------------------------------------
  const evalFolio = evaluacionId
    ? `SENDA-${evaluacionId.slice(0, 8).toUpperCase()}`
    : `SENDA-${Date.now().toString().slice(-8)}`;
  const fechaEmision = new Date().toLocaleString('es-PE', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  doc.setTextColor(colors.marino[0], colors.marino[1], colors.marino[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('DICTAMEN TÉCNICO DE VULNERABILIDAD Y RIESGO', margin, y + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(colors.piedra[0], colors.piedra[1], colors.piedra[2]);
  doc.text(`FOLIO: ${evalFolio}  |  FECHA DE EMISIÓN: ${fechaEmision}`, margin, y + 9);

  y += 14;

  // Datos de Ubicación
  doc.setFillColor(colors.fondo[0], colors.fondo[1], colors.fondo[2]);
  doc.setDrawColor(colors.arena[0], colors.arena[1], colors.arena[2]);
  doc.rect(margin, y, contentWidth, 12, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(colors.marino[0], colors.marino[1], colors.marino[2]);
  doc.text('ÁMBITO TERRITORIAL:', margin + 3, y + 5);

  doc.setFont('helvetica', 'normal');
  const regionLabel = result.cityId === 'lima' ? 'Lima Metropolitana (Costa Central)' : 'Huaraz, Áncash (Callejón de Huaylas)';
  const coordsLabel = coordinates ? `Lat: ${coordinates.lat.toFixed(6)}, Lng: ${coordinates.lng.toFixed(6)}` : 'Coordenadas del peritaje';
  doc.text(`${regionLabel}   |   ${coordsLabel}`, margin + 36, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.text('FUENTES GEOGRÁFICAS:', margin + 3, y + 9.5);
  doc.setFont('helvetica', 'normal');
  doc.text('CISMID (Microzonificación), INAIGEM (Peligrosidad de Aluvión), SIGRID-CENEPRED', margin + 36, y + 9.5);

  y += 16;

  // --------------------------------------------------------------------------
  // 3. DICTAMEN DE RIESGO GLOBAL
  // --------------------------------------------------------------------------
  const riskColor = getRiskColor(result.globalRiskLevel);

  doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.rect(margin, y, 4, 22, 'F');

  doc.setFillColor(colors.fondo[0], colors.fondo[1], colors.fondo[2]);
  doc.setDrawColor(colors.arena[0], colors.arena[1], colors.arena[2]);
  doc.rect(margin + 4, y, contentWidth - 4, 22, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(colors.piedra[0], colors.piedra[1], colors.piedra[2]);
  doc.text('DICTAMEN DE RIESGO MULTIAMENAZA', margin + 8, y + 5);

  doc.setFontSize(16);
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.text(`NIVEL ${result.globalRiskLevel.toUpperCase()}`, margin + 8, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(colors.piedra[0], colors.piedra[1], colors.piedra[2]);
  doc.text(`Amenaza determinante: ${result.criticalHazard}`, margin + 8, y + 18);

  // Badge derecho de score
  const scorePercent = `${(result.globalRiskScore * 100).toFixed(0)}%`;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.text(`Índice: ${scorePercent}`, margin + contentWidth - 32, y + 12);

  y += 26;

  // --------------------------------------------------------------------------
  // 4. INFRACCIONES NORMATIVAS CRÍTICAS (HARD TRIGGERS RNE)
  // --------------------------------------------------------------------------
  if (result.vulnerability.hardTriggers.length > 0) {
    doc.setFillColor(253, 245, 243); // Alerta fondo
    doc.setDrawColor(colors.high[0], colors.high[1], colors.high[2]);
    
    // Altura calculada según cantidad de disparadores
    const triggerBoxHeight = 10 + result.vulnerability.hardTriggers.length * 11;
    doc.rect(margin, y, contentWidth, triggerBoxHeight, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(colors.critical[0], colors.critical[1], colors.critical[2]);
    doc.text('INFRACCIÓN CRÍTICA AL REGLAMENTO NACIONAL DE EDIFICACIONES (RNE)', margin + 4, y + 5);

    let ty = y + 10;
    for (const trigger of result.vulnerability.hardTriggers) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(colors.critical[0], colors.critical[1], colors.critical[2]);
      doc.text(`• ${trigger.title} [${trigger.normReference}]`, margin + 4, ty);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(colors.piedra[0], colors.piedra[1], colors.piedra[2]);
      const splitDesc = doc.splitTextToSize(
        `${trigger.description} Consecuencia técnica: ${trigger.consequence}`,
        contentWidth - 8
      );
      doc.text(splitDesc, margin + 6, ty + 4);

      ty += 11;
    }

    y += triggerBoxHeight + 4;
  }

  // --------------------------------------------------------------------------
  // 5. MATRIZ DE DESGLOSE DE AMENAZAS ESPECÍFICAS
  // --------------------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(colors.marino[0], colors.marino[1], colors.marino[2]);
  doc.text('DESGLOSE DE AMENAZAS TERRITORIALES EVALUADAS', margin, y + 4);

  y += 7;

  // Encabezado de la tabla
  doc.setFillColor(colors.arena[0], colors.arena[1], colors.arena[2]);
  doc.rect(margin, y, contentWidth, 6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(colors.marino[0], colors.marino[1], colors.marino[2]);
  doc.text('AMENAZA Y NORMA BASE', margin + 4, y + 4.2);
  doc.text('EXPOSICIÓN TERRITORIAL', margin + 70, y + 4.2);
  doc.text('NIVEL ESPECÍFICO', margin + 120, y + 4.2);
  doc.text('RIESGO CALCULADO', margin + 152, y + 4.2);

  y += 6;

  const hazards = [
    {
      name: 'Sismo (Respuesta Dinámica RNE E.030 / CISMID)',
      risk: result.specificRisks.sismo,
    },
    {
      name: 'Aluvión y Flujos de Detritos (INAIGEM / CENEPRED)',
      risk: result.specificRisks.aluvion,
    },
    {
      name: 'Movimiento en Masa (Deslizamientos / Derrumbes IGP)',
      risk: result.specificRisks.movimiento_masa,
    },
  ].filter(h => h.risk !== undefined);

  for (const h of hazards) {
    const r = h.risk;
    const level = r?.level || 'Sin Afectación';
    const hColor = getRiskColor(level);

    doc.setFillColor(colors.fondo[0], colors.fondo[1], colors.fondo[2]);
    doc.setDrawColor(colors.arena[0], colors.arena[1], colors.arena[2]);
    doc.rect(margin, y, contentWidth, 7, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(colors.marino[0], colors.marino[1], colors.marino[2]);
    doc.text(h.name, margin + 4, y + 4.5);

    let expScore = 'N/A';
    let calcRisk = 'N/A';

    if (r?.status === 'insufficient_data') {
      expScore = 'Sin datos';
      calcRisk = 'No evaluable';
    } else if (r?.status === 'no_hazard' || r?.hazardScore === 0) {
      expScore = '0% (No expuesto)';
      calcRisk = '0%';
    } else if (r?.hazardScore !== null && r?.hazardScore !== undefined) {
      expScore = `${(r.hazardScore * 100).toFixed(0)}%`;
      calcRisk = r.riskScore !== null ? `${(r.riskScore * 100).toFixed(0)}%` : 'N/A';
    }

    doc.text(expScore, margin + 70, y + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(hColor[0], hColor[1], hColor[2]);
    doc.text(level, margin + 115, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.marino[0], colors.marino[1], colors.marino[2]);
    doc.text(calcRisk, margin + 155, y + 4.5);

    y += 7;
  }

  y += 4;

  // --------------------------------------------------------------------------
  // 6. ACCIONES PRIORITARIAS DE MITIGACIÓN ESTRUCTURAL
  // --------------------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(colors.marino[0], colors.marino[1], colors.marino[2]);
  doc.text('ACCIONES PRIORITARIAS DE MITIGACIÓN ESTRUCTURAL', margin, y + 4);

  y += 7;

  doc.setFillColor(colors.fondo[0], colors.fondo[1], colors.fondo[2]);
  doc.setDrawColor(colors.arena[0], colors.arena[1], colors.arena[2]);

  const recs = result.mitigationRecommendations.slice(0, 4);
  const recBoxHeight = 5 + recs.length * 8;
  doc.rect(margin, y, contentWidth, recBoxHeight, 'FD');

  let ry = y + 5;
  recs.forEach((rec, idx) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(colors.turquesa[0], colors.turquesa[1], colors.turquesa[2]);
    doc.text(`${idx + 1}.`, margin + 4, ry);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(colors.marino[0], colors.marino[1], colors.marino[2]);
    const splitRec = doc.splitTextToSize(rec, contentWidth - 14);
    doc.text(splitRec, margin + 9, ry);

    ry += 8;
  });

  y += recBoxHeight + 5;

  // --------------------------------------------------------------------------
  // 7. PLAN FAMILIAR DE EMERGENCIA (ESTÁNDAR INDECI)
  // --------------------------------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(colors.marino[0], colors.marino[1], colors.marino[2]);
  doc.text(
    `PREPARACIÓN INDECI · MOCHILA DE EMERGENCIA Y SUPERVIVENCIA (${result.cityId === 'lima' ? 'COSTA' : 'ZONA ANDINA'})`,
    margin,
    y + 4
  );

  y += 7;

  doc.setFillColor(colors.fondo[0], colors.fondo[1], colors.fondo[2]);
  doc.setDrawColor(colors.arena[0], colors.arena[1], colors.arena[2]);
  doc.rect(margin, y, contentWidth, 18, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(colors.piedra[0], colors.piedra[1], colors.piedra[2]);

  const indeciItems =
    result.cityId === 'lima'
      ? [
          '• Agua embotellada (4 litros por persona para 24h) y alimentos no perecibles (conservas, barras energéticas).',
          '• Linterna de mano, radio a pilas o manivela con baterías de repuesto y silbato de alta resonancia.',
          '• Botiquín de primeros auxilios (alcohol, gasas estériles, vendas, esparadrapo, antiséptico, medicamentos básicos).',
          '• Mascarillas KN95, bolsas plásticas de basura, copia de DNI en funda impermeable y dinero en efectivo.',
        ]
      : [
          '• Agua potable en envase hermético (4L) y raciones calóricas andinas (máchica, charqui, frutos secos, panela).',
          '• Ropa de abrigo térmico para bajas temperaturas (manta polar, casaca impermeable cortaviento, medias de lana).',
          '• Linterna frontal con baterías resistentes a frío, silbato de emergencia y radio portátil AM/FM.',
          '• Botiquín de emergencias con tratamiento respiratorio básico, analgésicos y apósitos de curación.',
        ];

  let iy = y + 4;
  for (const item of indeciItems) {
    doc.text(item, margin + 4, iy);
    iy += 3.8;
  }

  y += 22;

  // --------------------------------------------------------------------------
  // 8. PIE TÉCNICO Y DESCARGO LEGAL
  // --------------------------------------------------------------------------
  const footerY = pageHeight - 20;
  doc.setDrawColor(colors.arena[0], colors.arena[1], colors.arena[2]);
  doc.line(margin, footerY, margin + contentWidth, footerY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(colors.piedra[0], colors.piedra[1], colors.piedra[2]);
  doc.text('NOTA DE DESCARGO Y VALIDEZ TÉCNICA:', margin, footerY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  const legalText =
    'El presente dictamen técnico es una estimación preliminar automatizada basada en el análisis jerárquico multicriterio (AHP Saaty - CENEPRED) y en cartografía oficial abierta. ' +
    'No constituye un peritaje estructural definitivo ni sustituye el ensayo geotécnico in situ (calicatas y mecánica de suelos) exigido por las normas E.030, E.050 y E.070 del RNE. ' +
    'Plataforma desarrollada en el marco del Proyecto de Mitigación de Riesgo Sísmico y Aluvional en el Perú.';
  const splitLegal = doc.splitTextToSize(legalText, contentWidth);
  doc.text(splitLegal, margin, footerY + 7);

  // Descarga directa
  const filename = `Dictamen_Tecnico_${evalFolio}.pdf`;
  doc.save(filename);
};
