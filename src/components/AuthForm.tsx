import React, { useState } from 'react';
import { Building2, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useHospitals } from '../hooks/useHospitals';

interface AuthFormProps {
  onSuccess: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signIn } = useAuth();
  const { hospitals, loading: loadingHospitals } = useHospitals();

  const handleHospitalLogin = async (hospitalId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await signIn('', '', hospitalId);

      if (error) {
        setError(error?.message || 'Error de inicio de sesión');
      } else {
        onSuccess();
      }
    } catch (err) {
      setError('Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <img src="/logos/LogoRETMI.png" alt="RETMI Logo" className="w-20 h-20 object-contain" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-1">RETMI</h1>
            <p className="text-sm text-gray-600">
              Red de Traspaso de Medicamentos e Insumos
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
              Selecciona tu hospital para acceder
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {loading || loadingHospitals ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-3">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-sm text-gray-500">Cargando hospitales...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {hospitals.map((hospital) => (
                  <button
                    key={hospital.id}
                    onClick={() => handleHospitalLogin(hospital.id)}
                    className="flex items-center p-4 border border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50/30 text-left transition-all duration-150 group shadow-sm hover:shadow-md active:scale-[0.99]"
                  >
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-150 mr-4">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {hospital.name}
                      </h3>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {hospital.city}, {hospital.state}
                      </p>
                      <div className="flex items-center space-x-2 mt-1.5">
                        <span className="inline-block bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded-full capitalize">
                          {hospital.type === 'public' ? 'Público' : hospital.type === 'private' ? 'Privado' : 'Universitario'}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {hospital.beds} camas
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};