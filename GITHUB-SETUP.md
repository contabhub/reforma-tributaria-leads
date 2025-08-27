# 🚀 Configuração do Repositório no GitHub

Este guia explica como configurar e subir o projeto para o GitHub.

## 📋 Passos para Criar o Repositório

### 1. Criar Repositório no GitHub

1. Acesse [github.com](https://github.com)
2. Clique em **"New repository"**
3. Configure o repositório:
   - **Repository name**: `reforma-tributaria-leads`
   - **Description**: `Landing page para captura de leads - Ebook Reforma Tributária`
   - **Visibility**: Public ou Private (sua escolha)
   - **Initialize with**: ❌ NÃO marque nenhuma opção
4. Clique em **"Create repository"**

### 2. Configurar Git Local

```bash
# Inicializar git (se ainda não foi feito)
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "🎉 Initial commit: Landing page para captura de leads"

# Adicionar o repositório remoto
git remote add origin https://github.com/SEU-USUARIO/reforma-tributaria-leads.git

# Enviar para o GitHub
git branch -M main
git push -u origin main
```

### 3. Configurações Recomendadas

#### Adicionar Topics no GitHub
No repositório, adicione estes topics:
- `react`
- `typescript`
- `supabase`
- `landing-page`
- `lead-generation`
- `tailwindcss`
- `vite`

#### Configurar Branch Protection (Opcional)
1. Vá em **Settings** > **Branches**
2. Adicione regra para `main`:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Include administrators

## 🔧 Configuração de Deploy

### Opção 1: Vercel (Recomendado)

1. Acesse [vercel.com](https://vercel.com)
2. Conecte com GitHub
3. Importe o repositório
4. Configure as variáveis de ambiente:
   ```
   VITE_SUPABASE_URL=https://seu-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima
   ```
5. Deploy automático!

### Opção 2: Netlify

1. Acesse [netlify.com](https://netlify.com)
2. Conecte com GitHub
3. Importe o repositório
4. Configure as variáveis de ambiente
5. Deploy!

## 📝 Arquivos Importantes

### ✅ Arquivos Incluídos no Repo
- `src/` - Código fonte
- `supabase-leads-table.sql` - Script SQL
- `fix-rls-policy.sql` - Correção RLS
- `env.example` - Template de variáveis
- `README.md` - Documentação
- `LICENSE` - Licença MIT
- `.gitignore` - Arquivos ignorados

### ❌ Arquivos NÃO Incluídos
- `.env.local` - Variáveis de ambiente (segurança)
- `node_modules/` - Dependências (instaladas via npm)
- `dist/` - Build de produção (gerado automaticamente)

## 🔒 Segurança

### Variáveis de Ambiente
- **NUNCA** commite o arquivo `.env.local`
- Use `env.example` como template
- Configure as variáveis no serviço de deploy

### Credenciais do Supabase
- Mantenha as chaves seguras
- Use apenas a chave anônima no frontend
- A chave de serviço deve ficar apenas no backend

## 📊 Monitoramento

### GitHub Insights
- **Traffic**: Visualizações e clones
- **Contributors**: Quem contribuiu
- **Commits**: Histórico de mudanças

### Analytics (Opcional)
- Google Analytics
- Vercel Analytics
- Supabase Analytics

## 🤝 Colaboração

### Issues
- Use templates para bugs e features
- Adicione labels apropriadas
- Atribua responsáveis

### Pull Requests
- Use descrições detalhadas
- Adicione screenshots se necessário
- Solicite reviews

## 🎯 Próximos Passos

1. ✅ Criar repositório no GitHub
2. ✅ Fazer push do código
3. ✅ Configurar deploy automático
4. ✅ Testar em produção
5. ✅ Monitorar performance
6. ✅ Coletar feedback

## 📞 Suporte

Para problemas com o GitHub:
1. Verifique a documentação oficial
2. Consulte as issues do repositório
3. Entre em contato com a equipe

---

**🎉 Seu projeto está pronto para o GitHub!**
