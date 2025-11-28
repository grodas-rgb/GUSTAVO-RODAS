import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SectionProducts } from './components/SectionProducts';
import { TipCard } from './components/TipCard';
import { INITIAL_STATE, RMAFormState, Priority } from './types';
import { 
  Calendar, User, AlertCircle, FileText, Truck, 
  Factory, ShoppingCart, Camera, Save, CheckCircle2,
  HelpCircle, ChevronRight, ChevronLeft, Sparkles
} from 'lucide-react';
import { analyzeObservation } from './services/geminiService';

const SECTIONS = ['Datos Generales', 'Productos', 'Tipificación', 'Evidencia y Solución'];

export default function App() {
  const [formData, setFormData] = useState<RMAFormState>(INITIAL_STATE);
  const [currentStep, setCurrentStep] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{ category: string; reasoning: string } | null>(null);

  // Auto-scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleChange = (field: keyof RMAFormState, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProblemToggle = (problem: string) => {
    setFormData(prev => {
      const exists = prev.selectedProblems.includes(problem);
      if (exists) {
        return { ...prev, selectedProblems: prev.selectedProblems.filter(p => p !== problem) };
      }
      return { ...prev, selectedProblems: [...prev.selectedProblems, problem] };
    });
  };

  const handleAnalyze = async () => {
    if (!formData.observations || formData.observations.length < 5) return;
    
    setIsAnalyzing(true);
    setAiSuggestion(null);
    const result = await analyzeObservation(formData.observations);
    setIsAnalyzing(false);
    
    if (result) {
      setAiSuggestion(result);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 -z-10"></div>
        {SECTIONS.map((label, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 bg-slate-50 px-2">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                idx <= currentStep 
                  ? 'bg-blue-900 text-white' 
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {idx + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${idx <= currentStep ? 'text-blue-900' : 'text-slate-400'}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date & Priority */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
             <Calendar size={20} className="text-blue-600"/> Datos del Reporte
           </h3>
           
           <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Solicitud</label>
               <input 
                 type="date" 
                 value={formData.requestDate}
                 onChange={(e) => handleChange('requestDate', e.target.value)}
                 className="w-full rounded-md border-slate-300 border p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
               />
             </div>
             
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Prioridad</label>
               <div className="flex gap-4 mt-1">
                 <label className="flex items-center gap-2 cursor-pointer">
                   <input 
                     type="radio" 
                     name="priority"
                     checked={formData.priority === Priority.NORMAL}
                     onChange={() => handleChange('priority', Priority.NORMAL)}
                     className="text-blue-600 focus:ring-blue-500"
                   />
                   <span className="text-sm">Normal</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                   <input 
                     type="radio" 
                     name="priority"
                     checked={formData.priority === Priority.HIGH}
                     onChange={() => handleChange('priority', Priority.HIGH)}
                     className="text-red-600 focus:ring-red-500"
                   />
                   <span className="text-sm font-medium text-red-700">Alta (Riesgo Inocuidad)</span>
                 </label>
               </div>
             </div>

             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Vendedor Responsable</label>
               <div className="relative">
                 <User className="absolute left-3 top-2.5 text-slate-400" size={18} />
                 <input 
                   type="text" 
                   value={formData.salesPerson}
                   onChange={(e) => handleChange('salesPerson', e.target.value)}
                   className="w-full pl-10 rounded-md border-slate-300 border p-2 focus:ring-2 focus:ring-blue-500"
                   placeholder="Nombre del Ejecutivo"
                 />
               </div>
             </div>
           </div>
        </div>

        {/* Origin Data */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-2 h-full bg-amber-400"></div>
           <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
             <FileText size={20} className="text-amber-600"/> 1. Datos de Origen
           </h3>
           <p className="text-xs text-amber-700 mb-4 font-medium bg-amber-50 p-2 rounded">
             ⚠ Sin esta información, Bodega no puede iniciar la investigación.
           </p>

           <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
               <input 
                 type="text" 
                 value={formData.clientName}
                 onChange={(e) => handleChange('clientName', e.target.value)}
                 className="w-full rounded-md border-slate-300 border p-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                 placeholder="Nombre del cliente"
               />
             </div>
             
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Número de Factura / Remisión</label>
               <input 
                 type="text" 
                 value={formData.invoiceNumber}
                 onChange={(e) => handleChange('invoiceNumber', e.target.value)}
                 className="w-full rounded-md border-slate-300 border p-2 focus:ring-2 focus:ring-amber-500"
                 placeholder="Ej. A-4502"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Entrega</label>
               <div className="flex gap-2">
                <input 
                    type="date" 
                    value={formData.deliveryDate}
                    onChange={(e) => handleChange('deliveryDate', e.target.value)}
                    className="w-full rounded-md border-slate-300 border p-2 focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-xs text-slate-500 self-center whitespace-nowrap">(Valida garantía)</span>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
        <TipCard 
            type="info" 
            title="Diferencia Medida vs Calibre" 
            content="Recuerda: 'Medida' es Ancho y Largo (Ej. 20x30 cm). 'Calibre' es el grosor (Micras/Milésimas). Asegúrate de qué reclama el cliente." 
        />
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <SectionProducts products={formData.products} setProducts={(p) => handleChange('products', p)} />
            
            <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-sm font-medium text-slate-700 mb-3">¿El producto está completo y en su empaque original?</p>
                <div className="flex gap-6">
                    <button 
                        onClick={() => handleChange('isCompleteAndOriginal', true)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 ${formData.isCompleteAndOriginal === true ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-300 text-slate-600'}`}
                    >
                        <CheckCircle2 size={16} /> Sí, está completo
                    </button>
                    <button 
                        onClick={() => handleChange('isCompleteAndOriginal', false)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2 ${formData.isCompleteAndOriginal === false ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-slate-300 text-slate-600'}`}
                    >
                        <AlertCircle size={16} /> No (Explicar)
                    </button>
                </div>
                
                {formData.isCompleteAndOriginal === false && (
                    <div className="mt-3 animate-fade-in">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Explicación del estado del producto:</label>
                        <input 
                            type="text" 
                            className="w-full border-slate-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 text-sm p-2 border"
                            placeholder="Ej. El cliente tiró las cajas..."
                            value={formData.statusExplanation}
                            onChange={(e) => handleChange('statusExplanation', e.target.value)}
                        />
                    </div>
                )}
            </div>
        </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
        <h4 className="font-bold text-blue-900 mb-1">3. Tipificación del Problema</h4>
        <p className="text-sm text-blue-700">Seleccione la causa raíz aparente para dirigir el reclamo al área correcta.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Despacho */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
            <h5 className="font-bold text-slate-700 flex items-center gap-2 mb-3">
                <Truck className="text-blue-500" size={18} /> A. Error de Despacho / Bodega
            </h5>
            <div className="space-y-2">
                {[
                    { id: 'cruzado', label: 'Producto Cruzado (Ítem diferente al facturado)' },
                    { id: 'faltante', label: 'Faltante (Menos bultos de los facturados)' },
                    { id: 'sobrante', label: 'Sobrante (Mercadería de más no facturada)' }
                ].map(item => (
                    <label key={item.id} className="flex items-start gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={formData.selectedProblems.includes(item.id)}
                            onChange={() => handleProblemToggle(item.id)}
                            className="mt-1 rounded text-blue-600 focus:ring-blue-500" 
                        />
                        <span className="text-sm text-slate-600">{item.label}</span>
                    </label>
                ))}
            </div>
        </div>

        {/* Calidad */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:border-purple-300 transition-colors">
            <h5 className="font-bold text-slate-700 flex items-center gap-2 mb-3">
                <Factory className="text-purple-500" size={18} /> B. Calidad (Defecto Fábrica)
            </h5>
            <div className="space-y-2">
                {[
                    { id: 'medidas', label: 'Medidas Incorrectas (No corresponde a ficha)' },
                    { id: 'sellado', label: 'Falla de Sellado (Se abren fondo/costados)' },
                    { id: 'apariencia', label: 'Apariencia (Color, impresión, grumos)' },
                    { id: 'inocuidad', label: 'Olor/Contaminación (CRÍTICO)', critical: true }
                ].map(item => (
                    <label key={item.id} className={`flex items-start gap-2 p-2 rounded cursor-pointer ${item.critical ? 'bg-red-50 hover:bg-red-100 border border-red-100' : 'hover:bg-slate-50'}`}>
                        <input 
                            type="checkbox" 
                            checked={formData.selectedProblems.includes(item.id)}
                            onChange={() => handleProblemToggle(item.id)}
                            className={`mt-1 rounded text-blue-600 focus:ring-blue-500 ${item.critical ? 'text-red-600 focus:ring-red-500' : ''}`} 
                        />
                        <span className={`text-sm ${item.critical ? 'text-red-700 font-semibold' : 'text-slate-600'}`}>{item.label}</span>
                    </label>
                ))}
            </div>
        </div>

        {/* Transporte */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:border-amber-300 transition-colors">
            <h5 className="font-bold text-slate-700 flex items-center gap-2 mb-3">
                <Truck className="text-amber-500" size={18} /> C. Transporte / Entrega
            </h5>
            <div className="space-y-2">
                {[
                    { id: 'fisico', label: 'Daño Físico (Cajas aplastadas/mojadas)' },
                    { id: 'incompleto', label: 'Pedido Incompleto Ruta (Chofer no entregó todo)' }
                ].map(item => (
                    <label key={item.id} className="flex items-start gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={formData.selectedProblems.includes(item.id)}
                            onChange={() => handleProblemToggle(item.id)}
                            className="mt-1 rounded text-blue-600 focus:ring-blue-500" 
                        />
                        <span className="text-sm text-slate-600">{item.label}</span>
                    </label>
                ))}
            </div>
        </div>

        {/* Comercial */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:border-green-300 transition-colors">
            <h5 className="font-bold text-slate-700 flex items-center gap-2 mb-3">
                <ShoppingCart className="text-green-500" size={18} /> D. Error Comercial
            </h5>
            <div className="space-y-2">
                {[
                    { id: 'captura', label: 'Error de captura (Vendedor pidió código equivocado)' }
                ].map(item => (
                    <label key={item.id} className="flex items-start gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={formData.selectedProblems.includes(item.id)}
                            onChange={() => handleProblemToggle(item.id)}
                            className="mt-1 rounded text-blue-600 focus:ring-blue-500" 
                        />
                        <span className="text-sm text-slate-600">{item.label}</span>
                    </label>
                ))}
            </div>
        </div>
      </div>

       {/* AI Assistant Section */}
       <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200 mt-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={64} className="text-indigo-600" />
        </div>
        <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-600"/> Asistente IA de Tipificación
        </h3>
        <p className="text-sm text-indigo-700 mb-4">Si tienes dudas sobre cómo clasificar el problema, escribe los detalles abajo y deja que la IA sugiera la categoría.</p>
        
        <textarea
            className="w-full p-3 rounded-md border-indigo-200 focus:ring-indigo-500 focus:border-indigo-500 text-sm mb-3"
            rows={3}
            placeholder="Describe el problema aquí (ej. 'Las bolsas llegaron con un olor muy fuerte a humedad y el cliente las rechaza')..."
            value={formData.observations}
            onChange={(e) => handleChange('observations', e.target.value)}
        />
        <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || formData.observations.length < 5}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
            {isAnalyzing ? 'Analizando...' : 'Analizar con Gemini'}
            {!isAnalyzing && <Sparkles size={14}/>}
        </button>

        {aiSuggestion && (
            <div className="mt-4 bg-white p-4 rounded-lg border border-indigo-100 shadow-sm animate-fade-in">
                <p className="text-sm font-bold text-slate-700">Categoría Sugerida: <span className="text-indigo-600">{aiSuggestion.category}</span></p>
                <p className="text-xs text-slate-500 mt-1">{aiSuggestion.reasoning}</p>
            </div>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Evidencia */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Camera size={20} className="text-slate-600"/> 4. Evidencia Obligatoria
                </h3>
                <p className="text-xs text-red-500 mb-4 font-medium uppercase">Operaciones rechazará el reclamo si no se adjunta lo siguiente:</p>

                <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={formData.hasPhotoProduct}
                            onChange={(e) => handleChange('hasPhotoProduct', e.target.checked)}
                            className="w-5 h-5 rounded text-blue-600"
                        />
                        <span className="text-sm font-medium">1. Foto del Producto (Daño/Error)</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={formData.hasPhotoLabel}
                            onChange={(e) => handleChange('hasPhotoLabel', e.target.checked)}
                            className="w-5 h-5 rounded text-blue-600"
                        />
                        <div className="text-sm">
                            <span className="font-medium block">2. Foto Etiqueta Caja/Bulto</span>
                            <span className="text-xs text-slate-500">VITAL para ver el # LOTE</span>
                        </div>
                    </label>

                    <div className="p-3 border rounded-lg bg-slate-50">
                        <label className="flex items-center gap-3 cursor-pointer mb-2">
                            <input 
                                type="checkbox" 
                                checked={formData.hasPhysicalSample}
                                onChange={(e) => handleChange('hasPhysicalSample', e.target.checked)}
                                className="w-5 h-5 rounded text-blue-600"
                            />
                            <div className="text-sm">
                                <span className="font-medium block">3. Muestra Física</span>
                                <span className="text-xs text-slate-500">(Calidad/Sellado/Medidas)</span>
                            </div>
                        </label>
                        {formData.hasPhysicalSample && (
                            <div className="ml-8 mt-2 flex gap-4 text-xs">
                                <span className="text-slate-600 font-medium">¿Ya se recogió?</span>
                                <label className="flex items-center gap-1 cursor-pointer">
                                    <input type="radio" name="sample" checked={formData.sampleCollected === true} onChange={() => handleChange('sampleCollected', true)} /> SÍ
                                </label>
                                <label className="flex items-center gap-1 cursor-pointer">
                                    <input type="radio" name="sample" checked={formData.sampleCollected === false} onChange={() => handleChange('sampleCollected', false)} /> NO
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Solución */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-green-600"/> 5. Solución Esperada
                </h3>
                <p className="text-sm text-slate-500 mb-4">¿Qué negociación se hizo con el cliente?</p>

                <div className="space-y-3">
                    {[
                        { id: 'mano_a_mano', label: 'Cambio Mano a Mano', desc: 'Recoger malo y entregar bueno simultáneamente.' },
                        { id: 'reposicion', label: 'Reposición Posterior', desc: 'Recoger, revisar en bodega y enviar después.' },
                        { id: 'nota_credito', label: 'Nota de Crédito', desc: 'Cliente quiere descuento en su saldo.' },
                        { id: 'descuento', label: 'Descuento Comercial', desc: 'Se queda producto con descuento (Defectos estéticos).' }
                    ].map(sol => (
                         <label key={sol.id} className={`block p-3 border rounded-lg cursor-pointer transition-all ${formData.expectedSolution === sol.id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'hover:border-blue-300'}`}>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="radio" 
                                    name="solution"
                                    checked={formData.expectedSolution === sol.id}
                                    onChange={() => handleChange('expectedSolution', sol.id)}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <div>
                                    <span className="text-sm font-bold text-slate-800 block">{sol.label}</span>
                                    <span className="text-xs text-slate-500">{sol.desc}</span>
                                </div>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </div>

        {/* Observations Final */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <h3 className="text-lg font-semibold text-slate-800 mb-2">6. Observaciones Adicionales</h3>
             <textarea
                className="w-full p-3 rounded-md border-slate-300 border focus:ring-blue-500 focus:border-blue-500 text-sm"
                rows={4}
                placeholder="Detalles específicos que ayuden a bodega a entender el problema..."
                value={formData.observations}
                onChange={(e) => handleChange('observations', e.target.value)}
            />
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Nueva Solicitud RMA</h2>
            <button 
                onClick={() => setShowGuide(!showGuide)}
                className="text-sm font-medium text-blue-700 flex items-center gap-1 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
            >
                <HelpCircle size={18} /> {showGuide ? 'Ocultar Guía' : 'Ver Guía del Vendedor'}
            </button>
        </div>

        {showGuide && (
            <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-l-blue-500 mb-8 animate-fade-in">
                <h3 className="font-bold text-lg mb-4 text-slate-800">Guía Rápida para el Vendedor</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <TipCard title="1. El Lote es la Clave" content="Operaciones necesita el número de lote para saber qué máquinas revisar. Sin lote, no hay rastreo." />
                    <TipCard title="2. Inocuidad = ALERTA ROJA" type="critical" content="Insectos, suciedad o mal olor dentro del empaque. NO esperes al formulario, llama a Gerencia de Operaciones ya." />
                    <TipCard title="3. Política de Devolución" type="warning" content="No prometas recibir producto sucio o usado (salvo defecto de fábrica). Bodega lo rechazará." />
                    <div className="bg-slate-50 p-4 rounded text-sm text-slate-600">
                        <strong>Recuerda:</strong> Un formulario bien llenado agiliza tu respuesta y la de tu cliente.
                    </div>
                </div>
            </div>
        )}

        {renderStepIndicator()}

        <form onSubmit={(e) => e.preventDefault()}>
            {currentStep === 0 && renderStep1()}
            {currentStep === 1 && renderStep2()}
            {currentStep === 2 && renderStep3()}
            {currentStep === 3 && renderStep4()}
        </form>

        <div className="mt-8 flex justify-between pt-6 border-t border-slate-200">
            <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                    currentStep === 0 
                    ? 'text-slate-300 cursor-not-allowed' 
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm'
                }`}
            >
                <ChevronLeft size={18} /> Anterior
            </button>
            
            {currentStep < SECTIONS.length - 1 ? (
                <button
                    onClick={() => setCurrentStep(Math.min(SECTIONS.length - 1, currentStep + 1))}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium bg-blue-900 text-white hover:bg-blue-800 shadow-md transition-all transform hover:scale-105"
                >
                    Siguiente <ChevronRight size={18} />
                </button>
            ) : (
                <button
                    onClick={() => alert("Formulario enviado correctamente (Simulación)")}
                    className="flex items-center gap-2 px-8 py-2.5 rounded-lg font-bold bg-green-600 text-white hover:bg-green-700 shadow-md transition-all transform hover:scale-105"
                >
                    <Save size={18} /> Finalizar y Enviar
                </button>
            )}
        </div>
      </main>
    </div>
  );
}