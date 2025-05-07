<template>
    <nav :aria-label="ariaLabel" :aria-controls="ariaControls">
        <ul class="pagination" :class="classes">
            <!-- First page link -->
            <li v-if="!hideGotoEndButtons" class="page-item" :class="[firstClass, { disabled: disabled || currentPage === 1 }]">
                <a 
                    class="page-link" 
                    href="#" 
                    @click.prevent="onPageClick(1)" 
                    :aria-label="labelFirstPage"
                >
                    <slot name="first-text">
                        <span v-if="!firstNumber" aria-hidden="true">{{ firstText }}</span>
                        <span v-else>1</span>
                    </slot>
                </a>
            </li>

            <!-- Previous page link -->
            <li class="page-item" :class="[prevClass, { disabled: disabled || currentPage === 1 }]">
                <a 
                    class="page-link" 
                    href="#" 
                    @click.prevent="onPageClick(currentPage - 1)" 
                    :aria-label="labelPrevPage"
                >
                    <slot name="prev-text">
                        <span aria-hidden="true">{{ prevText }}</span>
                    </slot>
                </a>
            </li>

            <!-- Page numbers -->
            <template v-for="(page, index) in displayedPages" :key="page">
                <li v-if="page !== '...'" class="page-item" :class="[pageClass, { active: page === currentPage }]">
                    <a 
                        class="page-link" 
                        href="#" 
                        @click.prevent="onPageClick(page)"
                        :aria-label="typeof labelPage === 'function' ? labelPage(page) : `${labelPage} ${page}`"
                    >
                        <slot name="page" :page="page">
                            {{ page }}
                        </slot>
                    </a>
                </li>
                <li v-else class="page-item disabled" :class="ellipsisClass">
                    <span class="page-link">
                        <slot name="ellipsis-text">{{ ellipsisText }}</slot>
                    </span>
                </li>
            </template>

            <!-- Next page link -->
            <li class="page-item" :class="[nextClass, { disabled: disabled || currentPage === totalPages }]">
                <a 
                    class="page-link" 
                    href="#" 
                    @click.prevent="onPageClick(currentPage + 1)" 
                    :aria-label="labelNextPage"
                >
                    <slot name="next-text">
                        <span aria-hidden="true">{{ nextText }}</span>
                    </slot>
                </a>
            </li>

            <!-- Last page link -->
            <li v-if="!hideGotoEndButtons" class="page-item" :class="[lastClass, { disabled: disabled || currentPage === totalPages }]">
                <a 
                    class="page-link" 
                    href="#" 
                    @click.prevent="onPageClick(totalPages)" 
                    :aria-label="labelLastPage"
                >
                    <slot name="last-text">
                        <span v-if="!lastNumber" aria-hidden="true">{{ lastText }}</span>
                        <span v-else>{{ totalPages }}</span>
                    </slot>
                </a>
            </li>
        </ul>
    </nav>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import useClasses from '@/composables/useClasses';

