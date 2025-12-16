import React, { useState } from 'react';
import Head from 'next/head';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, FileText, DollarSign, Wrench, Users, TrendingUp, Clock, CheckCircle, AlertTriangle, Calendar, MapPin, X, Eye, Filter } from 'lucide-react';

// DADOS REAIS DA PLANILHA ELEVEN FRAGRANCES
const dadosReais = {
  contratos: [
    { id: 'EF-2025-00005', status: 'draft', clientId: 'EF-C-2025-00005', valorMensal: 124, qtdPirad: 2, qtdSquare: 0, qtdDesign: 0, qtdTower: 0, qtdPro2: 0, dataCriacao: '2025-12-15' },
    { id: 'EF-2025-00006', status: 'draft', clientId: 'EF-C-2025-00006', valorMensal: 312, qtdPirad: 1, qtdSquare: 0, qtdDesign: 1, qtdTower: 0, qtdPro2: 0, dataCriacao: '2025-12-15' },
    { id: 'EF-2025-00009', status: 'active', clientId: 'EF-C-2025-00009', valorMensal: 249.99, qtdPirad: 0, qtdSquare: 0, qtdDesign: 2, qtdTower: 0, qtdPro2: 0, dataCriacao: '2025-12-15', dataAssinatura: '2025-12-15' },
  ],
  clientes: [
    { id: 'EF-C-2025-00005', nome: 'VOX IMMIGRATION', email: 'admin@voximmigrat', phone: '4073074842', endereco: '5749 Westgate Dr', cidade: 'Orlando', estado: 'Florida', cep: '32835', contato: 'Rodrigo Tiburcio', status: 'active' },
    { id: 'EF-C-2025-00006', nome: 'ACSAH SANTOS', email: 'acsah1221@gmail.com', phone: '508-560-9593', endereco: '2670 Zuni Rd', cidade: 'SAINT CLOUD', estado: 'Florida', cep: '34771', contato: 'Acsah Santos', status: 'active' },
    { id: 'EF-C-2025-00009', nome: 'OUSI STORE', email: 'ousistore@gmail.com', phone: '', endereco: '16405 Silver Brook Way', cidade: 'Winter Garden', estado: 'Florida', cep: '34787', contato: 'Valesca Martins', status: 'active' },
  ],
  instalacoes: [
    { id: 'EF-IN-99313', contratoId: 'EF-2025-00010', clientId: 'EF-C-2025-00009', status: 'pending', obs: '2 equipamento(s) para instalar' },
    { id: 'EF-IN-21565', contratoId: 'EF-2025-00009', clientId: 'EF-C-2025-00009', status: 'pending', obs: '2 equipamento(s) para instalar' },
  ],
  manutencoes: [
    { id: 'EF-MAN-99314', contratoId: 'EF-2025-00010', clientId: 'EF-C-2025-00009', equipamentoId: 'EF-INV-99314', dataProxima: '2026-01-15', status: 'scheduled', obs: 'Design Diffuser - Ciclo 30 dias' },
    { id: 'EF-MAN-21566', contratoId: 'EF-2025-00009', clientId: 'EF-C-2025-00009', equipamentoId: 'EF-INV-21566', dataProxima: '2026-01-15', status: 'scheduled', obs: 'Design Diffuser - Ciclo 30 dias' },
  ],
  comissoes: [
    { id: 'EF-COM-99313', contratoId: 'EF-2025-00010', mesRef: '2025-12', valorBase: 249.99, percentual: 10, valorComissao: 24.99, tipo: 'recorrente', status: 'pending', dataPagamento: '2025-12-26' },
    { id: 'EF-COM-21565', contratoId: 'EF-2025-00009', mesRef: '2025-12', valorBase: 249.99, percentual: 10, valorComissao: 24.99, tipo: 'recorrente', status: 'pending', dataPagamento: '2025-12-26' },
  ],
  inventario: [
    { id: 'EF-INV-99314', tipo: 'EF-EQ-03', nome: 'Design Diffuser', status: 'deployed', dataInstalacao: '2025-12-16', proximaManutencao: '2026-01-15' },
    { id: 'EF-INV-21566', tipo: 'EF-EQ-03', nome: 'Design Diffuser', status: 'deployed', dataInstalacao: '2025-12-16', proximaManutencao: '2026-01-15' },
  ]
};

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

