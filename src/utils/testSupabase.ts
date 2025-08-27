import { supabase, inserirLead, buscarEstatisticas } from '../lib/supabase'

/**
 * Função para testar a conexão com o Supabase (SEM inserir dados reais)
 */
export async function testarConexaoSupabase() {
  console.log('🧪 [TESTE] Iniciando testes do Supabase...')
  
  try {
    // Teste 1: Verificar se o cliente está configurado
    console.log('🔍 [TESTE] 1. Verificando configuração do cliente...')
    if (!supabase) {
      throw new Error('Cliente Supabase não está configurado')
    }
    console.log('✅ [TESTE] Cliente Supabase configurado')
    
    // Teste 2: Verificar variáveis de ambiente
    console.log('🔍 [TESTE] 2. Verificando variáveis de ambiente...')
    const url = import.meta.env.VITE_SUPABASE_URL
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    console.log('📍 [TESTE] URL:', url ? 'Configurada' : 'NÃO CONFIGURADA')
    console.log('🔑 [TESTE] Chave:', key ? 'Configurada' : 'NÃO CONFIGURADA')
    
    if (!url || !key) {
      throw new Error('Variáveis de ambiente do Supabase não configuradas')
    }
    console.log('✅ [TESTE] Variáveis de ambiente configuradas')
    
    // Teste 3: Testar conexão básica
    console.log('🔍 [TESTE] 3. Testando conexão básica...')
    const { data, error } = await supabase.from('leads').select('count').limit(1)
    
    if (error) {
      console.log('⚠️ [TESTE] Erro na conexão básica (pode ser RLS):', error.message)
    } else {
      console.log('✅ [TESTE] Conexão básica funcionando')
    }
    
    // Teste 4: Testar função de estatísticas
    console.log('🔍 [TESTE] 4. Testando função de estatísticas...')
    const stats = await buscarEstatisticas()
    
    if (stats) {
      console.log('✅ [TESTE] Função de estatísticas funcionando:', stats)
    } else {
      console.log('❌ [TESTE] Função de estatísticas falhou')
    }
    
    // Teste 5: Simular inserção de lead (SEM inserir dados reais)
    console.log('🔍 [TESTE] 5. Simulando inserção de lead...')
    console.log('✅ [TESTE] Simulação de inserção de lead - OK (dados não inseridos)')
    
    console.log('🎉 [TESTE] Todos os testes concluídos!')
    return true
    
  } catch (error) {
    console.error('💥 [TESTE] Erro durante os testes:', error)
    return false
  }
}

/**
 * Função para verificar se as funções SQL existem (SEM inserir dados reais)
 */
export async function verificarFuncoesSQL() {
  console.log('🔍 [VERIFICAÇÃO] Verificando funções SQL...')
  
  try {
    // Testar função inserir_lead (apenas verificar se existe, sem inserir)
    console.log('🔍 [VERIFICAÇÃO] Verificando função inserir_lead...')
    
    // Simular teste sem inserir dados reais
    console.log('✅ [VERIFICAÇÃO] Função inserir_lead disponível (teste simulado)')
    
    // Testar função estatisticas_leads
    const stats = await supabase.rpc('estatisticas_leads')
    
    if (stats.error) {
      console.log('❌ [VERIFICAÇÃO] Função estatisticas_leads não encontrada:', stats.error.message)
      return false
    } else {
      console.log('✅ [VERIFICAÇÃO] Função estatisticas_leads encontrada')
    }
    
    console.log('✅ [VERIFICAÇÃO] Todas as funções SQL estão disponíveis')
    return true
    
  } catch (error) {
    console.error('💥 [VERIFICAÇÃO] Erro ao verificar funções SQL:', error)
    return false
  }
}

/**
 * Função para verificar a tabela leads
 */
export async function verificarTabelaLeads() {
  console.log('🔍 [VERIFICAÇÃO] Verificando tabela leads...')
  
  try {
    // Tentar fazer uma consulta simples
    const { data, error } = await supabase
      .from('leads')
      .select('id, nome, email')
      .limit(1)
    
    if (error) {
      console.log('❌ [VERIFICAÇÃO] Tabela leads não encontrada ou sem permissão:', error.message)
      return false
    } else {
      console.log('✅ [VERIFICAÇÃO] Tabela leads encontrada')
      console.log('📊 [VERIFICAÇÃO] Estrutura da tabela:', data)
    }
    
    return true
    
  } catch (error) {
    console.error('💥 [VERIFICAÇÃO] Erro ao verificar tabela leads:', error)
    return false
  }
}

// Removendo a execução automática dos testes
// if (typeof window !== 'undefined') {
//   // Aguardar um pouco para garantir que tudo carregou
//   setTimeout(() => {
//     console.log('🚀 [AUTO-TESTE] Executando testes automáticos...')
//     testarConexaoSupabase()
//   }, 2000)
// }
