import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 p-3 bg-green-600 text-white rounded-full shadow-lg transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"
                }`}
        >
            <ArrowUp size={20} />
        </button>
    );
};

export default ScrollToTop;
