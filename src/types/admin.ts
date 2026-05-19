export type UserRole = 'admin' | 'staff' | 'roaster' | 'seller' | 'customer';

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUser extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
}

export interface ProductAdmin extends BaseEntity {
  name: string;
  slug: string;
  category: string;
  price: number;
  promotionalPrice?: number;
  format: string;
  roast: string;
  sensoryProfile: string;
  sensoryNotes: string[];
  origin: string;
  region: string;
  farm: string;
  producer: string;
  altitude: string;
  variety: string;
  process: string;
  score?: number;
  award?: string;
  awardYear?: string;
  isAwardWinning: boolean;
  hasTraceability: boolean;
  traceabilityUrl?: string;
  shortDescription: string;
  fullDescription: string;
  mainImage: string;
  gallery: string[];
  stock: number;
  active: boolean;
  featured: boolean;
  idealFor: string[];
}

export interface RawCoffeeLot {
  id: string;
  name: string;
  code: string;
  status: "draft" | "active" | "reserved" | "low_stock" | "depleted" | "archived";

  harvest?: string;
  tags?: string[];

  origin: {
    country?: string;
    state?: string;
    region?: string;
    city?: string;
    farm?: string;
    producer?: string;
    cooperative?: string;
    altitude?: string;
    terroirNotes?: string;
  };

  quality: {
    score?: number;
    scoreScale?: "SCA" | "Cup of Excellence" | "Internal" | "Other";
    isSpecialty?: boolean;
    isAwardWinning?: boolean;
    awardName?: string;
    awardYear?: string;
    awardPosition?: string;
    externalValidation?: string;
    evaluator?: string;
    evaluationDate?: string;
    sensoryNotes?: string[];
    body?: string;
    acidity?: string;
    sweetness?: string;
    finish?: string;
    expectedProfile?: string[];
  };

  purchase: {
    totalPaid: number;
    currency: "BRL";
    purchasedKg: number;
    costPerKg: number;
    extraCosts?: number;
    freightCost?: number;
    taxes?: number;
    finalTotalCost?: number;
    finalCostPerKg?: number;
    supplier?: string;
    paymentMethod?: string;
    purchaseDate?: string;
    invoiceUrl?: string;
    financialNotes?: string;
  };

  stock: {
    purchasedKg: number;
    availableKg: number;
    reservedKg?: number;
    usedKg?: number;
    lowStockThresholdKg?: number;
    storageLocation?: string;
    storageType?: string;
  };

  traceability: {
    code?: string;
    qrUrl?: string;
    publicUrl?: string;
    story?: string;
    whySelected?: string;
    publicVisible?: boolean;
    productEligible?: boolean;
  };

  documents?: {
    invoiceUrl?: string;
    certificateUrl?: string;
    evaluationUrl?: string;
    lotImageUrl?: string;
    bagImageUrl?: string;
    farmImageUrl?: string;
  };

  stats?: {
    totalRoasts?: number;
    totalRawKgUsed?: number;
    totalRoastedKgOutput?: number;
    averageLossPercent?: number;
    lastRoastedAt?: string;
  };

  notes?: Array<{
    id: string;
    text: string;
    userId: string;
    userName?: string;
    createdAt: string;
  }>;

  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface StockItem extends BaseEntity {
  type: "raw" | "roasted" | "finished";

  productId?: string;
  productName?: string;

  rawLotId?: string;
  rawLotName?: string;

  roastBatchId?: string;
  packagingRunId?: string;

  format?: string;
  unitWeightKg?: number;

  availableUnits?: number;
  availableKg?: number;

  reservedUnits?: number;
  reservedKg?: number;

  consignedUnits?: number;
  consignedKg?: number;

  soldUnits?: number;
  soldKg?: number;

  courtesyUnits?: number;
  courtesyKg?: number;

  lowStockThresholdUnits?: number;
  lowStockThresholdKg?: number;

  status: "available" | "low" | "empty" | "reserved" | "inactive";

  lastMovementAt?: string;
}

export interface StockMovement extends BaseEntity {
  type:
    | "entrada_lote_cru"
    | "torra_consumo_cru"
    | "torra_entrada_torrado"
    | "empacotamento_saida_torrado"
    | "empacotamento_entrada_produto"
    | "venda_saida"
    | "pedido_reserva"
    | "pedido_cancelamento_retorno"
    | "consignacao_saida"
    | "consignacao_retorno"
    | "consignacao_venda_confirmada"
    | "cortesia_saida"
    | "ajuste_manual"
    | "perda"
    | "ajuste_lote_cru"
    | "perda_lote_cru"
    | "correcao_inventario";

