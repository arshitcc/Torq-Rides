import { Suspense } from "react";
import VerifyContent from "./content";

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  );
}
