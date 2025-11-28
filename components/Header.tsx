import React from 'react';
import { ClipboardList, Phone, Mail } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="bg-blue-900 text-white p-2 rounded-lg">
               <span className="font-extrabold text-2xl tracking-tighter">ComBi</span>
               <span className="text-xs block text-blue-200 -mt-1 text-right">.com.gt</span>
            </div>
            <div className="hidden md:block border-l pl-3 ml-2 border-slate-300">
                <h1 className="text-lg font-bold text-slate-800">Levantamiento de Reclamos (RMA)</h1>
                <p className="text-xs text-slate-500">Uso exclusivo Ejecutivo de Ventas</p>
            </div>
          </div>
          
          <div className="text-right text-xs text-slate-500 space-y-1 hidden sm:block">
            <p className="font-semibold text-slate-700">8 calle 13-34 zona 8 Sector Granjas, Mixco</p>
            <div className="flex justify-end gap-4">
                <span className="flex items-center gap-1"><Phone size={12}/> (502) 2226-9499</span>
                <span className="flex items-center gap-1"><Mail size={12}/> info@combi.com.gt</span>
            </div>
          </div>
          
          <div className="sm:hidden">
              <ClipboardList className="text-blue-900" />
          </div>
        </div>
      </div>
    </header>
  );
};