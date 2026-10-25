# Walkthrough - Academic Collaborations, Resource Hubs, and Projects Hub

Detailed log of modifications, components, styles, interactions, and responsiveness settings.

---

## 1. Collaboration Workspace Refinements

### Files & Components Modified
- [`CollaborationWorkspace.tsx`](src/pages/CollaborationWorkspace.tsx):
  - Refactored `Workspace` interface and the initial workspaces to support `WorkspaceMember[]` (with id, name, department, semester, online status, and initials).
  - Integrated `CURRENT_USER` and `AVAILABLE_STUDENTS` connections.
  - Implemented 4 custom dialog modals for DMs, Study Groups, Project Teams, and Research Discussions.
  - Rewrote the Shared Context member panel layout to show user names, departments, semesters, online badges, and the "+ Add Member" button.
  - Implemented the custom "Add Members" dialog dynamically connected to the workspace state and feed.
  - Added the `handleCloseModal` utility function to clear temporary form inputs, selected member arrays, and search queries when modals are cancelled.
- [`messages.css`](src/styles/messages.css):
  - Appended utility classes for scrollable student lists (`.collab-modal-student-list`), hoverable rows (`.student-select-row`), text sizing, and status circles.
  - Constrained `.collab-modal` dialog height with a viewport-aware `max-height: calc(100vh - 40px)` and enabled vertical `overflow-y: auto`.

### New Interactions Added
- **Modal Cancellation Cleanup**: Clicking "Cancel" closes modals and fully resets all temporary state variables (input text fields, checkboxes, selected student arrays, search queries).
- **Responsive Dialog View**: Modals constrain themselves within the viewport on short laptops and mobile displays (e.g. 360px - 768px), making bottom buttons reachable via vertical container scrolling.

---

## 2. Resources Page Implementation

### Files & Components Modified
- [`App.tsx`](src/App.tsx): Registered the route mapping for `ROUTES.RESOURCES` to render the newly created `<Resources />` page.
- [`resource.ts`](src/types/resource.ts): Extended `Resource` interface to include `subject`, `uploader`, `description`, and `fileSize` fields.
- [`resources.ts`](src/data/resources.ts): Maintained original mock database, extended objects with subject and connection uploader properties, and added extra resources to support comprehensive searching.
- [`Resources.tsx`](src/pages/Resources.tsx): Created the resource hub layout nested in `AppLayout` with query search inputs, filters, sort buttons, featured spotlight list, file cards grid, and mock upload overlays. Updated mock upload overlays to accept native file picker selections, extract name/size/extension, auto-categorize extensions, validate presence, and display size info on cards.
- [`resources.css`](src/styles/resources.css): Added styled classes for searching widgets, category filter pills, sort controls, spotlights, and modal sheets. Appended styles for file triggers, preview labels, and error tags.

### CSS Selectors Added/Changed
- `.resources-container`, `.resources-header-section`, `.resources-desc-text`
- `.resources-search-row`, `.resources-search-input-wrap`, `.resources-search-input`, `.resources-search-icon`
- `.resources-share-btn`
- `.resources-filters-bar`, `.resources-categories-row`, `.category-pill`
- `.resources-dropdowns-row`, `.filter-select-wrap`, `.filter-select`
- `.sort-toggle-group`, `.sort-toggle-btn`
- `.resources-featured-section`, `.resources-featured-grid`, `.featured-resource-card`, `.featured-icon-box`
- `.featured-card-content`, `.featured-card-top`, `.featured-card-subject`, `.featured-card-popular-badge`, `.featured-card-title`, `.featured-card-desc`, `.featured-card-meta`
- `.resources-library-section`, `.resources-library-grid`, `.library-resource-card`
- `.library-card-header`, `.library-card-icon`, `.library-card-header-info`, `.library-card-title`, `.library-card-subject`
- `.library-card-body`, `.library-card-footer`, `.library-card-uploader-info`, `.uploader-name`, `.uploader-date`, `.library-card-download-btn`
- `.resources-empty-state`, `.resources-empty-icon`, `.resources-empty-text`, `.resources-empty-sub`
- `.file-picker-trigger`, `.file-picker-icon`, `.file-picker-text`, `.file-picker-subtext`, `.file-preview-box`, `.file-preview-icon`, `.file-preview-details`, `.file-preview-name`, `.file-preview-meta`, `.file-preview-remove-btn`, `.validation-error-msg`