  stockItemId?: string;
  productId?: string;
  rawLotId?: string;
  roastBatchId?: string;
  packagingRunId?: string;

  quantityUnits?: number;
  quantityKg?: number;

  previousUnits?: number;
  newUnits?: number;
  previousKg?: number;
  newKg?: number;

  previousBalanceKg?: number; // legacy backwards compat for RawLots if used anywhere
  newBalanceKg?: number; // legacy backwards compat for RawLots if used anywhere

  relatedEntityType?:
    | "order"
    | "manualSale"
    | "consignment"
    | "roastBatch"
    | "packagingRun"
    | "rawLot"
    | "courtesy"
    | "adjustment";

  relatedEntityId?: string;

  reason?: string;
  notes?: string;

  userId?: string;
  userName?: string;
}

export interface RoastBatch extends BaseEntity {
  date: string;
  roasterId: string;
  roasterName?: string;
  rawLotId: string;
  rawLotName?: string;
  rawKgUsed: number;
  roastedKgOutput: number;
  lossKg: number;
  lossPercent: number;
  roastProfile: string;
  roastTime?: string;
  status: 'registrada' | 'revisada' | 'aprovada';
  notes?: string;
  timeEntryId?: string;
}

export interface PackagingRun extends BaseEntity {
  date: string;
  roastBatchId: string;
  roastBatchName?: string;
  responsibleId: string;
  responsibleName?: string;
  packageFormat: string;
  unitWeightKg: number;
  quantityUnits: number;
  totalKg: number;
  destination: "estoque" | "pedido" | "consignacao" | "cortesia";
  relatedEntityId?: string;
  notes?: string;
}

export interface RoasterTimeEntry extends BaseEntity {
  roasterId: string;
  roasterName: string;
  date: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  totalHours: number;
  activity: "torra" | "empacotamento" | "separacao" | "limpeza" | "entrega" | "outro";
  relatedRoastId?: string;
  relatedPackageId?: string;
  notes?: string;
  status: "pending" | "approved" | "rejected" | "paid";
  approvedAt?: string;
  approvedBy?: string;
  payrollId?: string;
}

export interface WeeklyPayroll extends BaseEntity {
  roasterId: string;
  roasterName: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  hourlyRate: number;
  baseValue: number;
  adjustments: number;
  totalValue: number;
  status: "pending" | "approved" | "paid";
  approvedAt?: string;
  paidAt?: string;
  paymentMethod?: string;
  entryIds: string[];
  notes?: string;
}

export interface OperationSettings extends BaseEntity {
  roasterHourlyRate: number;
  lowStockThresholdKg: number;
  idealLossPercentRange: [number, number];
}

export interface Consignment extends BaseEntity {
  code: string;

  recipientType: "partner" | "customer" | "company" | "other";
  partnerId?: string;
  customerId?: string;

  recipientName: string;
  recipientWhatsapp?: string;
  city?: string;
  state?: string;

  sellerId?: string;
  responsibleUserId?: string;

  startDate: string;
  dueDate?: string;
  closedAt?: string;

  status:
    | "open"
    | "partial"
    | "paid"
    | "returned"
    | "overdue"
    | "lost"
    | "cancelled"
    | "closed";

  agreementType:
    | "consignment"
    | "postpaid_sale"
    | "sample_with_return";

  items: Array<{
    id: string;
    productId: string;
    productName: string;
    stockItemId?: string;
    format?: string;
    unitWeightKg?: number;

    quantitySent: number;
    quantitySold: number;
    quantityReturned: number;
    quantityLost?: number;
    quantityPending: number;

    unitPrice: number;
    totalValue: number;
    soldValue: number;
    pendingValue: number;
  }>;

  totalValue: number;
  soldValue: number;
  receivedValue: number;
  pendingValue: number;
  discountValue?: number;

