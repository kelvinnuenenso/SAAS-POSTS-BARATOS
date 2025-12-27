<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1JAFPeOaEdBuk9LHealJiUmCbecoKFvSS

## 🚀 Deploy no GitHub

Este projeto está configurado para deploy automático no **GitHub Pages** usando GitHub Actions.

### Passos para Deploy:

1. **Crie um repositório no GitHub** e faça o push do código.
2. **Configure os Secrets:** No seu repositório GitHub, vá em `Settings > Secrets and variables > Actions` e adicione as seguintes variáveis:
   - `VITE_SUPABASE_URL`: Sua URL do Supabase.
   - `VITE_SUPABASE_ANON_KEY`: Sua chave anônima do Supabase.
   - `GEMINI_API_KEY`: Sua chave da API do Gemini.
3. **Ative o GitHub Pages:** Vá em `Settings > Pages` e em **Build and deployment > Source**, selecione **GitHub Actions**.
4. **Push para Main:** Sempre que você fizer um push para a branch `main` ou `master`, o deploy será feito automaticamente.

## 🛠️ Desenvolvimento Local

**Pré-requisitos:** Node.js

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure o arquivo `.env`:
   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```env
   VITE_SUPABASE_URL=seu_url_aqui
   VITE_SUPABASE_ANON_KEY=sua_chave_aqui
   GEMINI_API_KEY=sua_chave_gemini_aqui
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

