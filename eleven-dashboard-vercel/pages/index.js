import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, FileText, DollarSign, Wrench, TrendingUp, Clock, CheckCircle, AlertTriangle, RefreshCw, Users, Activity, LogOut, Lock, Eye, EyeOff, User, Shield, UserCheck, Zap } from 'lucide-react';

// ==========================================
// CONFIGURAÇÃO - API DO N8N
// ==========================================
const API_URL = 'https://n8n.srv1199443.hstgr.cloud/webhook/eleven-dashboard';

// ==========================================
// CONFIGURAÇÃO DE USUÁRIOS
// ==========================================
const USUARIOS = [
  { email: 'leonardo@elevenfragrances.com', senha: 'admin123', nome: 'Leonardo', nivel: 'admin' },
  { email: 'marcelo@casamenta.com.br', senha: 'admin123', nome: 'Marcelo', nivel: 'admin' },
  { email: 'ericavidal@elevenfragrances.com', senha: 'gerente123', nome: 'Erica', nivel: 'gerente' },
  { email: 'mateuslopes@elevenfragrances.com', senha: 'vendedor123', nome: 'Mateus', nivel: 'vendedor', vendedorId: 'EF-V-01' },
];

const PERMISSOES = {
  admin: { verReceitaTotal: true, verComissoes: true, verTodasComissoes: true, verFunilCompleto: true, verTodosClientes: true, verAlertas: true },
  gerente: { verReceitaTotal: false, verComissoes: true, verTodasComissoes: true, verFunilCompleto: true, verTodosClientes: true, verAlertas: true },
  vendedor: { verReceitaTotal: false, verComissoes: true, verTodasComissoes: false, verFunilCompleto: false, verTodosClientes: false, verAlertas: true }
};

// ==========================================
// CORES DOS EQUIPAMENTOS
// ==========================================
const CORES_EQUIPAMENTOS = [
  { name: 'Pirad', key: 'pirad', color: '#3B82F6' },
  { name: 'Square', key: 'square', color: '#10B981' },
  { name: 'Design', key: 'design', color: '#F59E0B' },
  { name: 'Tower', key: 'tower', color: '#8B5CF6' },
  { name: 'Pro 2', key: 'pro2', color: '#EF4444' },
];

