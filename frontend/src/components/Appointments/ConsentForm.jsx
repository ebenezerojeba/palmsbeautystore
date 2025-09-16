import { FileText } from "lucide-react";

const ConsentForm = ({ 
  consentForm, 
  setConsentForm, 
  showConsentForm, 
  
}) => {
  return (
     <div className="bg-white rounded-lg shadow-sm">
               <div className="p-1 border-b border-gray-200">
                 <div className="flex items-center justify-between">
                   <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                     <FileText className="h-5 w-5 mr-2" />
                     Consent Form
                   </h3>
                   <button
                     // onClick={() => setShowConsentForm(!showConsentForm)}
                     className="text-sm text-blue-600 hover:text-blue-800"
                   >
                     {/* {showConsentForm ? 'Hide Form' : 'Show Form'} */}
                   </button>
                 </div>
               </div>
   
               {showConsentForm && (
                 <div className="p-6 space-y-6">
                   {/* Health Information */}
                   <div className="space-y-4">
                     {/* <h4 className="font-medium text-gray-900">Health Information</h4> */}
   
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">
                         Do you have any health conditions we should be aware of?
                       </label>
                       <textarea
                         value={consentForm.healthConditions}
                         onChange={(e) => setConsentForm({ ...consentForm, healthConditions: e.target.value })}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                         rows="2"
                         placeholder="Please list any relevant health conditions..."
                       />
                     </div>
   
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">
                         Allergies (especially to hair products, chemicals, or materials)
                       </label>
                       <textarea
                         value={consentForm.allergies}
                         onChange={(e) => setConsentForm({ ...consentForm, allergies: e.target.value })}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                         rows="2"
                         placeholder="List any known allergies..."
                       />
                     </div>
                   </div>
   
                   {/* Consent Checkboxes */}
                   <div className="space-y-4">
                     {/* <h4 className="font-medium text-gray-900">Consent & Agreement</h4> */}
   
                     <div className="space-y-3">
                       <div className="flex items-start space-x-3">
                         <input
                           type="checkbox"
                           id="consent-treatment"
                           checked={consentForm.consentToTreatment}
                           onChange={(e) => setConsentForm({ ...consentForm, consentToTreatment: e.target.checked })}
                           className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded mt-1"
                         />
                         <label htmlFor="consent-treatment" className="text-sm text-gray-700">
                           I consent to receive the selected beauty/hair services and understand the procedures involved
                         </label>
                       </div>
   
                       {/* <div className="flex items-start space-x-3">
               <input
                 type="checkbox"
                 id="consent-photography"
                 checked={consentForm.consentToPhotography}
                 onChange={(e) => setConsentForm({...consentForm, consentToPhotography: e.target.checked})}
                 className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded mt-1"
               />
               <label htmlFor="consent-photography" className="text-sm text-gray-700">
                 I consent to before/after photos being taken for portfolio purposes (optional)
               </label>
             </div> */}
                     </div>
                   </div>
                 </div>
               )}
             </div>
   
  );
};

export default ConsentForm;