import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Package, FileText, DollarSign, Wrench, TrendingUp, TrendingDown, Clock, CheckCircle, AlertTriangle, RefreshCw, Users, Activity, LogOut, Lock, Eye, EyeOff, User, Shield, UserCheck, Zap, LayoutDashboard, Briefcase, PiggyBank, Settings, Filter, Calendar, ChevronDown, X, Bell, Target, ArrowRight, BarChart3, PieChartIcon } from 'lucide-react';

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
  admin: { verReceitaTotal: true, verComissoes: true, verTodasComissoes: true, verFunilCompleto: true, verTodosClientes: true, verAlertas: true, verFinanceiro: true },
  gerente: { verReceitaTotal: false, verComissoes: true, verTodasComissoes: true, verFunilCompleto: true, verTodosClientes: true, verAlertas: true, verFinanceiro: false },
  vendedor: { verReceitaTotal: false, verComissoes: true, verTodasComissoes: false, verFunilCompleto: false, verTodosClientes: false, verAlertas: true, verFinanceiro: false }
};

const CORES = {
  primary: '#10b981',
  secondary: '#3b82f6',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  cyan: '#06b6d4',
  pink: '#ec4899',
  equipamentos: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444']
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
            <button type="button" onClick={() => setShowSenha(!showSenha)} style={styles.toggleSenha}>
              {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
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
const StatCard = ({ title, value, subtitle, icon: Icon, color, trend, trendValue, loading, onClick }) => (
  <div style={{...styles.statCard, cursor: onClick ? 'pointer' : 'default'}} onClick={onClick}>
    <div style={styles.statCardHeader}>
      <div>
        <p style={styles.statCardTitle}>{title}</p>
        {loading ? <div style={styles.skeleton}></div> : <p style={styles.statCardValue}>{value}</p>}
        {subtitle && <p style={styles.statCardSubtitle}>{subtitle}</p>}
      </div>
      <div style={{...styles.statCardIcon, background: color}}><Icon size={24} color="white" /></div>
    </div>
    {trend && (
      <div style={styles.statCardTrend}>
        {trend === 'up' ? <TrendingUp size={16} color="#10b981" /> : <TrendingDown size={16} color="#ef4444" />}
        <span style={{color: trend === 'up' ? '#10b981' : '#ef4444', marginLeft: 4}}>{trendValue}</span>
        <span style={{color: '#64748b', marginLeft: 4}}>vs mês anterior</span>
      </div>
    )}
  </div>
);

const SectionHeader = ({ icon: Icon, title, subtitle, action }) => (
  <div style={styles.sectionHeader}>
    <div style={styles.sectionHeaderLeft}>
      <Icon size={24} color={CORES.primary} />
      <div>
        <h2 style={styles.sectionTitle}>{title}</h2>
        {subtitle && <p style={styles.sectionSubtitle}>{subtitle}</p>}
      </div>
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
    <ChevronDown size={16} style={styles.filterChevron} />
  </div>
);

const TabButton = ({ icon: Icon, label, active, onClick, badge }) => (
  <button onClick={onClick} style={{...styles.tabButton, ...(active ? styles.tabButtonActive : {})}}>
    <Icon size={20} />
    <span>{label}</span>
    {badge > 0 && <span style={styles.tabBadge}>{badge}</span>}
  </button>
);

const ChartCard = ({ title, subtitle, children, height = 300 }) => (
  <div style={styles.chartCard}>
    <div style={styles.chartCardHeader}>
      <h3 style={styles.chartCardTitle}>{title}</h3>
      {subtitle && <p style={styles.chartCardSubtitle}>{subtitle}</p>}
    </div>
    <div style={{height}}>{children}</div>
  </div>
);

const AlertCard = ({ type, title, message, count }) => {
  const colors = { danger: '#ef4444', warning: '#f59e0b', success: '#10b981', info: '#3b82f6' };
  const icons = { danger: AlertTriangle, warning: Clock, success: CheckCircle, info: Bell };
  const Icon = icons[type];
  return (
    <div style={{...styles.alertCard, borderLeftColor: colors[type]}}>
      <Icon size={20} color={colors[type]} />
      <div style={styles.alertContent}>
        <p style={styles.alertTitle}>{title}</p>
        <p style={styles.alertMessage}>{message}</p>
      </div>
      {count !== undefined && <span style={{...styles.alertCount, background: colors[type]}}>{count}</span>}
    </div>
  );
};

const DataTable = ({ columns, data, emptyMessage }) => (
  <div style={styles.tableContainer}>
    {data.length > 0 ? (
      <table style={styles.table}>
        <thead>
          <tr>{columns.map((col, i) => <th key={i} style={styles.th}>{col.header}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} style={styles.tr}>
              {columns.map((col, j) => <td key={j} style={styles.td}>{col.render ? col.render(row) : row[col.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p style={styles.emptyMessage}>{emptyMessage}</p>
    )}
  </div>
);

// ==========================================
// SEÇÕES DO DASHBOARD
// ==========================================

// VISÃO GERAL
const VisaoGeral = ({ data, loading, perm }) => {
  const alertas = [
    data?.resumo?.manutencoes7dias > 0 && { type: 'warning', title: 'Manutenções Próximas', message: `${data.resumo.manutencoes7dias} nos próximos 7 dias`, count: data.resumo.manutencoes7dias },
    data?.resumo?.cardsParados > 0 && { type: 'danger', title: 'Cards Parados', message: 'Leads sem movimento há +3 dias', count: data.resumo.cardsParados },
    data?.resumo?.comissoesPendentes > 0 && { type: 'info', title: 'Comissões Pendentes', message: `$${data.resumo.totalComissoesPendentes?.toFixed(2)} a pagar`, count: data.resumo.comissoesPendentes },
    data?.resumo?.contratosAtivos > 0 && { type: 'success', title: 'Contratos Ativos', message: 'Sistema operando normalmente', count: data.resumo.contratosAtivos },
  ].filter(Boolean);

  const equipData = data?.equipamentos ? [
    { name: 'Pirad', value: data.equipamentos.pirad, color: CORES.equipamentos[0] },
    { name: 'Square', value: data.equipamentos.square, color: CORES.equipamentos[1] },
    { name: 'Design', value: data.equipamentos.design, color: CORES.equipamentos[2] },
    { name: 'Tower', value: data.equipamentos.tower, color: CORES.equipamentos[3] },
    { name: 'Pro 2', value: data.equipamentos.pro2, color: CORES.equipamentos[4] },
  ].filter(d => d.value > 0) : [];

  const funnelData = data?.funil ? Object.entries(data.funil).map(([name, value]) => ({
    name: name.replace(/^[\d\s\-\.]+/, '').substring(0, 15),
    value
  })).filter(d => d.value > 0) : [];

  return (
    <div>
      <SectionHeader icon={LayoutDashboard} title="Visão Geral" subtitle="Resumo executivo de todas as operações" />
      
      {/* KPIs */}
      <div style={styles.kpiGrid}>
        <StatCard title="Contratos Ativos" value={data?.resumo?.contratosAtivos || 0} subtitle={`${data?.resumo?.contratosDraft || 0} em negociação`} icon={FileText} color={CORES.secondary} loading={loading} />
        <StatCard title="Equipamentos" value={data?.resumo?.equipamentosTotal || 0} subtitle="Em operação" icon={Package} color={CORES.primary} loading={loading} />
        {perm.verReceitaTotal && <StatCard title="Receita Mensal" value={`$${(data?.resumo?.receitaMensal || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}`} subtitle="MRR" icon={DollarSign} color={CORES.purple} loading={loading} />}
        <StatCard title="Pipeline" value={Object.values(data?.funil || {}).reduce((a,b) => a+b, 0)} subtitle="Leads no funil" icon={Target} color={CORES.cyan} loading={loading} />
      </div>

      {/* Alertas */}
      <div style={{marginTop: 24}}>
        <h3 style={styles.subsectionTitle}>🔔 Alertas e Notificações</h3>
        <div style={styles.alertGrid}>
          {alertas.map((alerta, i) => <AlertCard key={i} {...alerta} />)}
        </div>
      </div>

      {/* Gráficos Resumo */}
      <div style={styles.chartGrid}>
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

        {perm.verFunilCompleto && (
          <ChartCard title="Pipeline Comercial" subtitle="Leads por etapa do funil">
            <ResponsiveContainer>
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="name" type="category" width={100} stroke="#64748b" tick={{fontSize: 11}} />
                <Tooltip contentStyle={styles.tooltipStyle} />
                <Bar dataKey="value" fill={CORES.primary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </div>
    </div>
  );
};

// OPERACIONAL
const Operacional = ({ data, loading, filtros, setFiltros }) => {
  const equipData = data?.equipamentos ? [
    { name: 'Pirad', qtd: data.equipamentos.pirad, percent: ((data.equipamentos.pirad / data.equipamentos.total) * 100).toFixed(1) },
    { name: 'Square', qtd: data.equipamentos.square, percent: ((data.equipamentos.square / data.equipamentos.total) * 100).toFixed(1) },
    { name: 'Design', qtd: data.equipamentos.design, percent: ((data.equipamentos.design / data.equipamentos.total) * 100).toFixed(1) },
    { name: 'Tower', qtd: data.equipamentos.tower, percent: ((data.equipamentos.tower / data.equipamentos.total) * 100).toFixed(1) },
    { name: 'Pro 2', qtd: data.equipamentos.pro2, percent: ((data.equipamentos.pro2 / data.equipamentos.total) * 100).toFixed(1) },
  ] : [];

  const manutColumns = [
    { header: 'Cliente', key: 'clienteId' },
    { header: 'Data', key: 'dataProxima' },
    { header: 'Observação', key: 'obs', render: (row) => row.obs || '-' },
    { header: 'Status', key: 'status', render: (row) => (
      <span style={{...styles.badge, background: row.status === 'pending' ? '#f59e0b20' : '#10b98120', color: row.status === 'pending' ? '#f59e0b' : '#10b981'}}>
        {row.status === 'pending' ? 'Pendente' : row.status}
      </span>
    )}
  ];

  return (
    <div>
      <SectionHeader 
        icon={Wrench} 
        title="Operacional" 
        subtitle="Contratos, equipamentos e manutenções"
        action={
          <div style={styles.filterBar}>
            <FilterDropdown 
              label="Status" 
              value={filtros.statusContrato} 
              onChange={(v) => setFiltros({...filtros, statusContrato: v})}
              options={[{value: 'all', label: 'Todos'}, {value: 'active', label: 'Ativos'}, {value: 'draft', label: 'Draft'}]}
            />
          </div>
        }
      />

      {/* KPIs Operacionais */}
      <div style={styles.kpiGrid}>
        <StatCard title="Total Contratos" value={data?.resumo?.contratosTotal || 0} icon={FileText} color={CORES.secondary} loading={loading} />
        <StatCard title="Contratos Ativos" value={data?.resumo?.contratosAtivos || 0} icon={CheckCircle} color={CORES.primary} loading={loading} />
        <StatCard title="Em Negociação" value={data?.resumo?.contratosDraft || 0} icon={Clock} color={CORES.warning} loading={loading} />
        <StatCard title="Manutenções 7d" value={data?.resumo?.manutencoes7dias || 0} icon={Wrench} color={CORES.danger} loading={loading} />
      </div>

      {/* Equipamentos */}
      <div style={{marginTop: 32}}>
        <h3 style={styles.subsectionTitle}>📦 Frota de Equipamentos</h3>
        <div style={styles.chartGrid}>
          <ChartCard title="Distribuição por Modelo" height={280}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={equipData.filter(d => d.qtd > 0)} cx="50%" cy="50%" outerRadius={90} dataKey="qtd" label={({name, percent}) => `${name}: ${percent}%`}>
                  {equipData.map((_, i) => <Cell key={i} fill={CORES.equipamentos[i]} />)}
                </Pie>
                <Tooltip contentStyle={styles.tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Quantidade por Modelo" height={280}>
            <ResponsiveContainer>
              <BarChart data={equipData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={styles.tooltipStyle} />
                <Bar dataKey="qtd" fill={CORES.primary} radius={[4, 4, 0, 0]}>
                  {equipData.map((_, i) => <Cell key={i} fill={CORES.equipamentos[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* Manutenções */}
      <div style={{marginTop: 32}}>
        <h3 style={styles.subsectionTitle}>🔧 Próximas Manutenções</h3>
        <DataTable columns={manutColumns} data={data?.manutencoes || []} emptyMessage="Nenhuma manutenção programada para os próximos 7 dias" />
      </div>
    </div>
  );
};

// COMERCIAL
const Comercial = ({ data, loading, perm }) => {
  const funnelData = data?.funil ? Object.entries(data.funil).map(([name, value], i) => ({
    name: name.replace(/^[\d\s\-\.]+/, ''),
    value,
    fill: CORES.equipamentos[i % 5]
  })) : [];

  const atividadesColumns = [
    { header: 'Hora', render: (row) => new Date(row.data).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'}) },
    { header: 'Card', key: 'card', render: (row) => row.card || '-' },
    { header: 'Ação', render: (row) => {
      if (row.tipo === 'updateCard' && row.listaDe && row.listaPara) {
        return <span>{row.listaDe.substring(0,12)} → {row.listaPara.substring(0,12)}</span>;
      }
      return row.tipo;
    }},
    { header: 'Por', key: 'membro' }
  ];

  const cardsParadosColumns = [
    { header: 'Lead', key: 'nome' },
    { header: 'Lista', key: 'lista', render: (row) => row.lista?.substring(0, 20) },
    { header: 'Dias Parado', key: 'diasParado', render: (row) => (
      <span style={{...styles.badge, background: row.diasParado > 7 ? '#ef444420' : '#f59e0b20', color: row.diasParado > 7 ? '#ef4444' : '#f59e0b'}}>
        {row.diasParado} dias
      </span>
    )}
  ];

  if (!perm.verFunilCompleto) {
    return (
      <div style={styles.restrictedAccess}>
        <Lock size={48} color="#64748b" />
        <h3>Acesso Restrito</h3>
        <p>Você não tem permissão para visualizar esta seção.</p>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader icon={Briefcase} title="Comercial" subtitle="Pipeline de vendas e acompanhamento de leads" />

      {/* KPIs Comerciais */}
      <div style={styles.kpiGrid}>
        <StatCard title="Total no Pipeline" value={Object.values(data?.funil || {}).reduce((a,b) => a+b, 0)} icon={Target} color={CORES.secondary} loading={loading} />
        <StatCard title="Cards Parados" value={data?.resumo?.cardsParados || 0} subtitle="+3 dias sem movimento" icon={AlertTriangle} color={CORES.danger} loading={loading} />
        <StatCard title="Atividades Hoje" value={data?.atividadesRecentes?.filter(a => new Date(a.data).toDateString() === new Date().toDateString()).length || 0} icon={Activity} color={CORES.primary} loading={loading} />
        <StatCard title="Listas no Board" value={data?.listas?.length || 0} icon={BarChart3} color={CORES.purple} loading={loading} />
      </div>

      {/* Funil */}
      <div style={{marginTop: 32}}>
        <h3 style={styles.subsectionTitle}>📊 Funil de Vendas</h3>
        <ChartCard title="" height={350}>
          <ResponsiveContainer>
            <BarChart data={funnelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#64748b" angle={-45} textAnchor="end" height={100} tick={{fontSize: 11}} />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={styles.tooltipStyle} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {funnelData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Duas colunas: Atividades e Cards Parados */}
      <div style={{...styles.chartGrid, marginTop: 32}}>
        <div>
          <h3 style={styles.subsectionTitle}>⚡ Atividades Recentes</h3>
          <DataTable columns={atividadesColumns} data={(data?.atividadesRecentes || []).slice(0, 10)} emptyMessage="Nenhuma atividade recente" />
        </div>
        <div>
          <h3 style={styles.subsectionTitle}>⚠️ Cards Parados (+3 dias)</h3>
          <DataTable columns={cardsParadosColumns} data={(data?.cardsParados || []).slice(0, 10)} emptyMessage="Nenhum card parado" />
        </div>
      </div>
    </div>
  );
};

// FINANCEIRO
const Financeiro = ({ data, loading, perm }) => {
  const comissoesColumns = [
    { header: 'ID', key: 'id' },
    { header: 'Contrato', key: 'contratoId' },
    { header: 'Vendedor', key: 'vendedorId' },
    { header: 'Valor', render: (row) => `$${row.valor?.toFixed(2)}` },
    { header: 'Status', render: (row) => (
      <span style={{...styles.badge, background: '#f59e0b20', color: '#f59e0b'}}>Pendente</span>
    )}
  ];

  if (!perm.verFinanceiro) {
    return (
      <div style={styles.restrictedAccess}>
        <Lock size={48} color="#64748b" />
        <h3>Acesso Restrito</h3>
        <p>Você não tem permissão para visualizar esta seção.</p>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader icon={PiggyBank} title="Financeiro" subtitle="Receitas, comissões e indicadores financeiros" />

      {/* KPIs Financeiros */}
      <div style={styles.kpiGrid}>
        <StatCard title="Receita Mensal" value={`$${(data?.resumo?.receitaMensal || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}`} subtitle="MRR atual" icon={DollarSign} color={CORES.primary} loading={loading} />
        <StatCard title="Comissões Pendentes" value={`$${(data?.resumo?.totalComissoesPendentes || 0).toFixed(2)}`} subtitle={`${data?.resumo?.comissoesPendentes || 0} pendentes`} icon={Users} color={CORES.warning} loading={loading} />
        <StatCard title="Ticket Médio" value={`$${data?.resumo?.contratosAtivos > 0 ? ((data?.resumo?.receitaMensal || 0) / data.resumo.contratosAtivos).toFixed(2) : '0.00'}`} subtitle="Por contrato" icon={TrendingUp} color={CORES.purple} loading={loading} />
        <StatCard title="Receita Anual Proj." value={`$${((data?.resumo?.receitaMensal || 0) * 12).toLocaleString('en-US', {minimumFractionDigits: 2})}`} subtitle="ARR projetado" icon={Target} color={CORES.secondary} loading={loading} />
      </div>

      {/* Gráficos */}
      <div style={{...styles.chartGrid, marginTop: 32}}>
        <ChartCard title="Projeção de Receita (12 meses)" height={300}>
          <ResponsiveContainer>
            <AreaChart data={Array.from({length: 12}, (_, i) => ({
              mes: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'][i],
              valor: (data?.resumo?.receitaMensal || 0) * (1 + (i * 0.05))
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="mes" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={styles.tooltipStyle} formatter={(v) => [`$${v.toFixed(2)}`, 'Receita']} />
              <Area type="monotone" dataKey="valor" stroke={CORES.primary} fill={`${CORES.primary}40`} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Distribuição de Receita por Equipamento" height={300}>
          <ResponsiveContainer>
            <PieChart>
              <Pie 
                data={[
                  { name: 'Pirad ($62.99)', value: (data?.equipamentos?.pirad || 0) * 62.99 },
                  { name: 'Square ($124.99)', value: (data?.equipamentos?.square || 0) * 124.99 },
                  { name: 'Design ($249.99)', value: (data?.equipamentos?.design || 0) * 249.99 },
                  { name: 'Tower ($499.99)', value: (data?.equipamentos?.tower || 0) * 499.99 },
                  { name: 'Pro 2 ($1749.99)', value: (data?.equipamentos?.pro2 || 0) * 1749.99 },
                ].filter(d => d.value > 0)}
                cx="50%" cy="50%" outerRadius={100} dataKey="value"
              >
                {CORES.equipamentos.map((color, i) => <Cell key={i} fill={color} />)}
              </Pie>
              <Tooltip contentStyle={styles.tooltipStyle} formatter={(v) => [`$${v.toFixed(2)}`, '']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Tabela de Comissões */}
      <div style={{marginTop: 32}}>
        <h3 style={styles.subsectionTitle}>💰 Comissões Pendentes</h3>
        <DataTable columns={comissoesColumns} data={data?.comissoes || []} emptyMessage="Nenhuma comissão pendente" />
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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [activeTab, setActiveTab] = useState('visao-geral');
  const [filtros, setFiltros] = useState({ periodo: '30d', statusContrato: 'all', vendedor: 'all' });

  useEffect(() => {
    const saved = localStorage.getItem('ef_usuario');
    if (saved) { try { setUsuario(JSON.parse(saved)); } catch (e) { localStorage.removeItem('ef_usuario'); } }
  }, []);

  const handleLogin = (email, senha) => {
    const user = USUARIOS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha);
    if (user) {
      const userSession = { ...user, senha: undefined };
      setUsuario(userSession);
      localStorage.setItem('ef_usuario', JSON.stringify(userSession));
      setLoginError('');
    } else { setLoginError('Email ou senha incorretos'); }
  };

  const handleLogout = () => { setUsuario(null); localStorage.removeItem('ef_usuario'); };

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
      setData({ resumo: {}, equipamentos: {}, funil: {}, cardsParados: [], atividadesRecentes: [], manutencoes: [], comissoes: [], listas: [] });
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (usuario) { fetchData(); const interval = setInterval(fetchData, 180000); return () => clearInterval(interval); }
  }, [usuario]);

  if (!usuario) return <LoginScreen onLogin={handleLogin} error={loginError} />;

  const perm = PERMISSOES[usuario.nivel] || PERMISSOES.vendedor;

  const tabs = [
    { id: 'visao-geral', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'operacional', label: 'Operacional', icon: Wrench, badge: data?.resumo?.manutencoes7dias },
    { id: 'comercial', label: 'Comercial', icon: Briefcase, badge: data?.resumo?.cardsParados, hidden: !perm.verFunilCompleto },
    { id: 'financeiro', label: 'Financeiro', icon: PiggyBank, hidden: !perm.verFinanceiro },
  ].filter(t => !t.hidden);

  return (
    <div style={styles.dashboard}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logo}><span style={styles.logoText}>11</span></div>
          <div>
            <h1 style={styles.headerTitle}>Eleven Fragrances</h1>
            <p style={styles.headerSubtitle}>Operations Dashboard</p>
          </div>
        </div>
        <div style={styles.headerRight}>
          <button onClick={fetchData} style={styles.refreshBtn}>
            <RefreshCw size={16} style={{animation: loading ? 'spin 1s linear infinite' : 'none'}} />
            {lastUpdate && <span style={styles.lastUpdate}>{lastUpdate.toLocaleTimeString('pt-BR')}</span>}
          </button>
          <div style={styles.userInfo}>
            <span>Olá, {usuario.nome}</span>
            <span style={{...styles.nivelBadge, background: usuario.nivel === 'admin' ? '#ef444420' : usuario.nivel === 'gerente' ? '#f59e0b20' : '#3b82f620', color: usuario.nivel === 'admin' ? '#ef4444' : usuario.nivel === 'gerente' ? '#f59e0b' : '#3b82f6'}}>
              {usuario.nivel === 'admin' ? <Shield size={14} /> : usuario.nivel === 'gerente' ? <UserCheck size={14} /> : <User size={14} />}
              {usuario.nivel.charAt(0).toUpperCase() + usuario.nivel.slice(1)}
            </span>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}><LogOut size={16} /> Sair</button>
        </div>
      </header>

      {error && <div style={styles.errorBanner}>⚠️ Usando dados de demonstração. Erro: {error}</div>}

      {/* Tabs */}
      <nav style={styles.tabNav}>
        {tabs.map(tab => (
          <TabButton key={tab.id} icon={tab.icon} label={tab.label} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} badge={tab.badge} />
        ))}
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        {activeTab === 'visao-geral' && <VisaoGeral data={data} loading={loading} perm={perm} />}
        {activeTab === 'operacional' && <Operacional data={data} loading={loading} filtros={filtros} setFiltros={setFiltros} />}
        {activeTab === 'comercial' && <Comercial data={data} loading={loading} perm={perm} />}
        {activeTab === 'financeiro' && <Financeiro data={data} loading={loading} perm={perm} />}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2025 Eleven Fragrances LLC</p>
        <p>Dashboard v4.0 • Atualização: {lastUpdate?.toLocaleString('pt-BR') || '-'}</p>
      </footer>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        input:focus, select:focus { outline: none; border-color: #10b981 !important; }
        button:disabled { opacity: 0.6; cursor: not-allowed; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </div>
  );
}

// ==========================================
// ESTILOS
// ==========================================
const styles = {
  // Layout
  dashboard: { minHeight: '100vh', background: '#0f172a', color: 'white' },
  header: { background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  headerRight: { display: 'flex', alignItems: 'center', gap: 16 },
  headerTitle: { fontSize: 18, fontWeight: 600 },
  headerSubtitle: { fontSize: 12, color: '#64748b' },
  logo: { width: 40, height: 40, background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  main: { maxWidth: 1400, margin: '0 auto', padding: 24 },
  footer: { background: '#1e293b', borderTop: '1px solid #334155', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: 12, marginTop: 24 },

  // Tabs
  tabNav: { background: '#1e293b', borderBottom: '1px solid #334155', padding: '0 24px', display: 'flex', gap: 4 },
  tabButton: { display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 14, fontWeight: 500, borderBottom: '2px solid transparent', transition: 'all 0.2s' },
  tabButtonActive: { color: '#10b981', borderBottomColor: '#10b981' },
  tabBadge: { background: '#ef4444', color: 'white', fontSize: 11, padding: '2px 6px', borderRadius: 10, fontWeight: 600 },

  // KPIs
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 },
  statCard: { background: '#1e293b', borderRadius: 12, padding: 20, border: '1px solid #334155', transition: 'all 0.2s' },
  statCardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  statCardTitle: { color: '#94a3b8', fontSize: 14, marginBottom: 8 },
  statCardValue: { color: 'white', fontSize: 28, fontWeight: 700 },
  statCardSubtitle: { color: '#64748b', fontSize: 12, marginTop: 4 },
  statCardIcon: { padding: 12, borderRadius: 12 },
  statCardTrend: { display: 'flex', alignItems: 'center', marginTop: 12, fontSize: 12 },

  // Charts
  chartGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 16 },
  chartCard: { background: '#1e293b', borderRadius: 12, padding: 20, border: '1px solid #334155' },
  chartCardHeader: { marginBottom: 16 },
  chartCardTitle: { fontSize: 16, fontWeight: 600 },
  chartCardSubtitle: { color: '#64748b', fontSize: 12, marginTop: 4 },
  tooltipStyle: { background: '#1e293b', border: '1px solid #334155', borderRadius: 8 },

  // Sections
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #334155' },
  sectionHeaderLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  sectionTitle: { fontSize: 24, fontWeight: 600 },
  sectionSubtitle: { color: '#64748b', fontSize: 14 },
  subsectionTitle: { fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#94a3b8' },

  // Filters
  filterBar: { display: 'flex', gap: 12 },
  filterDropdown: { position: 'relative' },
  filterLabel: { display: 'block', fontSize: 11, color: '#64748b', marginBottom: 4 },
  filterSelect: { appearance: 'none', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, padding: '8px 32px 8px 12px', color: 'white', fontSize: 13, cursor: 'pointer', minWidth: 120 },
  filterChevron: { position: 'absolute', right: 10, bottom: 10, color: '#64748b', pointerEvents: 'none' },

  // Alerts
  alertGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 },
  alertCard: { background: '#1e293b', borderRadius: 8, padding: 16, display: 'flex', alignItems: 'center', gap: 12, borderLeft: '3px solid' },
  alertContent: { flex: 1 },
  alertTitle: { fontWeight: 600, fontSize: 14 },
  alertMessage: { color: '#64748b', fontSize: 12, marginTop: 2 },
  alertCount: { padding: '4px 10px', borderRadius: 12, color: 'white', fontWeight: 600, fontSize: 12 },

  // Tables
  tableContainer: { background: '#1e293b', borderRadius: 8, border: '1px solid #334155', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px 16px', background: '#0f172a', color: '#94a3b8', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #334155' },
  td: { padding: '12px 16px', fontSize: 14 },
  badge: { padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 500 },
  emptyMessage: { color: '#64748b', textAlign: 'center', padding: 32 },

  // Misc
  skeleton: { height: 32, width: 80, background: '#334155', borderRadius: 4, animation: 'pulse 2s infinite' },
  restrictedAccess: { textAlign: 'center', padding: 60, color: '#64748b' },
  errorBanner: { background: '#422006', borderBottom: '1px solid #713f12', padding: 8, textAlign: 'center', color: '#fef3c7', fontSize: 14 },
  refreshBtn: { display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 14 },
  lastUpdate: { fontSize: 12, color: '#64748b' },
  userInfo: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 },
  nivelBadge: { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 500 },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: 6, background: '#ef4444', border: 'none', borderRadius: 6, padding: '8px 12px', color: 'white', cursor: 'pointer', fontSize: 14 },

  // Login
  loginContainer: { minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  loginCard: { background: '#1e293b', borderRadius: 16, padding: 40, width: '100%', maxWidth: 400, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' },
  loginHeader: { textAlign: 'center', marginBottom: 32 },
  loginLogo: { width: 60, height: 60, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  loginTitle: { color: 'white', fontSize: 24, marginBottom: 8 },
  loginSubtitle: { color: '#94a3b8' },
  inputGroup: { marginBottom: 16, position: 'relative' },
  inputIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' },
  input: { width: '100%', padding: '12px 12px 12px 40px', background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: 'white', fontSize: 14 },
  toggleSenha: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' },
  loginError: { background: '#7f1d1d', color: '#fecaca', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 14 },
  loginBtn: { width: '100%', padding: 12, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', borderRadius: 8, color: 'white', fontSize: 16, fontWeight: 600, cursor: 'pointer' },
};
