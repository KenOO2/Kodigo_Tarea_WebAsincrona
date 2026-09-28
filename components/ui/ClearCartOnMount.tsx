"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/lib/cart-store";

// Red de seguridad: si por cualquier motivo el checkout no alcanzó a
// vaciar el carrito antes de navegar aquí, lo hacemos al montar esta
// pantalla. Llegar a la confirmación implica, por definición, que la
// compra se completó.
export default function ClearCartOnMount() {
  const { clear } = useCart();
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
