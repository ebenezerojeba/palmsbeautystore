// import React, { useState, useContext, useEffect } from "react";
// // import { AppContext } from "../context/AppContext"
// import { toast } from "react-toastify";
// import axios from "axios";
// import { useNavigate } from "react-router";
// import { useSpring, animated, config } from "react-spring";
// import { Mail, Lock, User, EyeOff, Eye, Loader2 } from "lucide-react";
// import { AppContext } from "../context/AppContext";
// import { assets } from "../assets/assets";
// // import { assets } from "../assets/assets";

// const InputField = ({
//   icon: Icon,
//   type,
//   placeholder,
//   value,
//   onChange,
//   required,
// }) => {
//   const [showPassword, setShowPassword] = useState(false);
//   const inputAnimation = useSpring({
//     from: { opacity: 0, transform: "translateY(20px)" },
//     to: { opacity: 1, transform: "translateY(0px)" },
//     config: config.gentle,
//   });

//   return (
//     <animated.div className="w-full relative mb-4" style={inputAnimation}>
//       <Icon
//         className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//         size={18}
//       />
//       <input
//         className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
//         type={type === "password" && showPassword ? "text" : type}
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         required={required}
//       />
//       {type === "password" && (
//         <button
//           type="button"
//           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//           onClick={() => setShowPassword(!showPassword)}
//         >
//           {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//         </button>
//       )}
//     </animated.div>
//   );
// };

// const LoadingSpinner = () => (
//   <Loader2 className="animate-spin items-center" size={20} />
// );



// const Login = () => {
//   const { backendUrl, token, setToken } = useContext(AppContext);
//   const navigate = useNavigate();

//   const [state, setState] = useState("Sign Up");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const formAnimation = useSpring({
//     opacity: 1,
//     transform: "translateY(0px)",
//     from: { opacity: 0, transform: "translateY(50px)" },
//     config: config.gentle,
//   });

//   const switchAnimation = useSpring({
//     transform: state === "Sign Up" ? "translateX(0%)" : "translateX(100%)",
//     config: config.wobbly,
//   });


//     const onSubmitHandler = async (event) => {
//     event.preventDefault();
//     setIsLoading(true);

//     try {
//       if (state === "Sign Up") {
//         const { data } = await axios.post(backendUrl + "/api/user/register", {
//           name,
//           password,
//           email,
//         });
//         if (data.success && data.token) {
//           localStorage.setItem("token", data.token);
//           setToken(data.token);
//           console.log(data.token)
//           toast.success(data.message);
          
//         } else {
//           toast.error(data.message);
//           setIsLoading(false);
//         }
//       } else {
//         const { data } = await axios.post(backendUrl + "/api/user/login", {
//           password,
//           email,
//         });
//         if (data.success) {
//           localStorage.setItem("token", data.token);
//           setToken(data.token);
//           setIsLoading(false)
//           toast.success(data.message);
//         } else {
//           toast.error(data.message);
//           setIsLoading(false)
        
//     }
//     const {resetPassword} = await axios.get(backendUrl + 'api/user/reset-password', {
//       email
//     })
//     if (resetPassword.success) {
//       toast.success(resetPassword.message)
//     }
//     else{
//       toast.error()
//     }

//       }
//     } catch (error) {
//       setIsLoading(false)
//       toast.error(error.message);
//     }
//   };

//   // / Add this function to your frontend code
// const makeAuthenticatedRequest = async (url, method = 'get', body = null) => {
//   const token = localStorage.getItem('token');
  
//   const headers = {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${token}` // Send token as Bearer token
//   };
  
//   try {
//     const response = await axios({
//       url,
//       method,
//       headers,
//       data: body
//     });
    
//     return response.data;
//   } catch (error) {
//     console.error('API request failed:', error);
//     throw error;
//   }
// };



//   useEffect(() => {
//     if (token) {
//       navigate("/");
//     }
//   }, [token,]);

//   return (
//     <div className="min-h-screen relative bg-gray-700 flex items-center justify-center overflow-hidden">
 

//       {/* Content Container */}
//       <animated.div
//         style={formAnimation}
//         className="bg-black/5 backdrop-blur-sm p-4 sm:p-8 rounded-xl shadow-2xl w-[95%] max-w-md relative z-10 mx-4"
//       >
//         <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-gray-300">
//           {state === "Sign Up" ? "Create Account" : "Welcome Back"}
//         </h2>
//         <p className="text-center text-gray-400 mb-6 sm:mb-8">
//           {state === "Sign Up"
//             ? "Join us to book your appointments easily"
//             : "Login to access your account"}
//         </p>

