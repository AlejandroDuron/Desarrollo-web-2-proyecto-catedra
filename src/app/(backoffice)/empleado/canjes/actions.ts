"use server";

import { getCuponByCodigo, registrarCanje } from "./queries";

export async function verificarCupon(codigo: string) {
  const cupon = await getCuponByCodigo(codigo);

  if (!cupon) return { success: false, message: "El cupón no existe en el sistema." };

  if (cupon.estado_cupon !== "Disponible") {
    return { success: false, message: `Este cupón no está disponible. Estado: ${cupon.estado_cupon}.` };
  }

  return { success: true, data: cupon };
}

export async function registrarCanjeFinal(codigo: string) {
  try {
    await registrarCanje(codigo);
    return { success: true };
  } catch (e) {
    return { success: false, message: (e as Error).message };
  }
}