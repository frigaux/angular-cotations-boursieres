export interface DTOStepExecution {
  nom: string;
  creation: string;  // ISO 8601 : yyyy-MM-ddTHH:mm:ss.SSSSSSZ
  debut: string;  // ISO 8601 : yyyy-MM-ddTHH:mm:ss.SSSSSSZ
  fin: string;  // ISO 8601 : yyyy-MM-ddTHH:mm:ss.SSSSSSZ
  statut: string;
  message?: string;
}
