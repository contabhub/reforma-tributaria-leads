# 🚀 Configuração do Supabase - Guia Completo

Este guia explica como configurar o Supabase no seu projeto de reforma tributária.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Projeto React com Vite configurado
- Node.js instalado

## 🔧 Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Preencha as informações:
   - **Name**: `reforma-tributaria-leads`
   - **Database Password**: Crie uma senha forte
   - **Region**: Escolha a região mais próxima (ex: São Paulo)
5. Clique em "Create new project"

### 2. Executar Script SQL

1. No dashboard do Supabase, vá em **SQL Editor**
2. Copie todo o conteúdo do arquivo `supabase-leads-table.sql`
3. Cole no editor e clique em **Run**
4. Aguarde a execução completa

### 3. Obter Credenciais

1. No dashboard, vá em **Settings** > **API**
2. Copie as seguintes informações:
   - **Project URL** (ex: `https://abc123.supabase.co`)
   - **anon public** key (chave pública)

### 4. Configurar Variáveis de Ambiente

1. Copie o arquivo `env.example` para `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Edite o arquivo `.env.local` e substitua os valores:
   ```env
   VITE_SUPABASE_URL=https://seu-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
   ```

### 5. Instalar Dependências

```bash
npm install @supabase/supabase-js
```

### 6. Testar Configuração

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Abra o console do navegador e teste:
   ```javascript
   // Teste básico de conexão
   import { supabase } from './src/lib/supabase'
   console.log('Supabase configurado:', !!supabase)
   ```

## 📊 Verificar Implementação

### Testar Função de Inserção

No SQL Editor do Supabase, execute:

```sql
-- Teste de inserção
SELECT inserir_lead(
    'João Silva',
    '(11) 99999-9999',
    'joao@teste.com',
    true,
    false,
    NULL,
    'ebook-reforma-tributaria'
);

-- Verificar se foi inserido
SELECT * FROM leads ORDER BY created_at DESC LIMIT 5;
```

### Testar Estatísticas

```sql
-- Teste de estatísticas
SELECT estatisticas_leads();
```

### Testar Views

```sql
-- Teste das views
SELECT * FROM leads_contadores;
SELECT * FROM leads_franqueados;
SELECT * FROM leads_recentes;
```

## 🔒 Configurações de Segurança

### Row Level Security (RLS)

O RLS está configurado com as seguintes políticas:

- ✅ **Inserção**: Permitida para todos (público)
- ✅ **Visualização**: Apenas usuários autenticados
- ✅ **Atualização**: Apenas usuários autenticados

### Para Desabilitar RLS (Apenas para Testes)

```sql
-- ⚠️ APENAS PARA DESENVOLVIMENTO
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
```

### Para Reabilitar RLS

```sql
-- Reabilitar RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
```

## 📱 Integração com React

### Exemplo de Uso no Componente

```typescript
import { inserirLead, formatarDadosFormulario } from './src/lib/supabase'

const handleSubmit = async (formData: FormData) => {
  try {
    // Formatar dados
    const dadosFormatados = formatarDadosFormulario(formData)
    
    // Inserir lead
    const resultado = await inserirLead(dadosFormatados)
    
    if (resultado.success) {
      console.log('Lead inserido com sucesso:', resultado.lead_id)
      // Iniciar download do ebook
      iniciarDownload()
    } else {
      console.error('Erro ao inserir lead:', resultado.error)
    }
  } catch (error) {
    console.error('Erro inesperado:', error)
  }
}
```

## 🎯 Funcionalidades Disponíveis

### Funções Principais

- ✅ `inserirLead()` - Insere novo lead
- ✅ `buscarEstatisticas()` - Estatísticas gerais
- ✅ `buscarLeadsPorPeriodo()` - Leads por período
- ✅ `buscarTodosLeads()` - Todos os leads
- ✅ `buscarLeadsContadores()` - Apenas contadores
- ✅ `buscarLeadsFranqueados()` - Apenas franqueados
- ✅ `buscarLeadsRecentes()` - Leads dos últimos 30 dias
- ✅ `atualizarStatusLead()` - Atualiza status do lead

### Views Disponíveis

- ✅ `leads_contadores` - Leads que são contadores
- ✅ `leads_franqueados` - Leads que são franqueados
- ✅ `leads_recentes` - Leads dos últimos 30 dias

## 🔧 Troubleshooting

### Erro: "Variáveis de ambiente não encontradas"

**Solução:**
1. Verifique se o arquivo `.env.local` existe
2. Confirme se as variáveis estão corretas
3. Reinicie o servidor de desenvolvimento

### Erro: "Function not found"

**Solução:**
1. Verifique se o script SQL foi executado completamente
2. Confirme se as funções foram criadas no Supabase
3. Verifique os logs no SQL Editor

### Erro: "Permission denied"

**Solução:**
1. Verifique as políticas de RLS
2. Confirme se está usando a chave anônima correta
3. Verifique se o usuário tem permissões adequadas

## 📞 Suporte

Para problemas específicos:

1. **Logs do Supabase**: Dashboard > Logs
2. **SQL Editor**: Para testar queries diretamente
3. **Documentação**: [supabase.com/docs](https://supabase.com/docs)

## ✅ Checklist de Configuração

- [ ] Projeto criado no Supabase
- [ ] Script SQL executado com sucesso
- [ ] Credenciais copiadas
- [ ] Arquivo `.env.local` configurado
- [ ] Dependência `@supabase/supabase-js` instalada
- [ ] Teste de conexão realizado
- [ ] Função de inserção testada
- [ ] RLS configurado corretamente

---

**🎉 Parabéns!** Seu projeto está configurado e pronto para capturar leads!
