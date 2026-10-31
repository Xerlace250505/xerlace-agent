import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchConfig, loadConfig } from "@/lib/config";
import { qk } from "@/lib/queryKeys";
import type { CustomProvider } from "@/types/desktop";

export function useAddCustomProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (provider: Omit<CustomProvider, "id">) => {
      const config = await loadConfig();
      const id = crypto.randomUUID();
      const next: CustomProvider[] = [
        ...(config.customProviders ?? []),
        { ...provider, id },
      ];
      await patchConfig({ customProviders: next });
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.config });
    },
  });
}

export function useUpdateCustomProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Omit<CustomProvider, "id">> }) => {
      const config = await loadConfig();
      const next = (config.customProviders ?? []).map((cp) =>
        cp.id === id ? { ...cp, ...patch } : cp,
      );
      await patchConfig({ customProviders: next });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.config });
    },
  });
}

export function useRemoveCustomProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const config = await loadConfig();
      const next = (config.customProviders ?? []).filter((cp) => cp.id !== id);
      await patchConfig({ customProviders: next });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.config });
    },
  });
}
