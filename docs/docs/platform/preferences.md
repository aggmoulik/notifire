---
sidebar_position: 7
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Subscriber Preferences

Novu provides a way to store user preferences in the subscribers data model.
This allows subscribers to specify and manage their preferences, without your intervention. Customizing preferences has become the standard expected behavior for people and Novu can take the technical burden of managing preferences off of you.

Novu allows two levels of preferences:-

- Template level channel preferences
- Subscriber level channel preferences

## Template level channel preferences

When creating a new notification template on the Web platform, you can specify default preferences for the subscribers in channel settings. They will be used unless the subscriber overrides them by his own custom preference.

This will allow you to create sensible defaults but still provide the user with the ability to override them. Template level preference can be managed in channel settings. All channels are `ON` unless specified otherwise.

`Workflow Settings > Channels`

![Template level channel preferences](/img/platform/preferences/template-level-channel-preferences.png)

## Subscriber level channel preferences

Our notification center component will show a user the available preferences, user will be able to modify on the channel level. Critical templates will be excluded from the list. Click on cog (setting) icon on notification center component to open subscriber channel preferences page.

![User preference in the component](/img/platform/preferences/user-preference.png)

:::info

Only channels with a matched step will be returned from the API in notification center preference page. In case no channel content was found, the API will return an empty array.

:::

## Exclude templates from preferences (critical template)

In some cases, you don't want the subscriber to be able to unsubscribe from mandatory notifications such as Account Verification, Password Reset, etc...

In those cases you can turn off the toggle `Users will be able to manage subscriptions` in channel settings. Template will become `critical`, once this toggle is turned `OFF`. By default, every template is `non-critical` and subscribers can manage channel preferences irrespective of template-level channel preferences. Critical template will not show on the subscriber preferences page.

## Get subscriber preferences

<Tabs groupId="language" queryString>

  <TabItem value="js" label="Node.js">

```javascript
import { Novu } from '@novu/node';

const novu = new Novu('<NOVU_API_KEY>');

// 111 is subscriberId
await novu.subscribers.getPreference('111');
```

  </TabItem>
    <TabItem value="php" label="PHP">

```php
use Novu\SDK\Novu;

$novu = new Novu('<NOVU_API_KEY>');

// 111 is subscriberId
$novu->getSubscriberPreferences('111')->toArray();
```

  </TabItem>
</Tabs>

## Update subscriber preference for a template

<Tabs groupId="language" queryString>

  <TabItem value="js" label="Node.js">

```javascript
import { Novu } from '@novu/node';

const novu = new Novu('<NOVU_API_KEY>');

await novu.subscribers.updatePreference('subscriberId', 'templateIdentfier', {
  enabled: true,
  channel: {
    in_app: true,
    email: true,
    push: true,
    sms: false,
    chat: false,
  },
});
```

  </TabItem>
    <TabItem value="php" label="PHP">

```php
use Novu\SDK\Novu;

$novu = new Novu('<NOVU_API_KEY>');

$novu->updateSubscriberPreference('subscriberId', 'templateIdentfier', [
    'enabled' => true
    'channel' => [
    'in_app' => true,
       'email' => true,
       'push' => true,
       'sms'  => false,
       'chat' => false,
    ]
]);
```

  </TabItem>
</Tabs>

## Order of priority of preferences

1. if `Users will be able to manage subscriptions` toggle is turned off i.e template is critical, this will override template level and subscriber level preferences and notification will always be sent.
2. if template is non critical and subscriber has `false` value set for `enabled` field in preference then all other channels will become inactive even if they have `true` state.
3. if template is non critical and subscriber has `true` value set for `enabled` field in preference then notification will be filtered based on subscriber channel preference.
4. Template level channel preferences will be applied to all subscribers by default unless subscriber overrides them.

`Example`

1. For `First Template`, `critical` is false, `enabled` is true, in_app, email, push channels are true and sms, chat channels are false. As per above order of priority of preferences, notification will be filtered as per the subscriber preferences. The subscriber will receive in-app, email and push notifications, but not receive sms and chat notifications.

2. For `Second Template`, `critical` is false, `enabled` is false, all channels are true. As per above order of priority of preferences, subscriber will not receive any type of notification because all channels become disabled due to false value of `enabled` field.

3. For `Third Template`. `critical` is true, `enabled` is false, email, chat channels are false and the other three channels are true. As per above order of priority of preferences, subscriber will receive all type of notifications as this template is `critical`.

```json title="Subscriber preference example for three templates"
[
  {
    "template": {
      "_id": "firstTemplateIdentifier",
      "name": "First Template",
      "critical": false
    },
    "preference": {
      "enabled": true,
      "channels": {
        "in_app": true,
        "email": true,
        "sms": false,
        "push": true,
        "chat": false
      }
    }
  },
  {
    "template": {
      "_id": "secondTemplateIdentifier",
      "name": "Second Template",
      "critical": false
    },
    "preference": {
      "enabled": false,
      "channels": {
        "in_app": true,
        "email": true,
        "sms": true,
        "push": true,
        "chat": true
      }
    }
  },
  {
    "template": {
      "_id": "thirdTemplateIdentifier",
      "name": "Third Template",
      "critical": true
    },
    "preference": {
      "enabled": false,
      "channels": {
        "in_app": true,
        "email": false,
        "sms": true,
        "push": true,
        "chat": false
      }
    }
  }
]
```

## Important Links

- [Get subscriber preferences API](https://docs.novu.co/api/get-subscriber-preferences/)
- [Update subscriber preference for a template API](https://docs.novu.co/api/update-subscriber-preference/)
- [Update template API](https://docs.novu.co/api/update-notification-template/)

## Frequently Asked Questions

<details>
  <summary>How to change <code>enable</code> field from UI?</summary>
  <p>This field can only be changed using API.</p>
</details>

<details>
  <summary>What preferences are applied to a subscriber when we create a new template?</summary>
  <p>In the case of a new template, the subscriber will inherit all preferences from the template. However, after subsequent preference updates, the subscriber's preferences will not inherit template-level preferences.</p>
</details>
