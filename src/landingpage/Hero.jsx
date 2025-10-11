import { useEffect, useRef, useState } from 'react';

function Hero() {
    const pathRef = useRef(null);
    const [pathLength, setPathLength] = useState(0);

    useEffect(() => {
        // Get the total length of the SVG path
        if (pathRef.current) {
            const length = pathRef.current.getTotalLength();
            setPathLength(length);

            // Set initial state (path hidden)
            pathRef.current.style.strokeDasharray = length;
            pathRef.current.style.strokeDashoffset = length;
        }

        // Scroll event handler
        const handleScroll = () => {
            if (!pathRef.current) return;

            // Calculate scroll percentage
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = scrollTop / docHeight;

            // Calculate how much of the path to draw
            const drawLength = pathLength * scrollPercent;

            // Update the stroke-dashoffset
            pathRef.current.style.strokeDashoffset = pathLength - drawLength;
        };

        // Add scroll listener
        window.addEventListener('scroll', handleScroll);

        // Cleanup
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathLength]);

    return (
        <section className="relative min-h-[300vh] w-full overflow-hidden bg-white">
            <svg className="fixed top-0 left-0 w-full h-screen" xmlns="http://www.w3.org/2000/svg">
                <path
                    ref={pathRef}
                    d="M 0 200
                       q 200 10, 150 200
                       q -50 120, -100 120"
                    stroke="blue"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </section>
    );
}

export default Hero;
