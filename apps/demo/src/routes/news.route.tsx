import { Card, CardContent, CardDescription, CardHeader, CardTitle, Icon, TableOfContentLinkDepth } from '@lunareclipse/design';
import createI18n, { toSupportedLanguage } from '@lunareclipse/i18n';
import { Hono } from 'hono';
import { raw } from 'hono/html';
import { AppBar } from '../templates/appBar';
import { Layout } from '../templates/layout';

interface Section {
  id: string;
  title: string;
  description: string,
  depth?: TableOfContentLinkDepth;
}

const PARAGRAPH =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

/** Dokument mit einer Überschrift je Abschnitt (Stufe 1 = h2, Stufe 2 = h3, ...). IDs pro Story eindeutig halten. */
const article = (sections: Section[], sectionClass: string): string =>
  sections
    .map((section) => {
      const tag = `h${(section.depth ?? 1) + 1}`;
      return `<section class="${sectionClass}"><${tag} id="${section.id}" class="scroll-mt-8 text-lg font-semibold">${section.title}</${tag}><p class="mt-2 text-muted-foreground">${section.description}</p></section>`;
    })
    .join("");

const news = [{
  title: "Badewanne voll Bier!",
  description: PARAGRAPH,
  },
  {
  title: "Badewanne voll Bier!!",
  description: PARAGRAPH,
  },
  {
   title: "Badewanne voll Bier!!!",
  description: PARAGRAPH,
  },,
  {
   title: "Badewanne voll Bier!!!",
  description: PARAGRAPH,
  },,
  {
   title: "Badewanne voll Bier!!!",
  description: PARAGRAPH,
  },,
  {
   title: "Badewanne voll Bier!!!",
  description: PARAGRAPH,
  },,
  {
   title: "Badewanne voll Bier!!!",
  description: PARAGRAPH,
  },,
  {
   title: "Badewanne voll Bier!!!",
  description: PARAGRAPH,
  },
]

// const toc = TableOfContent({
//     targetIds: sections.map((section) => section.id),
//     children: [
//       TableOfContentTitle({ children: title ?? "On this page" }),
//       TableOfContentList({
//         children: [
//           TableOfContentIndicator({ tocId: args.id }),
//           ...sections.map((section) =>
//             TableOfContentItem({
//               children: TableOfContentLink({
//                 tocId: args.id,
//                 targetId: section.id,
//                 depth: section.depth,
//                 children: section.title,
//               }),
//             })
//           ),
//         ],
//       }),
//     ],
//   });

export const newsRouter = new Hono().get('/', async (c) => {
  const language = toSupportedLanguage(c.get('language'));
  const i18n = await createI18n(language, ['common']);
  const t = i18n.t.bind(i18n);

  const card = Card({
    class: "w-1/2",
      children: [
        CardHeader({
          children: [
            CardTitle({ children: "Neuigkeiten" }),
            CardDescription({ class: "text-muted-foreground/50", children: [
              Icon({name: "clock", class: "size-4" }),
              "12093204024"
            ]
            }),
          ],
        }),
        CardContent({
          children: [
            `<div class="mx-auto grid max-w-4xl grid-cols-[minmax(0,1fr)_14rem] gap-10 p-8">`,
            raw(news.map((item) => ( `<article><h1>${item!.title}</h1><p>${item!.description}</p></article>` ))),
            raw(`<aside><div class="sticky top-8">bla</div></aside></div>`)
          ]
        }),
        // CardFooter({
        //   class: "flex-col gap-2",
        //   children:  [
        //     Button({
        //       children: "Button",
        //       type: "button",
        //       variant: "default"
        //     })]
        //   })
      ]
  });


  return c.html(
    <Layout title="Default Page">
      <AppBar currentLang={language} currentPath={c.req.path} />
      <div class="flex justify-center items-center">
        {raw(card)}
      </div>
    </Layout>
  );
});
