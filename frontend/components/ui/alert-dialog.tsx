'use client';

import * as React from 'react';
import { AlertDialog as AlertDialogPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

function AlertDialog({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}

function AlertDialogPortal({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />;
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(
        'data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
        className
      )}
      {...props}
    />
  );
}

function AlertDialogContent({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  size?: 'default' | 'sm';
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          `data-open:animate-in data-open:zoom-in-95 data-open:fade-in-0 data-closed:animate-out data-closed:zoom-out-95 data-closed:fade-out-0 fixed left-1/2 top-1/2 z-50 w-[95%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#25D366]/30 bg-white p-6 shadow-2xl outline-none duration-200`,
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        'has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr] grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left',
        className
      )}
      {...props}
    />
  );
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(`mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end`, className)}
      {...props}
    />
  );
}

function AlertDialogMedia({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        'mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]',
        className
      )}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        'cn-font-heading sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2 text-xl font-bold text-[#111111]',
        className
      )}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(
        '*:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground text-balance text-sm leading-6 text-gray-500 md:text-pretty',
        className
      )}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  return (
    <AlertDialogPrimitive.Action
      {...props}
      className={cn(
        `inline-flex h-11 items-center justify-center rounded-xl bg-red-600 px-6 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:pointer-events-none disabled:opacity-50`,
        className
      )}
    />
  );
}

function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <AlertDialogPrimitive.Cancel
      {...props}
      className={cn(
        `inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-6 text-sm font-semibold text-[#111111] transition-all hover:bg-gray-100`,
        className
      )}
    />
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
