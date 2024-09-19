"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Container from "../app/container";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

// Dynamically import ModeToggle with ssr: false
const ModeToggle = dynamic(() => import("./mode-toggle"), {
  ssr: false,
});

const Header = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="w-full bg-background border-b">
      <Container>
        <div className="flex justify-between items-center">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center space-x-6">
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className="text-sm font-medium text-muted-foreground hover:text-primary">
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/invoice" legacyBehavior passHref>
                  <NavigationMenuLink className="text-sm font-medium text-muted-foreground hover:text-primary">
                    Invoice
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div>
            {isMounted && <ModeToggle />}
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;