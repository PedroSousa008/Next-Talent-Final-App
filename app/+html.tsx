import { type PropsWithChildren } from "react";

/**
 * Web document shell: ensures html/body/#root fill the viewport so RN flex layouts don't collapse.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
html, body, #root {
  height: 100%;
  margin: 0;
}
#root {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100vh;
}
`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
