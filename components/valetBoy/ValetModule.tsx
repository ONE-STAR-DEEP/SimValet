"use client"

import { useState } from "react";
import EntryExitForm from "./EntryExitForm";
import ResponseWindow from "./ResponseWindow";

export default function ValetModule() {

  const [mode, setMode] = useState<"entry" | "exit">("entry");
  const [response, setResponse] = useState<any>(null);

  return (
    <div className="grid gap-4 md:grid-cols-2">

      <EntryExitForm
        mode={mode}
        setMode={setMode}
        response={response}
        setResponse={setResponse}
      />

      <ResponseWindow />

      {/* <ResponseWindow
        response={response}
        triggerExit={() => setMode("exit")}
      /> */}

    </div>
  );
}