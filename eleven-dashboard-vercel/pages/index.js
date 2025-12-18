import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart } from 'recharts';
import { Package, FileText, DollarSign, Wrench, TrendingUp, TrendingDown, Clock, CheckCircle, AlertTriangle, RefreshCw, Users, Activity, LogOut, Lock, Eye, EyeOff, User, Shield, UserCheck, Zap, LayoutDashboard, Briefcase, PiggyBank, Settings, Filter, Calendar, ChevronDown, X, Bell, Target, ArrowRight, BarChart3, UserCircle, Award, Trophy, Medal, Star, Flame, CreditCard, ArrowUpRight, ArrowDownRight, ExternalLink, TrendingUp as Trending } from 'lucide-react';

// ==========================================
// CONFIGURAÇÃO
// ==========================================
const API_URL = 'https://n8n.srv1199443.hstgr.cloud/webhook/eleven-dashboard';

const USUARIOS = [
  { email: 'leonardo@elevenfragrances.com', senha: 'admin123', nome: 'Leonardo', nivel: 'admin' },
  { email: 'marcelo@casamenta.com.br', senha: 'admin123', nome: 'Marcelo', nivel: 'admin' },
  { email: 'ericavidal@elevenfragrances.com', senha: 'gerente123', nome: 'Erica', nivel: 'gerente' },
  { email: 'mateuslopes@elevenfragrances.com', senha: 'vendedor123', nome: 'Mateus', nivel: 'vendedor', vendedorId: 'EF-V-01' },
];

const PERMISSOES = {
  admin: { verReceitaTotal: true, verTodasComissoes: true, verFunilCompleto: true, verTodosClientes: true, verFinanceiro: true, verEquipe: true, filtrarPorVendedor: true },
  gerente: { verReceitaTotal: true, verTodasComissoes: true, verFunilCompleto: true, verTodosClientes: true, verFinanceiro: false, verEquipe: true, filtrarPorVendedor: true },
  vendedor: { verReceitaTotal: false, verTodasComissoes: false, verFunilCompleto: false, verTodosClientes: false, verFinanceiro: false, verEquipe: false, filtrarPorVendedor: false }
};

const CORES = {
  primary: '#10b981', secondary: '#3b82f6', warning: '#f59e0b', danger: '#ef4444', purple: '#8b5cf6', cyan: '#06b6d4', pink: '#ec4899',
  equipamentos: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'],
  vendedores: { 'EF-V-01': '#3B82F6', 'EF-V-02': '#10B981', 'EF-V-03': '#F59E0B', 'EF-V-04': '#F97316', 'EF-V-05': '#8B5CF6', 'sem-vendedor': '#EF4444' },
  gradient: { green: ['#10b981', '#059669'], blue: ['#3b82f6', '#2563eb'], purple: ['#8b5cf6', '#7c3aed'], orange: ['#f59e0b', '#d97706'] }
};

