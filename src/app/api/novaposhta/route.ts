import { NextRequest, NextResponse } from "next/server";

const NP_API_KEY = "e696d95ae6de64d593ee853fb076aaf1";
const NP_API_URL = "https://api.novaposhta.ua/v2.0/json/";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, query, cityRef } = body;

    let npBody: any = {};

    if (action === "searchCity") {
      npBody = {
        apiKey: NP_API_KEY,
        modelName: "Address",
        calledMethod: "searchSettlements",
        methodProperties: {
          CityName: query,
          Limit: "10",
          Page: "1",
        },
      };
    } else if (action === "getWarehouses") {
      npBody = {
        apiKey: NP_API_KEY,
        modelName: "Address",
        calledMethod: "getWarehouses",
        methodProperties: {
          CityRef: cityRef,
          FindByString: query || "",
          Limit: "30",
          Page: "1",
        },
      };
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const response = await fetch(NP_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(npBody),
    });

    const data = await response.json();

    if (action === "searchCity" && data.success) {
      const cities = (data.data?.[0]?.Addresses || []).map((c: any) => ({
        ref: c.DeliveryCity,
        name: c.Present,
      }));
      return NextResponse.json({ cities });
    }

    if (action === "getWarehouses" && data.success) {
      const warehouses = (data.data || []).map((w: any) => ({
        ref: w.Ref,
        name: w.Description,
        number: w.Number,
      }));
      return NextResponse.json({ warehouses });
    }

    return NextResponse.json({ cities: [], warehouses: [] });
  } catch (error) {
    console.error("NP API error:", error);
    return NextResponse.json({ error: "API error" }, { status: 500 });
  }
}