### New Interactions Added
- **Multi-Field Search**: Searching matches queries dynamically against filename/title, uploader, subject/course, and type/category.
- **Category Filter Pills**: Clicking category tags ("All", "Notes", "PDFs", "Cheat Sheets", "Presentations", "Research Papers", "Tutorials", "Other") filters resources instantly.
- **Subject Dropdown Filter**: Dynamic listing of unique subjects in mock databases allowing selection.
- **Recent/Popular Sorting Toggle**: Sorts resources by upload chronological order or by total download count in real-time.
- **Highlight Spotlights**: Auto-promotes the top 2 popular resources (based on `downloadCount`) in a premium banner area.
- **Action Downloads**: Triggers custom toast notifications `Download started: <filename>` on download button clicks.
- **Resource Mock Uploads**: Clicking "+ Share Resource" displays a modal allowing the input of titles, subjects, types, and summaries. Submitting appends the resource to state dynamically.
- **Real File Selection Picker**: Replaced the text input name with a native browser file picker. Accepts `.pdf`, `.ppt`, `.pptx`, `.doc`, `.docx`, `.txt`, `.zip`. Prefills resource names from selected files and maps extension types (e.g. `.pdf` -> `PDF`, `.docx` -> `Tutorial`).
- **File Metadata Previews & Removal**: Previews chosen files showing titles, file sizes, and categories. Includes a "Remove" button to reset the file state.
- **Form Submission Verification**: Blocks submissions and reveals error labels if the user tries to click Share without choosing a file.

### Responsive Changes Made
- Grid layouts adjust columns: `repeat(auto-fill, minmax(280px, 1fr))` on desktop/tablet, stacking into single column rows below `768px`.
- Navigation controls, search panels, filter rows, and dropdown boxes wrap and stack vertically on mobile (360px - 768px) to fit within viewports without clipping.
- Long titles wrap safely with `overflow-wrap: break-word` and elements use `min-width: 0` constraints to prevent container clipping.
- File preview boxes break long filenames correctly and fit within 360px screen viewports without horizontal scrolling.

---

## 3. Projects Page Implementation & Refinements

### Files & Components Modified
- [`App.tsx`](src/App.tsx): Registered the route mapping for `ROUTES.PROJECTS` to render the newly created `<Projects />` page.
- [`project.ts`](src/types/project.ts): Added the structured `ProjectMember`, `ProjectTask`, and `ProjectActivityItem` interfaces. Extended the `Project` type parameters with additional optional descriptors (such as `uploader`, `membersCount`, `neededSkills`, `recruitmentStatus`, `completedTasks`, `totalTasks`, `deadline`, `workspaceId`, `tasks`, `resources` list of type `Resource[]`, and `timeline` activity list).
- [`projectsData.ts`](src/data/projectsData.ts): Created mock student database representing user connections and academic projects, populated with interactive task lists, associated `Resource` type items, and activity feeds.
- [`Projects.tsx`](src/pages/Projects.tsx): Created the projects discovery board and detailed sub-views (Overview, Tasks checklist, Resources list, Members stack, Timeline activity logs), integrating interactive checkbox toggling that dynamically re-calculates task counts and updates the main project grid progress bar fills.
- [`projects.css`](src/styles/projects.css): Added styled classes for search fields, filter tabs, spotlight blocks, library grids, task meters, avatars stack, and dialog confirmation cards.