const StatCard = ({ title, value, subtitle, icon: Icon, color, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
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
  const [activeTab, setActiveTab] = useState('overview');
  const [modalData, setModalData] = useState({ isOpen: false, title: '', content: null });
  const [filtroStatus, setFiltroStatus] = useState('todos');

  // Cálculos
  const contratosAtivos = dadosReais.contratos.filter(c => c.status === 'active');
  const contratosDraft = dadosReais.contratos.filter(c => c.status === 'draft');
  const receitaMensal = contratosAtivos.reduce((sum, c) => sum + c.valorMensal, 0);
  const totalComissoes = dadosReais.comissoes.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.valorComissao, 0);
  
  const equipamentos = {
    pirad: dadosReais.contratos.reduce((sum, c) => sum + c.qtdPirad, 0),
    square: dadosReais.contratos.reduce((sum, c) => sum + c.qtdSquare, 0),
    design: dadosReais.contratos.reduce((sum, c) => sum + c.qtdDesign, 0),
    tower: dadosReais.contratos.reduce((sum, c) => sum + c.qtdTower, 0),
    pro2: dadosReais.contratos.reduce((sum, c) => sum + c.qtdPro2, 0),
  };
  const totalEquipamentos = Object.values(equipamentos).reduce((a, b) => a + b, 0);

  const pieData = equipamentosPie.map(e => ({ ...e, value: equipamentos[e.key] })).filter(e => e.value > 0);

  const getClienteNome = (clientId) => {
    const cliente = dadosReais.clientes.find(c => c.id === clientId);
    return cliente?.nome || clientId;
  };

  const openModal = (title, content) => setModalData({ isOpen: true, title, content });
  const closeModal = () => setModalData({ isOpen: false, title: '', content: null });

  // Filtrar contratos
  const contratosFiltrados = filtroStatus === 'todos' 
    ? dadosReais.contratos 
    : dadosReais.contratos.filter(c => c.status === filtroStatus);

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
                <p className="text-xs text-gray-500">Dashboard Interativa • Dados em tempo real</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Atualizado: {new Date().toLocaleString('pt-BR')}
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-6">
            {[
              { id: 'overview', label: '📊 Visão Geral' },
              { id: 'contratos', label: '📄 Contratos' },
              { id: 'clientes', label: '👥 Clientes' },
              { id: 'operacoes', label: '🔧 Operações' },
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
                value={contratosAtivos.length}
                subtitle={`${contratosDraft.length} em rascunho`}
                icon={FileText}
                color="bg-blue-500"
                onClick={() => setActiveTab('contratos')}
              />
              <StatCard
                title="Equipamentos"
                value={totalEquipamentos}
                subtitle={`${dadosReais.inventario.length} instalados`}
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
                        <span className="font-bold">{equipamentos[e.key]}</span>
                      </div>
                    ))}
                  </div>
                ))}
              />
              <StatCard
                title="Receita Mensal"
                value={`$${receitaMensal.toFixed(2)}`}
                subtitle="Contratos ativos"
                icon={DollarSign}
                color="bg-purple-500"
              />
              <StatCard
                title="Comissões Pendentes"
                value={`$${totalComissoes.toFixed(2)}`}
                subtitle={`${dadosReais.comissoes.filter(c => c.status === 'pending').length} a pagar`}
                icon={TrendingUp}
                color="bg-orange-500"
                onClick={() => openModal('Comissões Pendentes', (
                  <div className="space-y-3">
                    {dadosReais.comissoes.filter(c => c.status === 'pending').map(c => (
                      <div key={c.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{c.contratoId}</p>
                          <p className="text-sm text-gray-500">Vence: {c.dataPagamento}</p>
                        </div>
                        <span className="font-bold text-green-600">${c.valorComissao.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                ))}
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
                <h3 className="font-semibold mb-4">Próximas Ações</h3>
                <div className="space-y-3">
                  {dadosReais.instalacoes.filter(i => i.status === 'pending').slice(0, 3).map(inst => (
                    <div key={inst.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Package className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-sm">{getClienteNome(inst.clientId)}</p>
                          <p className="text-xs text-gray-500">{inst.obs}</p>
                        </div>
                      </div>
                      <StatusBadge status="pending" />
                    </div>
                  ))}
                  {dadosReais.manutencoes.slice(0, 2).map(m => (
                    <div key={m.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Wrench className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="font-medium text-sm">{m.obs}</p>
                          <p className="text-xs text-gray-500">Data: {m.dataProxima}</p>
                        </div>
                      </div>
                      <StatusBadge status="scheduled" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Alertas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start space-x-3">
                <Package className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">{dadosReais.instalacoes.filter(i => i.status === 'pending').length} Instalações Pendentes</p>
                  <p className="text-sm text-blue-600">Aguardando agendamento</p>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-start space-x-3">
                <Clock className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">{dadosReais.manutencoes.length} Manutenções Agendadas</p>
                  <p className="text-sm text-yellow-600">Próxima: {dadosReais.manutencoes[0]?.dataProxima || 'N/A'}</p>
                </div>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">{dadosReais.inventario.filter(i => i.status === 'deployed').length} Equipamentos Ativos</p>
                  <p className="text-sm text-green-600">Operando normalmente</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* CONTRATOS */}
        {activeTab === 'contratos' && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Contratos</h3>
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
                </select>
              </div>
            </div>
            <div className="divide-y">
              {contratosFiltrados.map(contrato => {
                const cliente = dadosReais.clientes.find(c => c.id === contrato.clientId);
                const totalEquip = contrato.qtdPirad + contrato.qtdSquare + contrato.qtdDesign + contrato.qtdTower + contrato.qtdPro2;
                return (
                  <div key={contrato.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                          {cliente?.nome?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className="font-medium">{cliente?.nome || 'Cliente não encontrado'}</p>
                          <p className="text-sm text-gray-500">{contrato.id} • {totalEquip} equipamento(s)</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${contrato.valorMensal.toFixed(2)}/mês</p>
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
              })}
            </div>
          </div>
        )}

        {/* CLIENTES */}
        {activeTab === 'clientes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dadosReais.clientes.map(cliente => (
              <div key={cliente.id} className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {cliente.nome.charAt(0)}
                  </div>
                  <StatusBadge status={cliente.status} />
                </div>
                <h4 className="font-semibold text-gray-900">{cliente.nome}</h4>
                <p className="text-sm text-gray-500 mb-3">{cliente.contato}</p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{cliente.endereco}, {cliente.cidade}</span>
                  </div>
                  {cliente.phone && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span>📞 {cliente.phone}</span>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => openModal(`Detalhes: ${cliente.nome}`, (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-sm text-gray-500">ID</p><p className="font-medium">{cliente.id}</p></div>
                        <div><p className="text-sm text-gray-500">Status</p><StatusBadge status={cliente.status} /></div>
                        <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{cliente.email || 'N/A'}</p></div>
                        <div><p className="text-sm text-gray-500">Telefone</p><p className="font-medium">{cliente.phone || 'N/A'}</p></div>
                      </div>
                      <div><p className="text-sm text-gray-500">Endereço Completo</p><p className="font-medium">{cliente.endereco}, {cliente.cidade}, {cliente.estado} {cliente.cep}</p></div>
                    </div>
                  ))}
                  className="mt-4 w-full py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center justify-center space-x-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver detalhes</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* OPERAÇÕES */}
        {activeTab === 'operacoes' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Instalações */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold flex items-center space-x-2">
                  <Package className="w-5 h-5 text-blue-500" />
                  <span>Instalações</span>
                </h3>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{dadosReais.instalacoes.length}</span>
              </div>
              <div className="divide-y">
                {dadosReais.instalacoes.map(inst => (
                  <div key={inst.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{getClienteNome(inst.clientId)}</p>
                        <p className="text-sm text-gray-500">{inst.id}</p>
                        <p className="text-xs text-gray-400 mt-1">{inst.obs}</p>
                      </div>
                      <StatusBadge status={inst.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Manutenções */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold flex items-center space-x-2">
                  <Wrench className="w-5 h-5 text-orange-500" />
                  <span>Manutenções</span>
                </h3>
                <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">{dadosReais.manutencoes.length}</span>
              </div>
              <div className="divide-y">
                {dadosReais.manutencoes.map(m => (
                  <div key={m.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{m.obs}</p>
                        <p className="text-sm text-gray-500">{m.id}</p>
                        <p className="text-xs text-gray-400 mt-1">📅 {m.dataProxima}</p>
                      </div>
                      <StatusBadge status={m.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventário */}
            <div className="bg-white rounded-xl shadow-sm border lg:col-span-2">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold flex items-center space-x-2">
                  <Package className="w-5 h-5 text-emerald-500" />
                  <span>Inventário</span>
                </h3>
                <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">{dadosReais.inventario.length} equipamentos</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
                {dadosReais.inventario.map(inv => (
                  <div key={inv.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{inv.nome}</p>
                        <p className="text-sm text-gray-500">{inv.id}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                          <span>📅 Instalado: {inv.dataInstalacao}</span>
                          <span>🔧 Próx. manut: {inv.proximaManutencao}</span>
                        </div>
                      </div>
                      <StatusBadge status={inv.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
          <span>Dashboard v2.0 • Interativa</span>
        </div>
      </footer>
    </div>
    </>
  );
}
