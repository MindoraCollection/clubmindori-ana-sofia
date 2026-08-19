import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Crear cliente DENTRO de la función, no afuera
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const { searchParams } = new URL(request.url);
    const sucursal = searchParams.get('sucursal')?.toUpperCase() || '';
    const vendedora = searchParams.get('vendedora') || '';

    if (!sucursal || !vendedora) {
      return NextResponse.json(
        { error: 'Faltan parámetros: sucursal y vendedora' },
        { status: 400 }
      );
    }

    const ahora = new Date();
    const horaRegistrada = ahora.toTimeString().slice(0, 5);
    const fecha = ahora.toISOString().split('T')[0];

    const { data: ultimoRegistro } = await supabase
      .from('asistencia')
      .select('tipo')
      .eq('vendedora_nombre', vendedora)
      .eq('fecha', fecha)
      .order('created_at', { ascending: false })
      .limit(1);

    const tipoRegistro = !ultimoRegistro || ultimoRegistro.length === 0 || ultimoRegistro[0].tipo === 'checkout'
      ? 'checkin'
      : 'checkout';

    const { error } = await supabase
      .from('asistencia')
      .insert({
        vendedora_nombre: vendedora,
        sucursal: sucursal,
        tipo: tipoRegistro,
        hora_registrada: horaRegistrada,
        fecha: fecha
      });

    if (error) throw error;

    const mensaje = tipoRegistro === 'checkin' 
      ? `✅ Check-in a las ${horaRegistrada}`
      : `👋 Check-out a las ${horaRegistrada}`;

    return NextResponse.json({
      success: true,
      mensaje: mensaje,
      vendedora: vendedora,
      sucursal: sucursal,
      hora: horaRegistrada,
      tipo: tipoRegistro
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
