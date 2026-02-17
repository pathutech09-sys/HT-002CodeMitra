import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../types';

interface AuthProps {
  onAuthSuccess: (user: User, initialData?: any, workingUrl?: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // serverOnline state: null = checking, true = online, false = offline
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);
  
  // Priority: localhost then 127.0.0.1
  const ENDPOINTS = ["http://localhost:5000", "http://127.0.0.1:5000"];
  const [activeUrl, setActiveUrl] = useState(ENDPOINTS[0]);
  const isHttps = window.location.protocol === 'https:';

  const checkServer = useCallback(async () => {
    let found = false;
    for (const url of ENDPOINTS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

        const res = await fetch(`${url}/health?t=${Date.now()}`, { 
          method: 'GET',
          mode: 'cors',
          cache: 'no-store',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'online') {
            setServerOnline(true);
            setActiveUrl(url);
            found = true;
            break;
          }
        }
      } catch (e) {
        // Continue to next endpoint on failure
      }
    }
    
    if (!found) {
      setServerOnline(false);
    }
  }, []);

  useEffect(() => {
    checkServer();
    // Regular check every 15 seconds to keep status updated
    const interval = setInterval(checkServer, 15000);
    return () => clearInterval(interval);
  }, [checkServer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const targetUrl = `${activeUrl}${endpoint}`;

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: isLogin ? undefined : username.trim(),
          email: email.trim(),
          password: password.trim()
        })
      });

      const result = await response.json();
      
      if (response.ok && result.status === 'success') {
        if (isLogin) {
          onAuthSuccess(result.user, result.data, activeUrl);
        } else {
          setSuccessMessage("Account created! You can now sign in.");
          setIsLogin(true);
          setUsername('');
          setPassword('');
        }
      } else {
        setErrorMessage(result.message || "Authentication failed. Check your credentials.");
      }
    } catch (err: any) {
      console.error("[AUTH ERROR]", err);
      setErrorMessage("Connection Error. Is your backend running?");
      // If a fetch fails, re-verify server status
      checkServer();
    } finally {
      setIsLoading(false);
    }
  };

  // Buttons are only disabled if we are DEFINITELY offline AND not in troubleshooting mode
  const isButtonDisabled = isLoading || (serverOnline === false && !showTroubleshoot);

  return (
    <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-6 font-sans text-gray-900">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border border-indigo-100 flex flex-col relative overflow-hidden">
        
        {/* Connection Badge */}
        <div className={`absolute top-4 right-6 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border transition-colors duration-300 ${
          serverOnline === true ? 'bg-green-50 text-green-600 border-green-100' : 
          serverOnline === false ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-50 text-gray-400 border-gray-100'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            serverOnline === true ? 'bg-green-500 animate-pulse' : 
            serverOnline === false ? 'bg-red-500' : 'bg-gray-300 animate-bounce'
          }`}></span>
          {serverOnline === true ? 'Backend Live' : serverOnline === false ? 'Backend Offline' : 'Locating Server...'}
        </div>

        <div className="text-center mb-8 pt-4">
          <h1 className="text-4xl font-extrabold text-indigo-950 mb-2">FitMitra</h1>
          <p className="text-gray-500 font-medium">
            {isLogin ? 'Sign in to your account' : 'Join the fitness movement'}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-xs font-bold flex flex-col gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
             <div className="flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                <span className="flex-1">{errorMessage}</span>
             </div>
             {serverOnline === false && (
                <button 
                  onClick={() => setShowTroubleshoot(!showTroubleshoot)}
                  className="text-red-500 hover:underline text-left text-[10px] uppercase tracking-widest font-black"
                >
                  {showTroubleshoot ? 'Close Help' : 'Troubleshoot Connection?'}
                </button>
             )}
          </div>
        )}

        {showTroubleshoot && serverOnline === false && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl text-[11px] text-amber-800 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="font-black uppercase tracking-wider text-[10px]">🛠️ Fixing Connectivity:</p>
            <ol className="list-decimal pl-4 space-y-1 font-medium">
              <li>Run <b>python backend.py</b> in your terminal</li>
              <li>Ensure the server output shows "BACKEND RUNNING"</li>
              {isHttps && (
                <li className="text-red-700">
                  <b>Browser Security:</b> Click the 🔒 lock icon in the URL bar &rarr; Site Settings &rarr; Set <b>Insecure Content</b> to <b>Allow</b>.
                </li>
              )}
            </ol>
            <button 
              onClick={() => { checkServer(); setErrorMessage(null); }}
              className="w-full mt-2 bg-white border border-amber-200 hover:bg-amber-100 py-2 rounded-lg font-black transition-colors uppercase text-[10px]"
            >
              Manual Refresh
            </button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in zoom-in duration-500">
             <span className="text-lg">✅</span>
             <span className="flex-1">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="FitWarrior"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-indigo-950"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@email.com"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-indigo-950"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-indigo-950"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isButtonDisabled}
            className={`w-full py-4 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-3 ${
              isButtonDisabled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
          
          {serverOnline === false && !showTroubleshoot && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl mt-4 animate-pulse">
               <p className="text-center text-[10px] text-red-600 font-bold uppercase">
                Backend Offline - Actions Disabled
               </p>
            </div>
          )}

          {(serverOnline === null) && (
             <p className="text-center text-[10px] text-gray-400 font-bold uppercase mt-2">
               Verifying connection...
             </p>
          )}
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className="text-indigo-600 font-bold text-sm hover:underline"
          >
            {isLogin ? "No account? Create one here" : "Already registered? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;