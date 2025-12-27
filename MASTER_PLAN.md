# POSTSBARATOS - MASTER DOCUMENTATION

## BLOCO A — PÁGINA DE VENDAS (COPY FINAL)

### 1. HERO PRINCIPAL
**Headline:** Encontre Micro-Influenciadores que Cobram Barato e Vendem Muito.
**Subheadline:** A plataforma #1 para pequenos negócios que querem viralizar sem gastar uma fortuna. Contrate perfis reais a partir de R$ 50,00 com segurança total.
**CTA Primário:** Encontrar Influenciadores Agora
**CTA Secundário:** Quero ser um Influenciador
**Prova Social:** Crescendo a cada dia com parcerias de sucesso.

### 2. BLOCO "POR QUE EXISTE"
Você está cansado de enviar directs e ser ignorado?
Ou pior: receber orçamentos de R$ 5.000,00 por um único story que não converte?

O jogo mudou.
A era dos "grandes influenciadores" intocáveis acabou para o pequeno negócio.
O segredo do ROI (Retorno sobre Investimento) está na **micro-influência**: pessoas reais, com audiências engajadas, que cobram preços justos.
Mas onde encontrá-los? Como confiar? Como pagar com segurança?
Foi para acabar com essa dor de cabeça que criamos o **PostsBaratos**.

### 3. SOLUÇÃO: O QUE É O POSTS BARATOS?
O "Uber" do Marketing de Influência.
Somos um marketplace focado em *velocidade* e *preço acessível*. Eliminamos a burocracia das agências.

**Como funciona:**
1. **Busque:** Filtre por nicho (Moda, Tech, Fitness) e preço.
2. **Contrate:** O dinheiro fica seguro com a gente (Escrow).
3. **Receba:** O influencer posta, você aprova, e só então liberamos o pagamento.

Sem pegadinhas. Sem contratos de 20 páginas.

### 4. SEÇÃO VISUAL
*(No site, apresentar cards de influenciadores reais com métricas: "Ana Júlia - 15k seguidores - R$ 80/Story - Taxa de Engajamento 4%")*

### 5. BENEFÍCIOS DIRETOS
*   **Econômico:** Preços tabelados e transparência total.
*   **Rápido:** Feche parcerias em menos de 3 minutos.
*   **Seguro:** Sistema de Escrow. Se o post não sair, seu dinheiro volta.
*   **Validado:** Avaliações reais de outros empresários.

### 6. QUEM É PARA?
*   **E-commerces & Dropshipping:** Tráfego barato e qualificado.
*   **Negócios Locais:** Restaurantes, Clínicas, Lojas de Rua.
*   **Infoprodutores:** Prova social e distribuição de conteúdo.
*   **Profissionais Liberais:** Advogados, Nutricionistas, Personal Trainers.

### 8. PLANOS E PREÇOS

**PARA EMPRESAS:**
*   **Acesso Gratuito:** Navegue e veja perfis.
*   **Taxa por transação:** 10% sobre o valor do post (já incluso no preço final).
*   **Sem mensalidade.** Você só paga quando contrata.

**PARA INFLUENCIADORES:**
*   **Plano Starter (Grátis):** Taxa de 15% sobre os ganhos.
*   **Plano Pro (R$ 29,90/mês):** Taxa reduzida de 5%, destaque nas buscas e selo verificado.

**Garantia Incondicional:** Se o influenciador não entregar o combinado em 48h, devolvemos 100% do seu dinheiro automaticamente.

### 9. COMO FUNCIONA (DETALHADO)
1. **Explore:** Use nossos filtros inteligentes para achar o perfil ideal.
2. **Compre:** Adicione o serviço (Story, Reels, Feed) ao carrinho e pague via Pix ou Cartão.
3. **Escrow:** O PostsBaratos segura o valor. O influenciador vê que você pagou, mas não recebe ainda.
4. **Briefing:** Envie o produto ou as instruções pelo nosso chat interno.
5. **Aprovação:** O influenciador posta. Você confirma se está ok.
6. **Liberação:** O dinheiro vai para a carteira do influenciador.

### 10. FAQ
1. **É seguro?** Sim, usamos SSL e processadores de pagamento de nível bancário.
2. **E se o influencer sumir?** O dinheiro é estornado para você.
3. **Posso permutar produto?** Sim, temos uma opção de oferta "Permuta" no chat.
4. **Qual o valor mínimo?** Temos influencers a partir de R$ 20,00.
5. **Serve para B2B?** Sim, filtre por LinkedIn ou nichos corporativos no Instagram.
6. **Como sei se os seguidores são reais?** Temos um algoritmo que verifica qualidade da audiência.
7. **Preciso enviar produto físico?** Depende do acordo, tudo é combinado no chat.
8. **Tem nota fiscal?** O PostsBaratos emite nota sobre a taxa de serviço.
9. **Quanto tempo demora?** A média é de 3 a 5 dias para o post ir ao ar.
10. **Posso pedir alterações?** Sim, antes da postagem final.

