import prismaClient from "@/lib/prismaClient";

export async function GET() {
  try {
    const province = await prismaClient.province.findMany();

    return Response.json(province);
  } catch {
    return Response.json(`Error: Can't fetch cities`);
  }
}
