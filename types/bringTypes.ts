interface BringApiResponse {
  traceMessages: string[];
  consignments: Consignment[];
  uniqueId: string;
}

interface Consignment {
  products: Product[];
  consignmentId: string;
  uniqueId: string;
}

interface Product {
  id: string;
  customerNumber: string;
  productionCode: string;
  shippingWeight: number;
  guiInformation: GuiInformation;
  price: Price;
  expectedDelivery: ExpectedDelivery;
}

interface GuiInformation {
  sortOrder: string;
  mainDisplayCategory: string;
  subDisplayCategory: string;
  trackable: boolean;
  logo: string;
  logoUrl: string;
  displayName: string;
  productName: string;
  descriptionText: string;
  helpText: string;
  shortName: string;
  productURL: string;
  deliveryType: string;
  maxWeightInKgs: string;
}

interface Price {
  listPrice: PriceDetails;
  netPrice: PriceDetails;
  zones: { totalZoneCount: number };
}

interface PriceDetails {
  priceWithoutAdditionalServices: PriceAmount;
  priceWithAdditionalServices: PriceAmount;
  currencyCode: string;
}

interface PriceAmount {
  amountWithoutVAT: string;
  vat: string;
  amountWithVAT: string;
}

interface ExpectedDelivery {
  workingDays: string;
  userMessage: string;
  formattedExpectedDeliveryDate: string;
  expectedDeliveryDate: {
    year: string;
    month: string;
    day: string;
    timeSlots: TimeSlot[];
  };
  alternativeDeliveryDates: any[];
  formattedEarliestPickupDate: string;
  earliestPickupDate: {
    year: string;
    month: string;
    day: string;
    hour: string;
    minute: string;
  };
}

interface TimeSlot {
  startTime: { hour: string; minute: string };
  endTime: { hour: string; minute: string };
}
