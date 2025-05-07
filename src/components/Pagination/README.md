# Pagination

A pagination component that provides navigation for paginated content.

```vue
<Pagination
    v-model="currentPage"
    :total-rows="100"
    :per-page="10"
    :limit="5"
    align="center"
    size="lg"
    pills
    @change="onPageChange"
    @page-click="onPageClick"
/>
```

## Props

| Prop name          | Description                                                | Type                    | Values                                    | Default           |
|-------------------|------------------------------------------------------------|-------------------------|-------------------------------------------|-------------------|
| modelValue        | Current page number                                        | number/string/boolean   | -                                         | null              |
| totalRows         | Total number of rows in the dataset                        | number/string           | -                                         | 0                 |
| perPage           | Number of rows per page                                    | number/string           | -                                         | 20                |
| limit             | Maximum number of buttons to show                          | number/string           | -                                         | 5                 |
| align             | Alignment of the page buttons                              | string                  | 'left', 'right', 'center', 'fill', 'start', 'end' | 'left'    |
| size              | Size of the rendered buttons                               | string                  | '', 'sm', 'md', 'lg'                      | ''                |
| pills             | Applies pill styling to the pagination buttons             | boolean                 | -                                         | false             |
| disabled          | Disables the component's functionality                     | boolean                 | -                                         | false             |
| hideGotoEndButtons| Hides the goto first and goto last page buttons            | boolean                 | -                                         | false             |
| hideEllipsis      | Do not show ellipsis buttons                               | boolean                 | -                                         | false             |
| firstNumber       | Display first page number instead of Goto First button     | boolean                 | -                                         | false             |
| lastNumber        | Display last page number instead of Goto Last button       | boolean                 | -                                         | false             |
| firstText         | Content for the goto first page button                     | string                  | -                                         | '«'               |
| prevText          | Content for the goto previous page button                  | string                  | -                                         | '‹'               |
| nextText          | Content for the goto next page button                      | string                  | -                                         | '›'               |
| lastText          | Content for the goto last page button                      | string                  | -                                         | '»'               |
| ellipsisText      | Content for the ellipsis placeholder                       | string                  | -                                         | '…'               |
| ariaLabel         | Value for the 'aria-label' attribute                       | string                  | -                                         | 'Pagination'      |
| ariaControls      | ID of the controlled component/element                     | string                  | -                                         | ''                |
| labelFirstPage    | aria-label for the goto first page button                  | string                  | -                                         | 'Go to first page'|
| labelPrevPage     | aria-label for the goto previous page button               | string                  | -                                         | 'Go to previous page'|
| labelPage         | aria-label for the goto page button                        | function/string         | -                                         | 'Go to page'      |
| labelNextPage     | aria-label for the goto next page button                   | string                  | -                                         | 'Go to next page' |
| labelLastPage     | aria-label for the goto last page button                   | string                  | -                                         | 'Go to last page' |
| firstClass        | Class(es) for the goto first page button                   | array/object/string     | -                                         | ''                |
| prevClass         | Class(es) for the goto previous page button                | array/object/string     | -                                         | ''                |
| pageClass         | Class(es) for the goto page buttons                        | array/object/string     | -                                         | ''                |
| nextClass         | Class(es) for the goto next page button                    | array/object/string     | -                                         | ''                |
| lastClass         | Class(es) for the goto last page button                    | array/object/string     | -                                         | ''                |
| ellipsisClass     | Class(es) for the ellipsis placeholders                    | array/object/string     | -                                         | ''                |

## Events

| Name              | Description                                | Payload |
|-------------------|--------------------------------------------|---------|
| update:modelValue | Emitted when the current page changes      | number  |
| change            | Emitted when page changes via user interaction | number |
| input             | Emitted when page changes via user interaction or programmatically | number \| null |
| page-click        | Emitted when a page button was clicked. Cancelable | { preventDefault: () => void }, page: number |

## Slots

| Name          | Scoped | Description |
|---------------|--------|-------------|
| ellipsis-text | No     | The '...' indicator content. Overrides the `ellipsis-text` prop |
| first-text    | No     | The 'Go to first page' button content |
| last-text     | No     | The 'Go to last page' button content |
| next-text     | No     | The 'Go to next page' button content |
| page          | Yes    | Page number button content. Receives `page` prop |
| prev-text     | No     | The 'Go to previous page' button content | 