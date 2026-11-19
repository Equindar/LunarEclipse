import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Checkbox, Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet, Icon, IconName, Input, Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle, Sortable, SortableContent, SortableItem, SortableItemHandle } from '@lunareclipse/design';
import createI18n, { toSupportedLanguage } from '@lunareclipse/i18n';
import { Hono } from 'hono';
import { raw } from 'hono/html';
import { AppBar } from '../templates/appBar';
import { Layout } from '../templates/layout';

export const ordersRouter = new Hono().get('/', async (c) => {
  const language = toSupportedLanguage(c.get('language'));
  const i18n = await createI18n(language, ['common']);
  const t = i18n.t.bind(i18n);

  const orders: {id: number, icon: IconName, title: string, desc: string }[] = [
    { id: 1, icon: "route", title: "Reise zum Koboldwald", desc: "lksmdvldmsl" },
    { id: 2, icon: "compass", title: "Erkunden: Koboldwald (Osten)", desc: "södklskdmlksmdklvm" },
    { id: 3, icon: "compass", title: "Erkunden: Koboldwald (Süden)", desc: "södkndklslskd" },
    { id: 4, icon: "swords", title: "Jagen: Tiere", desc: "lasdknlksdmvlsmd" },
  ];

  const sortable = Sortable({
    id: "orders",
    orientation: "vertical",
    children: [
      SortableContent({
      class: "flex flex-col gap-2",
      children: orders.map((item) =>
          SortableItem({
            value: item.id,
            asHandle: true,
            sortableId: "test",
            children: [
              SortableItemHandle({
                itemId: "row"+item.id,
                sortableId: "test-id",
                class: "inline-flex size-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground",
                attributes: { "aria-label": `${item.title} verschieben` },
                children: Icon({ name: "grip-horizontal"}),
              }),
              Item({
                variant: "default",
                children: [
                  ItemMedia({ variant: "icon", children: Icon({ name: item.icon, class: "size-10 text-muted/80"}) }),
                  ItemContent({ children: [ItemTitle({ children: item.title }), ItemDescription({ children: item.desc })] }),
                  ItemActions({ children: Button({ variant: "outline", size: "sm", children: "Starten" }) }),
                ]
              }),
          ]
          })
        ),
      }),
    ]
  })

  const fieldset = FieldSet({
    children: FieldGroup({
      children: [
        FieldLegend({ children: "Profil" }),
        FieldDescription({ children: "Trage deine Profildaten ein." }),
        Field({
          orientation: "responsive",
          disabled: false,
          invalid: false,
          children: [
            FieldContent({
              children: [
                FieldDescription({
                  children: "Beschreibung hier."
                }),
                FieldLabel({ for: "myCheckbox", children: "Check me",  }),
              ]
            }),
            Checkbox({
              id: "myCheckbox",
              checked: false,
              class: "my-custom-class",
            }),
            FieldError({children: "Muss angeklickt sein"})
          ],
        }),
        FieldSeparator(),
        Field({
          orientation: "responsive",
          disabled: true,
          children: [
            FieldDescription({
              children: "Beschreibung hier."
            }),
            FieldLabel({ for: "input", children: "Check me!",  }),
            Input({
              id: "input",
              placeholder: "placeholder!",
              class: "my-custom-class",
            }),
            FieldError({children: "Muss angeklickt sein"})
          ],
        })
      ]
    })
  });

  const card = Card({
    class: "w-1/4",
      children: [
        CardHeader({
          children: [
            CardTitle({ children: "Gruppenaufträge" }),
            // CardDescription({ children: "Das macht deine Gruppe als nächstes..." }),
          ],
        }),
        CardContent({ children: sortable }),
        CardFooter({
          class: "flex-col gap-2",
          children:  [
            Button({
              children: "Button",
              type: "button",
              variant: "default"
            })]
          })
      ]
  });


  return c.html(
    <Layout title="Default Page">
      <AppBar currentLang={language} currentPath={c.req.path} />
      <h1>Default Page</h1>
      <div class="flex justify-center items-center">
        {raw(card)}
      </div>
    </Layout>
  );
});
