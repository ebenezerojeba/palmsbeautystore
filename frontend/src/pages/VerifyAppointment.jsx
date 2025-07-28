// FRONTEND - Enhanced error handling and retry logic
import { useContext, useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function VerifyAppointment() {
  const { appointmentId } = useParams();
  const {backendUrl} = useContext(AppContext)
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [debugInfo, setDebugInfo] = useState(null);
  const navigate = useNavigate();


  const isValidId = (id) => typeof id === 'string' && id.length === 24;
  const isValidSessionId = (id) => typeof id === 'string' && id.trim() !== '';

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    validateStatus: (status) => status >= 200 && status < 500,
  };

  const verifyPayment = async (attempts = 0) => {
    console.log(`🔄 Verification attempt ${attempts + 1}`);
    
    try {
      const { data, status: httpStatus } = await axios.post(backendUrl +
        '/api/appointment/verify',
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
          await new Promise((resolve) => setTimeout(resolve, 3000));
          return verifyPayment(attempts + 1);
        }
        throw new Error('Verification timeout after 8 attempts');
      }

      if (data.success) {
        console.log('✅ Payment verification successful');
        setStatus('success');
        setMessage(data.message);
        setTimeout(() => {
          navigate(`/success/${appointmentId}`, {
            state: { appointment: data.appointment },
          });
        }, 3000);
      } else {
        console.log('❌ Payment verification failed');
        setStatus('error');
        setMessage(data.message || 'Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('💥 Verification error:', error);
      
      setStatus('error');
      let errorMessage = 'Payment verification failed. Please contact support.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        if (error.response.data.details) {
          errorMessage += ` (${error.response.data.details})`;
        }
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Verification is taking longer than expected. Please check your appointment status or contact support.';
      }
      
      setMessage(errorMessage);
    }
  };

  useEffect(() => {
    console.log('🏁 Starting verification process');
    console.log('Appointment ID:', appointmentId);
    console.log('Session ID:', sessionId);
    console.log('Token present:', !!localStorage.getItem('token'));

    if (!appointmentId || !sessionId) {
      setStatus('error');
      setMessage('Missing required parameters');
      return;
    }

    if (!isValidId(appointmentId) || !isValidSessionId(sessionId)) {
      setStatus('error');
      setMessage('Invalid parameters format');
      return;
    }

    if (!localStorage.getItem('token')) {
      setStatus('error');
      setMessage('Authentication required. Please log in.');
      return;
    }

    verifyPayment();
  }, [appointmentId, sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center">
        {status === 'verifying' && (
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            <h2 className="text-xl font-semibold text-gray-700">
              Verifying your payment...
            </h2>
            {retryCount > 0 && (
              <p className="text-sm text-gray-500">
                Attempt {retryCount + 1} of 8
              </p>
            )}
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-3 text-green-600">
            <svg className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="text-2xl font-bold">Payment Verified!</h2>
            <p className="text-gray-700">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to your appointment...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-centers gap-4 text-red-600">
            <svg className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <h2 className="text-2xl font-bold">Verification Failed</h2>
            <p className="text-gray-700 mb-4">{message}</p>
            
            <div className="space-y-2">
              <button
                onClick={() => {
                  setStatus('verifying');
                  setRetryCount(0);
                  verifyPayment();
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Try Again
              </button>
              
              <button
                onClick={() => navigate('/my-appointments')}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                View My Appointments
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}