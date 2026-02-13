import { supabase } from './supabase'
import type { BoardState } from '@/types/board'

const USER_ID = 'single-user'

export async function fetchBoardState(): Promise<BoardState | null> {
  const { data, error } = await supabase
    .from('board_state')
    .select('data')
    .eq('user_id', USER_ID)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching board state:', error)
    throw new Error(`Failed to fetch board: ${error.message}`)
  }

  return data.data as BoardState
}

export async function saveBoardState(state: BoardState): Promise<void> {
  const { error } = await supabase
    .from('board_state')
    .upsert(
      {
        user_id: USER_ID,
        data: state as unknown as Record<string, unknown>,
      },
      {
        onConflict: 'user_id',
      }
    )

  if (error) {
    console.error('Error saving board state:', error)
    throw new Error(`Failed to save board: ${error.message}`)
  }
}

export async function deleteBoardState(): Promise<void> {
  const { error } = await supabase
    .from('board_state')
    .delete()
    .eq('user_id', USER_ID)

  if (error) {
    console.error('Error deleting board state:', error)
    throw new Error(`Failed to delete board: ${error.message}`)
  }
}
