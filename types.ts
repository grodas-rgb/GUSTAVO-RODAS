export enum Priority {
    NORMAL = 'Normal',
    HIGH = 'Alta (Riesgo de Inocuidad/Cliente Clave)'
  }
  
  export enum ProblemCategory {
    DISPATCH = 'ERROR DE DESPACHO / BODEGA',
    QUALITY = 'CALIDAD DEL PRODUCTO (Defecto de Fábrica)',
    TRANSPORT = 'TRANSPORTE / ENTREGA',
    COMMERCIAL = 'ERROR COMERCIAL (Ventas)',
    UNSPECIFIED = 'POR DEFINIR'
  }
  
  export interface ProductLine {
    id: string;
    code: string;
    description: string;
    qtyInvoiced: number;
    qtyClaimed: number;
    unit: string;
  }
  
  export interface RMAFormState {
    // Section 1
    requestDate: string;
    salesPerson: string;
    priority: Priority;
    
    // Section 2: Origin
    clientName: string;
    invoiceNumber: string;
    deliveryDate: string;
  
    // Section 2.5: Product Status
    isCompleteAndOriginal: boolean | null;
    statusExplanation: string;
  
    // Section 3: Products
    products: ProductLine[];
  
    // Section 4: Typification
    selectedProblems: string[];
    
    // Section 5: Evidence Checklist
    hasPhotoProduct: boolean;
    hasPhotoLabel: boolean;
    hasPhysicalSample: boolean;
    sampleCollected: boolean | null;
  
    // Section 6: Solution
    expectedSolution: string;
    
    // Section 7: Observations
    observations: string;
  }
  
  export const INITIAL_STATE: RMAFormState = {
    requestDate: new Date().toISOString().split('T')[0],
    salesPerson: '',
    priority: Priority.NORMAL,
    clientName: '',
    invoiceNumber: '',
    deliveryDate: '',
    isCompleteAndOriginal: null,
    statusExplanation: '',
    products: [{ id: '1', code: '', description: '', qtyInvoiced: 0, qtyClaimed: 0, unit: 'Millar' }],
    selectedProblems: [],
    hasPhotoProduct: false,
    hasPhotoLabel: false,
    hasPhysicalSample: false,
    sampleCollected: null,
    expectedSolution: '',
    observations: ''
  };