const props = defineProps({
    /**
     * Current page number
     */
    modelValue: {
        type: [Number, String, Boolean],
        default: null
    },
    /**
     * Total number of rows in the dataset
     */
    totalRows: {
        type: [Number, String],
        default: 0
    },
    /**
     * Number of rows per page
     */
    perPage: {
        type: [Number, String],
        default: 20
    },
    /**
     * Maximum number of buttons to show
     */
    limit: {
        type: [Number, String],
        default: 5
    },
    /**
     * Alignment of the page buttons
     */
    align: {
        type: String,
        default: 'left',
        validator: (value: string) => ['left', 'right', 'center', 'fill', 'start', 'end'].includes(value)
    },
    /**
     * Size of the rendered buttons
     */
    size: {
        type: String,
        default: '',
        validator: (value: string) => ['', 'sm', 'md', 'lg'].includes(value)
    },
    /**
     * Applies pill styling to the pagination buttons
     */
    pills: {
        type: Boolean,
        default: false
    },
    /**
     * When set to true, disables the component's functionality
     */
    disabled: {
        type: Boolean,
        default: false
    },
    /**
     * Hides the goto first and goto last page buttons
     */
    hideGotoEndButtons: {
        type: Boolean,
        default: false
    },
    /**
     * Do not show ellipsis buttons
     */
    hideEllipsis: {
        type: Boolean,
        default: false
    },
    /**
     * Display first page number instead of Goto First button
     */
    firstNumber: {
        type: Boolean,
        default: false
    },
    /**
     * Display last page number instead of Goto Last button
     */
    lastNumber: {
        type: Boolean,
        default: false
    },
    /**
     * Content to place in the goto first page button
     */
    firstText: {
        type: String,
        default: '«'
    },
    /**
     * Content to place in the goto previous page button
     */
    prevText: {
        type: String,
        default: '‹'
    },
    /**
     * Content to place in the goto next page button
     */
    nextText: {
        type: String,
        default: '›'
    },
    /**
     * Content to place in the goto last page button
     */
    lastText: {
        type: String,
        default: '»'
    },
    /**
     * Content to place in the ellipsis placeholder
     */
    ellipsisText: {
        type: String,
        default: '…'
    },
    /**
     * Value to place in the 'aria-label' attribute of the pagination control
     */
    ariaLabel: {
        type: String,
        default: 'Pagination'
    },
    /**
     * If this component controls another component or element, set this to the ID
     */
    ariaControls: {
        type: String,
        default: ''
    },
    /**
     * Value to place in the 'aria-label' attribute of the goto first page button
     */
    labelFirstPage: {
        type: String,
        default: 'Go to first page'
    },
    /**
     * Value to place in the 'aria-label' attribute of the goto previous page button
     */
    labelPrevPage: {
        type: String,
        default: 'Go to previous page'
    },
    /**
     * Value to place in the 'aria-label' attribute of the goto page button
     */
    labelPage: {
        type: [Function, String],
        default: 'Go to page'
    },
    /**
     * Value to place in the 'aria-label' attribute of the goto next page button
     */
    labelNextPage: {
        type: String,
        default: 'Go to next page'
    },
    /**
     * Value to place in the 'aria-label' attribute of the goto last page button
     */
    labelLastPage: {
        type: String,
        default: 'Go to last page'
    },
    /**
     * Class(es) to apply to the 'Go to first page' button
     */
    firstClass: {
        type: [Array, Object, String],
        default: ''
    },
    /**
     * Class(es) to apply to the 'Go to previous page' button
     */
    prevClass: {
        type: [Array, Object, String],
        default: ''
    },
    /**
     * Class(es) to apply to the 'Go to page #' buttons
     */
    pageClass: {
        type: [Array, Object, String],
        default: ''
    },
    /**
     * Class(es) to apply to the 'Go to next page' button
     */
    nextClass: {
        type: [Array, Object, String],
        default: ''
    },
    /**
     * Class(es) to apply to the 'Go to last page' button
     */
    lastClass: {
        type: [Array, Object, String],
        default: ''
    },
    /**
     * Class(es) to apply to the 'ellipsis' placeholders
     */
    ellipsisClass: {
        type: [Array, Object, String],
        default: ''
    }
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
    (e: 'change', page: number): void
    (e: 'input', page: number | null): void
    (e: 'page-click', bvEvent: { preventDefault: () => void }, page: number): void
}>();

const currentPage = computed(() => {
    const value = props.modelValue;
    if (typeof value === 'boolean') return 1;
    return Number(value) || 1;
});

const totalPages = computed(() => {
    const total = Number(props.totalRows);
    const perPage = Number(props.perPage);
    return Math.ceil(total / perPage) || 1;
});

const displayedPages = computed(() => {
    const pages: (number | string)[] = [];
    const limit = Number(props.limit);
    const halfLimit = Math.floor(limit / 2);
    
    let start = Math.max(1, currentPage.value - halfLimit);
    let end = Math.min(totalPages.value, start + limit - 1);
    
    // Adjust start if we're near the end
    if (end === totalPages.value) {
        start = Math.max(1, end - limit + 1);
    }
    
    // Add first page
    if (start > 1) {
        pages.push(1);
        if (start > 2 && !props.hideEllipsis) {
            pages.push('...');
        }
    }
    
    // Add middle pages
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    
    // Add last page
    if (end < totalPages.value) {
        if (end < totalPages.value - 1 && !props.hideEllipsis) {
            pages.push('...');
        }
        pages.push(totalPages.value);
    }
    
    return pages;
});

const onPageClick = (page: number) => {
    if (!props.disabled && page >= 1 && page <= totalPages.value && page !== currentPage.value) {
        const bvEvent = {
            preventDefault: () => {}
        };
        
        emit('page-click', bvEvent, page);
        
        if (!bvEvent.preventDefault) {
            emit('update:modelValue', page);
            emit('change', page);
            emit('input', page);
        }
    }
};

const { classes } = useClasses(computed(() => [
    props.size ? `pagination-${props.size}` : undefined,
    props.pills ? 'pagination-pills' : undefined,
    props.align === 'fill' ? 'pagination-fill' : undefined,
    ['start', 'left'].includes(props.align) ? 'justify-content-start' : undefined,
    props.align === 'center' ? 'justify-content-center' : undefined,
    ['end', 'right'].includes(props.align) ? 'justify-content-end' : undefined
]));
</script>

<docs>
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
</docs> 