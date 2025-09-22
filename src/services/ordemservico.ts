import { api } from "../lib/api";
import type {
    OrdemServicoCriarDto,
    OrdemServicoDetalhe,
    OrdemServicoListaDto,
} from "../types/ordemservico";

export async function listarOrdens(params?: {
  status?: "aberta" | "finalizada" | "cancelada";
  clienteId?: number;
  veiculoId?: number;
}) {
  const { data } = await api.get<OrdemServicoListaDto[]>("/api/ordens-servico", { params });
  return data;
}

export async function obterOrdem(id: number) {
  const { data } = await api.get<OrdemServicoDetalhe>(`/api/ordens-servico/${id}`);
  return data;
}

export async function criarOrdem(dto: OrdemServicoCriarDto) {
  const { data } = await api.post("/api/ordens-servico", dto);
  return data; // OrdemServico criada
}

export async function finalizarOrdem(id: number) {
  await api.put(`/api/ordens-servico/${id}/finalizar`);
}

export async function excluirOrdem(id: number) {
  await api.delete(`/api/ordens-servico/${id}`);
}