const NOMES_VENDEDORES = { 'EF-V-01': 'Mateus', 'EF-V-02': 'Vendedor 2', 'EF-V-03': 'Vendedor 3', 'EF-V-04': 'Vendedor 4', 'EF-V-05': 'Vendedor 5', 'sem-vendedor': 'Sem Vendedor' };

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
    setTimeout(() => { onLogin(email, senha); setLoading(false); }, 500);
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginCard}>
        <div style={styles.loginHeader}>
          <div style={styles.loginLogo}><Zap size={32} color="white" /></div>
          <h1 style={styles.loginTitle}>Eleven Fragrances</h1>
          <p style={styles.loginSubtitle}>Dashboard de Operações</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <User size={18} style={styles.inputIcon} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <Lock size={18} style={styles.inputIcon} />
            <input type={showSenha ? 'text' : 'password'} placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required style={styles.input} />
            <button type="button" onClick={() => setShowSenha(!showSenha)} style={styles.toggleSenha}>{showSenha ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          {error && <div style={styles.loginError}>{error}</div>}
          <button type="submit" disabled={loading} style={styles.loginBtn}>{loading ? 'Entrando...' : 'Entrar'}</button>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTES REUTILIZÁVEIS
// ==========================================
const StatCard = ({ title, value, subtitle, icon: Icon, color, trend, trendValue, loading, onClick, small }) => (
  <div style={{...styles.statCard, ...(small ? {padding: 16} : {}), cursor: onClick ? 'pointer' : 'default'}} onClick={onClick}>
    <div style={styles.statCardHeader}>
      <div style={{flex: 1}}>
        <p style={{...styles.statCardTitle, ...(small ? {fontSize: 11} : {})}}>{title}</p>
        {loading ? <div style={styles.skeleton}></div> : <p style={{...styles.statCardValue, ...(small ? {fontSize: 20} : {})}}>{value}</p>}
        {subtitle && <p style={styles.statCardSubtitle}>{subtitle}</p>}
        {trend && (
          <div style={{display: 'flex', alignItems: 'center', gap: 4, marginTop: 4}}>
            {trend === 'up' ? <ArrowUpRight size={14} color="#10b981" /> : <ArrowDownRight size={14} color="#ef4444" />}
            <span style={{fontSize: 12, color: trend === 'up' ? '#10b981' : '#ef4444'}}>{trendValue}</span>
          </div>
        )}
      </div>
      <div style={{...styles.statCardIcon, background: color, ...(small ? {padding: 8} : {})}}><Icon size={small ? 18 : 24} color="white" /></div>
    </div>
  </div>
);

const GradientStatCard = ({ title, value, subtitle, icon: Icon, gradient, badge }) => (
  <div style={{...styles.statCard, background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`, border: 'none'}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
      <div>
        <p style={{color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 8}}>{title}</p>
        <p style={{color: 'white', fontSize: 28, fontWeight: 700}}>{value}</p>
        {subtitle && <p style={{color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4}}>{subtitle}</p>}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8}}>
        <Icon size={28} color="rgba(255,255,255,0.9)" />
        {badge && <span style={{background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: 12, fontSize: 11, color: 'white'}}>{badge}</span>}
      </div>
    </div>
  </div>
);

const SectionHeader = ({ icon: Icon, title, subtitle, action }) => (
  <div style={styles.sectionHeader}>
    <div style={styles.sectionHeaderLeft}>
      <Icon size={24} color={CORES.primary} />
      <div><h2 style={styles.sectionTitle}>{title}</h2>{subtitle && <p style={styles.sectionSubtitle}>{subtitle}</p>}</div>
    </div>
    {action}
  </div>
);

const FilterDropdown = ({ label, value, options, onChange }) => (
  <div style={styles.filterDropdown}>
    <label style={styles.filterLabel}>{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} style={styles.filterSelect}>
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

const TabButton = ({ icon: Icon, label, active, onClick, badge }) => (
  <button onClick={onClick} style={{...styles.tabButton, ...(active ? styles.tabButtonActive : {})}}>
    <Icon size={20} /><span>{label}</span>
    {badge > 0 && <span style={styles.tabBadge}>{badge}</span>}
  </button>
);

const ChartCard = ({ title, subtitle, children, height = 300, action }) => (
  <div style={styles.chartCard}>
    <div style={{...styles.chartCardHeader, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
      <div><h3 style={styles.chartCardTitle}>{title}</h3>{subtitle && <p style={styles.chartCardSubtitle}>{subtitle}</p>}</div>
      {action}
    </div>
    <div style={{height}}>{children}</div>
  </div>
);

const AlertCard = ({ type, title, message, count, action }) => {
  const colors = { danger: '#ef4444', warning: '#f59e0b', success: '#10b981', info: '#3b82f6' };
  const icons = { danger: AlertTriangle, warning: Clock, success: CheckCircle, info: Bell };
  const Icon = icons[type];
  return (
    <div style={{...styles.alertCard, borderLeftColor: colors[type]}}>
      <Icon size={20} color={colors[type]} />
      <div style={styles.alertContent}><p style={styles.alertTitle}>{title}</p><p style={styles.alertMessage}>{message}</p></div>
      {count !== undefined && <span style={{...styles.alertCount, background: colors[type]}}>{count}</span>}
      {action}
    </div>
  );
};

const DataTable = ({ columns, data, emptyMessage, maxHeight }) => (
  <div style={{...styles.tableContainer, ...(maxHeight ? {maxHeight, overflowY: 'auto'} : {})}}>
    {data.length > 0 ? (
      <table style={styles.table}>
        <thead><tr>{columns.map((col, i) => <th key={i} style={styles.th}>{col.header}</th>)}</tr></thead>
        <tbody>{data.map((row, i) => (<tr key={i} style={styles.tr}>{columns.map((col, j) => <td key={j} style={styles.td}>{col.render ? col.render(row) : row[col.key]}</td>)}</tr>))}</tbody>
      </table>
    ) : <p style={styles.emptyMessage}>{emptyMessage}</p>}
  </div>
);

const VendedorBadge = ({ vendedorId, showId }) => {
  if (!vendedorId || vendedorId.includes('Object')) return <span style={{...styles.badge, background: '#ef444420', color: '#ef4444'}}>Sem Vendedor</span>;
  const nome = NOMES_VENDEDORES[vendedorId] || vendedorId;
  const cor = CORES.vendedores[vendedorId] || '#64748b';
  return <span style={{...styles.badge, background: `${cor}20`, color: cor}}>{nome}{showId && ` (${vendedorId})`}</span>;
};

const ProgressBar = ({ value, max, color, label }) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{marginBottom: 8}}>
      {label && <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}><span style={{fontSize: 12, color: '#94a3b8'}}>{label}</span><span style={{fontSize: 12, color: 'white'}}>{value}</span></div>}
      <div style={{height: 6, background: '#334155', borderRadius: 3, overflow: 'hidden'}}>
        <div style={{height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.3s'}}></div>
      </div>
    </div>
  );
};

const RankingBadge = ({ position }) => {
  const badges = { 1: { icon: Trophy, color: '#fbbf24', bg: '#fbbf2420' }, 2: { icon: Medal, color: '#94a3b8', bg: '#94a3b820' }, 3: { icon: Award, color: '#cd7f32', bg: '#cd7f3220' } };
  const badge = badges[position];
  if (!badge) return <span style={{...styles.badge, background: '#1e293b', color: '#64748b'}}>#{position}</span>;
  const Icon = badge.icon;
  return <span style={{...styles.badge, background: badge.bg, color: badge.color, display: 'inline-flex', alignItems: 'center', gap: 4}}><Icon size={14} /> #{position}</span>;
};

// ==========================================
// HOOK: FILTRAR DADOS POR VENDEDOR
// ==========================================
const useDadosFiltrados = (data, usuario, filtroVendedor) => {
  return useMemo(() => {
    if (!data) return null;
    const perm = PERMISSOES[usuario.nivel];
    let vendedorAtivo = null;
    
    if (!perm.filtrarPorVendedor) vendedorAtivo = usuario.vendedorId;
    else if (filtroVendedor !== 'todos') vendedorAtivo = filtroVendedor;
    
    if (!vendedorAtivo) return { ...data, filtroAtivo: null, resumoFiltrado: data.resumo };
    
    const contratosFiltrados = data.contratos?.filter(c => c.vendedorId === vendedorAtivo) || [];
    const clientesFiltrados = data.clientes?.filter(c => c.vendedorId === vendedorAtivo) || [];
    const comissoesFiltradas = data.comissoes?.filter(c => c.vendedorId === vendedorAtivo) || [];
    const manutencoesFiltradas = data.manutencoes?.filter(m => m.vendedorId === vendedorAtivo) || [];
    const cardsFiltrados = data.cards?.filter(c => c.vendedorId === vendedorAtivo) || [];
    const cardsParadosFiltrados = data.cardsParados?.filter(c => c.vendedorId === vendedorAtivo) || [];
    
    const contratosAtivos = contratosFiltrados.filter(c => c.status === 'active');
    const comissoesPendentes = comissoesFiltradas.filter(c => c.status === 'pending');
    const funilFiltrado = data.funilPorVendedor?.[vendedorAtivo] || {};
    
    return {
      ...data,
      contratos: contratosFiltrados, clientes: clientesFiltrados, comissoes: comissoesFiltradas,
      manutencoes: manutencoesFiltradas, cards: cardsFiltrados, cardsParados: cardsParadosFiltrados,
      funil: Object.keys(funilFiltrado).length > 0 ? funilFiltrado : {},
      filtroAtivo: vendedorAtivo,
      resumoFiltrado: {
        contratosTotal: contratosFiltrados.length, contratosAtivos: contratosAtivos.length,
        contratosDraft: contratosFiltrados.filter(c => c.status === 'draft').length,
        clientesTotal: clientesFiltrados.length,
        equipamentosTotal: contratosFiltrados.reduce((sum, c) => sum + (c.qtdPirad||0) + (c.qtdSquare||0) + (c.qtdDesign||0) + (c.qtdTower||0) + (c.qtdPro2||0), 0),
        receitaMensal: contratosAtivos.reduce((sum, c) => sum + (c.valorMensal || 0), 0),
        comissoesPendentes: comissoesPendentes.length,
        totalComissoesPendentes: comissoesPendentes.reduce((sum, c) => sum + (c.valor || 0), 0),
        manutencoes7dias: manutencoesFiltradas.filter(m => { const diff = Math.ceil((new Date(m.dataProxima) - new Date()) / (1000*60*60*24)); return diff <= 7 && diff >= 0; }).length,
        cardsParados: cardsParadosFiltrados.length, cardsTotal: cardsFiltrados.length
      }
    };
  }, [data, usuario, filtroVendedor]);
};

// ==========================================
// SEÇÃO: VISÃO GERAL
// ==========================================
const VisaoGeral = ({ data, loading, perm, usuario }) => {
  const resumo = data?.resumoFiltrado || data?.resumo || {};
  const metricas = data?.metricasSemana || {};
  
  const alertas = [
    resumo.manutencoes7dias > 0 && { type: 'warning', title: 'Manutenções Próximas', message: `${resumo.manutencoes7dias} nos próximos 7 dias`, count: resumo.manutencoes7dias },
    resumo.cardsParados > 0 && { type: 'danger', title: 'Cards Parados', message: 'Leads sem movimento há +3 dias', count: resumo.cardsParados },
    data?.comissoes?.filter(c => c.urgencia === 'atrasada').length > 0 && { type: 'danger', title: 'Comissões Atrasadas', message: 'Pagamentos em atraso', count: data.comissoes.filter(c => c.urgencia === 'atrasada').length },
  ].filter(Boolean);

  const equipData = data?.equipamentos ? [
    { name: 'Pirad', value: data.equipamentos.pirad, color: CORES.equipamentos[0] },
    { name: 'Square', value: data.equipamentos.square, color: CORES.equipamentos[1] },
    { name: 'Design', value: data.equipamentos.design, color: CORES.equipamentos[2] },
    { name: 'Tower', value: data.equipamentos.tower, color: CORES.equipamentos[3] },
    { name: 'Pro 2', value: data.equipamentos.pro2, color: CORES.equipamentos[4] },
  ].filter(d => d.value > 0) : [];

  const funnelData = data?.funil ? Object.entries(data.funil).map(([name, value]) => ({
    name: name.replace(/^[\d\s\-\.]+/, '').substring(0, 12), value
  })).filter(d => d.value > 0) : [];

  return (
    <div>
      <SectionHeader icon={LayoutDashboard} title={data?.filtroAtivo ? `Meu Painel` : "Visão Geral"} subtitle={data?.filtroAtivo ? `${NOMES_VENDEDORES[data.filtroAtivo]}` : "Resumo executivo"} />
      
      {/* KPIs Principais */}
      <div style={styles.kpiGrid}>
        <GradientStatCard title="Contratos Ativos" value={resumo.contratosAtivos || 0} subtitle={`${resumo.contratosDraft || 0} em negociação`} icon={FileText} gradient={CORES.gradient.blue} />
        <GradientStatCard title="Equipamentos" value={resumo.equipamentosTotal || 0} subtitle="Em operação" icon={Package} gradient={CORES.gradient.green} />
        {perm.verReceitaTotal && <GradientStatCard title="MRR" value={`$${(resumo.receitaMensal || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}`} subtitle="Receita mensal" icon={DollarSign} gradient={CORES.gradient.purple} badge={`ARR: $${((resumo.receitaMensal || 0) * 12).toLocaleString('en-US', {maximumFractionDigits: 0})}`} />}
        <GradientStatCard title="Pipeline" value={resumo.cardsTotal || Object.values(data?.funil || {}).reduce((a,b) => a+b, 0)} subtitle="Leads ativos" icon={Target} gradient={CORES.gradient.orange} />
      </div>

      {/* Métricas da Semana */}
      {!data?.filtroAtivo && (
        <div style={{marginTop: 24}}>
          <h3 style={styles.subsectionTitle}>📈 Esta Semana</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12}}>
            <StatCard title="Novos Leads" value={metricas.leadsCriados || 0} icon={TrendingUp} color={CORES.primary} small />
            <StatCard title="Fechados" value={metricas.fechados || 0} icon={CheckCircle} color={CORES.secondary} small />
            <StatCard title="Movimentações" value={metricas.cardsMovidos || 0} icon={Activity} color={CORES.warning} small />
            <StatCard title="Taxa Conversão" value={`${metricas.taxaConversao || 0}%`} icon={Target} color={CORES.purple} small />
          </div>
        </div>
      )}

      {/* Alertas */}
      {alertas.length > 0 && (
        <div style={{marginTop: 24}}>
          <h3 style={styles.subsectionTitle}>🔔 Alertas</h3>
          <div style={styles.alertGrid}>{alertas.map((a, i) => <AlertCard key={i} {...a} />)}</div>
        </div>
      )}

      {/* Gráficos */}
      <div style={{...styles.chartGrid, marginTop: 24}}>
        {!data?.filtroAtivo && equipData.length > 0 && (
          <ChartCard title="Equipamentos por Tipo" subtitle="Distribuição da frota">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={equipData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                  {equipData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={styles.tooltipStyle} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {funnelData.length > 0 && (
          <ChartCard title={data?.filtroAtivo ? "Meu Pipeline" : "Pipeline Comercial"} subtitle="Leads por etapa">
            <ResponsiveContainer>
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="name" type="category" width={90} stroke="#64748b" tick={{fontSize: 11}} />
                <Tooltip contentStyle={styles.tooltipStyle} />
                <Bar dataKey="value" fill={data?.filtroAtivo ? CORES.vendedores[data.filtroAtivo] : CORES.primary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>
    </div>
  );
};

// ==========================================
// SEÇÃO: COMISSÕES
// ==========================================
const Comissoes = ({ data, loading, perm, usuario }) => {
  const resumo = data?.resumo || {};
  const comissoesPorVendedor = data?.comissoesPorVendedor || {};
  const comissoes = data?.comissoes || [];
  
  // Se é vendedor, mostra só as dele
  const minhasComissoes = perm.verTodasComissoes ? comissoes : comissoes.filter(c => c.vendedorId === usuario.vendedorId);
  const pendentes = minhasComissoes.filter(c => c.status === 'pending');
  const atrasadas = pendentes.filter(c => c.urgencia === 'atrasada');
  const proximas = pendentes.filter(c => c.urgencia === 'proxima' || c.urgencia === 'hoje');
  
  const totalPendente = pendentes.reduce((sum, c) => sum + c.valor, 0);
  const totalAtrasado = atrasadas.reduce((sum, c) => sum + c.valor, 0);

  // Dados do gráfico por vendedor
  const chartData = Object.entries(comissoesPorVendedor).map(([vid, dados]) => ({
    vendedor: NOMES_VENDEDORES[vid] || vid,
    pendente: dados.pendente,
    pago: dados.pago,
    fill: CORES.vendedores[vid] || '#64748b'
  })).filter(d => d.pendente > 0 || d.pago > 0);

  const comissoesColumns = [
    { header: 'Vendedor', render: (row) => <VendedorBadge vendedorId={row.vendedorId} /> },
    { header: 'Contrato', key: 'contratoId' },
    { header: 'Valor', render: (row) => <span style={{fontWeight: 600, color: '#10b981'}}>${row.valor?.toFixed(2)}</span> },
    { header: 'Vencimento', render: (row) => row.dataPagamento || '-' },
    { header: 'Status', render: (row) => {
      const colors = { atrasada: '#ef4444', hoje: '#f59e0b', proxima: '#3b82f6', normal: '#64748b' };
      const labels = { atrasada: 'Atrasada', hoje: 'Hoje', proxima: 'Próxima', normal: 'Pendente' };
      return <span style={{...styles.badge, background: `${colors[row.urgencia]}20`, color: colors[row.urgencia]}}>{labels[row.urgencia]}</span>;
    }},
  ];

  return (
    <div>
      <SectionHeader icon={DollarSign} title="Comissões" subtitle={perm.verTodasComissoes ? "Gestão de comissões da equipe" : "Minhas comissões"} />

      {/* KPIs */}
      <div style={styles.kpiGrid}>
        <GradientStatCard title="Total Pendente" value={`$${totalPendente.toFixed(2)}`} subtitle={`${pendentes.length} comissões`} icon={CreditCard} gradient={CORES.gradient.blue} />
        {atrasadas.length > 0 && <GradientStatCard title="Atrasadas" value={`$${totalAtrasado.toFixed(2)}`} subtitle={`${atrasadas.length} em atraso`} icon={AlertTriangle} gradient={['#ef4444', '#dc2626']} />}
        {perm.verTodasComissoes && <GradientStatCard title="Total Pago" value={`$${(resumo.totalComissoesPagas || 0).toFixed(2)}`} subtitle={`${resumo.comissoesPagas || 0} pagas`} icon={CheckCircle} gradient={CORES.gradient.green} />}
      </div>

      {/* Gráfico por vendedor (só admin/gerente) */}
      {perm.verTodasComissoes && chartData.length > 0 && (
        <div style={{marginTop: 32}}>
          <ChartCard title="Comissões por Vendedor" subtitle="Pendente vs Pago" height={280}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="vendedor" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={styles.tooltipStyle} formatter={(v) => `$${v.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="pendente" name="Pendente" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pago" name="Pago" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {/* Resumo por vendedor */}
      {perm.verTodasComissoes && Object.keys(comissoesPorVendedor).length > 0 && (
        <div style={{marginTop: 32}}>
          <h3 style={styles.subsectionTitle}>💰 Resumo por Vendedor</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12}}>
            {Object.entries(comissoesPorVendedor).map(([vid, dados]) => (
              <div key={vid} style={{...styles.statCard, borderLeft: `4px solid ${CORES.vendedores[vid] || '#64748b'}`}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12}}>
                  <UserCircle size={24} color={CORES.vendedores[vid] || '#64748b'} />
                  <span style={{fontWeight: 600}}>{NOMES_VENDEDORES[vid] || vid}</span>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8}}>
                  <div><p style={{color: '#64748b', fontSize: 11}}>Pendente</p><p style={{color: '#f59e0b', fontWeight: 600}}>${dados.pendente.toFixed(2)}</p></div>
                  <div><p style={{color: '#64748b', fontSize: 11}}>Pago</p><p style={{color: '#10b981', fontWeight: 600}}>${dados.pago.toFixed(2)}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabela de comissões */}
      <div style={{marginTop: 32}}>
        <h3 style={styles.subsectionTitle}>📋 Comissões Pendentes</h3>
        <DataTable columns={comissoesColumns} data={pendentes.slice(0, 15)} emptyMessage="Nenhuma comissão pendente 🎉" maxHeight={400} />
      </div>
    </div>
  );
};

// ==========================================
// SEÇÃO: COMERCIAL
// ==========================================
const Comercial = ({ data, loading, perm }) => {
  const resumo = data?.resumoFiltrado || data?.resumo || {};
  const metricas = data?.metricasSemana || {};
  
  const funnelData = data?.funil ? Object.entries(data.funil).map(([name, value], i) => ({
    name: name.replace(/^[\d\s\-\.]+/, ''), value, fill: CORES.equipamentos[i % 5]
  })) : [];

  const atividadesColumns = [
    { header: 'Hora', render: (row) => new Date(row.data).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'}) },
    { header: 'Card', render: (row) => row.card?.substring(0, 25) || '-' },
    { header: 'Ação', render: (row) => row.listaDe && row.listaPara ? `${row.listaDe.substring(0,10)} → ${row.listaPara.substring(0,10)}` : row.tipo },
  ];

  const cardsColumns = [
    { header: 'Lead', render: (row) => <div><span style={{fontWeight: 500}}>{row.nome?.substring(0, 25)}</span>{row.url && <a href={row.url} target="_blank" rel="noopener noreferrer" style={{marginLeft: 4}}><ExternalLink size={12} color="#64748b" /></a>}</div> },
    { header: 'Lista', render: (row) => row.lista?.replace(/^[\d\s\-\.]+/, '').substring(0, 15) },
    { header: 'Vendedor', render: (row) => <VendedorBadge vendedorId={row.vendedorId} /> },
    { header: 'Dias', render: (row) => <span style={{...styles.badge, background: row.diasParado > 7 ? '#ef444420' : '#f59e0b20', color: row.diasParado > 7 ? '#ef4444' : '#f59e0b'}}>{row.diasParado}d</span> }
  ];

  return (
    <div>
      <SectionHeader icon={Briefcase} title={data?.filtroAtivo ? "Meus Leads" : "Comercial"} subtitle="Pipeline e atividades" />

      {/* KPIs */}
      <div style={styles.kpiGrid}>
        <StatCard title="Total Pipeline" value={resumo.cardsTotal || 0} icon={Target} color={CORES.secondary} loading={loading} />
        <StatCard title="Leads Semana" value={metricas.leadsCriados || 0} icon={TrendingUp} color={CORES.primary} loading={loading} />
        <StatCard title="Fechados Semana" value={metricas.fechados || 0} icon={CheckCircle} color={CORES.purple} loading={loading} />
        <StatCard title="Cards Parados" value={resumo.cardsParados || 0} subtitle="+3 dias" icon={AlertTriangle} color={CORES.danger} loading={loading} />
      </div>

      {/* Funil */}
      <div style={{marginTop: 32}}>
        <ChartCard title="Funil de Vendas" height={320}>
          <ResponsiveContainer>
            <BarChart data={funnelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#64748b" angle={-45} textAnchor="end" height={100} tick={{fontSize: 10}} />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={styles.tooltipStyle} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>{funnelData.map((e, i) => <Cell key={i} fill={e.fill} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Tabelas */}
      <div style={{...styles.chartGrid, marginTop: 32}}>
        <div>
          <h3 style={styles.subsectionTitle}>⚡ Atividades Recentes</h3>
          <DataTable columns={atividadesColumns} data={(data?.atividadesRecentes || []).slice(0, 10)} emptyMessage="Nenhuma atividade" maxHeight={350} />
        </div>
        <div>
          <h3 style={styles.subsectionTitle}>⚠️ Cards Parados (+3 dias)</h3>
          <DataTable columns={cardsColumns} data={(data?.cardsParados || []).slice(0, 10)} emptyMessage="Nenhum card parado 🎉" maxHeight={350} />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// SEÇÃO: OPERACIONAL
// ==========================================
const Operacional = ({ data, loading }) => {
  const resumo = data?.resumoFiltrado || data?.resumo || {};

  const manutColumns = [
    { header: 'Cliente', key: 'clienteId' },
    { header: 'Data', key: 'dataProxima' },
    { header: 'Vendedor', render: (row) => <VendedorBadge vendedorId={row.vendedorId} /> },
    { header: 'Obs', render: (row) => row.obs?.substring(0, 30) || '-' },
  ];

  const contratosColumns = [
    { header: 'ID', key: 'id' },
    { header: 'Cliente', key: 'clienteId' },
    { header: 'Valor', render: (row) => `$${row.valorMensal?.toFixed(2)}` },
    { header: 'Vendedor', render: (row) => <VendedorBadge vendedorId={row.vendedorId} /> },
    { header: 'Status', render: (row) => <span style={{...styles.badge, background: row.status === 'active' ? '#10b98120' : '#f59e0b20', color: row.status === 'active' ? '#10b981' : '#f59e0b'}}>{row.status}</span> },
  ];

  return (
    <div>
      <SectionHeader icon={Wrench} title="Operacional" subtitle="Contratos e manutenções" />

      <div style={styles.kpiGrid}>
        <StatCard title="Total Contratos" value={resumo.contratosTotal || 0} icon={FileText} color={CORES.secondary} loading={loading} />
        <StatCard title="Ativos" value={resumo.contratosAtivos || 0} icon={CheckCircle} color={CORES.primary} loading={loading} />
        <StatCard title="Negociação" value={resumo.contratosDraft || 0} icon={Clock} color={CORES.warning} loading={loading} />
        <StatCard title="Manutenções 7d" value={resumo.manutencoes7dias || 0} icon={Wrench} color={CORES.danger} loading={loading} />
      </div>

      <div style={{marginTop: 32}}>
        <h3 style={styles.subsectionTitle}>📋 Contratos</h3>
        <DataTable columns={contratosColumns} data={(data?.contratos || []).slice(0, 10)} emptyMessage="Nenhum contrato" />
      </div>

      <div style={{marginTop: 32}}>
        <h3 style={styles.subsectionTitle}>🔧 Próximas Manutenções</h3>
        <DataTable columns={manutColumns} data={(data?.manutencoes || []).filter(m => {
          const diff = Math.ceil((new Date(m.dataProxima) - new Date()) / (1000*60*60*24));
          return diff >= 0 && diff <= 7;
        }).slice(0, 10)} emptyMessage="Nenhuma manutenção programada" />
      </div>
    </div>
  );
};

// ==========================================
// SEÇÃO: EQUIPE (Ranking)
// ==========================================
const Equipe = ({ data, loading, perm }) => {
  if (!perm.verEquipe) return <div style={styles.restrictedAccess}><Lock size={48} color="#64748b" /><h3>Acesso Restrito</h3></div>;

  const ranking = data?.rankingVendedores || [];
  const maxScore = Math.max(...ranking.map(r => r.score), 1);

  return (
    <div>
      <SectionHeader icon={Users} title="Equipe" subtitle="Ranking e performance" />

      {/* Pódio */}
      {ranking.length >= 3 && (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 16, marginBottom: 32, padding: 20}}>
          {[ranking[1], ranking[0], ranking[2]].map((v, i) => {
            const heights = [140, 180, 120];
            const pos = [2, 1, 3][i];
            const colors = ['#94a3b8', '#fbbf24', '#cd7f32'];
            return v ? (
              <div key={v.vendedorId} style={{textAlign: 'center'}}>
                <UserCircle size={48} color={CORES.vendedores[v.vendedorId] || '#64748b'} style={{marginBottom: 8}} />
                <p style={{fontWeight: 600, color: 'white', marginBottom: 4}}>{NOMES_VENDEDORES[v.vendedorId]}</p>
                <p style={{fontSize: 12, color: '#64748b', marginBottom: 8}}>${v.receitaMensal.toFixed(2)}</p>
                <div style={{width: 80, height: heights[i], background: `linear-gradient(180deg, ${colors[i]}, ${colors[i]}60)`, borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 12}}>
                  <span style={{fontSize: 24, fontWeight: 'bold', color: 'white'}}>#{pos}</span>
                </div>
              </div>
            ) : null;
          })}
        </div>
      )}

      {/* Cards detalhados */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16}}>
        {ranking.map((v, i) => (
          <div key={v.vendedorId} style={{...styles.statCard, borderLeft: `4px solid ${CORES.vendedores[v.vendedorId] || '#64748b'}`}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                <UserCircle size={36} color={CORES.vendedores[v.vendedorId] || '#64748b'} />
                <div>
                  <p style={{fontWeight: 600, color: 'white', margin: 0}}>{NOMES_VENDEDORES[v.vendedorId]}</p>
                  <p style={{color: '#64748b', fontSize: 12, margin: 0}}>{v.vendedorId}</p>
                </div>
              </div>
              <RankingBadge position={i + 1} />
            </div>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16}}>
              <div><p style={{color: '#64748b', fontSize: 11, margin: 0}}>Receita</p><p style={{color: '#10b981', fontWeight: 600, fontSize: 18, margin: 0}}>${v.receitaMensal.toFixed(2)}</p></div>
              <div><p style={{color: '#64748b', fontSize: 11, margin: 0}}>Contratos</p><p style={{color: 'white', fontWeight: 600, fontSize: 18, margin: 0}}>{v.contratosAtivos}</p></div>
              <div><p style={{color: '#64748b', fontSize: 11, margin: 0}}>Leads</p><p style={{color: '#3b82f6', fontWeight: 600, fontSize: 18, margin: 0}}>{v.leadsAtivos}</p></div>
              <div><p style={{color: '#64748b', fontSize: 11, margin: 0}}>Parados</p><p style={{color: v.cardsParados > 0 ? '#ef4444' : '#10b981', fontWeight: 600, fontSize: 18, margin: 0}}>{v.cardsParados}</p></div>
            </div>

            <div style={{borderTop: '1px solid #334155', paddingTop: 12}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 4}}>
                <span style={{color: '#64748b', fontSize: 12}}>Comissão Pendente</span>
                <span style={{color: '#f59e0b', fontWeight: 600}}>${v.comissaoPendente.toFixed(2)}</span>
              </div>
              <ProgressBar value={v.score} max={maxScore} color={CORES.vendedores[v.vendedorId] || '#64748b'} />
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico comparativo */}
      <div style={{marginTop: 32}}>
        <ChartCard title="Comparativo de Performance" height={300}>
          <ResponsiveContainer>
            <BarChart data={ranking}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="vendedorId" stroke="#64748b" tickFormatter={(v) => NOMES_VENDEDORES[v] || v} />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={styles.tooltipStyle} labelFormatter={(v) => NOMES_VENDEDORES[v] || v} />
              <Legend />
              <Bar dataKey="receitaMensal" name="Receita" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="leadsAtivos" name="Leads" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

// ==========================================
// SEÇÃO: FINANCEIRO
// ==========================================
const Financeiro = ({ data, loading, perm }) => {
  if (!perm.verFinanceiro) return <div style={styles.restrictedAccess}><Lock size={48} color="#64748b" /><h3>Acesso Restrito</h3><p>Apenas administradores.</p></div>;

  const resumo = data?.resumo || {};
  const historico = data?.historicoReceita || [];

  return (
    <div>
      <SectionHeader icon={PiggyBank} title="Financeiro" subtitle="Receitas e projeções" />

      <div style={styles.kpiGrid}>
        <GradientStatCard title="MRR" value={`$${(resumo.receitaMensal || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}`} icon={DollarSign} gradient={CORES.gradient.green} badge="Mensal" />
        <GradientStatCard title="ARR" value={`$${((resumo.receitaMensal || 0) * 12).toLocaleString('en-US', {minimumFractionDigits: 2})}`} icon={TrendingUp} gradient={CORES.gradient.blue} badge="Anual" />
        <GradientStatCard title="Ticket Médio" value={`$${resumo.contratosAtivos > 0 ? (resumo.receitaMensal / resumo.contratosAtivos).toFixed(2) : '0.00'}`} icon={Target} gradient={CORES.gradient.purple} />
        <GradientStatCard title="Comissões" value={`$${(resumo.totalComissoesPendentes || 0).toFixed(2)}`} subtitle="Pendentes" icon={Users} gradient={CORES.gradient.orange} />
      </div>

      {/* Histórico */}
      {historico.length > 0 && (
        <div style={{marginTop: 32}}>
          <ChartCard title="Histórico de Receita" subtitle="Últimos 6 meses" height={300}>
            <ResponsiveContainer>
              <AreaChart data={historico}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="mes" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={styles.tooltipStyle} formatter={(v) => [`$${v.toFixed(2)}`, 'Receita']} />
                <Area type="monotone" dataKey="valor" stroke={CORES.primary} fill={`${CORES.primary}40`} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {/* Projeção */}
      <div style={{marginTop: 32}}>
        <ChartCard title="Projeção 12 Meses" subtitle="Crescimento de 5% ao mês" height={300}>
          <ResponsiveContainer>
            <ComposedChart data={Array.from({length: 12}, (_, i) => ({
              mes: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][i],
              atual: i === 0 ? resumo.receitaMensal : null,
              projecao: (resumo.receitaMensal || 0) * Math.pow(1.05, i)
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="mes" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={styles.tooltipStyle} formatter={(v) => v ? [`$${v.toFixed(2)}`, ''] : null} />
              <Area type="monotone" dataKey="projecao" stroke={CORES.purple} fill={`${CORES.purple}30`} name="Projeção" />
              <Bar dataKey="atual" fill={CORES.primary} name="Atual" radius={[4, 4, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

// ==========================================
// DASHBOARD PRINCIPAL
// ==========================================
export default function ElevenDashboard() {
  const [usuario, setUsuario] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [activeTab, setActiveTab] = useState('visao-geral');
  const [filtroVendedor, setFiltroVendedor] = useState('todos');

  useEffect(() => {
    const saved = localStorage.getItem('ef_usuario');
    if (saved) { try { setUsuario(JSON.parse(saved)); } catch (e) { localStorage.removeItem('ef_usuario'); } }
  }, []);

  const handleLogin = (email, senha) => {
    const user = USUARIOS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha);
    if (user) {
      setUsuario({ ...user, senha: undefined });
      localStorage.setItem('ef_usuario', JSON.stringify({ ...user, senha: undefined }));
      setLoginError('');
    } else { setLoginError('Email ou senha incorretos'); }
  };

  const handleLogout = () => { setUsuario(null); localStorage.removeItem('ef_usuario'); };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erro ao carregar');
      const result = await response.json();
      setRawData(result);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (usuario) { fetchData(); const interval = setInterval(fetchData, 180000); return () => clearInterval(interval); }
  }, [usuario]);

  const data = useDadosFiltrados(rawData, usuario || {}, filtroVendedor);

  if (!usuario) return <LoginScreen onLogin={handleLogin} error={loginError} />;

  const perm = PERMISSOES[usuario.nivel] || PERMISSOES.vendedor;

  const tabs = [
    { id: 'visao-geral', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'comercial', label: 'Comercial', icon: Briefcase, badge: data?.resumo?.cardsParados },
    { id: 'comissoes', label: 'Comissões', icon: DollarSign, badge: data?.comissoes?.filter(c => c.urgencia === 'atrasada').length },
    { id: 'operacional', label: 'Operacional', icon: Wrench },
    { id: 'equipe', label: 'Equipe', icon: Trophy, hidden: !perm.verEquipe },
    { id: 'financeiro', label: 'Financeiro', icon: PiggyBank, hidden: !perm.verFinanceiro },
  ].filter(t => !t.hidden);

  const vendedorOptions = [
    { value: 'todos', label: 'Todos' },
    ...(rawData?.vendedores || []).map(v => ({ value: v, label: NOMES_VENDEDORES[v] || v })),
  ];

  return (
    <div style={styles.dashboard}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}><span style={styles.logoText}>11</span></div>
          <div><h1 style={styles.headerTitle}>Eleven Fragrances</h1><p style={styles.headerSubtitle}>Dashboard v6</p></div>
        </div>
        <div style={styles.headerRight}>
          {perm.filtrarPorVendedor && <FilterDropdown label="Vendedor" value={filtroVendedor} options={vendedorOptions} onChange={setFiltroVendedor} />}
          <button onClick={fetchData} style={styles.refreshBtn}><RefreshCw size={16} style={{animation: loading ? 'spin 1s linear infinite' : 'none'}} /></button>
          <div style={styles.userInfo}>
            <span>{usuario.nome}</span>
            <span style={{...styles.nivelBadge, background: usuario.nivel === 'admin' ? '#ef444420' : usuario.nivel === 'gerente' ? '#f59e0b20' : '#3b82f620', color: usuario.nivel === 'admin' ? '#ef4444' : usuario.nivel === 'gerente' ? '#f59e0b' : '#3b82f6'}}>
              {usuario.nivel === 'admin' ? <Shield size={14} /> : usuario.nivel === 'gerente' ? <UserCheck size={14} /> : <User size={14} />}
              {usuario.nivel.charAt(0).toUpperCase() + usuario.nivel.slice(1)}
            </span>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}><LogOut size={16} /></button>
        </div>
      </header>

      {error && <div style={styles.errorBanner}>⚠️ {error}</div>}

      <nav style={styles.tabNav}>
        {tabs.map(tab => <TabButton key={tab.id} icon={tab.icon} label={tab.label} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} badge={tab.badge} />)}
      </nav>

      <main style={styles.main}>
        {activeTab === 'visao-geral' && <VisaoGeral data={data} loading={loading} perm={perm} usuario={usuario} />}
        {activeTab === 'comercial' && <Comercial data={data} loading={loading} perm={perm} />}
        {activeTab === 'comissoes' && <Comissoes data={data} loading={loading} perm={perm} usuario={usuario} />}
        {activeTab === 'operacional' && <Operacional data={data} loading={loading} />}
        {activeTab === 'equipe' && <Equipe data={data} loading={loading} perm={perm} />}
        {activeTab === 'financeiro' && <Financeiro data={data} loading={loading} perm={perm} />}
      </main>

      <footer style={styles.footer}>
        <p>© 2025 Eleven Fragrances LLC</p>
        <p>v6.0 • {lastUpdate?.toLocaleString('pt-BR') || '-'}</p>
      </footer>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus, select:focus { outline: none; border-color: #10b981 !important; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
      `}</style>
    </div>
  );
}

// ==========================================
// ESTILOS
// ==========================================
const styles = {
  dashboard: { minHeight: '100vh', background: '#0f172a', color: 'white' },
  header: { background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  headerRight: { display: 'flex', alignItems: 'center', gap: 16 },
  headerTitle: { fontSize: 18, fontWeight: 600 },
  headerSubtitle: { fontSize: 12, color: '#64748b' },
  logo: { width: 40, height: 40, background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  main: { maxWidth: 1400, margin: '0 auto', padding: 24 },
  footer: { background: '#1e293b', borderTop: '1px solid #334155', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: 12 },
  tabNav: { background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', gap: 4, overflowX: 'auto' },
  tabButton: { display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 14, fontWeight: 500, borderBottom: '2px solid transparent', transition: 'all 0.2s', whiteSpace: 'nowrap' },
  tabButtonActive: { color: '#10b981', borderBottomColor: '#10b981' },
  tabBadge: { background: '#ef4444', color: 'white', fontSize: 11, padding: '2px 6px', borderRadius: 10, fontWeight: 600 },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 },
  statCard: { background: '#1e293b', borderRadius: 12, padding: 20, border: '1px solid #334155' },
  statCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  statCardTitle: { color: '#94a3b8', fontSize: 13, marginBottom: 8 },
  statCardValue: { color: 'white', fontSize: 26, fontWeight: 700 },
  statCardSubtitle: { color: '#64748b', fontSize: 12, marginTop: 4 },
  statCardIcon: { padding: 12, borderRadius: 12 },
  chartGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 16 },
  chartCard: { background: '#1e293b', borderRadius: 12, padding: 20, border: '1px solid #334155' },
  chartCardHeader: { marginBottom: 16 },
  chartCardTitle: { fontSize: 16, fontWeight: 600 },
  chartCardSubtitle: { color: '#64748b', fontSize: 12, marginTop: 4 },
  tooltipStyle: { background: '#1e293b', border: '1px solid #334155', borderRadius: 8 },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #334155' },
  sectionHeaderLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  sectionTitle: { fontSize: 22, fontWeight: 600 },
  sectionSubtitle: { color: '#64748b', fontSize: 14 },
  subsectionTitle: { fontSize: 15, fontWeight: 600, marginBottom: 16, color: '#94a3b8' },
  filterDropdown: { position: 'relative' },
  filterLabel: { display: 'block', fontSize: 10, color: '#64748b', marginBottom: 2 },
  filterSelect: { appearance: 'none', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, padding: '6px 28px 6px 10px', color: 'white', fontSize: 13, cursor: 'pointer' },
  alertGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 },
  alertCard: { background: '#1e293b', borderRadius: 8, padding: 14, display: 'flex', alignItems: 'center', gap: 12, borderLeft: '3px solid' },
  alertContent: { flex: 1 },
  alertTitle: { fontWeight: 600, fontSize: 14 },
  alertMessage: { color: '#64748b', fontSize: 12, marginTop: 2 },
  alertCount: { padding: '4px 10px', borderRadius: 12, color: 'white', fontWeight: 600, fontSize: 12 },
  tableContainer: { background: '#1e293b', borderRadius: 8, border: '1px solid #334155', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '10px 14px', background: '#0f172a', color: '#94a3b8', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', position: 'sticky', top: 0 },
  tr: { borderBottom: '1px solid #334155' },
  td: { padding: '10px 14px', fontSize: 13 },
  badge: { padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500, display: 'inline-block' },
  emptyMessage: { color: '#64748b', textAlign: 'center', padding: 32 },
  skeleton: { height: 28, width: 80, background: '#334155', borderRadius: 4 },
  restrictedAccess: { textAlign: 'center', padding: 60, color: '#64748b' },
  errorBanner: { background: '#422006', padding: 8, textAlign: 'center', color: '#fef3c7', fontSize: 14 },
  refreshBtn: { background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 8 },
  userInfo: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 },
  nivelBadge: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 500 },
  logoutBtn: { background: '#ef4444', border: 'none', borderRadius: 6, padding: 8, color: 'white', cursor: 'pointer' },
  loginContainer: { minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  loginCard: { background: '#1e293b', borderRadius: 16, padding: 40, width: '100%', maxWidth: 400, border: '1px solid #334155' },
  loginHeader: { textAlign: 'center', marginBottom: 32 },
  loginLogo: { width: 60, height: 60, background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  loginTitle: { color: 'white', fontSize: 24, marginBottom: 8 },
  loginSubtitle: { color: '#94a3b8' },
  inputGroup: { marginBottom: 16, position: 'relative' },
  inputIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' },
  input: { width: '100%', padding: '12px 12px 12px 40px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: 'white', fontSize: 14 },
  toggleSenha: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' },
  loginError: { background: '#7f1d1d', color: '#fecaca', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14 },
  loginBtn: { width: '100%', padding: 12, background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: 8, color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer' },
};
