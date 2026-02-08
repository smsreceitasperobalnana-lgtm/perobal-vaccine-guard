// Configuração da API do Google Apps Script
export const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/SEU_SCRIPT_ID_AQUI/exec';

// Função auxiliar para fazer requisições à API
async function callAppsScriptAPI(action: string, params: Record<string, any> = {}) {
    const url = new URL(GOOGLE_APPS_SCRIPT_URL);
    url.searchParams.append('action', action);

    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
}

// Funções da API
export const api = {
    // Obter dados de uma aba
    getData: (sheetName: string) =>
        callAppsScriptAPI('getData', { sheet: sheetName }),

    // Sincronizar dados
    syncData: (sheetName: string, data: any[]) =>
        callAppsScriptAPI('syncData', { sheet: sheetName, data }),

    // Registrar log
    logAction: (action: string, details: string) =>
        callAppsScriptAPI('logAction', { action, details }),
};