  paymentStatus: "pending" | "partial" | "paid" | "cancelled";

  payments?: Array<{
    id: string;
    value: number;
    method: "pix" | "cash" | "card" | "bank_transfer" | "boleto" | "other";
    paidAt: string;
    proofUrl?: string;
    notes?: string;
    userId?: string;
  }>;

  notes?: Array<{
    id: string;
    text: string;
    priority?: "low" | "medium" | "high";
    userId: string;
    userName?: string;
    createdAt: string;
  }>;

  timeline?: Array<{
    id: string;
    type: string;
    label: string;
    description?: string;
    userId?: string;
    createdAt: string;
  }>;

  receivableId?: string;
  commissionIds?: string[];

  archived?: boolean;
}

export interface Seller extends BaseEntity {
  name: string;
  status: "active" | "inactive" | "suspended" | "archived";
  type: "internal" | "external" | "representative" | "partner" | "affiliate" | "other";

  contact?: {
    whatsapp?: string;
    email?: string;
    phone?: string;
    instagram?: string;
  };

  location?: {
    city?: string;
    state?: string;
  };

  joinedAt?: string;

  commissionRule: {
    type: "percentage" | "fixed" | "per_kg" | "per_product" | "per_consignment" | "custom";
    percentage?: number;
    fixedValue?: number;
    valuePerKg?: number;

    base:
      | "paid_order"
      | "created_order"
      | "received_payment"
      | "received_consignment";

    releaseOnlyAfterPayment: boolean;
    includeShipping?: boolean;
    applyAfterDiscount?: boolean;
  };

  goals?: {
    monthlyRevenue?: number;
    monthlyKg?: number;
    monthlyNewCustomers?: number;
    monthlyConvertedLeads?: number;
  };

  permissions?: {
    canViewOwnLeads?: boolean;
    canViewOwnCustomers?: boolean;
    canViewOwnCommissions?: boolean;
    canRegisterFollowUp?: boolean;
    canCreateManualSale?: boolean;
    canViewFinancialValues?: boolean;
  };

  stats?: {
    totalRevenue?: number;
    monthlyRevenue?: number;
    totalCommissions?: number;
    pendingCommissions?: number;
    paidCommissions?: number;
    activeLeads?: number;
    convertedLeads?: number;
    customersCount?: number;
    consignmentsCount?: number;
  };

  notes?: Array<{
    id: string;
    text: string;
    priority?: "low" | "medium" | "high";
    userId: string;
    userName?: string;
    createdAt: string;
  }>;

  archived?: boolean;
}

export interface Commission extends BaseEntity {
  sellerId: string;
  sellerName: string;

  sourceType:
    | "order"
    | "manualSale"
    | "consignment"
    | "subscription"
    | "convertedLead"
    | "manualAdjustment";

  sourceId: string;

  customerId?: string;
  customerName?: string;

  partnerId?: string;
  partnerName?: string;

  leadId?: string;

  baseValue: number;
  receivedValue?: number;
  discountValue?: number;
  shippingValue?: number;

  calculationBase:
    | "gross_sale"
    | "net_sale"
    | "received_value"
    | "kg_sold"
    | "fixed";

  ruleSnapshot: {
    type: "percentage" | "fixed" | "per_kg" | "per_product" | "per_consignment" | "custom";
    percentage?: number;
    fixedValue?: number;
    valuePerKg?: number;
    includeShipping?: boolean;
    applyAfterDiscount?: boolean;
    releaseOnlyAfterPayment?: boolean;
  };

  commissionValue: number;
  adjustedValue?: number;
  finalValue: number;

  status:
    | "pending"
    | "approved"
    | "paid"
    | "cancelled"
    | "withheld"
    | "review";

  dueDate?: string;
  approvedAt?: string;
  approvedBy?: string;

  paidAt?: string;
  paidBy?: string;
  paymentMethod?: "pix" | "cash" | "bank_transfer" | "other";
  paymentProofUrl?: string;

  cancelReason?: string;
  reviewReason?: string;
  adjustmentReason?: string;

  notes?: string;

  timeline?: Array<{
    id: string;
    type: string;
    label: string;
    description?: string;
    userId?: string;
    createdAt: string;
  }>;

