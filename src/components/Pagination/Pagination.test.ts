import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Pagination from './Pagination.vue';

describe('Pagination', () => {
    const createWrapper = (props = {}) => {
        return mount(Pagination, {
            props: {
                modelValue: 1,
                totalPages: 10,
                ...props
            }
        });
    };

    it('renders correctly with default props', () => {
        const wrapper = createWrapper();
        expect(wrapper.find('.pagination').exists()).toBe(true);
        expect(wrapper.findAll('.page-item')).toHaveLength(7); // First, Prev, 1, 2, 3, 4, 5, Next, Last
    });

    it('disables first and prev buttons when on first page', () => {
        const wrapper = createWrapper({ modelValue: 1 });
        const firstButton = wrapper.find('.page-item:first-child');
        const prevButton = wrapper.find('.page-item:nth-child(2)');
        
        expect(firstButton.classes('disabled')).toBe(true);
        expect(prevButton.classes('disabled')).toBe(true);
    });

    it('disables next and last buttons when on last page', () => {
        const wrapper = createWrapper({ modelValue: 10 });
        const nextButton = wrapper.find('.page-item:nth-last-child(2)');
        const lastButton = wrapper.find('.page-item:last-child');
        
        expect(nextButton.classes('disabled')).toBe(true);
        expect(lastButton.classes('disabled')).toBe(true);
    });

    it('emits update:modelValue when clicking a page number', async () => {
        const wrapper = createWrapper();
        const pageButton = wrapper.find('.page-item:nth-child(4)'); // Page 2
        
        await pageButton.find('a').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')[0]).toEqual([2]);
    });

    it('does not emit update:modelValue when clicking current page', async () => {
        const wrapper = createWrapper();
        const currentPageButton = wrapper.find('.page-item:nth-child(3)'); // Page 1
        
        await currentPageButton.find('a').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });

    it('applies size class when size prop is provided', () => {
        const wrapper = createWrapper({ size: 'lg' });
        expect(wrapper.find('.pagination').classes('pagination-lg')).toBe(true);
    });

    it('applies alignment class when align prop is provided', () => {
        const wrapper = createWrapper({ align: 'center' });
        expect(wrapper.find('.pagination').classes('justify-content-center')).toBe(true);
    });

    it('hides first/last buttons when showFirstLast is false', () => {
        const wrapper = createWrapper({ showFirstLast: false });
        expect(wrapper.findAll('.page-item')).toHaveLength(7); // Prev, 1, 2, 3, 4, 5, Next
    });

    it('shows correct number of page links based on limit prop', () => {
        const wrapper = createWrapper({ limit: 3 });
        const pageLinks = wrapper.findAll('.page-item').filter(item => 
            !item.classes('disabled') && 
            !item.find('span[aria-hidden="true"]').exists()
        );
        expect(pageLinks).toHaveLength(3);
    });
}); 