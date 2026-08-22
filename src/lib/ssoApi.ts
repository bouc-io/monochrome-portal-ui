import { useState, useCallback } from "react";

export type SSOProtocol = "oidc" | "saml";
export type SSOStatus = "configured" | "not_configured" | "error";

export interface OIDCConfig {
  issuerUrl: string;
  clientId: string;
  clientSecret: string;
  discoveryUrl: string;
  scopes: string;
}

export interface SAMLConfig {
  entityId: string;
  ssoUrl: string;
  certificate: string;
  metadataUrl: string;
}

export interface SSOConfiguration {
  protocol: SSOProtocol;
  status: SSOStatus;
  oidc?: OIDCConfig;
  saml?: SAMLConfig;
  lastUpdated?: string;
}

const DEFAULT_SSO: SSOConfiguration = {
  protocol: "oidc",
  status: "not_configured",
  oidc: { issuerUrl: "", clientId: "", clientSecret: "", discoveryUrl: "", scopes: "openid profile email" },
  saml: { entityId: "", ssoUrl: "", certificate: "", metadataUrl: "" },
};

export function useSSOApi() {
  const [config, setConfig] = useState<SSOConfiguration>({ ...DEFAULT_SSO });

  const getConfig = useCallback(async (): Promise<SSOConfiguration> => {
    // Mock: return current state. Replace with API call.
    return config;
  }, [config]);

  const saveConfig = useCallback(async (data: SSOConfiguration): Promise<SSOConfiguration> => {
    const updated = { ...data, lastUpdated: new Date().toISOString(), status: "configured" as SSOStatus };
    setConfig(updated);
    return updated;
  }, []);

  const testConnection = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    // Mock test
    await new Promise((r) => setTimeout(r, 1500));
    return { success: true, message: "Connection successful" };
  }, []);

  return { config, setConfig, getConfig, saveConfig, testConnection };
}
