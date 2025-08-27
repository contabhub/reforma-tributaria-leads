import React, { useState, useEffect } from 'react';
import { Download, BookOpen, Users, CheckCircle, Phone, Mail, User } from 'lucide-react';
import contabhubLogo from './assets/Contabhub logo.png';
import { inserirLead, formatarDadosFormulario } from './lib/supabase';
// Removendo a execução automática dos testes - mantendo apenas as importações para uso manual
// import { testarConexaoSupabase, verificarFuncoesSQL, verificarTabelaLeads } from './utils/testSupabase';

interface FormData {
  nome: string;
  telefone: string;
  email: string;
  isContador: string;
  isFranqueado: string;
  nomeUnidade: string;
}

interface FormErrors {
  nome?: string;
  telefone?: string;
  email?: string;
  isContador?: string;
  isFranqueado?: string;
  nomeUnidade?: string;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    telefone: '',
    email: '',
    isContador: '',
    isFranqueado: '',
    nomeUnidade: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Removendo a execução automática dos testes do Supabase
  // useEffect(() => {
  //   console.log('🚀 [APP] Componente carregado, executando testes do Supabase...')
  //   
  //   const executarTestes = async () => {
  //     try {
  //       await testarConexaoSupabase()
  //       await verificarFuncoesSQL()
  //       await verificarTabelaLeads()
  //     } catch (error) {
  //       console.error('💥 [APP] Erro ao executar testes:', error)
  //     }
  //   }
  //   
  //   // Aguardar um pouco para garantir que tudo carregou
  //   setTimeout(executarTestes, 1000)
  // }, []);

  const downloadUrl = "https://drive.google.com/uc?export=download&id=1VC_KiZ7DUq02oPbvnPAZx05jciPObkdm";

  const validateForm = (): boolean => {
    console.log('🔍 [VALIDAÇÃO] Iniciando validação do formulário...')
    const newErrors: FormErrors = {};

    // Validar nome
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
      console.log('❌ [VALIDAÇÃO] Nome inválido')
    } else {
      console.log('✅ [VALIDAÇÃO] Nome válido:', formData.nome)
    }

