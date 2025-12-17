import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, FileText, AlertTriangle, CheckCircle, Clock, Activity, Target, Zap, Award, LogOut, Lock, Eye, EyeOff, User, Shield, UserCheck } from 'lucide-react';

// ==========================================
// CONFIGURAÇÃO DE USUÁRIOS - EDITE AQUI!
// ==========================================
const USUARIOS = [
  { email: 'leonardo@elevenfragrances.com', senha: 'admin123', nome: 'Leonardo', nivel: 'admin' },
  { email: 'marcelo@casamenta.com.br', senha: 'admin123', nome: 'Marcelo', nivel: 'admin' },
  { email: 'ericavidal@elevenfragrances.com', senha: 'gerente123', nome: 'Erica', nivel: 'gerente' },
  { email: 'mateuslopes@elevenfragrances.com', senha: 'vendedor123', nome: 'Mateus', nivel: 'vendedor', vendedorId: 'EF-V-01' },
];

// Permissões por nível
const PERMISSOES = {
  admin: {
    verReceitaTotal: true,
    verComissoes: true,
    verTodasComissoes: true,
    verFunilCompleto: true,
    verTodosClientes: true,
    verAlertas: true,
    verConfiguracoes: true,
    verCustos: true,
  },
  gerente: {
    verReceitaTotal: false,
    verComissoes: true,
    verTodasComissoes: true,
    verFunilCompleto: true,
    verTodosClientes: true,
    verAlertas: true,
    verConfiguracoes: false,
    verCustos: false,
  },
  vendedor: {
    verReceitaTotal: false,
    verComissoes: true,
    verTodasComissoes: false,
    verFunilCompleto: false,
    verTodosClientes: false,
    verAlertas: true,
    verConfiguracoes: false,
    verCustos: false,
  }
};

// ==========================================
// CONFIGURAÇÃO DA API
// ==========================================
const SHEET_ID = '1I1uwAtAjLt-XIfpMkO8NIAeK90q5nqyQBRBNgzF6fPQ';
const API_KEY = 'AIzaSyBFiuaA66x0lLJhSBqdmMqHPzjjHwknLQU';
const TRELLO_KEY = 'ba3a433134206a42ece53e5e2a48d6e7';
const TRELLO_TOKEN = 'ATTA4ff423a0c32705ce93f3b9ff1d6b1d41296bca768d65fd56c6df8251e1ec912b10E91694';
const BOARD_ID = '6928b5f6f7d9d888cd03244e';

const fetchSheet = async (range) => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.values || data.values.length < 2) return [];
  const [headers, ...rows] = data.values;
  return rows.map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i] || '');
    return obj;
  });
};

