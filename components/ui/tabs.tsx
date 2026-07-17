"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

// Reusable utility classes for consistent styling
const tabsStyles = {
  // Container styles
  container: "w-full overflow-x-auto scrollbar-hide",

  // List base styles
  listBase:
    "flex w-full gap-2 sm:gap-0 rounded-md bg-muted text-muted-foreground",

  // Grid layouts (responsive)
  gridLayouts: {
    mobile: "flex", // default mobile is flex
    tablet: "sm:grid", // grid on tablet+
    cols: {
      2: "sm:grid-cols-2",
      3: "sm:grid-cols-3",
      4: "sm:grid-cols-4",
      5: "sm:grid-cols-5",
      6: "sm:grid-cols-6",
    },
  },

  // Mobile scroll behavior
  mobileScroll: "min-w-max sm:min-w-0",

  // Trigger base styles
  triggerBase:
    "flex items-center justify-center px-3 py-1.5 text-sm font-medium transition-all whitespace-nowrap rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",

  // Trigger states
  triggerStates: {
    active:
      "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
    inactive: "hover:bg-muted/80",
    mobile: "min-w-max sm:min-w-0", // scrollable width on mobile
  },

  // Content styles
  contentBase:
    "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
};

// Props interfaces
interface TabsListProps extends React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.List
> {
  cols?: 2 | 3 | 4 | 5 | 6;
  scrollable?: boolean;
}

interface TabsTriggerProps extends React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Trigger
> {
  variant?: "default" | "pill" | "underline";
  size?: "sm" | "md" | "lg";
}

/**
 * TabsList — Responsive tabs container
 * @param cols - Number of columns on tablet+ screens (default: 3)
 * @param scrollable - Enable horizontal scroll on mobile (default: true)
 */
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, cols = 3, scrollable = true, ...props }, ref) => {
  const gridClass = tabsStyles.gridLayouts.cols[cols];

  return (
    <div
      className={cn(tabsStyles.container, !scrollable && "overflow-x-visible")}
    >
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          tabsStyles.listBase,
          tabsStyles.gridLayouts.tablet,
          gridClass,
          scrollable && tabsStyles.mobileScroll,
          className,
        )}
        {...props}
      />
    </div>
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

/**
 * TabsTrigger — Customizable trigger with variants
 * @param variant - Visual style: default, pill, or underline
 * @param size - Size: sm, md, or lg
 */
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant = "default", size = "md", ...props }, ref) => {
  const variantStyles = {
    default: tabsStyles.triggerStates.active,
    pill: "rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
    underline:
      "rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary",
  };

  const sizeStyles = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        tabsStyles.triggerBase,
        tabsStyles.triggerStates.mobile,
        tabsStyles.triggerStates.inactive,
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

/**
 * TabsContent — Unchanged but with consistent styling
 */
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(tabsStyles.contentBase, className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// Export all components
export { Tabs, TabsList, TabsTrigger, TabsContent };

// Export the style object for external use if needed
export { tabsStyles };