    // Validar telefone
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
      console.log('❌ [VALIDAÇÃO] Telefone vazio')
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.telefone)) {
      newErrors.telefone = 'Formato inválido. Use: (11) 99999-9999';
      console.log('❌ [VALIDAÇÃO] Formato de telefone inválido:', formData.telefone)
    } else {
      console.log('✅ [VALIDAÇÃO] Telefone válido:', formData.telefone)
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
      console.log('❌ [VALIDAÇÃO] Email vazio')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
      console.log('❌ [VALIDAÇÃO] Formato de email inválido:', formData.email)
    } else {
      console.log('✅ [VALIDAÇÃO] Email válido:', formData.email)
    }

    // Validar contador
    if (!formData.isContador) {
      newErrors.isContador = 'Selecione uma opção';
      console.log('❌ [VALIDAÇÃO] Contador não selecionado')
    } else {
      console.log('✅ [VALIDAÇÃO] Contador selecionado:', formData.isContador)
    }

    // Validar franqueado
    if (!formData.isFranqueado) {
      newErrors.isFranqueado = 'Selecione uma opção';
      console.log('❌ [VALIDAÇÃO] Franqueado não selecionado')
    } else {
      console.log('✅ [VALIDAÇÃO] Franqueado selecionado:', formData.isFranqueado)
    }

    // Validar nome da unidade (se franqueado)
    if (formData.isFranqueado === 'sim' && !formData.nomeUnidade.trim()) {
      newErrors.nomeUnidade = 'Nome da unidade é obrigatório';
      console.log('❌ [VALIDAÇÃO] Nome da unidade obrigatório para franqueados')
    } else if (formData.isFranqueado === 'sim') {
      console.log('✅ [VALIDAÇÃO] Nome da unidade válido:', formData.nomeUnidade)
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    
    console.log('📋 [VALIDAÇÃO] Resumo dos erros:', newErrors)
    console.log('🎯 [VALIDAÇÃO] Formulário válido:', isValid)
    
    return isValid;
  };

  const formatTelefone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === 'telefone') {
      value = formatTelefone(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'isFranqueado' && value === 'nao' ? { nomeUnidade: '' } : {})
    }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 [FORMULÁRIO] Iniciando submissão do formulário...')
    console.log('📊 [FORMULÁRIO] Dados do formulário:', formData)
    
    if (!validateForm()) {
      console.log('❌ [FORMULÁRIO] Validação falhou, abortando...')
      return;
    }

    console.log('✅ [FORMULÁRIO] Validação passou, processando...')
    setIsSubmitting(true);

    try {
      console.log('🔄 [FORMULÁRIO] Formatando dados para o Supabase...')
      const dadosFormatados = formatarDadosFormulario(formData);
      
      console.log('📤 [FORMULÁRIO] Enviando dados para o Supabase...')
      const resultado = await inserirLead(dadosFormatados);
      
      console.log('📥 [FORMULÁRIO] Resposta do Supabase:', resultado)
      
      if (resultado.success) {
        console.log('✅ [FORMULÁRIO] Lead salvo com sucesso! ID:', resultado.lead_id)
        
        // Iniciar download
        console.log('📥 [FORMULÁRIO] Iniciando download do ebook...')
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'ebook-cf-contabilidade.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Reset form após sucesso
        console.log('🔄 [FORMULÁRIO] Resetando formulário...')
        setFormData({
          nome: '',
          telefone: '',
          email: '',
          isContador: '',
          isFranqueado: '',
          nomeUnidade: ''
        });
        
        console.log('🎉 [FORMULÁRIO] Processo concluído com sucesso!')
      } else {
        console.error('❌ [FORMULÁRIO] Erro ao salvar lead:', resultado.error)
        alert(`Erro ao processar dados: ${resultado.error}`)
      }

    } catch (error) {
      console.error('💥 [FORMULÁRIO] Erro inesperado:', error)
      alert('Erro inesperado ao processar formulário')
    } finally {
      setIsSubmitting(false);
      console.log('🏁 [FORMULÁRIO] Processo finalizado')
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-gray-900 shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <img src={contabhubLogo} alt="Contabhub Tecnologia" className="h-8 w-auto" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16 pb-40">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center text-blue-600 font-semibold">
                <Download className="h-5 w-5 mr-2" />
                MATERIAL GRATUITO
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Baixe nosso
                <span className="text-blue-600"> ebook exclusivo</span>
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Material completo e atualizado para profissionais da contabilidade que desejam se manter sempre à frente no mercado.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Conteúdo Especializado</h3>
                  <p className="text-gray-600">Informações atualizadas e relevantes para sua área de atuação</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-green-500 mt-1" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Linguagem acessível</h3>
                  <p className="text-gray-600">Desenvolvido especialmente para facilitar sua jornada</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Download className="h-6 w-6 text-green-500 mt-1" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Download Imediato</h3>
                  <p className="text-gray-600">Acesso instantâneo após o preenchimento dos dados</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Preencha seus dados
              </h3>
              <p className="text-gray-600">
                Todas as informações são confidenciais e seguras
              </p>
            </div>

            <form onSubmit={handleDownload} className="space-y-6">
              {/* Nome */}
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.nome ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Digite seu nome completo"
                />
                {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
              </div>

              {/* Telefone */}
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Telefone com DDD *
                </label>
                <input
                  type="text"
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.telefone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                />
                {errors.telefone && <p className="mt-1 text-sm text-red-600">{errors.telefone}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="seu@email.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* É contador */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Você é contador? *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isContador"
                      value="sim"
                      checked={formData.isContador === 'sim'}
                      onChange={(e) => handleInputChange('isContador', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Sim</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isContador"
                      value="nao"
                      checked={formData.isContador === 'nao'}
                      onChange={(e) => handleInputChange('isContador', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Não</span>
                  </label>
                </div>
                {errors.isContador && <p className="mt-1 text-sm text-red-600">{errors.isContador}</p>}
              </div>

              {/* É franqueado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  É franqueado da CF Contabilidade? *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isFranqueado"
                      value="sim"
                      checked={formData.isFranqueado === 'sim'}
                      onChange={(e) => handleInputChange('isFranqueado', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Sim</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isFranqueado"
                      value="nao"
                      checked={formData.isFranqueado === 'nao'}
                      onChange={(e) => handleInputChange('isFranqueado', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Não</span>
                  </label>
                </div>
                {errors.isFranqueado && <p className="mt-1 text-sm text-red-600">{errors.isFranqueado}</p>}
              </div>

              {/* Nome da unidade - condicional */}
              {formData.isFranqueado === 'sim' && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <label htmlFor="nomeUnidade" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Unidade *
                  </label>
                  <input
                    type="text"
                    id="nomeUnidade"
                    value={formData.nomeUnidade}
                    onChange={(e) => handleInputChange('nomeUnidade', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.nomeUnidade ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nome da sua unidade CF Contabilidade"
                  />
                  {errors.nomeUnidade && <p className="mt-1 text-sm text-red-600">{errors.nomeUnidade}</p>}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processando...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Download className="h-5 w-5 mr-2" />
                    Quero receber o ebook agora!
                  </div>
                )}
              </button>
            </form>

            <p className="mt-4 text-xs text-gray-500 text-center">
              Seus dados estão protegidos e não serão compartilhados com terceiros.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img src={contabhubLogo} alt="Contabhub Tecnologia" className="h-6 w-auto" />
            </div>
            <p className="text-gray-400">
              © {new Date().getFullYear()} Contabhub Tecnologia. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;