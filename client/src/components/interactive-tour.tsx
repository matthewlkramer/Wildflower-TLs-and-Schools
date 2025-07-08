import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ArrowRight, ArrowLeft, Play, Pause } from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector for the element to highlight
  position: "top" | "bottom" | "left" | "right";
  mascotAnimation: "wave" | "point" | "bounce" | "spin" | "celebrate";
}

const tourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Wildflower Schools!",
    content: "Hi there! I'm Flora, your friendly guide. Let me show you around this powerful management system for Wildflower Schools.",
    target: "body",
    position: "bottom",
    mascotAnimation: "wave"
  },
  {
    id: "navigation",
    title: "Main Navigation",
    content: "Use these tabs to navigate between Charters, Teachers, and Schools. Each section has its own detailed views and management tools.",
    target: "nav",
    position: "bottom",
    mascotAnimation: "point"
  },
  {
    id: "search",
    title: "Search & Filter",
    content: "Use the search bar to quickly find specific records. It works across all data fields to help you locate information fast!",
    target: "input[placeholder*='Search']",
    position: "bottom",
    mascotAnimation: "bounce"
  },
  {
    id: "data-tables",
    title: "Interactive Data Tables",
    content: "Our tables are fully sortable and filterable. Click column headers to sort, or use the filter icons for advanced filtering options.",
    target: ".ag-theme-material",
    position: "top",
    mascotAnimation: "point"
  },
  {
    id: "clickable-names",
    title: "Quick Navigation",
    content: "Click on any name in the first column to dive into detailed views with comprehensive information and management tools.",
    target: ".ag-cell",
    position: "right",
    mascotAnimation: "celebrate"
  }
];

interface MascotProps {
  animation: string;
  size?: number;
}

