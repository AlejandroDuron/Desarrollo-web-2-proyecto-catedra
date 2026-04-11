import { redirect } from "next/navigation";

import { getDefaultPathByRole } from "@/types/roles";
import { getAuthenticatedEmployee } from "@/lib/supabase/server";

export default async function HomePage() {
  const context = await getAuthenticatedEmployee();

  if (!context) {
    redirect("/login");
  }

  redirect(getDefaultPathByRole(context.empleado.rol));
}
