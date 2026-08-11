import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('cierres_turno')
      .select(`
        id,
        usuario_id,
        sucursal,
        turno,
        venta_total,
        creado_en,
        usuarios:usuario_id (
          nombre
        )
      `)
      .order('creado_en', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    const cierres = data.map((cierre) => ({
      id: cierre.id,
      mindori_id: cierre.usuarios?.nombre || 'Desconocido',
      sucursal: cierre.sucursal,
      turno: cierre.turno,
      venta_total: cierre.venta_total,
      fecha: cierre.creado_en,
      hora: cierre.turno,
      creado_en: cierre.creado_en,
    }));

    return res.status(200).json(cierres);
  } catch (error) {
    console.error('Error fetching cierres:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