  archived?: boolean;
}

export interface AdminLog extends BaseEntity {
  userId: string;
  userEmail: string;
  action: string;
  entity: string;
  entityId?: string;
  before?: any;
  after?: any;
}

export interface CustomerAdmin extends BaseEntity {
  name: string;
  email?: string;
  whatsapp?: string;
  cpf?: string;
  cnpj?: string;

  type: "b2c" | "b2b" | "partner" | "subscription" | "consignment" | "lead_converted";
  status: "active" | "inactive" | "pending_payment" | "recurring" | "new" | "vip" | "archived";

  company?: {
    name?: string;
    segment?: string;
    cnpj?: string;
    estimatedMonthlyKg?: number;
    commercialStatus?: "new" | "contacted" | "proposal_sent" | "negotiation" | "active_client" | "lost" | "inactive";
    responsibleSellerId?: string;
  };

  address?: {
    cep?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
  };

  source: "checkout" | "manual" | "b2b_lead" | "consignment" | "subscription" | "whatsapp" | "admin";

  tags?: string[];
  notes?: Array<{
    id: string;
    text: string;
    priority?: "low" | "medium" | "high";
    userId: string;
    userName?: string;
    createdAt: any;
  }>;

  stats: {
    totalOrders: number;
    totalSpent: number;
    totalPaid: number;
    totalPending: number;
    averageTicket: number;
    lastOrderAt?: any;
    firstOrderAt?: any;
    totalConsignments?: number;
    totalSubscriptions?: number;
  };

  subscription?: {
    interested?: boolean;
    planId?: string;
    planName?: string;
    frequency?: string;
    sensoryProfile?: string;
    status?: "interested" | "active" | "paused" | "cancelled";
  };

  related: {
    orderIds?: string[];
    leadIds?: string[];
    consignmentIds?: string[];
    receivableIds?: string[];
    subscriptionIds?: string[];
    sellerId?: string;
  };

  archived?: boolean;
}

export interface OrderAdmin extends BaseEntity {
  orderNumber: string;
  customerId?: string;
  customer: {
    name: string;
    email?: string;
    whatsapp?: string;
    cpf?: string;
  };
  shipping: {
    type: "delivery" | "pickup" | "combine";
    cep?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    notes?: string;
  };
  items: Array<{
    productId: string;
    name: string;
    slug?: string;
    imageUrl?: string;
    format?: string;
    weightGrams?: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    rawLotId?: string;
    roastBatchId?: string;
    packagingRunId?: string;
  }>;
  subtotal: number;
  discount: number;
  shippingPrice: number;
  total: number;
  currency: "BRL";
  payment: {
    provider?: "mercadopago" | "stripe" | "manual" | "pix" | "cash" | "card";
    providerPreferenceId?: string;
    providerPaymentId?: string;
    checkoutUrl?: string;
    method?: string;
    status: "pending" | "approved" | "rejected" | "cancelled" | "refunded";
    paidAt?: any;
  };
  status:
    | "awaiting_payment"
    | "paid"
    | "preparing"
    | "ready_for_pickup"
    | "shipped"
    | "delivered"
    | "completed"
    | "canceled"
    | "failed"
    | "refunded";
  source: "site" | "checkout" | "whatsapp" | "manual" | "b2b" | "subscription" | "consignment";
  sellerId?: string;
  couponId?: string;
  couponCode?: string;
  discountAmount?: number;
  discountType?: string;
  subtotalBeforeDiscount?: number;
  totalAfterDiscount?: number;
  stockDeducted?: boolean;
  stockDeductedAt?: any;
  stockIssue?: string;
  internalNotes?: Array<{
    id: string;
    text: string;
    userId: string;
    userName?: string;
    createdAt: any;
  }>;
  timeline?: Array<{
    id: string;
    type: string;
    label: string;
    description?: string;
    userId?: string;
    createdAt: any;
  }>;
  archived?: boolean;
}

export interface B2BLead extends BaseEntity {
  contactName: string;
  companyName?: string;
  email?: string;
  whatsapp?: string;

  segment?:
    | "office"
    | "restaurant"
    | "coffee_shop"
    | "hotel"
    | "coworking"
    | "reseller"
    | "event"
    | "industry"
    | "clinic"
    | "store"
    | "other";

