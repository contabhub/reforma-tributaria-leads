# Estrutura SQL para Leads - Supabase

Este documento explica como implementar e usar a estrutura SQL para captura de leads no Supabase.

## 📋 Visão Geral

A estrutura criada inclui:
- Tabela principal `leads` com todos os campos do formulário
- Índices otimizados para performance
- Funções para inserção e consulta de dados
- Row Level Security (RLS) para segurança
- Views úteis para diferentes tipos de consulta

## 🚀 Como Implementar no Supabase

### 1. Acesse o Supabase Dashboard
1. Faça login no [Supabase](https://supabase.com)
2. Acesse seu projeto
3. Vá para **SQL Editor**

### 2. Execute o Script SQL
1. Copie todo o conteúdo do arquivo `supabase-leads-table.sql`
2. Cole no SQL Editor do Supabase
3. Execute o script completo

### 3. Verifique a Implementação
Após executar o script, você terá:
- ✅ Tabela `leads` criada
- ✅ Índices otimizados
- ✅ Funções de inserção e consulta
- ✅ RLS configurado
- ✅ Views úteis

## 📊 Estrutura da Tabela

### Campos Principais
| Campo | Tipo | Descrição | Obrigatório |
|-------|------|-----------|-------------|
| `id` | UUID | Identificador único | ✅ |
| `nome` | VARCHAR(255) | Nome completo | ✅ |
| `telefone` | VARCHAR(20) | Telefone com DDD | ✅ |
| `email` | VARCHAR(255) | Email (único) | ✅ |
| `is_contador` | BOOLEAN | É contador? | ✅ |
| `is_franqueado` | BOOLEAN | É franqueado? | ✅ |
| `nome_unidade` | VARCHAR(255) | Nome da unidade | ❌ |

### Campos de Metadados
| Campo | Tipo | Descrição | Padrão |
|-------|------|-----------|--------|
| `fonte_lead` | VARCHAR(100) | Origem do lead | 'ebook-reforma-tributaria' |
| `status_lead` | VARCHAR(50) | Status atual | 'novo' |
| `created_at` | TIMESTAMP | Data de criação | NOW() |
| `updated_at` | TIMESTAMP | Última atualização | NOW() |

## 🔧 Funções Disponíveis

### 1. Inserir Lead
```sql
SELECT inserir_lead(
    'João Silva',           -- nome
    '(11) 99999-9999',      -- telefone
    'joao@email.com',       -- email
    true,                   -- is_contador
    false,                  -- is_franqueado
    NULL,                   -- nome_unidade (opcional)
    'ebook-reforma-tributaria' -- fonte_lead
);
```

**Retorna:**
```json
{
  "success": true,
  "error": null,
  "lead_id": "uuid-do-lead"
}
```

### 2. Buscar Leads por Período
```sql
SELECT * FROM buscar_leads_por_periodo('2024-01-01', '2024-12-31');
```

### 3. Estatísticas Gerais
```sql
SELECT estatisticas_leads();
```

**Retorna:**
```json
{
  "total_leads": 150,
  "contadores": 89,
  "franqueados": 23,
  "leads_hoje": 5,
  "leads_semana": 25,
  "leads_mes": 95
}
```

## 👀 Views Úteis

### 1. Leads de Contadores
```sql
SELECT * FROM leads_contadores;
```

### 2. Leads de Franqueados
```sql
SELECT * FROM leads_franqueados;
```

### 3. Leads Recentes (30 dias)
```sql
SELECT * FROM leads_recentes;
```

## 🔒 Segurança (RLS)

A estrutura inclui Row Level Security configurado:

- **Inserção**: Permitida para todos (público)
- **Visualização**: Apenas usuários autenticados
- **Atualização**: Apenas usuários autenticados

## 📱 Integração com Frontend

### Exemplo de Integração com React/TypeScript

```typescript
// Tipos para o lead
interface Lead {
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

// Função para inserir lead
async function inserirLead(dados: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .rpc('inserir_lead', {
      p_nome: dados.nome,
      p_telefone: dados.telefone,
      p_email: dados.email,
      p_is_contador: dados.is_contador,
      p_is_franqueado: dados.is_franqueado,
      p_nome_unidade: dados.nome_unidade,
      p_fonte_lead: dados.fonte_lead
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Função para buscar estatísticas
async function buscarEstatisticas() {
  const { data, error } = await supabase
    .rpc('estatisticas_leads');

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
```

## 🎯 Casos de Uso

### 1. Captura de Lead no Formulário
```typescript
const handleSubmit = async (formData: FormData) => {
  try {
    const resultado = await inserirLead({
      nome: formData.nome,
      telefone: formData.telefone,
      email: formData.email,
      is_contador: formData.isContador === 'sim',
      is_franqueado: formData.isFranqueado === 'sim',
      nome_unidade: formData.isFranqueado === 'sim' ? formData.nomeUnidade : null,
      fonte_lead: 'ebook-reforma-tributaria',
      status_lead: 'novo'
    });

    if (resultado.success) {
      // Lead inserido com sucesso
      console.log('Lead ID:', resultado.lead_id);
    } else {
      // Erro na inserção
      console.error('Erro:', resultado.error);
    }
  } catch (error) {
    console.error('Erro ao inserir lead:', error);
  }
};
```

### 2. Dashboard de Estatísticas
```typescript
const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const carregarEstatisticas = async () => {
      try {
        const estatisticas = await buscarEstatisticas();
        setStats(estatisticas);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      }
    };

    carregarEstatisticas();
  }, []);

  return (
    <div>
      <h2>Dashboard de Leads</h2>
      {stats && (
        <div>
          <p>Total de Leads: {stats.total_leads}</p>
          <p>Contadores: {stats.contadores}</p>
          <p>Franqueados: {stats.franqueados}</p>
          <p>Leads Hoje: {stats.leads_hoje}</p>
        </div>
      )}
    </div>
  );
};
```

## 🔧 Manutenção

### Backup Automático
O Supabase faz backup automático, mas você pode exportar dados manualmente:

```sql
-- Exportar todos os leads
SELECT * FROM leads ORDER BY created_at DESC;

-- Exportar leads de um período específico
SELECT * FROM buscar_leads_por_periodo('2024-01-01', '2024-12-31');
```

### Limpeza de Dados
```sql
-- Remover leads duplicados (manter apenas o mais recente)
DELETE FROM leads 
WHERE id NOT IN (
  SELECT MAX(id) 
  FROM leads 
  GROUP BY email
);

-- Remover leads antigos (mais de 1 ano)
DELETE FROM leads 
WHERE created_at < NOW() - INTERVAL '1 year';
```

## 📞 Suporte

Para dúvidas sobre a implementação:
1. Consulte a documentação do Supabase
2. Verifique os logs no dashboard do Supabase
3. Teste as funções no SQL Editor antes de usar no código

---

**Nota**: Esta estrutura está otimizada para o projeto de reforma tributária da Contabhub e pode ser adaptada para outros projetos conforme necessário.
