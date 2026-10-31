import type {
  ProviderAuthMethod,
  ProviderAuthResponse,
  ProviderListResponse,
} from "@opencode-ai/sdk/v2/client";
import { useQuery } from "@tanstack/react-query";

import { loadConfig } from "@/lib/config";
import { providerDisplayName } from "@/lib/providerAuth";
import { qk } from "@/lib/queryKeys";
import { useOpenCodeClient } from "@/providers/OpenCodeClientProvider";
import type { ModelInfo, ProviderInfo } from "@/types";
import type { AppConfig } from "@/types/desktop";

type ProvidersData = ProviderListResponse & {
  authMethods?: Record<string, ProviderAuthMethod[]>;
};

function useProvidersQuery() {
  const { client } = useOpenCodeClient();

  return useQuery<ProvidersData>({
    queryKey: qk.providers,
    queryFn: async () => {
      if (!client) throw new Error("No client");
      const [provRes, authRes] = await Promise.all([
        client.provider.list({}, { throwOnError: true }),
        client.provider
          .auth({}, { throwOnError: true })
          .catch(() => ({ data: undefined as ProviderAuthResponse | undefined })),
      ]);
      if (!provRes.data) throw new Error("No provider data");
      if (authRes.data) {
        return { ...provRes.data, authMethods: authRes.data };
      }
      return provRes.data;
    },
    enabled: !!client,
  });
}

export function useAllProviders(): ProviderInfo[] {
  const { data } = useProvidersQuery();
  const { data: config } = useQuery<AppConfig>({
    queryKey: qk.config,
    queryFn: loadConfig,
  });

  const baseProviders: ProviderInfo[] = data?.all
    ? data.all.map((p) => ({ id: p.id, name: p.name, env: p.env, source: p.source }))
    : [];

  if (!config?.customProviders) return baseProviders;

  const existingIds = new Set(baseProviders.map((p) => p.id));
  const customAsProviders: ProviderInfo[] = config.customProviders
    .filter((cp) => cp.enabled && !existingIds.has(cp.id))
    .map((cp) => ({
      id: cp.id,
      name: cp.name,
      env: [],
      source: "api" as const,
    }));

  return [...baseProviders, ...customAsProviders];
}

/** OpenCode's provider list as it comes, with each model's full details. */
export function useProviderList(): ProviderListResponse | undefined {
  return useProvidersQuery().data;
}

export function useConnectedProviders(): string[] {
  const { data } = useProvidersQuery();
  const { data: config } = useQuery<AppConfig>({
    queryKey: qk.config,
    queryFn: loadConfig,
  });
  const customIds = (config?.customProviders ?? [])
    .filter((cp) => cp.enabled)
    .map((cp) => cp.id);
  const connected = data?.connected ?? [];
  return Array.from(new Set([...connected, ...customIds]));
}

export function useAllModels(): ModelInfo[] {
  const { data } = useProvidersQuery();
  const { data: config } = useQuery<AppConfig>({
    queryKey: qk.config,
    queryFn: loadConfig,
  });
  const models: ModelInfo[] = [];
  const seenModelKeys = new Set<string>();

  if (data?.all) {
    for (const provider of data.all) {
      for (const model of Object.values(provider.models)) {
        seenModelKeys.add(`${provider.id}/${model.id}`);
        models.push({
          id: model.id,
          name: model.name,
          providerId: provider.id,
          providerName: providerDisplayName(provider),
          status: model.status,
          variants: model.variants,
        });
      }
    }
  }

  if (config?.customProviders) {
    for (const cp of config.customProviders) {
      if (!cp.enabled) continue;
      for (const modelId of cp.models) {
        const key = `${cp.id}/${modelId}`;
        if (!seenModelKeys.has(key)) {
          seenModelKeys.add(key);
          models.push({
            id: modelId,
            name: modelId,
            providerId: cp.id,
            providerName: cp.name,
            status: "active",
          });
        }
      }
    }
  }

  return models;
}

export function useAuthMethods(): Record<string, ProviderAuthMethod[]> {
  const { data } = useProvidersQuery();
  return data?.authMethods ?? {};
}
