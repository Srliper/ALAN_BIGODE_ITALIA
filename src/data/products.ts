// Produtos à venda (pomadas, modeladores…). Ficam no painel admin, aba Produtos.
// Sem Supabase configurado a loja fica escondida, para nunca mostrar preço inventado.
export interface Product {
  id: string;
  name: string;
  description: string;
  priceValue: number;
  image: string;
  category: string;
  inStock: boolean;
}

export const defaultProducts: Product[] = [];
