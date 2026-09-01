import React from 'react';
import { View, Text, Svg, Path, G } from '@react-pdf/renderer';
import { DonutSlice } from '../types';
import { pdfStyles } from './styles';
import { formatCurrency, formatPercent, formatNumberWithCommas } from '../utils/calculations';

interface PdfDonutChartProps {
  slices: DonutSlice[];
  totalScopeAmount: number;
  currency: string;
}

export const PdfDonutChart: React.FC<PdfDonutChartProps> = ({
  slices,
  totalScopeAmount,
  currency,
}) => {
  if (!slices || slices.length === 0 || totalScopeAmount <= 0) {
    return (
      <View style={pdfStyles.chartEmptyContainer}>
        <Text style={pdfStyles.chartEmptyText}>No scope activity data for chart rendering</Text>
      </View>
    );
  }

  const MAX_LEGEND_ITEMS = 6;
  const isTruncated = slices.length > MAX_LEGEND_ITEMS;
  
  let displayedItems: Array<{ label: string; percentage: number; value: number; color: string }> = [];
  let otherCount = 0;

  if (!isTruncated) {
    displayedItems = slices.map((s) => ({
      label: s.label,
      percentage: s.percentage,
      value: s.value,
      color: s.color,
    }));
  } else {
    const top = slices.slice(0, MAX_LEGEND_ITEMS - 1);
    const rest = slices.slice(MAX_LEGEND_ITEMS - 1);
    const restValue = rest.reduce((acc, s) => acc + s.value, 0);
    const restPercent = rest.reduce((acc, s) => acc + s.percentage, 0);
    otherCount = rest.length;

    displayedItems = [
      ...top.map((s) => ({
        label: s.label,
        percentage: s.percentage,
        value: s.value,
        color: s.color,
      })),
      {
        label: `Other Activities (${otherCount})`,
        percentage: restPercent,
        value: restValue,
        color: '#94A3B8',
      },
    ];
  }

  return (
    <View style={pdfStyles.chartRowContainer}>
      {/* Svg Donut */}
      <View style={pdfStyles.chartSvgWrapper}>
        <Svg width={120} height={120} viewBox="0 0 200 200">
          <G>
            {slices.map((slice, idx) => (
              <Path
                key={idx}
                d={slice.pathD}
                fill={slice.color}
              />
            ))}
          </G>
        </Svg>
      </View>

      {/* Legend Block */}
      <View style={pdfStyles.chartLegendWrapper}>
        <Text style={pdfStyles.chartLegendHeader}>Scope Weightage Distribution</Text>
        {displayedItems.map((item, idx) => (
          <View key={idx} style={pdfStyles.legendItem}>
            <View style={[pdfStyles.legendColorDot, { backgroundColor: item.color }]} />
            <Text style={pdfStyles.legendLabel}>
              {item.label}
            </Text>
            <Text style={pdfStyles.legendPercent}>{item.percentage.toFixed(1)}%</Text>
            <Text style={pdfStyles.legendValue}>
              {formatNumberWithCommas(item.value)} {currency}
            </Text>
          </View>
        ))}
        {isTruncated && (
          <Text style={pdfStyles.legendMoreText}>
            * Complete breakdown with all {slices.length} activities itemized in table below
          </Text>
        )}
      </View>
    </View>
  );
};

interface PdfKpiGridProps {
  projectAmount: number;
  totalProgressValue: number;
  remainingValue: number;
  overallProgress: number;
  currency: string;
  dayNumberDisplay: string;
  projectDuration: number;
}

export const PdfKpiGrid: React.FC<PdfKpiGridProps> = ({
  projectAmount,
  totalProgressValue,
  remainingValue,
  overallProgress,
  currency,
  dayNumberDisplay,
  projectDuration,
}) => {
  return (
    <View style={pdfStyles.kpiGrid}>
      {/* Contract Value */}
      <View style={pdfStyles.kpiCard}>
        <Text style={pdfStyles.kpiLabel}>Contract Amount</Text>
        <Text style={pdfStyles.kpiValueMain}>{formatCurrency(projectAmount, currency)}</Text>
        <Text style={pdfStyles.kpiSub}>Authoritative baseline</Text>
      </View>

      {/* Earned Valuation */}
      <View style={pdfStyles.kpiCardHighlight}>
        <Text style={pdfStyles.kpiLabelHighlight}>Earned Valuation</Text>
        <Text style={pdfStyles.kpiValueHighlight}>{formatCurrency(totalProgressValue, currency)}</Text>
        <Text style={pdfStyles.kpiSubHighlight}>{formatPercent(overallProgress, 2)} Net Complete</Text>
      </View>

      {/* Remaining Balance */}
      <View style={pdfStyles.kpiCard}>
        <Text style={pdfStyles.kpiLabel}>Remaining Balance</Text>
        <Text style={pdfStyles.kpiValueMain}>{formatCurrency(remainingValue, currency)}</Text>
        <Text style={pdfStyles.kpiSub}>{formatPercent(Math.max(1 - overallProgress, 0), 2)} Balance</Text>
      </View>

      {/* Schedule Timeline */}
      <View style={pdfStyles.kpiCard}>
        <Text style={pdfStyles.kpiLabel}>Project Timeline</Text>
        <Text style={pdfStyles.kpiValueMain}>{dayNumberDisplay}</Text>
        <Text style={pdfStyles.kpiSub}>
          {projectDuration ? `Total: ${projectDuration} Days` : 'Inclusive'}
        </Text>
      </View>
    </View>
  );
};
