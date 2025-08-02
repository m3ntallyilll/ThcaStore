import React from "react"

// Simple pass-through tooltip components to prevent errors
export const Tooltip = ({ children }: { children: React.ReactNode }) => <>{children}</>
export const TooltipTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>  
export const TooltipContent = () => null
export const TooltipProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>
