import * as React from "react";
import { cn } from "../../lib/utils";
export const Avatar = React.forwardRef(({ className, ...props }, ref) => (<div ref={ref} className={cn(className)} {...props}/>));
Avatar.displayName = "Avatar";
export const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (<img ref={ref} className={cn("w-full h-full object-cover rounded-full", className)} {...props}/>));
AvatarImage.displayName = "AvatarImage";
export const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (<div ref={ref} className={cn("w-full h-full flex items-center justify-center", className)} {...props}/>));
AvatarFallback.displayName = "AvatarFallback";
export default Avatar;