function AnimatedMascot({ animation, size = 80 }: MascotProps) {
  const getAnimationClass = () => {
    switch (animation) {
      case "wave": return "animate-pulse";
      case "point": return "animate-bounce";
      case "bounce": return "animate-bounce";
      case "spin": return "animate-spin";
      case "celebrate": return "animate-pulse";
      default: return "";
    }
  };

  return (
    <div className={`flex items-center justify-center ${getAnimationClass()}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="drop-shadow-lg"
      >
        {/* Flower petals */}
        <g className="origin-center">
          <circle cx="50" cy="30" r="12" fill="#FF6B6B" opacity="0.9" />
          <circle cx="70" cy="50" r="12" fill="#4ECDC4" opacity="0.9" />
          <circle cx="50" cy="70" r="12" fill="#45B7D1" opacity="0.9" />
          <circle cx="30" cy="50" r="12" fill="#96CEB4" opacity="0.9" />
          <circle cx="35" cy="35" r="10" fill="#FFEAA7" opacity="0.8" />
          <circle cx="65" cy="35" r="10" fill="#DDA0DD" opacity="0.8" />
          <circle cx="65" cy="65" r="10" fill="#F0A3A3" opacity="0.8" />
          <circle cx="35" cy="65" r="10" fill="#A8E6CF" opacity="0.8" />
        </g>
        
        {/* Center face */}
        <circle cx="50" cy="50" r="16" fill="#FFD93D" stroke="#F39C12" strokeWidth="2" />
        
        {/* Eyes */}
        <circle cx="45" cy="46" r="2" fill="#2C3E50" />
        <circle cx="55" cy="46" r="2" fill="#2C3E50" />
        
        {/* Smile */}
        <path
          d="M 42 52 Q 50 58 58 52"
          stroke="#2C3E50"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Sparkles */}
        <circle cx="25" cy="25" r="1.5" fill="#FFD93D" opacity="0.7">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="75" cy="25" r="1" fill="#FF6B6B" opacity="0.6">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="80" cy="75" r="1.5" fill="#4ECDC4" opacity="0.8">
          <animate attributeName="opacity" values="0.8;1;0.8" dur="1.8s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

interface TourOverlayProps {
  target: string;
  position: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
}

function TourOverlay({ target, position, children }: TourOverlayProps) {
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [overlayStyle, setOverlayStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const element = document.querySelector(target) as HTMLElement;
    if (element) {
      setTargetElement(element);
      
      const rect = element.getBoundingClientRect();
      const scrollX = window.pageXOffset;
      const scrollY = window.pageYOffset;
      
      let style: React.CSSProperties = {
        position: "absolute",
        zIndex: 1000,
      };

      switch (position) {
        case "top":
          style.left = rect.left + scrollX + rect.width / 2;
          style.top = rect.top + scrollY - 20;
          style.transform = "translate(-50%, -100%)";
          break;
        case "bottom":
          style.left = rect.left + scrollX + rect.width / 2;
          style.top = rect.top + scrollY + rect.height + 20;
          style.transform = "translate(-50%, 0)";
          break;
        case "left":
          style.left = rect.left + scrollX - 20;
          style.top = rect.top + scrollY + rect.height / 2;
          style.transform = "translate(-100%, -50%)";
          break;
        case "right":
          style.left = rect.left + scrollX + rect.width + 20;
          style.top = rect.top + scrollY + rect.height / 2;
          style.transform = "translate(0, -50%)";
          break;
      }

      setOverlayStyle(style);
    }
  }, [target, position]);

  useEffect(() => {
    if (targetElement) {
      // Add highlight effect
      targetElement.style.position = "relative";
      targetElement.style.zIndex = "999";
      targetElement.style.outline = "3px solid #FF6B6B";
      targetElement.style.outlineOffset = "4px";
      targetElement.style.borderRadius = "8px";
      targetElement.style.boxShadow = "0 0 0 4px rgba(255, 107, 107, 0.2)";
      
      return () => {
        // Clean up highlight effect
        targetElement.style.position = "";
        targetElement.style.zIndex = "";
        targetElement.style.outline = "";
        targetElement.style.outlineOffset = "";
        targetElement.style.borderRadius = "";
        targetElement.style.boxShadow = "";
      };
    }
  }, [targetElement]);

  return (
    <div style={overlayStyle}>
      {children}
    </div>
  );
}

interface InteractiveTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InteractiveTour({ isOpen, onClose }: InteractiveTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout>();

  const currentTourStep = tourSteps[currentStep];

  useEffect(() => {
    if (isOpen && isPlaying) {
      autoPlayRef.current = setTimeout(() => {
        if (currentStep < tourSteps.length - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 5000); // Auto-advance every 5 seconds
    }

    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
    };
  }, [isOpen, isPlaying, currentStep]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleClose = () => {
    setCurrentStep(0);
    setIsPlaying(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[998]" />
      
      {/* Tour step overlay */}
      <TourOverlay
        target={currentTourStep.target}
        position={currentTourStep.position}
      >
        <Card className="w-80 shadow-xl border-2 border-blue-500">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <AnimatedMascot animation={currentTourStep.mascotAnimation} size={60} />
                <div>
                  <h3 className="font-semibold text-lg text-slate-900">
                    {currentTourStep.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Step {currentStep + 1} of {tourSteps.length}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-slate-700 mb-6 leading-relaxed">
              {currentTourStep.content}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlayPause}
                  className="h-8 px-3"
                >
                  {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </Button>
                <span className="text-xs text-slate-500">
                  {isPlaying ? "Auto-playing" : "Paused"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="h-8 px-3"
                >
                  <ArrowLeft className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentStep === tourSteps.length - 1}
                  className="h-8 px-3"
                >
                  <ArrowRight className="h-3 w-3" />
                </Button>
                {currentStep === tourSteps.length - 1 && (
                  <Button
                    onClick={handleClose}
                    size="sm"
                    className="h-8 px-3 bg-blue-500 hover:bg-blue-600"
                  >
                    Finish Tour
                  </Button>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </TourOverlay>
    </>
  );
}

export function TourLauncher() {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(() => {
    return localStorage.getItem('wildflower-tour-seen') === 'true';
  });

  useEffect(() => {
    // Auto-launch tour for first-time users after a short delay
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        setIsTourOpen(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [hasSeenTour]);

  const handleCloseTour = () => {
    setIsTourOpen(false);
    setHasSeenTour(true);
    localStorage.setItem('wildflower-tour-seen', 'true');
  };

  const handleLaunchTour = () => {
    setIsTourOpen(true);
  };

  return (
    <>
      {/* Floating tour button */}
      <Button
        onClick={handleLaunchTour}
        className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 p-0 shadow-lg bg-blue-500 hover:bg-blue-600"
        title="Start interactive tour"
      >
        <AnimatedMascot animation="wave" size={32} />
      </Button>

      <InteractiveTour isOpen={isTourOpen} onClose={handleCloseTour} />
    </>
  );
}