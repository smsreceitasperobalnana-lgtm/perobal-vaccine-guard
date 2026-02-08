---
description: Deploy do frontend no Vercel e configuração da API do Google Apps Script
---

# Workflow: Deploy do SGI Perobal

Este workflow configura o deploy do frontend React no Vercel e a integração com o backend do Google Apps Script.

## Pré-requisitos

- Conta no Vercel (grátis): <https://vercel.com>
- Repositório no GitHub com o código
- Google Apps Script configurado

## Passo 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

## Passo 2: Login no Vercel

// turbo

```bash
vercel login
```

## Passo 3: Deploy Inicial

// turbo

```bash
vercel
```

Responda as perguntas:

- Set up and deploy? **Y**
- Which scope? Escolha sua conta
- Link to existing project? **N**
- Project name? **perobal-vaccine-guard**
- Directory? **./**
- Override settings? **N**

## Passo 4: Deploy em Produção

// turbo

```bash
vercel --prod
```

## Passo 5: Configurar Google Apps Script

1. Abra seu projeto no Google Apps Script
2. Modifique o arquivo `02_MOTOR_BACKEND.gs`:

```javascript
function doGet(e) {
  // Se for requisição de API
  if (e.parameter.action) {
    return handleApiRequest(e);
  }
  
  // Redirecionar para frontend no Vercel
  return HtmlService.createHtmlOutput(
    '<script>window.location.href="https://SEU_APP.vercel.app"</script>'
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

1. Implante como Web App:
   - Clique em **Implantar** > **Nova implantação**
   - Tipo: **Aplicativo da Web**
   - Executar como: **Eu**
   - Quem tem acesso: **Qualquer pessoa**
   - Copie a URL gerada

## Passo 6: Atualizar URL da API no Frontend

Edite `src/config/api.ts` e substitua `SEU_SCRIPT_ID_AQUI` pela URL do Apps Script.

## Passo 7: Fazer Commit e Push

```bash
git add .
git commit -m "feat: configurar deploy no Vercel e API do Apps Script"
git push origin main
```

O Vercel fará deploy automático!

## Passo 8: Testar

Acesse a URL do Vercel e teste a aplicação.

## Comandos Úteis

- Ver logs: `vercel logs`
- Listar deploys: `vercel ls`
- Remover projeto: `vercel remove`