  city?: string;
  state?: string;

  source:
    | "empresas_page"
    | "b2b_calculator"
    | "whatsapp"
    | "referral"
    | "prospecting"
    | "event"
    | "admin"
    | "instagram"
    | "other";

  status:
    | "new"
    | "contacted"
    | "qualified"
    | "proposal_sent"
    | "negotiation"
    | "converted"
    | "lost"
    | "no_response";

  temperature?: "cold" | "warm" | "hot";

  responsibleSellerId?: string;
  responsibleUserId?: string;

  estimatedConsumption?: {
    businessType?: string;
    peoplePerDay?: number;
    cupsPerPerson?: number;
    daysPerMonth?: number;
    gramsPerCup?: number;
    monthlyKg?: number;
    monthlyCups?: number;
    recommendedPackage?: string;
    recommendedFrequency?: string;
    recommendedProfile?: string;
  };

  proposal?: {
    packageName?: string;
    monthlyKg?: number;
    pricePerKg?: number;
    estimatedMonthlyValue?: number;
    frequency?: string;
    conditions?: string;
    validUntil?: any;
    status?: "draft" | "sent" | "viewed" | "accepted" | "rejected" | "expired";
    sentAt?: any;
    acceptedAt?: any;
    rejectedAt?: any;
  };

  followUps?: Array<{
    id: string;
    type: "whatsapp" | "call" | "email" | "meeting" | "visit" | "proposal" | "other";
    date: any;
    result?: string;
    nextStep?: string;
    nextFollowUpAt?: any;
    status: "pending" | "done" | "late" | "cancelled";
    responsibleUserId?: string;
    notes?: string;
    createdAt: any;
  }>;

  notes?: Array<{
    id: string;
    text: string;
    priority?: "low" | "medium" | "high";
    userId: string;
    userName?: string;
    createdAt: any;
  }>;

  conversion?: {
    convertedAt?: any;
    customerId?: string;
    orderId?: string;
    manualSaleId?: string;
    lostReason?: string;
    lostNotes?: string;
  };

  tags?: string[];
  archived?: boolean;
}

export interface Coupon extends BaseEntity {
  code: string;
  name: string;
  description?: string;
  campaign?: string;

  active: boolean;
  archived?: boolean;

  discountType:
    | "percentage"
    | "fixed_amount"
    | "free_shipping"
    | "product_discount"
    | "first_order"
    | "subscription";

  discountValue?: number;
  maxDiscountValue?: number;
  freeShipping?: boolean;

  startDate?: any;
  endDate?: any;

  maxUses?: number;
  usedCount: number;
  maxUsesPerCustomer?: number;
  oneUsePerCustomer?: boolean;

  minimumOrderValue?: number;
  minimumItemsQuantity?: number;

  stackable?: boolean;

  appliesTo:
    | "all"
    | "products"
    | "categories"
    | "formats"
    | "subscription_plans"
    | "customers"
    | "customer_types";

  productIds?: string[];
  categories?: string[];
  formats?: string[];
  subscriptionPlanIds?: string[];
  customerIds?: string[];
  customerTypes?: string[];

  firstOrderOnly?: boolean;
  b2bOnly?: boolean;
  subscriptionOnly?: boolean;
  newCustomersOnly?: boolean;
  returningCustomersOnly?: boolean;
  allowGuestCheckout?: boolean;
  requireLoggedCustomer?: boolean;

  internalNotes?: string;

  stats?: {
    usedCount: number;
    totalDiscountGiven: number;
    totalRevenueGenerated: number;
    lastUsedAt?: any;
  };
}

export interface ContentBlock extends BaseEntity {
  key: string;
  page:
    | "home"
    | "cafes"
    | "origem"
    | "empresas"
    | "parceiros"
    | "assinatura"
    | "checkout"
    | "pedido"
    | "global";

  type:
    | "hero"
    | "section"
    | "cta"
    | "faq"
    | "banner"
    | "proof_bar"
    | "comparison"
    | "timeline"
    | "card_grid"
    | "text_block"
    | "map_copy"
    | "footer"
    | "seo"
    | "navbar"
    | "data_bar"
    | "storytelling_cards"
    | "product_showcase"
    | "club_section"
    | "b2b_section"
    | "origin_section"
    | "partners_locator"
    | "final_cta";

