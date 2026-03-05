import { AuthGuard } from "../../components/shared/AuthGuard";
import { WizardManager } from "../../features/create-pet/components/WizardManager";

export default function CreatePetPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-gray-50 py-12">
        <WizardManager />
      </main>
    </AuthGuard>
  );
}