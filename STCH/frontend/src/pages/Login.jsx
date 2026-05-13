import BrandingPanel from "../components/auth/BrandingPanel";
import LoginForm from "../components/auth/LoginForm";

function Login() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">

      <div className="w-full max-w-5xl min-h-[650px] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl flex">

        {/* LEFT PANEL */}
        <div className="hidden md:flex w-1/2 bg-white">
          <BrandingPanel />
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-1/2 bg-black flex items-center justify-center p-10">
          <LoginForm />
        </div>

      </div>

    </div>
  );
}

export default Login;