// ==========================================
// COMPONENTE DE LOGIN
// ==========================================
const LoginScreen = ({ onLogin, error }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin(email, senha);
      setLoading(false);
    }, 500);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#1e293b', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Zap size={32} color="white" />
          </div>
          <h1 style={{ color: 'white', fontSize: '24px', margin: '0 0 8px' }}>Eleven Fragrances</h1>
          <p style={{ color: '#94a3b8', margin: 0 }}>Dashboard de Operações</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '12px 12px 12px 40px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>
          
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type={showSenha ? 'text' : 'password'}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              style={{ width: '100%', padding: '12px 40px 12px 40px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: 'white', fontSize: '14px', boxSizing: 'border-box' }}
            />
            <button type="button" onClick={() => setShowSenha(!showSenha)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          {error && <div style={{ background: '#7f1d1d', color: '#fecaca', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
          
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', borderRadius: '8px', color: 'white', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div style={{ marginTop: '24px', textAlign: 'center', color: '#64748b', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <Lock size={14} />
          Acesso restrito a usuários autorizados
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTE KPI CARD
// ==========================================
const StatCard = ({ title, value, subtitle, icon: Icon, color, loading, hidden }) => {
  if (hidden) return null;
  return (
    <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 8px' }}>{title}</p>
          {loading ? (
            <div style={{ height: '32px', width: '80px', background: '#334155', borderRadius: '4px', animation: 'pulse 2s infinite' }}></div>
          ) : (
            <p style={{ color: 'white', fontSize: '28px', fontWeight: '700', margin: 0 }}>{value}</p>
          )}
          {subtitle && <p style={{ color: '#64748b', fontSize: '12px', margin: '4px 0 0' }}>{subtitle}</p>}
        </div>
        <div style={{ background: color, padding: '12px', borderRadius: '12px' }}>
          <Icon size={24} color="white" />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTE BADGE DE NÍVEL
// ==========================================
const NivelBadge = ({ nivel }) => {
  const config = {
    admin: { icon: Shield, label: 'Admin', color: '#ef4444' },
    gerente: { icon: UserCheck, label: 'Gerente', color: '#f59e0b' },
    vendedor: { icon: User, label: 'Vendedor', color: '#3b82f6' }
  };
  const { icon: Icon, label, color } = config[nivel] || config.vendedor;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', background: `${color}20`, color: color, border: `1px solid ${color}40` }}>
      <Icon size={14} />{label}
    </span>
  );
};

// ==========================================
// DASHBOARD PRINCIPAL
// ==========================================
export default function ElevenDashboard() {
  const [usuario, setUsuario] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Verificar sessão salva
  useEffect(() => {
    const saved = localStorage.getItem('ef_usuario');
    if (saved) {
      try { setUsuario(JSON.parse(saved)); } catch (e) { localStorage.removeItem('ef_usuario'); }
    }
  }, []);

  const handleLogin = (email, senha) => {
    const user = USUARIOS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha);
    if (user) {
      const userSession = { ...user, senha: undefined };
      setUsuario(userSession);
      localStorage.setItem('ef_usuario', JSON.stringify(userSession));
      setLoginError('');
    } else {
      setLoginError('Email ou senha incorretos');
    }
  };

  const handleLogout = () => {
    setUsuario(null);
    localStorage.removeItem('ef_usuario');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erro ao carregar dados');
      const result = await response.json();
      setData(result);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
      // Dados de fallback
      setData({
        resumo: { contratosAtivos: 0, contratosDraft: 0, equipamentosTotal: 0, receitaMensal: 0, manutencoes7dias: 0, comissoesPendentes: 0, totalComissoesPendentes: 0, cardsParados: 0 },
        equipamentos: { pirad: 0, square: 0, design: 0, tower: 0, pro2: 0, total: 0 },
        funil: {},
        cardsParados: [],
        atividadesRecentes: [],
        manutencoes: [],
        comissoes: [],
        listas: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuario) {
      fetchData();
      const interval = setInterval(fetchData, 60000);
      return () => clearInterval(interval);
    }
  }, [usuario]);

  // Se não logado
  if (!usuario) {
    return <LoginScreen onLogin={handleLogin} error={loginError} />;
  }

  const perm = PERMISSOES[usuario.nivel] || PERMISSOES.vendedor;

  // Dados do gráfico de pizza
  const pieData = data ? CORES_EQUIPAMENTOS.map(e => ({
    ...e,
    value: data.equipamentos?.[e.key] || 0
  })).filter(d => d.value > 0) : [];

  // Dados do funil
  const funnelData = data?.funil ? Object.entries(data.funil).map(([name, value]) => ({ name: name.replace(/^[\d\s\-\.]+/, '').trim(), value })).filter(d => d.value > 0) : [];

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a' }}>
      {/* Header */}
      <header style={{ background: '#1e293b', borderBottom: '1px solid #334155', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>11</span>
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '18px', margin: 0 }}>Eleven Fragrances</h1>
              <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>Operations Dashboard</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={fetchData} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px' }}>
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              Atualizar
            </button>
            {lastUpdate && <span style={{ color: '#64748b', fontSize: '12px' }}>Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}</span>}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '14px' }}>
              Olá, {usuario.nome}
              <NivelBadge nivel={usuario.nivel} />
            </div>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ef4444', border: 'none', borderRadius: '6px', padding: '8px 12px', color: 'white', cursor: 'pointer', fontSize: '14px' }}>
              <LogOut size={16} /> Sair
            </button>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div style={{ background: '#422006', borderBottom: '1px solid #713f12', padding: '8px' }}>
          <p style={{ color: '#fef3c7', textAlign: 'center', margin: 0, fontSize: '14px' }}>⚠️ Usando dados de demonstração. Erro: {error}</p>
        </div>
      )}

      {/* Main */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <StatCard title="Contratos Ativos" value={data?.resumo?.contratosAtivos || 0} subtitle={`${data?.resumo?.contratosDraft || 0} em draft`} icon={FileText} color="#3b82f6" loading={loading} />
          <StatCard title="Equipamentos" value={data?.resumo?.equipamentosTotal || 0} subtitle="Em operação" icon={Package} color="#10b981" loading={loading} />
          <StatCard title="Receita Mensal" value={`$${(data?.resumo?.receitaMensal || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`} subtitle="Recorrente" icon={DollarSign} color="#8b5cf6" loading={loading} hidden={!perm.verReceitaTotal} />
          <StatCard title="Manutenções" value={data?.resumo?.manutencoes7dias || 0} subtitle="Próximos 7 dias" icon={Wrench} color="#f59e0b" loading={loading} />
          <StatCard title="Cards Parados" value={data?.resumo?.cardsParados || 0} subtitle="Mais de 3 dias" icon={AlertTriangle} color="#ef4444" loading={loading} hidden={!perm.verFunilCompleto} />
          <StatCard title="Comissões Pendentes" value={`$${(data?.resumo?.totalComissoesPendentes || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`} subtitle={`${data?.resumo?.comissoesPendentes || 0} pendentes`} icon={Users} color="#06b6d4" loading={loading} hidden={!perm.verComissoes} />
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {/* Equipamentos por Tipo */}
          <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
            <h3 style={{ color: 'white', fontSize: '16px', margin: '0 0 16px' }}>Equipamentos por Tipo</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                  {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} unidades`, '']} contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} labelStyle={{ color: 'white' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
              {CORES_EQUIPAMENTOS.map((item) => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: item.color }} />
                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>{item.name} ({data?.equipamentos?.[item.key] || 0})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Funil Comercial (Trello) */}
          {perm.verFunilCompleto && (
            <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
              <h3 style={{ color: 'white', fontSize: '16px', margin: '0 0 16px' }}>Pipeline Comercial (Trello)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={funnelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" stroke="#64748b" />
                  <YAxis dataKey="name" type="category" width={100} stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                  <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Tables Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {/* Próximas Manutenções */}
          <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: 'white', fontSize: '16px', margin: 0 }}>Próximas Manutenções</h3>
              <span style={{ background: '#f59e0b20', color: '#f59e0b', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>{data?.resumo?.manutencoes7dias || 0} pendentes</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(data?.manutencoes || []).length > 0 ? (
                data.manutencoes.map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#0f172a', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Wrench size={20} style={{ color: '#f59e0b' }} />
                      <div>
                        <p style={{ color: 'white', margin: 0, fontSize: '14px' }}>{m.clienteId}</p>
                        <p style={{ color: '#64748b', margin: 0, fontSize: '12px' }}>{m.obs || 'Manutenção'}</p>
                      </div>
                    </div>
                    <span style={{ color: '#94a3b8', fontSize: '12px' }}>{m.dataProxima}</span>
                  </div>
                ))
              ) : (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '24px' }}>Nenhuma manutenção próxima</p>
              )}
            </div>
          </div>

          {/* Atividades Recentes (Trello) */}
          {perm.verFunilCompleto && (
            <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ color: 'white', fontSize: '16px', margin: 0 }}>Atividades Recentes (Trello)</h3>
                <span style={{ background: '#10b98120', color: '#10b981', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
                  Tempo Real
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                {(data?.atividadesRecentes || []).length > 0 ? (
                  data.atividadesRecentes.slice(0, 10).map((a, i) => (
                    <div key={i} style={{ padding: '12px', background: '#0f172a', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <p style={{ color: 'white', margin: '0 0 4px', fontSize: '14px' }}>{a.card || 'Ação no board'}</p>
                          <p style={{ color: '#64748b', margin: 0, fontSize: '12px' }}>
                            {a.tipo === 'updateCard' && a.listaDe && a.listaPara ? `${a.listaDe} → ${a.listaPara}` : a.tipo}
                          </p>
                        </div>
                        <span style={{ color: '#64748b', fontSize: '11px' }}>{new Date(a.data).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#64748b', textAlign: 'center', padding: '24px' }}>Nenhuma atividade recente</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Cards Parados */}
        {perm.verFunilCompleto && (data?.cardsParados?.length > 0) && (
          <div style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: 'white', fontSize: '16px', margin: 0 }}>⚠️ Cards Parados (+3 dias)</h3>
              <span style={{ background: '#ef444420', color: '#ef4444', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}>{data.cardsParados.length} cards</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {data.cardsParados.map((card, i) => (
                <div key={i} style={{ padding: '12px', background: '#0f172a', borderRadius: '8px', borderLeft: '3px solid #ef4444' }}>
                  <p style={{ color: 'white', margin: '0 0 4px', fontSize: '14px' }}>{card.nome}</p>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '12px' }}>Lista: {card.lista}</p>
                  <p style={{ color: '#ef4444', margin: '4px 0 0', fontSize: '12px' }}>Parado há {card.diasParado} dias</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alertas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ background: data?.resumo?.manutencoes7dias > 0 ? '#7f1d1d20' : '#1e293b', borderRadius: '12px', padding: '16px', border: `1px solid ${data?.resumo?.manutencoes7dias > 0 ? '#7f1d1d' : '#334155'}`, display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <AlertTriangle size={20} style={{ color: data?.resumo?.manutencoes7dias > 0 ? '#ef4444' : '#64748b', marginTop: '2px' }} />
            <div>
              <p style={{ color: data?.resumo?.manutencoes7dias > 0 ? '#fca5a5' : '#94a3b8', margin: '0 0 4px', fontWeight: '500' }}>{data?.resumo?.manutencoes7dias || 0} Manutenção(ões) Próxima(s)</p>
              <p style={{ color: data?.resumo?.manutencoes7dias > 0 ? '#ef4444' : '#64748b', margin: 0, fontSize: '12px' }}>{data?.resumo?.manutencoes7dias > 0 ? 'Requer atenção' : 'Tudo em dia!'}</p>
            </div>
          </div>
          
          <div style={{ background: '#713f1220', borderRadius: '12px', padding: '16px', border: '1px solid #713f12', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <Clock size={20} style={{ color: '#f59e0b', marginTop: '2px' }} />
            <div>
              <p style={{ color: '#fef3c7', margin: '0 0 4px', fontWeight: '500' }}>{data?.resumo?.cardsParados || 0} Cards Parados</p>
              <p style={{ color: '#f59e0b', margin: 0, fontSize: '12px' }}>Sem movimento há +3 dias</p>
            </div>
          </div>
          
          <div style={{ background: '#064e3b20', borderRadius: '12px', padding: '16px', border: '1px solid #064e3b', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <CheckCircle size={20} style={{ color: '#10b981', marginTop: '2px' }} />
            <div>
              <p style={{ color: '#6ee7b7', margin: '0 0 4px', fontWeight: '500' }}>{data?.resumo?.contratosAtivos || 0} Contratos Ativos</p>
              <p style={{ color: '#10b981', margin: 0, fontSize: '12px' }}>Sistema funcionando</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: '#1e293b', borderTop: '1px solid #334155', marginTop: '24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: '#64748b', margin: 0, fontSize: '12px' }}>© 2025 Eleven Fragrances LLC. Todos os direitos reservados.</p>
          <p style={{ color: '#64748b', margin: 0, fontSize: '12px' }}>Dashboard v3.0 • Dados via n8n (Planilha + Trello)</p>
        </div>
      </footer>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        * { box-sizing: border-box; }
        input:focus { outline: none; border-color: #10b981 !important; }
        button:disabled { opacity: 0.6; cursor: not-allowed; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
      `}</style>
    </div>
  );
}
