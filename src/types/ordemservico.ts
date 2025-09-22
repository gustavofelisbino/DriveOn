export type OsStatus = "aberta" | "finalizada" | "cancelada";
export type OsTipo = "servico" | "manutencao";

export type ItemOsDto = {
  itemId?: number | null;
  descricao?: string | null;
  quantidade: number;
  precoUnitario: number;
};

export type OrdemServicoCriarDto = {
  tipo: OsTipo;                // controller aceita 'servico' | 'manutencao'
  clienteId: number;
  veiculoId: number;
  descricao?: string | null;
  descontoValor: number;
  itens: ItemOsDto[];
};

export type OrdemServicoListaDto = {
  id: number;
  status: OsStatus;
  tipo: OsTipo;
  valorTotal: number;
  abertaEm: string; // ISO
  clienteId: number;
  veiculoId: number;
};

// detalhe retornado por GET /api/ordens-servico/{id}
export type OrdemServicoDetalhe = OrdemServicoListaDto & {
  descricao?: string | null;
  descontoValor: number;
  itens: {
    id: number;
    itemId?: number | null;
    descricao?: string | null;
    quantidade: number;
    precoUnitario: number;
    total: number;
  }[];
};
