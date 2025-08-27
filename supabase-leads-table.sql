-- =====================================================
-- ESTRUTURA SQL PARA TABELA DE LEADS - SUPABASE
-- Projeto: Reforma Tributária - Contabhub
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA PRINCIPAL DE LEADS
-- =====================================================

CREATE TABLE IF NOT EXISTS leads (
    -- Identificação única
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Informações pessoais (obrigatórias)
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    
    -- Informações profissionais
    is_contador BOOLEAN NOT NULL, -- true = sim, false = não
    is_franqueado BOOLEAN NOT NULL, -- true = sim, false = não
    nome_unidade VARCHAR(255), -- opcional, apenas se is_franqueado = true
    
    -- Metadados do lead
    fonte_lead VARCHAR(100) DEFAULT 'ebook-reforma-tributaria',
    status_lead VARCHAR(50) DEFAULT 'novo',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Validações
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_telefone CHECK (telefone ~* '^\([0-9]{2}\)\s[0-9]{4,5}-[0-9]{4}$'),
    CONSTRAINT valid_nome_unidade CHECK (
        (is_franqueado = true AND nome_unidade IS NOT NULL AND nome_unidade != '') OR
        (is_franqueado = false AND nome_unidade IS NULL)
    )
);

-- =====================================================
-- ÍNDICES PARA OTIMIZAÇÃO
-- =====================================================

-- Índice para busca por email (único)
CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- Índice para busca por telefone
CREATE INDEX IF NOT EXISTS idx_leads_telefone ON leads(telefone);

-- Índice para busca por status
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status_lead);

-- Índice para busca por data de criação
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

-- Índice para busca por contadores
CREATE INDEX IF NOT EXISTS idx_leads_contadores ON leads(is_contador) WHERE is_contador = true;

-- Índice para busca por franqueados
CREATE INDEX IF NOT EXISTS idx_leads_franqueados ON leads(is_franqueado) WHERE is_franqueado = true;

-- =====================================================
-- FUNÇÃO PARA ATUALIZAR TIMESTAMP
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_leads_updated_at 
    BEFORE UPDATE ON leads 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNÇÃO PARA VALIDAR E INSERIR LEAD
-- =====================================================

CREATE OR REPLACE FUNCTION inserir_lead(
    p_nome VARCHAR(255),
    p_telefone VARCHAR(20),
    p_email VARCHAR(255),
    p_is_contador BOOLEAN,
    p_is_franqueado BOOLEAN,
    p_nome_unidade VARCHAR(255) DEFAULT NULL,
    p_fonte_lead VARCHAR(100) DEFAULT 'ebook-reforma-tributaria'
)
RETURNS JSON AS $$
DECLARE
    v_lead_id UUID;
    v_result JSON;
BEGIN
    -- Validar se o email já existe
    IF EXISTS (SELECT 1 FROM leads WHERE email = p_email) THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Email já cadastrado',
            'lead_id', NULL
        );
    END IF;
    
    -- Inserir o lead
    INSERT INTO leads (
        nome, 
        telefone, 
        email, 
        is_contador, 
        is_franqueado, 
        nome_unidade, 
        fonte_lead
    ) VALUES (
        p_nome, 
        p_telefone, 
        p_email, 
        p_is_contador, 
        p_is_franqueado, 
        p_nome_unidade, 
        p_fonte_lead
    ) RETURNING id INTO v_lead_id;
    
    -- Retornar sucesso
    RETURN json_build_object(
        'success', true,
        'error', NULL,
        'lead_id', v_lead_id
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', SQLERRM,
            'lead_id', NULL
        );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNÇÕES DE CONSULTA ÚTEIS
-- =====================================================

