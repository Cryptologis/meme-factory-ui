import CreateTokenForm from "@/components/CreateTokenForm";

export default function CreateTokenPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Create Your Token</h1>
          <p className="text-muted-foreground text-lg">
            Launch your own SPL token on Solana devnet in minutes
          </p>
        </div>

        <CreateTokenForm
          onSubmit={(data) => {
            console.log("Token created:", data);
            alert(`Token ${data.symbol} created successfully!`);
          }}
        />
      </div>
    </div>
  );
}
