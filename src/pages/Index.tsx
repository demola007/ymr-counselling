import { Toaster } from "@/components/ui/toaster";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";

const Landing = () => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      if (api.selectedScrollSnap() === api.scrollSnapList().length - 1) {
        api.scrollTo(0, true);
      } else {
        api.scrollNext();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const images = [
    {
      src: "/lovable-uploads/c07ff30e-bbf7-4646-9939-5661fa0ccacb.png",
      alt: "YMR Floodgates Main"
    },
    {
      src: "/lovable-uploads/89b16308-9898-4008-9c2f-32ac606607e2.png",
      alt: "YMR Floodgates Event"
    },
    {
      src: "/lovable-uploads/b3bae961-3dd1-4eb6-970a-9a471d1acda2.png",
      alt: "YMR Floodgates Announcement"
    },
    {
      src: "/lovable-uploads/6cfc5eaa-d3c5-4681-879c-2b8c0565232e.png",
      alt: "YMR Floodgates Gates"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1A1F2C] via-[#2C3E50] to-[#1A1F2C]">
      <nav className="bg-[#1A1F2C]/90 backdrop-blur-lg text-white py-4 fixed w-full z-[48]">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img 
              src="/lovable-uploads/7d495cc3-bdc8-42d6-ab11-263a4b0a731a.png" 
              alt="YMR Logo" 
              className="h-12 w-auto"
              loading="eager"
              fetchpriority="high"
            />
            <h1 className="text-2xl font-bold">YMR 2024 - FLOODGATES</h1>
          </div>
        </div>
      </nav>

      <section className="pt-24 flex-1 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start py-12">
            <HeroSection />
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              
              <Carousel className="relative" setApi={setApi}>
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative overflow-hidden rounded-lg">
                        <img 
                          src={image.src}
                          alt={image.alt}
                          className="w-full rounded-lg shadow-2xl transform transition-all duration-500 hover:scale-[1.02] object-cover"
                          style={{ height: '500px' }}
                          loading={index === 0 ? "eager" : "lazy"}
                          fetchpriority={index === 0 ? "high" : "auto"}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                
                <CarouselPrevious className="left-4 bg-white/10 hover:bg-white/20 border-none text-white" />
                <CarouselNext className="right-4 bg-white/10 hover:bg-white/20 border-none text-white" />
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        current === index ? 'bg-white w-4' : 'bg-white/50'
                      }`}
                      onClick={() => api?.scrollTo(index)}
                    />
                  ))}
                </div>
              </Carousel>
            </div>
          </div>
          <ActionButtons />
        </div>
      </section>

      <Footer />
      <Toaster />
    </div>
  );
};

export default Landing;