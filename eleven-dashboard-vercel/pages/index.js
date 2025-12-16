import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Package, FileText, DollarSign, Users, TrendingUp, Clock, CheckCircle, AlertTriangle, MapPin, X, Eye, Filter, RefreshCw, Wrench, Calendar, CreditCard, Truck } from 'lucide-react';

const API_URL = 'https://n8n.srv1199443.hstgr.cloud/webhook/eleven-dashboard';

const equipamentosCores = {
  pirad: '#3B82F6',
  square: '#10B981',
  design: '#F59E0B',
  tower: '#8B5CF6',
  pro2: '#EF4444',
};

const StatusBadge = ({ status }) => {
  const styles = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    scheduled: 'bg-blue-100 text-blue-800',
    deployed: 'bg-emerald-100 text-emerald-800',
    paid: 'bg-green-100 text-green-800',
    completed: 'bg-green-100 text-green-800',
  };
  const labels = {
    active: 'Ativo',
    draft: 'Rascunho',
    pending: 'Pendente',
    scheduled: 'Agendado',
    deployed: 'Instalado',
    paid: 'Pago',
    completed: 'Concluído',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {labels[status] || status}
    </span>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subtitle, icon: Icon, color, onClick, loading, alert }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-xl shadow-sm border ${alert ? 'border-red-200 bg-red-50' : 'border-gray-100'} p-5 hover:shadow-md transition-all ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {loading ? (
          <div className="h-8 w-20 bg-gray-200 animate-pulse rounded mt-1"></div>
        ) : (
          <p className={`text-2xl font-bold mt-1 ${alert ? 'text-red-600' : 'text-gray-900'}`}>{value}</p>
        )}
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
    {onClick && <p className="text-xs text-blue-500 mt-2">Ver detalhes →</p>}
  </div>
);

const SectionCard = ({ title, icon: Icon, iconColor, count, children }) => (
  <div className="bg-white rounded-xl shadow-sm border">
    <div className="p-4 border-b flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <h3 className="font-semibold">{title}</h3>
      </div>
      {count !== undefined && (
        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">{count}</span>
      )}
    </div>
    {children}
  </div>
);

