<template>
    <div>
        <div v-if="filterable" class="mb-3">
            <input
                v-model="filterValue"
                type="text"
                class="form-control"
                :placeholder="filterPlaceholder"
                @input="onFilterInput"
            />
        </div>
        <div
            :class="[
                'table-responsive',
                {
                    'table-responsive-sm': responsive === 'sm',
                    'table-responsive-md': responsive === 'md',
                    'table-responsive-lg': responsive === 'lg',
                    'table-responsive-xl': responsive === 'xl',
                }
            ]"
            :style="stickyHeaderStyle"
        >
            <div v-if="busy" class="table-busy-overlay">
                <slot name="table-busy">
                    <div class="table-busy-spinner">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </slot>
            </div>
            <table
                class="table"
                :class="classes"
                :id="id"
            >
                <caption v-if="caption || captionHtml" :class="{ 'caption-top': captionTop }">
                    <span v-if="captionHtml" v-html="captionHtml"></span>
                    <span v-else>{{ caption }}</span>
                </caption>
                <colgroup v-if="$slots['table-colgroup']">
                    <slot name="table-colgroup" />
                </colgroup>
                <thead v-if="headers.length">
                    <tr :class="[theadTrClass, headRowVariant ? `table-${headRowVariant}` : '']">
                        <slot name="thead-top" />
                        <!--
                        @slot Displays the header of the table
                        @binding {string} key The key of the header
                        @binding {object} header The header object
                        -->
                        <slot
                            v-for="header in headers"
                            :key="`header-${header.key}`"
                            :header="header"
                            :name="`header-${header.key}`"
                        >
                            <th
                                :key="header.key"
                                :class="{
                                    'table-heading-sortable': header.sortable,
                                    'table-heading-sortable-asc': sorted[header.key] === 'asc',
                                    'table-heading-sortable-desc': sorted[header.key] === 'desc',
                                }"
                                @click="sort(header)"
                            >
                                <!--
                                @slot Displays the content of the table header
                                @binding {object} header The header object
                                -->
                                <slot
                                    :header="header"
                                    :name="`header-${header.key}-content`"
                                >
                                    {{ header.label || header.key }}
                                </slot>
                            </th>
                        </slot>
                    </tr>
                </thead>

                <tbody
                    :class="tbodyClass"
                    v-bind="tbodyTransitionProps"
                    v-on="tbodyTransitionHandlers"
                >
                    <!--
                    @slot Displays as the top row of the table
                    @binding {object[]} headers The headers of the table
                    -->
                    <slot
                        name="top-row"
                        :headers="headers"
                    />

                    <!--
                    @slot Displays if there are no items in the table
                    @binding {object[]} headers The headers of the table
                    -->
                    <slot
                        v-if="!displayItems.length"
                        name="no-items"
                        :headers="headers"
                    >
                        <tr>
                            <td :colspan="headers.length" class="text-center">
                                <slot name="empty" :headers="headers">
                                    {{ emptyText }}
                                </slot>
                            </td>
                        </tr>
                    </slot>

                    <template
                        v-for="(item, index) in displayItems"
                        v-else
                        :key="`item-${index}`"
                    >
                        <!--
                        @slot Displays the row of the table
                        @binding {object} item The item object
                        @binding {int} index The index of the item
                        -->
                        <slot
                            name="row"
                            :item="item"
                            :index="index"
                        >
                            <tr
                                :class="[
                                    typeof tbodyTrClass === 'function' ? tbodyTrClass(item) : tbodyTrClass,
                                    selectedRows.includes(item) ? `table-${selectedVariant}` : '',
                                ]"
                                @click="onRowClick(item, index, $event)"
                                @dblclick="$emit('row-dblclicked', item, index, $event)"
                                @contextmenu="$emit('row-contextmenu', item, index, $event)"
                                @mouseenter="$emit('row-hovered', item, index, $event)"
                                @mouseleave="$emit('row-unhovered', item, index, $event)"
                                @mousedown="$emit('row-middle-clicked', item, index, $event)"
                            >
                                <!--
                                @slot Displays the content of the table row
                                @binding {any} key The key of the header
                                @binding {object} field The header object
                                @binding {object} item The item of the row
                                @binding {int} index The index of the item of the row
                                @binding {any} value The value that should be displayed
                                -->
                                <slot
                                    v-for="header in headers"
                                    :key="header.key"
                                    :name="header.key"
                                    :field="header"
                                    :item="item"
                                    :index="index"
                                    :value="item[header.key]"
                                >
                                    <td :key="`item-${index}-${header}`">
                                        <!--
                                        @slot Displays the content of the table row
                                        @binding {any} field The header object
                                        @binding {object} item The item of the row
                                        @binding {int} index The index of the item of the row
                                        @binding {any} value The value that should be displayed
                                        -->
                                        <slot
                                            :field="header"
                                            :item="item"
                                            :index="index"
                                            :value="item[header.key]"
                                            :name="`${header.key}-content`"
                                        >
                                            {{ item[header.key] }}
                                        </slot>
                                    </td>
                                </slot>
                            </tr>
                            <transition
                                v-if="showDetails && selectedRows.includes(item)"
                                v-bind="detailsTransitionProps"
                                v-on="detailsTransitionHandlers"
                            >
                                <tr>
                                    <td :colspan="headers.length" :class="detailsTdClass">
                                        <slot name="row-details" :item="item" :index="index" />
                                    </td>
                                </tr>
                            </transition>
                        </slot>
                    </template>

                    <!--
                    @slot Displays as the bottom row of the table
                    @binding {object[]} headers The headers of the table
                    -->
                    <slot
                        name="bottom-row"
                        :headers="headers"
                    />
                </tbody>

                <tfoot v-if="footClone">
                    <tr :class="[tfootTrClass, footRowVariant ? `table-${footRowVariant}` : '']">
                        <slot name="custom-foot">
                            <th
                                v-for="header in headers"
                                :key="`footer-${header.key}`"
                                :class="{
                                    'table-heading-sortable': header.sortable && !noFooterSorting,
                                    'table-heading-sortable-asc': sorted[header.key] === 'asc',
                                    'table-heading-sortable-desc': sorted[header.key] === 'desc',
                                }"
                                @click="!noFooterSorting && sort(header)"
                            >
                                <slot
                                    :header="header"
                                    :name="`footer-${header.key}`"
                                >
                                    {{ header.label || header.key }}
                                </slot>
                            </th>
                        </slot>
                    </tr>
                </tfoot>
            </table>
        </div>
        <div v-if="perPage > 0" class="d-flex justify-content-between align-items-center mt-3">
            <div class="d-flex align-items-center">
                <span class="me-2">Show</span>
                <select
                    :value="perPage"
                    class="form-select form-select-sm"
                    style="width: auto"
                    @change="onPerPageChange"
                >
                    <option
                        v-for="option in perPageOptions"
                        :key="option"
                        :value="option"
                    >
                        {{ option }}
                    </option>
                </select>
                <span class="ms-2">entries</span>
            </div>
            <div class="d-flex align-items-center">
                <span class="me-2">Page</span>
                <select
                    :value="currentPage"
                    class="form-select form-select-sm"
                    style="width: auto"
                    @change="onPageChange"
                >
                    <option
                        v-for="page in totalPages"
                        :key="page"
                        :value="page"
                    >
                        {{ page }}
                    </option>
                </select>
                <span class="ms-2">of {{ totalPages }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export interface Field {
    key: string;
    label?: string;
    sortable?: boolean;
    sort?: 'asc' | 'desc';
}
</script>

<script lang="ts" setup>
import {PropType, computed, ref, watch} from 'vue';
import {useClasses} from '@/composables';
import {debounce} from 'lodash-es';

const props = defineProps({
    /**
     * The fields of the table
     */
    fields: {
        type: Array as PropType<Field[]>,
        required: false,
        default: undefined,
    },
    /**
     * The items that are shown in the table
     */
    items: {
        type: Array as PropType<Record<string, unknown>[]>,
        default: () => [],
    },
    /**
     * Defines if multiple items can be sorted at once
     */
    multiSort: {
        type: Boolean,
        default: false,
    },
    /**
     * Defines if the `table-hover` class should be used
     */
    hover: {
        type: Boolean,
        default: false,
    },
    /**
     * Defines if the `table-click` class should be used
     */
    // $attrs doesn't return emitted events, so
    // we have to catch it as a prop
    // eslint-disable-next-line vue/prop-name-casing
    'onClick:row': {
        type: Function,
        default: undefined,
    },
    /**
     * The classes that will be forwarded to the tbody tr
     */
    tbodyTrClass: {
        type: [String, Array, Object, Function],
        default: undefined,
    },
    /**
     * The classes that will be forwarded to the tbody tr
     */
    theadTrClass: {
        type: [String, Array, Object],
        default: undefined,
    },
    /**
     * The ID of the table
     */
    id: {
        type: String,
        default: undefined,
    },
    /**
     * The caption of the table
     */
    caption: {
        type: String,
        default: undefined,
    },
    /**
     * The HTML caption of the table
     */
    captionHtml: {
        type: String,
        default: undefined,
    },
    /**
     * Whether the caption should be on top
     */
    captionTop: {
        type: Boolean,
        default: false,
    },
    /**
     * The text to show when there are no items
     */
    emptyText: {
        type: String,
        default: 'There are no records to show',
    },
    /**
     * The text to show when there are no filtered items
     */
    emptyFilteredText: {
        type: String,
        default: 'There are no records matching your request',
    },
    /**
     * Whether to show the footer
     */
    footClone: {
        type: Boolean,
        default: false,
    },
    /**
     * Whether to disable footer sorting
     */
    noFooterSorting: {
        type: Boolean,
        default: false,
    },
    /**
     * The variant for the header row
     */
    headRowVariant: {
        type: String,
        default: undefined,
    },
    /**
     * The variant for the footer row
     */
    footRowVariant: {
        type: String,
        default: undefined,
    },
    /**
     * The class for the tbody
     */
    tbodyClass: {
        type: [String, Array, Object],
        default: undefined,
    },
    /**
     * The class for the tfoot tr
     */
    tfootTrClass: {
        type: [String, Array, Object],
        default: undefined,
    },
    /**
     * Whether the table is selectable
     */
    selectable: {
        type: Boolean,
        default: false,
    },
    /**
     * The select mode
     */
    selectMode: {
        type: String,
        default: 'multi',
        validator: (value: string) => ['single', 'multi', 'range'].includes(value),
    },
    /**
     * The variant for selected rows
     */
    selectedVariant: {
        type: String,
        default: 'active',
    },
    /**
     * Whether to show row details
     */
    showDetails: {
        type: Boolean,
        default: false,
    },
    /**
     * The class for the details td
     */
    detailsTdClass: {
        type: [String, Array, Object],
        default: undefined,
    },
    /**
     * Number of rows to show per page
     */
    perPage: {
        type: [Number, String],
        default: 0,
    },
    /**
     * Available options for per page
     */
    perPageOptions: {
        type: Array as PropType<(number | string)[]>,
        default: () => [10, 25, 50, 100],
    },
    /**
     * Current page number
     */
    currentPage: {
        type: [Number, String],
        default: 1,
    },
    /**
     * Total number of rows
     */
    totalRows: {
        type: [Number, String],
        default: 0,
    },
    /**
     * Whether to use internal pagination
     */
    noProviderPaging: {
        type: Boolean,
        default: false,
    },
    /**
     * Whether the table is filterable
     */
    filterable: {
        type: Boolean,
        default: false,
    },
    /**
     * Placeholder text for the filter input
     */
    filterPlaceholder: {
        type: String,
        default: 'Filter...',
    },
    /**
     * Debounce time for filter input
     */
    filterDebounce: {
        type: [Number, String],
        default: 0,
    },
    /**
     * Custom filter function
     */
    filterFunction: {
        type: Function,
        default: undefined,
    },
    /**
     * Fields to ignore when filtering
     */
    filterIgnoredFields: {
        type: Array as PropType<string[]>,
        default: () => [],
    },
    /**
     * Fields to include when filtering
     */
    filterIncludedFields: {
        type: Array as PropType<string[]>,
        default: () => [],
    },
    /**
     * Whether to use internal filtering
     */
    noProviderFiltering: {
        type: Boolean,
        default: false,
    },
    /**
     * Makes the table responsive
     */
    responsive: {
        type: [Boolean, String],
        default: false,
        validator: (value: boolean | string) => {
            if (typeof value === 'boolean') return true;
            return ['sm', 'md', 'lg', 'xl'].includes(value);
        },
    },
    /**
     * Makes the table header sticky
     */
    stickyHeader: {
        type: [Boolean, String],
        default: false,
    },
    /**
     * Whether the table is in busy state
     */
    busy: {
        type: Boolean,
        default: false,
    },
    /**
     * Transition props for tbody
     */
    tbodyTransitionProps: {
        type: Object,
        default: () => ({}),
    },
    /**
     * Transition handlers for tbody
     */
    tbodyTransitionHandlers: {
        type: Object,
        default: () => ({}),
    },
    /**
     * Transition props for row details
     */
    detailsTransitionProps: {
        type: Object,
        default: () => ({
            name: 'fade',
            mode: 'out-in',
        }),
    },
    /**
     * Transition handlers for row details
     */
    detailsTransitionHandlers: {
        type: Object,
        default: () => ({}),
    },
});

const emit = defineEmits<{
    /**
     * Fired when a row is clicked
     * @param {object} item The row that was clicked
     */
    (event: 'click:row', item: Record<string, unknown>): void
    /**
     * Fired when a row is hovered
     * @param {object} item The row that was hovered
     * @param {unknown} e The event
     */
    (event: 'hover:row', item: Record<string, unknown>, e: unknown): void
    /**
     * Fired when the sorting of a column is changed
     * @param {object} sorted The sort object
     */
    (event: 'sort', sorted: Record<string, string>): void
    /**
     * Fired when a row is double clicked
     */
    (event: 'row-dblclicked', item: Record<string, unknown>, index: number, e: MouseEvent): void
    /**
     * Fired when a row is right clicked
     */
    (event: 'row-contextmenu', item: Record<string, unknown>, index: number, e: MouseEvent): void
    /**
     * Fired when a row is hovered
     */
    (event: 'row-hovered', item: Record<string, unknown>, index: number, e: MouseEvent): void
    /**
     * Fired when a row is unhovered
     */
    (event: 'row-unhovered', item: Record<string, unknown>, index: number, e: MouseEvent): void
    /**
     * Fired when a row is middle clicked
     */
    (event: 'row-middle-clicked', item: Record<string, unknown>, index: number, e: MouseEvent): void
    /**
     * Fired when rows are selected
     */
    (event: 'row-selected', rows: Record<string, unknown>[]): void
    /**
     * Fired when the current page changes
     */
    (event: 'update:currentPage', page: number): void
    /**
     * Fired when the per page value changes
     */
    (event: 'update:perPage', perPage: number): void
    /**
     * Fired when pagination changes
     */
    (event: 'pagination', { currentPage: number, perPage: number }): void
    /**
     * Fired when filtering changes
     */
    (event: 'filtered', filteredItems: Record<string, unknown>[]): void
}>();

const sorted = ref(
    (props.fields || [])
        .filter(f => f.sortable && f.sort)
        .reduce((obj, item) => Object.assign(obj, {[item.key]: item.sort}), {}),
);

const selectedRows = ref<Record<string, unknown>[]>([]);

const headers = computed<Field[]>(() => {
    if (props.fields) {
        return props.fields;
    }

    const first = props.items.find(i => i !== undefined);

    return first
        ? Object.keys(first)
            .map(f => ({key: f}))
        : [];
});

const sort = (field: Field) => {
    if (!field.sortable) {
        return;
    }

    const key = field.key;

    const sort = sorted.value[key];

    if (props.multiSort) {
        if (sort === 'asc') {
            sorted.value[key] = 'desc';
        } else if (sort === 'desc') {
            delete sorted.value[key];
        } else {
            sorted.value[key] = 'asc';
        }
    } else {
        sorted.value = {
            [key]: sort === 'asc' ? 'desc' : 'asc',
        };
    }

    emit('sort', sorted.value);
};

const onRowClick = (item: Record<string, unknown>, index: number, event: MouseEvent) => {
    if (props.selectable) {
        if (props.selectMode === 'single') {
            selectedRows.value = [item];
        } else if (props.selectMode === 'multi') {
            const idx = selectedRows.value.indexOf(item);
            if (idx === -1) {
                selectedRows.value.push(item);
            } else {
                selectedRows.value.splice(idx, 1);
            }
        } else if (props.selectMode === 'range') {
            // TODO: Implement range selection
        }
        emit('row-selected', selectedRows.value);
    }
    emit('click:row', item);
};

const {classes} = useClasses(computed(() => [
    props.hover && 'table-hover',
    props['onClick:row'] && 'table-click',
    props.stickyHeader && 'table-sticky-header',
    props.busy && 'table-busy',
]));

const totalPages = computed(() => {
    const total = Number(props.totalRows);
    const perPage = Number(props.perPage);
    return Math.ceil(total / perPage) || 1;
});

const paginatedItems = computed(() => {
    if (!props.noProviderPaging || props.perPage <= 0) {
        return props.items;
    }

    const start = (Number(props.currentPage) - 1) * Number(props.perPage);
    const end = start + Number(props.perPage);
    return props.items.slice(start, end);
});

const filterValue = ref('');

const filterItems = (items: Record<string, unknown>[]) => {
    if (!props.noProviderFiltering || !filterValue.value) {
        return items;
    }

    const searchValue = filterValue.value.toLowerCase();
    const fields = props.filterIncludedFields.length > 0
        ? props.filterIncludedFields
        : Object.keys(items[0] || {}).filter(field => !props.filterIgnoredFields.includes(field));

    if (props.filterFunction) {
        return props.filterFunction(items, searchValue);
    }

    return items.filter(item => {
        return fields.some(field => {
            const value = item[field];
            if (value == null) {
                return false;
            }
            return String(value).toLowerCase().includes(searchValue);
        });
    });
};

const onFilterInput = debounce(() => {
    const filtered = filterItems(props.items);
    emit('filtered', filtered);
}, Number(props.filterDebounce));

const filteredItems = computed(() => filterItems(props.items));

// Update displayItems to use filtered items
const displayItems = computed(() => {
    const items = props.noProviderFiltering ? filteredItems.value : props.items;
    return props.noProviderPaging ? paginatedItems.value : items;
});

const stickyHeaderStyle = computed(() => {
    if (!props.stickyHeader) {
        return {};
    }

    const maxHeight = typeof props.stickyHeader === 'string'
        ? props.stickyHeader
        : '300px';

    return {
        maxHeight,
        overflowY: 'auto',
    };
});

const onPerPageChange = (event: Event) => {
    const value = Number((event.target as HTMLSelectElement).value);
    emit('update:perPage', value);
    emit('pagination', {
        currentPage: Number(props.currentPage),
        perPage: value,
    });
};

const onPageChange = (event: Event) => {
    const value = Number((event.target as HTMLSelectElement).value);
    emit('update:currentPage', value);
    emit('pagination', {
        currentPage: value,
        perPage: Number(props.perPage),
    });
};
</script>

<style lang="scss">
.table {
    position: relative;

    &.table-busy {
        opacity: 0.6;
        pointer-events: none;
    }
}

.table-busy-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
}

.table-busy-spinner {
    background: white;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

// Transition classes
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>

<docs>
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
</docs>
