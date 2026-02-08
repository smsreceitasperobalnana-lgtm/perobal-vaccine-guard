# 🚀 Roteiro de Implantação Oficial: SGI Perobal V2

Este guia contém o passo a passo minucioso para colocar o sistema em operação. Siga cada etapa na ordem descrita.

---

## 📂 Visão Geral dos Arquivos
Todos os arquivos necessários estão localizados na pasta:
`C:\Users\Rafael Amaro\driver-sincronizado\sg1-perobal\INSTALACAO_OFICIAL`

1.  **`01_CONFIGURADOR_PLANILHA.gs`**: Script para criar as abas e cadastrar as 30 vacinas.
2.  **`02_MOTOR_BACKEND.gs`**: O código principal do sistema (Lógica de negócios e auditoria).
3.  **`03_FRONTEND_SISTEMA.html`**: O aplicativo visual (Interface React compilada).

---

## 🛠️ Passo 1: Criar e Configurar o Banco de Dados (Sheets)
1.  Crie uma **nova Planilha Google** em branco no seu Drive.
2.  Dê o nome de **"SGI MASTER - PEROBAL"** (ou o nome que preferir).
3.  No menu superior, vá em **Extensões > Apps Script**.
4.  Apague qualquer código que aparecer lá e cole o conteúdo do arquivo **`01_CONFIGURADOR_PLANILHA.gs`**.
5.  Clique no ícone de disquete (Salvar) e dê o nome de "Setup".
6.  Na barra superior, verifique se a função `setupSGI` está selecionada e clique em **Executar**.
7.  **Importante**: O Google pedirá permissões. Clique em "Revisar permissões", selecione sua conta, clique em "Avançado" e depois em "Acessar Setup (não seguro)".
8.  Aguarde a mensagem de sucesso. Sua planilha agora terá todas as abas e as 30 vacinas cadastradas.

---

## ⚙️ Passo 2: Instalar o Motor do Sistema (Code.gs)
1.  Ainda na mesma tela do Apps Script aberto no passo anterior:
2.  No menu lateral esquerdo, clique no arquivo `Código.gs` (ou crie um novo arquivo de script clicando no `+`).
3.  Apague o código do passo anterior e cole o conteúdo do arquivo **`02_MOTOR_BACKEND.gs`**.
4.  Clique em Salvar.

---

## 💻 Passo 3: Instalar a Interface do Usuário (index.html)
1.  No menu lateral do Apps Script, clique no botão **`+` (Adicionar um arquivo)** e escolha **HTML**.
2.  Nomeie o arquivo exatamente como **`index`** (o Google adicionará o `.html` automaticamente).
3.  Apague tudo o que estiver dentro desse novo arquivo `index.html`.
4.  Cole o conteúdo do arquivo **`03_FRONTEND_SISTEMA.html`**.
5.  Clique em Salvar.

---

## 🚀 Passo 4: Publicar o Sistema (Deploy)
1.  No canto superior direito, clique no botão azul **Implantar > Nova implantação**.
2.  Clique no ícone de engrenagem ao lado de "Selecionar tipo" e escolha **App da Web**.
3.  Preencha as configurações:
    - **Descrição**: "SGI Perobal V2.0 - Oficial"
    - **Executar como**: "Eu" (seu e-mail)
    - **Quem tem acesso**: "Qualquer pessoa" (isso facilita o acesso dos técnicos nas UBS).
4.  Clique em **Implantar**.
5.  O sistema gerará um link longo (URL do App da Web). **Copie este link!** Este é o endereço que os usuários usarão no celular ou computador.

---

## ✅ Passo 5: Teste de Acesso
1.  Abra o link que você copiou em um novo navegador.
2.  O sistema deverá carregar o Dashboard Premium.
3.  Teste o login usando:
    - **Usuário**: admin
    - **Senha**: admin123
4.  Navegue pelo menu lateral e verifique se o **Manual de Bolso** está visível.

---

> [!TIP]
> **Dica de Ouro**: Salve o link do sistema nos "Favoritos" de todos os computadores das salas de vacina e crie um atalho na tela inicial dos celulares dos técnicos.
