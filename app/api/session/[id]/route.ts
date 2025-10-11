import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: 'Session not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(data)
}