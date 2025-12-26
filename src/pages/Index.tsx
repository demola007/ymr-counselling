import { Toaster } from "@/components/ui/toaster";
import { HeroSection } from "@/components/landing/HeroSection";
import { ActionButtons } from "@/components/landing/ActionButtons";
import { Footer } from "@/components/landing/Footer";
import { Shield, Swords, Users, Calendar, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import theNewArmyImage from "@/assets/the-new-army.jpeg";
import ymrMinistersImage from "@/assets/ymr-ministers.jpeg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const Landing = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [imageApi, setImageApi] = useState<CarouselApi>();
  const [videoApi, setVideoApi] = useState<CarouselApi>();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const images = [
    { src: theNewArmyImage, alt: "The New Army - YMR 2025" },
    { src: ymrMinistersImage, alt: "YMR 2025 Ministers Lineup" },
  ];

  const videos = [
    { src: "/videos/ymr-promo.mp4", title: "The New Army Rises" },
    { src: "/videos/ymr-promo-2.mp4", title: "YMR Global 2025" },
  ];

  // Auto-rotate image carousel every 4 seconds
  useEffect(() => {
    if (!imageApi) return;
    
    const interval = setInterval(() => {
      imageApi.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [imageApi]);

  // Auto-rotate video carousel every 5 seconds (when not playing)
  useEffect(() => {
    if (!videoApi || isPlaying) return;
    
    const interval = setInterval(() => {
      videoApi.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [videoApi, isPlaying]);

  // Track current image index
  useEffect(() => {
    if (!imageApi) return;

    const onSelect = () => {
      setCurrentImageIndex(imageApi.selectedScrollSnap());
    };

    imageApi.on("select", onSelect);
    return () => {
      imageApi.off("select", onSelect);
    };
  }, [imageApi]);

  // Track current video index and pause videos when switching
  useEffect(() => {
    if (!videoApi) return;

    const onSelect = () => {
      const newIndex = videoApi.selectedScrollSnap();
      // Pause all videos when switching
      videoRefs.current.forEach((video) => {
        if (video) {
          video.pause();
        }
      });
      setIsPlaying(false);
      setCurrentVideoIndex(newIndex);
    };

    videoApi.on("select", onSelect);
    return () => {
      videoApi.off("select", onSelect);
    };
  }, [videoApi]);

  const togglePlay = useCallback(() => {
    const currentVideo = videoRefs.current[currentVideoIndex];
    if (currentVideo) {
      if (isPlaying) {
        currentVideo.pause();
      } else {
        currentVideo.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [currentVideoIndex, isPlaying]);

  const toggleMute = useCallback(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = !isMuted;
      }
    });
    setIsMuted(!isMuted);
  }, [isMuted]);

  return (
    <div className="min-h-screen flex flex-col bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-army-green-dark/20 to-black"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-army-green rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-army-green-light rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-black/80 backdrop-blur-xl border-b border-army-green/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <img 
                src="/lovable-uploads/7d495cc3-bdc8-42d6-ab11-263a4b0a731a.png"
                alt="YMR Logo" 
                className="h-12 w-auto"
                loading="eager"
                fetchPriority="high"
              />
              <div className="text-center md:text-left">
                <h1 className="text-xl md:text-2xl font-bold text-army-green-light tracking-wider">
                  YMR 2025
                </h1>
                <p className="text-xs text-army-green/80">THE NEW ARMY</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 text-army-green" />
              <span className="text-foreground">December 26-30, 2025</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        <div className="container mx-auto px-4 py-8 md:py-16">
          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16">
            <HeroSection />
            
            {/* Image Carousel */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-army-green via-army-green-light to-army-green rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500 animate-glow-pulse"></div>
              <div className="relative">
                <Carousel className="w-full" opts={{ loop: true }} setApi={setImageApi}>
                  <CarouselContent>
                    {images.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="relative overflow-hidden rounded-2xl">
                          <img 
                            src={image.src}
                            alt={image.alt}
                            className="w-full rounded-2xl shadow-2xl border border-army-green/30 transition-transform duration-700 hover:scale-105"
                            loading={index === 0 ? "eager" : "lazy"}
                            fetchPriority={index === 0 ? "high" : "auto"}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl"></div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-4 bg-black/60 border-army-green/50 text-army-green hover:bg-army-green hover:text-black transition-all" />
                  <CarouselNext className="right-4 bg-black/60 border-army-green/50 text-army-green hover:bg-army-green hover:text-black transition-all" />
                </Carousel>
                
                {/* Carousel Indicators */}
                <div className="flex justify-center gap-2 mt-4">
                  {images.map((_, index) => (
                    <button 
                      key={index}
                      onClick={() => imageApi?.scrollTo(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentImageIndex === index 
                          ? 'bg-army-green w-6' 
                          : 'bg-army-green/50 hover:bg-army-green/70'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <ActionButtons />

          {/* Video Section */}
          <div className="my-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
                Experience <span className="text-army-green-light">The Movement</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Watch and feel the power of YMR 2025 - where young ministers rise
              </p>
            </div>
            
            <div className="relative max-w-4xl mx-auto group">
              {/* Video Glow Effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-army-green via-army-green-light to-army-green rounded-3xl blur-lg opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
              
              {/* Video Carousel Container */}
              <div className="relative bg-black/40 backdrop-blur-sm rounded-2xl border border-army-green/30 overflow-hidden">
                <Carousel className="w-full" opts={{ loop: true }} setApi={setVideoApi}>
                  <CarouselContent>
                    {videos.map((video, index) => (
                      <CarouselItem key={index}>
                        <div className="relative aspect-video">
                          <video
                            ref={(el) => {videoRefs.current[index] = el}}
                            className="w-full h-full object-cover"
                            poster={theNewArmyImage}
                            muted={isMuted}
                            loop
                            playsInline
                            onEnded={() => setIsPlaying(false)}
                          >
                            <source src={video.src} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                          
                          {/* Video Overlay */}
                          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isPlaying && currentVideoIndex === index ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                            {/* Play Button */}
                            <button
                              onClick={togglePlay}
                              className="group/btn relative"
                            >
                              <div className="absolute inset-0 bg-army-green rounded-full blur-xl opacity-50 group-hover/btn:opacity-75 transition-opacity scale-150"></div>
                              <div className="relative w-20 h-20 md:w-24 md:h-24 bg-army-green/90 hover:bg-army-green rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl">
                                {isPlaying && currentVideoIndex === index ? (
                                  <Pause className="w-8 h-8 md:w-10 md:h-10 text-black" />
                                ) : (
                                  <Play className="w-8 h-8 md:w-10 md:h-10 text-black ml-1" />
                                )}
                              </div>
                            </button>
                          </div>

                          {/* Video Controls */}
                          <div className="absolute bottom-4 right-4 flex gap-2">
                            <button
                              onClick={toggleMute}
                              className="w-10 h-10 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-army-green/30 transition-all hover:border-army-green"
                            >
                              {isMuted ? (
                                <VolumeX className="w-5 h-5 text-army-green" />
                              ) : (
                                <Volume2 className="w-5 h-5 text-army-green" />
                              )}
                            </button>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-4 bg-black/60 border-army-green/50 text-army-green hover:bg-army-green hover:text-black transition-all" />
                  <CarouselNext className="right-4 bg-black/60 border-army-green/50 text-army-green hover:bg-army-green hover:text-black transition-all" />
                </Carousel>
                
                {/* Video Caption & Indicators */}
                <div className="p-4 bg-gradient-to-r from-army-green-dark/20 via-transparent to-army-green-dark/20 border-t border-army-green/20">
                  <p className="text-center text-sm text-muted-foreground mb-3">
                    <span className="text-army-green font-semibold">YMR 2025</span> • {videos[currentVideoIndex]?.title || "The New Army Rises"}
                  </p>
                  <div className="flex justify-center gap-2">
                    {videos.map((_, index) => (
                      <button 
                        key={index}
                        onClick={() => videoApi?.scrollTo(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          currentVideoIndex === index 
                            ? 'bg-army-green w-6' 
                            : 'bg-army-green/50 hover:bg-army-green/70'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 mb-16">
            <div className="group bg-card/50 backdrop-blur-sm border border-army-green/30 rounded-xl p-6 hover:border-army-green transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,255,34,0.2)]">
              <div className="bg-army-green/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-army-green/20 transition-colors">
                <Shield className="w-6 h-6 text-army-green" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Spiritual Warfare</h3>
              <p className="text-muted-foreground text-sm">
                Equip yourself with the full armor of God for victorious Christian living
              </p>
            </div>

            <div className="group bg-card/50 backdrop-blur-sm border border-army-green/30 rounded-xl p-6 hover:border-army-green transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,255,34,0.2)]">
              <div className="bg-army-green/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-army-green/20 transition-colors">
                <Swords className="w-6 h-6 text-army-green" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Divine Training</h3>
              <p className="text-muted-foreground text-sm">
                Intensive training sessions to sharpen your spiritual weapons and skills
              </p>
            </div>

            <div className="group bg-card/50 backdrop-blur-sm border border-army-green/30 rounded-xl p-6 hover:border-army-green transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,255,34,0.2)]">
              <div className="bg-army-green/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-army-green/20 transition-colors">
                <Users className="w-6 h-6 text-army-green" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Join The Army</h3>
              <p className="text-muted-foreground text-sm">
                Connect with fellow soldiers and build lasting kingdom relationships
              </p>
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-gradient-to-r from-army-green-dark/30 via-army-green/10 to-army-green-dark/30 border border-army-green/30 rounded-2xl p-8 text-center backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Join <span className="text-army-green-light">The New Army</span>
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Old Auditorium, Redemption City of God
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-black/40 px-6 py-3 rounded-lg border border-army-green/30">
                <span className="text-army-green font-semibold">December 26-30</span>
              </div>
              <div className="bg-black/40 px-6 py-3 rounded-lg border border-army-green/30">
                <span className="text-army-green font-semibold">2025</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <Toaster />
    </div>
  );
};

export default Landing;
