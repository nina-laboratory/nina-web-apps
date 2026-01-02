"use client";

import { Menu, X } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";

export interface NavigationItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
}

export interface SharedNavigationProps {
  items: NavigationItem[];
  logo?: React.ReactNode;
  className?: string;
  version?: string;
}

export function SharedNavigation({
  items,
  logo,
  className,
  version,
}: SharedNavigationProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div
      className={cn(
        "relative flex w-full items-center border-b bg-background p-4",
        className,
      )}
    >
      <div className="flex items-center gap-2 mr-6">
        {logo && (
          <a href="/" className="flex-shrink-0">
            {logo}
          </a>
        )}
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <NavigationMenu className="justify-start">
          <NavigationMenuList>
            {items.map((item) => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                  active={item.active}
                >
                  <a href={item.href} className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden ml-auto">
        <Button variant="ghost" size="icon" onClick={toggleMenu}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 w-full border-b bg-background shadow-lg md:hidden">
          <div className="flex flex-col p-4 space-y-2">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  item.active ? "bg-accent text-accent-foreground" : "",
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ))}
            {version && (
                <div className="px-2 py-2 text-xs text-muted-foreground">
                    Version: {version}
                </div>
            )}
          </div>
        </div>
      )}
      {version && (
        <div className="hidden md:block ml-auto mr-4 text-xs text-muted-foreground">
            v{version}
        </div>
      )}
    </div>
  );
}
