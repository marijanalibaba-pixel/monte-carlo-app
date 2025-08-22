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

// Export comprehensive PDF report
export async function exportToPDF(data: ExportData): Promise<void> {
  const { result, startDate, inputParameters } = data;
  
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = 30;
    
    // Professional Header with brand colors
    pdf.setFillColor(59, 130, 246); // Blue-600
    pdf.rect(0, 0, pageWidth, 25, 'F');
    
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('Monte Carlo Forecast Report', pageWidth / 2, 17, { align: 'center' });
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated on ${format(new Date(), 'PPP')} | Confidential`, pageWidth / 2, yPosition + 5, { align: 'center' });
    yPosition += 25;
    
    // Executive Summary Box
    pdf.setFillColor(248, 250, 252); // Gray-50
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 35, 'F');
    pdf.setDrawColor(226, 232, 240); // Gray-300
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 35, 'S');
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Executive Summary', margin + 5, yPosition + 10);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    const p50Date = format(result.confidenceIntervals.find(ci => ci.level === 0.5)?.completionDate || startDate, 'MMM d, yyyy');
    const p80Date = format(result.confidenceIntervals.find(ci => ci.level === 0.8)?.completionDate || startDate, 'MMM d, yyyy');
    pdf.text(`Most likely completion: ${p50Date} (50% confidence)`, margin + 5, yPosition + 20);
    pdf.text(`Conservative estimate: ${p80Date} (80% confidence)`, margin + 5, yPosition + 28);
    
    yPosition += 50;
    
    // Project Details Section
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Project Configuration', margin, yPosition);
    yPosition += 8;
    
    // Two-column layout for parameters
    const leftCol = margin;
    const rightCol = pageWidth / 2 + 10;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Backlog Size:', leftCol, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${inputParameters.backlogSize} items`, leftCol + 30, yPosition);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Start Date:', rightCol, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(format(startDate, 'PPP'), rightCol + 25, yPosition);
    yPosition += 8;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Simulation Trials:', leftCol, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${inputParameters.trials.toLocaleString()}`, leftCol + 35, yPosition);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Method:', rightCol, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(inputParameters.forecastType.charAt(0).toUpperCase() + inputParameters.forecastType.slice(1), rightCol + 20, yPosition);
    yPosition += 20;
    
    // Confidence Intervals Table with professional styling
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Forecast Results', margin, yPosition);
    yPosition += 10;
    
    // Table headers
    const tableStartY = yPosition;
    const rowHeight = 8;
    const col1Width = 30;
    const col2Width = 35;
    const col3Width = 50;
    
    // Header row
    pdf.setFillColor(59, 130, 246); // Blue-600
    pdf.rect(margin, yPosition, col1Width + col2Width + col3Width, rowHeight, 'F');
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.text('Confidence', margin + 2, yPosition + 5);
    pdf.text('Duration', margin + col1Width + 2, yPosition + 5);
    pdf.text('Completion Date', margin + col1Width + col2Width + 2, yPosition + 5);
    
    yPosition += rowHeight;
    pdf.setTextColor(0, 0, 0);
    
    // Data rows with alternating colors
    const confidenceData = result.confidenceIntervals.map(ci => [
      `P${Math.round(ci.level * 100)}`,
      `${ci.daysFromStart} days`,
      format(ci.completionDate, 'MMM d, yyyy')
    ]);
    
    confidenceData.forEach((row, index) => {
      if (index % 2 === 0) {
        pdf.setFillColor(248, 250, 252); // Light gray for alternating rows
        pdf.rect(margin, yPosition, col1Width + col2Width + col3Width, rowHeight, 'F');
      }
      
      pdf.setFont('helvetica', 'normal');
      pdf.text(row[0], margin + 2, yPosition + 5);
      pdf.text(row[1], margin + col1Width + 2, yPosition + 5);
      pdf.text(row[2], margin + col1Width + col2Width + 2, yPosition + 5);
      yPosition += rowHeight;
    });
    
    yPosition += 10;
    
    // Add trend analysis if available
    if (result.throughputTrends) {
      const trends = result.throughputTrends;
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Throughput Trend Analysis', margin, yPosition);
      yPosition += 10;
      
      // Trend summary box
      pdf.setFillColor(248, 250, 252);
      pdf.rect(margin, yPosition, pageWidth - 2 * margin, 25, 'F');
      pdf.setDrawColor(226, 232, 240);
      pdf.rect(margin, yPosition, pageWidth - 2 * margin, 25, 'S');
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Trend: ${trends.trend.toUpperCase()} (${trends.trendStrength})`, margin + 5, yPosition + 8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Change: ${trends.changePercent >= 0 ? '+' : ''}${trends.changePercent.toFixed(1)}%`, margin + 5, yPosition + 16);
      
      yPosition += 30;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const wrappedText = pdf.splitTextToSize(trends.description, pageWidth - 2 * margin);
      pdf.text(wrappedText, margin, yPosition);
      yPosition += wrappedText.length * 5 + 8;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Recommendation:', margin, yPosition);
      yPosition += 5;
      pdf.setFont('helvetica', 'normal');
      const wrappedRec = pdf.splitTextToSize(trends.recommendation, pageWidth - 2 * margin);
      pdf.text(wrappedRec, margin, yPosition);
      yPosition += wrappedRec.length * 5 + 15;
    }
    
    // Add statistical summary
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Statistical Summary', margin, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Mean: ${result.statistics.mean.toFixed(1)} days`, margin, yPosition);
    pdf.text(`Median: ${result.statistics.median.toFixed(1)} days`, margin + 60, yPosition);
    pdf.text(`Std Dev: ${result.statistics.standardDeviation.toFixed(1)} days`, margin + 120, yPosition);
    yPosition += 8;
    
    // Add charts with better sizing and error handling
    try {
      const chartElements = document.querySelectorAll('.chart-container');
      
      if (chartElements.length > 0) {
        yPosition += 10;
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Forecast Visualizations', margin, yPosition);
        yPosition += 10;
        
        // Check if we need a new page for charts
        if (yPosition > pageHeight - 100) {
          pdf.addPage();
          yPosition = 30;
        }
        
        for (let i = 0; i < Math.min(2, chartElements.length); i++) {
          const chartElement = chartElements[i] as HTMLElement;
          
          try {
            const canvas = await html2canvas(chartElement, {
              backgroundColor: '#ffffff',
              scale: 2,
              width: 800,
              height: 400,
              useCORS: true,
              allowTaint: false,
              logging: false
            });
            
            const imgData = canvas.toDataURL('image/png', 1.0);
            const imgWidth = pageWidth - 2 * margin;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Ensure chart fits on page
            const maxHeight = pageHeight - yPosition - 30;
            const finalHeight = Math.min(imgHeight, maxHeight);
            const finalWidth = finalHeight < imgHeight ? (canvas.width * finalHeight) / canvas.height : imgWidth;
            
            pdf.addImage(imgData, 'PNG', margin, yPosition, finalWidth, finalHeight);
            yPosition += finalHeight + 15;
            
            // Add new page if needed for next chart
            if (i < chartElements.length - 1 && yPosition > pageHeight - 100) {
              pdf.addPage();
              yPosition = 30;
            }
            
          } catch (error) {
            console.error('Error adding chart to PDF:', error);
            pdf.setFontSize(9);
            pdf.setTextColor(128, 128, 128);
            pdf.text('Chart visualization unavailable', margin, yPosition);
            yPosition += 10;
            pdf.setTextColor(0, 0, 0);
          }
        }
      }
    } catch (error) {
      console.error('Error processing charts for PDF:', error);
    }
    
    // Add footer with page numbers and generation info
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 10);
      pdf.text('Generated by Monte Carlo Forecasting Tool', margin, pageHeight - 10);
    }
    
    // Save the PDF
    const filename = `monte-carlo-forecast-${format(new Date(), 'yyyy-MM-dd-HHmm')}.pdf`;
    pdf.save(filename);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF report. Please try again.');
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
  rows.push(['STATISTICS', '', '', '']);
  rows.push(['Mean', result.statistics.mean.toFixed(2), 'days', '']);
  rows.push(['Median', result.statistics.median.toFixed(2), 'days', '']);
  rows.push(['Standard Deviation', result.statistics.standardDeviation.toFixed(2), 'days', '']);
  rows.push(['Minimum', result.statistics.min.toFixed(2), 'days', '']);
  rows.push(['Maximum', result.statistics.max.toFixed(2), 'days', '']);
  
  // Add trend analysis if available
  if (result.throughputTrends) {
    const trends = result.throughputTrends;
    rows.push(['', '', '', '']); // Empty row
    rows.push(['TREND ANALYSIS', '', '', '']);
    rows.push(['Trend Direction', trends.trend, 'direction', '']);
    rows.push(['Trend Strength', trends.trendStrength, 'strength', '']);
    rows.push(['Recent Average', trends.recentAverage.toString(), 'items/week', '']);
    rows.push(['Overall Average', trends.overallAverage.toString(), 'items/week', '']);
    rows.push(['Change Percentage', trends.changePercent.toFixed(1) + '%', 'percentage', '']);
    rows.push(['Linear Slope', trends.linearSlope.toFixed(3), 'items/week/week', '']);
  }
  
  return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
}