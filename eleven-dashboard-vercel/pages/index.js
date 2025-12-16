import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Package, FileText, DollarSign, Wrench, TrendingUp, Clock, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import Head from 'next/head';

// URL da API do n8n
const API_URL = 'https://n8n.srv1199443.hstgr.cloud/webhook/eleven-dashboard';

const equipamentosPie = [
  { name: 'Pirad', key: 'pirad', color: '#3B82F6' },
  { name: 'Square', key: 'square', color: '#10B981' },
  { name: 'Design', key: 'design', color: '#F59E0B' },
  { name: 'Tower', key: 'tower', color: '#8B5CF6' },
  { name: 'Pro 2', key: 'pro2', color: '#EF4444' },
];

const StatCard = ({ title, value, subtitle, icon: Icon, color, loading }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {loading ? (
          <div className="h-9 w-20 bg-gray-200 animate-pulse rounded mt-1"></div>
        ) : (
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        )}
        {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-4 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800',
    agendada: 'bg-blue-100 text-blue-800',
    realizada: 'bg-green-100 text-green-800',
    scheduled: 'bg-blue-100 text-blue-800',
  };
  
  const labels = {
    pending: 'Pendente',
    agendada: 'Agendada',
    realizada: 'Realizada',
    scheduled: 'Agendada',
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {labels[status] || status}
    </span>
  );
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

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
        resumo: { contratosAtivos: 0, contratosPendentes: 0, equipamentosTotal: 0, receitaMensal: 0, manutencoes7dias: 0, comissoesPendentes: 0 },
        equipamentos: { pirad: 0, square: 0, design: 0, tower: 0, pro2: 0, total: 0 },
        proximasManutencoes: [],
        instalacoesPendentes: [],
        comissoesPendentes: [],
        alertas: { manutencoesAtrasadas: 0, contratosRenovar: 0, novosContratos: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const pieData = data ? equipamentosPie.map(e => ({
    ...e,
    value: data.equipamentos?.[e.key] || 0
  })) : [];

  return (
    <>
      <Head>
        <title>Dashboard | Eleven Fragrances</title>
        <meta name="description" content="Operations Dashboard - Eleven Fragrances" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">11</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Eleven Fragrances</h1>
                  <p className="text-xs text-gray-500">Operations Dashboard</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={fetchData}
                  className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span className="text-sm hidden sm:inline">Atualizar</span>
                </button>
                {lastUpdate && (
                  <span className="text-xs text-gray-400 hidden sm:inline">
                    {lastUpdate.toLocaleTimeString('pt-BR')}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Error Banner */}
        {error && (
          <div className="bg-yellow-50 border-b border-yellow-100 px-4 py-2">
            <p className="text-sm text-yellow-800 text-center">
              ⚠️ Erro ao carregar dados: {error}
            </p>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Contratos Ativos"
              value={data?.resumo?.contratosAtivos || 0}
              subtitle={`${data?.resumo?.contratosPendentes || 0} pendentes`}
              icon={FileText}
              color="bg-blue-500"
              loading={loading}
            />
            <StatCard
              title="Equipamentos"
              value={data?.resumo?.equipamentosTotal || 0}
              subtitle="Em operação"
              icon={Package}
              color="bg-emerald-500"
              loading={loading}
            />
            <StatCard
              title="Receita Mensal"
              value={`$${(data?.resumo?.receitaMensal || 0).toLocaleString()}`}
              subtitle="Recorrente"
              icon={DollarSign}
              color="bg-purple-500"
              loading={loading}
            />
            <StatCard
              title="Manutenções"
              value={data?.resumo?.manutencoes7dias || 0}
              subtitle="Próximos 7 dias"
              icon={Wrench}
              color="bg-orange-500"
              loading={loading}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Equipamentos por Tipo */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipamentos por Tipo</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData.filter(d => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} unidades`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-600">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Comissões Pendentes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Comissões a Pagar</h3>
                <span className="text-2xl font-bold text-emerald-600">
                  ${(data?.resumo?.comissoesPendentes || 0).toLocaleString()}
                </span>
              </div>
              <div className="space-y-3">
                {(data?.comissoesPendentes || []).length > 0 ? (
                  data.comissoesPendentes.map((com, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-600">{(com.vendedor || 'V')[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{com.vendedor}</p>
                          <p className="text-sm text-gray-500">{com.contrato}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${(com.valor || 0).toFixed(2)}</p>
                        <p className="text-xs text-gray-400">{com.vencimento}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Nenhuma comissão pendente</p>
                )}
              </div>
            </div>
          </div>

          {/* Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Próximas Manutenções */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Próximas Manutenções</h3>
                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {data?.resumo?.manutencoes7dias || 0} pendentes
                </span>
              </div>
              <div className="space-y-3">
                {(data?.proximasManutencoes || []).length > 0 ? (
                  data.proximasManutencoes.map((manut, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          manut.dias <= 1 ? 'bg-red-100' : manut.dias <= 3 ? 'bg-yellow-100' : 'bg-green-100'
                        }`}>
                          <Wrench className={`w-5 h-5 ${
                            manut.dias <= 1 ? 'text-red-600' : manut.dias <= 3 ? 'text-yellow-600' : 'text-green-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{manut.cliente}</p>
                          <p className="text-sm text-gray-500">{manut.equipamento}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{manut.data}</p>
                        <p className={`text-xs ${manut.dias <= 1 ? 'text-red-500' : 'text-gray-400'}`}>
                          {manut.dias <= 0 ? 'Hoje!' : `Em ${manut.dias} dias`}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Nenhuma manutenção próxima</p>
                )}
              </div>
            </div>

            {/* Instalações Pendentes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Instalações Pendentes</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {(data?.instalacoesPendentes || []).length} pendentes
                </span>
              </div>
              <div className="space-y-3">
                {(data?.instalacoesPendentes || []).length > 0 ? (
                  data.instalacoesPendentes.map((inst, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{inst.cliente}</p>
                          <p className="text-sm text-gray-500 truncate max-w-[200px]">{inst.endereco}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={inst.status} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Nenhuma instalação pendente</p>
                )}
              </div>
            </div>
          </div>

          {/* Alertas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`rounded-xl p-4 flex items-start space-x-3 ${
              (data?.alertas?.manutencoesAtrasadas || 0) > 0 ? 'bg-red-50 border border-red-100' : 'bg-gray-50 border border-gray-100'
            }`}>
              <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                (data?.alertas?.manutencoesAtrasadas || 0) > 0 ? 'text-red-500' : 'text-gray-400'
              }`} />
              <div>
                <p className={`font-medium ${
                  (data?.alertas?.manutencoesAtrasadas || 0) > 0 ? 'text-red-800' : 'text-gray-600'
                }`}>
                  {data?.alertas?.manutencoesAtrasadas || 0} Manutenção Atrasada
                </p>
                <p className={`text-sm ${
                  (data?.alertas?.manutencoesAtrasadas || 0) > 0 ? 'text-red-600' : 'text-gray-400'
                }`}>
                  {(data?.alertas?.manutencoesAtrasadas || 0) > 0 ? 'Requer atenção' : 'Tudo em dia!'}
                </p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-start space-x-3">
              <Clock className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">{data?.alertas?.contratosRenovar || 0} Contratos</p>
                <p className="text-sm text-yellow-600">Para renovar (30 dias)</p>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">{data?.alertas?.novosContratos || 0} Novos</p>
                <p className="text-sm text-green-600">Contratos esta semana</p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <p>© 2025 Eleven Fragrances LLC</p>
              <p>Dashboard v1.0</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