### CSS Selectors Added/Changed
- `.projects-container`, `.projects-header-section`, `.projects-desc-text`
- `.projects-search-row`, `.projects-search-input-wrap`, `.projects-search-input`, `.projects-search-icon`, `.projects-create-btn`
- `.projects-filters-bar`, `.projects-tabs-row`, `.filter-tab-btn`, `.projects-dropdowns-row`, `.filter-select-wrap`, `.filter-select`
- `.projects-featured-section`, `.projects-featured-grid`, `.featured-project-card`, `.featured-project-icon-box`, `.featured-project-content`
- `.featured-project-meta-row`, `.featured-project-lead`, `.featured-project-badge`, `.featured-project-title`, `.featured-project-desc`
- `.projects-library-section`, `.projects-library-grid`, `.library-project-card`
- `.library-project-header`, `.library-project-icon`, `.library-project-header-info`, `.library-project-title`, `.library-project-subtitle`
- `.library-project-desc`, `.library-project-skills-needed`, `.skill-pill`, `.library-project-tasks-wrap`
- `.tasks-meta-row`, `.tasks-progress-bar-track`, `.tasks-progress-bar-fill`, `.library-project-footer`
- `.library-project-avatars-stack`, `.project-avatar-mini`, `.library-project-actions`
- `.library-project-status-badge`, `.status-badge-open`, `.status-badge-closed`, `.status-badge-request`, `.status-badge-joined`
- `.library-project-join-btn`, `.library-project-workspace-btn`
- `.confirmation-overlay`, `.confirmation-dialog`, `.confirmation-title`, `.confirmation-body`, `.confirmation-actions`
- `.projects-empty-state`, `.projects-empty-icon`, `.projects-empty-text`, `.projects-empty-sub`
- `.project-details-container`, `.project-details-back-link`, `.project-details-header`, `.details-header-title-row`, `.details-header-icon`, `.details-header-title`, `.details-header-meta`, `.details-tabs-nav`, `.details-tab-btn`, `.details-tab-btn.active`, `.details-tab-panel`, `.details-overview-wrap`, `.details-info-section`, `.details-info-label`, `.details-info-val`, `.details-tasks-list`, `.details-task-row`, `.details-task-checkbox`, `.details-task-text`, `.task-text-checked`, `.timeline-logs-list`, `.timeline-log-entry`, `.timeline-log-time`, `.timeline-log-card`

### New Interactions Added
- **Interactive Details Pane**: Clicking "View Project" opens the Project Detail Experience overlay displaying Overview statistics, interactive checklists, shared resource lists, members list, and timeline feeds.
- **Dynamic Task Synchronization**: Toggling task checklists recalculates completed task counts, updates the progress percentage, logs a timeline entry, and updates the library project grid state in real-time.
- **Go to Workspace Nav**: Checks if `workspaceId` is present, redirecting to the Collaboration Workspace in the messages module.
- **Associated File Actions**: Displays project resources with a "Download" button that triggers the custom download started toast.
- **Join Project Confirmation Flow**: Opens a confirmation overlay dialog. Confirming sets status to "Request Sent" and triggers the toast "Join request sent".
- **Create Project Modal**: Form captures Project Title, Category, Department, Needed Skills, Deadline, Recruitment toggle, and checked members checklist, auto-populating Shreyas Rao as the owner and member.

### Responsive Changes Made
- Grids shift between multi-column grids (`repeat(auto-fill, minmax(280px, 1fr))`) and single-column lists when resizing below the `768px` breakpoint.
- Detail View navigation tabs wrap cleanly on small screens without breaking layouts.
- Text layouts utilize `overflow-wrap: break-word` and elements specify `min-width: 0` to prevent horizontal scrollbars on narrow screens.
- Dialog and modal boxes fit cleanly inside mobile viewports with reachable action buttons.

---

## 4. Discussions Page Implementation

### Files & Components Modified
- [`App.tsx`](src/App.tsx): Registered the route mapping for `ROUTES.DISCUSSIONS` to render the newly created `<Discussions />` page.
- [`discussion.ts`](src/types/discussion.ts): Extended the `Discussion` interface with the required fields: `description`, `type`, `subject`, `author` (typed `DiscussionMember`), `tags`, `createdAt`, `replies`, `views`, `answers` (typed `DiscussionAnswer[]`), `projectId`, `workspaceId`, `resourceId`, and `studyGroupId`. Kept original properties `votes`, `commentsCount`, and `category` as optional fields to support dashboard compatibility.
- [`discussions.ts`](src/data/discussions.ts): Refactored the `TRENDING_DISCUSSIONS` exports to dynamically filter from `INITIAL_DISCUSSIONS` in `discussionsData.ts`.
- [`discussionsData.ts`](src/data/discussionsData.ts): Created mock academic discussions dataset linking study groups, projects, resources, and workspaces where appropriate, prefilled with answer lists, like counters, and accepted status flags.
- [`Discussions.tsx`](src/pages/Discussions.tsx): Created the academic discussions board and in-page detail views, supporting upvoting answers, accepting replies on user threads, writing answers locally, and page routing links.
- [`discussions.css`](src/styles/discussions.css): Styled discussions lists, category filters, trending spotlights, details views, and confirmation dialog cards.