  title?: string;
  subtitle?: string;
  body?: string;

  content?: any;
  publicRoute?: string;

  ctas?: Array<{
    label: string;
    url: string;
    type: "primary" | "secondary" | "whatsapp" | "checkout" | "catalog" | "b2b";
    active: boolean;
  }>;

  items?: Array<any>;

  status: "draft" | "published" | "archived";
  active: boolean;
  order?: number;

  publishAt?: any;
  expireAt?: any;

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    socialTitle?: string;
    socialDescription?: string;
    socialImage?: string;
    noIndex?: boolean;
  };

  source?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface FAQItem extends BaseEntity {
  page: string;
  category?: string;
  question: string;
  answer: string;
  active: boolean;
  status: "draft" | "published" | "archived";
  order?: number;
}

export interface Banner extends BaseEntity {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  page: string;
  position: string;
  type?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  active: boolean;
  startDate?: any;
  endDate?: any;
  priority?: number;
  audience?: "all" | "b2c" | "b2b" | "subscription" | "recurring";
}

export interface CouponUsage extends BaseEntity {
  couponId: string;
  couponCode: string;
  orderId: string;
  customerId?: string;
  customerEmail?: string;
  customerWhatsapp?: string;
  subtotalBeforeDiscount: number;
  shippingBeforeDiscount: number;
  discountAmount: number;
  totalAfterDiscount: number;
  usedAt: any;
}

export interface SubscriptionPlan extends BaseEntity {

  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;

  active: boolean;
  featured?: boolean;
  publicVisible: boolean;
  displayOrder?: number;

  priceFrom: number;
  fixedPrice?: number;
  frequency: "weekly" | "biweekly" | "monthly" | "bimonthly" | "custom";
  shipmentsPerCycle?: number;
  setupFee?: number;
  shippingIncluded?: boolean;
  commercialNotes?: string;

  type: "home" | "explorer" | "office" | "b2b" | "gift";
  idealFor?: string[];
  sensoryProfile?: string[];

  eligibleProductIds?: string[];
  eligibleCategories?: string[];
  eligibleFormats?: string[];
  estimatedWeightPerShipmentGrams?: number;
  estimatedKgPerMonth?: number;

  benefits?: string[];

  publicTitle?: string;
  publicSubtitle?: string;
  publicButtonText?: string;
  badge?: string;
  visualStyle?: string;

  seoTitle?: string;
  seoDescription?: string;

  archived?: boolean;
}

export interface SubscriptionInterest extends BaseEntity {
  name: string;
  whatsapp?: string;
  email?: string;

  planId?: string;
  planName?: string;
  desiredProfile?: string[];
  desiredFrequency?: string;
  estimatedConsumption?: string;
  type?: "home" | "company" | "gift";

  status: "new" | "contacted" | "qualified" | "converted" | "no_response" | "lost";
  source: "subscription_page" | "whatsapp" | "admin" | "customer" | "referral" | "previous_order" | "other";

  responsibleUserId?: string;
  customerId?: string;
  subscriptionId?: string;

  notes?: Array<{
    id: string;
    text: string;
    userId: string;
    userName?: string;
    createdAt: any;
  }>;
}

export interface Subscription extends BaseEntity {
  customerId: string;
  customerName: string;
  customerWhatsapp?: string;
  customerEmail?: string;

  planId: string;
  planName: string;

  status: "active" | "paused" | "cancelled" | "awaiting_payment" | "expired" | "test";

  frequency: "weekly" | "biweekly" | "monthly" | "bimonthly" | "custom";
  startDate: any;
  nextShipmentAt?: any;
  lastShipmentAt?: any;

  estimatedValue?: number;
  estimatedKgPerMonth?: number;
  preferredProductIds?: string[];

  preferences?: {
    format?: "beans" | "ground" | "capsule" | "mixed";
    grindType?: string;
    sensoryProfile?: string[];
    brewMethods?: string[];
    avoidNotes?: string[];
    notes?: string;
  };

  shippingAddress?: {
    cep?: string;
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
  };

  payment?: {
    method?: string;
    status?: "pending" | "active" | "failed" | "manual";
  };

  relatedOrderIds?: string[];
}
