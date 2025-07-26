// import React, { useContext } from 'react'
// import { ShopContext } from '../context/ShopContext';


// const CartTotal = () => {
//     const {formatNaira,getCartAmount} = useContext(ShopContext);
//   return (
//     <div className='w-full'>
//         <div className="text-2xl">
//             <div className="flex items-center justify-between">
//                 <button
//                     className="text-gray-500 hover:text-gray-700"
//                     onClick={() => window.history.back()}
//                     aria-label="Go back to previous page"
//                 >
//                     <ArrowLeft className="w-5 h-5" />
//                 </button>
//                 <h2 className="text-lg font-semibold">Cart Summary</h2>
//             <p className='text-bold'>CART TOTAL</p>

//         </div>
//         <div className="flex flex-col gap-2 mt-2 text-sm">
//             <div className="flex justify-between">
//                 <p>Subtotal</p>
//                 <p>{formatNaira(getCartAmount())}</p>
//             </div>
//             <hr />
//             <div className="flex justify-between">
//             </div>
//             <hr />
//             <div className="flex justify-between">
//                 <b>Total</b>
//                 <b>{formatNaira(getCartAmount()) === 0 ? 0 : formatNaira (getCartAmount() )}.00</b>
//             </div>

//         </div>
      
//     </div>
//   )
// }

// export default CartTotal







import React, { useContext } from 'react';
// import { ShopContext } from '../context/ShopContext';
import { ArrowLeft } from 'lucide-react'; // Assuming you're using Lucide React icons
import { ShopContext } from '../context/ShopContext';

const CartTotal = () => {
    const { formatNaira, getCartAmount } = useContext(ShopContext);
    const cartAmount = getCartAmount();
    const formattedAmount = formatNaira(cartAmount);

    return (
        <div className='w-full p-4 bg-white rounded-lg shadow-sm'>
            <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                    <button
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        onClick={() => window.history.back()}
                        aria-label="Go back to previous page"
                    >
                        {/* <ArrowLeft className="w-5 h-5" /> */}
                    </button>
                    <div className="w-5"></div> {/* Spacer for alignment */}
                </div>
                
                <h3 className='text-lg font-bold mb-2'>CART TOTAL</h3>
            </div>

            <div className="flex flex-col gap-4 text-sm">
                <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>{formattedAmount}</p>
                </div>
                <hr className="my-1" />
                <div className="flex justify-between">
                    <p>Shipping</p>
                    <p>{cartAmount === 0 ? formatNaira(0) : 'Calculated at checkout'}</p>
                </div>
                <hr className="my-1" />
                <div className="flex justify-between text-base font-semibold">
                    <p>Total</p>
                    <p>{cartAmount === 0 ? formatNaira(0) : formattedAmount}</p>
                </div>
            </div>

           
        </div>
    );
};

export default CartTotal;