### CSS Selectors Added/Changed
- `.discussions-container`, `.discussions-header-section`, `.discussions-desc-text`
- `.discussions-search-row`, `.discussions-search-input-wrap`, `.discussions-search-input`, `.discussions-search-icon`, `.discussions-create-btn`
- `.discussions-filters-bar`, `.discussions-tabs-row`, `.filter-tab-btn`, `.discussions-dropdowns-row`, `.filter-select-wrap`, `.filter-select`
- `.discussions-trending-section`, `.trending-discussion-card`, `.trending-badge-row`, `.trending-label`, `.trending-title`, `.trending-desc`, `.trending-meta`, `.trending-actions`
- `.disc-tags-row`, `.disc-tag`, `.disc-type-badge`, `.disc-type-question`, `.disc-type-research`, `.disc-type-project`, `.disc-type-study-group`
- `.discussions-library-section`, `.discussions-library-grid`, `.library-discussion-card`, `.library-discussion-header`, `.library-discussion-body`, `.library-discussion-title`, `.library-discussion-desc`, `.library-discussion-footer`, `.disc-meta-item`
- `.discussion-details-container`, `.discussion-details-back-link`, `.discussion-details-header`, `.details-header-title-row`, `.discussion-details-title`, `.details-header-meta`, `.discussion-details-body`, `.discussion-details-desc`, `.discussion-related-context`, `.related-context-title`, `.related-context-card`, `.related-context-info`
- `.discussion-answers-section`, `.answers-list`, `.answer-card`, `.answer-author-row`, `.answer-avatar`, `.answer-author-info`, `.answer-author-name`, `.answer-author-sub`, `.answer-content`, `.answer-footer`, `.answer-likes-btn`, `.answer-accepted-badge`, `.answer-accept-btn`
- `.write-answer-section`, `.answer-input-textarea`, `.post-answer-btn`
- `.disc-empty-state`, `.disc-empty-icon`, `.disc-empty-text`, `.disc-empty-sub`

### New Interactions Added
- **Multi-Field Searches**: Instantly filters threads matching query keywords against title, body description, author names, subjects, and tags.
- **Dynamic Category & Sorting Filters**: Interactive tabs ("All", "Questions", "Research", "Projects", "Study Groups") combined with subject selectors and sort filters (Latest, Most Discussed, Most Viewed) process listings in local state without page reloads.
- **Trending Topics Section**: Spotlight panel promotes highly active discussions on the homepage.
- **In-Page Details Board**: Clicking "Open Discussion" loads the full thread. Related context blocks link to PROJECTS, RESOURCES, STUDY_GROUPS, or MESSAGES workspaces.
- **Answering & Answering Upvotes**: Users can write comments/explanations which dynamically increment replies counters. Likes trigger instant count bumps.
- **Accepted Answers Verification**: Owner creators can select and toggle "Accept Answer" status, which highlights comments with green borders and accepted checkmarks.
- **Discussion Creation Modals**: Captures topic fields, tag lists, and optional workspace linkages.

### Responsive Changes Made
- Grids shift between standard rows and multi-column wrappers below the `768px` break threshold.
- Related context card blocks stack vertically on mobile screens.
- Search and category pills wrap gracefully on mobile viewports.
- Word wrapping parameters (`overflow-wrap: break-word` and `min-width: 0`) safeguard against horizontal overflows.

---

## 5. Build & Compilation Verification
- Ran build compilation check:
  ```powershell
  npm.cmd run build
  ```
  Bundles compile and bundle with code `0`.
