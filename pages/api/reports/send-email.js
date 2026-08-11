import { Resend } from 'resend';
import { supabase } from '../../../lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

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
        sucursal,
        venta_total,
        creado_en
      `)
      .gte('creado_en', sevenDaysAgo.toISOString());

    if (error) throw error;

    const totalVentas = cierres.reduce((sum, c) => sum + (c.venta_total || 0), 0);
    const totalCierres = cierres.length;

    const sucursalStats = {};
    cierres.forEach((c) => {
      if (!sucursalStats[c.sucursal]) {
        sucursalStats[c.sucursal] = { cierres: 0, ventas: 0 };
      }
      sucursalStats[c.sucursal].cierres += 1;
      sucursalStats[c.sucursal].ventas += c.venta_total || 0;
    });

    const htmlContent = `
      <h2>📊 Reporte Semanal de Cierres de Turno</h2>
      <p>Hola,</p>
      <p>Adjunto encontrarás el reporte detallado de cierres de turno de esta semana.</p>

      <h3>Resumen General</h3>
      <ul>
        <li><strong>Total de Cierres:</strong> ${totalCierres}</li>
        <li><strong>Ventas Totales:</strong> $${totalVentas.toFixed(2)}</li>
      </ul>

      <h3>Por Sucursal</h3>
      <ul>
        ${Object.entries(sucursalStats)
          .map(
            ([sucursal, stats]) =>
              `<li><strong>${sucursal}:</strong> ${stats.cierres} cierres | $${stats.ventas.toFixed(2)}</li>`
          )
          .join('')}
      </ul>

      <p>El PDF adjunto contiene los detalles completos por sucursal.</p>
      <p>Saludos,<br/>Sistema de Reportes Mindora</p>
    `;

    const pdfResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/reports/generate-pdf`, {
      method: 'POST',
    });

    if (!pdfResponse.ok) {
      throw new Error('Error generating PDF');
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();

    const result = await resend.emails.send({
      from: 'Mindora Reports <reports@resend.dev>',
      to: 'mindoracorp@gmail.com',
      subject: `📊 Reporte Semanal de Cierres - ${new Date().toLocaleDateString('es-MX')}`,
      html: htmlContent,
      attachments: [
        {
          filename: 'reporte_cierres.pdf',
          content: Buffer.from(pdfBuffer),
        },
      ],
    });

    if (result.error) {
      throw result.error;
    }

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      emailId: result.data.id,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: error.message });
  }
}
