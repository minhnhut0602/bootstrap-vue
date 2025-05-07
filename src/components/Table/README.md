# Table

```vue
<Table
    :fields="[Field]"
    :items="[Object]"
    :perPage="10"
    :currentPage="1"
    :totalRows="100"
    :perPageOptions="[10, 25, 50, 100]"
    filterable
    filterPlaceholder="Search..."
    :filterDebounce="300"
    :filterIgnoredFields="['id']"
    :filterIncludedFields="['name', 'email']"
    noProviderFiltering
    noProviderPaging
    responsive="md"
    stickyHeader="400px"
    busy
    :tbodyTransitionProps="{ name: 'fade' }"
    :detailsTransitionProps="{ name: 'fade', mode: 'out-in' }"
    multiSort
    hover
    selectable
    selectMode="multi"
    showDetails
    footClone
/>
```

## Props

| Prop name | Description | Type | Values | Default |
|-----------|-------------|------|--------|---------|
| fields | The fields of the table | Field[] | - | undefined |
| items | The items that are shown in the table | Record&lt;string, unknown&gt;[] | - | () => [] |
| multiSort | Defines if multiple items can be sorted at once | boolean | - | false |
| hover | Defines if the `table-hover` class should be used | boolean | - | false |
| onClick:row | Defines if the `table-click` class should be used | func | - | undefined |
| tbodyTrClass | The classes that will be forwarded to the tbody tr | string\|array\|object\|func | - | undefined |
| theadTrClass | The classes that will be forwarded to the tbody tr | string\|array\|object | - | undefined |
| id | The ID of the table | string | - | undefined |
| caption | The caption of the table | string | - | undefined |
| captionHtml | The HTML caption of the table | string | - | undefined |
| captionTop | Whether the caption should be on top | boolean | - | false |
| emptyText | The text to show when there are no items | string | - | 'There are no records to show' |
| emptyFilteredText | The text to show when there are no filtered items | string | - | 'There are no records matching your request' |
| footClone | Whether to show the footer | boolean | - | false |
| noFooterSorting | Whether to disable footer sorting | boolean | - | false |
| headRowVariant | The variant for the header row | string | - | undefined |
| footRowVariant | The variant for the footer row | string | - | undefined |
| tbodyClass | The class for the tbody | string\|array\|object | - | undefined |
| tfootTrClass | The class for the tfoot tr | string\|array\|object | - | undefined |
| selectable | Whether the table is selectable | boolean | - | false |
| selectMode | The select mode | string | 'single', 'multi', 'range' | 'multi' |
| selectedVariant | The variant for selected rows | string | - | 'active' |
| showDetails | Whether to show row details | boolean | - | false |
| detailsTdClass | The class for the details td | string\|array\|object | - | undefined |
| perPage | Number of rows to show per page | number\|string | - | 0 |
| perPageOptions | Available options for per page | (number\|string)[] | - | [10, 25, 50, 100] |
| currentPage | Current page number | number\|string | - | 1 |
| totalRows | Total number of rows | number\|string | - | 0 |
| noProviderPaging | Whether to use internal pagination | boolean | - | false |
| filterable | Whether the table is filterable | boolean | - | false |
| filterPlaceholder | Placeholder text for the filter input | string | - | 'Filter...' |
| filterDebounce | Debounce time for filter input | number\|string | - | 0 |
| filterFunction | Custom filter function | function | - | undefined |
| filterIgnoredFields | Fields to ignore when filtering | string[] | - | [] |
| filterIncludedFields | Fields to include when filtering | string[] | - | [] |
| noProviderFiltering | Whether to use internal filtering | boolean | - | false |
| responsive | Makes the table responsive | boolean\|string | true, 'sm', 'md', 'lg', 'xl' | false |
| stickyHeader | Makes the table header sticky | boolean\|string | true, CSS height value | false |
| busy | Whether the table is in busy state | boolean | - | false |
| tbodyTransitionProps | Transition props for tbody | object | - | {} |
| tbodyTransitionHandlers | Transition handlers for tbody | object | - | {} |
| detailsTransitionProps | Transition props for row details | object | - | { name: 'fade', mode: 'out-in' } |
| detailsTransitionHandlers | Transition handlers for row details | object | - | {} |

## Slots

| Name | Description | Bindings |
|------|-------------|----------|
| `header-${header.key}` | Displays the header of the table | **key** `string` - The key of the header<br/>**header** `object` - The header object |
| `header-${header.key}-content` | Displays the content of the table header | **header** `object` - The header object |
| top-row | Displays as the top row of the table | **headers** `object[]` - The headers of the table |
| no-items | Displays if there are no items in the table | **headers** `object[]` - The headers of the table |
| empty | Content to display when no items are present | **headers** `object[]` - The headers of the table |
| row | Displays the row of the table | **item** `object` - The item object<br/>**index** `int` - The index of the item |
| header.key | Displays the content of the table row | **key** `any` - The key of the header<br/>**field** `object` - The header object<br/>**item** `object` - The item of the row<br/>**index** `int` - The index of the item of the row<br/>**value** `any` - The value that should be displayed |
| `${header.key}-content` | Displays the content of the table row | **field** `any` - The header object<br/>**item** `object` - The item of the row<br/>**index** `int` - The index of the item of the row<br/>**value** `any` - The value that should be displayed |
| bottom-row | Displays as the bottom row of the table | **headers** `object[]` - The headers of the table |
| table-busy | Content to display when table is in busy state | - |
| table-colgroup | Content to display in the colgroup element | - |
| thead-top | Content to display above the header row | - |
| custom-foot | Custom footer content | - |
| row-details | Content to display in the row details | **item** `object` - The item object<br/>**index** `int` - The index of the item |

## Events

| Event name | Properties | Description |
|------------|------------|-------------|
| click:row | **item** `object` - The row that was clicked | Fired when a row is clicked |
| hover:row | **item** `object` - The row that was hovered<br/>**e** `unknown` - The event | Fired when a row is hovered |
| sort | **sorted** `object` - The sort object | Fired when the sorting of a column is changed |
| row-dblclicked | **item** `object` - The row that was double clicked<br/>**index** `number` - The index of the row<br/>**e** `MouseEvent` - The event | Fired when a row is double clicked |
| row-contextmenu | **item** `object` - The row that was right clicked<br/>**index** `number` - The index of the row<br/>**e** `MouseEvent` - The event | Fired when a row is right clicked |
| row-hovered | **item** `object` - The row that was hovered<br/>**index** `number` - The index of the row<br/>**e** `MouseEvent` - The event | Fired when a row is hovered |
| row-unhovered | **item** `object` - The row that was unhovered<br/>**index** `number` - The index of the row<br/>**e** `MouseEvent` - The event | Fired when a row is unhovered |
| row-middle-clicked | **item** `object` - The row that was middle clicked<br/>**index** `number` - The index of the row<br/>**e** `MouseEvent` - The event | Fired when a row is middle clicked |
| row-selected | **rows** `object[]` - The selected rows | Fired when rows are selected |
| update:currentPage | **page** `number` - The new page number | Fired when the current page changes |
| update:perPage | **perPage** `number` - The new per page value | Fired when the per page value changes |
| pagination | **currentPage** `number` - The current page<br/>**perPage** `number` - The per page value | Fired when pagination changes |
| filtered | **filteredItems** `object[]` - The filtered items | Fired when filtering changes |
