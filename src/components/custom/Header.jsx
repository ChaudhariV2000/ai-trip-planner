import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { Menu, X } from "lucide-react"; // Import icons for mobile menu

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [openDialog, setOpenDialog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    console.log(user);
  }, []);

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((resp) => {
        console.log(resp.data);
        localStorage.setItem("user", JSON.stringify(resp.data));
        setOpenDialog(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => GetUserProfile(tokenResponse),
    onError: (error) => console.log(error),
  });

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Create Itinerary", path: "/create-trip" },
    { name: "Translate", path: "/scan-text" },
    { name: "Quick create chatbot", path: "/chatbot" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Community", path: "http://localhost:8501/" },
  ];

  return (
    <header className="sticky top-0 z-50 px-4 py-3 shadow-md bg-white">
      <div className="max-w-9xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex-shrink-0 self-start">
          <img className="w-24 h-auto" src="/logo.png" alt="Logo" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className="text-gray-700 hover:text-blue-600 px-2 py-2 text-sm font-medium transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}

          <a
              href="/nearme"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-sm uppercase tracking-wider transition-colors duration-200 flex items-center"
            >
              Emergency
            </a>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-x-4">
          {user ? (
            <>
              <a href="/my-trip" className="hidden sm:block">
                <Button variant="outline" className="rounded-full text-sm py-1.5 px-4">
                  My Trips
                </Button>
              </a>
              <Popover>
                <PopoverTrigger>
                  <img className="h-9 w-9 rounded-full cursor-pointer hover:opacity-80 transition-opacity" src={user?.picture} alt="Profile" />
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="flex flex-col">
                    <a href="/my-trip" className="block sm:hidden px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                      My Trips
                    </a>
                    <Button
                      onClick={() => {
                        googleLogout();
                        localStorage.clear();
                        window.location.reload();
                      }}
                      className="w-full text-sm rounded-md p-2 mt-1 hover:bg-gray-100"
                    >
                      Logout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <Button onClick={() => setOpenDialog(true)} className="text-sm py-1.5 px-4">
              Sign in
            </Button>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden ml-2">
            <Button
              variant="ghost"
              className="p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-50 mt-16 px-4 py-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className="text-gray-700 hover:text-blue-600 py-2.5 text-sm font-medium transition-colors duration-200 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Sign In</DialogTitle>
            <DialogDescription className="text-center">
              <div className="flex flex-col items-center">
                <img src="/logo.png" alt="Logo" className="w-20 mb-4" />
                <span className="text-gray-600">Sign in with Google Authentication securely</span>
                <Button onClick={login} className="w-full mt-5">
                  Sign in with Google
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;