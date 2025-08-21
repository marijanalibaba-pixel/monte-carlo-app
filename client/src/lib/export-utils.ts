import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { ForecastResult } from './monte-carlo-engine';
import { format, addDays } from 'date-fns';

export interface ExportData {
  result: ForecastResult;
  startDate: Date;
  inputParameters: {
    backlogSize: number;
    trials: number;
    forecastType: string;
    [key: string]: any;
  };
}

// Export results as CSV
export async function exportToCSV(data: ExportData): Promise<void> {
  const { result, startDate, inputParameters } = data;
  
  const csvContent = generateCSVContent(result, startDate, inputParameters);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const filename = `monte-carlo-forecast-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`;
  
  saveAs(blob, filename);
}

// Export charts as images
export async function exportChartsAsImages(data: ExportData): Promise<void> {
  try {
    // Find chart containers
    const histogramContainer = document.querySelector('.chart-container') as HTMLElement;
    const scurveContainer = document.querySelectorAll('.chart-container')[1] as HTMLElement;
    
    if (histogramContainer) {
      const histogramCanvas = await html2canvas(histogramContainer, {
        backgroundColor: '#ffffff',
        scale: 2,
        width: 800,
        height: 400
      });
      
      histogramCanvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `histogram-chart-${format(new Date(), 'yyyy-MM-dd-HHmm')}.png`);
        }
      });
    }
    
    if (scurveContainer) {
      const scurveCanvas = await html2canvas(scurveContainer, {
        backgroundColor: '#ffffff',
        scale: 2,
        width: 800,
        height: 400
      });
      
      scurveCanvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `scurve-chart-${format(new Date(), 'yyyy-MM-dd-HHmm')}.png`);
        }
      });
    }
  } catch (error) {
    console.error('Error exporting charts:', error);
  }
}

// Export comprehensive PDF report
export async function exportToPDF(data: ExportData): Promise<void> {
  const { result, startDate, inputParameters } = data;
  
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;
    
    // Header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Monte Carlo Forecast Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated on ${format(new Date(), 'PPP')}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;
    
    // Project Overview
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Project Overview', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Backlog Size: ${inputParameters.backlogSize} items`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Start Date: ${format(startDate, 'PPP')}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Simulation Trials: ${inputParameters.trials.toLocaleString()}`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Forecast Method: ${inputParameters.forecastType}`, 20, yPosition);
    yPosition += 15;
    
    // Key Results
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Key Results', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    // Confidence intervals table
    const confidenceData = result.confidenceIntervals.map(ci => [
      `P${Math.round(ci.level * 100)}`,
      `${ci.daysFromStart} days`,
      format(ci.completionDate, 'MMM d, yyyy')
    ]);
    
    // Simple table
    pdf.setFontSize(10);
    pdf.text('Confidence Level', 20, yPosition);
    pdf.text('Duration', 70, yPosition);
    pdf.text('Completion Date', 120, yPosition);
    yPosition += 8;
    
    confidenceData.forEach(([level, duration, date]) => {
      pdf.text(level, 20, yPosition);
      pdf.text(duration, 70, yPosition);
      pdf.text(date, 120, yPosition);
      yPosition += 6;
    });
    
    yPosition += 10;
    
    // Statistics
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Statistical Analysis', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Mean: ${result.statistics.mean.toFixed(1)} days`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Median: ${result.statistics.median.toFixed(1)} days`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Standard Deviation: ${result.statistics.standardDeviation.toFixed(1)} days`, 20, yPosition);
    yPosition += 6;
    pdf.text(`Range: ${(result.statistics.max - result.statistics.min).toFixed(1)} days`, 20, yPosition);
    yPosition += 15;
    
    // Try to capture and add charts
    try {
      const chartElements = document.querySelectorAll('.chart-container');
      if (chartElements.length > 0) {
        yPosition += 10;
        
        for (let i = 0; i < Math.min(chartElements.length, 2); i++) {
          const chartElement = chartElements[i] as HTMLElement;
          
          if (yPosition > pageHeight - 60) {
            pdf.addPage();
            yPosition = 20;
          }
          
          const canvas = await html2canvas(chartElement, {
            backgroundColor: '#ffffff',
            scale: 1.5,
            width: 600,
            height: 300
          });
          
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 160;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 10;
        }
      }
    } catch (chartError) {
      console.warn('Could not include charts in PDF:', chartError);
    }
    
    // Footer
    const footerY = pageHeight - 15;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Generated by Monte Carlo Forecasting Application', pageWidth / 2, footerY, { align: 'center' });
    
    // Save PDF
    const filename = `monte-carlo-forecast-${format(new Date(), 'yyyy-MM-dd-HHmm')}.pdf`;
    pdf.save(filename);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}

// Generate CSV content
function generateCSVContent(result: ForecastResult, startDate: Date, inputParameters: any): string {
  const headers = [
    'Metric',
    'Value',
    'Unit',
    'Date'
  ];
  
  const rows = [
    headers,
    ['Report Generated', format(new Date(), 'yyyy-MM-dd HH:mm:ss'), 'timestamp', ''],
    ['', '', '', ''], // Empty row
    ['INPUT PARAMETERS', '', '', ''],
    ['Backlog Size', inputParameters.backlogSize.toString(), 'items', ''],
    ['Start Date', format(startDate, 'yyyy-MM-dd'), 'date', ''],
    ['Simulation Trials', inputParameters.trials.toString(), 'count', ''],
    ['Forecast Method', inputParameters.forecastType, 'type', ''],
    ['', '', '', ''], // Empty row
    ['CONFIDENCE INTERVALS', '', '', ''],
  ];
  
  // Add confidence intervals
  result.confidenceIntervals.forEach(ci => {
    rows.push([
      `P${Math.round(ci.level * 100)} Confidence`,
      ci.daysFromStart.toString(),
      'days',
      format(ci.completionDate, 'yyyy-MM-dd')
    ]);
  });
  
  rows.push(['', '', '', '']); // Empty row
  rows.push(['STATISTICAL SUMMARY', '', '', '']);
  rows.push(['Mean', result.statistics.mean.toFixed(2), 'days', '']);
  rows.push(['Median', result.statistics.median.toFixed(2), 'days', '']);
  rows.push(['Standard Deviation', result.statistics.standardDeviation.toFixed(2), 'days', '']);
  rows.push(['Minimum', result.statistics.min.toFixed(2), 'days', '']);
  rows.push(['Maximum', result.statistics.max.toFixed(2), 'days', '']);
  rows.push(['Skewness', result.statistics.skewness.toFixed(3), 'coefficient', '']);
  rows.push(['Kurtosis', result.statistics.kurtosis.toFixed(3), 'coefficient', '']);
  
  rows.push(['', '', '', '']); // Empty row
  rows.push(['COMPLETION DATE SAMPLES', '', '', '']);
  rows.push(['Trial', 'Days from Start', 'Completion Date', '']);
  
  // Add sample of completion dates (first 100 for reasonable file size)
  result.completionDates.slice(0, 100).forEach((date, index) => {
    const daysFromStart = Math.round((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    rows.push([
      (index + 1).toString(),
      daysFromStart.toString(),
      format(date, 'yyyy-MM-dd'),
      ''
    ]);
  });
  
  // Convert to CSV string
  return rows.map(row => 
    row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(',')
  ).join('\n');
}

// Export all formats
export async function exportAll(data: ExportData): Promise<void> {
  try {
    await Promise.all([
      exportToCSV(data),
      exportChartsAsImages(data),
      exportToPDF(data)
    ]);
  } catch (error) {
    console.error('Error during bulk export:', error);
  }
}