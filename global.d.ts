/// <reference types="react" />

declare module "babylon-viewer";

declare namespace JSX {
  interface IntrinsicElements {
    // allow <babylon-viewer model="…" />
    "babylon-viewer": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & { model: string },
      HTMLElement
    >;
  }
}
