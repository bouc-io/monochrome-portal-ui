import { useState, useEffect, useCallback } from "react";
import { portalApiClient } from "./api";


export interface Instruction {
  id: string;
  title: string;
  content: string;
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInstructionRequest {
  title: string;
  content: string;
  priority: number;
  isActive: boolean;
}

export type UpdateInstructionRequest = Partial<CreateInstructionRequest>;

// Map snake_case backend response to camelCase frontend type
function mapInstruction(raw: Record<string, unknown>): Instruction {
  return {
    id: raw.id as string,
    title: raw.title as string,
    content: raw.content as string,
    priority: raw.priority as number,
    isActive: raw.is_active as boolean,
    createdAt: raw.created_at as string,
    updatedAt: raw.updated_at as string,
  };
}

export function useInstructionsApi() {
  const [instructions, setInstructions] = useState<Instruction[]>([]);

  useEffect(() => {
    portalApiClient
      .get("/v1/portal/instructions")
      .then((res) => setInstructions(res.data.instructions.map(mapInstruction)))
      .catch((err) => console.error("Failed to load instructions", err));
  }, []);

  const create = useCallback(async (data: CreateInstructionRequest): Promise<Instruction> => {
    const res = await portalApiClient.post("/v1/portal/instructions", {
      title: data.title,
      content: data.content,
      priority: data.priority,
      is_active: data.isActive,
    });
    const created = mapInstruction(res.data);
    setInstructions((prev) => [created, ...prev]);
    return created;
  }, []);

  const update = useCallback(async (id: string, data: UpdateInstructionRequest): Promise<Instruction> => {
    const body: Record<string, unknown> = {};
    if (data.title !== undefined) body.title = data.title;
    if (data.content !== undefined) body.content = data.content;
    if (data.priority !== undefined) body.priority = data.priority;
    if (data.isActive !== undefined) body.is_active = data.isActive;
    const res = await portalApiClient.put(`/v1/portal/instructions/${id}`, body);
    const updated = mapInstruction(res.data);
    setInstructions((prev) => prev.map((i) => (i.id === id ? updated : i)));
    return updated;
  }, []);

  const remove = useCallback(async (id: string): Promise<void> => {
    await portalApiClient.delete(`/v1/portal/instructions/${id}`);
    setInstructions((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const toggleActive = useCallback(async (id: string): Promise<Instruction> => {
    const res = await portalApiClient.patch(`/v1/portal/instructions/${id}/toggle`);
    const updated = mapInstruction(res.data);
    setInstructions((prev) => prev.map((i) => (i.id === id ? updated : i)));
    return updated;
  }, []);

  return { instructions, create, update, remove, toggleActive };
}
