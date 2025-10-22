import api from "../../../api/api";
import { type Vehicle, type VehicleForm } from "../dialog/index";

export async function listarVeiculos(): Promise<Vehicle[]> {
  const { data } = await api.get("/veiculos");
  return data.map((v: any) => ({
    id: String(v.id),
    cliente: v.cliente?.nome ?? "",
    marca: v.marca,
    modelo: v.modelo,
    ano: v.ano,
    placa: v.placa,
    cor: v.cor,
    createdAt: v.created_at,
  }));
}

export async function getVeiculo(id: string): Promise<Vehicle> {
  const { data: v } = await api.get(`/veiculos/${id}`);
  return {
    id: String(v.id),
    cliente: v.cliente?.nome ?? "",
    marca: v.marca,
    modelo: v.modelo,
    ano: v.ano,
    placa: v.placa,
    cor: v.cor,
    createdAt: v.created_at,
  };
}

export async function criarVeiculo(data: VehicleForm): Promise<Vehicle> {
  const payload = {
    cliente_id: Number(data.cliente_id), // ⚠️ agora obrigatório
    marca: data.marca,
    modelo: data.modelo,
    ano: data.ano ? Number(data.ano) : null,
    placa: data.placa,
    cor: data.cor || null,
  };

  const { data: v } = await api.post("/veiculos", payload);
  return {
    id: String(v.id),
    cliente: v.cliente?.nome ?? "",
    marca: v.marca,
    modelo: v.modelo,
    ano: v.ano,
    placa: v.placa,
    cor: v.cor,
    createdAt: v.created_at,
  };
}

export async function atualizarVeiculo(id: string, data: VehicleForm): Promise<Vehicle> {
  const payload = {
    cliente_id: Number(data.cliente_id),
    marca: data.marca,
    modelo: data.modelo,
    ano: data.ano ? Number(data.ano) : null,
    placa: data.placa,
    cor: data.cor || null,
  };

  const { data: v } = await api.put(`/veiculos/${id}`, payload);
  return {
    id: String(v.id),
    cliente: v.cliente?.nome ?? "",
    marca: v.marca,
    modelo: v.modelo,
    ano: v.ano,
    placa: v.placa,
    cor: v.cor,
    createdAt: v.created_at,
  };
}

export async function excluirVeiculo(id: string): Promise<void> {
  await api.delete(`/veiculos/${id}`);
}