import { supabase, inserirLead, buscarEstatisticas } from '../lib/supabase'

/**
 * Função para testar a conexão com o Supabase
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
    
    // Teste 5: Testar inserção de lead
    console.log('🔍 [TESTE] 5. Testando inserção de lead...')
    const resultado = await inserirLead({
      nome: 'Teste Automático',
      telefone: '(11) 99999-9999',
      email: `teste-${Date.now()}@exemplo.com`,
      is_contador: true,
      is_franqueado: false,
      fonte_lead: 'teste-automatico'
    })
    
    if (resultado.success) {
      console.log('✅ [TESTE] Inserção de lead funcionando, ID:', resultado.lead_id)
    } else {
      console.log('❌ [TESTE] Inserção de lead falhou:', resultado.error)
    }
    
    console.log('🎉 [TESTE] Todos os testes concluídos!')
    return true
    
  } catch (error) {
    console.error('💥 [TESTE] Erro durante os testes:', error)
    return false
  }
}

/**
 * Função para verificar se as funções SQL existem
 */
export async function verificarFuncoesSQL() {
  console.log('🔍 [VERIFICAÇÃO] Verificando funções SQL...')
  
  try {
    // Testar função inserir_lead
    const resultado = await supabase.rpc('inserir_lead', {
      p_nome: 'Teste Função',
      p_telefone: '(11) 88888-8888',
      p_email: `teste-funcao-${Date.now()}@exemplo.com`,
      p_is_contador: false,
      p_is_franqueado: false,
      p_nome_unidade: null,
      p_fonte_lead: 'teste-funcao'
    })
    
    if (resultado.error) {
      console.log('❌ [VERIFICAÇÃO] Função inserir_lead não encontrada:', resultado.error.message)
      return false
    } else {
      console.log('✅ [VERIFICAÇÃO] Função inserir_lead encontrada')
    }
    
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

// Executar testes automaticamente se este arquivo for importado
if (typeof window !== 'undefined') {
  // Aguardar um pouco para garantir que tudo carregou
  setTimeout(() => {
    console.log('🚀 [AUTO-TESTE] Executando testes automáticos...')
    testarConexaoSupabase()
  }, 2000)
}
