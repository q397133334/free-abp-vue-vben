import type { VxeGridProps } from '../components/vxe-table/types';

import { h } from 'vue';

import { Button, Image } from 'ant-design-vue';

import { setupVbenVxeTable } from '../components/vxe-table';
import { useVbenVxeGrid as useVxeGrid } from '../components/vxe-table/use-vxe-grid';
import { useVbenForm } from './form';

function useVbenVxeGrid(options: VxeGridProps) {
  setupVbenVxeTable({
    configVxeTable: (vxeUI) => {
      vxeUI.setConfig({
        grid: {
          align: 'center',
          border: false,
          columnConfig: {
            resizable: true,
          },
          formConfig: {
            // 全局禁用vxe-table的表单配置，使用formOptions
            enabled: false,
          },
          height: 'auto',
          minHeight: 180,
          pagerConfig: {
            pageSize: 10,
            pageSizes: [10, 25, 50, 100],
          },
          proxyConfig: {
            autoLoad: true,
            response: {
              result: 'items',
              total: 'totalCount',
              list: 'items',
            },
            showActiveMsg: true,
            showResponseMsg: false,
          },
          round: true,
          showOverflow: true,
          size: 'small',
          toolbarConfig: {
            // custom: true,
            // export: true,
            // import: true,
            refresh: true,
            zoom: true,
          },
        },
      });

      // 表格配置项可以用 cellRender: { name: 'CellImage' },
      !vxeUI.renderer.get('CellImage') &&
        vxeUI.renderer.add('CellImage', {
          renderTableDefault(_renderOpts, params) {
            const { column, row } = params;
            return h(Image, { src: row[column.field] });
          },
        });

      // 表格配置项可以用 cellRender: { name: 'CellLink' },
      !vxeUI.renderer.get('CellLink') &&
        vxeUI.renderer.add('CellLink', {
          renderTableDefault(renderOpts) {
            const { props } = renderOpts;
            return h(
              Button,
              { size: 'small', type: 'link' },
              { default: () => props?.text },
            );
          },
        });

      // 这里可以自行扩展 vxe-table 的全局配置，比如自定义格式化
      // vxeUI.formats.add
    },
    useVbenForm,
  });
  return useVxeGrid(options);
}

export { useVbenVxeGrid };