### 12. CTA FINAL
**Headline:** Pare de Queimar Dinheiro com Anúncios Caros.
**Subheadline:** Comece a vender com a força da recomendação hoje mesmo.
**Botão:** [CRIAR CONTA GRÁTIS E BUSCAR INFLUENCIADORES]

---

## BLOCO B — SISTEMA COMPLETO DO SAAS POSTS BARATOS

### 1. ARQUITETURA GERAL
*   **Frontend:** React 18 + Next.js 14 (App Router) + TailwindCSS + Shadcn/UI.
*   **Backend:** Node.js com NestJS (Arquitetura Modular).
*   **Banco de Dados:** PostgreSQL (Hospedado no Google Cloud SQL ou Supabase).
*   **ORM:** Prisma.
*   **Cache/Fila:** Redis (para filas de processamento de pagamentos e notificações).
*   **Storage:** Google Cloud Storage (para fotos de perfil e prints de comprovação).
*   **Pagamentos:**
    *   **Stripe Connect:** Para split de pagamento automático e gestão de marketplace.
    *   **Pix (Caktô ou Asaas):** Para menor taxa no Brasil.
*   **Autenticação:** Clerk ou NextAuth.js (com JWT).
*   **Deploy:** Docker containers no Google Cloud Run (Frontend e Backend).

### 2. MODELAGEM DE DADOS (Resumo Prisma)
```prisma
model User {
  id String @id @default(uuid())
  email String @unique
  role Role @default(BUSINESS) // BUSINESS, INFLUENCER, ADMIN
  profile Profile?
  orders Order[]
}

model InfluencerProfile {
  id String @id @default(uuid())
  userId String @unique
  handle String
  platform String // Instagram, TikTok
  followers Int
  niche String
  pricePerStory Decimal
  pricePerReel Decimal
  rating Float @default(0)
  verified Boolean @default(false)
  listings Listing[]
}

model Order {
  id String @id @default(uuid())
  businessId String
  influencerId String
  status OrderStatus // PENDING, PAID_ESCROW, IN_PROGRESS, DELIVERED, COMPLETED, DISPUTED, CANCELLED
  amount Decimal
  platformFee Decimal
  briefing String
  proofUrl String?
  createdAt DateTime @default(now())
}
```

### 3. FLUXOS DE PAGAMENTO (ESCROW)
1.  **Checkout:** Cliente paga R$ 100,00.
2.  **Split:** Sistema calcula R$ 10,00 (Taxa) + R$ 90,00 (Influencer).
3.  **Hold:** R$ 100,00 entram na conta "Escrow" do Stripe/Gateway.
4.  **Trigger:** Influencer notificado.
5.  **Entrega:** Influencer sobe o link do post.
6.  **Aprovação:** Cliente clica em "Aprovar" ou 48h passam sem contestação.
7.  **Payout:** R$ 90,00 movidos para saldo disponível do Influencer. R$ 10,00 para conta da plataforma.

### 4. API ENDPOINTS (Exemplos)
*   `GET /api/v1/influencers` (Query params: minPrice, maxPrice, niche)
*   `POST /api/v1/orders` (Body: influencerId, serviceType, briefing)
*   `POST /api/v1/orders/:id/approve` (Libera o dinheiro)
*   `POST /api/v1/webhooks/stripe` (Atualiza status de pagamento)

### 5. SEGURANÇA & INFRA
*   **Rate Limiting:** Redis-based throttle por IP.
*   **Sanitização:** Zod para validação de schemas em todas as entradas.
*   **Logs:** Winston logger enviando para Datadog ou Cloud Logging.

### 6. MVP (48 Horas)
*   Foco apenas em Instagram Stories.
*   Pagamento manual via Pix (Comprovante no chat) se integração Stripe demorar.
*   Aprovação manual de influencers pelo Admin.
*   Sem dashboard complexo, apenas "Meus Pedidos".

### 7. FULL VERSION
*   Integração com API do Instagram para puxar métricas reais automaticamente.
*   Múltiplas plataformas (TikTok, YouTube).
*   Sistema de Disputa/Arbitragem automatizado.
*   App Mobile (React Native).
