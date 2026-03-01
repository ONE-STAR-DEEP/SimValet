import { LoginForm } from "@/components/company/login-form";
import { getSessionUser } from "@/lib/checkSession";
import { redirect } from "next/navigation";

export default async function LoginPage() {

    const session = await getSessionUser();
    if (Number(session?.company_id)) {
      redirect(`/company/dashboard`);
    }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
