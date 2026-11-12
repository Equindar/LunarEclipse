import { Avatar, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardPartArgs, CardTitle, Checkbox, Field, Item, Label, type AvatarArgs, type CheckboxArgs } from '@lunareclipse/design';
import createI18n, { toSupportedLanguage } from '@lunareclipse/i18n';
import { Hono } from 'hono';
import { raw } from 'hono/html';
import { AppBar } from '../templates/appBar';
import { Layout } from '../templates/layout';

export const defaultRouter = new Hono().get('/', async (c) => {
  const language = toSupportedLanguage(c.get('language'));
  const i18n = await createI18n(language, ['common']);
  const t = i18n.t.bind(i18n);

  const button = Button({
    variant: "default",
    size: "lg",
    attributes: {
      "data-on:click": "@post('/api/delete')",
    },
    children: t('common:buttons.submit'),
  });

  const counterButton = Button({
    variant: "secondary",
    attributes: {
      "data-signals": "{count: 0}",
      "data-on:click": "$count++",
      "data-text": "$count",
    },
  });

  const label = Label({
    for: "myCheckbox",
    children: "Check me",
  });
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
  const card = Card({

      children: [
        CardHeader({
          children: [
            CardTitle({ children: "Card Title" }),
            CardDescription({ children: "Card Description" }),
          ],
        }),
        CardContent({ children: "<p>Card Content</p>" }),
        CardFooter({
          class: "flex-col gap-2",
          children:  [button, counterButton ]}),
      ]
  });

  const avatarArgs: AvatarArgs = {
    size: "lg",
    backgroundColor: "#3b82f6",
    textColor: "#ffffff",
    children: "Eq",
  };
  const avatar = Avatar(avatarArgs);

  const field = Field({
    id: "myField",
    orientation: "horizontal",
    disabled: true,
    children: [
      Item({
        children: [
          Label({ for: "myCheckbox", children: "Check me",  }),
          Checkbox({
            id: "myCheckbox",
            checked: false,
            disabled: false,
            class: "my-custom-class"
          }),
        ],
      }),
    ],
  });

  return c.html(
    <Layout title="Default Page">
      <AppBar currentLang={language} currentPath={c.req.path} />
      <h1>Default Page</h1>
      {}<br />
      {raw(counterButton)}
      {raw(label)} {raw(checkbox)}
      {raw(card)}
      {raw(avatar)}
      {raw(field)}
    </Layout>
  );
});
