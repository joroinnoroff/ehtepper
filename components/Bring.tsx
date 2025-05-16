import { useState } from "react";
import Image from "next/image";

export default function CheckShipping() {
  const [postalCode, setPostalCode] = useState("");
  const [shippingInfo, setShippingInfo] = useState<any[]>([]);
  const [error, setError] = useState("");

  const checkShipping = async () => {
    setError("");
    setShippingInfo([]);

    if (!postalCode.match(/^\d{4}$/)) {
      setError("Vennligst skriv inn et gyldig postnummer (4 siffer)");
      return;
    }

    try {
      const response = await fetch("/api/bring-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postalCode }),
      });

      if (!response.ok) {
        throw new Error("Kunne ikke hente fraktalternativer.");
      }

      const data = await response.json();
      const options = data?.logistics?.dynamicOptionsCallback || data?.logistics?.dynamicOptions;

      if (options && options.length > 0) {
        const mappedOptions = options.map((opt: any, idx: number) => ({
          id: opt.id || `option-${idx}`,
          title: opt.displayName || "Fraktalternativ",
          amount: opt.amount,
          estimatedDelivery: opt.description?.replace("Estimert leveringstid: ", "") || "",
          formattedExpectedDeliveryDate: opt.expectedDelivery?.formattedExpectedDeliveryDate || "",
          logoUrl: opt.logoUrl || "",
        }));

        setShippingInfo(mappedOptions);
      } else {
        setError("Ingen fraktalternativer funnet for dette postnummeret.");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const resetShipping = () => {
    setPostalCode("");
    setShippingInfo([]);
    setError("");
  };

  return (
    <div className="checkShipping space-y-6">
      {shippingInfo.length === 0 ? (
        <div className="space-y-3">
          <div className="postCode">
            <label htmlFor="postalCode" className="block font-medium">Skriv inn ditt postnummer</label>
            <input
              type="text"
              name="postalCode"
              placeholder="####"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
          <button onClick={checkShipping} className="bg-black text-white px-4 py-2 rounded">
            Sjekk pris
          </button>
        </div>
      ) : (
        <button onClick={resetShipping} className="text-sm underline text-blue-600">
          Velg annen adresse
        </button>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {shippingInfo.length > 0 && (
        <div className="space-y-4">
          {shippingInfo.map((option) => (
            <div key={option.id} className="border w-4/5 mx-auto rounded-lg px-3 py-4 border-zinc-300 bg-zinc-50 my-5 space-y-2">
              <div className="flex items-center gap-4 flex-col lg:flex-row">
                {option.logoUrl && (
                  <Image
                    src={option.logoUrl}
                    alt={option.title}
                    width={64}
                    height={32}
                    className="object-contain"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{option.title}</h3>
                  <p className="text-sm text-zinc-600">{option.estimatedDelivery}</p>
                  {option.formattedExpectedDeliveryDate && (
                    <p className="text-xs text-zinc-500">Forventet levering: {option.formattedExpectedDeliveryDate}</p>
                  )}
                </div>
                <span className="font-medium">{option.amount.value / 100} NOK</span>
              </div>
              <input type="radio" name="shipping" id={option.id} className="h-5 w-5" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
