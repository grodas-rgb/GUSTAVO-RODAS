import React from 'react';
import { ProductLine } from '../types';
import { Plus, Trash2, Package } from 'lucide-react';

interface SectionProductsProps {
  products: ProductLine[];
  setProducts: (products: ProductLine[]) => void;
}

export const SectionProducts: React.FC<SectionProductsProps> = ({ products, setProducts }) => {
  const addRow = () => {
    const newId = (products.length + 1).toString();
    setProducts([...products, { id: newId, code: '', description: '', qtyInvoiced: 0, qtyClaimed: 0, unit: 'Millar' }]);
  };

  const removeRow = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const updateRow = (id: string, field: keyof ProductLine, value: any) => {
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Package className="text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-800">2. Detalle del Producto Afectado</h3>
      </div>
      
      <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 bg-white">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-24">Código</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Descripción</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-24">Cant. Fact</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-24">Cant. Recl</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-28">Unidad</th>
              <th scope="col" className="px-3 py-3 relative w-10"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-2 py-2">
                  <input
                    type="text"
                    className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-1.5 border"
                    placeholder="Ej. 1020"
                    value={product.code}
                    onChange={(e) => updateRow(product.id, 'code', e.target.value)}
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="text"
                    className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-1.5 border"
                    placeholder="Descripción del producto"
                    value={product.description}
                    onChange={(e) => updateRow(product.id, 'description', e.target.value)}
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-1.5 border"
                    value={product.qtyInvoiced || ''}
                    onChange={(e) => updateRow(product.id, 'qtyInvoiced', parseFloat(e.target.value))}
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-1.5 border"
                    value={product.qtyClaimed || ''}
                    onChange={(e) => updateRow(product.id, 'qtyClaimed', parseFloat(e.target.value))}
                  />
                </td>
                <td className="px-2 py-2">
                  <select
                    className="w-full border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-1.5 border"
                    value={product.unit}
                    onChange={(e) => updateRow(product.id, 'unit', e.target.value)}
                  >
                    <option>Millar</option>
                    <option>Bulto</option>
                    <option>Kg</option>
                    <option>Unidad</option>
                  </select>
                </td>
                <td className="px-2 py-2 text-right">
                  <button
                    onClick={() => removeRow(product.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                    title="Eliminar fila"
                    disabled={products.length === 1}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <button
        onClick={addRow}
        className="mt-2 flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        <Plus size={16} className="mr-1" /> Agregar otro producto
      </button>
    </div>
  );
};