const fetchTrello = async (endpoint) => {
  const url = `https://api.trello.com/1/${endpoint}?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`;
  const res = await fetch(url);
  return res.json();
};

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
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <Zap size={40} />
          </div>
          <h1>Eleven Fragrances</h1>
          <p>Dashboard de Operações</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <User size={18} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="input-group">
            <Lock size={18} />
            <input
              type={showSenha ? 'text' : 'password'}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <button type="button" className="toggle-senha" onClick={() => setShowSenha(!showSenha)}>
              {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          {error && <div className="login-error">{error}</div>}
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div className="login-footer">
          <Lock size={14} />
          <span>Acesso restrito a usuários autorizados</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTES DO DASHBOARD
// ==========================================
const KPICard = ({ title, value, change, changeType, icon: Icon, color, subtitle, hidden }) => {
  if (hidden) {
    return (
      <div className="kpi-card kpi-hidden" style={{ '--accent': '#666' }}>
        <div className="kpi-icon"><Lock size={24} /></div>
        <div className="kpi-content">
          <span className="kpi-title">{title}</span>
          <span className="kpi-value">•••••</span>
          <span className="kpi-subtitle">Sem permissão</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="kpi-card" style={{ '--accent': color }}>
      <div className="kpi-icon"><Icon size={24} /></div>
      <div className="kpi-content">
        <span className="kpi-title">{title}</span>
        <span className="kpi-value">{value}</span>
        {change && (
          <span className={`kpi-change ${changeType}`}>
            {changeType === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {change}
          </span>
        )}
        {subtitle && <span className="kpi-subtitle">{subtitle}</span>}
      </div>
    </div>
  );
};

const AlertCard = ({ type, title, message, count }) => (
  <div className={`alert-card ${type}`}>
    <AlertTriangle size={20} />
    <div>
      <strong>{title}</strong>
      <span>{message}</span>
    </div>
    {count && <span className="alert-count">{count}</span>}
  </div>
);

const NivelBadge = ({ nivel }) => {
  const config = {
    admin: { icon: Shield, label: 'Administrador', color: '#E74C3C' },
    gerente: { icon: UserCheck, label: 'Gerente', color: '#9B59B6' },
    vendedor: { icon: User, label: 'Vendedor', color: '#3498DB' }
  };
  const { icon: Icon, label, color } = config[nivel] || config.vendedor;
  
  return (
    <div className="nivel-badge" style={{ background: `${color}20`, borderColor: color, color }}>
      <Icon size={14} />
      {label}
    </div>
  );
};

// ==========================================
// DASHBOARD PRINCIPAL
// ==========================================
export default function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    contratos: [],
    clientes: [],
    pagamentos: [],
    manutencoes: [],
    comissoes: [],
    trelloCards: [],
    trelloLists: [],
    trelloActions: []
  });

  // Verificar sessão salva
  useEffect(() => {
    const saved = localStorage.getItem('ef_usuario');
    if (saved) {
      try {
        setUsuario(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('ef_usuario');
      }
    }
  }, []);

  // Carregar dados quando logado
  useEffect(() => {
    if (usuario) {
      loadAllData();
      const interval = setInterval(loadAllData, 60000);
      return () => clearInterval(interval);
    }
  }, [usuario]);

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

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [contratos, clientes, pagamentos, manutencoes, comissoes, trelloCards, trelloLists, trelloActions] = await Promise.all([
        fetchSheet('01_CONTRATOS!A:Z'),
        fetchSheet('02_CLIENTES!A:L'),
        fetchSheet('08_PAGAMENTOS!A:H'),
        fetchSheet('05_MANUTENCOES!A:J'),
        fetchSheet('07_COMISSOES!A:J'),
        fetchTrello(`boards/${BOARD_ID}/cards`),
        fetchTrello(`boards/${BOARD_ID}/lists`),
        fetchTrello(`boards/${BOARD_ID}/actions?limit=100`)
      ]);
      setData({ contratos, clientes, pagamentos, manutencoes, comissoes, trelloCards, trelloLists, trelloActions });
    } catch (e) {
      console.error('Erro:', e);
    }
    setLoading(false);
  };

  // Se não logado, mostrar tela de login
  if (!usuario) {
    return (
      <>
        <style>{getStyles()}</style>
        <LoginScreen onLogin={handleLogin} error={loginError} />
      </>
    );
  }

  const perm = PERMISSOES[usuario.nivel] || PERMISSOES.vendedor;

  // Cálculos
  const contratosAtivos = data.contratos.filter(c => c.STATUS === 'active');
  const clientesAtivos = data.clientes.filter(c => c.STATUS === 'active');
  const receitaMensal = contratosAtivos.reduce((sum, c) => sum + (parseFloat(c.VALOR_MENSAL) || 0), 0);
  
  // Filtrar por vendedor se for vendedor
  const meusContratos = usuario.nivel === 'vendedor' 
    ? contratosAtivos.filter(c => c.VENDEDOR_ID === usuario.vendedorId)
    : contratosAtivos;
  
  const minhasComissoes = usuario.nivel === 'vendedor'
    ? data.comissoes.filter(c => c.VENDEDOR_ID === usuario.vendedorId)
    : data.comissoes;

  const comissoesPendentes = minhasComissoes.filter(c => c.STATUS === 'pending');
  const totalComissoesPendentes = comissoesPendentes.reduce((sum, c) => sum + (parseFloat(c.VALOR_COMISSAO) || 0), 0);

  // Atividades de hoje
  const atividadesHoje = data.trelloActions.filter(a => {
    const dataAcao = new Date(a.date);
    const hoje = new Date();
    return dataAcao.toDateString() === hoje.toDateString();
  });

  // Cards parados
  const cardsParados = data.trelloCards.filter(c => {
    const ultima = new Date(c.dateLastActivity);
    const dias = (new Date() - ultima) / (1000 * 60 * 60 * 24);
    return dias >= 3;
  });

  // Manutenções pendentes
  const manutPendentes = data.manutencoes.filter(m => {
    if (!m.DATA_PROXIMA) return false;
    return new Date(m.DATA_PROXIMA) <= new Date();
  });

  // Dados do funil
  const funnelData = data.trelloLists.map(list => {
    const count = data.trelloCards.filter(c => c.idList === list.id).length;
    return { name: list.name.replace(/^[\d\s\-\.]+/, '').trim(), value: count };
  }).filter(d => d.value > 0);

  // Dados de receita
  const getReceitaMensal = () => {
    const meses = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mes = d.toLocaleDateString('pt-BR', { month: 'short' });
      const mesNum = d.getMonth();
      const ano = d.getFullYear();
      
      const pagsMes = data.pagamentos.filter(p => {
        if (!p.DATA) return false;
        const dp = new Date(p.DATA);
        return dp.getMonth() === mesNum && dp.getFullYear() === ano;
      });
      const total = pagsMes.reduce((sum, p) => sum + (parseFloat(p.VALOR) || 0), 0);
      meses.push({ mes: mes.charAt(0).toUpperCase() + mes.slice(1), valor: total });
    }
    return meses;
  };

  return (
    <>
      <style>{getStyles()}</style>
      <div className="dashboard">
        {/* Header */}
        <header className="header">
          <h1><Zap size={28} /> Eleven Fragrances</h1>
          <div className="header-right">
            <div className="live-badge">
              <span className="live-dot"></span>
              Tempo Real
            </div>
            <div className="user-info">
              <span>Olá, {usuario.nome}</span>
              <NivelBadge nivel={usuario.nivel} />
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
              Sair
            </button>
          </div>
        </header>

        {/* Loading overlay */}
        {loading && (
          <div className="loading-overlay">
            <div className="loader"></div>
          </div>
        )}

        {/* KPIs */}
        <div className="kpi-grid">
          <KPICard
            title="Receita Mensal"
            value={`$${receitaMensal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            icon={DollarSign}
            color="#27AE60"
            subtitle={`${contratosAtivos.length} contratos ativos`}
            hidden={!perm.verReceitaTotal}
          />
          <KPICard
            title={usuario.nivel === 'vendedor' ? 'Meus Clientes' : 'Clientes Ativos'}
            value={usuario.nivel === 'vendedor' ? meusContratos.length : clientesAtivos.length}
            icon={Users}
            color="#00D9FF"
          />
          <KPICard
            title="Atividades Hoje"
            value={atividadesHoje.length}
            icon={Activity}
            color={atividadesHoje.length > 0 ? '#27AE60' : '#E74C3C'}
            subtitle={atividadesHoje.length > 0 ? 'Vendedor ativo' : 'Sem atividade!'}
          />
          <KPICard
            title={usuario.nivel === 'vendedor' ? 'Minhas Comissões' : 'Comissões Pendentes'}
            value={`$${totalComissoesPendentes.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            icon={Award}
            color="#F39C12"
            subtitle={`${comissoesPendentes.length} pendentes`}
            hidden={!perm.verComissoes}
          />
        </div>

        {/* Grid principal */}
        <div className="main-grid">
          {/* Gráfico de Receita - só admin */}
          {perm.verReceitaTotal && (
            <div className="chart-card">
              <div className="chart-header">
                <span className="chart-title"><TrendingUp size={20} /> Receita Mensal</span>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={getReceitaMensal()}>
                  <defs>
                    <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00D9FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="mes" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                  <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)' }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Receita']}
                  />
                  <Area type="monotone" dataKey="valor" stroke="#00D9FF" strokeWidth={3} fill="url(#colorReceita)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Alertas */}
          <div className="chart-card">
            <div className="chart-header">
              <span className="chart-title"><AlertTriangle size={20} /> Alertas</span>
            </div>
            <div className="alerts-section">
              {cardsParados.length > 0 && (
                <AlertCard type="warning" title="Cards Parados" message="Leads sem atividade há 3+ dias" count={cardsParados.length} />
              )}
              {manutPendentes.length > 0 && perm.verTodosClientes && (
                <AlertCard type="danger" title="Manutenções Atrasadas" message="Equipamentos precisam de atenção" count={manutPendentes.length} />
              )}
              {atividadesHoje.length === 0 && (
                <AlertCard type="danger" title="Sem Atividade Hoje" message="Vendedor não registrou ações" />
              )}
              {comissoesPendentes.length > 0 && perm.verComissoes && (
                <AlertCard type="warning" title="Comissões Pendentes" message={`$${totalComissoesPendentes.toFixed(2)} a pagar`} count={comissoesPendentes.length} />
              )}
              {cardsParados.length === 0 && atividadesHoje.length > 0 && (
                <AlertCard type="success" title="Tudo em Dia!" message="Nenhum alerta no momento" />
              )}
            </div>
          </div>
        </div>

        {/* Funil - só admin e gerente */}
        {perm.verFunilCompleto && (
          <div className="chart-card" style={{ marginTop: '24px' }}>
            <div className="chart-header">
              <span className="chart-title"><Target size={20} /> Funil de Vendas</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{data.trelloCards.length} leads total</span>
            </div>
            <div className="funnel-grid">
              {funnelData.map((item, i) => {
                const maxValue = Math.max(...funnelData.map(d => d.value));
                const width = (item.value / maxValue) * 100;
                return (
                  <div key={i} className="funnel-item">
                    <span className="funnel-name">{item.name}</span>
                    <div style={{ flex: 2 }}>
                      <div className="funnel-bar" style={{ width: `${width}%` }}></div>
                    </div>
                    <span className="funnel-count">{item.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Atividades Recentes */}
        <div className="chart-card" style={{ marginTop: '24px' }}>
          <div className="chart-header">
            <span className="chart-title"><Clock size={20} /> Atividades Recentes</span>
          </div>
          <div className="activities-list">
            {data.trelloActions.slice(0, 8).map((action, i) => (
              <div key={i} className="activity-item">
                <div className="activity-icon">
                  {action.type === 'createCard' && <FileText size={16} />}
                  {action.type === 'updateCard' && <Activity size={16} />}
                  {action.type === 'commentCard' && <Users size={16} />}
                  {!['createCard', 'updateCard', 'commentCard'].includes(action.type) && <Zap size={16} />}
                </div>
                <div className="activity-content">
                  <div>{action.data?.card?.name || action.type}</div>
                  <div className="activity-time">
                    {new Date(action.date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer com info de acesso */}
        <footer className="dashboard-footer">
          <span>Logado como: {usuario.email}</span>
          <NivelBadge nivel={usuario.nivel} />
        </footer>
      </div>
    </>
  );
}

// ==========================================
// ESTILOS
// ==========================================
function getStyles() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    /* LOGIN */
    .login-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Space Grotesk', sans-serif;
      padding: 20px;
    }
    
    .login-card {
      background: linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 24px;
      padding: 48px;
      width: 100%;
      max-width: 420px;
      backdrop-filter: blur(20px);
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .login-logo {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #00D9FF, #0066FF);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      color: #fff;
    }
    
    .login-header h1 {
      color: #fff;
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .login-header p {
      color: rgba(255,255,255,0.6);
      font-size: 14px;
    }
    
    .input-group {
      position: relative;
      margin-bottom: 16px;
    }
    
    .input-group svg {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255,255,255,0.4);
    }
    
    .input-group input {
      width: 100%;
      padding: 16px 48px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      color: #fff;
      font-family: inherit;
      font-size: 15px;
      transition: all 0.3s;
    }
    
    .input-group input:focus {
      outline: none;
      border-color: #00D9FF;
      background: rgba(0, 217, 255, 0.1);
    }
    
    .input-group input::placeholder {
      color: rgba(255,255,255,0.4);
    }
    
    .toggle-senha {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: rgba(255,255,255,0.4);
      cursor: pointer;
      padding: 4px;
    }
    
    .toggle-senha:hover {
      color: #00D9FF;
    }
    
    .login-error {
      background: rgba(231, 76, 60, 0.2);
      border: 1px solid rgba(231, 76, 60, 0.3);
      color: #E74C3C;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 16px;
      text-align: center;
    }
    
    .login-btn {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #00D9FF, #0066FF);
      border: none;
      border-radius: 12px;
      color: #fff;
      font-family: inherit;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .login-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(0, 217, 255, 0.3);
    }
    
    .login-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }
    
    .login-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 24px;
      color: rgba(255,255,255,0.4);
      font-size: 13px;
    }
    
    /* DASHBOARD */
    .dashboard {
      min-height: 100vh;
      background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%);
      color: #fff;
      font-family: 'Space Grotesk', sans-serif;
      padding: 24px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .header h1 {
      font-size: 24px;
      font-weight: 600;
      background: linear-gradient(135deg, #00D9FF, #0066FF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }
    
    .live-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(39, 174, 96, 0.2);
      border: 1px solid #27AE60;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 13px;
      color: #27AE60;
    }
    
    .live-dot {
      width: 8px;
      height: 8px;
      background: #27AE60;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.2); }
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      color: rgba(255,255,255,0.8);
      font-size: 14px;
    }
    
    .nivel-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      border: 1px solid;
    }
    
    .logout-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: rgba(231, 76, 60, 0.2);
      border: 1px solid rgba(231, 76, 60, 0.3);
      border-radius: 8px;
      color: #E74C3C;
      font-family: inherit;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.3s;
    }
    
    .logout-btn:hover {
      background: rgba(231, 76, 60, 0.3);
    }
    
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .loader {
      width: 48px;
      height: 48px;
      border: 3px solid rgba(255,255,255,0.1);
      border-top-color: #00D9FF;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    /* KPI Cards */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }
    
    .kpi-card {
      background: linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 24px;
      display: flex;
      gap: 16px;
      align-items: flex-start;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }
    
    .kpi-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: var(--accent, #00D9FF);
    }
    
    .kpi-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    }
    
    .kpi-card.kpi-hidden {
      opacity: 0.5;
    }
    
    .kpi-card.kpi-hidden:hover {
      transform: none;
    }
    
    .kpi-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, var(--accent, #1B4F72), rgba(255,255,255,0.1));
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }
    
    .kpi-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .kpi-title {
      font-size: 13px;
      color: rgba(255,255,255,0.6);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .kpi-value {
      font-size: 28px;
      font-weight: 700;
      font-family: 'JetBrains Mono', monospace;
    }
    
    .kpi-change {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      font-weight: 500;
    }
    
    .kpi-change.up { color: #27AE60; }
    .kpi-change.down { color: #E74C3C; }
    
    .kpi-subtitle {
      font-size: 12px;
      color: rgba(255,255,255,0.4);
    }
    
    /* Main grid */
    .main-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }
    
    .chart-card {
      background: linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 24px;
    }
    
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .chart-title {
      font-size: 16px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .chart-title svg {
      color: #00D9FF;
    }
    
    /* Alertas */
    .alerts-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .alert-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-radius: 12px;
      font-size: 14px;
    }
    
    .alert-card.warning {
      background: rgba(243, 156, 18, 0.15);
      border: 1px solid rgba(243, 156, 18, 0.3);
      color: #F39C12;
    }
    
    .alert-card.danger {
      background: rgba(231, 76, 60, 0.15);
      border: 1px solid rgba(231, 76, 60, 0.3);
      color: #E74C3C;
    }
    
    .alert-card.success {
      background: rgba(39, 174, 96, 0.15);
      border: 1px solid rgba(39, 174, 96, 0.3);
      color: #27AE60;
    }
    
    .alert-card div {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    
    .alert-card strong {
      font-weight: 600;
    }
    
    .alert-card span {
      font-size: 12px;
      opacity: 0.8;
    }
    
    .alert-count {
      background: rgba(255,255,255,0.2);
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 600;
      font-family: 'JetBrains Mono', monospace;
    }
    
    /* Funil */
    .funnel-grid {
      display: grid;
      gap: 8px;
    }
    
    .funnel-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: rgba(255,255,255,0.03);
      border-radius: 8px;
    }
    
    .funnel-bar {
      height: 8px;
      border-radius: 4px;
      background: linear-gradient(90deg, #1B4F72, #00D9FF);
      transition: width 0.5s ease;
    }
    
    .funnel-name {
      flex: 1;
      font-size: 14px;
      min-width: 120px;
    }
    
    .funnel-count {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 600;
      color: #00D9FF;
    }
    
    /* Atividades */
    .activities-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 8px;
    }
    
    .activity-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: rgba(255,255,255,0.03);
      border-radius: 8px;
      font-size: 13px;
    }
    
    .activity-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 217, 255, 0.2);
      color: #00D9FF;
      flex-shrink: 0;
    }
    
    .activity-content {
      flex: 1;
      overflow: hidden;
    }
    
    .activity-content > div:first-child {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .activity-time {
      font-size: 11px;
      color: rgba(255,255,255,0.4);
    }
    
    /* Footer */
    .dashboard-footer {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: rgba(255,255,255,0.4);
      font-size: 13px;
    }
    
    @media (max-width: 768px) {
      .header { flex-direction: column; align-items: flex-start; }
      .header-right { width: 100%; justify-content: space-between; }
      .kpi-grid { grid-template-columns: 1fr; }
    }
  `;
}
