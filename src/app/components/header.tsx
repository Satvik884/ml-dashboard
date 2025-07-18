"use client"
import { useState } from "react";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu";
import { orbitron } from "@/lib/fonts";

export default function Header() {
    const [active, setActive] = useState<string | null>(null);
    return (
        <div className="flex w-full text-white items-center fixed top-0 left-0 right-0 z-50 bg-black">
            <div className={` pl-50 pr-30 text-3xl font-bold ${orbitron.className}`}>NOCODE</div>
            <div className="flex">
                <Menu setActive={setActive}>
                <HoveredLink href="/">Home</HoveredLink>
                <HoveredLink href="/about">Upload</HoveredLink>
                <HoveredLink href="/regression">Regression</HoveredLink>
                {/* <MenuItem setActive={setActive} active={active} item="Regression">
                    <div className="flex flex-col space-y-4 text-sm">
                    <HoveredLink href="/web-dev">Web Development</HoveredLink>
                    <HoveredLink href="/interface-design">Interface Design</HoveredLink>
                    <HoveredLink href="/seo">Search Engine Optimization</HoveredLink>
                    <HoveredLink href="/branding">Branding</HoveredLink>
                    </div>
                </MenuItem> */}
                
                </Menu>
            </div>
        </div>

    )
}