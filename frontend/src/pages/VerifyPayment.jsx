// Create a new component: VerifyPayment.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const VerifyPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verifying your payment...');
  const [retryCount, setRetryCount] = useState(0);
  const [debugInfo, setDebugInfo] = useState(null);

  const appointmentId = searchParams.get('appointmentId');
  const sessionId = searchParams.get('sessionId');
 const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!appointmentId || !sessionId) {
      setStatus('error');
      setMessage('Missing verification parameters');
      return;
    }

    verifyPayment();
  }, [appointmentId, sessionId]);

  const verifyPayment = async (attempts = 0) => {
    console.log(`🔄 Verification attempt ${attempts + 1}`);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setStatus('error');
        setMessage('Authentication required. Please log in again.');
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const { data, status: httpStatus } = await axios.post(
        `${backendUrl}/api/appointment/verify`,
        { sessionId, appointmentId },
        config
      );

      console.log('Response status:', httpStatus);
      console.log('Response data:', data);

      // Store debug info
      setDebugInfo({
        httpStatus,
        responseData: data,
        attempt: attempts + 1,
        timestamp: new Date().toISOString()
      });

      // Handle processing status (retry)
      if (data.status === 'processing' || (data.payment_status === 'unpaid' && attempts < 8)) {
        console.log('⏳ Payment still processing, retrying...');
        if (attempts < 8) {
          setRetryCount(attempts + 1);
          setMessage(`Payment processing... Attempt ${attempts + 1}/8`);
          await new Promise((resolve) => setTimeout(resolve, 3000));
          return verifyPayment(attempts + 1);
        }
        throw new Error('Verification timeout after 8 attempts');
      }

      if (data.success) {
        console.log('✅ Payment verification successful');
        setStatus('success');
        setMessage(data.message);
        toast.success('Payment verified successfully!');
        setTimeout(() => {
          navigate(`/success/${appointmentId}`, {
            state: { appointment: data.appointment },
          });
        }, 3000);
      } else {
        console.log('❌ Payment verification failed');
        setStatus('error');
        setMessage(data.message || 'Verification failed. Please try again.');
        toast.error(data.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('💥 Verification error:', error);
      
      setStatus('error');
      let errorMessage = 'Payment verification failed. Please contact support.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Authentication expired. Please log in again.';
        localStorage.removeItem('token');
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        if (error.response.data.details) {
          errorMessage += ` (${error.response.data.details})`;
        }
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Verification is taking longer than expected. Please check your appointment status or contact support.';
      }
      
      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleRetry = () => {
    setStatus('loading');
    setMessage('Retrying verification...');
    setRetryCount(0);
    verifyPayment();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === 'loading' && (
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          )}
          
          {status === 'success' && (
            <div className="mx-auto flex items-center justify-center h-32 w-32 rounded-full bg-green-100">
              <svg className="h-16 w-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          )}
          
          {status === 'error' && (
            <div className="mx-auto flex items-center justify-center h-32 w-32 rounded-full bg-red-100">
              <svg className="h-16 w-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          )}
          
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {status === 'loading' && 'Verifying Payment'}
            {status === 'success' && 'Payment Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h2>
          
          <p className="mt-2 text-sm text-gray-600">{message}</p>
          
          {retryCount > 0 && (
            <p className="mt-1 text-xs text-blue-600">
              Retry attempt: {retryCount}/8
            </p>
          )}
        </div>

        <div className="mt-8 space-y-6">
          {status === 'error' && (
            <div className="flex space-x-4">
              <button
                onClick={handleRetry}
                className="group relative flex-1 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
              <button
                onClick={handleGoHome}
                className="group relative flex-1 flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go Home
              </button>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Redirecting to confirmation page in 3 seconds...
              </p>
            </div>
          )}

          {/* Debug information (only in development) */}
          {process.env.NODE_ENV === 'development' && debugInfo && (
            <details className="mt-4">
              <summary className="text-xs text-gray-500 cursor-pointer">Debug Info</summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyPayment;