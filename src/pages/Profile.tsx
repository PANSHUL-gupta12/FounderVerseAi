import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Dashboard from "@/components/Dashboard";
import { LogOut, User, Building } from "lucide-react";
import { motion } from "framer-motion";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [org, setOrg] = useState<any>(null);
  const [loadingOrg, setLoadingOrg] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    async function fetchOrg() {
      if (!user) return;
      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          org_id,
          organizations ( name )
        `)
        .eq('user_id', user.id)
        .single();
        
      if (!error && data?.organizations) {
        setOrg(data.organizations);
      }
      setLoadingOrg(false);
    }
    
    if (user) fetchOrg();
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (authLoading || !user) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 pb-16 pt-24">
        <motion.div 
          className="mb-8 rounded-2xl border border-border bg-secondary/30 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">My Profile</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-primary font-medium">
                <Building className="h-4 w-4" />
                <span>
                  {loadingOrg ? "Loading org..." : org ? `${org.name}` : "No Organization"}
                </span>
              </div>
            </div>
            
            <button 
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-6 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </motion.div>

        {/* The Dashboard component will handle loading projects. We will update Dashboard to use user.id / org_id */}
        <Dashboard />
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
