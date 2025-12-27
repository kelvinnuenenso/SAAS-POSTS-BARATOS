export enum UserRole {
  BUSINESS = 'BUSINESS',
  INFLUENCER = 'INFLUENCER',
  ADMIN = 'ADMIN'
}

export type UserRoleType = UserRole;

export type ServiceType = 
  | 'Story' 
  | 'Reels' 
  | 'Feed' 
  | 'Combo Stories' 
  | 'TikTok Video' 
  | 'Shorts' 
  | 'Long Video' 
  | 'Tweet';

export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';

export interface CompanyProfile {
  // Basic
  description?: string;
  niche?: string[]; // Changed to array for multiple selection
  size?: 'MEI' | 'Pequena' | 'Média' | 'Grande';
  socialInstagram?: string;
  socialLinkedin?: string;
  website?: string;
  cnpj?: string;
  sector?: string;
  location?: { city: string; state: string };
  logoUrl?: string;

  // Strategic
  objectives?: string[];
  targetAudience?: {
    ageRange?: string;
    gender?: 'Male' | 'Female' | 'All';
    location?: string;
    interests?: string[];
  };
  
  // Budget & preferences
  budget?: {
    perCampaign?: number;
    monthly?: number;
    priceRange?: string;
    acceptsNegotiation?: boolean;
  };
  
  desiredDeliverables?: string[]; // Stories, Reels, etc.
  
  influencerPreferences?: {
    niches?: string[];
    audienceSize?: string[]; // Micro, Macro...
    type?: 'Influencer' | 'UGC' | 'Both';
  };

  // Campaign Rules & Guidelines
  guidelines?: {
    mustHave?: string;
    restrictions?: string;
  };

  campaignRules?: {
    objective?: string;
    dos?: string;
    donts?: string;
    technicalRequirements?: string;
  };

  // Contact
  contact?: {
    email?: string;
    whatsapp?: string;
    responsibleName?: string;
    position?: string;
    preferredTime?: string;
  };
}

export interface InfluencerService {
  id: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube' | 'Kwai' | 'Twitter';
  format: 'Reels' | 'Feed' | 'Story' | 'Combo Stories' | 'TikTok Video' | 'Shorts' | 'Long Video' | 'Tweet';
  price: number;
  promoPrice?: number;
  negotiable: boolean;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  balance: number;
  onboardingCompleted: boolean; // MANDATORY: Controls the flow
  companyProfile?: CompanyProfile;
  status?: 'ACTIVE' | 'SUSPENDED';
}

export interface Influencer extends User {
  // Basic
  handle: string;
  niche: string;
  followers: number;
  engagementRate: number;
  pricePerPost: number; // Legacy support
  pricePerReel: number; // Legacy support
  rating: number;
  verified: boolean;
  bio: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube';
  sizeCategory: 'Nano' | 'Micro' | 'Mid' | 'Macro';
  
  // 1. Profile Config
  artisticName?: string;
  secondaryNiches?: string[];
  socialHandles?: { 
    instagram?: string; 
    tiktok?: string; 
    youtube?: string;
    kwai?: string;
    twitter?: string;
  };
  languages?: string[];
  location?: { city: string; state: string; country: string };
  gender?: string;

  // 2. Metrics & Social Proof
  metrics?: {
    followersByPlatform?: { instagram: number; tiktok: number; youtube: number; kwai?: number; twitter?: number };
    avgReach?: { reels: number; stories: number; feed: number };
    avgViews?: number;
    avgLikes?: number;
    avgStoriesViews?: number;
    avgReelsViews?: number;
    engagementRateManual?: number; // If API fails
    brandsWorkedWith?: string[];
    mediaKitUrl?: string;
  };

  // 3. Services & Pricing (Detailed)
  services?: InfluencerService[];
  minAcceptablePrice?: number; // Private field

  // 4. Audience
  audienceData?: {
    location?: string;
    ageRange?: string;
    topInterests?: string[];
    genderSplit?: { male: number; female: number };
    gender?: string;
    topCities?: string[];
    estimatedClass?: 'A' | 'B' | 'C' | 'D';
  };

  // 5. Content Style
  contentStyle?: {
    tone?: string;
    aesthetic?: string;
    favoriteFormats?: string[];
    productionFrequency?: string; // e.g. 3x week
    editingLevel?: 'Básica' | 'Média' | 'Avançada';
    tags?: string[];
  };

  // 6. Schedule & Availability
  schedule?: {
    daysAvailable?: string[];
    standardDeliveryTime?: '48h' | '3 dias' | '7 dias';
    busyMode?: boolean;
    maxMonthlyCapacity?: number;
    availabilityType?: 'Paid' | 'Barter' | 'Both'; // Campaign, Permuta, Ambos
    preferredContactTime?: 'Morning' | 'Afternoon' | 'Night' | 'Any';
    isAvailable?: boolean;
    notes?: string;
  };

  // 7. Rules
  rules?: {
    noGoContent?: string[];
    blockedNiches?: string[];
    forbiddenWords?: string[];
    revisionPolicy?: string;
    maxRevisions?: number;
  };

  // 8. Financial
  paymentInfo?: {
    pixKey?: string;
    bankAccount?: string;
    document?: string; // CPF/CNPJ
    withdrawals?: Withdrawal[];
    taxAddress?: string;
  };
  
  portfolio?: string[];

  // 9. Contact Settings
  contactSettings?: {
    publicEmail?: string;
    whatsapp?: string;
    allowDirectMessages?: boolean;
    showEmailToBusinesses?: boolean;
    restrictedNiches?: string[];
  };
}

export interface Withdrawal {
  id: string;
  date: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  method: 'PIX';
}

export interface Order {
  id: string;
  businessId: string;
  influencerId: string;
  serviceType: 'Story' | 'Reels' | 'Feed';
  amount: number;
  status: OrderStatus;
  briefing: string;
  deliveryUrl?: string;
  createdAt: string;
  review?: Review;
}

export interface Review {
  id?: string;
  authorName?: string;
  rating: number; // 1-5
  comment: string;
  tags: string[]; // e.g., "Pontual", "Criativo"
  date?: string;
}

export interface Message {
  id: string;
  orderId: string;
  senderId: string;
  text: string;
  content?: string; // Support for both
  timestamp: string;
  createdAt?: string; // Support for both
}

export interface CampaignConfig {
  objectives: string[]; // e.g., 'sales', 'traffic'
  formats: string[]; // e.g., 'Story', 'Reels'
  tone: string;
  budgetMonthly: number;
  maxPricePerPost: number;
  paymentType: 'Post' | 'Pacote';
  targetLocation: string;
  targetAge: string;
  targetInterests: string[];
  targetClass: 'A' | 'B' | 'C' | 'Todas';
  manualApproval: boolean;
  mandatoryHashtags: string;
  forbiddenContent: string;
}

export const PlanType = {
  INFLUENCER: 'INFLUENCER',
  BUSINESS: 'BUSINESS'
} as const;

export type PlanType = (typeof PlanType)[keyof typeof PlanType];