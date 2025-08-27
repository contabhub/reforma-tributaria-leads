import { createClient } from '@supabase/supabase-js'

// Tipos para os leads
export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  is_contador: boolean;
  is_franqueado: boolean;
  nome_unidade?: string;
  fonte_lead: string;
  status_lead: string;
  created_at: string;
  updated_at: string;
}

// Tipo para dados de inserção (sem campos automáticos)
export interface LeadInsert {
  nome: string;
  telefone: string;
  email: string;
  is_contador: boolean;
  is_franqueado: boolean;
  nome_unidade?: string;
  fonte_lead?: string;
  status_lead?: string;
}

// Tipo para resposta da função inserir_lead
export interface LeadInsertResponse {
  success: boolean;
  error: string | null;
  lead_id: string | null;
}

// Tipo para estatísticas
export interface LeadStats {
  total_leads: number;
  contadores: number;
  franqueados: number;
  leads_hoje: number;
  leads_semana: number;
  leads_mes: number;
}

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Criar cliente do Supabase (com fallback para desenvolvimento)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Função para verificar se as credenciais estão configuradas
export function verificarConfiguracao(): boolean {
  return !!(supabaseUrl && supabaseAnonKey)
}

// =====================================================
// FUNÇÕES PARA MANIPULAR LEADS
// =====================================================

/**
 * Insere um novo lead no banco de dados
 */
export async function inserirLead(dados: LeadInsert): Promise<LeadInsertResponse> {
  console.log('🚀 [SUPABASE] Iniciando inserção de lead...')
  console.log('📊 [SUPABASE] Dados recebidos:', dados)
  
  // Verificar se as credenciais estão configuradas
  if (!verificarConfiguracao()) {
    console.error('❌ [SUPABASE] Variáveis de ambiente não configuradas')
    return {
      success: false,
      error: 'Variáveis de ambiente do Supabase não configuradas. Configure o arquivo .env.local',
      lead_id: null
    }
  }
  
  try {
    console.log('🔗 [SUPABASE] Verificando configuração do cliente...')
    console.log('📍 [SUPABASE] URL:', supabaseUrl)
    console.log('🔑 [SUPABASE] Chave anônima configurada:', !!supabaseAnonKey)
    
    console.log('📤 [SUPABASE] Chamando função RPC inserir_lead...')
    const { data, error } = await supabase
      .rpc('inserir_lead', {
        p_nome: dados.nome,
        p_telefone: dados.telefone,
        p_email: dados.email,
        p_is_contador: dados.is_contador,
        p_is_franqueado: dados.is_franqueado,
        p_nome_unidade: dados.nome_unidade,
        p_fonte_lead: dados.fonte_lead || 'ebook-reforma-tributaria'
      })

    console.log('📥 [SUPABASE] Resposta recebida:')
    console.log('   - Data:', data)
    console.log('   - Error:', error)

    if (error) {
      console.error('❌ [SUPABASE] Erro ao inserir lead:', error)
      console.error('   - Código:', error.code)
      console.error('   - Mensagem:', error.message)
      console.error('   - Detalhes:', error.details)
      console.error('   - Hint:', error.hint)
      
      return {
        success: false,
        error: error.message,
        lead_id: null
      }
    }

    console.log('✅ [SUPABASE] Lead inserido com sucesso!')
    console.log('🆔 [SUPABASE] Lead ID:', data?.lead_id)
    
    return data as LeadInsertResponse
  } catch (error) {
    console.error('💥 [SUPABASE] Erro inesperado ao inserir lead:', error)
    console.error('   - Tipo:', typeof error)
    console.error('   - Stack:', error instanceof Error ? error.stack : 'N/A')
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      lead_id: null
    }
  }
}

/**
 * Busca estatísticas dos leads
 */
export async function buscarEstatisticas(): Promise<LeadStats | null> {
  try {
    const { data, error } = await supabase
      .rpc('estatisticas_leads')

    if (error) {
      console.error('Erro ao buscar estatísticas:', error)
      return null
    }

    return data as LeadStats
  } catch (error) {
    console.error('Erro inesperado ao buscar estatísticas:', error)
    return null
  }
}

/**
 * Busca leads por período
 */
