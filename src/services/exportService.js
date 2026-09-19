import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Export Appointment List to CSV
export const exportAppointmentsToCSV = (appointments, filename = 'appointments_export.csv') => {
  if (!appointments || appointments.length === 0) {
    throw new Error('No appointment data available to export.');
  }

  const headers = [
    'Appointment ID',
    'Patient Name',
    'Doctor Name',
    'Specialization',
    'Date',
    'Time Slot',
    'Reason for Visit',
    'Status',
    'Created At'
  ];

  const rows = appointments.map((apt) => [
    `"${apt.id}"`,
    `"${apt.patientName || ''}"`,
    `"${apt.doctorName || ''}"`,
    `"${apt.specialization || ''}"`,
    `"${apt.date || ''}"`,
    `"${apt.timeSlot || ''}"`,
    `"${(apt.reason || '').replace(/"/g, '""')}"`,
    `"${apt.status || ''}"`,
    `"${apt.createdAt ? new Date(apt.createdAt).toLocaleString() : ''}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export Appointment List to PDF using jsPDF and AutoTable
export const exportAppointmentsToPDF = (appointments, title = 'Doctor Appointment Report') => {
  if (!appointments || appointments.length === 0) {
    throw new Error('No appointment data available to export.');
  }

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Clinic Header
  doc.setFillColor(59, 130, 246); // Primary accent blue #3B82F6
  doc.rect(0, 0, 297, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('MEDICARE CLINIC - APPOINTMENT MANAGEMENT SYSTEM', 14, 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const exportDate = `Generated on: ${new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}`;
  doc.text(exportDate, 297 - 14, 15, { align: 'right' });

  // Subheader title
  doc.setTextColor(31, 41, 55); // #1F2937
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 34);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text(`Total Records: ${appointments.length}`, 14, 40);

  // Table Columns & Rows
  const tableColumn = [
    'ID',
    'Patient Name',
    'Doctor Name',
    'Specialization',
    'Date',
    'Time Slot',
    'Reason',
    'Status'
  ];

  const tableRows = appointments.map((apt) => [
    apt.id,
    apt.patientName || 'N/A',
    apt.doctorName || 'N/A',
    apt.specialization || 'N/A',
    apt.date,
    apt.timeSlot,
    apt.reason ? (apt.reason.length > 30 ? apt.reason.substring(0, 27) + '...' : apt.reason) : 'N/A',
    apt.status
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 45,
    theme: 'grid',
    headStyles: {
      fillColor: [31, 41, 55],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [31, 41, 55]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 40 },
      2: { cellWidth: 42 },
      3: { cellWidth: 35 },
      4: { cellWidth: 26 },
      5: { cellWidth: 38 },
      6: { cellWidth: 45 },
      7: { cellWidth: 22 }
    },
    didParseCell: function (data) {
      if (data.section === 'body' && data.column.index === 7) {
        const val = data.cell.raw;
        if (val === 'Scheduled') {
          data.cell.styles.textColor = [59, 130, 246]; // Blue
          data.cell.styles.fontStyle = 'bold';
        } else if (val === 'Completed') {
          data.cell.styles.textColor = [34, 197, 94]; // Green
          data.cell.styles.fontStyle = 'bold';
        } else if (val === 'Cancelled') {
          data.cell.styles.textColor = [239, 68, 68]; // Red
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });

  // Footer page numbering
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(
      `Page ${i} of ${pageCount} - MediCare Appointment Admin`,
      297 / 2,
      210 - 10,
      { align: 'center' }
    );
  }

  doc.save(`Appointments_${new Date().toISOString().split('T')[0]}.pdf`);
};
