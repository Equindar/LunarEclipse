import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardPartArgs, CardTitle, Checkbox, Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet, Input, type CheckboxArgs } from '@lunareclipse/design';
import createI18n, { toSupportedLanguage } from '@lunareclipse/i18n';
import { Hono } from 'hono';
import { raw } from 'hono/html';
import { AppBar } from '../templates/appBar';
import { Layout } from '../templates/layout';

export const defaultRouter = new Hono().get('/', async (c) => {
  const language = toSupportedLanguage(c.get('language'));
  const i18n = await createI18n(language, ['common']);
  const t = i18n.t.bind(i18n);

  const checkboxArgs: CheckboxArgs = {
    id: "myCheckbox",
    checked: false,
    disabled: false,
    class: "my-custom-class"
  };
  const checkbox = Checkbox(checkboxArgs);


  const args: CardPartArgs = {
    children: "<p>Card Content</p>",
  };

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
      children: [
        CardHeader({
          children: [
            CardTitle({ children: "Card Title" }),
            CardDescription({ children: "Card Description" }),
          ],
        }),
        CardContent({ children: fieldset }),
        CardFooter({
          // class: "flex-col gap-2",
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
      {}<br />
      <div class="w-full">

      {raw(card)}
      </div>
    </Layout>
  );
});