export default function ElevenDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [modalData, setModalData] = useState({ isOpen: false, title: '', content: null });
  const [filtroStatus, setFiltroStatus] = useState('todos');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erro ao carregar dados');
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval);
  }, []);

  const openModal = (title, content) => setModalData({ isOpen: true, title, content });
  const closeModal = () => setModalData({ isOpen: false, title: '', content: null });

  const resumo = data?.resumo || {};
  const equipamentos = data?.equipamentos || {};
  const contratos = data?.contratos || [];
  const clientes = data?.clientes || [];
  const instalacoes = data?.instalacoes || [];
  const manutencoes = data?.manutencoes || [];
  const comissoes = data?.comissoes || [];
  const pagamentos = data?.pagamentos || [];

  const pieData = Object.entries(equipamentos)
    .filter(([key, value]) => key !== 'total' && value > 0)
    .map(([key, value]) => ({ name: key.charAt(0).toUpperCase() + key.slice(1), value, color: equipamentosCores[key] }));

  const contratosFiltrados = filtroStatus === 'todos' 
    ? contratos 
    : contratos.filter(c => c.status === filtroStatus);

  const comissoesPendentes = comissoes.filter(c => c.status === 'pending');
  const instalacoesPendentes = instalacoes.filter(i => i.status === 'pending');
  const manutencoesAgendadas = manutencoes.filter(m => m.status === 'scheduled');

  return (
    <>
      <Head>
        <title>Dashboard | Eleven Fragrances</title>
        <meta name="description" content="Dashboard de Operações - Eleven Fragrances" />
      </Head>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">11</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Eleven Fragrances</h1>
                  <p className="text-xs text-gray-500">Dashboard Completa • Tempo Real</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={fetchData}
                  disabled={loading}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Atualizar</span>
                </button>
                {data?.atualizadoEm && (
                  <span className="text-xs text-gray-400 hidden md:inline">
                    {new Date(data.atualizadoEm).toLocaleString('pt-BR')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="bg-red-50 border-b border-red-100 px-4 py-3">
            <p className="text-sm text-red-800 text-center">⚠️ {error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white border-b overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex space-x-4">
              {[
                { id: 'overview', label: '📊 Visão Geral' },
                { id: 'contratos', label: '📄 Contratos' },
                { id: 'clientes', label: '👥 Clientes' },
                { id: 'operacoes', label: '🔧 Operações' },
                { id: 'financeiro', label: '💰 Financeiro' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium transition-colors whitespace-nowrap text-sm ${
                    activeTab === tab.id ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* ========== VISÃO GERAL ========== */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Row 1 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard
                  title="Contratos Ativos"
                  value={resumo.contratosAtivos || 0}
                  subtitle={`${resumo.contratosDraft || 0} em rascunho`}
                  icon={FileText}
                  color="bg-blue-500"
                  onClick={() => setActiveTab('contratos')}
                  loading={loading}
                />
                <StatCard
                  title="Receita Mensal"
                  value={`$${(resumo.receitaMensal || 0).toFixed(2)}`}
                  subtitle="Contratos ativos"
                  icon={DollarSign}
                  color="bg-green-500"
                  loading={loading}
                />
                <StatCard
                  title="Equipamentos"
                  value={resumo.equipamentosTotal || 0}
                  subtitle={`${resumo.equipamentosInstalados || 0} instalados`}
                  icon={Package}
                  color="bg-purple-500"
                  loading={loading}
                />
                <StatCard
                  title="Clientes"
                  value={resumo.clientesTotal || 0}
                  subtitle="Cadastrados"
                  icon={Users}
                  color="bg-orange-500"
                  onClick={() => setActiveTab('clientes')}
                  loading={loading}
                />
              </div>

              {/* Stats Row 2 - Alertas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard
                  title="Instalações Pendentes"
                  value={resumo.instalacoesPendentes || 0}
                  subtitle="Aguardando"
                  icon={Truck}
                  color="bg-yellow-500"
                  onClick={() => setActiveTab('operacoes')}
                  loading={loading}
                  alert={(resumo.instalacoesPendentes || 0) > 0}
                />
                <StatCard
                  title="Manutenções"
                  value={resumo.manutencoesAgendadas || 0}
                  subtitle="Agendadas"
                  icon={Wrench}
                  color="bg-cyan-500"
                  onClick={() => setActiveTab('operacoes')}
                  loading={loading}
                />
                <StatCard
                  title="Comissões Pendentes"
                  value={`$${(resumo.totalComissoesPendentes || 0).toFixed(2)}`}
                  subtitle={`${resumo.comissoesPendentes || 0} a pagar`}
                  icon={TrendingUp}
                  color="bg-red-500"
                  onClick={() => setActiveTab('financeiro')}
                  loading={loading}
                  alert={(resumo.comissoesPendentes || 0) > 0}
                />
                <StatCard
                  title="Total Recebido"
                  value={`$${(resumo.totalRecebido || 0).toFixed(2)}`}
                  subtitle={`${resumo.pagamentosRecebidos || 0} pagamentos`}
                  icon={CreditCard}
                  color="bg-emerald-500"
                  onClick={() => setActiveTab('financeiro')}
                  loading={loading}
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Equipamentos Pie */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="font-semibold mb-4">Equipamentos por Tipo</h3>
                  {pieData.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                            {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex flex-wrap justify-center gap-3 mt-2">
                        {pieData.map(e => (
                          <div key={e.name} className="flex items-center space-x-1">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: e.color }} />
                            <span className="text-sm">{e.name} ({e.value})</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Nenhum equipamento</p>
                  )}
                </div>

                {/* Resumo Contratos */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="font-semibold mb-4">Resumo de Contratos</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span>Ativos</span>
                      </div>
                      <span className="font-bold text-green-600">{resumo.contratosAtivos || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-gray-600" />
                        <span>Rascunho</span>
                      </div>
                      <span className="font-bold text-gray-600">{resumo.contratosDraft || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <span>Pendentes</span>
                      </div>
                      <span className="font-bold text-yellow-600">{resumo.contratosPending || 0}</span>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total</span>
                        <span className="font-bold text-lg">{resumo.contratosTotal || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Próximas Ações */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Instalações Pendentes */}
                <SectionCard title="Instalações Pendentes" icon={Truck} iconColor="text-yellow-500" count={instalacoesPendentes.length}>
                  <div className="divide-y max-h-64 overflow-auto">
                    {instalacoesPendentes.length > 0 ? instalacoesPendentes.map(i => (
                      <div key={i.id} className="p-3 hover:bg-gray-50">
                        <p className="font-medium text-sm">{i.clienteNome}</p>
                        <p className="text-xs text-gray-500">{i.id}</p>
                      </div>
                    )) : (
                      <p className="p-4 text-sm text-gray-500 text-center">Nenhuma instalação pendente</p>
                    )}
                  </div>
                </SectionCard>

                {/* Manutenções */}
                <SectionCard title="Próximas Manutenções" icon={Wrench} iconColor="text-cyan-500" count={manutencoesAgendadas.length}>
                  <div className="divide-y max-h-64 overflow-auto">
                    {manutencoesAgendadas.length > 0 ? manutencoesAgendadas.map(m => (
                      <div key={m.id} className="p-3 hover:bg-gray-50">
                        <p className="font-medium text-sm">{m.clienteNome}</p>
                        <p className="text-xs text-gray-500">📅 {m.dataProxima}</p>
                      </div>
                    )) : (
                      <p className="p-4 text-sm text-gray-500 text-center">Nenhuma manutenção agendada</p>
                    )}
                  </div>
                </SectionCard>

                {/* Comissões */}
                <SectionCard title="Comissões a Pagar" icon={TrendingUp} iconColor="text-red-500" count={comissoesPendentes.length}>
                  <div className="divide-y max-h-64 overflow-auto">
                    {comissoesPendentes.length > 0 ? comissoesPendentes.map(c => (
                      <div key={c.id} className="p-3 hover:bg-gray-50 flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">{c.clienteNome}</p>
                          <p className="text-xs text-gray-500">Vence: {c.dataPagamento}</p>
                        </div>
                        <span className="font-bold text-green-600">${c.valorComissao?.toFixed(2)}</span>
                      </div>
                    )) : (
                      <p className="p-4 text-sm text-gray-500 text-center">Nenhuma comissão pendente</p>
                    )}
                  </div>
                </SectionCard>
              </div>
            </>
          )}

          {/* ========== CONTRATOS ========== */}
          {activeTab === 'contratos' && (
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 border-b flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold">Contratos ({contratos.length})</h3>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select 
                    value={filtroStatus} 
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    className="text-sm border rounded-lg px-3 py-1.5"
                  >
                    <option value="todos">Todos</option>
                    <option value="active">Ativos</option>
                    <option value="draft">Rascunho</option>
                    <option value="pending">Pendente</option>
                  </select>
                </div>
              </div>
              <div className="divide-y">
                {contratosFiltrados.length > 0 ? contratosFiltrados.map(contrato => {
                  const totalEquip = (contrato.qtdPirad || 0) + (contrato.qtdSquare || 0) + (contrato.qtdDesign || 0) + (contrato.qtdTower || 0) + (contrato.qtdPro2 || 0);
                  return (
                    <div key={contrato.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                            {(contrato.clienteNome || '?').charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{contrato.clienteNome}</p>
                            <p className="text-sm text-gray-500">{contrato.id} • {totalEquip} equip.</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">${(contrato.valorMensal || 0).toFixed(2)}/mês</p>
                          <StatusBadge status={contrato.status} />
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {contrato.qtdPirad > 0 && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Pirad x{contrato.qtdPirad}</span>}
                        {contrato.qtdSquare > 0 && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Square x{contrato.qtdSquare}</span>}
                        {contrato.qtdDesign > 0 && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Design x{contrato.qtdDesign}</span>}
                        {contrato.qtdTower > 0 && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Tower x{contrato.qtdTower}</span>}
                        {contrato.qtdPro2 > 0 && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Pro 2 x{contrato.qtdPro2}</span>}
                      </div>
                      {contrato.dataInicio && (
                        <p className="text-xs text-gray-400 mt-2">📅 {contrato.dataInicio} → {contrato.dataFim} ({contrato.prazoMeses} meses)</p>
                      )}
                    </div>
                  );
                }) : (
                  <p className="p-8 text-center text-gray-500">Nenhum contrato encontrado</p>
                )}
              </div>
            </div>
          )}

          {/* ========== CLIENTES ========== */}
          {activeTab === 'clientes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientes.length > 0 ? clientes.map((cliente, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {(cliente.nome || '?').charAt(0)}
                    </div>
                    <StatusBadge status={cliente.status || 'active'} />
                  </div>
                  <h4 className="font-semibold text-gray-900">{cliente.nome}</h4>
                  <p className="text-sm text-gray-500 mb-3">{cliente.contato || 'Sem contato'}</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    {cliente.endereco && (
                      <p className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{cliente.endereco}, {cliente.cidade}</span>
                      </p>
                    )}
                    {cliente.phone && <p>📞 {cliente.phone}</p>}
                    {cliente.email && <p className="truncate">✉️ {cliente.email}</p>}
                  </div>
                </div>
              )) : (
                <p className="col-span-full p-8 text-center text-gray-500">Nenhum cliente</p>
              )}
            </div>
          )}

          {/* ========== OPERAÇÕES ========== */}
          {activeTab === 'operacoes' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Instalações */}
              <SectionCard title="Instalações" icon={Truck} iconColor="text-yellow-500" count={instalacoes.length}>
                <div className="divide-y max-h-96 overflow-auto">
                  {instalacoes.length > 0 ? instalacoes.map(i => (
                    <div key={i.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{i.clienteNome}</p>
                          <p className="text-sm text-gray-500">{i.id}</p>
                          {i.dataAgendada && <p className="text-xs text-gray-400 mt-1">📅 {i.dataAgendada}</p>}
                          {i.tecnico && <p className="text-xs text-gray-400">👷 {i.tecnico}</p>}
                        </div>
                        <StatusBadge status={i.status} />
                      </div>
                    </div>
                  )) : (
                    <p className="p-4 text-center text-gray-500">Nenhuma instalação</p>
                  )}
                </div>
              </SectionCard>

              {/* Manutenções */}
              <SectionCard title="Manutenções" icon={Wrench} iconColor="text-cyan-500" count={manutencoes.length}>
                <div className="divide-y max-h-96 overflow-auto">
                  {manutencoes.length > 0 ? manutencoes.map(m => (
                    <div key={m.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{m.clienteNome}</p>
                          <p className="text-sm text-gray-500">{m.id}</p>
                          <p className="text-xs text-gray-400 mt-1">📅 Próxima: {m.dataProxima}</p>
                          {m.tecnico && <p className="text-xs text-gray-400">👷 {m.tecnico}</p>}
                        </div>
                        <StatusBadge status={m.status} />
                      </div>
                    </div>
                  )) : (
                    <p className="p-4 text-center text-gray-500">Nenhuma manutenção</p>
                  )}
                </div>
              </SectionCard>
            </div>
          )}

          {/* ========== FINANCEIRO ========== */}
          {activeTab === 'financeiro' && (
            <div className="space-y-6">
              {/* Resumo Financeiro */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
                  <p className="text-sm text-gray-500">Receita Mensal</p>
                  <p className="text-3xl font-bold text-green-600">${(resumo.receitaMensal || 0).toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
                  <p className="text-sm text-gray-500">Total Recebido</p>
                  <p className="text-3xl font-bold text-blue-600">${(resumo.totalRecebido || 0).toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
                  <p className="text-sm text-gray-500">Comissões Pendentes</p>
                  <p className="text-3xl font-bold text-red-600">${(resumo.totalComissoesPendentes || 0).toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Comissões */}
                <SectionCard title="Comissões" icon={TrendingUp} iconColor="text-red-500" count={comissoes.length}>
                  <div className="divide-y max-h-96 overflow-auto">
                    {comissoes.length > 0 ? comissoes.map(c => (
                      <div key={c.id} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{c.clienteNome}</p>
                            <p className="text-sm text-gray-500">{c.id} • {c.tipo}</p>
                            <p className="text-xs text-gray-400 mt-1">📅 Vence: {c.dataPagamento}</p>
                            <p className="text-xs text-gray-400">Ref: {c.mesReferencia} • {c.percentual}% de ${c.valorBase?.toFixed(2)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">${c.valorComissao?.toFixed(2)}</p>
                            <StatusBadge status={c.status} />
                          </div>
                        </div>
                      </div>
                    )) : (
                      <p className="p-4 text-center text-gray-500">Nenhuma comissão</p>
                    )}
                  </div>
                </SectionCard>

                {/* Pagamentos */}
                <SectionCard title="Pagamentos Recebidos" icon={CreditCard} iconColor="text-emerald-500" count={pagamentos.length}>
                  <div className="divide-y max-h-96 overflow-auto">
                    {pagamentos.length > 0 ? pagamentos.map((p, i) => (
                      <div key={i} className="p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{p.clienteNome}</p>
                            <p className="text-sm text-gray-500">{p.contratoId}</p>
                            <p className="text-xs text-gray-400 mt-1">📅 {p.data}</p>
                            <p className="text-xs text-gray-400">💳 {p.metodo}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">${p.valor?.toFixed(2)}</p>
                            <StatusBadge status={p.status} />
                          </div>
                        </div>
                      </div>
                    )) : (
                      <p className="p-4 text-center text-gray-500">Nenhum pagamento</p>
                    )}
                  </div>
                </SectionCard>
              </div>
            </div>
          )}
        </main>

        <Modal isOpen={modalData.isOpen} onClose={closeModal} title={modalData.title}>
          {modalData.content}
        </Modal>

        <footer className="bg-white border-t mt-8">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between text-sm text-gray-500">
            <span>© 2025 Eleven Fragrances LLC</span>
            <span>Dashboard v4.0 • Completa</span>
          </div>
        </footer>
      </div>
    </>
  );
}
