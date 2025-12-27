<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1JAFPeOaEdBuk9LHealJiUmCbecoKFvSS

## 🚀 Deploy

O projeto está configurado para deploy tanto no **Vercel** quanto no **GitHub Pages**.

### ⚡ Deploy na Vercel (Recomendado)

1. Conecte seu repositório do GitHub na Vercel.
2. Adicione as seguintes **Environment Variables** no painel da Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
3. O deploy será feito automaticamente a cada push.

### 🐙 Deploy no GitHub Pages

1. **Configure os Secrets:** No GitHub, vá em `Settings > Secrets and variables > Actions` e adicione as mesmas variáveis acima.
2. **Ative o Pages:** Em `Settings > Pages`, selecione **GitHub Actions** como fonte.
3. O deploy automático via GitHub Actions já está configurado no arquivo `.github/workflows/deploy.yml`.

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

