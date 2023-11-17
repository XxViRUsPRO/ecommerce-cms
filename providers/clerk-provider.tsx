"use client";

import React from "react";
import { ClerkProvider as Provider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

type Props = {} & Parameters<typeof Provider>[0];

const ClerkProvider = (props: Props) => {
  const { resolvedTheme } = useTheme();

  return (
    <Provider
      {...props}
      appearance={{
        ...props.appearance,
        baseTheme: resolvedTheme === "light" ? undefined : dark,
      }}
    >
      {props.children}
    </Provider>
  );
};

export { ClerkProvider };