export async function buscarLeadsPorPeriodo(
  dataInicio: string,
  dataFim: string
): Promise<Lead[] | null> {
  try {
    const { data, error } = await supabase
      .rpc('buscar_leads_por_periodo', {
        p_data_inicio: dataInicio,
        p_data_fim: dataFim
      })

    if (error) {
      console.error('Erro ao buscar leads por período:', error)
      return null
    }

    return data as Lead[]
  } catch (error) {
    console.error('Erro inesperado ao buscar leads por período:', error)
    return null
  }
}

/**
 * Busca todos os leads (apenas usuários autenticados)
 */
export async function buscarTodosLeads(): Promise<Lead[] | null> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar leads:', error)
      return null
    }

    return data as Lead[]
  } catch (error) {
    console.error('Erro inesperado ao buscar leads:', error)
    return null
  }
}

/**
 * Busca leads de contadores
 */
export async function buscarLeadsContadores(): Promise<Lead[] | null> {
  try {
    const { data, error } = await supabase
      .from('leads_contadores')
      .select('*')

    if (error) {
      console.error('Erro ao buscar leads de contadores:', error)
      return null
    }

    return data as Lead[]
  } catch (error) {
    console.error('Erro inesperado ao buscar leads de contadores:', error)
    return null
  }
}

/**
 * Busca leads de franqueados
 */
export async function buscarLeadsFranqueados(): Promise<Lead[] | null> {
  try {
    const { data, error } = await supabase
      .from('leads_franqueados')
      .select('*')

    if (error) {
      console.error('Erro ao buscar leads de franqueados:', error)
      return null
    }

    return data as Lead[]
  } catch (error) {
    console.error('Erro inesperado ao buscar leads de franqueados:', error)
    return null
  }
}

/**
 * Busca leads recentes (últimos 30 dias)
 */
export async function buscarLeadsRecentes(): Promise<Lead[] | null> {
  try {
    const { data, error } = await supabase
      .from('leads_recentes')
      .select('*')

    if (error) {
      console.error('Erro ao buscar leads recentes:', error)
      return null
    }

    return data as Lead[]
  } catch (error) {
    console.error('Erro inesperado ao buscar leads recentes:', error)
    return null
  }
}

/**
 * Atualiza o status de um lead
 */
export async function atualizarStatusLead(
  leadId: string,
  novoStatus: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('leads')
      .update({ status_lead: novoStatus })
      .eq('id', leadId)

    if (error) {
      console.error('Erro ao atualizar status do lead:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Erro inesperado ao atualizar status do lead:', error)
    return false
  }
}

// =====================================================
// FUNÇÕES DE UTILIDADE
// =====================================================

/**
 * Formata dados do formulário para inserção
 */
export function formatarDadosFormulario(formData: {
  nome: string;
  telefone: string;
  email: string;
  isContador: string;
  isFranqueado: string;
  nomeUnidade: string;
}): LeadInsert {
  console.log('🔄 [FORMATAÇÃO] Dados originais do formulário:', formData)
  
  const dadosFormatados = {
    nome: formData.nome.trim(),
    telefone: formData.telefone.trim(),
    email: formData.email.trim().toLowerCase(),
    is_contador: formData.isContador === 'sim',
    is_franqueado: formData.isFranqueado === 'sim',
    nome_unidade: formData.isFranqueado === 'sim' ? formData.nomeUnidade.trim() : undefined,
    fonte_lead: 'ebook-reforma-tributaria',
    status_lead: 'novo'
  }
  
  console.log('✅ [FORMATAÇÃO] Dados formatados:', dadosFormatados)
  console.log('🔍 [FORMATAÇÃO] Validações:')
  console.log('   - Nome válido:', !!dadosFormatados.nome)
  console.log('   - Telefone válido:', !!dadosFormatados.telefone)
  console.log('   - Email válido:', !!dadosFormatados.email)
  console.log('   - É contador:', dadosFormatados.is_contador)
  console.log('   - É franqueado:', dadosFormatados.is_franqueado)
  console.log('   - Nome unidade (se franqueado):', dadosFormatados.nome_unidade)
  
  return dadosFormatados
}

/**
 * Valida se um email já existe
 */
export async function verificarEmailExistente(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('email')
      .eq('email', email.toLowerCase())
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Erro ao verificar email:', error)
      return false
    }

    return !!data
  } catch (error) {
    console.error('Erro inesperado ao verificar email:', error)
    return false
  }
}

export default supabase