//         <form onSubmit={onSubmitHandler} className="space-y-4">
//           {state === "Sign Up" && (
//             <InputField
//               icon={User}
//               type="text"
//               placeholder="Full Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           )}

//           <InputField
//             icon={Mail}
//             type="email"
//             placeholder="Email Address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           <InputField
//             icon={Lock}
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//          <h3 onClick={()=>navigate('/forgot-password')} className="text-right cursor-pointer text-primary"> {state === 'Sign Up' ? "" : 'Forgot Password ?'}</h3>

//          <div className="flex justify-center mt-4">
//   <button
//     type="submit"
//     disabled={isLoading}
//     className="px-5 py-2 mt-5 flex justify-center items-center border border-gray-50 bg-amber-50 text-primary rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//   >
//     {isLoading ? (
//       <LoadingSpinner />
//     ) : state === "Sign Up" ? (
//       "Create Account"
//     ) : (
//       "Login"
//     )}
//   </button>
// </div>

//         </form>

//         <div className="mt-6 relative">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-gray-300"></div>
//           </div>
//           <div className="relative flex justify-center text-sm">
//             <span className="px-2 bg-white text-gray-500">
//               {state === "Sign Up" ? "Already have an account?" : "New here?"}
//             </span>
//           </div>
//         </div>

//         <div className="mt-6 text-center">
//           <button
//             disabled={isLoading}
//             onClick={() => setState(state === "Sign Up" ? "Login" : "Sign Up")}
//             className="disabled:text-gray-400 px-4 py-1 text-white border border-amber-50 disabled:cursor-not-allowed text-primary hover:text-primary-dark transition-colors duration-300"
//           >
//             {state === "Sign Up" ? "Login" : "Create an account"}
            
//           </button>
//         </div>

//         <animated.div
//           style={switchAnimation}
//           className="absolute bottom-0 left-0 w-1/2 h-1 bg-primary"
//         ></animated.div>
//       </animated.div>
//     </div>
//   );
// };

// export default Login;

















import React, { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import { useSpring, animated, config } from "react-spring";
import { Mail, Lock, User, EyeOff, Eye, Loader2 } from "lucide-react";
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

  const inputAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: config.gentle,
  });

  return (
    <animated.div className="w-full relative mb-5" style={inputAnimation}>
      <div className={`relative transition-all duration-200 ${isFocused ? "ring-2 ring-primary/50 rounded-lg" : ""}`}>
        <Icon
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${isFocused ? "text-primary" : "text-gray-400"}`}
          size={18}
        />
        <input
          className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary bg-white/90 text-gray-800 transition-all duration-200"
          type={type === "password" && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {type === "password" && (
          <button
            type="button"
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${isFocused ? "text-primary" : "text-gray-400"}`}
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
const from = location.state?.from?.pathname || "/";


  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
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
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          password,
          email,
        });
        if (data.success && data.token) {
          localStorage.setItem("token", data.token);
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
    navigate(from, { replace: true });
  }
}, [token, from, navigate]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/30 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-secondary/30 blur-3xl animate-pulse delay-300"></div>
      </div>

      <animated.div
        style={formAnimation}
        className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl w-full max-w-md relative z-10 p-8"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-primary"
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

        <h2 className="text-3xl font-bold text-center mb-2 text-white">
          {state === "Sign Up" ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-center text-gray-300 mb-8">
          {state === "Sign Up"
            ? "Join us to book your appointments easily"
            : "Login to access your account"}
        </p>

        <form onSubmit={onSubmitHandler} className="space-y-4">
          {state === "Sign Up" && (
            <InputField
              icon={User}
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <InputField
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <InputField
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {state === "Login" && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-primary hover:text-primary-light transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-300 ${
              isLoading
                ? "bg-primary/70 cursor-not-allowed"
                : "bg-primary hover:bg-primary-dark shadow-lg hover:shadow-primary/30"
            } flex items-center justify-center space-x-2`}
          >
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                {state === "Sign Up" ? "Create Account" : "Login"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600/30"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 bg-transparent text-sm text-gray-400">
              {state === "Sign Up" ? "Already have an account?" : "New here?"}
            </span>
          </div>
        </div>

        <button
          disabled={isLoading}
          onClick={() => setState(state === "Sign Up" ? "Login" : "Sign Up")}
          className={`w-full py-2.5 rounded-lg font-medium transition-colors duration-300 ${
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