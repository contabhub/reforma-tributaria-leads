-- =====================================================
-- CORREÇÃO DAS POLÍTICAS DE RLS - SUPABASE
-- =====================================================

-- Verificar se RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'leads';

-- Verificar políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'leads';

-- =====================================================
-- SOLUÇÃO 1: DESABILITAR RLS TEMPORARIAMENTE
-- =====================================================

-- ⚠️ APENAS PARA DESENVOLVIMENTO/TESTE
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- SOLUÇÃO 2: CORRIGIR POLÍTICAS DE RLS
-- =====================================================

-- Remover políticas existentes que podem estar causando conflito
DROP POLICY IF EXISTS "Permitir inserção de leads" ON leads;
DROP POLICY IF EXISTS "Permitir visualização de leads" ON leads;
DROP POLICY IF EXISTS "Permitir atualização de leads" ON leads;

-- Criar política mais permissiva para inserção
CREATE POLICY "Permitir inserção pública de leads" ON leads
    FOR INSERT 
    WITH CHECK (true);

-- Criar política para visualização (apenas usuários autenticados)
CREATE POLICY "Permitir visualização de leads" ON leads
    FOR SELECT 
    USING (auth.role() = 'authenticated');

-- Criar política para atualização (apenas usuários autenticados)
CREATE POLICY "Permitir atualização de leads" ON leads
    FOR UPDATE 
    USING (auth.role() = 'authenticated');

-- =====================================================
-- SOLUÇÃO 3: POLÍTICA ALTERNATIVA (MAIS RESTRITIVA)
-- =====================================================

-- Se quiser uma política mais restritiva, use esta:
/*
CREATE POLICY "Permitir inserção de leads com validação" ON leads
    FOR INSERT 
    WITH CHECK (
        -- Permitir inserção apenas se os campos obrigatórios estiverem preenchidos
        nome IS NOT NULL AND 
        telefone IS NOT NULL AND 
        email IS NOT NULL AND
        is_contador IS NOT NULL AND
        is_franqueado IS NOT NULL
    );
*/

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar se as políticas foram criadas corretamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'leads';

-- Testar inserção
SELECT inserir_lead(
    'Teste RLS',
    '(11) 99999-9999',
    'teste-rls@exemplo.com',
    true,
    false,
    NULL,
    'teste-rls-fix'
);

-- Verificar se foi inserido
SELECT * FROM leads WHERE email = 'teste-rls@exemplo.com';

-- =====================================================
-- INSTRUÇÕES
-- =====================================================

/*
1. Execute este script no SQL Editor do Supabase
2. Escolha uma das soluções:
   - Solução 1: Desabilita RLS completamente (mais simples)
   - Solução 2: Corrige as políticas (recomendado)
   - Solução 3: Política mais restritiva (opcional)

3. Após executar, teste o formulário novamente

4. Se ainda houver problemas, verifique os logs no console
*/
