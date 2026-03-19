"use client"

import { useState } from "react";
import EntryExitForm from "./EntryExitForm";
import ResponseWindow from "./ResponseWindow";
import { Request } from "@/lib/types/types";

export default function ValetModule({ companyId }: { companyId: number }) {

  const [mode, setMode] = useState<"entry" | "exit">("entry");
  const [response, setResponse] = useState<Request | null>(null);

  return (
    <div className="grid gap-4 md:grid-cols-2">

      <EntryExitForm
        mode={mode}
        setMode={setMode}
        response={response}
        setResponse={setResponse}
      />

      <ResponseWindow
        response={response}
        companyId={companyId}
        setMode={setMode}
        setResponse={setResponse}
      />

      {/* <ResponseWindow
        response={response}
        triggerExit={() => setMode("exit")}
      /> */}

    </div>
  );
}