-- Função para buscar leads por período
CREATE OR REPLACE FUNCTION buscar_leads_por_periodo(
    p_data_inicio DATE,
    p_data_fim DATE
)
RETURNS TABLE (
    id UUID,
    nome VARCHAR(255),
    email VARCHAR(255),
    telefone VARCHAR(20),
    is_contador BOOLEAN,
    is_franqueado BOOLEAN,
    nome_unidade VARCHAR(255),
    status_lead VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id,
        l.nome,
        l.email,
        l.telefone,
        l.is_contador,
        l.is_franqueado,
        l.nome_unidade,
        l.status_lead,
        l.created_at
    FROM leads l
    WHERE DATE(l.created_at) BETWEEN p_data_inicio AND p_data_fim
    ORDER BY l.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Função para estatísticas de leads
CREATE OR REPLACE FUNCTION estatisticas_leads()
RETURNS JSON AS $$
DECLARE
    v_total_leads INTEGER;
    v_contadores INTEGER;
    v_franqueados INTEGER;
    v_hoje INTEGER;
    v_semana INTEGER;
    v_mes INTEGER;
BEGIN
    -- Contar total de leads
    SELECT COUNT(*) INTO v_total_leads FROM leads;
    
    -- Contar contadores
    SELECT COUNT(*) INTO v_contadores FROM leads WHERE is_contador = true;
    
    -- Contar franqueados
    SELECT COUNT(*) INTO v_franqueados FROM leads WHERE is_franqueado = true;
    
    -- Contar leads de hoje
    SELECT COUNT(*) INTO v_hoje FROM leads WHERE DATE(created_at) = CURRENT_DATE;
    
    -- Contar leads da semana
    SELECT COUNT(*) INTO v_semana FROM leads WHERE created_at >= CURRENT_DATE - INTERVAL '7 days';
    
    -- Contar leads do mês
    SELECT COUNT(*) INTO v_mes FROM leads WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';
    
    RETURN json_build_object(
        'total_leads', v_total_leads,
        'contadores', v_contadores,
        'franqueados', v_franqueados,
        'leads_hoje', v_hoje,
        'leads_semana', v_semana,
        'leads_mes', v_mes
    );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS na tabela
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de leads (público)
CREATE POLICY "Permitir inserção de leads" ON leads
    FOR INSERT WITH CHECK (true);

-- Política para visualização (apenas usuários autenticados)
CREATE POLICY "Permitir visualização de leads" ON leads
    FOR SELECT USING (auth.role() = 'authenticated');

-- Política para atualização (apenas usuários autenticados)
CREATE POLICY "Permitir atualização de leads" ON leads
    FOR UPDATE USING (auth.role() = 'authenticated');

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View para leads de contadores
CREATE OR REPLACE VIEW leads_contadores AS
SELECT 
    id,
    nome,
    email,
    telefone,
    nome_unidade,
    created_at
FROM leads 
WHERE is_contador = true
ORDER BY created_at DESC;

-- View para leads de franqueados
CREATE OR REPLACE VIEW leads_franqueados AS
SELECT 
    id,
    nome,
    email,
    telefone,
    nome_unidade,
    created_at
FROM leads 
WHERE is_franqueado = true
ORDER BY created_at DESC;

-- View para leads recentes (últimos 30 dias)
CREATE OR REPLACE VIEW leads_recentes AS
SELECT 
    id,
    nome,
    email,
    telefone,
    is_contador,
    is_franqueado,
    nome_unidade,
    status_lead,
    created_at
FROM leads 
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY created_at DESC;

-- =====================================================
-- COMENTÁRIOS DA TABELA
-- =====================================================

COMMENT ON TABLE leads IS 'Tabela para armazenar leads do formulário de ebook sobre reforma tributária';
COMMENT ON COLUMN leads.id IS 'Identificador único do lead';
COMMENT ON COLUMN leads.nome IS 'Nome completo do lead';
COMMENT ON COLUMN leads.telefone IS 'Telefone com DDD no formato (11) 99999-9999';
COMMENT ON COLUMN leads.email IS 'Email do lead (único)';
COMMENT ON COLUMN leads.is_contador IS 'Indica se o lead é contador (true) ou não (false)';
COMMENT ON COLUMN leads.is_franqueado IS 'Indica se o lead é franqueado da CF Contabilidade';
COMMENT ON COLUMN leads.nome_unidade IS 'Nome da unidade CF Contabilidade (apenas se franqueado)';
COMMENT ON COLUMN leads.fonte_lead IS 'Origem do lead (padrão: ebook-reforma-tributaria)';
COMMENT ON COLUMN leads.status_lead IS 'Status atual do lead (novo, contatado, convertido, etc.)';
COMMENT ON COLUMN leads.created_at IS 'Data e hora de criação do registro';
COMMENT ON COLUMN leads.updated_at IS 'Data e hora da última atualização';

-- =====================================================
-- EXEMPLOS DE USO
-- =====================================================

/*
-- Exemplo de inserção de lead
SELECT inserir_lead(
    'João Silva',
    '(11) 99999-9999',
    'joao@email.com',
    true,
    false,
    NULL,
    'ebook-reforma-tributaria'
);

-- Exemplo de busca por período
SELECT * FROM buscar_leads_por_periodo('2024-01-01', '2024-12-31');

-- Exemplo de estatísticas
SELECT estatisticas_leads();

-- Exemplo de consulta de contadores
SELECT * FROM leads_contadores;

-- Exemplo de consulta de franqueados
SELECT * FROM leads_franqueados;

-- Exemplo de leads recentes
SELECT * FROM leads_recentes;
*/
