import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { GoogleIcon, MobileDocumentIcon } from "../../utils/icons";
import { Button, Spinner } from "../../components";

const Home = () => {
  const { user, loading, error, signInWithGoogle } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    // The redirection will happen in the useEffect when user state updates
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFAFB] relative overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="lg:hidden">
          <img
            src="/mobile-circle.png"
            alt=""
            className="absolute top-0 right-0 w-auto h-auto opacity-70"
          />
        </div>

        <div className="hidden lg:block">
          <img
            src="/desktop-circle.png"
            alt=""
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/4 w-auto h-auto opacity-60"
          />
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left side - Login content */}
          <div className="w-full lg:w-1/2 max-w-md mx-auto lg:mx-0 text-center lg:text-left space-y-10">
            <div className="flex flex-col items-center lg:items-start space-y-6">
              <div className="flex items-center gap-2">
                <div>
                  <MobileDocumentIcon width={40} height={40} color="#7B1984" />
                </div>
                <h1 className="text-[#7B1984] text-4xl font-bold">TaskBuddy</h1>
              </div>

              <p className="text-gray-900 font-medium text-md max-w-sm">
                Streamline your workflow and track progress effortlessly with
                our all-in-one task management app.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              size="lg"
              fullWidth
              className="py-5 bg-[#292929] hover:bg-black text-2xl"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner size="sm" color="white" />
                  <span>Loading...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <GoogleIcon width={30} height={30} />
                  <span>Continue with Google</span>
                </div>
              )}
            </Button>
          </div>

          {/* Right Side - Dashboard Preview Image (visible only on desktop) */}
          <div className="hidden lg:block fixed right-0 top-1/2 -translate-y-1/2 z-100 pointer-events-none">
            <img
              src="/dashboard-preview.png"
              alt="TaskBuddy Dashboard Preview"
              className="w-full h-[83vh] rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
