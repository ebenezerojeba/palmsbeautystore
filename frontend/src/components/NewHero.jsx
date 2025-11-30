
import Button from "./Button";



import { useRef } from "react";
import { assets } from "../assets/assets";


const Hero = () => {
    const parallaxRef = useRef(null);

    return (
        <div
            className=""
            crosses
            crossesOffset="lg:translate-y-[5.25rem]"
            customPaddings
            id="hero"
        >
            <div className="container relative" ref={parallaxRef}>
                <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
                    <h1 className="h1 mb-6">
    Explore the Beauty Services of PalmsBeautyStore
</h1>

<p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
    Your appointment starts with a smooth booking process. PalmsBeautyStore gives you simple scheduling, quick payments, and clear service details.
</p>

                <div className="flex items-center justify-center gap-4">
    <Button href="/shop">
        Shop products
    </Button>

    <Button href="/book">
        Book appointment
    </Button>
</div>

                </div>
                <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24">
                    <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
                        <div className="relative bg-n-8 rounded-[1rem]">
                            <div className="h-[1.4rem] bg-n-10 rounded-t-[0.9rem]" />

                            <div className="aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490]">
                                <img
                                    src={assets}
                                    className="w-full scale-[1.7] translate-y-[8%] md:scale-[1] md:-translate-y-[10%] lg:-translate-y-[23%]"
                                    width={1024}
                                    height={490}
                                    alt="AI"
                                />

                            </div>
                        </div>

                    </div>
                    <div className="absolute -top-[54%] left-1/2 w-[234%] -translate-x-1/2 md:-top-[46%] md:w-[138%] lg:-top-[104%]">
                        <img
                            src={assets.back2}
                            className="w-full"
                            width={1440}
                            height={1800}
                            alt="hero"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;