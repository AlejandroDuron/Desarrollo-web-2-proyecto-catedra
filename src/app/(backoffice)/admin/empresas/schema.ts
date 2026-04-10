export type EmpresaStatus = "activa" | "inactiva" | "pendiente";

export interface EmpresaFormValues {
  nombre: string;
  rubro: string;
  correo: string;
  telefono: string;
  status: EmpresaStatus;
}

export const empresaInitialValues: EmpresaFormValues = {
  nombre: "",
  rubro: "",
  correo: "",
  telefono: "",
  status: "pendiente",
};
