import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Package, FileText, DollarSign, Users, TrendingUp, Clock, CheckCircle, AlertTriangle, MapPin, X, Eye, Filter, RefreshCw } from 'lucide-react';

// URL da API do n8n
const API_URL = 'https://n8n.srv1199443.hstgr.cloud/webhook/eleven-dashboard';

const equipamentosPie = [
  { name: 'Pirad', key: 'pirad', color: '#3B82F6' },
  { name: 'Square', key: 'square', color: '#10B981' },
  { name: 'Design', key: 'design', color: '#F59E0B' },
  { name: 'Tower', key: 'tower', color: '#8B5CF6' },
  { name: 'Pro 2', key: 'pro2', color: '#EF4444' },
];

const StatusBadge = ({ status }) => {
  const styles = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    scheduled: 'bg-blue-100 text-blue-800',
    deployed: 'bg-emerald-100 text-emerald-800',
  };
  const labels = {
    active: 'Ativo',
    draft: 'Rascunho',
    pending: 'Pendente',
    scheduled: 'Agendado',
    deployed: 'Instalado',
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
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

const StatCard = ({ title, value, subtitle, icon: Icon, color, onClick, loading }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {loading ? (
          <div className="h-9 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
        ) : (
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        )}
        {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-4 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    {onClick && <p className="text-xs text-blue-500 mt-3">Clique para ver detalhes →</p>}
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
    // Atualiza a cada 2 minutos
    const interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval);
  }, []);

  const openModal = (title, content) => setModalData({ isOpen: true, title, content });
  const closeModal = () => setModalData({ isOpen: false, title: '', content: null });

  // Dados processados
  const resumo = data?.resumo || {};
  const equipamentos = data?.equipamentos || {};
  const contratos = data?.contratos || [];
  
  // Remove clientes duplicados
  const clientesUnicos = data?.clientes?.filter((cliente, index, self) =>
    index === self.findIndex((c) => c.nome === cliente.nome)
  ) || [];

  const pieData = equipamentosPie.map(e => ({ ...e, value: equipamentos[e.key] || 0 })).filter(e => e.value > 0);

  // Filtrar contratos
  const contratosFiltrados = filtroStatus === 'todos' 
    ? contratos 
    : contratos.filter(c => c.status === filtroStatus);

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
                  <p className="text-xs text-gray-500">Dashboard • Atualização automática</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={fetchData}
                  disabled={loading}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Atualizar</span>
                </button>
                {data?.atualizadoEm && (
                  <span className="text-xs text-gray-400 hidden sm:inline">
                    {new Date(data.atualizadoEm).toLocaleString('pt-BR')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border-b border-red-100 px-4 py-3">
            <p className="text-sm text-red-800 text-center">⚠️ Erro: {error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex space-x-6">
              {[
                { id: 'overview', label: '📊 Visão Geral' },
                { id: 'contratos', label: '📄 Contratos' },
                { id: 'clientes', label: '👥 Clientes' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 border-b-2 font-medium transition-colors ${
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
          {/* VISÃO GERAL */}
          {activeTab === 'overview' && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                  title="Equipamentos"
                  value={resumo.equipamentosTotal || 0}
                  subtitle="Em contratos"
                  icon={Package}
                  color="bg-emerald-500"
                  onClick={() => openModal('Equipamentos por Tipo', (
                    <div className="space-y-3">
                      {equipamentosPie.map(e => (
                        <div key={e.key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: e.color }} />
                            <span>{e.name}</span>
                          </div>
                          <span className="font-bold">{equipamentos[e.key] || 0}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                  loading={loading}
                />
                <StatCard
                  title="Receita Mensal"
                  value={`$${(resumo.receitaMensal || 0).toFixed(2)}`}
                  subtitle="Contratos ativos"
                  icon={DollarSign}
                  color="bg-purple-500"
                  loading={loading}
                />
                <StatCard
                  title="Clientes"
                  value={clientesUnicos.length}
                  subtitle="Cadastrados"
                  icon={Users}
                  color="bg-orange-500"
                  onClick={() => setActiveTab('clientes')}
                  loading={loading}
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="font-semibold mb-4">Equipamentos por Tipo</h3>
                  {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                          {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Nenhum equipamento</p>
                  )}
                  <div className="flex flex-wrap justify-center gap-3 mt-4">
                    {pieData.map(e => (
                      <div key={e.key} className="flex items-center space-x-1">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: e.color }} />
                        <span className="text-sm">{e.name} ({e.value})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="font-semibold mb-4">Resumo de Contratos</h3>
                  <div className="space-y-4">
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
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total de Contratos</span>
                        <span className="font-bold text-lg">{resumo.contratosTotal || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* CONTRATOS */}
          {activeTab === 'contratos' && (
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold">Contratos ({contratos.length} total)</h3>
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
                    <div key={contrato.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                            {(contrato.clienteNome || '?').charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{contrato.clienteNome || 'Cliente não encontrado'}</p>
                            <p className="text-sm text-gray-500">{contrato.id} • {totalEquip} equipamento(s)</p>
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
                    </div>
                  );
                }) : (
                  <p className="p-8 text-center text-gray-500">Nenhum contrato encontrado</p>
                )}
              </div>
            </div>
          )}

          {/* CLIENTES */}
          {activeTab === 'clientes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientesUnicos.length > 0 ? clientesUnicos.map((cliente, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {(cliente.nome || '?').charAt(0)}
                    </div>
                    <StatusBadge status={cliente.status || 'active'} />
                  </div>
                  <h4 className="font-semibold text-gray-900">{cliente.nome}</h4>
                  <p className="text-sm text-gray-500 mb-3">{cliente.contato || 'Sem contato'}</p>
                  <div className="space-y-1 text-sm">
                    {cliente.endereco && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{cliente.endereco}, {cliente.cidade}</span>
                      </div>
                    )}
                    {cliente.phone && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <span>📞 {cliente.phone}</span>
                      </div>
                    )}
                    {cliente.email && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <span>✉️ {cliente.email}</span>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => openModal(`Detalhes: ${cliente.nome}`, (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div><p className="text-sm text-gray-500">Status</p><StatusBadge status={cliente.status || 'active'} /></div>
                          <div><p className="text-sm text-gray-500">Contato</p><p className="font-medium">{cliente.contato || 'N/A'}</p></div>
                          <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{cliente.email || 'N/A'}</p></div>
                          <div><p className="text-sm text-gray-500">Telefone</p><p className="font-medium">{cliente.phone || 'N/A'}</p></div>
                        </div>
                        <div><p className="text-sm text-gray-500">Endereço Completo</p><p className="font-medium">{cliente.endereco ? `${cliente.endereco}, ${cliente.cidade}, ${cliente.estado} ${cliente.cep}` : 'N/A'}</p></div>
                      </div>
                    ))}
                    className="mt-4 w-full py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ver detalhes</span>
                  </button>
                </div>
              )) : (
                <p className="col-span-full p-8 text-center text-gray-500">Nenhum cliente encontrado</p>
              )}
            </div>
          )}
        </main>

        {/* Modal */}
        <Modal isOpen={modalData.isOpen} onClose={closeModal} title={modalData.title}>
          {modalData.content}
        </Modal>

        {/* Footer */}
        <footer className="bg-white border-t mt-8">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between text-sm text-gray-500">
            <span>© 2025 Eleven Fragrances LLC</span>
            <span>Dashboard v3.0 • Tempo Real</span>
          </div>
        </footer>
      </div>
    </>
  );
}
