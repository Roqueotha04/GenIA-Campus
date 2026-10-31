import { userSchema } from "./schemas";

export const users = userSchema.array().parse([
  {
    id: "alumno-1",
    name: "Alumno Demo",
    email: "alumno1@genia.com",
    password: "genia1234",
    role: "alumno",
  },
  {
    id: "docente-1",
    name: "Docente Demo",
    email: "docente1@genia.com",
    password: "genia1234",
    role: "docente",
  },
]);
