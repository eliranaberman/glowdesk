
import * as React from "react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "relative w-full overflow-auto rounded-xl border border-border/30",
      isMobile ? "overflow-x-auto pb-4" : ""
    )}>
      <table
        ref={ref}
        className={cn(
          "w-full caption-bottom text-sm bg-card shadow-soft",
          className
        )}
        {...props}
      />
    </div>
  );
})
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead 
    ref={ref} 
    className={cn(
      "border-b border-border/30 bg-accent/10 text-muted-foreground sticky top-0 z-10",
      className
    )} 
    {...props} 
  />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-border/30 bg-muted/20 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-border/20 transition-colors hover:bg-accent/10 data-[state=selected]:bg-muted/40 even:bg-muted/5",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const isMobile = useIsMobile();

  return (
    <th
      ref={ref}
      className={cn(
        "h-12 px-3 md:px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        isMobile ? "text-xs whitespace-nowrap py-3" : "text-sm",
        className
      )}
      {...props}
    />
  );
})
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const isMobile = useIsMobile();

  return (
    <td
      ref={ref}
      className={cn(
        "p-3 md:p-4 align-middle [&:has([role=checkbox])]:pr-0", 
        isMobile ? "text-xs py-3 break-words" : "text-sm",
        className
      )}
      {...props}
    />
  );
})
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
