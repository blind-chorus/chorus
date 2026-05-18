import { ComponentMd } from './ComponentMd';

/* Renders a `###`-level section pulled out of DESIGN.md (by
   `extractDesignSection`) into the docs page-content — the heading lands as
   a `<h2 id={id}>` so the side-nav toc anchor lines up, and the body flows
   through the same markdown pipeline the per-component specs use. The page
   chooses the anchor id explicitly because the docs has historically used
   `comp-*` prefixed ids that don't follow from DESIGN.md heading slugs. */

export function DesignSection({ id, title, body }) {
  return (
    <>
      <h2 id={id}>{title}</h2>
      <ComponentMd body={body} />
    </>
  );
}
