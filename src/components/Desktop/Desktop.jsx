import Dock from './Dock';
import TopBar from './TopBar';

const Desktop = () => {
    return (
        <div className="relative w-screen h-screen overflow-hidden bg-black">

            <TopBar />
            <div className="absolute inset-0 p-8">


                <Dock />
                {/* Desktop items */}
            </div>


        </div>
    );
};
export default Desktop;