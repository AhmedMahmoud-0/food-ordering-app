"use client";

import NextLink, { LinkProps as NextLinkProps } from "next/link";
import React, { FC, HTMLAttributes } from "react";

type CustomLinkProps = NextLinkProps & {
  children: React.ReactNode;
  href: string;
  target?: string;
} & HTMLAttributes<HTMLAnchorElement>;

/**
 * Shared internal link wrapper.
 * Prefetch is disabled by default so middleware redirects are not cached
 * from an earlier prefetch response. Callers can still explicitly override it.
 */
const Link: FC<CustomLinkProps> = ({
  children,
  href,
  prefetch = false,
  ...rest
}) => {
  return (
    <NextLink href={href} prefetch={prefetch} {...rest}>
      {children}
    </NextLink>
  );
};

export default Link;
