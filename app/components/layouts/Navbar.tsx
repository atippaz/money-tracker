import { Button } from "~/components/ui/button"; // Import Shadcn UI Button component
import authUtil from "~/utils/auth";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const auth = authUtil();
  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className=" mx-auto flex justify-between items-center p-4">
        <div className="text-2xl font-bold">Money Manage</div>
        {/* <div className="hidden md:flex space-x-6"> */}
        {/* <a href="#home" className="hover:text-gray-400">
            Home
          </a>
          <a href="#about" className="hover:text-gray-400">
            About
          </a>
          <a href="#services" className="hover:text-gray-400">
            Services
          </a>
          <a href="#contact" className="hover:text-gray-400">
            Contact
          </a> */}
        <Button
          variant="default"
          className="ml-4"
          onClick={() => auth.logout()}
        >
          Logout
        </Button>
        {/* </div> */}
        {/* <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="p-2">
            <span className="text-white text-xl">
              {isOpen ? "Close" : "Menu"}
            </span>
          </button>
        </div> */}
      </div>
      {/* <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <a href="#home" className="block px-4 py-2 hover:bg-gray-700">
          Home
        </a>
        <a href="#about" className="block px-4 py-2 hover:bg-gray-700">
          About
        </a>
        <a href="#services" className="block px-4 py-2 hover:bg-gray-700">
          Services
        </a>
        <a href="#contact" className="block px-4 py-2 hover:bg-gray-700">
          Contact
        </a>
        <Button variant="default" className="block mx-4 my-2">
          Sign Up
        </Button>
      </div> */}
    </nav>
  );
}

export default Navbar;
