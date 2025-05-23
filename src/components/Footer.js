import {
    Instagram,
    Twitter,
    Facebook,
    Linkedin,
    Github,
  } from "lucide-react";
  import { FaUserDoctor } from "react-icons/fa6";
  
  function Footer() {
    return (
      <footer className="text-gray-600 body-font">
        <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
          <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
            <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full">
              <FaUserDoctor/>
            </div>
            <span className="ml-3 text-xl">HealHub</span>
          </a>
          <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
            © 2025 HealHub —
            <a
              href="https://twitter.com/knyttneve"
              className="text-gray-600 ml-1"
              rel="noopener noreferrer"
              target="_blank"
            >
              @goutham4126@gmail.com
            </a>
          </p>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
            <a className="text-gray-500" href="#">
              <Facebook className="w-5 h-5" />
            </a>
            <a className="ml-5 text-gray-500" href="#">
              <Twitter className="w-5 h-5" />
            </a>
            <a className="ml-5 text-gray-500" href="#">
              <Instagram className="w-5 h-5" />
            </a>
            <a className="ml-5 text-gray-500" href="#">
              <Linkedin className="w-5 h-5" />
            </a>
            <a className="ml-5 text-gray-500" href="#">
              <Github className="w-5 h-5" />
            </a>
          </span>
        </div>
      </footer>
    );
  }
  
  export default Footer;
  