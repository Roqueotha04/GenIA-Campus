import { sampleResultSchema } from "./schemas";

export const sampleResults = sampleResultSchema.array().parse([
  { studentName: "Martina Rossi", score: 9, total: 10, date: "24 oct" },
  { studentName: "Julián Acosta", score: 7, total: 10, date: "24 oct" },
  { studentName: "Carolina Medina", score: 6, total: 10, date: "25 oct" },
  { studentName: "Sergio Benítez", score: 4, total: 10, date: "25 oct" },
]);
