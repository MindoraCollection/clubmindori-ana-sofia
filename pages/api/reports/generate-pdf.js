import { jsPDF } from 'jspdf';
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: cierres, error } = await supabase
      .from('cierres_turno')
      .select(`
        id,
        usuario_id,
        sucursal,
        turno,
        venta_total,
        reembolsos,
        salidas_caja,
        entradas_caja,
        garantias_cantidad,
        cambios_piezas,
        creado_en,
        usuarios:usuario_id (nombre)
      `)
      .gte('creado_en', sevenDaysAgo.toISOString())
      .order('creado_en', { ascending: false });

    if (error) throw error;

    const sucursales = {
      'BL Juriquilla': [],
      'Plaza Galerias': [],
      'Miyana Polanco': [],
      'Fashion Drive Mty': [],
    };

    cierres.forEach((cierre) => {
      if (sucursales[cierre.sucursal]) {
        sucursales[cierre.sucursal].push(cierre);
      }
    });

    const pdf = new jsPDF();
    let yPosition = 20;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 15;

    pdf.setFontSize(18);
    pdf.text('Reporte Semanal de Cierres de Turno', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    const fecha = new Date().toLocaleDateString('es-MX');
    pdf.text(`Generado: ${fecha}`, margin, yPosition);
    yPosition += 15;

    Object.entries(sucursales).forEach(([sucursal, cierres]) => {
      pdf.setFontSize(12);
      pdf.setTextColor(232, 180, 200);
      pdf.text(`📍 ${sucursal}`, margin, yPosition);
      yPosition += 7;

      const totalVentas = cierres.reduce((sum, c) => sum + (c.venta_total || 0), 0);
      const totalCierres = cierres.length;
      const totalGarantias = cierres.reduce((sum, c) => sum + (c.garantias_cantidad || 0), 0);

      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Cierres: ${totalCierres} | Ventas: $${totalVentas.toFixed(2)} | Garantías: ${totalGarantias}`, margin + 2, yPosition);
      yPosition += 6;

      const tableData = cierres.map((c) => [
        c.usuarios?.nombre || 'Desconocido',
        c.turno,
        `$${c.venta_total || 0}`,
        c.reembolsos || 0,
        c.garantias_cantidad || 0,
        new Date(c.creado_en).toLocaleDateString('es-MX'),
      ]);

      pdf.autoTable({
        startY: yPosition,
        head: [['Mindori', 'Turno', 'Ventas', 'Reembolsos', 'Garantías', 'Fecha']],
        body: tableData,
        margin: margin,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [232, 180, 200] },
      });

      yPosition = pdf.lastAutoTable.finalY + 12;

      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
      }
    });

    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reporte_cierres.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: error.message });
  }
}
