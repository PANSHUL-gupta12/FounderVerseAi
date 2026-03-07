import Navbar from "@/components/Navbar";
import SimulationForm from "@/components/SimulationForm";
import Footer from "@/components/Footer";

const Simulate = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 pb-16 pt-24">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-2 font-display text-3xl font-bold">
            Run Your <span className="gradient-text">Simulation</span>
          </h1>
          <p className="mb-8 text-muted-foreground">
            Provide details about your startup idea and let the AI boardroom evaluate it.
          </p>
          <div className="glass-card p-8">
            <SimulationForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Simulate;
