# 📚 Landing Page - Ebook Reforma Tributária

Landing page moderna para captura de leads para download de ebook sobre reforma tributária, desenvolvida com React, TypeScript e Supabase.

## 🚀 Funcionalidades

- ✅ **Formulário de Captura de Leads** - Coleta dados de contadores e empresários
- ✅ **Validação em Tempo Real** - Validação de campos obrigatórios
- ✅ **Integração com Supabase** - Armazenamento seguro de leads
- ✅ **Download Automático** - Download do ebook após preenchimento
- ✅ **Design Responsivo** - Interface moderna e adaptável
- ✅ **Logs de Debug** - Sistema completo de logs para diagnóstico

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide React
- **Backend**: Supabase (PostgreSQL)
- **Deploy**: Vercel/Netlify (recomendado)

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

## 🔧 Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/reforma-tributaria-leads.git
   cd reforma-tributaria-leads
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp env.example .env.local
   ```
   
   Edite o arquivo `.env.local` com suas credenciais do Supabase:
   ```env
   VITE_SUPABASE_URL=https://seu-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima
   ```

4. **Configure o Supabase**
   - Crie um projeto no [Supabase](https://supabase.com)
   - Execute o script `supabase-leads-table.sql` no SQL Editor
   - Configure as políticas de RLS conforme `fix-rls-policy.sql`

5. **Execute o projeto**
   ```bash
   npm run dev
   ```

## 📊 Estrutura do Projeto

```
reforma-tributaria-leads/
├── src/
│   ├── App.tsx                 # Componente principal
│   ├── lib/
│   │   └── supabase.ts         # Configuração e funções do Supabase
│   ├── utils/
│   │   └── testSupabase.ts     # Funções de teste e debug
│   └── assets/
│       └── Contabhub logo.png  # Logo da empresa
├── supabase-leads-table.sql    # Script SQL para criar tabela
├── fix-rls-policy.sql          # Correção de políticas RLS
├── env.example                 # Template de variáveis de ambiente
└── README.md                   # Este arquivo
```

## 🎯 Como Usar

### 1. Configuração do Supabase

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Crie um novo projeto
3. Execute o script `supabase-leads-table.sql` no SQL Editor
4. Configure as políticas de RLS com `fix-rls-policy.sql`
5. Copie as credenciais para o arquivo `.env.local`

### 2. Personalização

- **Logo**: Substitua `src/assets/Contabhub logo.png`
- **Cores**: Edite as classes Tailwind no `App.tsx`
- **Ebook**: Atualize a URL do download em `App.tsx`
- **Campos**: Modifique o formulário conforme necessário

### 3. Deploy

```bash
# Build para produção
npm run build

# Deploy no Vercel
vercel --prod

# Ou no Netlify
netlify deploy --prod
```

## 🔍 Debug e Logs

O projeto inclui um sistema completo de logs para diagnóstico:

- **Logs do Formulário**: Validação e processamento
- **Logs do Supabase**: Conexão e operações
- **Testes Automáticos**: Verificação de configuração

Para ver os logs:
1. Abra o console do navegador (`F12`)
2. Recarregue a página
3. Observe os logs automáticos
4. Teste o formulário para logs detalhados

## 📈 Funcionalidades do Supabase

### Tabela de Leads
- Armazenamento seguro de dados
- Validação automática
- Índices otimizados
- Timestamps automáticos

### Funções SQL
- `inserir_lead()` - Inserção com validação
- `estatisticas_leads()` - Estatísticas em tempo real
- `buscar_leads_por_periodo()` - Consultas por período

### Views Úteis
- `leads_contadores` - Apenas contadores
- `leads_franqueados` - Apenas franqueados
- `leads_recentes` - Últimos 30 dias

## 🔒 Segurança

- **Row Level Security (RLS)** configurado
- **Validação de dados** no frontend e backend
- **Variáveis de ambiente** protegidas
- **Políticas de acesso** definidas

## 📱 Responsividade

- Design mobile-first
- Adaptável para tablets e desktops
- Interface otimizada para conversão

## 🚀 Performance

- Build otimizado com Vite
- Lazy loading de componentes
- Índices otimizados no banco
- Cache de consultas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique a documentação do Supabase
2. Consulte os logs de debug
3. Abra uma issue no GitHub
4. Entre em contato com a equipe

## 🎉 Agradecimentos

- [Supabase](https://supabase.com) - Backend como serviço
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS
- [Lucide](https://lucide.dev) - Ícones
- [Vite](https://vitejs.dev) - Build tool

---

**Desenvolvido com ❤️ para capturar leads de qualidade!**
