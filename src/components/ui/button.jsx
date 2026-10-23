import * as React from "react";
import { cn } from "../../lib/utils";
export const Button = React.forwardRef(({ className, ...props }, ref) => {
    return (<button ref={ref} className={cn(className)} {...props}/>);
});
Button.displayName = "Button";
export default Button;
