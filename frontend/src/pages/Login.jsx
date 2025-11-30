
import React, { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useSpring, animated, config } from "react-spring";
import { Mail, Lock, User, EyeOff, Eye, Phone, Loader2 } from "lucide-react";
import { AppContext } from "../context/AppContext";

import { assets } from "../assets/assets";

const InputField = ({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  required,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

    const formatPhoneNumber = (value) => {
  // Remove all non-digits
  const cleaned = value.replace(/\D/g, '');
  
  // Limit to 10 digits
  const limited = cleaned.slice(0, 10);
  
  // Format as (XXX) XXX-XXXX
  if (limited.length <= 3) {
    return limited;
  } else if (limited.length <= 6) {
    return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
  } else {
    return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
  }
};

const handleChange = (e) => {
  if (type === "tel") {
    const formatted = formatPhoneNumber(e.target.value);
    onChange({ ...e, target: { ...e.target, value: formatted } });
  } else {
    onChange(e);
  }
};

  const inputAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: config.gentle,
  });

  return (
    <animated.div className="w-full relative mb-3" style={inputAnimation}>
      <div className={`relative transition-all duration-200 ${isFocused ? "ring-2 ring-primary/50 rounded-lg" : ""}`}>
        <Icon
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${isFocused ? "text-primary" : "text-gray-400"}`}
          size={12}
        />
        <input
          className="w-full pl-10 pr-10 py-2.5 rounded-lg border-gray-100 focus:outline-none focus:border-none bg-white/90 text-gray-800 transition-all duration-200 text-sm"
          type={type === "password" && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {type === "password" && (
          <button
            type="button"
            className={`absolute  right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${isFocused ? "text-primary" : "text-gray-400"}`}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </animated.div>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center">
    <Loader2 className="animate-spin text-white" size={24} />
  </div>
);

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [phoneError, setPhoneError] = useState("");



  // Get redirect information from multiple sources for better mobile compatibility
  const getRedirectInfo = () => {
    // First try URL parameters (most reliable for mobile)
    const redirectTo = searchParams.get('redirect');
    const categoryParam = searchParams.get('category');
    const serviceParam = searchParams.get('service');
    const scrollParam = searchParams.get('scroll');

    // Fallback to location state
    const stateFrom = location.state?.from;
    const stateCategory = location.state?.category;
    const stateService = location.state?.service;
    const stateScrollY = location.state?.scrollY;

    return {
      from: redirectTo || stateFrom || '/',
      category: categoryParam || stateCategory,
      service: serviceParam || stateService,
      scrollY: scrollParam ? parseInt(scrollParam) : stateScrollY,
    };
  };

  const redirectInfo = getRedirectInfo();

  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const formAnimation = useSpring({
    opacity: 1,
    transform: "translateY(0px)",
    from: { opacity: 0, transform: "translateY(50px)" },
    config: config.gentle,
  });

  const switchAnimation = useSpring({
    transform: state === "Sign Up" ? "translateX(0%)" : "translateX(100%)",
    config: config.wobbly,
  });

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (state === "Sign Up") {

        // Clean phone number before sending
      const cleanedPhone = '+1' + phone.replace(/\D/g, '');

        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          password,
          email,
          phone: cleanedPhone,
        });
        if (data.success && data.token) {
          localStorage.setItem("token", data.token);
          console.log("Frontend token:", token);

          setToken(data.token);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          password,
          email,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      const { from, category, service, scrollY } = redirectInfo;
      
      // Add a small delay to ensure token is properly set
      setTimeout(() => {
        if (from.startsWith('/appointment/')) {
          // Direct appointment booking
          navigate(from, { replace: true });
        } else if (from === '/services' || from.includes('/services')) {
          // Services page with category/scroll state
          navigate(from, {
            replace: true,
            state: { category, service, scrollY },
          });
        } else {
          // Default redirect
          navigate(from, { replace: true });
        }
      }, 100);
    }
  }, [token, redirectInfo, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 -mt-16">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/30 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-secondary/30 blur-3xl animate-pulse delay-300"></div>
      </div>

      <animated.div
        style={formAnimation}
        className="bg-pink-900 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl w-full max-w-sm relative z-10 p-4"
      >
        <div className="flex justify-center mb-2">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-primary bg-gray-300 rounded-full p-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl cursor-pointer font-bold text-center mb-6 text-white">
          {state === "Sign Up" ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-center cursor-pointer text-gray-300 mb-8">
          {state === "Sign Up"
            ? "Join us to book your appointments easily"
            : "Login to access your account"}
        </p>

        {/* Debug info - remove in production */}


     <form onSubmit={onSubmitHandler} className="space-y-4">
  {state === "Sign Up" && (
    <>
      <InputField
        icon={User}
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <InputField
        icon={Mail}
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <InputField
        icon={Phone}
        type="tel"
        placeholder="+1 (XXX) XXX-XXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
    </>
  )}

  {state === "Login" && (
    <InputField
      icon={Mail}
      type="email"
      placeholder="Email Address"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
  )}

  <InputField
    icon={Lock}
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />

  <button
    type="submit"
    disabled={isLoading}
    className={`w-full cursor-pointer py-2 px-3 rounded-lg font-medium text-white transition-all duration-300 ${
      isLoading
        ? "bg-pink-900/70 cursor-not-allowed"
        : "bg-pink-800 hover:bg-primary-dark shadow-lg hover:shadow-primary/30"
    } flex items-center justify-center space-x-2`}
  >
    {isLoading ? (
      <LoadingSpinner />
    ) : (
      <>
        {state === "Sign Up" ? "Create Account" : "Login"}
      </>
    )}
  </button>
</form>


        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600/30"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 cursor-pointer bg-transparent text-sm text-gray-400">
              {state === "Sign Up" ? "Already have an account?" : "New here?"}
            </span>
          </div>
        </div>

        <button
          disabled={isLoading}
          onClick={() => setState(state === "Sign Up" ? "Login" : "Sign Up")}
          className={`w-full cursor-pointer py-2.5 rounded-lg font-medium transition-colors duration-300 ${
            isLoading
              ? "text-gray-400 cursor-not-allowed"
              : "text-primary hover:text-primary-light"
          }`}
        >
          {state === "Sign Up" ? "Login to existing account" : "Create new account"}
        </button>

        <animated.div
          style={switchAnimation}
          className="absolute bottom-0 left-0 w-1/2 h-1 bg-primary rounded-t-full"
        ></animated.div>
      </animated.div>
    </div>
  );
};

export default Login;


