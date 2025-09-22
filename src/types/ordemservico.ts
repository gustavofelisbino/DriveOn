export type TaskStatus = 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
export type TaskPriority = 'baixa' | 'media' | 'alta';

export type TaskListDto = {
  id: number;
  titulo: string;
  status: TaskStatus;
  prioridade: TaskPriority;
  venceEm?: string | null;     // ISO
  ordemServicoId?: number | null;
  clienteId?: number | null;
  criadoEm: string;            // ISO
};

export type TaskDetalhe = {
  id: number;
  titulo: string;
  descricao?: string | null;
  status: TaskStatus;
  prioridade: TaskPriority;
  venceEm?: string | null;     // ISO
  ordemServicoId?: number | null;
  clienteId?: number | null;
  criadoEm: string;            // ISO
  atualizadoEm: string;        // ISO
};

export type TaskCreateDto = {
  titulo: string;
  descricao?: string;
  prioridade: TaskPriority;
  venceEm?: string | null;     // ISO (datetime)
  ordemServicoId?: number | null;
  clienteId?: number | null;
};

export type TaskUpdateDto = {
  titulo: string;
  descricao?: string;
  prioridade: TaskPriority;
  status: TaskStatus;
  venceEm?: string | null;
  ordemServicoId?: number | null;
  clienteId?: number | null;
};
