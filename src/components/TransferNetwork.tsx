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
  Info
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
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);

  // Mock initial transfers
  const [transfers, setTransfers] = useState<Transfer[]>([
    {
      id: 'tr-1',
      medicationName: 'Amoxicilina 500mg',
      sourceHospital: 'Hospital de la Mujer',
      destHospital: 'Instituto Nacional de Perinatología (INPer)',
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
      sourceHospital: 'Instituto Nacional de Perinatología (INPer)',
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
  // Base rate is 94.6% as shown in image, but shifts slightly with real data
  const tfirmRate = totalRequestsCount > 0 
    ? parseFloat(((fulfilledRequestsCount / totalRequestsCount) * 100).toFixed(1))
    : 94.6;

  // RECA (Eficiencia Financiera) - Acquisition cost efficiency ratio
  const recaRate = 91.5; // Baseline value from typical acquisition efficiency

  // IRCO (Sostenibilidad Logística) - Coverage index
  const ircoRate = 95.8; // Optimal coverage index

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = 
      transfer.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.sourceHospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.destHospital.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transfer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const clinicalImpactColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };

  const clinicalImpactLabels = {
    low: 'Bajo',
    medium: 'Medio',
    high: 'Alto',
    critical: 'Crítico'
  };

  const statusColors = {
    completed: 'bg-green-100 text-green-800 border border-green-200',
    shipping: 'bg-blue-100 text-blue-800 border border-blue-200 animate-pulse',
    pending: 'bg-amber-100 text-amber-800 border border-amber-200'
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
          className="bg-[#0a2342] text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors text-sm flex items-center space-x-2 shadow-sm font-medium"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Solicitar Medicamentos</span>
        </button>
      </div>

      {/* Greek Temple Visualization of Governance pillars */}
      <div className="bg-gradient-to-b from-slate-50 to-slate-100/50 p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm relative">
        <div className="text-center mb-6">
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#0a2342] tracking-tight">
            Pilares de la Gobernanza y Salvaguarda Operativa
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Haga clic en cualquiera de los pilares para ver el detalle de cálculo y métricas asociadas.
          </p>
        </div>

        {/* Temple Architecture Wrapper */}
        <div className="max-w-4xl mx-auto flex flex-col items-stretch">
          
          {/* Temple Pediment (Roof) */}
          <div className="w-full relative select-none">
            <svg viewBox="0 0 800 60" className="w-full text-[#0a2342] fill-current filter drop-shadow-md">
              {/* Roof Triangle */}
              <polygon points="0,60 400,10 800,60" />
              {/* Top border beam accent */}
              <line x1="0" y1="60" x2="800" y2="60" stroke="#0c315e" strokeWidth="4" />
            </svg>
          </div>

          {/* Architrave / Main Beam */}
          <div className="bg-[#0a2342] text-white text-center py-3.5 px-4 font-bold uppercase tracking-[0.25em] text-xs sm:text-sm shadow-md border-b-[6px] border-[#0c315e] z-10 flex items-center justify-center space-x-2">
            <span>Gobernanza y Salvaguarda Operativa</span>
          </div>

          {/* Pillars Column Deck */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 pb-2 px-6 sm:px-10 bg-white border-x border-slate-200 relative min-h-[300px]">
            {/* Background Grid Lines simulating temple backdrop */}
            <div className="absolute inset-0 grid grid-cols-6 pointer-events-none opacity-[0.03]">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border-r border-slate-900 h-full"></div>
              ))}
            </div>

            {/* Pillar 1: TFIRM (Seguridad Clínica) */}
            <button 
              onClick={() => setSelectedPillar(selectedPillar === 'tfirm' ? null : 'tfirm')}
              className={`flex flex-col bg-slate-50/60 border ${
                selectedPillar === 'tfirm' ? 'ring-2 ring-emerald-500 shadow-md border-emerald-300' : 'border-slate-200 hover:border-emerald-300'
              } rounded-lg p-5 transition-all duration-300 relative text-left group overflow-hidden`}
            >
              {/* Pillar Cap (Top block) */}
              <div className="absolute top-0 inset-x-0 h-4 flex">
                <div className="w-1/2 bg-emerald-600"></div>
                <div className="w-1/2 bg-emerald-700"></div>
              </div>
              
              {/* Left/Right Column Shaft Grooves */}
              <div className="absolute inset-y-4 left-0.5 w-1 bg-gradient-to-b from-emerald-500/20 to-emerald-700/20 rounded-full" />
              <div className="absolute inset-y-4 right-0.5 w-1 bg-gradient-to-b from-emerald-500/20 to-emerald-700/20 rounded-full" />
              
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100 uppercase">
                  Clínico
                </span>
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>

              <div className="mt-4">
                <h4 className="text-lg font-bold text-gray-900">TFIRM</h4>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Tasa de Fill Rate de Medicamentos</p>
              </div>

              {/* Metric Circular representation or Big Number */}
              <div className="my-5 flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                  {/* Outer circle */}
                  <svg className="w-24 h-24">
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="40" 
                      className="text-slate-100" 
                      strokeWidth="8" 
                      fill="transparent" 
                      stroke="currentColor" 
                    />
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="40" 
                      className="text-emerald-500" 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * tfirmRate) / 100}
                      strokeLinecap="round"
                      stroke="currentColor" 
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-xl font-extrabold text-gray-900">{tfirmRate}%</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fill Rate</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 mt-auto">
                Garantiza la capacidad de respuesta inmediata y anula el riesgo clínico del paciente.
              </div>

              {/* Pedestal Base */}
              <div className="absolute bottom-0 inset-x-0 h-1 bg-emerald-600" />
            </button>

            {/* Pillar 2: RECA (Eficiencia Financiera) */}
            <button 
              onClick={() => setSelectedPillar(selectedPillar === 'reca' ? null : 'reca')}
              className={`flex flex-col bg-slate-50/60 border ${
                selectedPillar === 'reca' ? 'ring-2 ring-amber-500 shadow-md border-amber-300' : 'border-slate-200 hover:border-amber-300'
              } rounded-lg p-5 transition-all duration-300 relative text-left group overflow-hidden`}
            >
              {/* Pillar Cap (Top block) */}
              <div className="absolute top-0 inset-x-0 h-4 flex">
                <div className="w-1/2 bg-amber-500"></div>
                <div className="w-1/2 bg-amber-600"></div>
              </div>
              
              {/* Left/Right Column Shaft Grooves */}
              <div className="absolute inset-y-4 left-0.5 w-1 bg-gradient-to-b from-amber-400/20 to-amber-600/20 rounded-full" />
              <div className="absolute inset-y-4 right-0.5 w-1 bg-gradient-to-b from-amber-400/20 to-amber-600/20 rounded-full" />

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100 uppercase">
                  Finanzas
                </span>
                <DollarSign className="w-5 h-5 text-amber-600" />
              </div>

              <div className="mt-4">
                <h4 className="text-lg font-bold text-gray-900">RECA</h4>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Razón de Eficiencia de Costos de Adquisición</p>
              </div>

              {/* Metric Circular representation or Big Number */}
              <div className="my-5 flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                  {/* Outer circle */}
                  <svg className="w-24 h-24">
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="40" 
                      className="text-slate-100" 
                      strokeWidth="8" 
                      fill="transparent" 
                      stroke="currentColor" 
                    />
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="40" 
                      className="text-amber-500" 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * recaRate) / 100}
                      strokeLinecap="round"
                      stroke="currentColor" 
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-xl font-extrabold text-gray-900">{recaRate}%</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Eficiencia</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 mt-auto">
                Elimina la asimetría de información y fuerza una rendición de cuentas involuntaria.
              </div>

              {/* Pedestal Base */}
              <div className="absolute bottom-0 inset-x-0 h-1 bg-amber-500" />
            </button>

            {/* Pillar 3: IRCO (Sostenibilidad Logística) */}
            <button 
              onClick={() => setSelectedPillar(selectedPillar === 'irco' ? null : 'irco')}
              className={`flex flex-col bg-slate-50/60 border ${
                selectedPillar === 'irco' ? 'ring-2 ring-purple-500 shadow-md border-purple-300' : 'border-slate-200 hover:border-purple-300'
              } rounded-lg p-5 transition-all duration-300 relative text-left group overflow-hidden`}
            >
              {/* Pillar Cap (Top block) */}
              <div className="absolute top-0 inset-x-0 h-4 flex">
                <div className="w-1/2 bg-purple-600"></div>
                <div className="w-1/2 bg-purple-700"></div>
              </div>
              
              {/* Left/Right Column Shaft Grooves */}
              <div className="absolute inset-y-4 left-0.5 w-1 bg-gradient-to-b from-purple-500/20 to-purple-700/20 rounded-full" />
              <div className="absolute inset-y-4 right-0.5 w-1 bg-gradient-to-b from-purple-500/20 to-purple-700/20 rounded-full" />

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs font-semibold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-100 uppercase">
                  Logística
                </span>
                <Truck className="w-5 h-5 text-purple-600" />
              </div>

              <div className="mt-4">
                <h4 className="text-lg font-bold text-gray-900">IRCO</h4>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Índice de Claves en Rango de Cobertura Óptima</p>
              </div>

              {/* Metric Circular representation or Big Number */}
              <div className="my-5 flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                  {/* Outer circle */}
                  <svg className="w-24 h-24">
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="40" 
                      className="text-slate-100" 
                      strokeWidth="8" 
                      fill="transparent" 
                      stroke="currentColor" 
                    />
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="40" 
                      className="text-purple-500" 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * ircoRate) / 100}
                      strokeLinecap="round"
                      stroke="currentColor" 
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-xl font-extrabold text-gray-900">{ircoRate}%</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cobertura</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 mt-auto">
                Mantiene el equilibrio perfecto entre cero desabasto y cero caducidad.
              </div>

              {/* Pedestal Base */}
              <div className="absolute bottom-0 inset-x-0 h-1 bg-purple-600" />
            </button>
          </div>

          {/* Temple Stylobate (Base steps) */}
          <div className="relative z-10 select-none">
            {/* Top base step */}
            <div className="bg-slate-400 h-2 w-[calc(100%+0.5rem)] -ml-1 border-b border-slate-500"></div>
            {/* Middle base step */}
            <div className="bg-slate-500 h-2.5 w-[calc(100%+1rem)] -ml-2 border-b border-slate-600"></div>
            {/* Bottom main step with message */}
            <div className="bg-slate-600 text-white text-center py-3.5 px-4 font-semibold text-xs sm:text-sm shadow-md border-t border-slate-500 w-[calc(100%+1.5rem)] -ml-3 rounded-b-lg">
              Un sistema de triple garantía que transforma la gestión de crisis en una gestión de precisión.
            </div>
          </div>
        </div>

        {/* Dynamic Detail Expansion Card (when a pillar is clicked) */}
        {selectedPillar && (
          <div className="mt-8 bg-white border border-slate-200 rounded-xl p-5 shadow-sm max-w-4xl mx-auto animate-fadeIn">
            {selectedPillar === 'tfirm' && (
              <div>
                <div className="flex items-center space-x-2 border-b pb-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-bold text-gray-900 text-base">TFIRM (Seguridad Clínica) — Detalle Operativo</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>
                      La <strong>Tasa de Fill Rate de Medicamentos</strong> mide la capacidad de la red para responder de manera inmediata a las solicitudes críticas de insumos, anulando los riesgos clínicos asociados al desabasto de fármacos esenciales.
                    </p>
                    <p className="bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-100 text-xs">
                      <strong>Cálculo:</strong> (Traspasos Completados / Solicitudes Registradas en la Red) * 100
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-center space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                      <span>Métricas Clínicas</span>
                      <span>Valor Actual</span>
                    </div>
                    <div className="flex justify-between text-sm py-1 border-b border-slate-100">
                      <span className="text-slate-600">Solicitudes Activas Atendidas</span>
                      <span className="font-semibold text-gray-900">{fulfilledRequestsCount}</span>
                    </div>
                    <div className="flex justify-between text-sm py-1 border-b border-slate-100">
                      <span className="text-slate-600">Total Solicitudes en Red</span>
                      <span className="font-semibold text-gray-900">{totalRequestsCount}</span>
                    </div>
                    <div className="flex justify-between text-sm py-1">
                      <span className="text-slate-600">Meta Estratégica</span>
                      <span className="font-bold text-emerald-600">&gt; 95.0%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedPillar === 'reca' && (
              <div>
                <div className="flex items-center space-x-2 border-b pb-3">
                  <DollarSign className="w-5 h-5 text-amber-600" />
                  <h4 className="font-bold text-gray-900 text-base">RECA (Eficiencia Financiera) — Detalle Operativo</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>
                      La <strong>Razón de Eficiencia de Costos de Adquisición</strong> compara los precios de adquisición directa en el mercado frente a los costos de traspaso coordinado inter-hospitalario. Esto elimina la asimetría de información y fomenta la rendición de cuentas involuntaria al transparentar los costos de transacciones.
                    </p>
                    <p className="bg-amber-50 text-amber-800 p-2.5 rounded-lg border border-amber-100 text-xs">
                      <strong>Cálculo:</strong> (Costo de Adquisición Mercado / Costo Unitario Promedio de Traspaso)
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-center space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                      <span>Métricas Financieras</span>
                      <span>Valor Actual</span>
                    </div>
                    <div className="flex justify-between text-sm py-1 border-b border-slate-100">
                      <span className="text-slate-600">Eficiencia Promedio</span>
                      <span className="font-semibold text-gray-900">91.5%</span>
                    </div>
                    <div className="flex justify-between text-sm py-1 border-b border-slate-100">
                      <span className="text-slate-600">Ahorro en Red en Traspasos</span>
                      <span className="font-semibold text-amber-600">+$245,600 MXN</span>
                    </div>
                    <div className="flex justify-between text-sm py-1">
                      <span className="text-slate-600">Reducción de Asimetría</span>
                      <span className="font-bold text-amber-600">18.5% menos costo</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedPillar === 'irco' && (
              <div>
                <div className="flex items-center space-x-2 border-b pb-3">
                  <Truck className="w-5 h-5 text-purple-600" />
                  <h4 className="font-bold text-gray-900 text-base">IRCO (Sostenibilidad Logística) — Detalle Operativo</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>
                      El <strong>Índice de Claves en Rango de Cobertura Óptima</strong> asegura que los medicamentos de la red se mantengan en los niveles de stock ideales para el consumo del trimestre. Esto evita que los hospitales caigan en desabasto crónico o sufran mermas por caducidad en bodega.
                    </p>
                    <p className="bg-purple-50 text-purple-800 p-2.5 rounded-lg border border-purple-100 text-xs">
                      <strong>Cálculo:</strong> (Claves de Inventario con Cobertura 30-120 días / Total de Claves Activas) * 100
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-center space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                      <span>Métricas Logísticas</span>
                      <span>Valor Actual</span>
                    </div>
                    <div className="flex justify-between text-sm py-1 border-b border-slate-100">
                      <span className="text-slate-600">Claves en Rango Óptimo</span>
                      <span className="font-semibold text-gray-900">142 de 148 claves</span>
                    </div>
                    <div className="flex justify-between text-sm py-1 border-b border-slate-100">
                      <span className="text-slate-600">Tasa de Exceso / Caducidad</span>
                      <span className="font-semibold text-purple-600">0.02% (Casi Cero)</span>
                    </div>
                    <div className="flex justify-between text-sm py-1">
                      <span className="text-slate-600">Tasa de Desabasto Agudo</span>
                      <span className="font-bold text-purple-600">0%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Transfers Log and Management List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6 border-b pb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Registro de Transacciones de Traspaso</h3>
            <p className="text-xs text-gray-500 mt-0.5">Control de envíos, cadena de frío y firmas digitales.</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded border">
              Total: {filteredTransfers.length} traspasos
            </span>
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/70">
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
                        {transfer.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {transfer.status === 'shipping' && <Truck className="w-3 h-3 mr-1" />}
                        {transfer.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
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
