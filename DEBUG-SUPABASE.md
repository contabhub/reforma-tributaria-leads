# 🔍 Debug do Supabase - Guia de Diagnóstico

Este guia explica como usar os logs adicionados para diagnosticar problemas com o Supabase.

## 📋 Logs Adicionados

### 1. **Logs do Formulário** (`App.tsx`)
- ✅ Validação detalhada de cada campo
- ✅ Formatação dos dados
- ✅ Processo de submissão completo
- ✅ Resposta do Supabase

### 2. **Logs do Supabase** (`src/lib/supabase.ts`)
- ✅ Configuração do cliente
- ✅ Chamadas RPC detalhadas
- ✅ Respostas e erros completos
- ✅ Formatação de dados

### 3. **Testes Automáticos** (`src/utils/testSupabase.ts`)
- ✅ Verificação de configuração
- ✅ Teste de conexão
- ✅ Verificação de funções SQL
- ✅ Teste de inserção

## 🚀 Como Usar os Logs

### 1. Abrir o Console do Navegador
1. Pressione `F12` ou `Ctrl+Shift+I`
2. Vá para a aba **Console**
3. Recarregue a página

### 2. Observar os Logs Automáticos
Quando a página carregar, você verá logs como:
```
🚀 [APP] Componente carregado, executando testes do Supabase...
🧪 [TESTE] Iniciando testes do Supabase...
🔍 [TESTE] 1. Verificando configuração do cliente...
```

### 3. Testar o Formulário
1. Preencha o formulário
2. Clique em "Quero receber o ebook agora!"
3. Observe os logs no console

## 🔍 O que Procurar nos Logs

### ✅ **Logs de Sucesso**
```
✅ [TESTE] Cliente Supabase configurado
✅ [TESTE] Variáveis de ambiente configuradas
✅ [FORMULÁRIO] Lead salvo com sucesso! ID: abc123
```

### ❌ **Logs de Erro Comuns**

#### 1. **Variáveis de Ambiente Não Configuradas**
```
❌ [TESTE] URL: NÃO CONFIGURADA
❌ [TESTE] Chave: NÃO CONFIGURADA
```
**Solução:** Configure o arquivo `.env.local`

#### 2. **Função SQL Não Encontrada**
```
❌ [VERIFICAÇÃO] Função inserir_lead não encontrada
```
**Solução:** Execute o script SQL no Supabase

#### 3. **Erro de Permissão (RLS)**
```
❌ [VERIFICAÇÃO] Tabela leads não encontrada ou sem permissão
```
**Solução:** Verifique as políticas de RLS

#### 4. **Erro de Validação**
```
❌ [VALIDAÇÃO] Formato de telefone inválido: (11) 99999-9999
```
**Solução:** Verifique o formato dos dados

## 🎯 Problemas Mais Comuns

### 1. **"Variáveis de ambiente não encontradas"**
```bash
# Verifique se o arquivo .env.local existe
ls -la .env.local

# Verifique o conteúdo (não commite este arquivo!)
cat .env.local
```

### 2. **"Function not found"**
- Acesse o Supabase Dashboard
- Vá em SQL Editor
- Execute o script `supabase-leads-table.sql` novamente

### 3. **"Permission denied"**
```sql
-- No SQL Editor do Supabase, execute:
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
```

### 4. **"Network error"**
- Verifique sua conexão com a internet
- Verifique se o projeto Supabase está ativo
- Verifique se as credenciais estão corretas

## 📊 Exemplo de Logs de Sucesso

```
🚀 [APP] Componente carregado, executando testes do Supabase...
🧪 [TESTE] Iniciando testes do Supabase...
✅ [TESTE] Cliente Supabase configurado
✅ [TESTE] Variáveis de ambiente configuradas
✅ [TESTE] Conexão básica funcionando
✅ [TESTE] Função de estatísticas funcionando
✅ [TESTE] Inserção de lead funcionando, ID: abc123

🚀 [FORMULÁRIO] Iniciando submissão do formulário...
✅ [FORMULÁRIO] Validação passou, processando...
🔄 [FORMULÁRIO] Formatando dados para o Supabase...
✅ [FORMATAÇÃO] Dados formatados: {...}
📤 [FORMULÁRIO] Enviando dados para o Supabase...
✅ [SUPABASE] Lead inserido com sucesso! ID: def456
✅ [FORMULÁRIO] Lead salvo com sucesso! ID: def456
🎉 [FORMULÁRIO] Processo concluído com sucesso!
```

## 🔧 Comandos Úteis para Debug

### No Console do Navegador:
```javascript
// Testar manualmente
import { testarConexaoSupabase } from './src/utils/testSupabase'
testarConexaoSupabase()

// Verificar variáveis de ambiente
console.log('URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY)

// Testar inserção manual
import { inserirLead } from './src/lib/supabase'
inserirLead({
  nome: 'Teste Manual',
  telefone: '(11) 99999-9999',
  email: 'teste@exemplo.com',
  is_contador: true,
  is_franqueado: false
})
```

### No SQL Editor do Supabase:
```sql
-- Verificar se a tabela existe
SELECT * FROM information_schema.tables WHERE table_name = 'leads';

-- Verificar se as funções existem
SELECT * FROM information_schema.routines WHERE routine_name LIKE '%lead%';

-- Testar inserção direta
SELECT inserir_lead(
    'Teste SQL',
    '(11) 99999-9999',
    'teste@sql.com',
    true,
    false,
    NULL,
    'teste-sql'
);

-- Verificar leads inseridos
SELECT * FROM leads ORDER BY created_at DESC LIMIT 5;
```

## 📞 Próximos Passos

1. **Execute o projeto** e observe os logs
2. **Identifique o problema** baseado nos logs
3. **Aplique a solução** correspondente
4. **Teste novamente** até funcionar

---

**💡 Dica:** Se os logs não aparecerem, verifique se o console do navegador está aberto e se não há filtros ativos.
