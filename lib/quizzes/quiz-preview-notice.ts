interface QuizViewer {
  canManage: boolean;
  isGuest: boolean;
}

export function resolveQuizPreviewNotice({ canManage, isGuest }: QuizViewer): string | null {
  if (canManage) {
    return "Estás viendo el cuestionario como docente. Tus intentos no se guardan ni aparecen en los resultados.";
  }
  if (isGuest) {
    return "Estás navegando como invitado: ves tu resultado al terminar, pero no se guarda.";
  }
  return null;
}
