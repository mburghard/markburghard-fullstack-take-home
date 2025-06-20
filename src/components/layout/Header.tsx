import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faPlus, faSave, faShare, faEye, faCog } from '@fortawesome/free-solid-svg-icons';

const Header: React.FC = () => {
    return (
        <header className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-200 shadow-neumorphic-sm text-gray-800 font-nunito fixed top-0 left-0 right-0 z-50">
            <div className="px-6 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors">
                        <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
                        <span className="font-semibold text-sm">Back to Projects</span>
                    </button>
                    <div className="w-px h-6 bg-gray-300"></div>
                    <h1 className="text-lg font-bold text-gray-900">My Awesome Project</h1>
                </div>

                <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 rounded-lg bg-white shadow-neumorphic-sm hover:shadow-neumorphic-inset text-sm font-semibold text-gray-700 hover:text-primary transition-all">
                        <FontAwesomeIcon icon={faEye} className="mr-2" />
                        Preview
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-white shadow-neumorphic-sm hover:shadow-neumorphic-inset text-sm font-semibold text-gray-700 hover:text-primary transition-all">
                        <FontAwesomeIcon icon={faShare} className="mr-2" />
                        Share
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-primary text-white shadow-neumorphic-sm hover:bg-primary/90 transition-all font-semibold text-sm flex items-center">
                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                        Save
                    </button>
                    <button className="p-2.5 rounded-full bg-white shadow-neumorphic-sm hover:shadow-neumorphic-inset text-gray-600 hover:text-primary transition-all">
                        <FontAwesomeIcon icon={faCog} className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;