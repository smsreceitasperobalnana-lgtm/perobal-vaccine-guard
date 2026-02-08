---
description: Deploy do frontend no Google Cloud Run
---

# Workflow: Deploy no Google Cloud Run

Deploy do SGI Perobal usando Google Cloud Run (grátis até certo limite).

## Pré-requisitos

- Conta Google Cloud (você já tem!)
- `gcloud` CLI instalado

## Passo 1: Instalar Google Cloud SDK

Baixe e instale: <https://cloud.google.com/sdk/docs/install>

Ou via PowerShell:

```powershell
(New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
& $env:Temp\GoogleCloudSDKInstaller.exe
```

## Passo 2: Login e Configuração

// turbo

```bash
gcloud auth login
```

// turbo

```bash
gcloud config set project SEU_PROJECT_ID
```

## Passo 3: Habilitar APIs Necessárias

// turbo

```bash
gcloud services enable run.googleapis.com containerregistry.googleapis.com cloudbuild.googleapis.com
```

## Passo 4: Build e Deploy

// turbo

```bash
gcloud run deploy perobal-vaccine-guard --source . --region=southamerica-east1 --allow-unauthenticated --platform=managed
```

**Parâmetros:**

- `--source .` = Build direto do código fonte
- `--region=southamerica-east1` = São Paulo (mais próximo)
- `--allow-unauthenticated` = Acesso público
- `--platform=managed` = Cloud Run gerenciado

## Passo 5: Obter URL do Deploy

Após o deploy, você receberá uma URL como:

```
https://perobal-vaccine-guard-HASH-rj.a.run.app
```

## Passo 6: Configurar Backend no Apps Script

Edite `driver-versao/02_MOTOR_BACKEND.gs`:

```javascript
function doGet(e) {
  if (e.parameter.action) {
    return handleApiRequest(e);
  }
  
  return HtmlService.createHtmlOutput(
    '<script>window.location.href="https://perobal-vaccine-guard-HASH-rj.a.run.app"</script>'
  );
}

function handleApiRequest(e) {
  const action = e.parameter.action;
  let result;
  
  switch(action) {
    case 'getData':
      result = getDataFromSheet(e.parameter.sheet);
      break;
    case 'syncData':
      result = syncDataFromApp(e.parameter.sheet, JSON.parse(e.parameter.data));
      break;
    case 'logAction':
      result = registrarLog(e.parameter.action, e.parameter.details);
      break;
    default:
      result = { error: 'Invalid action' };
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Passo 7: Atualizar URL da API no Frontend

Edite `src/config/api.ts` e substitua pela URL do seu Apps Script.

## Passo 8: Fazer Novo Deploy

```bash
git add .
git commit -m "feat: configurar deploy no Google Cloud Run"
git push origin main
gcloud run deploy perobal-vaccine-guard --source . --region=southamerica-east1
```

## Comandos Úteis

```bash
# Ver logs
gcloud run services logs read perobal-vaccine-guard --region=southamerica-east1

# Listar serviços
gcloud run services list

# Deletar serviço
gcloud run services delete perobal-vaccine-guard --region=southamerica-east1

# Ver detalhes
gcloud run services describe perobal-vaccine-guard --region=southamerica-east1
```

## Custos

**Nível Gratuito do Cloud Run:**

- 2 milhões de requisições/mês
- 360.000 GB-segundos de memória/mês
- 180.000 vCPU-segundos/mês

Para um sistema pequeno/médio, **provavelmente será grátis**!
