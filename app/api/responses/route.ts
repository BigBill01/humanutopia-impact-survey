import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  const body = await request.json()
  
  const { session_id, pillar, is_before, score, student_id } = body

  const { data, error } = await supabase
    .from('responses')
    .insert([
      {
        student_id,
        session_id,
        pillar,
        is_before,
        score
      }
    ])
    .select()

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}