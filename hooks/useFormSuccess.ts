"use client";

import { useEffect, useRef } from "react";
import type { FormState } from "@/lib/forms/form-state";

export function useFormSuccess(state: FormState, onSuccess?: () => void) {
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    if (state.status === "success") onSuccessRef.current?.();
  }, [state]);
}
