import { useState } from "react";
import Link from "next/link";

export default function TermsofService() {
  const [isNorwegian, setIsNorwegian] = useState(true);

  const toggleLanguage = () => {
    setIsNorwegian(!isNorwegian);
  };

  return (
    <div className="min-h-screen h-full px-5 font-mono">
      <button onClick={toggleLanguage} className="underline">
        {isNorwegian ? "Switch to English" : "Bytt til Norsk"}
      </button>

      {isNorwegian ? (
        <>
          <h1 className="my-4">Salgsbetingelser</h1>
          <p>
            <span>1. Generelt</span><br />
            Disse vilkårene gjelder for alle kjøp gjort i vår nettbutikk. Ved å handle hos oss godtar du våre betingelser og plikter beskrevet nedenfor.
          </p>
          <p>
            <span>2. Partene</span><br />
            Selger er OINO, [Orgnummer: 934582969] [Tlf: +4792919979] [E-post: oinojorgen@gmail.com]. Kjøper er den forbrukeren som foretar bestillingen.
          </p>
          <p>
            <span>3. Priser og betaling</span><br />
            Alle priser er oppgitt i NOK og inkluderer mva. Vi tilbyr sikker betaling via Stripe, Vipps og PayPal.
            Beløpet trekkes umiddelbart ved kjøp, og du vil motta en bekreftelse på e-post etter gjennomført betaling.
          </p>

          <p>
            <span>4. Levering</span><br />
            Levering skjer senest innen 30 dager etter bestilling. Fraktkostnader vises ved utsjekk.
          </p>
          <p>
            <span>5. Risiko for varen</span><br />
            Risikoen for varen går over på kjøper ved mottak.
          </p>
          <p>
            <span>6. Angrerett</span><br />
            Du har 14 dagers angrerett. Returkostnader bæres av kjøper med mindre annet er avtalt. Unike eller spesialtilpassede kunstverk kan være unntatt angreretten.
          </p>
          <p>
            <span>7. Reklamasjon</span><br />
            Ved feil eller mangler kan du kreve retting, omlevering, prisavslag eller heving av kjøpet i henhold til forbrukerkjøpsloven.Om du ønsker å kontakte oss på mail: oinojorgen@gmail.com
          </p>
          <p>
            <span>8. Selgerens rettigheter ved mislighold</span><br />
            Dersom kjøperen ikke betaler, kan selger kreve renter, inkassogebyr og eventuelt heving av kjøpet.
          </p>
          <p>
            <span>9. Personvern</span><br />
            Vi behandler personopplysninger konfidensielt og kun i samsvar med gjeldende lovgivning.
          </p>
          <p>
            <span>10. Konfliktløsning</span><br />
            Gjerne kontakt oss på mail oinojorgen@gmail.com. Ved tvister kan kjøper ta kontakt med Forbrukertilsynet for mekling. EU-forbrukere kan også bruke ODR-plattformen.
          </p>
        </>
      ) : (
        <>
          <h1 className="my-4">Terms of Service</h1>
          <p>
            <span>1. General</span><br />
            These terms apply to all purchases made in our online store. By shopping with us, you accept our terms and obligations described below.
          </p>
          <p>
            <span>2. Parties</span><br />
            The seller is OINO, [Orgnummer: 934582969] [Phone: +4792919979] [Mail: oinojorgen@gmail.com] - The buyer is the consumer placing the order.
          </p>
          <p>
            <span>3. Prices and Payment</span><br />
            All prices are listed in NOK and include VAT. We offer secure payment via Stripe and other available payment methods.
          </p>
          <p>
            <span>4. Delivery</span><br />
            Delivery takes place within 30 days of ordering. Shipping costs are displayed at checkout.
          </p>
          <p>
            <span>5. Risk of Goods</span><br />
            The risk of the goods transfers to the buyer upon receipt.
          </p>
          <p>
            <span>6. Right of Withdrawal</span><br />
            You have a 14-day right of withdrawal. Return costs are covered by the buyer unless otherwise agreed. Unique or custom-made artworks may be exempt from withdrawal rights.
          </p>
          <p>
            <span>7. Complaints</span><br />
            In case of defects or deficiencies, you may demand repair, replacement, price reduction, or cancellation of the purchase in accordance with consumer law.
          </p>
          <p>
            <span>8. Seller’s Rights in Case of Default</span><br />
            If the buyer fails to pay, the seller may charge interest, collection fees, and potentially cancel the purchase.
          </p>
          <p>
            <span>9. Privacy</span><br />
            We handle personal data confidentially and only in accordance with applicable laws.
          </p>
          <p>
            <span>10. Dispute Resolution</span><br />
            In case of disputes, the buyer may contact us at oinojorgen@gmail.com and the Consumer Authority for mediation. EU consumers may also use the ODR platform.
          </p>
        </>
      )}

      <div className="p-10">
        <Link href={"/Buy-art"} className="bg-purple-600 text-white px-3 py-4 ">Back to Shop</Link>
      </div>
    </div>
  );
}
