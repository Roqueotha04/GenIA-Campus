import { sampleResultSchema } from "./schemas";

export const sampleResults = sampleResultSchema.array().parse([
  { studentName: "Martina Rossi", score: 11, total: 12, date: "24 oct" },
  { studentName: "Julián Acosta", score: 9, total: 12, date: "24 oct" },
  { studentName: "Carolina Medina", score: 7, total: 12, date: "25 oct" },
  { studentName: "Sergio Benítez", score: 5, total: 12, date: "25 oct" },
]);
