import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  Search, 
  Filter, 
  FileText, 
  CheckCircle, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  Truck,
  Sparkles,
  Info,
  Layers
} from 'lucide-react';
import { useHospitals } from '../hooks/useHospitals';
import { useMedicationRequests } from '../hooks/useMedicationRequests';
import { useMedicationOffers } from '../hooks/useMedicationOffers';

interface TransferNetworkProps {
  onNavigate: (tab: string) => void;
}

interface Transfer {
  id: string;
  medicationName: string;
  sourceHospital: string;
  destHospital: string;
  quantity: number;
  date: string;
  status: 'completed' | 'shipping' | 'pending';
  costEfficiency: string;
  clinicalImpact: 'low' | 'medium' | 'high' | 'critical';
  logisticsCoverage: string;
}

export const TransferNetwork: React.FC<TransferNetworkProps> = ({ onNavigate }) => {
  const { hospitals, loading: hospitalsLoading } = useHospitals();
  const { requests, loading: requestsLoading } = useMedicationRequests();
  const { offers, loading: offersLoading } = useMedicationOffers();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'clinical' | 'financial' | 'logistics'>('all');

  // Mock initial transfers
  const [transfers] = useState<Transfer[]>([
    {
      id: 'tr-1',
      medicationName: 'Amoxicilina 500mg',
      sourceHospital: 'Hospital de la Mujer',
      destHospital: 'Instituto Nacional de Perinatología Isidro Espinosa de los Reyes (INPer)',
      quantity: 350,
      date: '2026-06-28',
      status: 'completed',
      costEfficiency: '94.2%',
      clinicalImpact: 'high',
      logisticsCoverage: '90 días'
    },
    {
      id: 'tr-2',
      medicationName: 'Insulina Glargina 100 UI/ml',
      sourceHospital: 'Instituto Nacional de Perinatología Isidro Espinosa de los Reyes (INPer)',
      destHospital: 'Hospital General de México',
      quantity: 15,
      date: '2026-06-30',
      status: 'shipping',
      costEfficiency: '91.5%',
      clinicalImpact: 'critical',
      logisticsCoverage: '120 días'
    },
    {
      id: 'tr-3',
      medicationName: 'Paracetamol 500mg',
      sourceHospital: 'Hospital General de México',
      destHospital: 'Hospital de la Mujer',
      quantity: 1000,
      date: '2026-06-25',
      status: 'completed',
      costEfficiency: '88.7%',
      clinicalImpact: 'low',
      logisticsCoverage: '180 días'
    },
    {
      id: 'tr-4',
      medicationName: 'Morfina 10mg/ml',
      sourceHospital: 'Hospital de la Mujer',
      destHospital: 'Hospital General de México',
      quantity: 50,
      date: '2026-06-29',
      status: 'pending',
      costEfficiency: '92.0%',
      clinicalImpact: 'critical',
      logisticsCoverage: '45 días'
    }
  ]);

  // Calculate dynamic metrics
  const totalRequestsCount = requests.length;
  const fulfilledRequestsCount = requests.filter(r => r.status === 'fulfilled').length;
  
  // TFIRM (Tasa de Fill Rate de Medicamentos)
  const tfirmRate = totalRequestsCount > 0 
    ? parseFloat(((fulfilledRequestsCount / totalRequestsCount) * 100).toFixed(1))
    : 94.6;

  // RECA (Eficiencia Financiera) - Acquisition cost efficiency ratio
  const recaRate = 91.5;

  // IRCO (Sostenibilidad Logística) - Coverage index
  const ircoRate = 95.8;

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = 
      transfer.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.sourceHospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.destHospital.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transfer.status === statusFilter;
    
    const matchesPillarTab = 
      activeTab === 'all' || 
      (activeTab === 'clinical' && (transfer.clinicalImpact === 'high' || transfer.clinicalImpact === 'critical')) ||
      (activeTab === 'financial' && parseFloat(transfer.costEfficiency) >= 90) ||
      (activeTab === 'logistics' && parseInt(transfer.logisticsCoverage) >= 90);

    return matchesSearch && matchesStatus && matchesPillarTab;
  });

  const clinicalImpactColors = {
    low: 'bg-green-50 text-green-700 border border-green-100',
    medium: 'bg-yellow-50 text-yellow-700 border border-yellow-100',
    high: 'bg-orange-50 text-orange-700 border border-orange-100',
    critical: 'bg-red-50 text-red-700 border border-red-100'
  };

  const clinicalImpactLabels = {
    low: 'Bajo',
    medium: 'Medio',
    high: 'Alto',
    critical: 'Crítico'
  };

  const statusColors = {
    completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    shipping: 'bg-sky-50 text-sky-700 border border-sky-200 animate-pulse',
    pending: 'bg-amber-50 text-amber-700 border border-amber-200'
  };

  const statusLabels = {
    completed: 'Completado',
    shipping: 'En Camino',
    pending: 'Pendiente'
  };

  if (hospitalsLoading || requestsLoading || offersLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
            <ArrowRightLeft className="w-6 h-6 mr-2 text-[#0a2342]" />
            Red de Traspasos
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Gobernanza, indicadores y control operativo del intercambio de medicamentos.
          </p>
        </div>
        <button
          onClick={() => onNavigate('solicitudes')}
          className="bg-[#0a2342] text-white px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-all duration-200 text-sm flex items-center space-x-2 shadow-sm font-medium hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Solicitar Medicamentos</span>
        </button>
      </div>

      {/* Triple Guarantee Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-[#0f2e59] text-white p-4 sm:p-5 rounded-2xl shadow-md border border-slate-800 flex flex-col sm:flex-row items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center space-x-3 text-center sm:text-left">
          <div className="p-2 bg-white/10 rounded-xl">
            <Layers className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-amber-300">Gobernanza y Salvaguarda Operativa</h4>
            <p className="text-xs sm:text-sm text-slate-200 mt-0.5 font-medium">
              Un sistema de triple garantía que transforma la gestión de crisis en una gestión de precisión.
            </p>
          </div>
        </div>
      </div>

      {/* Modern Metrics Grid (replacing the literal temple roof) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: TFIRM (Seguridad Clínica) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col">
          {/* Top colored indicator bar */}
          <div className="h-2 bg-emerald-500" />
          
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">
                Seguridad Clínica
              </span>
            </div>

            <div className="mt-6">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{tfirmRate}%</span>
                <span className="text-xs text-emerald-600 font-bold flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                  +1.2%
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-800 mt-2">TFIRM</h3>
              <p className="text-xs text-slate-400 font-medium">Tasa de Fill Rate de Medicamentos</p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-4 border-t border-slate-100 pt-4 flex-1">
              Garantiza la capacidad de respuesta inmediata y anula el riesgo clínico del paciente.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
              <div>
                <span className="block text-slate-400">Atendidos</span>
                <span className="font-semibold text-slate-800">{fulfilledRequestsCount} solicitudes</span>
              </div>
              <div>
                <span className="block text-slate-400">Meta</span>
                <span className="font-semibold text-emerald-600">&gt; 95.0%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: RECA (Eficiencia Financiera) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col">
          {/* Top colored indicator bar */}
          <div className="h-2 bg-amber-500" />
          
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-100 uppercase tracking-wider">
                Eficiencia Financiera
              </span>
            </div>

            <div className="mt-6">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{recaRate}%</span>
                <span className="text-xs text-slate-500 font-bold">1.15x ratio</span>
              </div>
              <h3 className="text-base font-bold text-slate-800 mt-2">RECA</h3>
              <p className="text-xs text-slate-400 font-medium">Razón de Eficiencia de Costos de Adquisición</p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-4 border-t border-slate-100 pt-4 flex-1">
              Elimina la asimetría de información y fuerza una rendición de cuentas involuntaria.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
              <div>
                <span className="block text-slate-400">Ahorro Red</span>
                <span className="font-semibold text-slate-800">+$245,600 MXN</span>
              </div>
              <div>
                <span className="block text-slate-400">Desviación</span>
                <span className="font-semibold text-amber-600">Mínima</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: IRCO (Sostenibilidad Logística) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col">
          {/* Top colored indicator bar */}
          <div className="h-2 bg-purple-500" />
          
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Truck className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full border border-purple-100 uppercase tracking-wider">
                Sostenibilidad Logística
              </span>
            </div>

            <div className="mt-6">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{ircoRate}%</span>
                <span className="text-xs text-purple-600 font-bold">Estable</span>
              </div>
              <h3 className="text-base font-bold text-slate-800 mt-2">IRCO</h3>
              <p className="text-xs text-slate-400 font-medium">Índice de Claves en Rango de Cobertura Óptima</p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-4 border-t border-slate-100 pt-4 flex-1">
              Mantiene el equilibrio perfecto entre cero desabasto y cero caducidad.
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
              <div>
                <span className="block text-slate-400">Claves Rango</span>
                <span className="font-semibold text-slate-800">142 / 148 claves</span>
              </div>
              <div>
                <span className="block text-slate-400">Merma Caduc.</span>
                <span className="font-semibold text-purple-600">0.02% (Cero)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Transfers Log Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6 border-b pb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Registro de Transacciones de Traspaso</h3>
            <p className="text-xs text-gray-500 mt-0.5">Control de envíos, cadena de frío y firmas digitales de la red.</p>
          </div>
          <div className="flex bg-slate-100 rounded-lg p-1 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveTab('clinical')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'clinical' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Urgencia Clínica
            </button>
            <button
              onClick={() => setActiveTab('financial')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'financial' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Eficiencia RECA
            </button>
            <button
              onClick={() => setActiveTab('logistics')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'logistics' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Cobertura Óptima
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por medicamento u hospital..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-sm bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="completed">Completados</option>
              <option value="shipping">En Camino</option>
              <option value="pending">Pendientes</option>
            </select>
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-50/70">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Detalle del Medicamento
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Ruta de Traspaso (Origen → Destino)
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Eficiencia RECA
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Impacto Clínico
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransfers.length > 0 ? (
                filteredTransfers.map((transfer) => (
                  <tr key={transfer.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{transfer.medicationName}</div>
                          <div className="text-xs text-slate-400">ID: {transfer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-700 font-medium">
                        <span className="text-slate-900 block truncate max-w-xs" title={transfer.sourceHospital}>
                          {transfer.sourceHospital}
                        </span>
                        <span className="text-slate-400 inline-block py-0.5 text-xs">→</span>
                        <span className="text-slate-900 block truncate max-w-xs" title={transfer.destHospital}>
                          {transfer.destHospital}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-800">{transfer.quantity}</div>
                      <div className="text-xs text-slate-400">Unidades</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold leading-none ${statusColors[transfer.status]}`}>
                        {transfer.status === 'completed' && <CheckCircle className="w-3.5 h-3.5 mr-1" />}
                        {transfer.status === 'shipping' && <Truck className="w-3.5 h-3.5 mr-1" />}
                        {transfer.status === 'pending' && <Clock className="w-3.5 h-3.5 mr-1" />}
                        {statusLabels[transfer.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-800 font-bold flex items-center">
                        <TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                        {transfer.costEfficiency}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">Índice RECA</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${clinicalImpactColors[transfer.clinicalImpact]}`}>
                        {clinicalImpactLabels[transfer.clinicalImpact]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(transfer.date).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-sm text-slate-500">
                    <Info className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No se encontraron traspasos que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
