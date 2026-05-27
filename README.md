# CRM Contact Details

A small React + TypeScript take-home assignment that renders a CRM-style contact details page from static JSON configuration.

The goal is to show a practical config-driven frontend: page sections come from layout JSON, contact folders and fields come from field config JSON, and the displayed values come from separate static data files behind a service layer.

## Tech Stack

- React
- TypeScript
- Vite
- CSS Modules
- React Icons
- Static JSON files
- No backend

## Demo

https://github.com/user-attachments/assets/a6c96dae-90db-4aef-bf73-02f8cd0cde56

## Run Locally

```bash
npm install
npm run dev
```

For a production check:

```bash
npm run build
```

## Folder Structure

```text
src/
  app/
    App.tsx
  shared/
    lib/
      classNames.ts
      dateFormatters.ts
    ui/
      Avatar/
        Avatar.tsx
        Avatar.module.css
      Button/
        Button.tsx
        Button.module.css
      SectionCard/
        SectionCard.tsx
        SectionCard.module.css
      Tag/
        Tag.tsx
        Tag.module.css
      index.ts
      types.ts
  features/
    contact-details/
      components/
        ContactDetailsPanel/
          ContactDetailsPanel.tsx
          ContactDetailsPanel.module.css
        ContactFieldItem/
          ContactFieldItem.tsx
          ContactFieldItem.module.css
        ContactOverviewCard/
          ContactOverviewCard.tsx
          ContactOverviewCard.module.css
        FieldFolder/
          FieldFolder.tsx
          FieldFolder.module.css
      helpers/
        buildContactDetailFolders.ts
        fieldValidation.ts
      index.ts
      types.ts
    conversations/
      components/
        ConversationCard/
          ConversationCard.tsx
          ConversationCard.module.css
        ConversationsPanel/
          ConversationsPanel.tsx
          ConversationsPanel.module.css
      index.ts
      types.ts
    notes/
      components/
        NotesPanel/
          NotesPanel.tsx
          NotesPanel.module.css
      index.ts
      types.ts
  pages/
    contact-page/
      components/
        ContactPage/
          ContactPage.tsx
          ContactPage.module.css
      helpers/
        contactPageHelpers.ts
      index.ts
      types.ts
  services/
    contactPageService.ts
  data/
    layout.json
    contactFields.json
    contactData.json
    notes.json
    conversations.json
  styles/
    global.css
```

`global.css` only keeps the app-wide reset and base typography. Each React component owns its own CSS Module in the same component folder to avoid class-name collisions as the project grows.

Feature folders expose a small `index.ts` public API. Page modules compose those features and own page-level orchestration such as loading data, ordering layout sections, and rendering page chrome.

Shared UI, feature, and page types live in their nearest `types.ts` files instead of inside React components. That keeps component files focused on rendering.

Generic helpers live in `shared/lib` only when more than one feature uses them. For example, `dateFormatters.ts` is shared by contact fields, conversations, and notes.

## JSON Usage

`layout.json` controls which major sections are visible and their default order. The runtime layout toggle reuses this same JSON and applies small order overrides in the data service, so section definitions are not duplicated. `ContactPage.tsx` sorts sections by `order`, then renders the matching section type.

`contactFields.json` defines folders and fields for the left Contact Details panel. Folder names, open state, optional folder actions, field labels, field keys, and field types all come from this file.

`contactData.json` contains multiple contact records with values keyed by the field keys from `contactFields.json`. `buildContactDetailFolders.ts` joins field configuration with the selected contact values into a simple folder view model before rendering.

`notes.json` drives the yellow note cards in the right panel and is filtered by the selected contact.

`conversations.json` drives the activity/conversation stream in the center panel and is filtered by the selected contact.

## Dynamic Rendering Approach

The app has two small allow-listed renderer maps:

- `pages/contact-page/helpers/contactPageHelpers.ts` maps layout section `type` values to feature components and column classes. It also keeps right-rail navigation metadata in one array so the page JSX stays compact.
- `ContactFieldItem.tsx` renders one prepared field item and maps field `type` values to display treatments such as email links, phone links, tags, multi-select chips, dates, URLs, and multiline text.

Field labels and folder names are not hardcoded in the contact detail components. `ContactOverviewCard` owns the profile summary card, `ContactDetailsPanel` keeps the local tabs/search/folder composition, `FieldFolder` only renders accordion structure, and `ContactFieldItem` owns the label/value display for each prepared field. Section order is also not hardcoded in JSX.

Contact fields can be edited inline. `fieldValidation.ts` keeps field-type parsing and validation close to the contact-details feature, with validation for email, phone, URL, date, and multi-select values.

Feature-level helpers are used when they describe feature data flow, such as `buildContactDetailFolders.ts` joining contact field config with contact values. Small one-line UI conditions stay inside components to keep the code easy to follow.

`ContactPage.tsx` owns the page-level loading and error state directly. Since this data load is only used by one page, keeping it in the page avoids an unnecessary hook abstraction.

The previous/next contact controls update the selected contact index and request the matching contact page data from the service. The service reuses cached JSON resources and returns contact-specific notes and conversations.

## Data Service And Caching

`src/services/contactPageService.ts` is shaped like a replaceable data service. Today it reads from `src/data/*.json`, adds a small async delay, and stores resolved resources in an in-memory `Map`, so repeated requests return from cache. The layout toggle only derives a different section order from the cached base layout; contact details, notes, and conversations continue to reuse the same cached data.

This is intentionally small and readable, but it mirrors a real API boundary. Later, the static imports inside `contactPageService.ts` can be replaced with `fetch` calls while `ContactPage.tsx` continues to call the same `contactPageService.getContactPageData()` method.

## Assumptions

- The screenshot is treated as the visual direction, not a pixel-perfect design system.
- Static data uses a small set of contact records to demonstrate previous/next navigation.
- The right rail icons and action buttons are visual-only.
- Conversations and notes are read-only static data.
- Search, DND, and Actions tabs are present for UI fidelity but do not filter content.
- The layout switch is included to demonstrate runtime JSON layout changes without a backend.

## Known Limitations

- No real API or persistence.
- Field edits are local-only and reset on page refresh.
- Search and tabs are not wired to behavior.

## Possible Improvements

- Add search/filter behavior for folders and fields.
- Add component tests around the layout and field renderers.
- Add storybook-style examples for field type rendering.
