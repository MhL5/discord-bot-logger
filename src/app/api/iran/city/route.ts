import prismaClient from "@/lib/prismaClient";
import { City } from "@prisma/client";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const res: { provinceId: string } | undefined = await request.json();

    const provinceId = res?.provinceId;

    let cities: City[] = [];

    if (provinceId) {
      cities = await prismaClient.city.findMany({ where: { provinceId } });
    } else {
      cities = await prismaClient.city.findMany();
    }

    return Response.json(cities);
  } catch {
    return Response.json(`Error: Can't fetch cities`);
  }
}
