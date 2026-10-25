
export interface FormValuesReport {
  tema: string;
  descripcion: string;
}


export type ValidationErrors<T> = {
  [key in keyof T]?: string;
};