*Instruções de Instalação e Configuração do Firebase e Firebase Hosting**

**Pré-requisitos**
1. **Node.js**: Certifique-se de que o Node.js está instalado. Baixe e instale a versão mais recente em [https://nodejs.org/](https://nodejs.org/).
2. **Conta Google**: Você precisará de uma conta Google para acessar o Firebase.
3. **Projeto Firebase**: Crie um projeto no Firebase Console ([https://console.firebase.google.com/](https://console.firebase.google.com/)).

---

### **Passo 1: Instalar o Firebase CLI**

1. Abra o terminal (ou prompt de comando).
2. Execute o seguinte comando para instalar o Firebase CLI globalmente:
   npm install -g firebase-tools

3. Verifique se a instalação foi bem-sucedida:
   firebase --version

---

### **Passo 2: Fazer login no Firebase**

1. No terminal, execute:
   firebase login

2. Isso abrirá uma página no navegador para autenticação. Faça login com sua conta Google e autorize o Firebase CLI.

3. Após o login, você verá uma mensagem de sucesso no terminal:
   + Success! Logged in as seu-email@gmail.com

---

### **Passo 3: Inicializar o Firebase no seu projeto**

1. Navegue até a pasta do seu projeto no terminal:
   cd caminho/para/seu/projeto

2. Inicialize o Firebase:
   firebase init

3. Siga as etapas de configuração:
   - **Selecione os recursos**: Use as setas do teclado para selecionar **Hosting** (pressione a barra de espaço para marcar) e pressione Enter.
   - **Escolha um projeto Firebase**:
     - Selecione um projeto existente no Firebase Console.
     - Ou crie um novo projeto no Firebase Console e selecione-o.
   - **Configurações do Hosting**:
     - Quando perguntado sobre o diretório público, digite `.` (ponto) para usar a pasta atual.
     - Quando perguntado se deseja configurar como um SPA (Single Page Application), escolha **Não** (a menos que você esteja criando um SPA).
     - Quando perguntado se deseja sobrescrever o arquivo `index.html`, escolha **Não** (a menos que você queira substituí-lo).

4. Após a inicialização, o Firebase criará dois arquivos na sua pasta:
   -.firebaserc: Contém a configuração do projeto Firebase.
   - firebase.json: Contém as configurações do Firebase Hosting.

---

### **Passo 4: Fazer o deploy do projeto**

1. No terminal, execute:
   firebase deploy


2. Aguarde o processo de deploy. Quando terminar, o terminal exibirá um link para o seu site hospedado, como:
   Hosting URL: https://seu-projeto.firebaseapp.com

---

### **Passo 5: Atualizar o projeto**
Sempre que fizer alterações no projeto, basta executar novamente o comando de deploy:

firebase deploy
