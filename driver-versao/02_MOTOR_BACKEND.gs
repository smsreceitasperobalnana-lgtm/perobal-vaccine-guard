/**
 * SGI PNI Perobal - Backend (Code.gs)
 * Versão: 3.1.0 (Otimizada para React State Sync)
 */

const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('SGI PNI Perobal')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Sincroniza o estado completo de uma aba (Substitui o conteúdo atual)
 */
function syncDataFromApp(sheetName, dataArray) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    
    if (dataArray.length === 0) return { success: true, count: 0 };

    // Extrai cabeçalhos do primeiro objeto
    const headers = Object.keys(dataArray[0]);
    
    // Converte array de objetos para array de arrays (linhas do Sheets)
    const rows = dataArray.map(item => headers.map(h => {
      let val = item[h];
      // Converte objetos/arrays para string para não quebrar o Sheets
      return (typeof val === 'object') ? JSON.stringify(val) : val;
    }));

    // Limpa e escreve
    sheet.clear();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    }
    
    // Log de Sincronização
    logAction("Sistema", "SYNC", `Sincronizada aba ${sheetName} com ${dataArray.length} registros.`);
    
    return { success: true, count: dataArray.length };
  } catch (e) {
    logAction("Sistema", "ERROR", `Falha na sincronização de ${sheetName}: ` + e.toString());
    return { success: false, error: e.toString() };
  }
}

/**
 * Busca dados de uma aba.
 */
function getDataFromSheet(sheetName) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return [];
    
    const range = sheet.getDataRange();
    if (range.getNumRows() < 2) return []; // Somente cabeçalho ou vazio

    const values = range.getValues();
    const headers = values[0];
    const data = values.slice(1).map(row => {
      let obj = {};
      headers.forEach((header, i) => {
        let val = row[i];
        // Tenta fazer o parse de JSON se parecer um objeto salvo
        if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
          try { val = JSON.parse(val); } catch(err) { /* mantém como string */ }
        }
        obj[header] = val;
      });
      return obj;
    });
    return data;
  } catch (e) {
    return [];
  }
}

/**
 * Auditoria
 */
function logAction(usuario, acao, detalhe) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName('Log_Sistema');
    if (!sheet) {
      sheet = ss.insertSheet('Log_Sistema');
      sheet.appendRow(['ID', 'Data', 'Usuário', 'Ação', 'Detalhe']);
    }
    sheet.appendRow([Utilities.getUuid(), new Date(), usuario, acao, detalhe]);
  } catch (e) {
    console.error("Erro ao registrar LOG:", e);
  }
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
