import { FileCode } from "lucide-react";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="container mx-auto">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-lg w-12">
                <FileCode className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold">Statement Extractor</h1>
              <span className="text-xs opacity-60"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
