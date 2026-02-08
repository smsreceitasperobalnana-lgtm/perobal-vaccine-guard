/**
 * SGI Perobal - Script de Configuração Inicial
 * Este script cria todas as abas e cadastra as 30 vacinas oficiais do PNI 2025.
 * 
 * INSTRUÇÕES:
 * 1. Abra sua Planilha Google.
 * 2. Vá em Extensões > Apps Script.
 * 3. Delete todo o código atual e cole este script.
 * 4. Selecione a função 'setupSGI' e clique em 'Executar'.
 */

function setupSGI() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Definição das Abas
  const sheets = [
    { name: 'Usuarios', headers: ['usuario', 'senha_hash', 'nivel', 'unidade', 'email'] },
    { name: 'Vacinas', headers: ['id_vacina', 'vacina_nome', 'fabricante', 'via', 'doses_por_frasco', 'observacoes'] },
    { name: 'Lotes', headers: ['id_lote', 'id_vacina', 'numero_lote', 'validade', 'quantidade_atual'] },
    { name: 'Entradas_Estaduais', headers: ['id_ent', 'data', 'id_vacina', 'numero_lote', 'validade', 'qtde', 'nota_fiscal', 'usuario'] },
    { name: 'Saidas_UBS', headers: ['id_saida', 'data', 'unidade_destino', 'id_vacina', 'numero_lote', 'qtde', 'guia_remessa', 'usuario'] },
    { name: 'Aplicacoes', headers: ['id_app', 'data', 'unidade', 'faixa_etaria', 'dose_tipo', 'vacina_nome', 'numero_lote', 'quantidade', 'usuario'] },
    { name: 'Perdas', headers: ['id_perda', 'data', 'unidade', 'vacina_nome', 'numero_lote', 'quantidade', 'motivo', 'usuario', 'observacoes'] },
    { name: 'Log_Sistema', headers: ['id_log', 'data_hora', 'usuario', 'acao', 'detalhe'] }
  ];

  sheets.forEach(s => {
    let sheet = ss.getSheetByName(s.name);
    if (!sheet) {
      sheet = ss.insertSheet(s.name);
    } else {
      sheet.clear();
    }
    sheet.appendRow(s.headers);
    sheet.getRange(1, 1, 1, s.headers.length).setFontWeight('bold').setBackground('#f3f3f3');
    sheet.setFrozenRows(1);
  });

  // 2. Cadastro das 30 Vacinas Oficiais (PNI 2025)
  const vacinas = [
    ['V01', 'BCG', 'Serum Institute', 'ID', '10', 'Ao nascer'],
    ['V02', 'Hepatite B', 'Butantan', 'IM', '20', 'Ao nascer / 3 doses'],
    ['V03', 'Pentavalente', 'Serum Institute', 'IM', '10', '2, 4, 6 meses'],
    ['V04', 'VIP (Pólio inativada)', 'Bio-Manguinhos', 'IM', '1', '2, 4, 6 meses + reforços'],
    ['V05', 'VRH (Rotavírus)', 'Bio-Manguinhos', 'Oral', '1', '2, 4 meses'],
    ['V06', 'VPC10 (Pneumocócica)', 'Bio-Manguinhos', 'IM', '1', '2, 4 meses + reforço'],
    ['V07', 'Men C (Meningocócica)', 'FUNED', 'IM', '1', '3, 5 meses + reforço'],
    ['V08', 'Influenza Trivalente', 'Butantan', 'IM', '10', 'Anual'],
    ['V09', 'COVID-19 (Pfizer Baby)', 'Pfizer', 'IM', '10', '6m a 4 anos'],
    ['V10', 'COVID-19 (Moderna/Pfizer)', 'Pfizer/Moderna', 'IM', '10', 'Grupos de risco / Idosos'],
    ['V11', 'Febre Amarela', 'Bio-Manguinhos', 'SC', '10', '9 meses + reforço 4 anos'],
    ['V12', 'Hepatite A', 'GSK', 'IM', '1', '15 meses'],
    ['V13', 'SCR (Tríplice Viral)', 'Bio-Manguinhos', 'SC', '1', '12 meses'],
    ['V14', 'SCRV (Tetraviral)', 'Bio-Manguinhos', 'SC', '1', '15 meses'],
    ['V15', 'HPV4', 'Butantan/MSD', 'IM', '1', '9 a 14 anos'],
    ['V16', 'MenACWY', 'Pfizer/GSK', 'IM', '1', 'Reforço 11 a 14 anos'],
    ['V17', 'dTpa (Gestante)', 'Butantan/GSK', 'IM', '1', 'A partir da 20ª semana'],
    ['V18', 'dT (Dupla Adulto)', 'Butantan', 'IM', '10', 'Reforço a cada 10 anos'],
    ['V19', 'VOP (Pólio Oral)', 'Bio-Manguinhos', 'Oral', '25', 'Reforços 15m e 4 anos'],
    ['V20', 'VPC23 (Pneumo 23)', 'MSD', 'IM', '1', 'Grupos especiais / Idosos'],
    ['V21', 'Antirrábica Humana', 'Butantan', 'IM', '1', 'Pós-exposição'],
    ['V22', 'Varicela', 'Bio-Manguinhos', 'SC', '1', 'Grupos de risco'],
    ['V23', 'VPC13 (Pneumo 13)', 'Pfizer', 'IM', '1', 'CRIE / Grupos especiais'],
    ['V24', 'Hib (Haemophilus)', 'Bio-Manguinhos', 'IM', '1', 'Grupos especiais'],
    ['V25', 'Meningo B', 'GSK', 'IM', '1', 'CRIE'],
    ['V26', 'Dengue', 'Takeda', 'SC', '1', 'Público alvo específico'],
    ['V27', 'Soro Antiescorpiônico', 'Butantan', 'IV', '1', 'Emergência'],
    ['V28', 'Soro Antiofídico', 'Butantan', 'IV', '1', 'Emergência'],
    ['V29', 'Imunoglobulina HB', 'NABI', 'IM', '1', 'Especiais'],
    ['V30', 'Outros Insumos', 'Diversos', 'N/A', 'N/A', 'Uso geral']
  ];

  const vacSheet = ss.getSheetByName('Vacinas');
  vacinas.forEach(v => {
    vacSheet.appendRow(v);
  });

  // 3. Cadastrar Usuário Inicial (Admin)
  const userSheet = ss.getSheetByName('Usuarios');
  userSheet.appendRow(['admin', 'admin123', 'Administrador', 'CENTRAL', 'admin@perobal.pr.gov.br']);

  SpreadsheetApp.getUi().alert('SGI Perobal Configurado com Sucesso!\n30 vacinas cadastradas e 8 abas criadas.');
}
